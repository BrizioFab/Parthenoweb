/**
 * COOKIE BANNER MANAGEMENT - Gestione accettazione cookie
 * ========================================================
 * 
 * COSA FA:
 * 1. Quando l'utente clicca il bottone "Accetta" nel cookie banner
 * 2. Salva lo stato su localStorage (client-side)
 * 3. Chiama API POST /api/cookies/accept per impostare cookie HTTP server-side
 * 4. Nasconde il banner con animazione fade-out
 * 5. Rimuove il banner dal DOM
 * 
 * COOKIE IMPOSTATO:
 * - Nome: cookiesAccepted
 * - Valore: "true"
 * - Durata: 1 anno (da server)
 * - Uso: main.py controlla se user ha accettato
 * 
 * FLUSSO:
 * Browser carica page → main.py verifica cookie
 * → Se NO cookie: mostra banner (base.html)
 * → Se banner visibile e user clicca "Accetta":
 *   1. localStorage.setItem('cookiesAccepted', 'true')
 *   2. fetch('/api/cookies/accept')
 *   3. banner.classList.remove('visible')
 *   4. SetTimeout → banner.remove() (dopo 500ms)
 * 
 * DA MODIFICARE:
 * - Se vuoi cambiare timing animazione: modifica setTimeout(500)
 * - Se vuoi salvare altri cookie oltre "cookiesAccepted"
 * - Se vuoi aggiungere analytics tracking qui
 * 
 * NOTE SICUREZZA:
 * - localStorage è client-side, NON confidenziale (chiunque vede browser dev tools)
 * - Il vero cookie è impostato server-side via /api/cookies/accept
 * - localStorage è solo per UX (non ricaricare page se user ha accettato)
 */

// Aspetta che il DOM sia completamente caricato prima di eseguire
document.addEventListener('DOMContentLoaded', () => {
    // STEP 1: Trova il banner nel DOM
    const banner = document.getElementById('cookieBanner');
    
    // Se banner non esiste (user ha già accettato), esci dalla funzione
    if (!banner) return;

    // STEP 2: Assicurati che il banner sia visibile (non nasconderlo al caricamento)
    // Il server lo mostra già con classe 'visible', non toccare la visibilità qui
    banner.classList.add('visible');

    // STEP 3: Trova il bottone "Accetta"
    const acceptBtn = document.getElementById('acceptCookies');
    
    // Se bottone non esiste, esci
    if (!acceptBtn) return;

    // STEP 4: Aggiungi event listener al bottone "Accetta"
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        
        fetch('/api/cookies/accept', { method: 'POST' })
            .catch(() => {});
        
        banner.classList.remove('visible');
        
        setTimeout(() => {
            banner.remove();
        }, 500);
    });
});

