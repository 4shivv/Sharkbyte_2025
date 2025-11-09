# AgentGuard - Installation and Setup Guide

## Prerequisites

- Node.js 18+
- npm 9+
- Git

## Project Overview

AgentGuard is a security platform with a React frontend and Node.js/Express backend for red-teaming AI agent prompts.

```
Sharkbyte_2025/
├── frontend/          # React SPA
├── backend/           # Express API + PostgreSQL
└── README.md
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs:
- Express.js - Web framework
- Prisma - ORM for PostgreSQL
- bcrypt - Password hashing (cost factor: 10)
- TypeScript - Type safety
- CORS - Cross-origin support
- dotenv - Environment variable management

### 2. Generate Prisma Client

```bash
cd backend
npx prisma generate
```

This generates the Prisma client from the schema at `backend/generated/prisma/`.

### 3. Verify Database Connection

The database URL is configured in `backend/.env` using Prisma Postgres. Verify the connection:

```bash
cd backend
npx prisma db push
```

If the database is already in sync, you'll see: `The database is already in sync with the Prisma schema.`

### 5. View/Manage Database (Optional)

To view, edit, add, or delete users in the database using a GUI:

```bash
cd backend
npx prisma studio
```

This opens Prisma Studio at **http://localhost:5555** where you can:
- View all users
- Add new users
- Edit existing users
- Delete users

### 4. Start Backend Server

```bash
cd backend
npm start
```

Backend server runs on: **http://localhost:3001**

You should see: `Server running on http://localhost:3001`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- React 19 - UI framework
- Vite 7 - Build tool
- React Router - Navigation
- Tailwind CSS - Styling
- FontAwesome - Icons

### 2. Start Development Server

```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

You should see: `Local: http://localhost:5173`


## Full Setup Commands

To quickly start all services, run these in separate terminals:

**One-time setup (run once):**
```bash
# Backend setup
cd backend
npm install
npx prisma generate
npx prisma db push

# Frontend setup
cd frontend
npm install
```

**Then, to start services in separate terminals:**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Backend will be available at: **http://localhost:3001**
Frontend will be available at: **http://localhost:5173**

## Common Issues

### Backend won't start
- Check port 3001 is available: `lsof -i :3001`
- Ensure Prisma client is generated: `npx prisma generate`
- Verify database connection: `npx prisma db push`
- Check `.env` file has DATABASE_URL

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check browser console (F12) for errors
- CORS is configured for localhost:5173
- Ensure backend health check works: `curl http://localhost:3001/health`

### Prisma client not found
- Regenerate Prisma client: `npx prisma generate`
- Ensure TypeScript config allows generated folder
- Delete and regenerate: `rm -rf generated/ && npx prisma generate`

### Database connection error
- Verify DATABASE_URL in `backend/.env`
- Push schema to database: `npx prisma db push`
- Check database is reachable on configured URL
- If error persists, delete `.env` and reconfigure DATABASE_URL

## Environment Variables

Backend reads from `backend/.env`:
```
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."
PORT=3001
FRONTEND_URL=http://localhost:5173
```

These are pre-configured. No additional setup needed.

