"""
FastAPI Application - Main Server - PARTHENOWEB
==================================================
Server principale che gestisce tutte le rotte del sito web.

ROTTE PRINCIPALI:
- GET  /            → Homepage (home.html)
- GET  /portfolio   → Pagina portfolio (portfolio.html)
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

# IMPORT LIBRERIE ESTERNE
from fastapi import FastAPI, Request, Form, Response
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

# IMPORT MODULI LOCALI (dalla stessa cartella)
from .email_utils import send_email  # Funzione per inviare email via SMTP
from .validators import FormValidator  # Classe per validare i form

# ============================================================================
# CONFIGURAZIONE PERCORSI (paths)
# ============================================================================
# Questi percorsi puntano alle cartelle statiche e template
# Vengono calcolati automaticamente in base alla posizione del file

BASE_DIR = Path(__file__).parent.parent  # Cartella radice del progetto
STATIC_DIR = BASE_DIR / "static"         # Cartella per CSS, JS, immagini
TEMPLATES_DIR = Path(__file__).parent / "templates"  # Cartella template HTML

# ============================================================================
# CREAZIONE E CONFIGURAZIONE APP FASTAPI
# ============================================================================
# FastAPI è il framework web che gestisce le rotte HTTP
app = FastAPI(
    title="Parthenoweb",             # Nome app (visibile in /docs)
    description="Web Design & Development",  # Descrizione app
    version="1.0.0"                  # Versione dell'applicazione
)

# ============================================================================
# MIDDLEWARE CORS (Cross-Origin Resource Sharing)
# ============================================================================
# Permette richieste da qualsiasi dominio (utile per API pubbliche)
# MODIFICA: se vuoi restringere solo a certi domini, cambia allow_origins
# Attualmente: allow_origins=["*"] = permetti TUTTO
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],             # * = qualsiasi provenienza
    allow_credentials=True,          # Accetta cookie e credenziali
    allow_methods=["*"],             # Accetta GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],             # Accetta qualsiasi header HTTP
)

# ============================================================================
# MOUNT FILE STATICI (CSS, JS, immagini)
# ============================================================================
# Serve la cartella /static come /static/... per il client
# Esempio: /static/css/styles.css → file: static/css/styles.css
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ============================================================================
# SETUP TEMPLATE ENGINE (Jinja2)
# ============================================================================
# Jinja2 è il motore per renderizzare template HTML con variabili Python
templates = Jinja2Templates(directory=TEMPLATES_DIR)


# ============================================================================
# ROTTE PAGINE PRINCIPALI (GET requests)
# ============================================================================
# Ogni rotta GET renderizza un template HTML e lo invia al client

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
        "request": request,              # Obbligatorio per Jinja2
        "page": "home",                  # Identificatore univoco pagina
        "page_title": "Home",            # Titolo visibile nel browser
        "user_accepted_cookies": request.cookies.get("cookiesAccepted")  # Leggi cookie
    })


@app.get("/portfolio", response_class=HTMLResponse)
async def portfolio(request: Request):
    """
    PAGINA PORTFOLIO - Mostra i tuoi lavori e progetti
    
    PERCORSO: GET /portfolio
    TEMPLATE: portfolio.html
    
    DA MODIFICARE: per aggiungere filtri o struttura progetti diversa
    """
    return templates.TemplateResponse("portfolio.html", {
        "request": request,
        "page": "portfolio",
        "page_title": "Portfolio",
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
        "form_data": {},                 # Form vuoto
        "errors": None,                  # Nessun errore
        "success": False,                # Email non inviata
        "error": None                    # Nessun errore generico
    })


# ============================================================================
# FORM CONTATTI - POST (invio email con validazione server)
# ============================================================================

@app.post("/contatti", response_class=HTMLResponse)
async def contatti_post(
    request: Request,
    nome: str = Form(...),              # Obbligatorio: viene dal form <input name="nome">
    email: str = Form(...),             # Obbligatorio
    telefono: str = Form(default=""),   # Facoltativo (default stringa vuota)
    descrizione: str = Form(...)        # Obbligatorio
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
    # STEP 1: Raccogli i dati dal form in un dictionary
    form_data = {
        "nome": nome,
        "email": email,
        "telefono": telefono,
        "descrizione": descrizione
    }
    
    # STEP 2: Valida i campi usando la classe FormValidator
    # validate_all() ritorna una lista di errori (vuota = tutto OK)
    errors = FormValidator.validate_all(nome, email, descrizione, telefono or None)
    
    # STEP 3: Se ci sono errori, mostra form con errori evidenziati
    if errors:
        return templates.TemplateResponse("contatti.html", {
            "request": request,
            "page": "contatti",
            "page_title": "Contatti",
            "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
            "form_data": form_data,      # Mantieni i dati scritti dall'user
            "errors": errors,             # Mostra lista errori
            "success": False,
            "error": None
        })
    
    # STEP 4: Se valido, tenta di inviare email
    try:
        # Funzione importata da email_utils.py
        # Legge EMAIL_ADDRESS e EMAIL_PASSWORD dalle variabili d'ambiente
        send_email(nome, telefono or None, email, descrizione)
        
        # STEP 5a: Email inviata con successo - mostra messaggio di successo
        response = templates.TemplateResponse("contatti.html", {
            "request": request,
            "page": "contatti",
            "page_title": "Contatti",
            "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
            "form_data": {},              # Form vuoto (cancella i dati)
            "errors": None,
            "success": True,              # Flag di successo
            "error": None
        })
        # Imposta cookie accettazione cookie (expires tra 1 anno)
        response.set_cookie("cookiesAccepted", "true", max_age=60*60*24*365)
        return response
        
    # STEP 5b: Errore nell'invio email (problemi SMTP, credenziali, etc.)
    except Exception as e:
        error_msg = f"Errore nell'invio della richiesta: {str(e)}"
        print(f"✗ Error sending email: {e}")
        
        return templates.TemplateResponse("contatti.html", {
            "request": request,
            "page": "contatti",
            "page_title": "Contatti",
            "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
            "form_data": form_data,      # Mantieni i dati scritti
            "errors": None,
            "success": False,
            "error": error_msg           # Mostra errore generico
        })


# ============================================================================
# PAGINA INFORMAZIONI (Cookie Policy, Privacy, etc.)
# ============================================================================

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


# ============================================================================
# API ENDPOINTS (per JavaScript / AJAX requests)
# ============================================================================

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


# ============================================================================
# ENDPOINT LEGACY (Compatibilità con integrazioni vecchie)
# ============================================================================

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
    # Valida i dati input
    errors = FormValidator.validate_all(nome, email, descrizione, telefono or None)
    
    # Se errori: ritorna JSON con errori
    if errors:
        return {
            "success": False,
            "message": "Validazione fallita: " + "; ".join(errors)
        }
    
    # Se valido: tenta invio email
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
