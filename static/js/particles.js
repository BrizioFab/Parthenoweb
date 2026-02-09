/**
 * SISTEMA PARTICELLE PER BACKGROUND HERO
 * =======================================
 * 
 * COSA FA:
 * Crea particelle luminose animate che galleggiano verso l'alto
 * nel background della sezione hero (in cima alla page).
 * 
 * EFFETTO VISUALE:
 * - ~40 cerchi luminosi blu/cyan
 * - Galleggiano verso l'alto continuamente
 * - Dimensioni randomiche
 * - Velocità di animazione randomica
 * - Crea atmosfera futuristica e dinamica
 * 
 * COME FUNZIONA:
 * 1. ParticleSystem class: crea e gestisce le particelle
 * 2. Ogni particella è un <div class="particle">
 * 3. CSS keyframe float-particle: animazione verso l'alto
 * 4. Randomizzazione: posizione, dimensione, velocità, delay
 * 
 * HTML RICHIESTO:
 * <div id="particles"></div>
 * (elemento con id="particles" - container delle particelle)
 * 
 * CSS NECESSARIO:
 * #particles {
 *   position: absolute;
 *   top: 0;
 *   left: 0;
 *   width: 100%;
 *   height: 100%;
 *   overflow: hidden;
 *   pointer-events: none;  // Particelle non bloccano click su elementi sotto
 * }
 * 
 * DA MODIFICARE:
 * - Numero particelle: new ParticleSystem('particles', 40) → cambia 40
 * - Colore: rgba(0, 212, 255, ...) → cambia valori RGB
 * - Durata animazione: Math.random() * 20 + 20 → 20-40 secondi
 * - Altezza movimento: window.innerHeight → quanto salgono
 * 
 * @author Parthenoweb Team
 */

/**
 * ParticleSystem CLASS - Sistema per generare e gestire particelle
 * 
 * CONSTRUCTOR PARAMETERS:
 * - containerId: ID del container dove mettere le particelle (es: "particles")
 * - particleCount: quante particelle creare (default: 30)
 * 
 * METODI:
 * - init(): crea tutte le particelle
 * - createParticle(): crea una singola particella con valori random
 */
class ParticleSystem {
    constructor(containerId, particleCount = 30) {
        // Trova l'elemento container nel DOM
        this.container = document.getElementById(containerId);
        
        // Numero di particelle da creare
        this.particleCount = particleCount;
        
        // Array che traccia tutte particelle create
        this.particles = [];

        // Se container esiste, inizializza le particelle
        if (this.container) {
            this.init();
        }
    }

    /**
     * init() - Inizializza tutto il sistema particelle
     * 
     * Crea "particleCount" particelle e le aggiunge al container
     */
    init() {
        // Loop: crea N particelle (default 30-40)
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    /**
     * createParticle() - Crea UNA singola particella
     * 
     * RANDOMIZZAZIONE:
     * - size: 1-4px (cerchi piccoli ma visibili)
     * - duration: 20-40 secondi (animazione lenta e affascinante)
     * - delay: 0-10 secondi (particelle non partono tutte insieme)
     * - startX: random orizzontale (0 a viewport width)
     * - startY: random verticale (0 a viewport height)
     * 
     * STILE APPLICATO:
     * - position: absolute (libero posizionamento)
     * - background: gradient blue/cyan radiante (effetto luminoso)
     * - box-shadow: aura luminosa intorno alla particella
     * - animation: float-particle (keyframe animazione)
     */
    createParticle() {
        // Crea un nuovo elemento <div> come particella
        const particle = document.createElement('div');
        particle.className = 'particle';

        // RANDOMIZZA PROPRIETÀ DELLA PARTICELLA
        const size = Math.random() * 3 + 1;              // 1-4 px
        const duration = Math.random() * 20 + 20;        // 20-40 secondi
        const delay = Math.random() * 10;                // 0-10 secondi
        const startX = Math.random() * window.innerWidth;    // Posizione X casuale
        const startY = Math.random() * window.innerHeight;   // Posizione Y casuale

        // APPLICA STILE INLINE ALLA PARTICELLA
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

        // Aggiungi la particella al container HTML
        this.container.appendChild(particle);

        // Traccia la particella nel nostro array (per future referenze)
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

// =====================================================================
// SEZIONE: DEFINISCI ANIMAZIONE CSS KEYFRAME
// =====================================================================
/**
 * COSA FA:
 * Aggiunge il CSS @keyframes float-particle se non esiste già.
 * Questa animazione muove le particelle verso l'alto e fa dissolvere.
 * 
 * FRAME ANIMATION:
 * 0%: y=0, opacity=0 (particella appare)
 * 10%: opacity=0.6 (raggiunge opacità massima)
 * 90%: opacity=0.6 (rimane visibile)
 * 100%: y=-viewport.height, opacity=0 (scompare verso l'alto)
 * 
 * will-change: transform (hint al browser per ottimizzare performance)
 */
if (!document.getElementById('particle-animation-style')) {
    // Crea un elemento <style> per le keyframes
    const style = document.createElement('style');
    style.id = 'particle-animation-style';  // ID per evitare duplicati
    
    style.textContent = `
        /* ANIMAZIONE FLOAT: Particella sale verso l'alto */
        @keyframes float-particle {
            0% {
                /* Inizio: posizione originale, scala normale, invisibile */
                transform: translateY(0px) translateX(0px) scale(1);
                opacity: 0;
            }
            10% {
                /* Dopo poco: raggiunge opacità massima */
                opacity: 0.6;
            }
            90% {
                /* Per la maggior parte dell'animazione: mantiene opacità */
                opacity: 0.6;
            }
            100% {
                /* Fine: salita completa, scala 0, invisibile */
                transform: translateY(-${window.innerHeight}px) translateX(${(Math.random() - 0.5) * 200}px) scale(0);
                opacity: 0;
            }
        }

        /* PERFORMANCE HINT: ottimizza animazioni transform */
        .particle {
            will-change: transform;
        }
    `;

    // Aggiungi il <style> al <head> della page
    document.head.appendChild(style);
}

// =====================================================================
// SEZIONE: INIZIALIZZAZIONE AL CARICAMENTO DELLA PAGE
// =====================================================================
/**
 * TRIGGER: Quando DOM è completamente caricato
 * AZIONE: Crea un nuovo ParticleSystem con 40 particelle
 * CONTAINER: elemento #particles nel HTML
 */
document.addEventListener('DOMContentLoaded', () => {
    // Crea il sistema particelle (40 particelle nel container #particles)
    const particleSystem = new ParticleSystem('particles', 40);

    // OPTIONAL: Listener per window resize
    // Se la finestra viene ridimensionata, potremmo ricreareParticles
    // Ma attualmente dormiente (no code nell'handler)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // TODO: Se necessario, ricregli particelle qui
            // Per ora, particelle si adattano responsivamente via CSS
        }, 250);
    });
});
