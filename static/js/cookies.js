


document.addEventListener('DOMContentLoaded', () => {
    
    const banner = document.getElementById('cookieBanner');
    
    
    if (!banner) return;

    
    const acceptBtn = document.getElementById('acceptCookies');
    
    
    if (!acceptBtn) return;

    
    acceptBtn.addEventListener('click', () => {
        
        
        localStorage.setItem('cookiesAccepted', 'true');
        
        
        
        
        fetch('/api/cookies/accept', { method: 'POST' })
            .catch(() => {
                
                
            });
        
        
        
        
        banner.classList.remove('visible');
        
        
        
        setTimeout(() => {
            banner.remove();
        }, 500);
    });
});

