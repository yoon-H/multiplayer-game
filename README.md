# 멀티플레이어 게임 개발

## 기능 설명

1. 방 구조
  - 방을 생성하고 참가할 수 있다.
  - 방에 들어가면 같은 방에 있는 유저들만 볼 수 있다.
  - 최대 인원은 2명이고, 최대 인원을 다 채우면 그 방은 들어갈 수 없으며, 로비에서 새로고침 버튼을 누르면 방의 상태가 빨간색으로 변한다.
  - 서버 생성과 함께 방을 하나 만들기 때문에 아무도 없는 방이 하나 있다.
  - 방을 만들면 바로 그 방에 접속하게 된다.
  - 다른 사람은 버튼을 눌러서 그 방에 접속할 수 있다.
  - 방 안의 마지막 유저가 방을 나오면 그 방은 자동으로 삭제된다.
2. 캐릭터 위치 업데이트
  - 캐릭터의 위치는 서버에서 저장하고, 유저의 속력과 방향에 따라서 0.2초마다 업데이트한다.
  - 클라이언트에서 1/30초 마다 서버에게 입력된 유저의 방향을 알려준다.
  - 서버는 클라이언트에서 해당 정보를 받으면 마지막 업데이트 시간부터 현재까지 이동한 거리를 기존의 방향대로 구해 현재 위치를 저장한 뒤, 전달받은 방향을 덮어씌운다.
  - 그리고 해당 유저가 있는 방 안의 모든 유저의 위치를 추측항법으로 예측해서 클라이언트에 보낸다.
  - 이때 추측항법에 사용되는 레이턴시는 1초마다 보내는 핑을 이용해서 추적한 전체 값 중 가장 큰 값을 사용한다.
  - 클라이언트는 유저들의 위치를 받아 화면에 그린다.
  - 다른 유저의 경우에는 바로 그 위치로 보정하고, 자기 자신일 경우에는 선형 보간으로 해당 위치를 향해 천천히 이동하도록 한다.


## 프로토버프

### Initial

#### 서버 접속 (클라이언트 -> 서버)
``` proto
message InitialPayload {
  string deviceId = 1;      // 기기ID 
  uint32 playerId = 2;      // 플레이어 ID
  float latency = 3;        // 레이턴시
}
```

### Common

#### 기본 패킷 구조 (클라이언트 -> 서버)
``` proto
message CommonPacket {
  uint32 handlerId = 1;     // 핸들러 ID (4바이트)
  string userId = 2;        // 유저 아이디 (uuid)
  string version = 3;       // 클라이언트 버전
  bytes payload = 4;        // 실제 데이터
}
```

#### 핑 패킷 구조 (클라이언트 -> 서버)
``` proto
message Ping {
  int64 timestamp = 1;       // Ping 타임스탬프
}
```
### Game

#### 게임 생성 (클라이언트 -> 서버)
``` proto
message CreateGamePayload {
  int64 timestamp = 1;       // 게임 생성 시각
  uint32 playerId = 2;
  float speed = 3;
}
```

#### 게임 참가 (클라이언트 -> 서버)
``` proto
message JoinGamePayload {
  string gameId = 1;         // 게임 ID (UUID)
  uint32 playerId = 2;       
  float speed = 3;
}
```

#### 캐릭터 방향 알림 (클라이언트 -> 서버)
``` proto
message LocationUpdatePayload {
  string gameId = 1;
  float dx = 2;
  float dy = 3;
}
```

#### 게임 종료 (클라이언트 -> 서버)
``` proto
message EndGamePayload {
  string gameId = 1;
  float x = 2;
  float y = 3;
  uint32 score = 4;
  uint32 playerId = 5;
}
```

#### 게임 세션 정보 (클라이언트 -> 서버)
``` proto
message GetAllGameSessionsPayload {
  int64 timestamp = 1;
}
```

#### 연결 해제 (클라이언트 -> 서버)
``` proto
message DisConnectPacket {}
```

### Response

