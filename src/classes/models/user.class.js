import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket, playerId) {
    this.id = id;
    this.gameId = '';
    this.socket = socket;
    this.playerId = playerId;
    this.latency = 0;
    this.speed = 0;
    this.dx = 0;
    this.dy = 0;
    this.x = 0;
    this.y = 0;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
  }

  getPlayerId() {
    return this.playerId;
  }

  setPlayerId(id) {
    this.playerId = id;
  }

  setGameId(id) {
    this.gameId = id;
  }

  getGameId() {
    return this.gameId;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  initInfo(x, y, playerId) {
    updatePosition(x, y);
    this.playerId = playerId;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  setInput(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  // 서버 위치 업데이트
  updatePosition() {
    const now = Date.now();
    const time = (now - this.lastUpdateTime) / 1000;

    this.x = this.x + this.speed * this.dx * time;
    this.y = this.y + this.speed * this.dy * time;

    this.lastUpdateTime = now;
  }

  getNextSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();

    console.log(`${this.id}: ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산
    const distance = this.speed * timeDiff;

    // x, y 축에서 이동한 거리 계산
    return {
      x: this.x + this.dx * distance,
      y: this.y + this.dy * distance,
    };
  }
}

export default User;
