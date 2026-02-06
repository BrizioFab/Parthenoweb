from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from .email_utils import send_email

app = FastAPI(
   # docs_url=None,    # disabilita /docs
   # redoc_url=None,   # disabilita /redoc
   # openapi_url=None  # opzionale: disabilita il JSON OpenAPI
)



templates = Jinja2Templates(directory="../pages")





# Rotta POST: 
@app.post("/invia-email")
async def handle_contact_form(
    request: Request,
    nome: str = Form(...),         
    telefono: str = Form(None),    
    email: str = Form(...),
    descrizione: str = Form(...)
):
    try:
        # Passiamo tutti i dati alla funzione email
        send_email(nome, telefono, email, descrizione)
        return JSONResponse({"success": True, "message": "Email inviata."}, status_code=200)
    except Exception as e:
        # Log dell'eccezione per debug su Vercel
        print(f"Errore invio email: {e}")
        return JSONResponse({"success": False, "message": str(e)}, status_code=500)
