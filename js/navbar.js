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
        <div class="container nav-container">
            <a href="${homeLink}" class="logo">
                <img src="${logoSrc}" alt="Logo Parthenoweb" class="logo-img" />
                <span class="logo-text">
                    <span class="logo-partheno">Partheno</span><span class="logo-web">web</span>
                </span>
            </a>
            <nav class="main-nav">
                <a href="${homeLink}" class="nav-link ${isActive('index.html')}">Home</a>
                <a href="${portfolioLink}" class="nav-link ${isActive('portfolio.html')}">Portfolio</a>
                <a href="${contactLink}" class="nav-link nav-cta ${isActive('contattaci.html')}">Contattaci</a>
            </nav>
        </div>
    </header>
    `;

    navbarPlaceholder.innerHTML = navHTML;
});
