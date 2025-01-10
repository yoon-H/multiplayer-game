import { PACKET_TYPE } from '../constants.js/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { config } from '../config/config.js';

export const onData = (socket) => (data) => {
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

      console.log(`length : ${length}`);
      console.log(`packetType: ${packetType}`);
      console.log(packet);

      switch (packetType) {
        case PACKET_TYPE.PING:
          break;
        case PACKET_TYPE.NORMAL:
          const { handlerId, userId, payload } = packetParser(data);

          console.log('handerId:', handlerId);
          console.log('userId:', userId);
          console.log('payload:', payload);
      }
    } else {
      // 전체 패킷이 도착하지 않아서 break
      break;
    }
  }

  console.log(data);
};
