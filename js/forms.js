// ========================================
// PELUDOS LOS PEDROCHES – FORMULARIOS
// ========================================

function initNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', function(e) { e.preventDefault(); alert('¡Gracias por suscribirte!'); this.reset(); });
    });
}

function initForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                name: this.querySelector('[name="nombre"]')?.value || '',
                email: this.querySelector('[name="email"]')?.value || '',
                subject: this.querySelector('[name="asunto"]')?.value || '',
                message: this.querySelector('[name="mensaje"]')?.value || '',
                created_at: new Date().toISOString()
            };
            if (!formData.name || !formData.email || !formData.message) { showToast('Por favor completa los campos obligatorios.', 'error'); return; }
            try {
                const { error } = await supabaseClient.from('contact_messages').insert([formData]);
                if (error) throw error;
                showToast('¡Mensaje enviado correctamente!', 'success');
                this.reset();
            } catch (err) { showToast('Hubo un error al enviar. Intenta de nuevo.', 'error'); }
        });
    }
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
        adoptionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                name: this.querySelector('[name="nombre"]')?.value || '',
                email: this.querySelector('[name="email"]')?.value || '',
                phone: this.querySelector('[name="telefono"]')?.value || '',
                dog_name: this.querySelector('[name="perro"]')?.value || '',
                housing_type: this.querySelector('[name="vivienda"]')?.value || '',
                has_pets: this.querySelector('[name="otros_animales"]')?.value || '',
                message: this.querySelector('[name="mensaje"]')?.value || '',
                status: 'Pendiente', created_at: new Date().toISOString()
            };
            if (!formData.name || !formData.email) { showToast('Por favor completa al menos nombre y email.', 'error'); return; }
            try {
                const { error } = await supabaseClient.from('adoption_requests').insert([formData]);
                if (error) throw error;
                showToast('¡Solicitud de adopción enviada! Te contactaremos pronto.', 'success');
                this.reset();
            } catch (err) { showToast('Hubo un error al enviar. Intenta de nuevo.', 'error'); }
        });
    }
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                name: this.querySelector('[name="nombre"]')?.value || '',
                email: this.querySelector('[name="email"]')?.value || '',
                phone: this.querySelector('[name="telefono"]')?.value || '',
                availability: this.querySelector('[name="disponibilidad"]')?.value || '',
                interests: this.querySelector('[name="intereses"]')?.value || '',
                created_at: new Date().toISOString()
            };
            if (!formData.name || !formData.email) { showToast('Por favor completa nombre y email.', 'error'); return; }
            try {
                const { error } = await supabaseClient.from('volunteer_requests').insert([formData]);
                if (error) throw error;
                showToast('¡Solicitud de voluntariado enviada! Te contactaremos pronto.', 'success');
                this.reset();
            } catch (err) { showToast('Hubo un error. Intenta de nuevo.', 'error'); }
        });
    }
    const sponsorForm = document.getElementById('sponsorForm');
    if (sponsorForm) {
        sponsorForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const dogChoice = this.querySelector('[name="perro_opcion"]')?.value || '';
            const cantidadSelect = this.querySelector('[name="cantidad"]');
            const cantidadPersonalizada = this.querySelector('[name="cantidad_personalizada"]');
            let amount = '';
            if (cantidadSelect) amount = cantidadSelect.value === 'otra' ? (cantidadPersonalizada?.value || '') : cantidadSelect.value;
            const formData = {
                name: this.querySelector('[name="nombre"]')?.value || '',
                email: this.querySelector('[name="email"]')?.value || '',
                phone: this.querySelector('[name="telefono"]')?.value || '',
                dog_choice: dogChoice,
                specific_dog: dogChoice === 'especifico' ? (this.querySelector('[name="perro_nombre"]')?.value || '') : '',
                amount: amount, created_at: new Date().toISOString()
            };
            if (!formData.name || !formData.email || !formData.amount) { showToast('Por favor completa los campos obligatorios.', 'error'); return; }
            try {
                const { error } = await supabaseClient.from('sponsor_requests').insert([formData]);
                if (error) throw error;
                showToast('¡Solicitud de apadrinamiento enviada! Te contactaremos pronto.', 'success');
                this.reset();
                const dogNameGroup = document.getElementById('dogNameGroup');
                const customAmountGroup = document.getElementById('customAmountGroup');
                if (dogNameGroup) dogNameGroup.style.display = 'none';
                if (customAmountGroup) customAmountGroup.style.display = 'none';
            } catch (err) { showToast('Hubo un error. Intenta de nuevo.', 'error'); }
        });
    }
    const acogeForm = document.getElementById('acogeForm');
    if (acogeForm) {
        acogeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                name: this.querySelector('[name="nombre"]')?.value || '',
                email: this.querySelector('[name="email"]')?.value || '',
                phone: this.querySelector('[name="telefono"]')?.value || '',
                housing_type: this.querySelector('[name="vivienda"]')?.value || '',
                has_pets: this.querySelector('[name="otros_animales"]')?.value || '',
                message: this.querySelector('[name="mensaje"]')?.value || '',
                created_at: new Date().toISOString()
            };
            if (!formData.name || !formData.email) { showToast('Por favor completa nombre y email.', 'error'); return; }
            try {
                const { error } = await supabaseClient.from('foster_requests').insert([formData]);
                if (error) throw error;
                showToast('¡Solicitud de acogida enviada! Te contactaremos pronto.', 'success');
                this.reset();
            } catch (err) { showToast('Hubo un error. Intenta de nuevo.', 'error'); }
        });
    }
    const socioForm = document.getElementById('socioForm');
    if (socioForm) {
        socioForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = {
                name: this.querySelector('[name="nombre"]')?.value || '',
                email: this.querySelector('[name="email"]')?.value || '',
                phone: this.querySelector('[name="telefono"]')?.value || '',
                amount: this.querySelector('[name="cuota"]')?.value || '',
                created_at: new Date().toISOString()
            };
            if (!formData.name || !formData.email || !formData.amount) { showToast('Por favor completa los campos obligatorios.', 'error'); return; }
            try {
                const { error } = await supabaseClient.from('membership_requests').insert([formData]);
                if (error) throw error;
                showToast('¡Solicitud de membresía enviada! Te contactaremos pronto.', 'success');
                this.reset();
            } catch (err) { showToast('Hubo un error. Intenta de nuevo.', 'error'); }
        });
    }
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
