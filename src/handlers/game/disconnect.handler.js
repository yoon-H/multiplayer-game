import { getGameSession, removeGameSession } from '../../session/game.session.js';
import CustomError from '../../utils/error/customError.js';
import { handleError } from '../../utils/error/error.handler.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getUserById, removeUser } from '../../session/user.session.js';
import { gameSessions, userSessions } from '../../session/sessions.js';

const disconnectHandler = async ({ socket, userId, payload }) => {
  try {
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    const gameId = user.getGameId();

    if (gameId !== '') {
      const gameSession = getGameSession(gameId);

      if (gameSession) {
        // 게임 세션에서 유저 제외
        gameSession.removeUser(userId);

        const gameState = gameSession.getState();
        if (gameState === 'dead') {
          removeGameSession(gameId);
        }
      }
    }

    removeUser(userId);

    socket.destroy();
  } catch (error) {
    handleError(socket, error);
  }
};

export default disconnectHandler;
