from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
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
        success = True
    except Exception as e:
        print(f"Errore invio email: {e}")
        success = False

    return templates.TemplateResponse(
        "contattaci.html", 
        {"request": request, "success": success}
    )
