/**
 * COOKIE BANNER MANAGEMENT (Minimalista)
 * Gestione accettazione cookie via localStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;

    // Check localStorage
    const acceptBtn = document.getElementById('acceptCookies');
    if (!acceptBtn) return;

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        // Also set HTTP cookie via API
        fetch('/api/cookies/accept', { method: 'POST' })
            .catch(() => {}); // Silent fail
        
        // Hide banner with transition
        banner.classList.remove('visible');
        setTimeout(() => {
            banner.remove();
        }, 500);
    });
});
