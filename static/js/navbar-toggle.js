/**
 * NAVBAR MOBILE TOGGLE (Minimalista)
 * Solo gestione menu hamburger lato client
 */

document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        // Toggle menu
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
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
        mainNav.querySelectorAll('a').forEach(link => {
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
