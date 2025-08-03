# fatAPI outlines startup routine and routes
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.models import SimRequest, SimResult
from backend.engine import simulate_math
import backend.baseline as bl

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup procedure; load baseline file
    data = bl.load_baseline(settings.baseline_csv)
    total = sum(data.values())
    print(f"[lifespan] baseline loaded: rows={len(data)} total= ${total:,} path={settings.baseline_csv}")
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],  # List[str]
    allow_methods=["*"],                       # GET, POST, etc.
    allow_headers=["*"],                       # Content-Type, Authorization, ...
    allow_credentials=False,                   # Change to True if you add cookies/auth
)


@app.get("/")
def read_root():
    return {"Hello": "World"}

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

        

