import { CLIENT_VERSION, PORT } from '../constants.js/env';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants.js/header';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalLength: TOTAL_LENGTH,
    packetLength: PACKET_TYPE_LENGTH,
  },
};
