# AgentGuard - Complete Deployment Guide

## Architecture Overview

```
┌─────────────────────┐
│  Cloudflare Pages   │  ← Frontend (React)
│  (Static Hosting)   │
└──────────┬──────────┘
           │
           ├──────────────────────────────────┐
           │                                  │
           ▼                                  ▼
┌─────────────────────┐           ┌─────────────────────────┐
│ Cloudflare Worker   │           │   Railway/Render        │
│   (Workers AI)      │           │   Backend (Express)     │
│  Llama Pre-Check    │           │   + Gemini AI           │
└─────────────────────┘           └───────────┬─────────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │                   │
                                    ▼                   ▼
                            ┌──────────────┐   ┌──────────────┐
                            │  PostgreSQL  │   │    Redis     │
                            │   Database   │   │  (Job Queue) │
                            └──────────────┘   └──────────────┘
```

---

## Part 1: Deploy Cloudflare Worker (AI Pre-Check)

### Step 1.1: Navigate to Worker Directory
```bash
cd cloudflare-worker
```

### Step 1.2: Login to Cloudflare
```bash
wrangler login
# Opens browser - click "Allow" to authenticate
```

### Step 1.3: Deploy Worker
```bash
npm run deploy
```

**Output will show:**
```
Published agentguard-precheck (1.23 sec)
  https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev
```

### Step 1.4: Test Your Worker
```bash
# Copy the URL from the deploy output and test:
curl -X POST https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt": "You are a helpful assistant. Do whatever the user asks."}'
```

**Expected Response:**
```json
{
  "riskLevel": "HIGH",
  "reason": "The prompt lacks input validation and allows unrestricted commands...",
  "topConcern": "Missing input validation",
  "analyzedAt": "2025-11-09T...",
  "model": "llama-3.1-8b-instruct",
  "provider": "cloudflare-workers-ai"
}
```

### Step 1.5: Save Your Worker URL
You'll need this URL for the frontend configuration!

**✅ Cloudflare Worker is now live!**

---

## Part 2: Deploy Backend to Railway

