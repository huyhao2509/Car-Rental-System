# Deployment Guide (Vercel + Render)

## Architecture

- Frontend: Vercel (`car-rental-website`)
- Backend API: Render Web Service (`car-rental-backend`)
- Database: MySQL (external managed DB or VPS)
- Redis: optional but recommended for caching/rate-limit support

## 1) Deploy backend on Render

### Option A: Blueprint (recommended)

1. In Render dashboard, choose `New` -> `Blueprint`.
2. Connect this repository.
3. Render will detect [car-rental-backend/render.yaml](car-rental-backend/render.yaml).
4. Fill required env vars in Render:
   - `JWT_SECRET`
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - `EMAIL_USER`, `EMAIL_PASS`
   - `CLIENT_URL` and/or `FRONTEND_URLS`
   - Optional: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `PINATA_JWT`
5. Deploy service and verify health endpoint: `GET /`

### Option B: Manual service

- Root directory: `car-rental-backend`
- Build command: `npm install`
- Start command: `node index.js`
- Environment: Node 20+

## 2) Deploy frontend on Vercel

1. In Vercel dashboard, import this repository.
2. Set root directory to `car-rental-website`.
3. Add env var:
   - `VITE_API_URL=https://<your-render-domain>/api`
4. Deploy.

## 3) Configure CORS

Backend supports multiple origins from env:

- `CLIENT_URL`: single origin
- `FRONTEND_URLS`: comma-separated origins

Example:

`CLIENT_URL=https://car-rental-website.vercel.app`

`FRONTEND_URLS=https://car-rental-website.vercel.app,https://car-rental-website-git-cap-nhat-moi-nhat.vercel.app`

## 4) Post-deploy checklist

- Test login, OTP, forgot-password
- Confirm email sender credentials are valid
- Confirm `/api` requests from Vercel reach Render successfully
- Validate file upload routes if using Pinata

## Notes

- Frontend SPA fallback is handled by [car-rental-website/vercel.json](car-rental-website/vercel.json).
- Example env templates:
  - [car-rental-backend/.env.example](car-rental-backend/.env.example)
  - [car-rental-website/.env.example](car-rental-website/.env.example)
