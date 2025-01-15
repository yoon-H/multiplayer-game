export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?',
  CREATE_USER: 'INSERT INTO user (id, device_id) VALUES (?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  FIND_GAME_END_BY_USER_ID: 'SELECT * FROM game_end WHERE user_id = ?',
  CREATE_GAME_END:
    'INSERT INTO game_end (id, user_id, player_id, loc_x, loc_y, score) VALUES (?,?,?,?,?,?)',
  UPDATE_GAME_END:
    'UPDATE game_end SET player_id = ?, loc_x = ?, loc_y = ?, score = ?, end_time = CURRENT_TIMESTAMP WHERE user_id = ?',
};
