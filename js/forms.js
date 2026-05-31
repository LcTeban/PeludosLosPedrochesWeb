// ========================================
// PELUDOS LOS PEDROCHES – FORMULARIOS
// ========================================

// Funciones de validación
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Acepta formatos: 661447942, 661 44 79 42, +34 661447942, etc.
    const re = /^(\+?\d{1,3}\s?)?\d{6,12}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function initNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por suscribirte!');
            this.reset();
        });
    });
}

function initForms() {
    // --- Formulario de contacto ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const subject = this.querySelector('[name="asunto"]')?.value || '';
            const message = this.querySelector('[name="mensaje"]')?.value || '';

            if (!name || !email || !message) {
                showToast('Por favor completa los campos obligatorios.', 'error');
                return;
            }
            if (!validateEmail(email)) {
                showToast('Por favor introduce un email válido.', 'error');
                return;
            }

            try {
                const { error } = await supabaseClient.from('contact_messages').insert([{
                    name, email, subject, message, created_at: new Date().toISOString()
                }]);
                if (error) throw error;
                showToast('¡Mensaje enviado correctamente!', 'success');
                this.reset();
            } catch (err) {
                showToast('Hubo un error al enviar. Intenta de nuevo.', 'error');
            }
        });
    }

    // --- Formulario de adopción ---
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
        adoptionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';

            if (!name || !email) {
                showToast('Por favor completa al menos nombre y email.', 'error');
                return;
            }
            if (!validateEmail(email)) {
                showToast('Por favor introduce un email válido.', 'error');
                return;
            }
            if (phone && !validatePhone(phone)) {
                showToast('Por favor introduce un teléfono válido.', 'error');
                return;
            }

            try {
                const { error } = await supabaseClient.from('adoption_requests').insert([{
                    name, email, phone,
                    dog_name: this.querySelector('[name="perro"]')?.value || '',
                    housing_type: this.querySelector('[name="vivienda"]')?.value || '',
                    has_pets: this.querySelector('[name="otros_animales"]')?.value || '',
                    message: this.querySelector('[name="mensaje"]')?.value || '',
                    status: 'Pendiente', created_at: new Date().toISOString()
                }]);
                if (error) throw error;
                showToast('¡Solicitud de adopción enviada! Te contactaremos pronto.', 'success');
                this.reset();
            } catch (err) {
                showToast('Hubo un error al enviar. Intenta de nuevo.', 'error');
            }
        });
    }

    // --- Formulario de voluntariado ---
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';

            if (!name || !email) {
                showToast('Por favor completa nombre y email.', 'error');
                return;
            }
            if (!validateEmail(email)) {
                showToast('Por favor introduce un email válido.', 'error');
                return;
            }
            if (phone && !validatePhone(phone)) {
                showToast('Por favor introduce un teléfono válido.', 'error');
                return;
            }

            try {
                const { error } = await supabaseClient.from('volunteer_requests').insert([{
                    name, email, phone,
                    availability: this.querySelector('[name="disponibilidad"]')?.value || '',
                    interests: this.querySelector('[name="intereses"]')?.value || '',
                    created_at: new Date().toISOString()
                }]);
                if (error) throw error;
                showToast('¡Solicitud de voluntariado enviada! Te contactaremos pronto.', 'success');
                this.reset();
            } catch (err) {
                showToast('Hubo un error. Intenta de nuevo.', 'error');
            }
        });
    }

    // --- Formulario de apadrinamiento ---
    const sponsorForm = document.getElementById('sponsorForm');
    if (sponsorForm) {
        sponsorForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';
            const dogChoice = this.querySelector('[name="perro_opcion"]')?.value || '';
            const cantidadSelect = this.querySelector('[name="cantidad"]');
            const cantidadPersonalizada = this.querySelector('[name="cantidad_personalizada"]');
            let amount = '';
            if (cantidadSelect) amount = cantidadSelect.value === 'otra' ? (cantidadPersonalizada?.value || '') : cantidadSelect.value;

            if (!name || !email || !amount) {
                showToast('Por favor completa los campos obligatorios.', 'error');
                return;
            }
            if (!validateEmail(email)) {
                showToast('Por favor introduce un email válido.', 'error');
                return;
            }
            if (phone && !validatePhone(phone)) {
                showToast('Por favor introduce un teléfono válido.', 'error');
                return;
            }

            try {
                const { error } = await supabaseClient.from('sponsor_requests').insert([{
                    name, email, phone, dog_choice: dogChoice,
                    specific_dog: dogChoice === 'especifico' ? (this.querySelector('[name="perro_nombre"]')?.value || '') : '',
                    amount, created_at: new Date().toISOString()
                }]);
                if (error) throw error;
                showToast('¡Solicitud de apadrinamiento enviada! Te contactaremos pronto.', 'success');
                this.reset();
                const dogNameGroup = document.getElementById('dogNameGroup');
                const customAmountGroup = document.getElementById('customAmountGroup');
                if (dogNameGroup) dogNameGroup.style.display = 'none';
                if (customAmountGroup) customAmountGroup.style.display = 'none';
            } catch (err) {
                showToast('Hubo un error. Intenta de nuevo.', 'error');
            }
        });
    }

    // --- Formulario de casa de acogida ---
    const acogeForm = document.getElementById('acogeForm');
    if (acogeForm) {
        acogeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';

            if (!name || !email) {
                showToast('Por favor completa nombre y email.', 'error');
                return;
            }
            if (!validateEmail(email)) {
                showToast('Por favor introduce un email válido.', 'error');
                return;
            }
            if (phone && !validatePhone(phone)) {
                showToast('Por favor introduce un teléfono válido.', 'error');
                return;
            }

            try {
                const { error } = await supabaseClient.from('foster_requests').insert([{
                    name, email, phone,
                    housing_type: this.querySelector('[name="vivienda"]')?.value || '',
                    has_pets: this.querySelector('[name="otros_animales"]')?.value || '',
                    message: this.querySelector('[name="mensaje"]')?.value || '',
                    created_at: new Date().toISOString()
                }]);
                if (error) throw error;
                showToast('¡Solicitud de acogida enviada! Te contactaremos pronto.', 'success');
                this.reset();
            } catch (err) {
                showToast('Hubo un error. Intenta de nuevo.', 'error');
            }
        });
    }

    // --- Formulario de hazte socio ---
    const socioForm = document.getElementById('socioForm');
    if (socioForm) {
        socioForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.querySelector('[name="nombre"]')?.value || '';
            const email = this.querySelector('[name="email"]')?.value || '';
            const phone = this.querySelector('[name="telefono"]')?.value || '';
            const amount = this.querySelector('[name="cuota"]')?.value || '';

            if (!name || !email || !amount) {
                showToast('Por favor completa los campos obligatorios.', 'error');
                return;
            }
            if (!validateEmail(email)) {
                showToast('Por favor introduce un email válido.', 'error');
                return;
            }
            if (phone && !validatePhone(phone)) {
                showToast('Por favor introduce un teléfono válido.', 'error');
                return;
            }

            try {
                const { error } = await supabaseClient.from('membership_requests').insert([{
                    name, email, phone, amount, created_at: new Date().toISOString()
                }]);
                if (error) throw error;
                showToast('¡Solicitud de membresía enviada! Te contactaremos pronto.', 'success');
                this.reset();
            } catch (err) {
                showToast('Hubo un error. Intenta de nuevo.', 'error');
            }
        });
    }

    // --- Formulario de donación (simulado) ---
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        const amountBtns = donationForm.querySelectorAll('.amount-btn');
        const customInput = donationForm.querySelector('#customAmount');
        const totalSpan = document.getElementById('donationTotal');
        
        function updateTotal() {
            const activeBtn = donationForm.querySelector('.amount-btn.active');
            let amount = activeBtn ? parseFloat(activeBtn.dataset.amount) : (customInput?.value ? parseFloat(customInput.value) : 20);
            const isMonthly = donationForm.querySelector('input[name="type"]:checked')?.value === 'monthly';
            if (totalSpan) totalSpan.textContent = isMonthly ? `${amount}€/mes` : `${amount}€`;
        }

        amountBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                amountBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                if (customInput) customInput.value = '';
                updateTotal();
            });
        });
        customInput?.addEventListener('input', () => { amountBtns.forEach(b => b.classList.remove('active')); updateTotal(); });
        donationForm.querySelectorAll('input[name="type"]').forEach(radio => radio.addEventListener('change', updateTotal));
        donationForm.addEventListener('submit', function(e) { e.preventDefault(); alert('Redirigiendo a la pasarela de pago...'); });
        updateTotal();
        donationForm.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const transferDetails = document.getElementById('transferDetails');
                if (transferDetails) transferDetails.style.display = this.value === 'transfer' ? 'block' : 'none';
            });
        });
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function setSelectedDog(dogName) { localStorage.setItem('selectedDog', dogName); }

// Exponer globalmente
window.setSelectedDog = setSelectedDog;
