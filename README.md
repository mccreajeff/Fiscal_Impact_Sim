# Fiscal_Impact_Sim
Simple fiscal impact simulator with python backend and React frontend

Math spec:

Inputs:
- GDP (USD, must be > 0)
- tax_rate (percent, allowed range 0-50)
- spend_adjustments (relative deltas for health, defense, education; each allowed -1.00 - 1.00)
- baseline_spending (inital version loaded from csv)

Formulas:
- Revenue = GDP * (tax_rate / 100.0)
- Adjusted cateogry = baseline_category * (1.0 + delta)
- Total spending = sum of all adjust catefories including other
- Deficit (Surplus) = Revenue - Total spending (positive = surplus, negative = deficit)

Validation Rules (as applied to inputs):
- GDP must be strictly greater than zero
- Tax rate must be within [0, 50] clampped if outside range
- Deltas must be withing [-1.00, 1.00]
