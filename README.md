# SpeciWise

SpeciWise is an AI-powered career recommendation platform for Computer Science and engineering students. It helps students discover suitable domains, branches, and specializations through structured assessments, weighted scoring, and data-driven recommendations.

The project is built as a full-stack web application with a React frontend, Supabase authentication/database support, and an optional Express backend for quiz scoring experiments.

## Features

- Multi-stage career assessment flow
- Domain discovery test for broad career direction
- Engineering branch recommendation flow
- Computer Science specialization recommendation
- Electrical/Electronics specialization recommendation
- Weighted Interest Scoring Model for result generation
- Supabase authentication with sign in and sign up
- Quiz session tracking and result persistence
- Responsive React UI with animated visual effects
- Portfolio-ready result pages with rankings, fit scores, and career paths

## Tech Stack

### Frontend

- React
- Create React App
- Supabase JS client
- CSS
- Recharts

### Backend

- Node.js
- Express
- Sequelize
- SQLite for local development

### Database/Auth

- Supabase Auth
- Supabase Postgres schema for profiles, quiz sessions, quiz results, and analytics events

## Project Structure

```txt
SpeciWise/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── speciwise.sqlite
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── SpeciWiseApp.jsx
│   │   ├── supabaseClient.js
│   │   └── components/
│   ├── schema.sql
│   └── package.json
├── README.md
└── package.json
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/speciwise.git
cd speciwise
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env.local` file inside the `frontend` folder:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
```

Note: Create React App reads environment files from the `frontend` root, not from `frontend/src`.

### 4. Run the frontend

```bash
npm start
```

The frontend will run at:

```txt
http://localhost:3000
```

## Optional Backend Setup

The current frontend mainly uses Supabase directly. The Express backend is available for local API-based scoring experiments.

### Install backend dependencies

```bash
cd backend
npm install
```

### Run backend

```bash
node server.js
```

The backend runs at:

```txt
http://localhost:8080
```

### Backend API Endpoints

```txt
POST /api/suggest
GET  /api/results
```

## Supabase Database Setup

The Supabase schema is available at:

```txt
frontend/schema.sql
```

Run this SQL file in the Supabase SQL editor to create:

- `profiles`
- `quiz_sessions`
- `quiz_results`
- `analytics_events`
- Row Level Security policies
- Session summary view

## Recommendation Model

SpeciWise uses a Weighted Interest Scoring Model.

Each quiz option carries weighted values for one or more career categories. When a student answers the assessment, the app:

1. Collects selected answers.
2. Adds the weights for each matching category.
3. Sorts categories by total score.
4. Converts raw scores into fit percentages.
5. Displays the top recommendation, runner-up, and full ranking.

This makes the result explainable and easier to improve compared with a black-box recommendation.

## Available Scripts

### Frontend

```bash
npm start
npm run build
npm test
```

### Backend

```bash
node server.js
```

## Deployment

### Frontend

Recommended platforms:

- Vercel
- Netlify

Build command:

```bash
npm run build
```

Output folder:

```txt
build
```

Required environment variables:

```env
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_KEY
```

### Backend

Recommended platforms:

- Render
- Railway

Before deploying the backend, add a production-ready start script and move from local SQLite to a hosted database if persistence is required.

### Database

Recommended:

- Supabase Postgres

Use `frontend/schema.sql` to initialize the database schema.

## Screenshots

Add screenshots before publishing:

```txt
screenshots/
├── landing.png
├── quiz.png
├── domain-result.png
├── branch-result.png
└── specialization-result.png
```

## GitHub Readiness Checklist

- Add a root `.gitignore`
- Do not commit `node_modules`
- Do not commit real `.env` files
- Do not commit local SQLite database files
- Add `.env.example`
- Add screenshots
- Update live demo link
- Add project license

## Future Improvements

- Move scoring data into separate config files
- Split `SpeciWiseApp.jsx` into reusable components
- Add automated tests for scoring logic
- Add clearer result explanations for each recommendation
- Add admin analytics dashboard
- Add downloadable result report
- Add a public demo mode without login

## Author

Built by Yash Kumar as a portfolio project for career guidance, AI-assisted recommendations, and full-stack web development.

## License

Add a license before publishing publicly.
