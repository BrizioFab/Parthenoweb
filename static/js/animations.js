/**
 * ANIMAZIONI AVANZATE E INTERAZIONI
 * ================================
 * 
 * Questo file contiene tutti gli effetti visivi e animazioni
 
 * EFFETTI IMPLEMENTATI:
 * 1. Smooth Scroll: Scroll fluido verso gli anchor link (#sezione)
 * 2. Parallax Effect: Elementi si muovono a velocità diverse durante scroll
 * 3. Hero Fade: L'hero section svanisce man mano che l'utente scrolla
 * 4. Stagger Animation: Card di servizi appaiono con ritardo sfalsato
 * 5. Button Ripple: Effetto "onda" al click su pulsanti
 * 6. Mobile Menu Toggle: Gestisce menu hamburger /** */
 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        
        const href = this.getAttribute('href');
        
        
        if (href !== '#') {
            e.preventDefault(); 
            
            
            const target = document.querySelector(href);
            
            if (target) {
                // Offset per la navbar 
                const headerOffset = 80;
                
                // Posizione dell'elemento rispetto al viewport
                const elementPosition = target.getBoundingClientRect().top;
                
                // Posizione finale 
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Scrolla verso la posizione con animazione fluida
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'  
                });
            }
        }
    });
});

window.addEventListener('scroll', () => {
    // Ottieni quanto l'utente ha scrollato 
    const scrolled = window.pageYOffset;
    
    
    const parallaxElements = document.querySelectorAll('.hero-gradient-1, .hero-gradient-2');

    // Per ogni gradient, applica transform con velocità diversa
    parallaxElements.forEach((element, index) => {
        
        const speed = (index + 1) * 0.5;
        
        // Applica transform Y: più l'utente scrolla, più si muove
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });

    
    const hero = document.querySelector('.hero');
    if (hero) {
        
        const scrollPercentage = Math.min(scrolled / (window.innerHeight * 0.8), 1);
        
        // Converti in opacity: da 1.0 a 0.3 mentre scrolla
        const opacity = Math.max(1 - scrollPercentage * 0.3, 0.3);
        
        // Applica opacity all'elemento
        hero.style.opacity = opacity;
    }
});


const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    
    card.style.setProperty('--delay', `${index * 100}ms`);
});


document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
       
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