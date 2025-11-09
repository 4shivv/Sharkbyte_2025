# Railway Deployment - Quick Start Guide

## Quick Deploy Steps

### 1. Deploy Backend to Railway (5 minutes)

#### A. Create Railway Project
```bash
# Visit https://railway.app and login with GitHub
# Click "New Project" → "Deploy from GitHub repo"
# Select your Sharkbyte_2025 repository
```

#### B. Add PostgreSQL
```
In Railway dashboard:
1. Click "+ New" → "Database" → "PostgreSQL"
2. PostgreSQL will provision automatically
3. Note: DATABASE_URL is auto-generated
```

#### C. Add Redis
```
1. Click "+ New" → "Database" → "Redis"
2. Redis will provision automatically
3. Note: REDIS_URL is auto-generated
```

#### D. Configure Backend Service
```
1. Click on your GitHub repo service
2. Settings → "Root Directory" → Enter: backend
3. Settings → "Start Command" → Enter: npm run dev
4. Settings → "Build Command" → Enter: npm install && npx prisma generate && npx prisma db push
```

#### E. Set Environment Variables
```
Click "Variables" tab, add these:

DATABASE_URL = ${{Postgres.DATABASE_URL}}  ← Railway auto-fills
REDIS_URL = ${{Redis.REDIS_URL}}            ← Railway auto-fills
JWT_SECRET = your-random-secret-key-123
FRONTEND_URL = https://agentguard.pages.dev
GEMINI_API_KEY = your-gemini-api-key
NODE_ENV = production
PORT = 3001
```

**Pro Tip:** Railway auto-references other services with `${{ServiceName.VARIABLE}}`

#### F. Deploy
Railway auto-deploys! Your backend URL will be:
```
https://sharkbyte-2025-production.up.railway.app
```

---

### 2. Deploy Worker to Railway (2 minutes)

#### A. Add Worker Service
```
1. In same Railway project, click "+ New"
2. Select "GitHub Repo" (same repo)
3. Name it "Worker"
```

#### B. Configure Worker Service
```
Settings → "Root Directory" → Enter: worker
Settings → "Start Command" → Enter: npm start
Settings → "Build Command" → Enter: npm install && npx prisma generate
```

#### C. Set Worker Variables
```
Click "Variables" tab:

DATABASE_URL = ${{Postgres.DATABASE_URL}}
REDIS_URL = ${{Redis.REDIS_URL}}
GEMINI_API_KEY = your-gemini-api-key
NODE_ENV = production
```

---

### 3. Verify Deployment

#### Check Services Running
```bash
# All 4 services should show "Active":
✅ Backend (GitHub repo)
✅ Worker (GitHub repo)
✅ PostgreSQL
✅ Redis
```

#### Test Backend
```bash
curl https://your-backend.up.railway.app/api/health
```

#### View Logs
```
Click each service → "Deployments" → Latest → "View Logs"
```

---

## Alternative: Railway CLI Deployment

### Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Link Project
```bash
railway link
# Select your project from list
```

### Deploy Backend
```bash
cd backend
railway up
```

### Run Migrations
```bash
railway run npx prisma db push
```

### Deploy Worker
```bash
cd ../worker
railway up
```

---

## Railway Project Structure

```
Railway Project: agentguard-production
│
├── Service: backend (from GitHub)
│   ├── Root Directory: /backend
│   ├── Start: npm run dev
│   └── Port: 3001
│
├── Service: worker (from GitHub)
│   ├── Root Directory: /worker
│   └── Start: npm start
│
├── Database: PostgreSQL
│   └── Auto-provisioned
│
└── Database: Redis
    └── Auto-provisioned
```

---

## Environment Variables Reference

### Shared Between Backend & Worker
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
GEMINI_API_KEY=<your-key>
NODE_ENV=production
```

### Backend Only
```env
JWT_SECRET=<random-secret>
FRONTEND_URL=https://agentguard.pages.dev
PORT=3001
```

---

## Custom Domain (Optional)

### Add Domain to Railway
```
1. Click backend service
2. Settings → "Domains"
3. Click "Generate Domain" (gets custom .railway.app domain)
4. OR click "Custom Domain" to add your own
```

---

## Troubleshooting

### Build Fails - "Prisma not found"
**Fix:** Add to Build Command:
```bash
npm install && npx prisma generate
```

### Database Connection Error
**Check:**
```bash
# In Railway dashboard
1. Click PostgreSQL service
2. "Variables" tab
3. Copy DATABASE_URL
4. Paste into backend service variables
```

### Redis Queue Not Working
**Fix:** Ensure worker is using same REDIS_URL as backend
```bash
# Both should reference:
${{Redis.REDIS_URL}}
```

### Port Already in Use
**Fix:** Railway automatically assigns PORT. Don't hardcode 3001 in code:
```javascript
// backend/src/server.ts
const PORT = process.env.PORT || 3001;
```

---

## Cost Monitoring

### Railway Free Tier
- $5 credit per month
- ~500 hours of usage
- Perfect for hackathons!

### Check Usage
```
Dashboard → Project → "Usage" tab
```

### Optimize Costs
```
1. Set "Sleep after inactivity" (Settings → Service)
2. Use shared PostgreSQL (don't create multiple)
3. Monitor in "Usage" tab
```

---

## Next: Deploy Frontend to Cloudflare

After Railway backend is running:
1. Note your backend URL: `https://xxx.up.railway.app`
2. Use it in Cloudflare Pages environment variables
3. See DEPLOYMENT_GUIDE.md Part 3

---

## Quick Reference

| What | Where |
|------|-------|
| **Dashboard** | https://railway.app/dashboard |
| **Docs** | https://docs.railway.app |
| **Backend URL** | https://your-project.up.railway.app |
| **DB Connection** | Use `${{Postgres.DATABASE_URL}}` |
| **Logs** | Service → Deployments → View Logs |

---

**✅ Your Railway deployment is complete!**
