/**
 * CAROUSEL TOUCH-FRIENDLY CON LOOP INFINITO
 * ==========================================
 * 
 * COSA FA:
 * Un carosello (slider) per visualizzare i servizi o portfolio.
 * Supporta: swipe mobile, autoplay, navigazione con bottoni/pallini.
 * 
 * CARATTERISTICHE CHIAVE:
 * 1. LOOP INFINITO FLUIDO: Quando raggiungi l'ultima slide, torna alla prima SENZA salti
 * 2. TOUCH & MOUSE: Puoi trascinare le slide con il dito o il mouse
 * 3. AUTOPLAY: Scorre automaticamente ogni 2.5 secondi su mobile
 * 4. RESPONSIVE: Solo su mobile (<900px); desktop mostra tutte le slide
 * 5. PALLINI NAVIGAZIONE: Puntini sotto indicano quale slide sei
 * 
 * COME FUNZIONA IL LOOP INFINITO:
 * ┌─────────────────────────────────┐
 * │ [CLONE-LAST] [1] [2] [3] [CLONE-1] │
 * └─────────────────────────────────┘
 *      ^                        ^
 *      └──────────────┬─────────┘
 *      Quando arrivi qui, teletrasporta qui invisibilmente
 * 
 * ELEMENTI HTML RICHIESTI:
 * - .services-carousel: container
 * - .carousel-track: slide container (si muove via transform)
 * - .carousel-track-wrapper: contenitore esterno (overflow hidden)
 * - .carousel-prev / .carousel-next: bottoni navigazione
 * - .carousel-dots: contenitore pallini
 * 
 * DA MODIFICARE:
 * - AUTOPLAY_DELAY: tempo tra slide (default 2500ms = 2.5sec)
 * - TRANSITION_DURATION_MS: velocità scorrimento (default 500ms)
 * - isMobile() breakpoint: 900px è il limite mobile/desktop
 * 
 * @author Parthenoweb Team
 * @version 3.0
 */

