
import smtplib
from email.message import EmailMessage 

def send_email(nome: str, telefono: str, sender_email: str, message: str):
    EMAIL_HOST = "smtp.gmail.com"
    EMAIL_PORT = 587

   
    EMAIL_ADDRESS = "parthenoweb@gmail.com" 
    EMAIL_PASSWORD = "zolb pwah vetx lyvx" # Usa la password per le app di Google

    msg = EmailMessage()
    msg["Subject"] = f"Parthenoweb - {nome}"
    msg["From"] = f"{nome} <{EMAIL_ADDRESS}>"
    msg["To"] = EMAIL_ADDRESS # Ricevi l'email a te stesso

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