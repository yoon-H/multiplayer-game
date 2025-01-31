import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { config } from '../config/config.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { handleError } from '../utils/error/error.handler.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';

export const onData = (socket) => async (data) => {
  // 버퍼에 수신 데이터 추가
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 패킷의 총 헤더 길이
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  // 전체 헤더의 길이만큼 있을 때 패킷 처리하기
  while (socket.buffer.length >= totalHeaderLength) {
    // 패킷 길이 받기
    const length = socket.buffer.readUInt32BE(0);

    // 패킷 타입 받기
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    if (socket.buffer.length >= length) {
      // 패킷 버퍼에서 제거
      const packet = socket.buffer.slice(totalHeaderLength, length);
      socket.buffer = socket.buffer.slice(length);

      try {
        switch (packetType) {
          case PACKET_TYPE.PING:
            {
              const protoMessages = getProtoMessages();
              const Ping = protoMessages.common.Ping;
              const pingMessage = Ping.decode(packet);
              const user = getUserById(socket.userId);
              if (!user) {
                throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
              }
              user.handlePong(pingMessage);
            }
            break;
          case PACKET_TYPE.NORMAL:
            const { handlerId, userId, payload } = packetParser(packet);

            if (!socket.userId) socket.userId = userId;

            const handler = getHandlerById(handlerId);
            await handler({
              socket,
              userId,
              payload,
            });
        }
      } catch (error) {
        handleError(socket, error);
      }
    } else {
      break;
    }
  }
};
