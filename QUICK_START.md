# AgentGuard - Quick Start Deployment Checklist

**Get your app live in 30 minutes! ⚡**

---

## Prerequisites (5 minutes)

### Accounts Needed (All Free!)
- [ ] Cloudflare account: https://dash.cloudflare.com/sign-up
- [ ] Railway account: https://railway.app
- [ ] GitHub account (you have this!)
- [ ] Gemini API key: https://aistudio.google.com/app/apikey

### Install Tools
```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Verify installation
wrangler --version

# Login to Cloudflare
wrangler login
```

---

## Step 1: Deploy Cloudflare Worker (5 minutes)

```bash
# Navigate to worker directory
cd cloudflare-worker

# Install dependencies
npm install

# Deploy to Cloudflare
npm run deploy
```

**✅ Save your Worker URL!**
```
Output will show: https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev
```

**Test it:**
```bash
curl -X POST https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt": "test"}'
```

---

## Step 2: Deploy Backend to Railway (10 minutes)

### A. Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `Sharkbyte_2025` repository
5. Railway auto-detects Node.js

### B. Add Databases
```
Click "+ New" → "Database" → "PostgreSQL" → Create
Click "+ New" → "Database" → "Redis" → Create
```

### C. Configure Backend Service
```
1. Click on your GitHub repo service
2. Settings → Root Directory: backend
3. Settings → Start Command: npm run dev
4. Settings → Build Command:
   npm install && npx prisma generate && npx prisma db push
```

### D. Set Environment Variables
Click "Variables" tab, add:
```
DATABASE_URL = ${{Postgres.DATABASE_URL}}
REDIS_URL = ${{Redis.REDIS_URL}}
JWT_SECRET = your-random-secret-key-change-me
GEMINI_API_KEY = <paste your Gemini key>
FRONTEND_URL = https://agentguard.pages.dev
NODE_ENV = production
PORT = 3001
```

### E. Add Worker Service
```
1. Click "+ New" → Select same GitHub repo
2. Name: "Worker"
3. Settings → Root Directory: worker
4. Settings → Start Command: npm start
5. Variables → Add same DATABASE_URL, REDIS_URL, GEMINI_API_KEY
```

**✅ Save your backend URL!**
```
https://sharkbyte-2025-production.up.railway.app
```

---

## Step 3: Deploy Frontend to Cloudflare Pages (10 minutes)

### A. Via Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages" → "Create Application"
3. Select "Pages" → "Connect to Git"
4. Choose your GitHub repository
5. Configure:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `Frontend`

### B. Set Environment Variables
In Pages settings → "Environment variables" → "Production":
```
VITE_API_URL = https://YOUR-BACKEND.up.railway.app/api
VITE_CLOUDFLARE_WORKER_URL = https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev
```

**Replace with YOUR actual URLs from Steps 1 & 2!**

### C. Deploy
Click "Save and Deploy"

**✅ Your app is live!**
```
https://agentguard.pages.dev
```

---

## Step 4: Update Backend CORS (2 minutes)

Your frontend URL is now known. Update backend:

### Option A: Via Railway Variables
```
1. Railway dashboard → Backend service
2. Variables → Edit FRONTEND_URL
3. Change to: https://agentguard.pages.dev
4. Redeploy
```

### Option B: Update Code (if needed)
If CORS issues persist, check `backend/src/server.ts`:
```typescript
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://agentguard.pages.dev';
```

---

## Step 5: Test Everything (3 minutes)

### ✅ Cloudflare Worker
```bash
curl -X POST https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"systemPrompt": "You are a helpful assistant."}'

# Should return JSON with riskLevel, reason, etc.
```

### ✅ Railway Backend
```bash
curl https://YOUR-BACKEND.up.railway.app/api/health

# Should return 200 OK or API info
```

