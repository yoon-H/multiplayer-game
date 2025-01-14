import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

export const addGameSession = (id) => {
  const session = new Game(id);
  gameSessions.set(id, session);
  return session;
};

export const removeGameSession = (id) => {
  const game = gameSessions.get(id);
  gameSessions.delete(id);

  return game;
};

export const getGameSession = (id) => {
  console.log(id);
  console.log(gameSessions);

  return gameSessions.get(id);
};

export const getAllGameSessions = () => {
  return gameSessions;
};