// ESEGUI QUANDO DOM È CARICATO
document.addEventListener('DOMContentLoaded', () => {
    // =====================================================================
    // STEP 1: TROVA GLI ELEMENTI NATO
    // =====================================================================
    const carousel = document.querySelector('.services-carousel');
    if (!carousel) return;  // Se carousel non esiste, esci

    const track = carousel.querySelector('.carousel-track');      // Contenitore slide che si muove
    const wrapper = carousel.querySelector('.carousel-track-wrapper');  // Overflow hidden
    const prev = carousel.querySelector('.carousel-prev');        // Bottone "<"
    const next = carousel.querySelector('.carousel-next');        // Bottone ">"
    const dotsWrap = carousel.querySelector('.carousel-dots');    // Pallini

    // =====================================================================
    // STEP 2: VARIABILI DI STATO
    // =====================================================================
    let isDragging = false;         // L'utente sta trascinando?
    let startPos = 0;               // Posizione inizio drag (mouse/touch)
    let currentTranslate = 0;       // Posizione attuale (transform X)
    let prevTranslate = 0;          // Posizione precedente (per calcolo delta)
    let animationID;                // ID di requestAnimationFrame
    let currentIndex = 1;           // Slide corrente (1 perché 0 è clone)
    let slidesArray = [];           // Array di tutti gli elementi slide (inclusi cloni)
    let originalSlidesCount = 0;    // Conteggio slide reali (SENZA cloni)
    let autoPlayInterval;           // ID dell'intervallo autoplay
    let isTransitioning = false;    // È in corso una transizione CSS?

    // =====================================================================
    // CONFIGURAZIONE
    // =====================================================================
    const AUTOPLAY_DELAY = 2500;  // Ms tra uno scorrimento auto e il successivo
    const TRANSITION_DURATION_MS = 500;  // Ms per l'animazione di scorrimento
    const TRANSITION_CSS = `transform ${TRANSITION_DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;  // Easing

    // Funzione helper: siamo su mobile (<900px)?
    const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

    // =====================================================================
    // SEZIONE: SETUP E CLONAZIONE SLIDE
    // =====================================================================
    /**
     * setupSlides() - Prepara il carousel per il loop infinito
     * 
     * FLUSSO:
     * 1. Leggi tutte le slide reali dal DOM
     * 2. Crea un clone della prima → aggiungilo ALLA FINE
     * 3. Crea un clone dell'ultima → aggiungilo ALL'INIZIO
     * 4. Aggiorna slidesArray con tutte le slide (inclusi cloni)
     * 5. Reset currentIndex a 1 (prima slide reale)
     * 6. Posiziona il carousel
     * 7. Crea pallini di navigazione
     */
    function setupSlides() {
        // Pulisci cloni precedenti (se vengono richiamate setupSlides multiple volte)
        const existingClones = track.querySelectorAll('.carousel-clone');
        existingClones.forEach(el => el.remove());

        // Leggi slide REALI dal DO (senza cloni)
        const originalSlides = Array.from(track.children);
        originalSlidesCount = originalSlides.length;

        if (originalSlidesCount === 0) return;  // Nessuna slide

        // Crea clone della PRIMA slide
        const firstClone = originalSlides[0].cloneNode(true);
        firstClone.classList.add('carousel-clone');

        // Crea clone dell'ULTIMA slide
        const lastClone = originalSlides[originalSlidesCount - 1].cloneNode(true);
        lastClone.classList.add('carousel-clone');

        // AGGIUNGI CLONI AL DOM
        track.appendChild(firstClone);          // Clone prima → FINE
        track.insertBefore(lastClone, track.firstChild);  // Clone ultima → INIZIO

        // Aggiorna array con TUTTI gli elementi (inclusi cloni)
        slidesArray = Array.from(track.children);

        // Resetta indice a 1 (prima slide REALE è all'indice 1)
        currentIndex = 1;

        updatePosition(false);  // Posiziona a prima slide (senza animazione)
        buildDots();           // Crea pallini
        updateDots();          // Evidenzia pallino corretto
    }

    /**
     * buildDots() - Crea i pallini di navigazione
     * 
     * Per ogni slide reale, crea un <button class="dot">
     * Onclick: salta a quella slide
     */
    function buildDots() {
        dotsWrap.innerHTML = '';  // Cancella pallini vecchi

        if (originalSlidesCount <= 1) return;  // No dots se una sola slide

        // Crea un button per ogni slide reale
        for (let i = 0; i < originalSlidesCount; i++) {
            const btn = document.createElement('button');
            btn.className = 'dot';
            btn.dataset.index = i;
            btn.setAttribute('aria-label', `Vai al servizio ${i + 1}`);

            // Click su un pallino: salta a quella slide
            btn.addEventListener('click', () => {
                if (!isMobile()) return;  // Desktop: ignora click pallini

                currentIndex = i + 1;     // I + 1 perché indice reale è spostato (clone all'inizio)
                setPositionByIndex();
                stopAutoplay();
                startAutoplay();
            });

            dotsWrap.appendChild(btn);
        }
    }

    /**
     * updateDots() - Evidenzia il pallino della slide corrente
     * 
     * LOGICA:
     * currentIndex 0 = clone ultima → real index = ultima
     * currentIndex 1 = prima reale → real index = 0
     * currentIndex N+1 = clone prima → real index = 0
     */
    function updateDots() {
        const dots = Array.from(dotsWrap.children);
        dots.forEach(d => d.classList.remove('active'));

        // Calcola l'indice reale dal currentIndex
        let realIndex = currentIndex - 1;
        if (realIndex < 0) realIndex = originalSlidesCount - 1;
        if (realIndex >= originalSlidesCount) realIndex = 0;

        // Evidenzia il pallino corretto
        if (dots[realIndex]) dots[realIndex].classList.add('active');
    }

    // =====================================================================
    // SEZIONE: POSIZIONAMENTO SLIDE
    // =====================================================================
    /**
     * getSlideWidth() - Calcola larghezza di una singola slide
     * 
     * INCLUDE:
     * - Larghezza della slide stessa
     * - Gap tra slide (CSS gap property)
     */
    function getSlideWidth() {
        if (!slidesArray.length) return 0;

        const rect = slidesArray[0].getBoundingClientRect();
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 0;

        return rect.width + gap;
    }

    /**
     * setPositionByIndex(animate) - Posiziona il carousel correttamente
     * 
     * CALCOLO:
     * translate = currentIndex * -slideWidth
     * 
     * ESEMPIO:
     * slideWidth = 300px
     * currentIndex = 2 → translate = -600px (slide 2 al centro)
     */
    function setPositionByIndex(animate = true) {
        // Desktop: disattiva carousel (mostra tutte le slide)
        if (!isMobile()) {
            track.style.transform = 'none';
            track.style.transition = 'none';
            return;
        }

        const width = getSlideWidth();
        currentTranslate = currentIndex * -width;
        prevTranslate = currentTranslate;

        // Applica transizione CSS se animate = true
        if (animate) {
            track.style.transition = TRANSITION_CSS;
            isTransitioning = true;
        } else {
            track.style.transition = 'none';
            isTransitioning = false;
        }

        // Applica il transform
        track.style.transform = `translateX(${currentTranslate}px)`;
        updateDots();
    }

    function updatePosition(animate = true) {
        setPositionByIndex(animate);
    }

    // =====================================================================
    // SEZIONE: GESTIONE DEL LOOP INFINITO
    // =====================================================================
    /**
     * transitionend event - Se finisci su un clone, teletrasporta al reale
     * 
     * SCENARIO:
     * Sei all'ultima slide reale → clicca next
     * → vai a slide N+1 (CLONE della prima)
     * → transitionend: teletrasporta a slide 1 (prima REALE) senza animazione
     * 
     * Da qui, se clicchi ancora next, vai a slide 2 (reale), poi 3, poi al clone again.
     */
    track.addEventListener('transitionend', () => {
        isTransitioning = false;

        if (!slidesArray[currentIndex]) return;

        // Se siamo su un clone, teletrasporta al suo equivalente reale
        if (slidesArray[currentIndex].classList.contains('carousel-clone')) {
            track.style.transition = 'none';

            if (currentIndex === 0) {
                // CLONE DELL'ULTIMA → SALTA ALL'ULTIMA REALE
                currentIndex = slidesArray.length - 2;
            } else if (currentIndex === slidesArray.length - 1) {
                // CLONE DELLA PRIMA → SALTA ALLA PRIMA REALE
                currentIndex = 1;
            }

            const width = getSlideWidth();
            currentTranslate = currentIndex * -width;
            prevTranslate = currentTranslate;

            // Usa requestAnimationFrame per evitare flicker
            requestAnimationFrame(() => {
                track.style.transform = `translateX(${currentTranslate}px)`;
            });
        }
    });

    // =====================================================================
    // SEZIONE: NAVIGAZIONE (Bottoni Prev/Next)
    // =====================================================================
    function slideNext() {
        if (currentIndex >= slidesArray.length - 1) return;  // Boundary check
        currentIndex++;
        setPositionByIndex(true);  // Con animazione
    }

    function slidePrev() {
        if (currentIndex <= 0) return;  // Boundary check
        currentIndex--;
        setPositionByIndex(true);  // Con animazione
    }

    // =====================================================================
    // SEZIONE: GESTIONE TOUCH E MOUSE (Drag)
    // =====================================================================
    /**
     * touchStart(index) - Inizio drag (mouse down o touch start)
     * 
     * FLUSSO:
     * 1. Registra posizione inizio drag
     * 2. Ferma autoplay (l'utente sta interagendo)
     * 3. Disabilita transizione (risposta immediata al drag)
     * 4. Avvia requestAnimationFrame per animare mentre trascini
     */
    function touchStart(index) {
        return function (event) {
            if (!isMobile()) return;

            isDragging = true;
            stopAutoplay();

            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);

            track.style.transition = 'none';  // Niente transizione durante drag
        }
    }

    /**
     * touchEnd() - Fine drag (mouse up o touch end)
     * 
     * LOGICA DI SNAP:
     * - Se trascinato >20% della larghezza → snap alla slide successiva/precedente
     * - Se trascinato <20% → snap back alla slide attuale
     */
    function touchEnd() {
        if (!isMobile()) return;

        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;
        const width = getSlideWidth();

        // Threshold per snap: 20% della larghezza della slide
        if (movedBy < -width * 0.2) {
            slideNext();  // Trascinamento a sinistra → prossima slide
        } else if (movedBy > width * 0.2) {
            slidePrev();  // Trascinamento a destra → slide precedente
        } else {
            setPositionByIndex(true);  // Torna alla slide attuale
        }

        startAutoplay();  // Riprendi autoplay
    }

    /**
     * touchMove(event) - Durante il drag (mouse move o touch move)
     * 
     * CALCOLO:
     * currentTranslate = posizione precedente + offset del drag attuale
     */
    function touchMove(event) {
        if (isDragging && isMobile()) {
            const currentPosition = getPositionX(event);
            const currentMove = currentPosition - startPos;

            currentTranslate = prevTranslate + currentMove;
        }
    }

    /**
     * getPositionX(event) - Estrai coordinata X da mouse o touch event
     */
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    /**
     * animation() - Aggiorna il transform durante il drag
     * 
     * Usato da requestAnimationFrame per aggiornare il transform
     * in tempo reale mentre l'utente trascina
     */
    function animation() {
        if (isDragging) {
            track.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }

    // =====================================================================
    // SEZIONE: AUTOPLAY
    // =====================================================================
    function startAutoplay() {
        stopAutoplay();  // Cancella intervallo precedente
        autoPlayInterval = setInterval(() => {
            if (isMobile()) slideNext();  // Scorri automaticamente
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoPlayInterval);
    }

    // =====================================================================
    // SEZIONE: REGISTRAZIONE DEGLI EVENT LISTENER
    // =====================================================================
    // TOUCH EVENTS (mobile)
    wrapper.addEventListener('touchstart', (e) => touchStart()(e), { passive: true });
    wrapper.addEventListener('touchend', touchEnd);
    wrapper.addEventListener('touchmove', touchMove, { passive: true });

    // MOUSE EVENTS (desktop / mouse-enabled devices)
    wrapper.addEventListener('mousedown', (e) => touchStart()(e));
    wrapper.addEventListener('mouseup', touchEnd);
    wrapper.addEventListener('mouseleave', () => { if (isDragging) touchEnd() });  // Se mouse esce dal carousel durante drag
    wrapper.addEventListener('mousemove', touchMove);

    // BOTTONI NAVIGAZIONE
    if (prev) prev.addEventListener('click', () => {
        stopAutoplay();
        slidePrev();
        startAutoplay();
    });

    if (next) next.addEventListener('click', () => {
        stopAutoplay();
        slideNext();
        startAutoplay();
    });

    // =====================================================================
    // SEZIONE: INIZIALIZZAZIONE E RESPONSIVE
    // =====================================================================
    /**
     * init() - Inizializza il carousel (o lo disattiva su desktop)
     * 
     * LOGICA:
     * - Mobile (<900px): setup carousel con cloni e autoplay
     * - Desktop (>=900px): disattiva carousel (rimuovi cloni, mostra tutto)
     */
    function init() {
        if (isMobile()) {
            // MOBILE: Setup carousel
            if (slidesArray.length === 0 || slidesArray.length === originalSlidesCount) {
                setupSlides();  // Crea cloni se non esistono
            } else {
                updatePosition(false);  // Usa cloni esistenti, solo aggiorna posizione
            }
            startAutoplay();
        } else {
            // DESKTOP: Disattiva carousel
            track.style.transform = 'none';
            track.style.transition = 'none';
            stopAutoplay();

            // Rimuovi cloni dal DOM
            const existingClones = track.querySelectorAll('.carousel-clone');
            existingClones.forEach(el => el.remove());

            slidesArray = [];  // Reset array (così il prossimo init() sa di dover ricreare)
        }
    }

    // RESIZE LISTENER: se finestra cambia dimensione (mobile <-> desktop), reinit
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            init();
        }, 200);  // Aspetta 200ms che il resize finisca
    });

    // Inizializza il carousel al caricamento
    setTimeout(init, 100);  // Aspetta 100ms che il layout sia pronto
});
