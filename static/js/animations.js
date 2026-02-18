/**
 * ANIMAZIONI AVANZATE E INTERAZIONI
 * ================================
 * 
 * Questo file contiene tutti gli effetti visivi e animazioni
 * che migliorano l'esperienza utente e la presentazione del sito.
 * 
 * EFFETTI IMPLEMENTATI:
 * 1. Smooth Scroll: Scroll fluido verso gli anchor link (#sezione)
 * 2. Parallax Effect: Elementi si muovono a velocità diverse durante scroll
 * 3. Hero Fade: L'hero section svanisce man mano che l'utente scrolla
 * 4. Stagger Animation: Card di servizi appaiono con ritardo sfalsato
 * 5. Button Ripple: Effetto "onda" al click su pulsanti
 * 6. Mobile Menu Toggle: Gestisce menu hamburger
 * 
 * PERFORMANCE NOTE:
 * - window.addEventListener('scroll') può essere pesante
 * - Usa requestAnimationFrame per migliorare performance se necessario
 * - Attualmente non implementato (browser moderni lo gestiscono bene)
 * 
 * CSS DIPENDENTE:
 * - Vedi styles.css per animazioni CSS associate
 * - Vedi fixes.css per patch browser compatibility
 * 
 * DA MODIFICARE:
 * - Se cambi classi CSS dei selettori
 * - Se aggiungi/rimuovi effetti
 * - Se vuoi regolare velocità/timing degli effetti
 */

// =====================================================================
// EFFETTO 1: SMOOTH SCROLL - Scroll fluido verso gli anchor link
// =====================================================================
/**
 * COSA FA:
 * Quando clicchi un link con href="#sezione", anziché saltare 
 * istantaneamente, la page scrolla verso di esso con animazione fluida.
 * 
 * AGGIUNTIVAMENTE:
 * Offset della navbar: Dato che la navbar è fixed in cima,
 * lo scroll si ferma 80px sopra l'elemento per non coprire il contenuto.
 * 
 * HTML ESEMPIO:
 * <a href="#servizi">Vai a Servizi</a>
 * <section id="servizi">Servizi...</section>
 * 
 * DA MODIFICARE:
 * - headerOffset = 80 → cambia questo numero per offset diverso
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Ottieni l'href del link (es: "#servizi")
        const href = this.getAttribute('href');
        
        // Se href è solo "#", ignora (non è un anchor valido)
        if (href !== '#') {
            e.preventDefault(); // Prevenisci il jump istantaneo
            
            // Trova l'elemento con id corrispondente all'href
            const target = document.querySelector(href);
            
            if (target) {
                // Offset per la navbar fixed (80px di altezza)
                const headerOffset = 80;
                
                // Posizione dell'elemento rispetto al viewport
                const elementPosition = target.getBoundingClientRect().top;
                
                // Posizione finale (elemento + scroll attuale - offset)
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Scrolla verso la posizione con animazione fluida
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'  // Animazione fluida (non istantanea)
                });
            }
        }
    });
});

// =====================================================================
// EFFETTO 2: PARALLAX EFFECT - Elementi si muovono diversamente al scroll
// =====================================================================
/**
 * COSA FA:
 * Gli elementi '.hero-gradient-1' e '.hero-gradient-2' si muovono
 * a velocità diverse durante lo scroll, creando un effetto di profondità.
 * 
 * VISIVAMENTE:
 * Quando scrolla, le forme colorate del background si muovono
 * più lentamente del resto della page (parallax effect).
 * 
 * SELETTORI:
 * - .hero-gradient-1 e .hero-gradient-2: elementi nel CSS
 * - Devono ESISTERE nell'HTML altrimenti niente accade
 * 
 * DA MODIFICARE:
 * - Selettori: cambia '.hero-gradient-1, .hero-gradient-2'
 * - Speed: modifica (index + 1) * 0.5 per velocità diversa
 *   (numero più basso = più lento, numero più alto = più veloce)
 */
