"""
FastAPI Application - Main Server
"""
from fastapi import FastAPI, Request, Form, Response
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

from .email_utils import send_email
from .validators import FormValidator

# Setup paths
BASE_DIR = Path(__file__).parent.parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = Path(__file__).parent / "templates"

# FastAPI app
app = FastAPI(
    title="Parthenoweb",
    description="Web Design & Development",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Templates
templates = Jinja2Templates(directory=TEMPLATES_DIR)


# ============================================================================
# ROUTES
# ============================================================================

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Homepage"""
    return templates.TemplateResponse("home.html", {
        "request": request,
        "page": "home",
        "page_title": "Home",
        "user_accepted_cookies": request.cookies.get("cookiesAccepted")
    })


@app.get("/contatti", response_class=HTMLResponse)
async def contatti_get(request: Request):
    """Contact page (GET)"""
    return templates.TemplateResponse("contatti.html", {
        "request": request,
        "page": "contatti",
        "page_title": "Contatti",
        "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
        "form_data": {},
        "errors": None,
        "success": False,
        "error": None
    })


@app.post("/contatti", response_class=HTMLResponse)
async def contatti_post(
    request: Request,
    nome: str = Form(...),
    email: str = Form(...),
    telefono: str = Form(default=""),
    descrizione: str = Form(...)
):
    """Contact form submission (POST with server-side validation)"""
    
    form_data = {
        "nome": nome,
        "email": email,
        "telefono": telefono,
        "descrizione": descrizione
    }
    
    # Validate all fields
    errors = FormValidator.validate_all(nome, email, descrizione, telefono or None)
    
    if errors:
        return templates.TemplateResponse("contatti.html", {
            "request": request,
            "page": "contatti",
            "page_title": "Contatti",
            "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
            "form_data": form_data,
            "errors": errors,
            "success": False,
            "error": None
        })
    
    # Try to send email
    try:
        send_email(nome, telefono or None, email, descrizione)
        
        # Success response
        response = templates.TemplateResponse("contatti.html", {
            "request": request,
            "page": "contatti",
            "page_title": "Contatti",
            "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
            "form_data": {},
            "errors": None,
            "success": True,
            "error": None
        })
        # Set cookie for accepting cookies if needed
        response.set_cookie("cookiesAccepted", "true", max_age=60*60*24*365)
        return response
        
    except Exception as e:
        error_msg = f"Errore nell'invio della richiesta: {str(e)}"
        print(f"✗ Error sending email: {e}")
        
        return templates.TemplateResponse("contatti.html", {
            "request": request,
            "page": "contatti",
            "page_title": "Contatti",
            "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
            "form_data": form_data,
            "errors": None,
            "success": False,
            "error": error_msg
        })


@app.get("/cookies", response_class=HTMLResponse)
async def cookies(request: Request):
    """Cookie policy page"""
    return templates.TemplateResponse("cookies.html", {
        "request": request,
        "page": "cookies",
        "page_title": "Cookie Policy",
        "user_accepted_cookies": request.cookies.get("cookiesAccepted")
    })


@app.post("/api/cookies/accept")
async def accept_cookies(response: Response):
    """API endpoint to accept cookies (optional, for JS fetch)"""
    response.set_cookie("cookiesAccepted", "true", max_age=60*60*24*365)
    return {"status": "ok"}


# ============================================================================
# Fallback for old API endpoints (backward compatibility)
# ============================================================================

@app.post("/invia-email")
async def invia_email_legacy(
    nome: str = Form(...),
    email: str = Form(...),
    telefono: str = Form(default=""),
    descrizione: str = Form(...)
):
    """
    Legacy API endpoint for email submission.
    Redirects form to /contatti POST endpoint.
    """
    # Validate
    errors = FormValidator.validate_all(nome, email, descrizione, telefono or None)
    
    if errors:
        return {
            "success": False,
            "message": "Validazione fallita: " + "; ".join(errors)
        }
    
    try:
        send_email(nome, telefono or None, email, descrizione)
        return {
            "success": True,
            "message": "Email inviata con successo"
        }
    except Exception as e:
        print(f"✗ Error: {e}")
        return {
            "success": False,
            "message": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
