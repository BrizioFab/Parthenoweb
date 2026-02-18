


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
    let currentIndex = 1;           
    let slidesArray = [];           
    let originalSlidesCount = 0;    
    let autoPlayInterval;           
    let isTransitioning = false;    

    
    
    
    const AUTOPLAY_DELAY = 2500;  
    const TRANSITION_DURATION_MS = 500;  
    const TRANSITION_CSS = `transform ${TRANSITION_DURATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;  

    
    const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

    
    
    
    
    function setupSlides() {
        
        const existingClones = track.querySelectorAll('.carousel-clone');
        existingClones.forEach(el => el.remove());

        
        const originalSlides = Array.from(track.children);
        originalSlidesCount = originalSlides.length;

        if (originalSlidesCount === 0) return;  

        
        const firstClone = originalSlides[0].cloneNode(true);
        firstClone.classList.add('carousel-clone');

        
        const lastClone = originalSlides[originalSlidesCount - 1].cloneNode(true);
        lastClone.classList.add('carousel-clone');

        
        track.appendChild(firstClone);          
        track.insertBefore(lastClone, track.firstChild);  

        
        slidesArray = Array.from(track.children);

        
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

                currentIndex = i + 1;     
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

        
        let realIndex = currentIndex - 1;
        if (realIndex < 0) realIndex = originalSlidesCount - 1;
        if (realIndex >= originalSlidesCount) realIndex = 0;

        
        if (dots[realIndex]) dots[realIndex].classList.add('active');
    }

    
    
    
    
    function getSlideWidth() {
        if (!slidesArray.length) return 0;

        const rect = slidesArray[0].getBoundingClientRect();
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

    
    
    
    
    track.addEventListener('transitionend', () => {
        isTransitioning = false;

        if (!slidesArray[currentIndex]) return;

        
        if (slidesArray[currentIndex].classList.contains('carousel-clone')) {
            track.style.transition = 'none';

            if (currentIndex === 0) {
                
                currentIndex = slidesArray.length - 2;
            } else if (currentIndex === slidesArray.length - 1) {
                
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

    
    
    
    
    function touchStart(index) {
        return function (event) {
            if (!isMobile()) return;

            isDragging = true;
            stopAutoplay();

            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);

            track.style.transition = 'none';  
        }
    }

    
    function touchEnd() {
        if (!isMobile()) return;

        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;
        const width = getSlideWidth();

        
        if (movedBy < -width * 0.2) {
            slideNext();  
        } else if (movedBy > width * 0.2) {
            slidePrev();  
        } else {
            setPositionByIndex(true);  
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

    
    
    
    function startAutoplay() {
        stopAutoplay();  
        autoPlayInterval = setInterval(() => {
            if (isMobile()) slideNext();  
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        clearInterval(autoPlayInterval);
    }

    
    
    
    
    wrapper.addEventListener('touchstart', (e) => touchStart()(e), { passive: true });
    wrapper.addEventListener('touchend', touchEnd);
    wrapper.addEventListener('touchmove', touchMove, { passive: true });

    
    wrapper.addEventListener('mousedown', (e) => touchStart()(e));
    wrapper.addEventListener('mouseup', touchEnd);
    wrapper.addEventListener('mouseleave', () => { if (isDragging) touchEnd() });  
    wrapper.addEventListener('mousemove', touchMove);

    
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

    
    
    
    
    function init() {
        if (isMobile()) {
            
            if (slidesArray.length === 0 || slidesArray.length === originalSlidesCount) {
                setupSlides();  
            } else {
                updatePosition(false);  
            }
            startAutoplay();
        } else {
            
            track.style.transform = 'none';
            track.style.transition = 'none';
            stopAutoplay();

            
            const existingClones = track.querySelectorAll('.carousel-clone');
            existingClones.forEach(el => el.remove());

            slidesArray = [];  
        }
    }

    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            init();
        }, 200);  
    });

    
    setTimeout(init, 100);  
});
