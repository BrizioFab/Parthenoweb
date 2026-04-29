/**
 * COOKIE BANNER MANAGEMENT - Gestione accettazione cookie
 
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

 */

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookieBanner');
    
    if (!banner) return;

    banner.classList.add('visible');

    const acceptBtn = document.getElementById('acceptCookies');
    
    if (!acceptBtn) return;

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

