import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조 디코딩
  const Packet = protoMessages.common.Packet;
  let packet;
  try {
    packet = Packet.decode(data);
  } catch (error) {
    console.log(error);
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.version;

  // 클라이언트 버전 체크
  if (clientVersion !== config.client.version) {
    console.error('클라이언트 버전이 일치하지 않습니다.');
  }

  // 핸들러 ID에 따라 payload 구조를 다르게 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    console.error(`알 수 없는 핸들러 ID: ${handlerId}`);
  }

  const [namesapce, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namesapce][typeName];
  let payload;

  payload = PayloadType.decode(packet.payload);

  // 필드 검증 추가
  const errorMessage = PayloadType.verify(payload);
  if (errorMessage) {
    console.error(`패킷 구조가 일치하지 않습니다: ${errorMessage}`);
  }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    console.error(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
  }

  return { handlerId, userId, payload };
};
