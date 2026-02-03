/**
 * BANNER COOKIE CONSENT
 * ======================
 * 
 * - Banner consenso cookie (solo cookie tecnici)
 * - Salvataggio preferenza in localStorage
 * - Percorsi relativi dinamici (root / pages/)
 * - Auto-show con delay per user experience
 * 
 * @author Parthenoweb Team
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user already accepted
    if (localStorage.getItem('cookiesAccepted')) {
        return;
    }

    // Detect path for relative links
    const path = window.location.pathname;
    const isPagesDir = path.includes('/pages/');

    // Define base paths
    const cookiePolicyLink = isPagesDir ? 'cookies.html' : 'pages/cookies.html';

    // Create Banner HTML
    const bannerHTML = `
        <div id="cookieBanner" class="cookie-banner">
            <div class="cookie-content">
                <h3>Rispetto della tua Privacy</h3>
                <p>Utilizziamo solo cookie tecnici essenziali per il corretto funzionamento del sito. Non effettuiamo profilazione né tracciamento pubblicitario.</p>
            </div>
            <div class="cookie-actions">
                <a href="${cookiePolicyLink}" class="nav-link">Cookie Policy</a>
                <button id="acceptCookies" class="btn-accept">Accetta</button>
            </div>
        </div>
    `;

    // Inject into body
    document.body.insertAdjacentHTML('beforeend', bannerHTML);

    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');

    // Show banner after a slight delay
    setTimeout(() => {
        banner.classList.add('visible');
    }, 500);

    // Handle Acceptance
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.classList.remove('visible');
        // Optional: Remove from DOM after transition
        setTimeout(() => {
            banner.remove();
        }, 500);
    });
});
