/**
 * NAVBAR MOBILE TOGGLE - Menu hamburger per mobile
 * ================================================
 * 
 * COSA FA:
 * Gestisce il menu di navigazione su dispositivi mobile (<768px).
 * Quando la navbar è troppo stretta per contenere tutti i link,
 * viene nascosta un menu hamburger (☰) che l'utente può cliccare
 * per mostrare/nascondere il menu.
 * 
 * FUNZIONALITÀ:
 * 1. Click sul bottone hamburger → toggle class 'active' al menu
 * 2. Click su link del menu → chiudi menu
 * 3. Click fuori dal menu → chiudi menu
 * 4. Il bottone hamburgher cambia stile quando il menu è aperto
 * 
 * CSS ASSOCIATO:
 * Vedi styles.css:
 * - .nav-toggle { display: none; } (nascosto su desktop)
 * - @media (max-width: 768px) { .nav-toggle { display: block; } }
 * - .main-nav.active { display: flex; } (mostra menu quando active)
 * 
 * SELETTORI USATI:
 * - .nav-toggle: bottone hamburger
 * - .main-nav: contenitore menu
 * - .nav-link: link singoli nel menu
 * 
 * DA MODIFICARE:
 * - Se cambi classe CSS del menu/toggle
 * - Se vuoi aggiungere animazione al bottone
 * - Se vuoi cambiare comportamento e/o trigger
 */

// Aspetta che DOM sia pronto prima di cercare elementi
document.addEventListener('DOMContentLoaded', function () {
    
    // STEP 1: Trova gli elementi DOM necessari
    const navToggle = document.querySelector('.nav-toggle');  // Bottone hamburger
    const mainNav = document.querySelector('.main-nav');      // Menu navigatione
    
    // Se uno dei due elementi non esiste, esci (non lanciare errori)
    if (navToggle && mainNav) {
        
        // ====================================================================
        // EVENT 1: Click sul bottone hamburger → Toggle menu open/close
        // ====================================================================
        navToggle.addEventListener('click', function (e) {
            // Prevenisci che il click si propaghi verso elementi padre
            // Altrimenti il click outside chiude subito il menu
            e.stopPropagation();
            
            // Controlla se menu è già aperto (ha classe 'active')
            const isActive = mainNav.classList.contains('active');
            
            if (isActive) {
                // Menu è aperto → chiudilo
                mainNav.classList.remove('active');
                navToggle.classList.remove('open');  // Cambia stile bottone
            } else {
                // Menu è chiuso → aprilo
                mainNav.classList.add('active');
                navToggle.classList.add('open');     // Cambia stile bottone
            }
        });

        // ====================================================================
        // EVENT 2: Click su link del menu → Chiudi menu automaticamente
        // ====================================================================
        // Quando user clicca un link (es: Home, Portfolio), il menu si chiude
        // Così non rimane aperto dopo il click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                navToggle.classList.remove('open');
            });
        });

        // ====================================================================
        // EVENT 3: Click FUORI dal menu → Chiudi il menu
        // ====================================================================
        // Se user clicca su qualsiasi altro elemento della page, il menu chiude
        // Questo migliora UX su mobile
        document.addEventListener('click', function (event) {
            // Controlla se il click è DENTRO il menu
            const isClickInsideNav = mainNav.contains(event.target);
            
            // Controlla se il click è SUL bottone toggle
            const isClickOnToggle = navToggle.contains(event.target);
            
            // Se click NON è dentro il menu E NON è sul toggle
            // allora chiudi il menu
            if (!isClickInsideNav && !isClickOnToggle) {
                mainNav.classList.remove('active');
                navToggle.classList.remove('open');
            }
        });
    }
});

