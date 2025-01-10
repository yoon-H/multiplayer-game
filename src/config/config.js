import { CLIENT_VERSION, PORT, HOST } from '../constants.js/env.js';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants.js/header.js';

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
