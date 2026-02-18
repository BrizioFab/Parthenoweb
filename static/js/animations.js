





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





window.addEventListener('scroll', () => {
    
    const scrolled = window.pageYOffset;
    
    
    const parallaxElements = document.querySelectorAll('.hero-gradient-1, .hero-gradient-2');

    
    parallaxElements.forEach((element, index) => {
        
        const speed = (index + 1) * 0.5;
        
        
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });

    
    
    
    
    const hero = document.querySelector('.hero');
    if (hero) {
        
        const scrollPercentage = Math.min(scrolled / (window.innerHeight * 0.8), 1);
        
        
        
        const opacity = Math.max(1 - scrollPercentage * 0.3, 0.3);
        
        
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





const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
    navToggle.addEventListener('click', function () {
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            mainNav.classList.toggle('active');
        }
    });
}


document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            mainNav.classList.remove('active');
        }
    });
});



