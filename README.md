# Parthenoweb

![CI](https://img.shields.io/badge/CI-setup-lightgrey) ![Python](https://img.shields.io/badge/python-3.10%2B-blue) 

Descrizione
-----------

Parthenoweb è un progetto web full‑stack che fornisce un sito informativo con API realizzate in FastAPI. Comprende template HTML, risorse statiche (CSS/JS/immagini) e utilità per l'invio email e la validazione dei dati.

Caratteristiche principali
-------------------------

- API veloci e leggere con FastAPI
- Template Jinja2 per il rendering lato server
- Asset statici organizzati in `static/` (CSS, JS, immagini)
- Script di utilità per sviluppo e controllo qualità
- Predisposizione per deployment su Vercel o hosting ASGI

Requisiti
---------

- Python 3.10 o superiore
- Dipendenze listate in `requirements.txt`

Installazione
------------

1. Clonare il repository:

```bash
git clone <repo-url>
cd Parthenoweb
```

2. Creare e attivare un ambiente virtuale:

```bash
python -m venv .venv
# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate
```

3. Installare le dipendenze:

```bash
pip install -r requirements.txt
```

Avvio per sviluppo
-------------------

Avviare il server di sviluppo rapido incluso:

```bash
python start_dev_server.py
```

Oppure eseguire direttamente l'app FastAPI con Uvicorn:

```bash
uvicorn fast_api.main:app --reload --host 0.0.0.0 --port 8000
```

Esempio di avvio in produzione
-------------------------------

Usare un server compatibile ASGI (es. Gunicorn con workers Uvicorn) oppure distribuire su Vercel/Platform-as-a-Service con configurazione ASGI.

Struttura del repository (sintesi)
---------------------------------

- `fast_api/` — codice FastAPI, `main.py`, `templates/`, `email_utils.py`, `validators.py`
- `api/` — funzioni serverless o endpoint separati
- `static/` — CSS, JS, immagini
- `scripts/` — script di utilità (es. `check_links.py`)
- `requirements.txt`, `start_dev_server.py`, `vercel.json`

Configurazione e variabili d'ambiente
------------------------------------

Creare un file `.env` o impostare le variabili d'ambiente richieste prima dell'avvio. Esempi:

```
SECRET_KEY=changeme
SMTP_HOST=smtp.example.com
SMTP_USER=user@example.com
SMTP_PASS=secret
DATABASE_URL=sqlite:///./db.sqlite3
```

Per caricare automaticamente le variabili d'ambiente, si può utilizzare `python-dotenv` o il sistema di configurazione del provider di deployment.

Testing e qualità
-----------------

- Aggiungere test con `pytest` (non inclusi al momento).  
- Consigliato usare `black` e `flake8` prima dei commit.

Contatti
--------

Autore / Maintainer: Fabrizio Melluso https://github.com/BrizioFab
Andrea Preziuso https://github.com/Andre031-oss
Antonio Incoronato https://github.com/TrIckSt33r
