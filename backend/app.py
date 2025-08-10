# fatAPI outlines startup routine and routes
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging

from backend.config import settings
from backend.models import SimRequest, SimResult
from backend.engine import simulate_math
import backend.baseline as bl

logger = logging.getLogger("fis.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup procedure; load baseline file
    data = bl.load_baseline(settings.baseline_csv)
    total = sum(data.values())
    logger.info(
        "baseline loaded: rows=%d total=$%s", len(data), f"{total:,}"
    )
    try:
        yield
    finally:
        # Shutdown procedure
        # TBD as needed
        pass

app = FastAPI(title="Fiscal Impact Simulator",
              version=settings.api_version,
              lifespan=lifespan)

# ---- CORS middleware ----
if settings.app_env == "production":
    allowed_origins = {settings.frontend_origin}
else:
    allowed_origins = {
         settings.frontend_origin,   # from env
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed_origins),  # List[str]
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)


@app.get("/")
def read_root():
    return {"status": "ok"}

@app.get("/api/metadata")
def metadata():
    try:
        bl.get()
        baseline_loaded = True
    except Exception:
        baseline_loaded = False
    return {
        "taxRateRange": [0,50],
        "deltaRange": [-1.0, 1.0],
        "baselineLoaded": baseline_loaded,
        "version": settings.api_version
    }


@app.post("/api/simulate", response_model=SimResult)
def simulate(req: SimRequest):
    try:
        baseline = bl.get()
    except RuntimeError:
        raise HTTPException(
            status_code=500,
            detail="Internal Error with baseline"
        )
    return simulate_math(req, baseline)

        

