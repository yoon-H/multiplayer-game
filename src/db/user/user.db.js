import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(rows[0]);
};

export const createUser = async (deviceId) => {
  const id = uuidv4();
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);
  return { id, deviceId };
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

export const findGameEndByUserID = async (userId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_GAME_END_BY_USER_ID, [userId]);
  return toCamelCase(rows[0]);
};

export const createGameEnd = async (values) => {
  const id = uuidv4();
  await pools.USER_DB.query(SQL_QUERIES.CREATE_GAME_END, [id, ...values]);
  return;
};

export const updateGameEnd = async (values) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_GAME_END, values);
  return;
};
