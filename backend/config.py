# backend/config.py
from pathlib import Path
from typing import Literal

from pydantic import AnyUrl, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parent.parent  # project root


class Settings(BaseSettings):
    """
    Centralised runtime configuration.
    Values come from:
    1. Real environment variables
    2. A `.env` file in backend/  (auto-loaded in dev)
    3. The defaults below
    """

    # ----- Core keys -----
    app_env: Literal["development", "test", "production"] = "development"
    frontend_origin: AnyUrl = Field(
        default="http://localhost:5173",
        description="Exact origin your SPA is served from",
    )
    baseline_csv: Path = Field(
        default=ROOT_DIR / "data" / "baseline_2025.csv",
        description="Path to baseline CSV (absolute or relative to working dir)",
    )
    api_version: str = "0.1.0"

    # ----- Pydantic-Settings meta -----
    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / "backend" / ".env",  # auto-read if present
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @field_validator("baseline_csv", mode="after")
    def file_must_exist(cls, v: Path) -> Path:
        if not v.exists():
            raise FileNotFoundError(f"Baseline CSV not found at {v}")
        return v


# singleton – import this everywhere else
settings = Settings()

# Optional console hint (skip in tests for cleanliness)
if settings.app_env != "test":
    print(
        f"[config] ENV={settings.app_env}  "
        f"FRONTEND_ORIGIN={settings.frontend_origin}  "
        f"BASELINE_CSV={settings.baseline_csv}"
    )
