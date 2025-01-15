CREATE TABLE IF NOT EXISTS user
(
    id         VARCHAR(36) PRIMARY KEY,
    device_id  VARCHAR(255) UNIQUE NOT NULL,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_end
(
    id    VARCHAR(36) PRIMARY KEY,
    user_id    VARCHAR(36) NOT NULL,
    player_id INT NOT NULL,
    loc_x      float DEFAULT 0,
    loc_y      float DEFAULT 0,
    score      INT       DEFAULT 0,
    end_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id)
);