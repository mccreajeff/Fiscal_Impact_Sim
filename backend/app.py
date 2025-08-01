# fatAPI outlines startup routine and routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

app = FastAPI(title="Fiscal Impact Simulator",
              version=settings.api_version,
              )

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