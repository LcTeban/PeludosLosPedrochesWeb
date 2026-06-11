// ========================================
// PELUDOS LOS PEDROCHES – FORMULARIOS CON EMAILJS
// ========================================

// CONFIGURACIÓN DE EMAILJS
const EMAILJS_PUBLIC_KEY = 'P5E2Nyz_zPSdS4Onh';
const EMAILJS_SERVICE_ID = 'service_2jfl1x3';

// Como solo tienes una plantilla genérica por ahora, usaremos esta para todos.
// Cuando crees plantillas específicas en EmailJS, cambia estas variables.
const TEMPLATE_ID_CONTACTO = 'template_generico';
const TEMPLATE_ID_ADOPCION = 'template_generico';
const TEMPLATE_ID_VOLUNTARIO = 'template_generico';
const TEMPLATE_ID_APADRINA = 'template_generico';
const TEMPLATE_ID_ACOGIDA = 'template_generico';
const TEMPLATE_ID_SOCIO = 'template_generico';

// Inicializar EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// Funciones de validación
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(\+?\d{1,3}\s?)?\d{6,12}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Función genérica para enviar email
function sendEmail(templateId, templateParams) {
    if (typeof emailjs === 'undefined') return Promise.resolve();
    return emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams).catch(err => console.warn('EmailJS error:', err));
}

// Utilidad para mostrar notificaciones (Toast)
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle')}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function initNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput || !validateEmail(emailInput.value)) {
                showToast('Por favor, introduce un email válido.', 'error');
                return;
            }
            // TODO: Aquí habría que guardar el email en Supabase en una tabla 'subscribers'
            showToast('¡Gracias por suscribirte!', 'success');
            this.reset();
        });
    });
}

// Función helper para manejar el estado del botón de envío
function setLoadingState(button, isLoading, originalText) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        button.style.opacity = '0.7';
    } else {
        button.disabled = false;
        button.innerHTML = originalText;
        button.style.opacity = '1';
    }
}

