# fatAPI outlines startup routine and routes
from fastapi import FastAPI 

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}