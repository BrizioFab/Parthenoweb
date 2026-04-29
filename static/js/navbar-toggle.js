
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

    navToggle.addEventListener('click', toggleMenu);

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    document.addEventListener('click', function (event) {
        if (!mainNav.classList.contains('active')) return;

        const isClickInsideNav = mainNav.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });
});

