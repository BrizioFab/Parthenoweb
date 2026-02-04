document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalInner = modal && modal.querySelector('.project-modal-inner');
    const modalTitle = modal && modal.querySelector('.modal-title');
    const modalCategory = modal && modal.querySelector('.modal-category');
    const modalDesc = modal && modal.querySelector('.modal-desc');
    const modalClose = modal && modal.querySelector('.modal-close');
    let lastFocused = null;

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Modal open
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const title = button.dataset.title;
            const category = button.dataset.category;
            const desc = button.dataset.desc;
            openModal({ title, category, desc }, button);
        });
    });

    function openModal(data, triggerEl) {
        if (!modal) return;
        lastFocused = triggerEl || document.activeElement;
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDesc.textContent = data.desc;
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
        // lock scroll
        document.documentElement.style.overflow = 'hidden';
        if (modalClose) modalClose.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        document.documentElement.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
        }
    });

});

// Testing Github