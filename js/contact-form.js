/**
 * GESTIONE FORM CONTATTI CON VALIDAZIONE
 * =======================================
 * 
 * - Integrazione Formspree per invio email
 * - Validazione in tempo reale (email, telefono)
 * - Feedback visivo su campi (rosso/azzurro)
 * - Loading state durante invio
 * - Messaggi success/error per utente
 * 
 * NOTA: Richiede form.action impostato in HTML su endpoint Formspree
 * 
 * @author Parthenoweb Team
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;

            try {
                // Show loading state
                button.textContent = 'Invio in corso...';
                button.disabled = true;

                // Submit form
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    showMessage('✓ Grazie! Abbiamo ricevuto la tua richiesta. Ti contatteremo presto.', 'success');
                    form.reset();
                    button.textContent = originalText;
                    button.disabled = false;

                    // Auto-hide message after 5 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                } else {
                    // Error
                    showMessage('✗ Si è verificato un errore. Riprova più tardi.', 'error');
                    button.textContent = originalText;
                    button.disabled = false;
                }
            } catch (error) {
                console.error('Form error:', error);
                showMessage('✗ Errore di connessione. Riprova più tardi.', 'error');
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = type;
        formMessage.style.display = 'block';
    }

    // Real-time validation feedback
    const inputs = form?.querySelectorAll('input, textarea');
    if (inputs) {
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (!this.value.trim()) {
                    this.style.borderColor = '#ff6464';
                } else {
                    this.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                }
            });

            input.addEventListener('focus', function () {
                this.style.borderColor = '#00d4ff';
            });
        });
    }
});

// Email validation - formato standard
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation - formato italiano
function isValidPhone(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Testing Github
