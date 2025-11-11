-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    boombucks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы стримов
CREATE TABLE streams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    category VARCHAR(100),
    is_live BOOLEAN DEFAULT FALSE,
    viewers_count INTEGER DEFAULT 0,
    tts_enabled BOOLEAN DEFAULT FALSE,
    tts_voice VARCHAR(20) DEFAULT 'male1',
    stream_key VARCHAR(100) UNIQUE,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы донатов
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    stream_id INTEGER REFERENCES streams(id),
    from_user_id INTEGER REFERENCES users(id),
    amount INTEGER NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы сообщений чата
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    stream_id INTEGER REFERENCES streams(id),
    user_id INTEGER REFERENCES users(id),
    username VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для производительности
CREATE INDEX idx_streams_user_id ON streams(user_id);
CREATE INDEX idx_streams_is_live ON streams(is_live);
CREATE INDEX idx_donations_stream_id ON donations(stream_id);
CREATE INDEX idx_chat_messages_stream_id ON chat_messages(stream_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);