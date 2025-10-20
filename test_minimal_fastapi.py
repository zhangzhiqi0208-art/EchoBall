#!/usr/bin/env python3
from fastapi import FastAPI
import uvicorn

# 创建简化的FastAPI应用
app = FastAPI(title="Test API", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Test API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/test")
async def test_endpoint():
    return {"success": True, "message": "Test endpoint working"}

if __name__ == "__main__":
    print("🚀 启动简化FastAPI测试...")
    uvicorn.run(
        "test_minimal_fastapi:app",
        host="0.0.0.0",
        port=8003,
        reload=False
    )

