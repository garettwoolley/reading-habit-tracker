-- Migration 001: Initial Schema
-- Creates all tables and indexes for the Reading Habit Tracker

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  current_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  target INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reading_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  book_title VARCHAR(255),
  minutes_read INTEGER DEFAULT 0,
  pages_read INTEGER DEFAULT 0,
  date DATE NOT NULL,
  finished BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_goal_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, goal_id)
);

CREATE TABLE IF NOT EXISTS user_avatars (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  animal_id VARCHAR(50) DEFAULT 'lion',
  background_id VARCHAR(50) DEFAULT 'bg_default',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_accessories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  accessory_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, accessory_id)
);

CREATE TABLE IF NOT EXISTS friendships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

CREATE INDEX IF NOT EXISTS idx_reading_logs_user_id ON reading_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_logs_date ON reading_logs(date);
CREATE INDEX IF NOT EXISTS idx_user_goal_progress_user_id ON user_goal_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goal_progress_goal_id ON user_goal_progress(goal_id);

COMMIT;
