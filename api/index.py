"""
Vercel entry point for FastAPI application
"""
from fast_api.main import app

# For Vercel, the ASGI app is exported as 'app'
# Vercel automatically detects and runs this as a serverless function
