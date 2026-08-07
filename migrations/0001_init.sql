-- Migration number: 0001 	 users + sessions
--
-- Ported from the iscphm site's D1 auth system. Unlike ISCPHM there is no
-- public membership here — accounts exist only so editors can reach /admin,
-- so the members-only columns (work_email, imc_number) are gone and `role`
-- is present from the start.
--
-- There is no signup UI. Create the first admin by hand:
--   npx wrangler d1 execute changingireland-db --local --command \
--     "INSERT INTO users (username, email, first_name, last_name, password_hash, role) VALUES (...)"

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
