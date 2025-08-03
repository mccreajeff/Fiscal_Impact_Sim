# logic for fiscal simulation
from backend.models import SimRequest, SimResult, SpendingBreakdown

def simulate_math(req: SimRequest, baseline: dict[str, int]) -> SimResult:
    revenue_update= int(round(req.gdp * (req.taxRate / 100.0)))
    health_update= max(0, int(round(baseline["health"] * (1 + req.spendAdjustments.health))))
    defense_update= max(0, int(round(baseline["defense"] * (1 + req.spendAdjustments.defense))))
    education_update= max(0, int(round(baseline["education"] * (1 + req.spendAdjustments.education))))
    total_update= health_update + defense_update + education_update
    deficit_update = revenue_update - total_update
    
    result = SimResult(
        revenue=revenue_update,
        spending=SpendingBreakdown(
            health= health_update,
            defense= defense_update,
            education= education_update,
            other= int(baseline["other"]), #unchanged in MVP
            total= total_update
        ),
        deficit=deficit_update,
        # currently hardcoded; need to create a schema for prod
        assumptions={
            "baselineYear": "2025",
            "units": "USD, nominal",
            "taxRateRange": "0–50%",
            "deltaRange": "−100%..+100%",
            "dataSource": "data/baseline_2025.csv",
        }
    )
    return result