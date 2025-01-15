import { findGameEndByUserID, createGameEnd, updateGameEnd } from '../../db/user/user.db.js';
import { getGameSession, removeGameSession } from '../../session/game.session.js';
import CustomError from '../../utils/error/customError.js';
import { handleError } from '../../utils/error/error.handler.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { createResponse } from '../../utils/response/createResponse.js';

const endGameHander = async ({ socket, userId, payload }) => {
  try {
    const { gameId, x, y, score } = payload;

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    const gameSession = getGameSession(gameId);
    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임을 찾을 수 없습니다.');
    }

    // 게임 세션에서 유저 제외
    gameSession.removeUser(userId);

    if (gameSession.getState === 'dead') {
      removeGameSession(gameId);
    }

    // 마지막 위치 추가
    let history = await findGameEndByUserID(userId);

    if (!history) {
      await createGameEnd([userId, x, y, score]);
    } else {
      await updateGameEnd([userId, x, y, score]);
    }

    const createGameResponse = createResponse(
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임이 생성되었습니다.' },
      userId,
    );

    socket.write(createGameResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default endGameHander;
