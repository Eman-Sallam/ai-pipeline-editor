# app.py - FastAPI service providing /api/nodes endpoint
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS to allow requests from the frontend
# Using ["*"] for development - in production, specify exact origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Must be False when allow_origins is ["*"]
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/api/nodes")
async def get_nodes():
    # Simulate network latency
    await asyncio.sleep(1)
    return [
        {"id": "1", "name": "Data Source"},
        {"id": "2", "name": "Transformer"},
        {"id": "3", "name": "Model"},
        {"id": "4", "name": "Sink"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
