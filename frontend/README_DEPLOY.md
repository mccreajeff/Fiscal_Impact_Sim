# Frontend Deployment (Vite + React + Tailwind v4)

## Env
Create `.env` in `frontend/` with your backend base:

```
VITE_API_BASE=https://api.example.com
```

## Build
```
npm ci
npm run build
```
Artifacts are emitted to `frontend/dist/`.

## Serve
Any static host (S3/CloudFront, Netlify, Vercel, Nginx). Ensure your backend CORS `FRONTEND_ORIGIN` matches your deployed frontend origin. 