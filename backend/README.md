# AgentGuard - Setup Guide

## Prerequisites

- Node.js 18+, PostgreSQL, Redis

**macOS:**
```bash
brew install postgresql@14 redis
brew services start postgresql@14 redis
```

## Environment Variables

**Get Gemini API Key:** https://aistudio.google.com/app/apikey

**backend/.env:**
```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/postgres"
JWT_SECRET="change-this-secret-key"
PORT=3001
FRONTEND_URL="http://localhost:5173"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
REDIS_URL="redis://localhost:6379"
```

**worker/.env:**
```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/postgres"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
REDIS_URL="redis://localhost:6379"
```

**Frontend/.env:**
```env
VITE_API_URL="http://localhost:3001/api"
```

## One-Time Setup

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push

# Worker
cd ../worker
npm install

# Frontend
cd ../Frontend
npm install
```

## Run (3 terminals)

**Terminal 1 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 - Worker:**
```bash
cd worker && npm start
```

**Terminal 3 - Frontend:**
```bash
cd Frontend && npm run dev
```

**Access:** http://localhost:5173

## Verify

```bash
redis-cli ping  # Returns PONG
pg_isready      # Returns "accepting connections"
```

## Database GUI (Optional)

```bash
cd backend
npx prisma studio
```

Opens at **http://localhost:5555** - View/edit users, agents, and scans