function initForms() {
    // --- Formulario de contacto ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            setLoadingState(btn, true, originalText);

            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const subject = this.querySelector('[name="asunto"]')?.value || '';
            const message = this.querySelector('[name="mensaje"]')?.value || '';

            if (!name || !email || !message) { showToast('Completa los campos obligatorios.', 'error'); setLoadingState(btn, false, originalText); return; }
            if (!validateEmail(email)) { showToast('Email no válido.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('contact_messages').insert([{ name, email, subject, message }]);
                if (error) throw error;
                sendEmail(TEMPLATE_ID_CONTACTO, { nombre: name, email: email, asunto: subject, mensaje: message });
                showToast('¡Mensaje enviado correctamente!', 'success');
                this.reset();
            } catch (err) {
                showToast('Hubo un error al enviar. Intenta de nuevo.', 'error');
            } finally {
                setLoadingState(btn, false, originalText);
            }
        });
    }

    // --- Formulario de adopción ---
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
        adoptionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            setLoadingState(btn, true, originalText);

            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';
            const dog_name = this.querySelector('[name="perro"]')?.value || '';
            const housing_type = this.querySelector('[name="vivienda"]')?.value || '';
            const has_pets = this.querySelector('[name="otros_animales"]')?.value || '';
            const message = this.querySelector('[name="mensaje"]')?.value || '';

            if (!name || !email) { showToast('Nombre y email son obligatorios.', 'error'); setLoadingState(btn, false, originalText); return; }
            if (!validateEmail(email)) { showToast('Email no válido.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('adoption_requests').insert([{ name, email, phone, dog_name, housing_type, has_pets, message, status: 'Pendiente' }]);
                if (error) throw error;
                sendEmail(TEMPLATE_ID_ADOPCION, { nombre: name, email: email, telefono: phone, perro: dog_name, vivienda: housing_type, otros_animales: has_pets, mensaje: message });
                showToast('¡Solicitud enviada! Te contactaremos pronto.', 'success');
                this.reset();
            } catch (err) {
                showToast('Error al enviar. Intenta de nuevo.', 'error');
            } finally {
                setLoadingState(btn, false, originalText);
            }
        });
    }

    // --- Formulario de voluntariado ---
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            setLoadingState(btn, true, originalText);

            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';
            const availability = this.querySelector('[name="disponibilidad"]')?.value || '';
            const interests = this.querySelector('[name="intereses"]')?.value || '';

            if (!name || !email) { showToast('Nombre y email son obligatorios.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('volunteer_requests').insert([{ name, email, phone, availability, interests }]);
                if (error) throw error;
                sendEmail(TEMPLATE_ID_VOLUNTARIO, { nombre: name, email: email, telefono: phone, disponibilidad: availability, intereses: interests });
                showToast('¡Solicitud enviada!', 'success');
                this.reset();
            } catch (err) {
                showToast('Error al enviar.', 'error');
            } finally {
                setLoadingState(btn, false, originalText);
            }
        });
    }

    // --- Formulario de apadrinamiento ---
    const sponsorForm = document.getElementById('sponsorForm');
    if (sponsorForm) {
        sponsorForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            setLoadingState(btn, true, originalText);

            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';
            const dogChoice = this.querySelector('[name="perro_opcion"]')?.value || '';
            const cantidadSelect = this.querySelector('[name="cantidad"]');
            const cantidadPersonalizada = this.querySelector('[name="cantidad_personalizada"]');
            let amount = '';
            if (cantidadSelect) amount = cantidadSelect.value === 'otra' ? (cantidadPersonalizada?.value || '') : cantidadSelect.value;
            const dogName = dogChoice === 'especifico' ? (this.querySelector('[name="perro_nombre"]')?.value || '') : 'Elegid por mí';

            if (!name || !email || !amount) { showToast('Completa los campos obligatorios.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('sponsor_requests').insert([{ name, email, phone, dog_choice: dogChoice, specific_dog: dogChoice === 'especifico' ? dogName : '', amount }]);
                if (error) throw error;
                sendEmail(TEMPLATE_ID_APADRINA, { nombre: name, email: email, telefono: phone, decision: dogChoice === 'especifico' ? 'Eligió perro' : 'Elegid por mí', perro_nombre: dogName, cantidad: amount });
                showToast('¡Solicitud enviada!', 'success');
                this.reset();
            } catch (err) {
                showToast('Error al enviar.', 'error');
            } finally {
                setLoadingState(btn, false, originalText);
            }
        });
    }

    // --- Formulario de casa de acogida ---
    const acogeForm = document.getElementById('acogeForm');
    if (acogeForm) {
        acogeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            setLoadingState(btn, true, originalText);

            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';
            const housing_type = this.querySelector('[name="vivienda"]')?.value || '';
            const has_pets = this.querySelector('[name="otros_animales"]')?.value || '';
            const message = this.querySelector('[name="mensaje"]')?.value || '';

            if (!name || !email) { showToast('Nombre y email son obligatorios.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('foster_requests').insert([{ name, email, phone, housing_type, has_pets, message }]);
                if (error) throw error;
                sendEmail(TEMPLATE_ID_ACOGIDA, { nombre: name, email: email, telefono: phone, vivienda: housing_type, otros_animales: has_pets, mensaje: message });
                showToast('¡Solicitud enviada!', 'success');
                this.reset();
            } catch (err) {
                showToast('Error al enviar.', 'error');
            } finally {
                setLoadingState(btn, false, originalText);
            }
        });
    }

    // --- Formulario de hazte socio ---
    const socioForm = document.getElementById('socioForm');
    if (socioForm) {
        socioForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            setLoadingState(btn, true, originalText);

            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';
            const amount = this.querySelector('[name="cuota"]')?.value || '';

            if (!name || !email || !amount) { showToast('Completa los campos obligatorios.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('membership_requests').insert([{ name, email, phone, amount }]);
                if (error) throw error;
                sendEmail(TEMPLATE_ID_SOCIO, { nombre: name, email: email, telefono: phone, cuota: amount });
                showToast('¡Solicitud enviada!', 'success');
                this.reset();
            } catch (err) {
                showToast('Error al enviar.', 'error');
            } finally {
                setLoadingState(btn, false, originalText);
            }
        });
    }

    // --- Formulario de donación ---
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        const amountBtns = donationForm.querySelectorAll('.amount-btn');
        const customInput = donationForm.querySelector('#customAmount');
        const totalSpan = document.getElementById('donationTotal');
        
        function updateTotal() {
            const activeBtn = donationForm.querySelector('.amount-btn.active');
            let amount = activeBtn ? parseFloat(activeBtn.dataset.amount) : (customInput?.value ? parseFloat(customInput.value) : 0);
            const isMonthly = donationForm.querySelector('input[name="type"]:checked')?.value === 'monthly';
            if (totalSpan) totalSpan.textContent = amount > 0 ? (isMonthly ? `${amount}€/mes` : `${amount}€`) : '0€';
        }

        amountBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                amountBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                if (customInput) customInput.value = '';
                updateTotal();
            });
        });
        
        customInput?.addEventListener('input', () => { 
            amountBtns.forEach(b => b.classList.remove('active')); 
            updateTotal(); 
        });
        
        donationForm.querySelectorAll('input[name="type"]').forEach(radio => radio.addEventListener('change', updateTotal));
        
        donationForm.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const transferDetails = document.getElementById('transferDetails');
                if (transferDetails) transferDetails.style.display = this.value === 'transfer' ? 'block' : 'none';
            });
        });

        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            setLoadingState(btn, true, originalText);
            
            // Simulamos el proceso de pago (Cuando tengas PayPal/Stripe real, esto cambiará)
            setTimeout(() => {
                showToast('Redirigiendo a la pasarela de pago...', 'success');
                setLoadingState(btn, false, originalText);
                // window.location.href = 'URL_DE_PAYPAL';
            }, 1500);
        });
        
        updateTotal();
    }
}

function setSelectedDog(dogName) { 
    // Guardamos en localStorage como fallback, pero ahora también usaremos URL
    localStorage.setItem('selectedDog', dogName); 
}

// Exponer globalmente
window.setSelectedDog = setSelectedDog;
window.showToast = showToast;
