#!/usr/bin/env python3
"""
Development server for Parthenoweb FastAPI application
Run: python start_dev_server.py
"""
import uvicorn
import sys

if __name__ == "__main__":
    print("🚀 Starting Parthenoweb Development Server...")
    print("📍 Server running at http://localhost:8000")
    print("📚 API Docs at http://localhost:8000/docs")
    print("✋ Press Ctrl+C to stop")
    
    uvicorn.run(
        "fast_api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["fast_api", "js", "css", "assets"],
        log_level="info"
    )
