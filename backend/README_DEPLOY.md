pip # Backend Deployment (FastAPI)

## Prereqs
- Python 3.12+
- Baseline CSV present at path specified by `BASELINE_CSV` (default `data/baseline_2025.csv`)

## Environment
Create `backend/.env` (or real env vars):

```
APP_ENV=production
FRONTEND_ORIGIN=https://your-frontend.example.com
BASELINE_CSV=/absolute/path/to/baseline_2025.csv
API_VERSION=0.1.0
```

## Run (uvicorn)
```
python -m venv .venv
. .venv/Scripts/activate  # Windows
pip install -r backend/requirements.txt
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --workers 2
```

## Notes
- CORS is strict in production: only `FRONTEND_ORIGIN` is allowed.
- Logging is INFO in production; DEBUG otherwise.
- Baseline CSV must exist or the app will fail fast at startup. 