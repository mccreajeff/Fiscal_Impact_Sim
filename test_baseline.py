import json
from backend import baseline as bl
from backend.config import settings

print(bl.load_baseline(settings.baseline_csv))