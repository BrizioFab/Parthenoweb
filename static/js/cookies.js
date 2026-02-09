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

    // STEP 2: Trova il bottone "Accetta"
    const acceptBtn = document.getElementById('acceptCookies');
    
    // Se bottone non esiste, esci
    if (!acceptBtn) return;

    // STEP 3: Aggiungi event listener al bottone "Accetta"
    acceptBtn.addEventListener('click', () => {
        // STEP 3a: Salva flag su localStorage (client-side persistence)
        // Questo fa sì che se l'utente ricarica la page, il banner non riappare
        localStorage.setItem('cookiesAccepted', 'true');
        
        // STEP 3b: Chiama API server per impostare cookie HTTP
        // Endpoint: POST /api/cookies/accept (definito in main.py)
        // Questo imposta il cookie lato server per 1 anno
        fetch('/api/cookies/accept', { method: 'POST' })
            .catch(() => {
                // Se fetch fallisce (niente connessione), ignora silenziosamente
                // L'utente ha comunque accettato (localStorage), quindi OK
            });
        
        // STEP 3c: Nascondi il banner con transizione CSS
        // Rimuove classe 'visible' che mostra il banner
        // La classe 'visible' ha una transizione fade-out
        banner.classList.remove('visible');
        
        // STEP 3d: Rimuovi il banner dal DOM dopo 500ms
        // Aspetta che l'animazione fade finisca, poi elimina l'elemento
        setTimeout(() => {
            banner.remove();
        }, 500);
    });
});

