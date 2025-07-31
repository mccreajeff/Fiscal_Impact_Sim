# API Documentation - Fiscal Impact Simulator

**VERSION:** 0.1.0
**BASELINE:** Synthetic Data

This API powers a simple what-if simulator for fiscal policy. Users send a small set of parameters (tax rate, spending deltas, GDP) and the API returns computed revenue, spending, and deficit/surplus relative to a fixed baseline.

___

## Endpoints

- `GET /api/metadata` -- Returns allowed input ranges, baseline status, and API version information
- `POST /api/simulation` -- Validates inputs, applies the simulation math, and returns results

___

## Simulation Model

Given:
- `GDP` (USD, **> 0**)
- `tax_rate` (percent, **0–50 inclusive**)
- `spend_adjustments` (fractional deltas per category **−1.00..+1.00**)
- Baseline spending by category from `baseline_2025.csv`:
  - health: **1,300,000,000,000**
  - defense: **800,000,000,000**
  - education: **450,000,000,000**
  - other: **2,100,000,000,000**

Compute:
- **Revenue** = `GDP × (tax_rate / 100)`
- **Adjusted category** = `baseline_category × (1 + delta)` (floored at 0)
- **Total spending** = sum of adjusted categories (including `other`)
- **Deficit/Surplus** (returned as `deficit`) = `Revenue − Total spending`  
  (positive = surplus, negative = deficit)

___

## Schemas

### `POST /api/simulate` — Request body

| Field                           | Type   | Units    | Constraints         | Notes                            |
|---------------------------------|--------|----------|---------------------|----------------------------------|
| `tax_rate`                       | number | percent  | 0–50 (inclusive)    | Overall average tax rate         |
| `gdp`                            | number | USD      | > 0                 | Nominal dollars                  |
| `spend_adjustments.health`       | number | fraction | −1.00..+1.00        | `+0.03` = +3%                    |
| `spend_adjustments.defense`      | number | fraction | −1.00..+1.00        |                                  |
| `spend_adjustments.education`    | number | fraction | −1.00..+1.00        |                                  |

### `POST /api/simulate` — Response body

| Field                                 | Type   | Units | Notes                                                     |
|---------------------------------------|--------|-------|-----------------------------------------------------------|
| `revenue`                              | number | USD   | `GDP × (tax_rate/100)`                                    |
| `spending.health/defense/education`    | number | USD   | Adjusted category amounts                                 |
| `spending.other`                       | number | USD   | Baseline `other` (unchanged unless you add a delta later) |
| `spending.total`                       | number | USD   | Sum of all categories                                     |
| `deficit`                              | number | USD   | **Positive = surplus**, **negative = deficit**           |
| `assumptions`                          | object | —     | Baseline year, units, ranges, data source                 |

### `GET /api/metadata` — Response body

| Field             | Type                  | Example          | Notes             |
|-------------------|-----------------------|------------------|-------------------|
| `tax_rate_range`  | array[number, number] | `[0, 50]`        | Inclusive         |
| `delta_range`     | array[number, number] | `[-1.0, 1.0]`    | Fractional deltas |
| `baseline_loaded` | boolean               | `true`           | From startup      |
| `version`         | string                | `"0.1.0"`        | API version       |
