/**
 * CAROUSEL TOUCH-FRIENDLY CON LOOP INFINITO
 * =========================================
 * 
 * Sistema di carosello mobile con:
 * - Clonazione slide per loop infinito fluido
 * - Swipe touch ottimizzato per mobile
 * - Autoplay con intervallo 2.5s
 * - Pallini di navigazione sincronizzati
 * 
 * LOGICA CLONI:
 * - Prima slide reale → clonata alla fine
 * - Ultima slide reale → clonata all'inizio
 * - Permette transizioni fluide senza 'salti' visivi
 * - Teleport invisibile quando si raggiunge un clone
 * 
 * @author Parthenoweb Team
 * @version 3.0
 */

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.services-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const wrapper = carousel.querySelector('.carousel-track-wrapper');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const dotsWrap = carousel.querySelector('.carousel-dots');

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentIndex = 1; // Start at 1 because 0 is a clone
    let slidesArray = [];
    let originalSlidesCount = 0;
    let autoPlayInterval;
    let isTransitioning = false;

    // Configuration
    const AUTOPLAY_DELAY = 2500;
    const TRANSITION_DURATION_MS = 500;
    const TRANSITION_CSS = `transform ${TRANSITION_DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`; // Smooth & Delicate

    const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

    // --- SETUP & CLONES ---
    function setupSlides() {
        // Clear potential existing clones if any (idempotency)
        const existingClones = track.querySelectorAll('.carousel-clone');
        existingClones.forEach(el => el.remove());

        const originalSlides = Array.from(track.children);
        originalSlidesCount = originalSlides.length;

        if (originalSlidesCount === 0) return;

        // Clone First and Last
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[originalSlidesCount - 1].cloneNode(true);

        firstClone.classList.add('carousel-clone');
        lastClone.classList.add('carousel-clone');

        // Add clones to DOM
        track.appendChild(firstClone);
        track.insertBefore(lastClone, track.firstChild);

        slidesArray = Array.from(track.children);

        // Reset index to 1 (first real slide)
        currentIndex = 1;

        updatePosition(false);
        buildDots();
        updateDots();
    }

    function buildDots() {
        dotsWrap.innerHTML = '';
        if (originalSlidesCount <= 1) return;

        for (let i = 0; i < originalSlidesCount; i++) {
            const btn = document.createElement('button');
            btn.className = 'dot';
            btn.dataset.index = i;
            btn.setAttribute('aria-label', `Vai al servizio ${i + 1}`);
            btn.addEventListener('click', () => {
                if (!isMobile()) return;
                currentIndex = i + 1; // Map 0-based dot to 1-based slide
                setPositionByIndex();
                stopAutoplay();
                startAutoplay();
            });
            dotsWrap.appendChild(btn);
        }
    }

    function updateDots() {
        const dots = Array.from(dotsWrap.children);
        dots.forEach(d => d.classList.remove('active'));

        // Calculate 'Real' Index
        // currentIndex 0 (CloneLast) -> real index: last
        // currentIndex N+1 (CloneFirst) -> real index: 0
        let realIndex = currentIndex - 1;
        if (realIndex < 0) realIndex = originalSlidesCount - 1;
        if (realIndex >= originalSlidesCount) realIndex = 0;

        if (dots[realIndex]) dots[realIndex].classList.add('active');
    }

    // --- POSITIONING ---
    function getSlideWidth() {
        if (!slidesArray.length) return 0;
        const rect = slidesArray[0].getBoundingClientRect();
        // Include gap if present
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 0;
        return rect.width + gap;
    }

    function setPositionByIndex(animate = true) {
        if (!isMobile()) {
            track.style.transform = 'none';
            track.style.transition = 'none';
            return;
        }

        const width = getSlideWidth();
        currentTranslate = currentIndex * -width;
        prevTranslate = currentTranslate;

        if (animate) {
            track.style.transition = TRANSITION_CSS;
            isTransitioning = true;
        } else {
            track.style.transition = 'none';
            isTransitioning = false;
        }

        track.style.transform = `translateX(${currentTranslate}px)`;
        updateDots();
    }

    function updatePosition(animate = true) {
        setPositionByIndex(animate);
    }


    // --- TRANSITION LOOPS ---
    track.addEventListener('transitionend', () => {
        isTransitioning = false;

        // Teleport Logic
        if (!slidesArray[currentIndex]) return;

        if (slidesArray[currentIndex].classList.contains('carousel-clone')) {
            track.style.transition = 'none';

            if (currentIndex === 0) {
                // We are at CloneLast -> Jump to RealLast
                currentIndex = slidesArray.length - 2;
            } else if (currentIndex === slidesArray.length - 1) {
                // We are at CloneFirst -> Jump to RealFirst
                currentIndex = 1;
            }

            const width = getSlideWidth();
            currentTranslate = currentIndex * -width;
            prevTranslate = currentTranslate;
            requestAnimationFrame(() => {
                track.style.transform = `translateX(${currentTranslate}px)`;
            });
        }
    });

    // --- MOVING ---
    function slideNext() {
        if (currentIndex >= slidesArray.length - 1) return;
        currentIndex++;
        setPositionByIndex(true);
    }

    function slidePrev() {
        if (currentIndex <= 0) return;
        currentIndex--;
        setPositionByIndex(true);
    }

    // --- TOUCH HANDLING ---
    function touchStart(index) {
        return function (event) {
            if (!isMobile()) return;
            isDragging = true;
            stopAutoplay();
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            track.style.transition = 'none'; // Immediate response
        }
    }

    function touchEnd() {
        if (!isMobile()) return;
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;
        const width = getSlideWidth();

        // Threshold to snap
        if (movedBy < -width * 0.2) {
            slideNext();
        } else if (movedBy > width * 0.2) {
            slidePrev();
        } else {
            setPositionByIndex(true); // Snap back
        }

        startAutoplay();
    }

    function touchMove(event) {
        if (isDragging && isMobile()) {
            const currentPosition = getPositionX(event);
            const currentMove = currentPosition - startPos;
            currentTranslate = prevTranslate + currentMove;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        if (isDragging) {
            track.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }

    // --- AUTOPLAY ---
    function startAutoplay() {
        stopAutoplay();
        autoPlayInterval = setInterval(() => {
            if (isMobile()) slideNext();
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoPlayInterval);
    }

    // --- EVENTS ---
    // Use closure to access fresh variables if needed, but here simple references work
    // because currentIndex is module-scope. 
    // However, for touchStart we wrapped it, let's unwrap to keep it simple

    wrapper.addEventListener('touchstart', (e) => touchStart()(e), { passive: true });
    wrapper.addEventListener('touchend', touchEnd);
    wrapper.addEventListener('touchmove', touchMove, { passive: true });

    wrapper.addEventListener('mousedown', (e) => touchStart()(e));
    wrapper.addEventListener('mouseup', touchEnd);
    wrapper.addEventListener('mouseleave', () => { if (isDragging) touchEnd() });
    wrapper.addEventListener('mousemove', touchMove);

    // Prev/Next Buttons (if visible)
    if (prev) prev.addEventListener('click', () => { stopAutoplay(); slidePrev(); startAutoplay(); });
    if (next) next.addEventListener('click', () => { stopAutoplay(); slideNext(); startAutoplay(); });

    // Initialization & Resize
    function init() {
        if (isMobile()) {
            // Setup if not already setup (check for clones)
            // But resize might need re-calc of widths -> updatePosition
            if (slidesArray.length === 0 || slidesArray.length === originalSlidesCount) {
                setupSlides();
            } else {
                updatePosition(false);
            }
            startAutoplay();
        } else {
            // Desktop: Clean up
            track.style.transform = 'none';
            track.style.transition = 'none';
            stopAutoplay();

            const existingClones = track.querySelectorAll('.carousel-clone');
            existingClones.forEach(el => el.remove());
            slidesArray = [];
            // We set slidesArray to empty so next Mobile Init triggers setupSlides
            // But we must NOT lose originalSlidesCount tracking? 
            // setupSlides re-reads from DOM. 
            // When we remove clones, DOM returns to original state. Perfect.
        }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            init();
        }, 200);
    });

    // Need to wait for layout/CSS
    setTimeout(init, 100);
});

// Testing Github