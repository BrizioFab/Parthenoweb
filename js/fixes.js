document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.service-card');
    if (!cards || !cards.length) return;

    // If AOS isn't present, reveal cards immediately
    if (!window.AOS) {
        cards.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
    }

    // IntersectionObserver: ensure cards become visible and have fallback inline styles
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        cards.forEach(c => obs.observe(c));
    } else {
        // Older browsers fallback
        cards.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
    }
});

// Testing Github
