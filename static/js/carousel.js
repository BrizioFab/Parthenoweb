/**
 * CAROUSEL - Splide inizializzato solo su mobile (<=900px)
 * Su desktop Splide viene distrutto e le card tornano a griglia CSS.
 *
 * Configurazione:
 *  - type: 'loop'        scorrimento infinito
 *  - perPage: 1          una card per volta
 *  - pagination: true    dots circolari
 *  - arrows: false       no frecce (design pulito)
 *  - autoplay: true      scorrimento automatico ogni 2.5s
 *  - mediaQuery: 'min'   i breakpoints si attivano su min-width
 *  - breakpoints 901     destroy: true su desktop
 */
document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('#servicesCarousel');
    if (!el || typeof Splide === 'undefined') return;

    const splide = new Splide(el, {
        type        : 'loop',
        perPage     : 1,
        perMove     : 1,
        pagination  : true,
        arrows      : false,
        autoplay    : true,
        interval    : 2500,
        pauseOnHover: true,
        pauseOnFocus: true,
        speed       : 500,
        gap         : '1rem',
        padding     : { left: '1rem', right: '1rem' },
        mediaQuery  : 'min',
        breakpoints : {
            901: {
                destroy: true,
            },
        },
    });

    splide.mount();
});
