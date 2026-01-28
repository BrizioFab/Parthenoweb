// Advanced Animations & Interactions

// Smooth Scroll Enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Parallax Effect on Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-gradient-1, .hero-gradient-2');
    
    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });

    // Fade Hero on Scroll
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPercentage = Math.min(scrolled / (window.innerHeight * 0.8), 1);
        const opacity = Math.max(1 - scrollPercentage * 0.3, 0.3);
        hero.style.opacity = opacity;
    }
});

// Add stagger animation to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.setProperty('--delay', `${index * 100}ms`);
});

// Button Ripple Effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Mobile Menu Toggle (if exists)
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
    navToggle.addEventListener('click', function() {
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            mainNav.classList.toggle('active');
        }
    });
}

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            mainNav.classList.remove('active');
        }
    });
});

console.log('Animations initialized');
