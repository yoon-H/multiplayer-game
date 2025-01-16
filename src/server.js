import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';

const PORT = 5555;

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log(server.address());
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
