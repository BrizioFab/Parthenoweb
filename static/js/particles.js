


class ParticleSystem {
    constructor(containerId, particleCount = 30) {
        
        this.container = document.getElementById(containerId);
        
        
        this.particleCount = particleCount;
        
        
        this.particles = [];

        
        if (this.container) {
            this.init();
        }
    }

    
    init() {
        
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    
    createParticle() {
        
        const particle = document.createElement('div');
        particle.className = 'particle';

        
        const size = Math.random() * 3 + 1;              
        const duration = Math.random() * 20 + 20;        
        const delay = Math.random() * 10;                
        const startX = Math.random() * window.innerWidth;    
        const startY = Math.random() * window.innerHeight;   

        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.8), rgba(0, 212, 255, 0.3));
            border-radius: 50%;
            left: ${startX}px;
            top: ${startY}px;
            opacity: 0.6;
            box-shadow: 0 0 ${size * 5}px rgba(0, 212, 255, 0.5);
            animation: float-particle ${duration}s linear ${delay}s infinite;
            pointer-events: none;
        `;

        
        this.container.appendChild(particle);

        
        this.particles.push({
            element: particle,
            size,
            duration,
            delay,
            x: startX,
            y: startY
        });
    }
}





if (!document.getElementById('particle-animation-style')) {
    
    const style = document.createElement('style');
    style.id = 'particle-animation-style';  
    
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0px) translateX(0px) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            90% {
                opacity: 0.6;
            }
            100% {
                transform: translateY(-${window.innerHeight}px) translateX(${(Math.random() - 0.5) * 200}px) scale(0);
                opacity: 0;
            }
        }

        .particle {
            will-change: transform;
        }
    `;

    
    document.head.appendChild(style);
}





document.addEventListener('DOMContentLoaded', () => {
    
    const particleSystem = new ParticleSystem('particles', 40);

    
    
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            
            
        }, 250);
    });
});
