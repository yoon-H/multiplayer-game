import { getGameSession } from '../../session/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/error.handler.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getUserById } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { findGameEndByUserID } from '../../db/user/user.db.js';

const joinGameHandler = async ({ socket, userId, payload }) => {
  try {
    const { gameId } = payload;
    let { playerId } = payload;
    const gameSession = getGameSession(gameId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    const existUser = gameSession.getUser(user.id);
    if (!existUser) {
      gameSession.addUser(user);
    }

    let x = 0;
    let y = 0;
    const history = await findGameEndByUserID(userId);

    if (history) {
      x = history.locX;
      y = history.locY;
      playerId = history.playerId;
      //console.log(`History playerId: ${history.playerId}`);
    }

    user.setPlayerId(playerId);

    const joinGameResponse = createResponse(
      HANDLER_IDS.JOIN_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, playerId, x, y, message: '게임에 참가했습니다.' },
      user.id,
    );
    socket.write(joinGameResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default joinGameHandler;
