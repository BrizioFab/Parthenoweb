# Parthenoweb

Parthenoweb è un progetto web basato su **FastAPI** con rendering server-side tramite **Jinja2**.

## Requisiti

- Python 3.10+
- pip

## Installazione

```bash
pip install -r requirements.txt
```

## Avvio in sviluppo

```bash
python start_dev_server.py
```

Applicazione disponibile su: `http://localhost:8000`

## Struttura principale

- `fast_api/` → backend FastAPI, template e logica server
- `static/` → risorse statiche (CSS, JavaScript, immagini)
- `start_dev_server.py` → script di avvio locale
