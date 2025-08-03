from pydantic import BaseModel, Field, ConfigDict

class SpendAdjustments(BaseModel):
    model_config = ConfigDict(extra="forbid") # restrict bad entries
    health: float = Field(0.0, ge=-1.0, le=1.0, description="Fraction, e.g. 0.01 = +1%")
    defense: float = Field(0.0, ge=-1.0, le=1.0)
    education: float = Field(0.0, ge=-1.0, le=1.0)

class SimRequest(BaseModel):
    model_config = ConfigDict(extra="forbid") # restrict bad entries
    taxRate: float = Field(..., ge=0, le=50, description="Percentage 0-50")
    gdp: float = Field(..., gt=0, description="USD, must be >0")
    spendAdjustments: SpendAdjustments = Field(default_factory=SpendAdjustments)

class SpendingBreakdown(BaseModel):
    health: int
    defense: int
    education: int
    other: int
    total: int

class SimResult(BaseModel):
    revenue: int
    spending: SpendingBreakdown
    deficit: int # positive = surplus; negative = deficit
    assumptions: dict[str, str]