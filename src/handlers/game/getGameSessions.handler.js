import { getAllGameSessions } from '../../session/game.session.js';
import { handleError } from '../../utils/error/error.handler.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';

const getGameSessionsHandler = ({ socket, userId, payload }) => {
  try {
    const gameSessions = getAllGameSessions();

    let gameInfos = [];
    gameSessions.forEach((item) => {
      gameInfos.push({gameId : item.id, state : item.state});
    });

    const getGameSessionsResponse = createResponse(
      HANDLER_IDS.GET_ALL_GAME_SESSIONS,
      RESPONSE_SUCCESS_CODE,
      { gameInfos, message: '게임 세션들을 받아옵니다.' },
      userId,
    );

    socket.write(getGameSessionsResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default getGameSessionsHandler;
