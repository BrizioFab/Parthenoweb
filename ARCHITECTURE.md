# 🚀 Parthenoweb - Architettura Ristrutturata

## 📐 Panoramica Architetturale

Questo progetto è stato completamente ristrutturato per minimizzare JavaScript e spostare la logica sul backend Python/FastAPI.

### Prima (Vecchia Architettura)
- ❌ Navbar generata dinamicamente in JavaScript
- ❌ Form con validazioni client-side incomplete
- ❌ Cookie banner generato in JavaScript
- ❌ Molti script JS scattered

### Dopo (Nuova Architettura)
- ✅ **Backend-driven**: FastAPI serve template pre-renderizzati (Jinja2)
- ✅ **JavaScript minimalista**: Solo effetti UI puri (carousel, parallax, animazioni CSS)
- ✅ **Validazione lato server**: Tutti i form validati in Python
- ✅ **Template inheritance**: base.html + pagine specifiche
- ✅ **Static files ottimizzati**: css/, js/, assets/ sotto /static

---

## 📁 Struttura Directory

```
parthenoweb/
├── fast_api/                    # Backend FastAPI
│   ├── main.py                  # App principale con rotte
│   ├── validators.py            # Validatori form (Python)
│   ├── email_utils.py           # Utility invio email
│   ├── templates/               # Jinja2 templates
│   │   ├── base.html           # Layout base (navbar, footer, cookie banner)
│   │   ├── home.html           # Homepage
│   │   ├── contatti.html       # Pagina contatti con form
│   │   └── cookies.html        # Cookie policy
│   └── __init__.py
├── static/                      # File statici serviti da /static
│   ├── css/                     # Stylesheet
│   ├── js/                      # JavaScript minimalizzato
│   │   ├── navbar-toggle.js     # Toggle menu mobile
│   │   ├── cookies.js           # Gestione cookie banner
│   │   ├── carousel.js          # Carosello servizi (UI puro)
│   │   ├── animations.js        # Scroll effects, parallax
│   │   └── particles.js         # Particelle hero
│   ├── assets/                  # Immagini, icon, favicon
│   └── site.webmanifest
├── scripts/                     # Script utility
│   └── check_links.py           # Verifica link locali
├── start_dev_server.py          # Avvia server di sviluppo
├── test_integration.py          # Test di integrazione
├── requirements.txt             # Dipendenze Python
└── README.md                    # Questo file
```

---

## 🚀 Come Avviare

### 1️⃣ **Setup Iniziale**

```bash
# Entrare nella directory progetto
cd parthenoweb

# Creare/attivare virtual environment (se non già fatto)
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows PowerShell

# Installare dipendenze
pip install -r requirements.txt
```

### 2️⃣ **Testare l'Integrazione**

```bash
python test_integration.py
```

Deve mostrare: `✓ TUTTI I TEST PASSATI`

### 3️⃣ **Avviare il Development Server**

```bash
python start_dev_server.py
```

Server pronto su: **http://localhost:8000**

---

## 📍 Rotte Principali

| Rotta | Metodo | Descrizione |
|-------|--------|-----------|
| `/` | GET | Homepage |
| `/contatti` | GET/POST | Pagina contatti con form |
| `/cookies` | GET | Cookie policy |
| `/api/cookies/accept` | POST | Accetta cookies (API) |
| `/static/*` | GET | File statici (css, js, images) |
| `/invia-email` | POST | Legacy endpoint (backward compat) |

---

## 🛠️ Dettagli Implementazione

### **Template Rendering (Jinja2)**
I template usano Jinja2 per server-side rendering:

```jinja2
<!-- base.html -->
<header class="site-header">
    <!-- Navbar già completa nel HTML -->
    <nav class="main-nav">
        <a href="/" class="nav-link {% if page == 'home' %}active{% endif %}">Home</a>
        <a href="/contatti" class="nav-link {% if page == 'contatti' %}active{% endif %}">Contatti</a>
    </nav>
</header>

<!-- Cookie banner mostra solo se non accettati -->
{% if not user_accepted_cookies %}
<div id="cookieBanner" class="cookie-banner visible">
    <!-- ... content ... -->
</div>
{% endif %}
```

### **Validazione Form (Backend)**
Tutte le validazioni avvengono in `validators.py`:

