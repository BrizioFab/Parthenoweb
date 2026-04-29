
import re
from typing import Optional, List


class FormValidator:
    
    @staticmethod
    def validate_nome(nome: str) -> Optional[str]:
        if not nome or len(nome.strip()) < 2:
            return "Il nome deve avere almeno 2 caratteri"
        if len(nome) > 20:
            return "Il nome non può superare 50 caratteri"
        
        if not re.match(r"^[a-zA-Zà-ùÀ-Ù\s]{2,50}$", nome):
            return "Il nome può contenere solo lettere e spazi"
        
        return None
    
    @staticmethod
    def validate_email(email: str) -> Optional[str]:
        if not email:
            return "L'email è obbligatoria"
        
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, email):
            return "Inserisci un'email valida"
        
        if len(email) > 60:
            return "L'email non può superare 60 caratteri"
        
        return None
    
    @staticmethod
    def validate_telefono(telefono: Optional[str]) -> Optional[str]:
        if not telefono or telefono.strip() == "":
            return None
        
        telefono = telefono.strip()
        
        if len(telefono) < 5:
            return "Il telefono deve avere almeno 5 cifre"
        
        if len(telefono) > 20:
            return "Il telefono non può superare 20 caratteri"
        
        if not re.match(r"^[0-9\s\+\-\(\)]{5,20}$", telefono):
            return "Il telefono può contenere solo numeri, spazi e simboli +, -, ()"
        
        return None
    
    @staticmethod
    def validate_descrizione(descrizione: str) -> Optional[str]:
        if not descrizione or len(descrizione.strip()) < 10:
            return "La descrizione deve avere almeno 10 caratteri"
        
        if len(descrizione) > 1000:
            return "La descrizione non può superare 1000 caratteri"
        
        return None
    
    @staticmethod
    def validate_all(nome: str, email: str, descrizione: str, telefono: Optional[str] = None) -> List[str]:
        errors = []
        
        err = FormValidator.validate_nome(nome)
        if err:
            errors.append(err)
        
        err = FormValidator.validate_email(email)
        if err:
            errors.append(err)
        
        if telefono:
            err = FormValidator.validate_telefono(telefono)
            if err:
                errors.append(err)
        
        err = FormValidator.validate_descrizione(descrizione)
        if err:
            errors.append(err)
        
        return errors
