-- Migration 002: Seed Data
-- Populates the database with default user, goals, and sample reading logs

BEGIN;

INSERT INTO users (id, username, email, current_streak)
VALUES (1, 'testuser', 'test@example.com', 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO goals (id, name, type, target) VALUES
  (1, 'Read 10 minutes', 'minutes', 10),
  (2, 'Read 20 pages', 'pages', 20),
  (3, 'Start 1 new book', 'books_started', 1),
  (4, 'Finish 1 book', 'books_finished', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_goal_progress (user_id, goal_id, current_progress, completed) VALUES
  (1, 1, 0, false),
  (1, 2, 0, false),
  (1, 3, 0, false),
  (1, 4, 0, false)
ON CONFLICT (user_id, goal_id) DO NOTHING;

INSERT INTO user_avatars (user_id, animal_id, background_id)
VALUES (1, 'lion', 'bg_default')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO reading_logs (user_id, book_title, minutes_read, pages_read, date, finished) VALUES
  (1, 'The Great Gatsby', 30, 15, '2024-02-10', false),
  (1, 'The Great Gatsby', 45, 20, '2024-02-11', false),
  (1, '1984', 60, 25, '2024-02-12', true),
  (1, 'To Kill a Mockingbird', 25, 10, '2024-02-13', false)
ON CONFLICT DO NOTHING;

COMMIT;
