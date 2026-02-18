
import os
import smtplib
from email.message import EmailMessage


def send_email(nome: str, telefono: str, sender_email: str, message: str):
    
    EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
    EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))

    EMAIL_ADDRESS = os.environ.get("EMAIL_ADDRESS")
    EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")

    
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        raise RuntimeError(
            "❌ Credenziali email non configurate!\n"
        )

   
    msg = EmailMessage()
    
 
    msg["Subject"] = f"Nuova richiesta da Parthenoweb - {nome}"  # Oggetto con nome mittente
    msg["From"] = f"{nome} <{EMAIL_ADDRESS}>"  # Mittente visualizzato
    msg["To"] = EMAIL_ADDRESS                   # Destinatario (la tua email)
    msg["Reply-To"] = sender_email              # Quando rispondi, va a client email


    msg.set_content(
        f"Dettagli contatto:\n"
        f"Nome: {nome}\n"
        f"Telefono: {telefono}\n"
        f"Email mittente: {sender_email}\n\n"
        f"Messaggio:\n{message}"
    )

    
    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        # SMTP di Gmail richiede TLS encryption
        server.starttls()  # Abilita crittografia
        
        # Login con credenziali
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        
        # Invia il messaggio
        server.send_message(msg)
