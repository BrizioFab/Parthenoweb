/**
 * NAVBAR MOBILE TOGGLE - Menu hamburger per mobile
 * ================================================
 * 
 * COSA FA:
 * Gestisce il menu di navigazione su dispositivi mobile (<768px).
 * Quando la navbar è troppo stretta per contenere tutti i link,
 * viene nascosta un menu hamburger (☰) che l'utente può cliccare
 * per mostrare/nascondere il menu.
 * 
 * FUNZIONALITÀ:
 * 1. Click sul bottone hamburger → toggle class 'active' al menu
 * 2. Click su link del menu → chiudi menu
 * 3. Click fuori dal menu → chiudi menu
 * 4. Il bottone hamburgher cambia stile quando il menu è aperto
 * 
 * CSS ASSOCIATO:
 * Vedi styles.css:
 * - .nav-toggle { display: none; } (nascosto su desktop)
 * - @media (max-width: 768px) { .nav-toggle { display: block; } }
 * - .main-nav.active { display: flex; } (mostra menu quando active)
 * 
 * SELETTORI USATI:
 * - .nav-toggle: bottone hamburger
 * - .main-nav: contenitore menu
 * - .nav-link: link singoli nel menu
 * 
 * DA MODIFICARE:
 * - Se cambi classe CSS del menu/toggle
 * - Se vuoi aggiungere animazione al bottone
 * - Se vuoi cambiare comportamento e/o trigger
 */

// Aspetta che DOM sia pronto prima di cercare elementi
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');  // Bottone hamburger
    const mainNav = document.querySelector('.main-nav');      // Menu navigazione

    if (!navToggle || !mainNav) return;
    if (navToggle.dataset.bound === 'true') return;
    navToggle.dataset.bound = 'true';

    const icon = navToggle.querySelector('i');

    function openMenu() {
        navToggle.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        mainNav.classList.add('active');
        mainNav.setAttribute('aria-hidden', 'false');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }

    function closeMenu() {
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        mainNav.setAttribute('aria-hidden', 'true');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        if (mainNav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // EVENT 1: Click sul bottone hamburger → Toggle menu open/close
    navToggle.addEventListener('click', toggleMenu);

    // EVENT 2: Click su link del menu → Chiudi menu automaticamente
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // EVENT 3: Click FUORI dal menu → Chiudi il menu
    document.addEventListener('click', function (event) {
        if (!mainNav.classList.contains('active')) return;

        const isClickInsideNav = mainNav.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle) {
            closeMenu();
        }
    });

    // EVENT 4: ESC → Chiudi menu
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });
});

