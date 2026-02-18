"""
FastAPI Application - Main Server - PARTHENOWEB
==================================================
Server principale che gestisce tutte le rotte del sito web.

ROTTE PRINCIPALI:
- GET  /            → Homepage (home.html)
- GET  /contatti    → Form contatti - visualizzazione (contatti.html)
- POST /contatti    → Form contatti - invio email con validazione
- GET  /cookies     → Pagina cookie policy (cookies.html)
- POST /api/cookies/accept → Endpoint per accettare cookie da JS
- POST /invia-email → Endpoint legacy per compatibilità

DA MODIFICARE SOLO SE:
1. Aggiungi nuove pagine → aggiungi @app.get("/nuova-pagina", response_class=HTMLResponse)
2. Cambi percorsi cartelle → modifica STATIC_DIR o TEMPLATES_DIR
3. Aggiungi middleware → aggiungi app.add_middleware(TuoMiddleware)
4. Cambi nome app → modifica campo 'title' in FastAPI()
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

                                                                              
                                 
                                                                              
                                                           
                                                                   

BASE_DIR = Path(__file__).parent.parent                                
STATIC_DIR = BASE_DIR / "static"                                         
TEMPLATES_DIR = Path(__file__).parent / "templates"                          

                                                                              
                                        
                                                                              
                                                       
app = FastAPI(
    title="Parthenoweb",                                           
    description="Web Design & Development",                   
    version="1.0.0"                                              
)

                                                                              
                                                 
                                                                              
                                                                   
                                                                         
                                                   
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],                                        
    allow_credentials=True,                                        
    allow_methods=["*"],                                                   
    allow_headers=["*"],                                            
)

                                                                              
                                        
                                                                              
                                                          
                                                               
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

                                                                              
                                
                                                                              
                                                                        
templates = Jinja2Templates(directory=TEMPLATES_DIR)


                                                                              
                                        
                                                                              
                                                                 

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """
    HOMEPAGE - Pagina principale del sito
    
    PERCORSO: GET /
    TEMPLATE: home.html
    
    Variabili passate al template:
    - request: oggetto richiesta HTTP (RICHIESTO da Jinja2)
    - page: identificatore pagina corrente (usato per highlight menu)
    - page_title: titolo pagina (per SEO e browser tab)
    - user_accepted_cookies: verificare se user ha accettato cookie
    
    DA MODIFICARE: se cambi il nome del template o i campi
    """
    return templates.TemplateResponse("home.html", {
        "request": request,                                       
        "page": "home",                                                 
        "page_title": "Home",                                         
        "user_accepted_cookies": request.cookies.get("cookiesAccepted")                
    })


@app.get("/contatti", response_class=HTMLResponse)
async def contatti_get(request: Request):
    """
    PAGINA CONTATTI - Form per contattarti (visualizzazione iniziale)
    
    PERCORSO: GET /contatti
    TEMPLATE: contatti.html
    METODO: GET (solo visualizzazione form vuoto)
    
    Variabili per il template:
    - form_data: dati precedenti (inizialmente vuoto {})
    - errors: lista errori validazione (inizialmente None)
    - success: True se email inviata con successo (inizialmente False)
    - error: messaggio errore generico (inizialmente None)
    
    FLUSSO: User richiede /contatti → form vuoto
    """
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
    """
    FORM CONTATTI - Processa invio form e invia email
    
    PERCORSO: POST /contatti
    TEMPLATE: contatti.html
    METODO: POST (invio dati dal form)
    
    FLUSSO ELABORAZIONE:
    1. Ricevi dati dal form HTML
    2. Salva i dati in form_data (per ripopolare form se ci sono errori)
    3. Valida tutti i campi con FormValidator.validate_all()
    4. Se errori: ritorna form con lista errori
    5. Se valido: invia email con send_email()
    6. Se email OK: mostra messaggio successo e pulisci form
    7. Se email fallisce: mostra messaggio errore
    
    DA MODIFICARE:
    - Se aggiungi nuovi campi form, aggiungi parametro qui
    - Se vuoi cambiare validazione, modifica validators.py
    - Se vuoi cambiare email, modifica email_utils.py
    """
                                                       
    form_data = {
        "nome": nome,
        "email": email,
        "telefono": telefono,
        "descrizione": descrizione
    }
    
                                                           
                                                                   
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
    
                                               
    try:
                                              
                                                                         
        send_email(nome, telefono or None, email, descrizione)
        
                                                                            
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
    """
    PAGINA COOKIE POLICY - Informazioni su cookie del sito
    
    PERCORSO: GET /cookies
    TEMPLATE: cookies.html
    
    DA MODIFICARE: solo il contenuto in cookies.html
    """
    return templates.TemplateResponse("cookies.html", {
        "request": request,
        "page": "cookies",
        "page_title": "Cookie Policy",
        "user_accepted_cookies": request.cookies.get("cookiesAccepted")
    })


                                                                              
                                                
                                                                              

@app.post("/api/cookies/accept")
async def accept_cookies(response: Response):
    """
    API ENDPOINT - Accetta cookie via JavaScript (AJAX)
    
    PERCORSO: POST /api/cookies/accept
    RICHIESTA: da cookies.js
    RISPOSTA: JSON {"status": "ok"}
    
    Come usare da JavaScript:
    fetch('/api/cookies/accept', { method: 'POST' })
        .then(r => r.json())
        .then(data => console.log(data.status))
    
    Questo endpoint imposta il cookie lato server.
    Il browser lo mantiene per 1 anno.
    """
    response.set_cookie("cookiesAccepted", "true", max_age=60*60*24*365)
    return {"status": "ok"}


                                                                              
                                                          
                                                                              

@app.post("/invia-email")
async def invia_email_legacy(
    nome: str = Form(...),
    email: str = Form(...),
    telefono: str = Form(default=""),
    descrizione: str = Form(...)
):
    """
    API LEGACY - Endpoint deprecato per invio email (JSON response)
    
    PERCORSO: POST /invia-email
    RISPOSTA: JSON {"success": true/false, "message": "..."}
    
    ⚠️ DEPRECATO: Usa /contatti POST per nuovi progetti
    Mantenuto solo per compatibilità con integrazioni vecchie
    
    DIFFERENZA da /contatti:
    - /contatti: ritorna HTML renderizzato
    - /invia-email: ritorna JSON (utile per API esterne)
    
    DA ELIMARE: quando non serve più compatibilità
    """
                         
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
