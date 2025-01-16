export const packetNames = {
  initial: {
    InitialPayload: 'initial.InitialPayload',
  },
  notification: {
    LocationUpdate: 'gameNotification.LocationUpdate',
    Start: 'gameNotification.Start',
  },
  common: {
    Packet: 'common.CommonPacket',
    Ping: 'common.Ping',
  },
  response: {
    Response: 'response.Response',
  },
  game: {
    GetAllGameSessionsPayload: 'game.GetAllGameSessionsPayload',
    CreateGamePayload: 'game.CreateGamePayload',
    JoinGamePayload: 'game.JoinGamePayload',
    LocationUpdatePayload: 'game.LocationUpdatePayload',
    EndGamePayload: 'game.EndGamePayload',
  },
};
