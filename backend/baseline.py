# loader for the baseline csv file

# Reads data/baseline_2025.csv into memory at startup
# Stores data in dict of category to amount

from pathlib import Path
import csv

_BASELINE: dict[str, int] | None = None

# loads baseline data from CSV file with minor data validation
def load_baseline(csv_path: str | Path) -> dict[str, int]:
    global _BASELINE
    if _BASELINE is not None:
        return _BASELINE
    
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"Baseline CSV not found: {path}")
    
    with path.open(newline = "",) as file:
        reader = csv.DictReader(file)
        # Need to change if file layout changes or move to DB
        if not reader.fieldnames or not {"category", "amount"} <= set(fn.strip().lower() for fn in reader.fieldnames):
            raise ValueError("CSV must have 'category and 'amount' headers")
        
        data: dict[str, int] = {}
        for i, row in enumerate(reader, start=2): #discard row 1 = header
            cat = (row.get("category") or "").strip()
            amt_as_str = (row.get("amount") or "").replace(",", "").strip()
            if not cat:
                raise ValueError(f"Row {i}: empty category")
            if cat in data:
                raise ValueError(f"Row {i}: category already present")
            try:
                amt = int(float(amt_as_str)) # round to int for testing
            except ValueError:
                raise ValueError(f"Row {i}: amount '{row.get('amount')} is not a number")
            if amt < 0:
                raise ValueError(f"Row {i}: amount is negative for '{cat}'")
            data[cat] = amt
    if not data:
        raise ValueError("Baseline CSV contains no readable data")
    
    _BASELINE = data
    return _BASELINE

# Returns the baseline information in cache            
def get() -> dict[str, int]:
    if _BASELINE is None:
        raise RuntimeError("Baseline has not been loaded. Ensure load_baseline() has been called")
    return _BASELINE

# resets the current baseline cache
def reset_cache() -> None:
    global _BASELINE
    _BASELINE = None
