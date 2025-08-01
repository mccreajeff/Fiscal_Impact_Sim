# fatAPI outlines startup routine and routes
from fastapi import FastAPI 

app = FastAPI()

def load_env():
    

@app.get("/")
def read_root():
    return {"Hello": "World"}