-- D1 Schema Migration

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    github_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- We'll add a 'user_id' to the 'messages' table later to link messages to users.
ALTER TABLE messages ADD COLUMN user_id INTEGER;