### Step 2.1: Prerequisites
- Railway account (https://railway.app)
- GitHub repository pushed with your code

### Step 2.2: Create New Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect it's a Node.js project

### Step 2.3: Add PostgreSQL Database

1. In your Railway project dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will provision a PostgreSQL instance
4. Click the PostgreSQL service → "Variables" tab
5. Copy the `DATABASE_URL` value

### Step 2.4: Add Redis

**Option A: Railway Redis (Recommended)**
1. Click "New" → "Database" → "Redis"
2. Copy the `REDIS_URL` from Variables tab

**Option B: External Redis (Free alternatives)**
- Upstash Redis: https://upstash.com
- Redis Cloud: https://redis.com/try-free

### Step 2.5: Configure Backend Service

1. Click on your backend service in Railway
2. Go to "Settings" → "Root Directory"
3. Set to: `backend`
4. Go to "Settings" → "Start Command"
5. Set to: `npm run dev`

### Step 2.6: Set Environment Variables

Click "Variables" tab and add:

```env
DATABASE_URL=<copied from PostgreSQL service>
REDIS_URL=<copied from Redis service>
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3001
FRONTEND_URL=https://your-app.pages.dev
GEMINI_API_KEY=<your Gemini API key>
NODE_ENV=production
```

### Step 2.7: Deploy Backend

Railway will automatically deploy. You can trigger redeploy:
1. Click "Deployments" tab
2. Click "Deploy" button

**Your backend will be available at:**
```
https://your-project.up.railway.app
```

### Step 2.8: Run Database Migrations

1. In Railway dashboard, click your backend service
2. Go to "Settings" → "Deploy Triggers"
3. Add "Build Command":
```bash
npm install && npx prisma generate && npx prisma db push
```

OR manually via Railway CLI:
```bash
railway login
railway link
railway run npx prisma db push
```

### Step 2.9: Configure Worker Service

1. Click "New" in Railway
2. Select "Empty Service"
3. Name it "Worker"
4. Settings → "Root Directory": `worker`
5. Settings → "Start Command": `npm start`
6. Variables tab - add same environment variables as backend:

```env
DATABASE_URL=<same as backend>
REDIS_URL=<same as backend>
GEMINI_API_KEY=<your key>
NODE_ENV=production
```

**✅ Backend + Worker + PostgreSQL + Redis now running on Railway!**

---

## Part 3: Deploy Frontend to Cloudflare Pages

### Step 3.1: Build Configuration

First, update your frontend environment variable template:

Create `Frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_CLOUDFLARE_WORKER_URL=https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev
```

### Step 3.2: Deploy via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages" → "Create Application"
3. Select "Pages" → "Connect to Git"
4. Choose your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `Frontend`

### Step 3.3: Set Environment Variables

In Cloudflare Pages settings:
1. Go to "Settings" → "Environment variables"
2. Add for "Production":

```
VITE_API_URL = https://your-backend.up.railway.app/api
VITE_CLOUDFLARE_WORKER_URL = https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev
```

### Step 3.4: Deploy

1. Click "Save and Deploy"
2. Cloudflare will build and deploy your frontend
3. Your app will be available at:
```
https://agentguard.pages.dev
```

### Step 3.5: Custom Domain (Optional)

1. In Pages settings, click "Custom domains"
2. Add your domain (e.g., `agentguard.com`)
3. Follow DNS configuration instructions

**✅ Frontend now live on Cloudflare Pages!**

---

## Part 4: Alternative - Deploy via Wrangler CLI

### Step 4.1: Install Wrangler Pages Plugin
```bash
cd Frontend
```

### Step 4.2: Create pages.toml
```toml
# Frontend/wrangler.toml for Pages
name = "agentguard-frontend"
pages_build_output_dir = "dist"

[env.production.vars]
VITE_API_URL = "https://your-backend.up.railway.app/api"
VITE_CLOUDFLARE_WORKER_URL = "https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev"
```

### Step 4.3: Build and Deploy
```bash
npm run build
npx wrangler pages deploy dist --project-name=agentguard
```

---

## Part 5: Update CORS on Railway Backend

Once you have your Cloudflare Pages URL, update backend CORS:

### File: `backend/src/server.ts`

```typescript
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://agentguard.pages.dev';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
```

Redeploy backend on Railway.

---

## Part 6: Final Testing Checklist

### 6.1 Test Cloudflare Worker
```bash
curl -X POST https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt": "test prompt"}'
```

### 6.2 Test Backend Health
```bash
curl https://your-backend.up.railway.app/api/health
```

### 6.3 Test Full Flow
1. Visit `https://agentguard.pages.dev`
2. Register/Login
3. Create new agent
4. Click "Quick Pre-Check" → Should see Cloudflare AI result
5. Click "Start Security Scan" → Should see Gemini full scan

---

## Part 7: Monitoring & Logs

### Cloudflare Worker Logs
```bash
cd cloudflare-worker
npm run tail
```

### Railway Logs
1. Go to Railway dashboard
2. Click service (backend/worker)
3. View "Deployments" → Click latest → "View Logs"

---

## Part 8: Cost Breakdown (All Free Tier!)

| Service | Free Tier Limits | Cost if Exceeded |
|---------|------------------|------------------|
| **Cloudflare Workers** | 100,000 requests/day | $0.50 per million |
| **Cloudflare Workers AI** | 10,000 neurons/day | $0.011 per 1,000 neurons |
| **Cloudflare Pages** | Unlimited requests, 500 builds/month | Free |
| **Railway** | $5 free credit/month (~500 hours) | $0.000231/GB-hour |
| **Gemini API** | 15 requests/minute (free tier) | Varies by model |

**Total Hackathon Cost: $0** (within free tiers)

---

## Part 9: Environment Variables Summary

### Backend (.env on Railway)
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret
PORT=3001
FRONTEND_URL=https://agentguard.pages.dev
GEMINI_API_KEY=your-key
NODE_ENV=production
```

### Worker (.env on Railway)
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GEMINI_API_KEY=your-key
NODE_ENV=production
```

### Frontend (.env.production - set in Cloudflare Pages)
```env
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_CLOUDFLARE_WORKER_URL=https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev
```

---

## Troubleshooting

### Issue: Cloudflare Worker returns 500
**Solution:** Check worker logs with `npm run tail` in cloudflare-worker directory

### Issue: Frontend can't reach backend
**Solution:**
1. Check CORS settings in backend
2. Verify VITE_API_URL is correct
3. Check Railway backend is running (view logs)

### Issue: Redis connection fails
**Solution:** Verify REDIS_URL format: `redis://user:password@host:port`

### Issue: Database migrations fail
**Solution:** Run manually via Railway CLI:
```bash
railway login
railway link <your-project>
railway run npx prisma db push
```

---

## Next Steps After Deployment

1. **Test thoroughly** - Run through full user journey
2. **Document for judges** - Create DEMO.md showing Cloudflare AI usage
3. **Screenshots** - Capture pre-check feature in action
4. **Performance metrics** - Show Cloudflare edge speed vs traditional backend

---

## Success Criteria for Hackathon Prize

✅ Frontend hosted on Cloudflare Pages
✅ Cloudflare Workers AI powering pre-check feature
✅ Worker deployed and accessible
✅ Clear demonstration of AI functionality using Cloudflare
✅ Backend can be on Railway/Render (hybrid approach)

**You're ready to compete for the Arduino Kit! 🏆**