#### 응답 구조 (서버 -> 클라이언트)
``` proto
message Response {
  uint32 handlerId = 1;         // 핸들러 아이디(4바이트)
  uint32 responseCode = 2;      // 응답코드 TODO
  uint64 timestamp = 3;         // 타임 스탬프
  bytes data = 4;               // 실제 데이터
}
```

### Game Notification

#### 유저들 위치 전달 (서버 -> 클라이언트)
``` proto
message LocationUpdate {
  repeated UserLocation users = 1;
}

message UserLocation {
    string id = 1;          // 유저 아이디
    uint32 playerId = 2;    // 플레이어 아이디(종류)
    float x = 3;            // x 좌표
    float y = 4;            // y 좌표
}
```


## 파일 정리

```
📦src
 ┣ 📂classes
 ┃ ┣ 📂managers
 ┃ ┃ ┣ 📜base.manager.js
 ┃ ┃ ┗ 📜interval.manager.js
 ┃ ┗ 📂models
 ┃ ┃ ┣ 📜game.class.js
 ┃ ┃ ┗ 📜user.class.js
 ┣ 📂config
 ┃ ┗ 📜config.js
 ┣ 📂constants
 ┃ ┣ 📜env.js
 ┃ ┣ 📜handlerIds.js
 ┃ ┗ 📜header.js
 ┣ 📂db
 ┃ ┣ 📂migrations
 ┃ ┃ ┗ 📜createSchemas.js
 ┃ ┣ 📂sql
 ┃ ┃ ┗ 📜user_db.sql
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜user.db.js
 ┃ ┃ ┗ 📜user.queries.js
 ┃ ┗ 📜database.js
 ┣ 📂events
 ┃ ┣ 📜onConnection.js
 ┃ ┣ 📜onData.js
 ┃ ┣ 📜onEnd.js
 ┃ ┗ 📜onError.js
 ┣ 📂handlers
 ┃ ┣ 📂game
 ┃ ┃ ┣ 📜createGame.handler.js         // 게임 생성
 ┃ ┃ ┣ 📜disconnect.handler.js         // 연결 해제
 ┃ ┃ ┣ 📜endGame.handler.js            // 게임 종료
 ┃ ┃ ┣ 📜getGameSessions.handler.js    // 게임 세션 정보 받기
 ┃ ┃ ┣ 📜joinGame.handler.js           // 게임 참가
 ┃ ┃ ┗ 📜updateLocation.handler.js     // 입력 알림 & 세션 내 전체 유저 이동 정보 얻기
 ┃ ┣ 📂user
 ┃ ┃ ┗ 📜initial.handler.js
 ┃ ┗ 📜index.js
 ┣ 📂init
 ┃ ┣ 📜assets.js
 ┃ ┣ 📜index.js
 ┃ ┗ 📜loadProtos.js
 ┣ 📂protobuf  // 통신 페이로드 규약
 ┃ ┣ 📂notification
 ┃ ┃ ┗ 📜game.notification.proto
 ┃ ┣ 📂request
 ┃ ┃ ┣ 📜common.proto
 ┃ ┃ ┗ 📜game.proto
 ┃ ┣ 📂response
 ┃ ┃ ┗ 📜response.proto
 ┃ ┣ 📜initial.proto
 ┃ ┗ 📜packetNames.js
 ┣ 📂session
 ┃ ┣ 📜game.session.js
 ┃ ┣ 📜sessions.js
 ┃ ┗ 📜user.session.js
 ┣ 📂utils
 ┃ ┣ 📂db
 ┃ ┃ ┗ 📜testConnection.js
 ┃ ┣ 📂error
 ┃ ┃ ┣ 📜customError.js
 ┃ ┃ ┣ 📜error.handler.js
 ┃ ┃ ┗ 📜errorCodes.js
 ┃ ┣ 📂notification
 ┃ ┃ ┗ 📜game.notification.js
 ┃ ┣ 📂parser
 ┃ ┃ ┗ 📜packetParser.js
 ┃ ┣ 📂response
 ┃ ┃ ┗ 📜createResponse.js
 ┃ ┣ 📜dateFormatter.js
 ┃ ┗ 📜transformCase.js
 ┗ 📜server.js
```

