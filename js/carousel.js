document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.services-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const wrapper = carousel.querySelector('.carousel-track-wrapper');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const dotsWrap = carousel.querySelector('.carousel-dots');

    let index = 0;
    let active = false;
    let onPrevClick = null, onNextClick = null;

    const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

    function slides() { return Array.from(track.children); }

    function buildDots() {
        dotsWrap.innerHTML = '';
        slides().forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'dot';
            btn.setAttribute('aria-label', `Vai al servizio ${i + 1}`);
            btn.addEventListener('click', () => { index = i; update(); pauseAutoplayTemporarily(); });
            dotsWrap.appendChild(btn);
        });
    }

    function visible() {
        const s = slides();
        if (!s.length) return 1;
        const sWidth = s[0].getBoundingClientRect().width;
        const w = wrapper.clientWidth;
        return Math.max(1, Math.floor(w / (sWidth + 16)));
    }

    function updateButtons() {
        if (!prev || !next) return;
        if (!isMobile()) { prev.hidden = true; next.hidden = true; return; }
        prev.hidden = index <= 0;
        next.hidden = index >= slides().length - visible();
    }

    function updateDots() {
        if (!isMobile()) { dotsWrap.innerHTML = ''; return; }
        const dots = Array.from(dotsWrap.children);
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function slideTo(i) {
        if (!isMobile()) { track.style.transform = ''; return; }
        const s = slides();
        if (!s.length) return;
        const sRect = s[0].getBoundingClientRect();
        const gap = parseFloat(getComputedStyle(track).gap) || 16;
        const slideWidth = sRect.width + gap;
        track.style.transform = `translateX(-${Math.round(i * slideWidth)}px)`;
    }

    function update() {
        if (!isMobile()) {
            index = 0;
            track.style.transform = '';
            updateButtons();
            updateDots();
            return;
        }

        const s = slides();
        const maxIndex = Math.max(0, s.length - visible());
        index = Math.min(Math.max(0, index), maxIndex);
        slideTo(index);
        updateButtons();
        updateDots();
    }

    // Event handlers (kept named so we can add/remove)
    function onPrev() { index = Math.max(0, index - 1); update(); }
    function onNext() { index = Math.min(slides().length - visible(), index + 1); update(); }

    // Touch handlers
    let startX = 0, currentX = 0, dragging = false, lastTranslate = 0, startTransform = 0;
    function getPointerX(e) {
        if (e.touches && e.touches.length) return e.touches[0].clientX;
        if (typeof e.clientX === 'number') return e.clientX;
        return 0;
    }
    function getCurrentTranslate() {
        const style = getComputedStyle(track).transform;
        if (style && style !== 'none') {
            const match = style.match(/matrix\(1, 0, 0, 1, (-?\d+), 0\)/);
            if (match) return parseFloat(match[1]);
            const match3d = style.match(/matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, (-?\d+), 0, 0, 1\)/);
            if (match3d) return parseFloat(match3d[1]);
        }
        return 0;
    }
    function onPointerDown(e) {
        if (!isMobile()) return;
        startX = getPointerX(e);
        dragging = true;
        wrapper.classList.add('dragging');
        lastTranslate = 0;
        startTransform = getCurrentTranslate();
        track.style.transition = 'none';
    }
    function onPointerMove(e) {
        if (!dragging || !isMobile()) return;
        currentX = getPointerX(e);
        const dx = currentX - startX;
        lastTranslate = dx;
        const s = slides();
        if (!s.length) return;
        const gap = parseFloat(getComputedStyle(track).gap) || 16;
        const slideWidth = s[0].getBoundingClientRect().width + gap;
        track.style.transform = `translate3d(${-index * slideWidth + dx}px, 0, 0)`;
    }
    function onPointerUp(e) {
        if (!dragging || !isMobile()) return;
        dragging = false;
        wrapper.classList.remove('dragging');
        track.style.transition = 'transform 0.35s cubic-bezier(.4,.7,.4,1)';
        const dx = lastTranslate;
        const s = slides();
        const gap = parseFloat(getComputedStyle(track).gap) || 16;
        const slideWidth = s[0].getBoundingClientRect().width + gap;
        if (Math.abs(dx) > slideWidth * 0.25) {
            index = dx < 0 ? Math.min(slides().length - visible(), index + 1) : Math.max(0, index - 1);
        }
        slideTo(index);
        setTimeout(() => { track.style.transition = ''; }, 400);
        lastTranslate = 0;
    }

    function onKeydown(e) {
        if (e.key === 'ArrowLeft') { index = Math.max(0, index - 1); update(); }
        if (e.key === 'ArrowRight') { index = Math.min(slides().length - visible(), index + 1); update(); }
    }

    // Autoplay controls
    let autoplayTimer = null;
    let autoplayDelay = 4500; // ms
    let resumeDelay = 5000; // ms after user interaction
    let resumeTimer = null;

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            if (!isMobile()) return;
            const s = slides();
            const maxIndex = Math.max(0, s.length - visible());
            index = (index >= maxIndex) ? 0 : index + 1;
            update();
        }, autoplayDelay);
    }


    function stopAutoplay() {
        if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
        if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
    }

    function pauseAutoplayTemporarily() {
        stopAutoplay();
        // resume after inactivity
        resumeTimer = setTimeout(() => startAutoplay(), resumeDelay);
    }

    function activate() {
        if (active) return;
        active = true;
        buildDots();
        update();
        // nessun prev/next
        // Pointer events (universale: mouse, touch, pen)
        wrapper.addEventListener('pointerdown', onPointerDown);
        wrapper.addEventListener('pointermove', onPointerMove);
        wrapper.addEventListener('pointerup', onPointerUp);
        // Touch events (fallback per browser vecchi)
        wrapper.addEventListener('touchstart', onPointerDown, { passive: true });
        wrapper.addEventListener('touchmove', onPointerMove, { passive: true });
        wrapper.addEventListener('touchend', onPointerUp);
        // pause autoplay during pointerdown / interaction
        wrapper.addEventListener('pointerdown', pauseAutoplayTemporarily);
        carousel.addEventListener('keydown', onKeydown);
        carousel.tabIndex = 0;
        // start autoplay on activate
        startAutoplay();
    }

    function deactivate() {
        if (!active) return;
        active = false;
        index = 0;
        track.style.transform = '';
        dotsWrap.innerHTML = '';
        if (prev && onPrevClick) prev.removeEventListener('click', onPrevClick);
        if (next && onNextClick) next.removeEventListener('click', onNextClick);
        wrapper.removeEventListener('touchstart', onTouchStart);
        wrapper.removeEventListener('touchmove', onTouchMove);
        wrapper.removeEventListener('touchend', onTouchEnd);
        wrapper.removeEventListener('pointerdown', pauseAutoplayTemporarily);
        carousel.removeEventListener('keydown', onKeydown);
        if (carousel.hasAttribute('tabindex')) carousel.removeAttribute('tabindex');
        stopAutoplay();
        if (resumeTimer) clearTimeout(resumeTimer);
        updateButtons();
    }

    // Init depending on viewport and handle changes
    function check() {
        if (isMobile()) activate(); else deactivate();
        update();
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(check, 120); });

    // initial
    check();
});