```python
from fast_api.validators import FormValidator

errors = FormValidator.validate_all(
    nome=nome,
    email=email,
    descrizione=descrizione,
    telefono=telefono
)

if errors:
    return template_response_with_errors(errors)
```

### **JavaScript Minimalizzato**
Solo 3 file JS essenziali per UI:

1. **navbar-toggle.js** (400 bytes) - Toggle menu mobile
2. **cookies.js** (300 bytes) - Accettazione cookies
3. **animations.js** - Smooth scroll, parallax (UT UI puro)
4. **carousel.js** - Carosello servizi (UI puro)
5. **particles.js** - Particelle hero (UI puro)

---

## 🔍 Dettagli Tecnici

### **FastAPI + Jinja2**
```python
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="fast_api/templates")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {
        "request": request,
        "page": "home",
        "user_accepted_cookies": request.cookies.get("cookiesAccepted")
    })
```

### **Static Files**
```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
# Ora /static/css/styles.css è servito dalla cartella static/css/
```

### **Form POST con Validazione**
```python
@app.post("/contatti", response_class=HTMLResponse)
async def contatti_post(
    request: Request,
    nome: str = Form(...),
    email: str = Form(...),
    descrizione: str = Form(...)
):
    errors = FormValidator.validate_all(nome, email, descrizione, ...)
    
    if errors:
        return templates.TemplateResponse("contatti.html", {
            "errors": errors,
            "form_data": {...}
        })
    
    send_email(nome, email, descrizione)
    return templates.TemplateResponse("contatti.html", {
        "success": True
    })
```

---

## 📊 Statistiche Riduzione JavaScript

| Aspetto | Prima | Dopo | Risparmio |
|---------|-------|------|-----------|
| Navbar JS | navbar.js (102 lines) | navbar-toggle.js (40 lines) | 61% ↓ |
| Contact Form JS | contact-form.js (111 lines) | 0 (lato server) | 100% ↓ |
| Cookie Banner JS | cookie-banner.js (65 lines) | cookies.js (20 lines) | 69% ↓ |
| **Totale JS** | **~500 lines** | **~200 lines** | **60% ↓** |

---

## 🔐 Sicurezza

### ✅ Validazione Form
- Email regex validazione
- Lunghezza min/max per tutti i campi
- Prevenzione XSS via Jinja2 escaping

### ✅ CORS Middleware
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configurable in production
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### ✅ Email Credentials
- Gestite via environment variables
- Nessun hardcoding in codice

---

## 🧪 Testing

```bash
# Test di integrazione
python test_integration.py

# Test link locali
python scripts/check_links.py

# Test validatori
python -c "from fast_api.validators import FormValidator; print(FormValidator.validate_email('test@example.com'))"
```

---

## 🌐 Deployment

### **Vercel (Raccomandato)**

Vercel supporta FastAPI nativam via `vercel.json`:

```json
{
  "builds": [{"src": "fast_api/main.py", "use": "@vercel/python"}],
  "routes": [{"src": "/(.*)", "dest": "fast_api/main.py"}]
}
```

### **Docker**

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "fast_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Environment Variables**

Configurare on platform (Vercel, Docker, etc):
```
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

---

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'jinja2'"
```bash
pip install jinja2
```

### "Template not found: home.html"
Assicurarsi che:
- La cartella `fast_api/templates` esista
- I file .html siano dentro
- La path sia relativa a `/fast_api`

### Form non invia (localhost testing)
Email inviata solo con ambiente variables EMAIL_ADDRESS/PASSWORD configurate.
Per testing locale, comentare  `send_email()` in main.py.

---

## 📝 Prossimi Step Facoltativi

- [ ] Aggiungere database (SQLite/PostgreSQL) per archiviare contatti
- [ ] Implementare rate limiting su form submission
- [ ] Aggiungere CAPTCHA su form
- [ ] Setup CI/CD su GitHub Actions
- [ ] Analytics server-side (privacy-friendly)

---

## 📧 Support

Per domande sulla ristrutturazione:
- Email: parthenoweb@gmail.com
- Repository: [GitHub Link]

---

**Ultima modifica**: 9 Febbraio 2026
**Versione**: 2.0.0 (Ristrutturata)
