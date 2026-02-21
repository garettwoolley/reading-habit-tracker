# Reading Habit Tracker

## App Summary

Reading Habit Tracker is a mobile-first web application designed to help users build and maintain consistent reading habits. The app is specifically designed for individuals who struggle with reading or are developing their literacy skills, featuring text-to-speech functionality throughout the interface to support accessibility. Users can track their daily reading progress through simple logging, work toward fixed reading goals (such as reading 10 minutes or 20 pages), and customize their experience with animal avatars that replace traditional profile photos. The app provides social motivation through a read-only friends feature, allowing users to see their friends' progress without the distraction of messaging. By gamifying reading through goals, streaks, and avatar customization, the app makes building a reading habit engaging and accessible for users of all reading levels.

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **pg** - PostgreSQL client library

### Database
- **PostgreSQL** - Relational database

## Architecture Diagram

```
┌─────────────┐
│   Browser   │
│   (User)    │
└──────┬──────┘
       │
       │ HTTP Requests (GET, POST)
       ▼
┌─────────────────────────────────────┐
│         React Frontend               │
│      (http://localhost:5173)          │
└──────┬───────────────────────────────┘
       │
       │ REST API Calls
       │ /api/reading-logs
       ▼
┌─────────────────────────────────────┐
│      Express Backend Server          │
│      (http://localhost:3001)         │
└──────┬───────────────────────────────┘
       │
       │ SQL Queries
       ▼
┌─────────────────────────────────────┐
│      PostgreSQL Database             │
│  - users                             │
│  - reading_logs                      │
│  - goals                             │
│  - user_goal_progress                │
│  - user_avatars                      │
│  - user_accessories                 │
│  - friendships                       │
└─────────────────────────────────────┘
```

**Flow:**
1. User interacts with React frontend
2. Frontend sends HTTP request to Express backend
3. Backend queries PostgreSQL database
4. Database returns data
5. Backend sends JSON response to frontend
6. Frontend updates UI

## Prerequisites

Install these before starting:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download: https://www.postgresql.org/download/
   - Verify: `psql --version`

3. **Git**
   - Download: https://git-scm.com/downloads
   - Verify: `git --version`

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/garettwoolley/reading-habit-tracker.git
cd reading-habit-tracker
```

### 2. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for root, frontend, and backend.

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE reading_habit_tracker;

# Exit
\q
```

### 4. Run Database Scripts

```bash
# Create tables
psql -U postgres -d reading_habit_tracker -f db/schema.sql

# Add sample data
psql -U postgres -d reading_habit_tracker -f db/seed.sql
```

**Note:** Replace `postgres` with your PostgreSQL username if different.

### 5. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp backend/.env.example backend/.env
```

Then edit `backend/.env`:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/reading_habit_tracker
PORT=3001
```

Replace `your_username` and `your_password` with your PostgreSQL credentials.

## Running the Application

### Run Both Frontend and Backend

```bash
npm run dev
```

This starts:
- Backend: http://localhost:3001
- Frontend: http://localhost:5173

Open http://localhost:5173 in your browser.

### Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Verifying the Vertical Slice

**Current Status:** The frontend is connected to the backend API. The "Save Log" button saves reading logs to PostgreSQL and loads them from the database on page load.

### Steps to Verify

1. Start the application: `npm run dev`
2. Navigate to Log Reading page
3. Fill out the form (book title, minutes, pages, date)
4. Click "Save Log" button
5. **Verify Database:** Check the database contains the new record:
   ```bash
   psql -U postgres -d reading_habit_tracker
   SELECT * FROM reading_logs ORDER BY created_at DESC LIMIT 1;
   ```
6. **Verify Persistence:** Refresh the page - data should still be visible (loaded from database)
7. **Verify UI Update:** The new reading log should appear in the UI immediately after saving

## Assignment: "One Working Button" - COMPLETE

**Assignment Requirement:** Pick one existing button and make it:
1. Connect to backend server logic
2. Update something in the database
3. Return the updated value to the frontend
4. Show the updated value in the UI

**Selected Button:** "Save Log" button on the Log Reading page

**What was implemented:**

- `frontend/src/context/AppContext.jsx` — replaced localStorage with Axios API calls:
  - On mount: `GET /api/reading-logs` fetches all logs from the database
  - On save: `POST /api/reading-logs` sends the new log to the backend
- `frontend/src/pages/LogReading.jsx` — `handleSubmit` now awaits the API call before navigating
- `backend/.env.example` — added as a template for the required environment variables (the actual `backend/.env` is gitignored and must be created locally)

**All requirements met:**
- ✅ Connect to backend: Frontend calls `POST /api/reading-logs`
- ✅ Update database: Backend inserts into `reading_logs` table
- ✅ Return updated value: Backend returns the created log as JSON
- ✅ Show in UI: Frontend maps the response and updates React state

## Current State

✅ **Done:**
- Database schema (7 tables) in `db/schema.sql`
- Seed data in `db/seed.sql`
- Backend API code (Express routes and controllers)
- Frontend connected to backend via Axios
- "Save Log" button saves to PostgreSQL database
- Data persists across page refreshes (loaded from database, not localStorage)
- `backend/.env.example` provided as setup template

## Project Structure

```
reading-habit-tracker/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/   # AppContext.jsx - uses Axios API calls
│   │   └── pages/
│   └── package.json
├── backend/           # Express backend
│   ├── routes/        # API endpoints
│   ├── controllers/   # Request handlers
│   ├── db/            # Database connection
│   ├── .env.example   # Environment variable template
│   └── server.js
├── db/                # SQL scripts
│   ├── schema.sql     # Creates tables
│   └── seed.sql       # Sample data
└── README.md
```

## Troubleshooting

**"Command not found" errors:** Make sure Node.js, PostgreSQL, and Git are installed and in your PATH.

**Database connection errors:** 
- Check PostgreSQL is running
- Verify `.env` file has correct username and password
- Make sure database `reading_habit_tracker` exists

**Port already in use:** Close other programs using ports 3001 or 5173, or change ports in config files.

**npm install fails:** 
- Check internet connection
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
