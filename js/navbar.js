/**
 * NAVBAR DINAMICA CON MENU RESPONSIVE
 * ====================================
 * 
 * - Genera navbar da JavaScript per consistenza multi-pagina
 * - Detection automatica percorso (root vs /pages/)
 * - Hamburger menu per mobile (< 768px)
 * - Auto-close menu al click su link
 * - Click fuori per chiudere menu mobile
 * 
 * @author Parthenoweb Team
 */

document.addEventListener('DOMContentLoaded', function () {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) return;

    // Detect if we are in the 'pages' directory
    const path = window.location.pathname;
    const isPagesDir = path.includes('/pages/');
    const pageName = path.split('/').pop() || 'index.html';

    // Define base paths
    const rootPrefix = isPagesDir ? '../' : '';

    // Links
    const homeLink = rootPrefix + 'index.html';
    const portfolioLink = isPagesDir ? 'portfolio.html' : 'pages/portfolio.html';
    const contactLink = isPagesDir ? 'contattaci.html' : 'pages/contattaci.html';

    // Assets
    const logoSrc = rootPrefix + 'assets/images/Logo Sfondato.webp';

    // Highlight active link
    const isActive = (name) => {
        if (pageName === name) return 'active';
        if (pageName === '' && name === 'index.html') return 'active'; // Root handling
        return '';
    };

    const navHTML = `
    <header class="site-header">
        <div class="nav-container">
            <div class="container" style="display: flex; align-items: center; justify-content: space-between; height: 100%;">
                <a href="${homeLink}" class="logo">
                    <img src="${logoSrc}" alt="Logo Parthenoweb" class="logo-img" />
                    <span class="logo-text">
                        <span class="logo-partheno">Partheno</span><span class="logo-web">web</span>
                    </span>
                </a>
                <button class="nav-toggle" aria-label="Toggle menu">☰</button>
                <nav class="main-nav">
                    <a href="${homeLink}" class="nav-link ${isActive('index.html')}">Home</a>
                    <a href="${portfolioLink}" class="nav-link ${isActive('portfolio.html')}">Portfolio</a>
                    <button class="nav-cta" onclick="window.location.href='${contactLink}'">Contattaci</button>
                </nav>
            </div>
        </div>
    </header>
    `;

    navbarPlaceholder.innerHTML = navHTML;

    // Mobile menu toggle functionality
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            const isActive = mainNav.classList.contains('active');
            if (isActive) {
                mainNav.classList.remove('active');
                navToggle.classList.remove('open');
            } else {
                mainNav.classList.add('active');
                navToggle.classList.add('open');
            }
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                navToggle.classList.remove('open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);
            if (!isClickInsideNav && !isClickOnToggle) {
                mainNav.classList.remove('active');
                navToggle.classList.remove('open');
            }
        });
    }
});

