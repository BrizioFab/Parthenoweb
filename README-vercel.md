Istruzioni rapide per il deploy su Vercel

- `vercel.json` è configurato per usare il runtime Python 3.11 per i file in `api/*.py`.
- Assicurati che `requirements.txt` contenga tutte le dipendenze (FastAPI è già presente).

Suggerimenti:
1. Se vuoi che la funzione principale sia alla root `/api`, rinomina o modifica `api/index.py` per esportare `app` oppure usa `api/entrypoint.py`.
2. Deploy rapido:
   - Installa Vercel CLI: `npm i -g vercel`
   - Esegui: `vercel` nella directory del progetto e segui le istruzioni.

Nota: Vercel installerà automaticamente le dipendenze presenti in `requirements.txt` con il runtime Python specificato in `vercel.json`.

Test locale rapido:

- Crea un virtualenv nella cartella del progetto:

```powershell
python -m venv .venv
```

- Attiva l'ambiente (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

- Installa le dipendenze e avvia il server:

```powershell
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8000
```

Apri `http://localhost:8000` per verificare il funzionamento.
