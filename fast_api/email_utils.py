import os
import smtplib
from email.message import EmailMessage


def send_email(nome: str, telefono: str, sender_email: str, message: str):
    """Invia un'email usando configurazione ottenuta da variabili d'ambiente.

    Variabili richieste (impostare nelle Environment Variables di Vercel):
    - EMAIL_ADDRESS
    - EMAIL_PASSWORD

    Opzionali:
    - EMAIL_HOST (default: smtp.gmail.com)
    - EMAIL_PORT (default: 587)
    """
    EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
    EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))

    EMAIL_ADDRESS = os.environ.get("EMAIL_ADDRESS")
    EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")

    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        raise RuntimeError("Missing email credentials: set EMAIL_ADDRESS and EMAIL_PASSWORD environment variables.")

    msg = EmailMessage()
    msg["Subject"] = f"Parthenoweb - {nome}"
    msg["From"] = f"{nome} <{EMAIL_ADDRESS}>"
    msg["To"] = EMAIL_ADDRESS
    msg["Reply-To"] = sender_email

    msg.set_content(
        f"Dettagli contatto:\n"
        f"Nome: {nome}\n"
        f"Telefono: {telefono}\n"
        f"Email mittente: {sender_email}\n\n"
        f"Messaggio:\n{message}"
    )

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)