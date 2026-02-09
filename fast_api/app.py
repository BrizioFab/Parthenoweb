from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from email_utils import send_email

app = FastAPI(
   #docs_url=None,    # disabilita /docs
   #redoc_url=None,   # disabilita /redoc
   # openapi_url=None  # opzionale: disabilita il JSON OpenAPI
)

# Abilita CORS per permettere richieste dal frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotta POST: 
@app.post("/invia-email")
async def handle_contact_form(
    nome: str = Form(...),         
    telefono: str = Form(None),    
    email: str = Form(...),
    descrizione: str = Form(...)
):
    try:
        print(f"✓ Ricevuta richiesta form:")
        print(f"  Nome: {nome}")
        print(f"  Telefono: {telefono}")
        print(f"  Email: {email}")
        print(f"  Descrizione: {descrizione}")
        
        # Passiamo tutti i dati alla funzione email con i nomi parametri corretti
        send_email(nome, telefono, email, descrizione)
        
        print("✓ Email inviata con successo")
        return JSONResponse({"success": True, "message": "Email inviata."}, status_code=200)
    except Exception as e:
        # Log dell'eccezione per debug su Vercel
        print(f"✗ Errore invio email: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse({"success": False, "message": str(e)}, status_code=500)