### ✅ Frontend + Full Flow
1. Visit https://agentguard.pages.dev
2. Register new account
3. Create agent with system prompt
4. Click "⚡ Run Quick Pre-Check" → Should see result in 2-3s
5. Click "Start Security Scan" → Should complete in 10-30s

---

## Troubleshooting

### Worker returns 500
```bash
cd cloudflare-worker
npm run tail  # View logs
```

### Backend won't connect to database
```
Railway → PostgreSQL service → Variables → Copy DATABASE_URL
Railway → Backend service → Variables → Paste DATABASE_URL
```

### Frontend can't reach backend
Check:
1. VITE_API_URL includes `/api` at the end
2. Backend CORS allows your Pages domain
3. Railway backend is showing "Active" status

### CORS errors
```
Backend Variables → FRONTEND_URL = https://agentguard.pages.dev
(no trailing slash!)
```

---

## Environment Variables Cheat Sheet

### Cloudflare Worker
Set in `wrangler.toml` (already configured!)

### Railway Backend
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<random-secret>
GEMINI_API_KEY=<your-key>
FRONTEND_URL=https://agentguard.pages.dev
NODE_ENV=production
PORT=3001
```

### Railway Worker
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
GEMINI_API_KEY=<your-key>
NODE_ENV=production
```

### Cloudflare Pages (Frontend)
```env
VITE_API_URL=https://YOUR-BACKEND.up.railway.app/api
VITE_CLOUDFLARE_WORKER_URL=https://agentguard-precheck.YOUR-SUBDOMAIN.workers.dev
```

---

## URLs to Save

Fill these in as you deploy:

```
✏️ Cloudflare Worker: https://agentguard-precheck.__________.workers.dev

✏️ Railway Backend: https://__________.up.railway.app

✏️ Cloudflare Pages: https://__________.pages.dev
```

---

## Post-Deployment Checklist

- [ ] All 3 services deployed (Worker, Railway, Pages)
- [ ] Worker responds to test curl
- [ ] Backend shows "Active" on Railway
- [ ] Frontend loads in browser
- [ ] Can register/login
- [ ] Can create agent
- [ ] Quick Pre-Check works (Cloudflare AI)
- [ ] Full scan works (Gemini)
- [ ] No CORS errors in browser console

---

## Next Steps

### For Hackathon Submission
1. ✅ Test all features thoroughly
2. ✅ Take screenshots of:
   - Quick Pre-Check in action
   - Cloudflare Worker dashboard
   - Full application flow
3. ✅ Document Cloudflare integration (see CLOUDFLARE_DEMO.md)
4. ✅ Create short video demo (optional but impressive!)

### For Judges
- **Highlight**: "Powered by Cloudflare Workers AI" badge in UI
- **Show**: 2-3 second pre-check vs 10-30s full scan
- **Explain**: Edge computing benefits + hybrid architecture

---

## Support Links

| Resource | URL |
|----------|-----|
| **Cloudflare Docs** | https://developers.cloudflare.com/workers-ai/ |
| **Railway Docs** | https://docs.railway.app |
| **Wrangler CLI** | https://developers.cloudflare.com/workers/wrangler/ |
| **Deployment Guide** | DEPLOYMENT_GUIDE.md (in this repo) |
| **Railway Guide** | RAILWAY_DEPLOYMENT.md (in this repo) |
| **Demo Doc** | CLOUDFLARE_DEMO.md (for judges) |

---

## Cost Estimate (All Free Tier!)

- ✅ Cloudflare Workers: 100k requests/day free
- ✅ Workers AI: 10k neurons/day free
- ✅ Cloudflare Pages: Unlimited requests free
- ✅ Railway: $5 credit/month (~500 hours)

**Total Hackathon Cost: $0** 🎉

---

**You're all set! Good luck with the hackathon! 🚀**

If you get stuck, refer to:
- DEPLOYMENT_GUIDE.md (comprehensive)
- RAILWAY_DEPLOYMENT.md (Railway-specific)
- CLOUDFLARE_DEMO.md (for presenting to judges)
