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
    let startX = 0, currentX = 0, dragging = false;
    function onTouchStart(e) { startX = e.touches[0].clientX; dragging = true; wrapper.classList.add('dragging'); }
    function onTouchMove(e) {
        if (!dragging) return;
        currentX = e.touches[0].clientX;
        const dx = currentX - startX;
        const s = slides();
        if (!s.length) return;
        const gap = parseFloat(getComputedStyle(track).gap) || 16;
        const slideWidth = s[0].getBoundingClientRect().width + gap;
        track.style.transform = `translateX(${-index * slideWidth + dx}px)`;
    }
    function onTouchEnd() {
        dragging = false; wrapper.classList.remove('dragging');
        const dx = currentX - startX;
        if (Math.abs(dx) > 60) {
            index = dx < 0 ? Math.min(slides().length - visible(), index + 1) : Math.max(0, index - 1);
        }
        update();
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
            // advance, wrap to start when reaching end
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
        // named handlers so we can remove them later
        if (prev) onPrevClick = () => { onPrev(); pauseAutoplayTemporarily(); };
        if (next) onNextClick = () => { onNext(); pauseAutoplayTemporarily(); };
        if (prev) prev.addEventListener('click', onPrevClick);
        if (next) next.addEventListener('click', onNextClick);
        wrapper.addEventListener('touchstart', onTouchStart, { passive: true });
        wrapper.addEventListener('touchmove', onTouchMove, { passive: true });
        wrapper.addEventListener('touchend', onTouchEnd);
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