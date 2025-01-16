import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../../session/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/error.handler.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { findGameEndByUserID } from '../../db/user/user.db.js';

const createGameHandler = async ({ socket, userId, payload }) => {
  try {
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);

    let { playerId, speed } = payload;

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    gameSession.addUser(user);

    let x = 0;
    let y = 0;
    const history = await findGameEndByUserID(userId);

    if (history) {
      x = history.locX;
      y = history.locY;
      playerId = history.playerId;
      //console.log(`History playerId: ${history.playerId}`);
    }

    user.setPosition(x, y);
    user.setPlayerId(playerId);
    user.setSpeed(speed);

    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, playerId, x, y, message: '게임이 생성되었습니다.' },
      userId,
    );

    socket.write(createGameResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default createGameHandler;
