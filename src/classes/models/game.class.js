import IntervalManager from '../managers/interval.manager.js';
import {
  gameStartNotification,
  createLocationPacket,
} from '../../utils/notification/game.notification.js';

const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id;
    this.users = new Map();
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 'waiting', 'inProgress', 'dead'
  }

  addUser(user) {
    if (this.users.size >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.set(user.id, user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    this.intervalManager.addUpdatePosition(user.id, user.updatePosition.bind(user), 200);

    if (this.users.size === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getUser(userId) {
    return this.users.get(userId);
  }

  removeUser(userId) {
    this.users.delete(userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.size < MAX_PLAYERS) {
      this.state = 'waiting';
    }

    if (this.users.size <= 0) {
      this.state = 'dead';
    }
  }

  getState() {
    return this.state;
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  startGame() {
    this.state = 'inProgress';
  }

  getAllLocation() {
    const maxLatency = this.getMaxLatency();

    let locationData = [];
    this.users.forEach((user) => {
      const { x, y } = user.calculatePosition(maxLatency);
      const playerId = user.getPlayerId();

      locationData.push({ id: user.id, playerId, x, y });
    });

    return createLocationPacket(locationData);
  }
}

export default Game;
