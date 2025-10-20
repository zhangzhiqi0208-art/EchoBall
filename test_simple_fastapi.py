#!/usr/bin/env python3
from fastapi import FastAPI
import uvicorn

# 创建FastAPI应用
app = FastAPI(
    title="Test API",
    description="测试API",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "Test API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "test_simple_fastapi:app",
        host="0.0.0.0",
        port=8002,
        reload=True
    )

