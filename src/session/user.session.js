import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (socket, uuid) => {
  const user = new User(uuid, socket);
  userSessions.set(uuid, user);
  return user;
};

export const removeUser = (id) => {
  const user = getUserById(id);
  userSessions.delete(id);

  return user;
};

export const getUserById = (id) => {
  return userSessions.get(id);
};

export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};
