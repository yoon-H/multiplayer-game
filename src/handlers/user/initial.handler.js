import HANDLER_IDS, { RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';

const initialHandler = async ({ socket, userId, payload }) => {
  const { deviceId } = payload;

  addUser(socket, deviceId);

  const initialResponse = createResponse(
    HANDLER_IDS.INITIAL,
    RESPONSE_SUCCESS_CODE,
    { userId: deviceId },
    deviceId,
  );

  socket, write(initialResponse);
};

export default initialHandler;