window.addEventListener('scroll', () => {
    // Ottieni quanto l'utente ha scrollato (in pixel)
    const scrolled = window.pageYOffset;
    
    // Trova i gradients nel DOM
    const parallaxElements = document.querySelectorAll('.hero-gradient-1, .hero-gradient-2');

    // Per ogni gradient, applica transform con velocità diversa
    parallaxElements.forEach((element, index) => {
        // Speed diversa: primo elemento = 0.5, secondo = 1.0, etc.
        const speed = (index + 1) * 0.5;
        
        // Applica transform Y: più l'utente scrolla, più si muove
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });

    // =====================================================================
    // EFFETTO 3: HERO FADE - Hero section svanisce mentre l'utente scrolla
    // =====================================================================
    /**
     * COSA FA:
     * Man mano che l'utente scrolla DOWN dalla homepage, l'hero section
     * (parte in alto) diventa meno visibile (opacity dari 1 a 0.3).
     * 
     * FORMULA:
     * 1. Calcola % di scroll (0% = top, 100% = 80% dell'altezza hero)
     * 2. Converti in opacity: 100% scroll = opacity 0.7 (al 70% svanise)
     * 3. Applica opacity all'elemento '.hero'
     * 
     * VISUALIZZAZIONE:
     * scroll = 0px   → opacity = 1.0   (completamente visibile)
     * scroll = 400px → opacity = 0.7   (semi-trasparente)
     * scroll = 800px → opacity = 0.3   (molto trasparente)
     * 
     * DA MODIFICARE:
     * - window.innerHeight * 0.8: cambia il "trigger distance"
     * - 0.3: opacity minima (non scendere sotto 0)
     */
    const hero = document.querySelector('.hero');
    if (hero) {
        // Calcola percentuale di scroll (0 a 1)
        const scrollPercentage = Math.min(scrolled / (window.innerHeight * 0.8), 1);
        
        // Converti in opacity: da 1.0 a 0.3 mentre scrolla
        // Math.max(, 0.3) = non scendere mai sotto 0.3
        const opacity = Math.max(1 - scrollPercentage * 0.3, 0.3);
        
        // Applica opacity all'elemento
        hero.style.opacity = opacity;
    }
});

// =====================================================================
// EFFETTO 4: STAGGER ANIMATION - Card appaiono con ritardo sfalsato
// =====================================================================
/**
 * COSA FA:
 * Se la page ha card di servizi (.service-card), ogni card
 * avrà un delay d'animazione leggermente diverso.
 * 
 * VISUALMENTE:
 * La prima card appare subito, la seconda dopo 100ms, la terza dopo 200ms, etc.
 * Questo crea un bellissimo effetto "onde" di apparizione.
 * 
 * HTML ESEMPIO:
 * <div class="service-card">Card 1</div>
 * <div class="service-card">Card 2</div>
 * <div class="service-card">Card 3</div>
 * 
 * CSS NECESSARIO (in styles.css):
 * .service-card {
 *   animation: fadeInUp 0.6s ease-out calc(var(--delay) * 1ms) backwards;
 * }
 * 
 * DA MODIFICARE:
 * - Selettore: cambia '.service-card'
 * - Delay: cambia 'index * 100' (100ms tra card)
 * - Se usi --delay, modifica il CSS animation
 */
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    // Imposta una variabile CSS --delay per ogni card
    // Prima card = 0ms, seconda = 100ms, terza = 200ms, etc.
    card.style.setProperty('--delay', `${index * 100}ms`);
});

// =====================================================================
// EFFETTO 5: BUTTON RIPPLE EFFECT - Onda al click su bottoni
// =====================================================================
/**
 * COSA FA:
 * Quando clicchi un bottone (.btn), viene creato un elemento
 * circolare animato che si espande dal punto del click.
 * Questo è l'effetto Material Design "ripple" di Google.
 * 
 * VISIVAMENTE:
 * Clicchi bottone → appare un cerchio dal punto del click
 * → il cerchio si espande per ~600ms → svanisce
 * 
 * CODICE LOGICA:
 * 1. Crea un <span class="ripple">
 * 2. Posizionalo sotto il mouse (evento click)
 * 3. Applicagli classe CSS 'ripple' che ha animazione
 * 4. Dopo 600ms (durata animazione), rimuovi <span>
 * 
 * CSS NECESSARIO (in styles.css):
 * .btn .ripple {
 *   position: absolute;
 *   border-radius: 50%;
 *   background: rgba(255,255,255,0.6);
 *   transform: scale(0);
 *   animation: ripple-animation 0.6s ease-out;
 * }
 * 
 * DA MODIFICARE:
 * - Selettore: cambia '.btn'
 * - Durata: modifica setTimeout(600) e animation durata
 */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        // Crea un nuovo elemento <span> per l'effetto ripple
        const ripple = document.createElement('span');
        
        // Ottieni le dimensioni e posizione del bottone nel viewport
        const rect = this.getBoundingClientRect();
        
        // Usa il lato più lungo come diametro del ripple (cerchio perfetto)
        const size = Math.max(rect.width, rect.height);
        
        // Calcola posizione: centro del click - metà del cerchio
        // così il cerchio cresce dal punto del click
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        // Imposta dimensioni del ripple
        ripple.style.width = ripple.style.height = size + 'px';
        
        // Posiziona il ripple sotto il mouse
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Aggiungi classe 'ripple' che ha l'animazione CSS
        ripple.classList.add('ripple');

        // Aggiungi il ripple al bottone (lo rende visibile)
        this.appendChild(ripple);

        // Dopo 600ms (durata dell'animazione), rimuovi il ripple dal DOM
        // così non si accumula (performance)
        setTimeout(() => ripple.remove(), 600);
    });
});

// Testing Github
