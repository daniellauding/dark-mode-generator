# Deployment Guide

## Netlify Deployment (Frontend)

### Option 1: Netlify CLI (Recommended)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Initialize site:**
   ```bash
   cd ~/Work/dark-mode-generator
   netlify init
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Option 2: GitHub + Netlify UI

1. **Push to GitHub:**
   ```bash
   cd ~/Work/dark-mode-generator
   git remote add origin https://github.com/YOUR-USERNAME/dark-mode-generator.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Build settings (auto-detected from `netlify.toml`):
     - **Base directory:** `client`
     - **Build command:** `npm install && npm run build`
     - **Publish directory:** `client/dist`
     - **Node version:** 20

3. **Environment variables:**
   ```
   VITE_API_URL=https://your-backend-api-url.com
   ```

4. **Deploy:**
   - Click "Deploy site"
   - Site will auto-deploy on every push to `main`

### Option 3: Manual Deploy

```bash
cd client
npm install
npm run build
netlify deploy --prod --dir=dist
```

---

## Backend Deployment

### Railway (Recommended for MVP)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize:**
   ```bash
   cd ~/Work/dark-mode-generator/server
   railway init
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Set environment variables:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   ```

6. **Get URL:**
   ```bash
   railway domain
   ```

### Alternative: Render.com

1. Create `render.yaml` in project root:
   ```yaml
   services:
     - type: web
       name: dark-mode-api
       env: node
       region: frankfurt
       plan: free
       buildCommand: cd server && npm install && npm run build
       startCommand: cd server && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 10000
   ```

2. Connect repo to Render and deploy

### Alternative: Fly.io

```bash
cd server
fly launch
fly deploy
```

---

## Environment Variables

### Frontend (`client/.env.production`)
```env
VITE_API_URL=https://api.darkmodegen.app
```

### Backend (`server/.env.production`)
```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://darkmodegen.app
```

---

## Post-Deployment Checklist

- [ ] Frontend accessible at custom domain
- [ ] Backend API responding at `/api/`
- [ ] Swagger docs accessible at `/docs`
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] SSL/HTTPS enabled (auto on Netlify/Railway)
- [ ] Analytics configured (optional)
- [ ] Error monitoring (Sentry, optional)

---

## Custom Domain Setup (Netlify)

1. **Add domain in Netlify UI:**
   - Site settings → Domain management
   - Add custom domain: `darkmodegen.app`

2. **Configure DNS:**
   ```
   A     @     75.2.60.5
   CNAME www   your-site.netlify.app
   ```

3. **Enable HTTPS:**
   - Auto-configured by Netlify (Let's Encrypt)

---

## Monitoring

### Frontend
- **Netlify Analytics:** Built-in (paid feature)
- **Google Analytics:** Add to `index.html`
- **Sentry:** Error tracking

### Backend
- **Railway Logs:** `railway logs`
- **Health endpoint:** GET `/api/health` (add to backend)
- **Uptime monitoring:** UptimeRobot, Pingdom

---

## Rollback

### Netlify
```bash
netlify rollback
```
Or use Netlify UI → Deploys → Publish old deploy

### Railway
```bash
railway rollback
```

---

## Scaling

### Free Tier Limits
- **Netlify:** 100GB bandwidth, 300 build minutes/month
- **Railway:** $5 free credits/month, 500MB RAM
- **Render:** 750 hours/month (free tier)

### Upgrade Path
- Netlify Pro: $19/month
- Railway Pro: $5/month base + usage
- Render Starter: $7/month

---

## Troubleshooting

### Build Fails on Netlify
```bash
# Check build logs
netlify logs

# Test build locally
cd client
npm install
npm run build
```

### API Not Responding
```bash
# Check backend logs
railway logs

# Test locally
cd server
npm install
npm run dev
curl http://localhost:3001/api/health
```

### CORS Errors
- Ensure `CORS_ORIGIN` env var matches frontend URL
- Check server/src/index.ts CORS config

---

**Deployment complete!** 🚀

Frontend: https://darkmodegen.app  
API: https://api.darkmodegen.app  
Docs: https://api.darkmodegen.app/docs
