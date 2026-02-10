"""
VALIDATORI FORM - Modulo per validare input utente lato server
================================================================
Questo modulo contiene la classe FormValidator che valida i dati
del form contatti prima dell'invio email.

PERCHÉ VALIDARE SUL SERVER?
- Sicurezza: l'utente non può falsificare i dati
- Backup: client-side validation può essere bypassata
- Affidabilità: garantisci sempre dati validi

COME FUNZIONA:
1. Ogni campo ha un metodo validate_XXX(valore) -> Optional[str]
   - Se valido: ritorna None
   - Se invalido: ritorna messaggio errore in italiano
2. validate_all() chiama tutti i validatori e ritorna lista errori
3. Se lista vuota: tutto OK!

MODIFICARE QUANDO:
- Aggiungi nuovi campi del form
- Cambi regexe di validazione
- Cambi limiti di caratteri
"""

import re
from typing import Optional, List


class FormValidator:
    """
    Classe con metodi statici per validare campi form contatti.
    
    Ogni metodo prende il valore e ritorna:
    - None se valido
    - Stringa errore se invalido
    
    METODI DISPONIBILI:
    - validate_nome(nome) → valida nome 2-100 caratteri
    - validate_email(email) → valida formato email
    - validate_telefono(telefono) → valida telefono (facoltativo)
    - validate_descrizione(descrizione) → valida testo 10-1000 char
    - validate_all() → valida tutti i campi contemporaneamente
    """
    
    @staticmethod
    def validate_nome(nome: str) -> Optional[str]:
        r"""
        Valida il campo NOME del form
        
        REGOLE:
        -------
        ✓ Minimo 2 caratteri (trim spazi)
        ✓ Massimo 100 caratteri
        ✓ Solo lettere (a-z, A-Z, accenti), spazi
        ✗ NO numeri, sintassi, special character
        
        REGEX USATO:
        ^[a-zA-Zà-ùÀ-Ù\s]{2,100}$
        - a-z: lettere minuscole
        - A-Z: lettere maiuscole
        - à-ù: accenti minuscoli (es: à, é, ì, ù, ò)
        - À-Ù: accenti maiuscoli
        - \s: spazi (space character)
        - {2,100}: lunghezza 2-100 caratteri
        
        ESEMPI VALIDI:
        ✓ "Giovanni"
        ✓ "Maria Rossi"
        ✓ "André"
        ✓ "Francesco D'Andrea"
        
        ESEMPI INVALIDI:
        ✗ "A" (troppo corto)
        ✗ "Giovanni123" (contiene numeri)
        ✗ "Giovanni@" (contiene simboli)
        
        RITORNA:
        --------
        None se valido, altrimenti messaggio errore
        """
        # Controlla lunghezza base
        if not nome or len(nome.strip()) < 2:
            return "Il nome deve avere almeno 2 caratteri"
        if len(nome) > 100:
            return "Il nome non può superare 100 caratteri"
        
        # Controlla che contiene SOLO lettere e spazi (con accenti)
        # to match: caratteri italiani, accenti, spazi
        if not re.match(r"^[a-zA-Zà-ùÀ-Ù\s]{2,100}$", nome):
            return "Il nome può contenere solo lettere e spazi"
        
        return None  # Tutto OK!
    
    @staticmethod
    def validate_email(email: str) -> Optional[str]:
        r"""
        Valida il campo EMAIL del form
        
        REGOLE:
        -------
        ✓ Email non vuota
        ✓ Formato email valido (RFC 5322 semplificato)
        ✓ Massimo 120 caratteri (limite server)
        
        REGEX USATO:
        ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
        
        BREAKDOWN:
        [a-zA-Z0-9._%+-]+  = parte prima @ (user@)
        @                  = simbolo @
        [a-zA-Z0-9.-]+     = dominio (example.com)
        \.                 = punto letterale
        [a-zA-Z]{2,}       = TLD almeno 2 lettere (.com, .it, .co.uk)
        
        ESEMPI VALIDI:
        ✓ "user@example.com"
        ✓ "name.surname@domain.co.uk"
        ✓ "user+tag@example.com"
        
        ESEMPI INVALIDI:
        ✗ "" (vuota)
        ✗ "notanemail" (senza @)
        ✗ "user@.com" (dominio vuoto)
        ✗ "user@domain" (senza TLD)
        
        RITORNA:
        --------
        None se valido, altrimenti messaggio errore
        """
        if not email:
            return "L'email è obbligatoria"
        
        # Pattern email RFC 5322 semplificato
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, email):
            return "Inserisci un'email valida"
        
        if len(email) > 120:
            return "L'email non può superare 120 caratteri"
        
        return None  # Tutto OK!
    
    @staticmethod
    def validate_telefono(telefono: Optional[str]) -> Optional[str]:
        r"""
        Valida il campo TELEFONO del form (FACOLTATIVO)
        
        REGOLE:
        -------
        ⚠️ FACOLTATIVO: se vuoto, è sempre valido (ritorna None)
        ✓ Se presente: minimo 5 cifre
        ✓ Se presente: massimo 20 caratteri
        ✓ Può contenere solo: numeri, spazi, +, -, (, )
        ✗ NO lettere
        
        REGEX USATO (se presente):
        ^[0-9\s\+\-\(\)]{5,20}$
        
        BREAKDOWN:
        [0-9]    = cifre 0-9
        \s       = spazi
        \+       = più (escaped perché special char)
        \-       = meno (escaped)
        \(\)     = parentesi (escaped)
        {5,20}   = lunghezza 5-20 caratteri
        
        ESEMPI VALIDI:
        ✓ "" (vuoto - facoltativo!)
        ✓ "12345"
        ✓ "+39 123 456 7890"
        ✓ "06-1234567"
        ✓ "(06) 1234567"
        
        ESEMPI INVALIDI:
        ✗ "123" (troppo corto: < 5)
        ✗ "123456789012345678901" (troppo lungo: > 20)
        ✗ "123abc" (contiene lettere)
        
        RITORNA:
        --------
        None se valido (incluso se vuoto), altrimenti messaggio errore
        """
        # Se vuoto/None: è facoltativo, quindi valido
        if not telefono or telefono.strip() == "":
            return None  # VALIDO - è facoltativo!
        
        telefono = telefono.strip()
        
        # Se presente, controlla lunghezza minima
        if len(telefono) < 5:
            return "Il telefono deve avere almeno 5 cifre"
        
        # Controlla lunghezza massima
        if len(telefono) > 20:
            return "Il telefono non può superare 20 caratteri"
        
        # Controlla che contiene SOLO numeri, spazi, +, -, (, )
        if not re.match(r"^[0-9\s\+\-\(\)]{5,20}$", telefono):
            return "Il telefono può contenere solo numeri, spazi e simboli +, -, ()"
        
        return None  # Tutto OK!
    
    @staticmethod
    def validate_descrizione(descrizione: str) -> Optional[str]:
        """
        Valida il campo DESCRIZIONE / MESSAGGIO del form
        
        REGOLE:
        -------
        ✓ Minimo 10 caratteri (trim spazi)
        ✓ Massimo 1000 caratteri
        ✓ Può contenere qualsiasi carattere (lettere, numeri, punteggiatura)
        
        NOTA: Non usiamo regex qui, solo controllo lunghezza
        perché vogliamo permettere praticamente qualsiasi testo
        
        ESEMPI VALIDI:
        ✓ "Cerco un sito web moderno..."
        ✓ "Mi interessa un logo per il mio brand!"
        ✓ "Contattami per una consulenza, grazie!"
        
        ESEMPI INVALIDI:
        ✗ "ciao!!!" (3 caratteri)
        ✗ "A" * 1001 (1001 caratteri - troppo)
        
        RITORNA:
        --------
        None se valido, altrimenti messaggio errore
        """
        if not descrizione or len(descrizione.strip()) < 10:
            return "La descrizione deve avere almeno 10 caratteri"
        
        if len(descrizione) > 1000:
            return "La descrizione non può superare 1000 caratteri"
        
        return None  # Tutto OK!
    
    @staticmethod
    def validate_all(nome: str, email: str, descrizione: str, telefono: Optional[str] = None) -> List[str]:
        """
        Valida TUTTI i campi del form simultaneamente
        
        PARAMETRI:
        ----------
        nome (str): campo nome
        email (str): campo email
        descrizione (str): campo descrizione/messaggio
        telefono (Optional[str]): campo telefono (facoltativo, default=None)
        
        RITORNA:
        --------
        List[str]: Lista di messaggi di errore
        - Se lista VUOTA []: tutto è valido!
        - Se lista ha elementi: contiene errori da mostrare all'utente
        
        FLUSSO:
        -------
        1. Crea lista errori vuota
        2. Chiama validate_nome() e aggiungi errore se non None
        3. Chiama validate_email() e aggiungi errore se non None
        4. Chiama validate_telefono() e aggiungi errore se non None
        5. Chiama validate_descrizione() e aggiungi errore se non None
        6. Ritorna lista errori (vuota = tutto OK)
        
        ESEMPIO D'USO:
        errors = FormValidator.validate_all("Giovanni", "user@example.com", "Mi...", "+39123456789")
        if errors:
            # Mostra errori
            for err in errors:
                print(f"❌ {err}")
        else:
            # Tutto OK, procedi
            print("✅ Form valido!")
        """
        errors = []
        
        # Valida nome
        err = FormValidator.validate_nome(nome)
        if err:
            errors.append(err)
        
        # Valida email
        err = FormValidator.validate_email(email)
        if err:
            errors.append(err)
        
        # Valida telefono (facoltativo)
        if telefono:
            err = FormValidator.validate_telefono(telefono)
            if err:
                errors.append(err)
        
        # Valida descrizione
        err = FormValidator.validate_descrizione(descrizione)
        if err:
            errors.append(err)
        
        # Ritorna lista errori (vuota se tutto OK)
        return errors
