"""
EMAIL UTILITIES - Modulo per invio email via SMTP
==================================================
Questo modulo gestisce l'invio di email tramite un server SMTP esterno.

CONFIGURAZIONE:
Le credenziali email sono lette dalle VARIABILI D'AMBIENTE (Vercel Settings):
- EMAIL_ADDRESS: indirizzo email mittente (es: noreply@tuodominio.com)
- EMAIL_PASSWORD: password app (NON la password account!)
- EMAIL_HOST: server SMTP (default: smtp.gmail.com per Gmail)
- EMAIL_PORT: porta SMTP (default: 587 per Gmail)

⚠️ IMPORTANTE - CREDENZIALI SICURE:
NON mettere mai password nel codice!
Imposta le variabili in Vercel Dashboard → Settings → Environment Variables

SETUP PER GMAIL:
1. Attiva autenticazione 2-step su account Google
2. Vai a https://myaccount.google.com/apppasswords
3. Genera "App Password" per "Mail" su "Windows Computer"
4. Copia password e mettila come EMAIL_PASSWORD su Vercel
5. Email account è EMAIL_ADDRESS
"""

import os
import smtplib
from email.message import EmailMessage


def send_email(nome: str, telefono: str, sender_email: str, message: str):
    """
    Invia una email tramite SMTP
    
    PARAMETRI:
    -----------
    nome (str): Nome mittente (da contatti)
    telefono (str): Numero telefono (richiesto nel form ma può essere None)
    sender_email (str): Email risposta (email del cliente)
    message (str): Corpo del messaggio
    
    RITORNO:
    --------
    None (se successo)
    
    ECCEZIONI:
    ----------
    RuntimeError: Se mancano EMAIL_ADDRESS o EMAIL_PASSWORD
    smtplib.SMTPException: Se fallisce la connessione SMTP
    
    FLUSSO:
    -------
    1. Leggi credenziali da variabili d'ambiente
    2. Crea oggetto EmailMessage con intestazione
    3. Connetti a server SMTP
    4. Autentica con credenziali
    5. Invia messaggio
    6. Chiudi connessione
    
    DA MODIFICARE:
    - Se vuoi cambiare subject: modifica msg["Subject"]
    - Se vuoi cambiare formato email: modifica msg.set_content()
    - Se usi provider diverso da Gmail: cambia EMAIL_HOST e EMAIL_PORT
    
    ESEMPIO DI VARIABILI D'AMBIENTE DA IMPOSTARE:
    EMAIL_HOST = smtp.gmail.com
    EMAIL_PORT = 587
    EMAIL_ADDRESS = noreply@parthenoweb.it
    EMAIL_PASSWORD = tuaapppassword1234
    """
    
    # STEP 1: Leggi credenziali dalle variabili d'ambiente
    # Se non sono impostate, usa default (Gmail)
    EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
    EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))

    EMAIL_ADDRESS = os.environ.get("EMAIL_ADDRESS")
    EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")

    # Valida che credenziali siano impostate
    # Se mancano, lancia errore chiaro per il debug
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        raise RuntimeError(
            "❌ Credenziali email non configurate!\n"
            "Imposta le variabili d'ambiente su Vercel:\n"
            "- EMAIL_ADDRESS (es: noreply@tuodominio.com)\n"
            "- EMAIL_PASSWORD (app password, NON password account)\n"
            "Link: https://myaccount.google.com/apppasswords"
        )

    # STEP 2: Crea oggetto EmailMessage (standard Python)
    msg = EmailMessage()
    
    # Imposta intestazione email (visibile nel client email)
    msg["Subject"] = f"Parthenoweb - {nome}"  # Oggetto con nome mittente
    msg["From"] = f"{nome} <{EMAIL_ADDRESS}>"  # Mittente visualizzato
    msg["To"] = EMAIL_ADDRESS                   # Destinatario (la tua email)
    msg["Reply-To"] = sender_email              # Quando rispondi, va a client email

    # STEP 3: Crea corpo del messaggio in testo semplice
    # Mostra tutti i dati del contatto
    msg.set_content(
        f"Dettagli contatto:\n"
        f"Nome: {nome}\n"
        f"Telefono: {telefono}\n"
        f"Email mittente: {sender_email}\n\n"
        f"Messaggio:\n{message}"
    )

    # STEP 4: Connessione SMTP e invio
    # with: context manager che chiude la connessione automaticamente
    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        # SMTP di Gmail richiede TLS encryption
        server.starttls()  # Abilita crittografia
        
        # Login con credenziali
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        
        # Invia il messaggio
        server.send_message(msg)
    
    # Se arriviamo qui, email è stata inviata con successo!
    # Non return niente (return None di default)
