// ========================================
// PELUDOS LOS PEDROCHES – FORMULARIOS CON EMAILJS (1 PLANTILLA GENÉRICA)
// ========================================

// 1. CONFIGURACIÓN DE EMAILJS
const EMAILJS_PUBLIC_KEY = 'P5E2Nyz_zPSdS4Onh';
const EMAILJS_SERVICE_ID = 'service_2jfl1x3';

// Usamos UNA SOLA plantilla para todos los formularios (Plan Gratuito)
const TEMPLATE_ID_GENERICO = 'template_peludos'; 

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
function sendEmail(templateParams) {
    if (typeof emailjs === 'undefined') return Promise.resolve();
    return emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_ID_GENERICO, templateParams)
        .catch(err => console.warn('EmailJS error:', err));
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

// Utilidad para manejar el estado de carga del botón (evita doble clic)
function setLoadingState(button, isLoading, originalText) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';
    } else {
        button.disabled = false;
        button.innerHTML = originalText;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
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
                
                const detalles = `Asunto: ${subject}\nMensaje: ${message}`;
                sendEmail({ nombre: name, email: email, telefono: 'No proporcionado', tipo_formulario: 'Contacto', detalles: detalles });
                
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

                const detalles = `Perro de interés: ${dog_name || 'No especificado'}\nVivienda: ${housing_type}\nOtros animales: ${has_pets}\nMensaje: ${message}`;
                sendEmail({ nombre: name, email: email, telefono: phone, tipo_formulario: 'Adopción', detalles: detalles });

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
            if (!validateEmail(email)) { showToast('Email no válido.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('volunteer_requests').insert([{ name, email, phone, availability, interests }]);
                if (error) throw error;

                const detalles = `Disponibilidad: ${availability}\nIntereses: ${interests}`;
                sendEmail({ nombre: name, email: email, telefono: phone, tipo_formulario: 'Voluntariado', detalles: detalles });

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
            if (!validateEmail(email)) { showToast('Email no válido.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('sponsor_requests').insert([{ name, email, phone, dog_choice: dogChoice, specific_dog: dogChoice === 'especifico' ? dogName : '', amount }]);
                if (error) throw error;

                const decisionText = dogChoice === 'especifico' ? `Eligió perro: ${dogName}` : 'Elegid por mí';
                const detalles = `Decisión: ${decisionText}\nAportación: ${amount}€/mes`;
                sendEmail({ nombre: name, email: email, telefono: phone, tipo_formulario: 'Apadrinamiento', detalles: detalles });

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
            if (!validateEmail(email)) { showToast('Email no válido.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('foster_requests').insert([{ name, email, phone, housing_type, has_pets, message }]);
                if (error) throw error;

                const detalles = `Vivienda: ${housing_type}\nOtros animales: ${has_pets}\nMensaje: ${message}`;
                sendEmail({ nombre: name, email: email, telefono: phone, tipo_formulario: 'Casa de Acogida', detalles: detalles });

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
            if (!validateEmail(email)) { showToast('Email no válido.', 'error'); setLoadingState(btn, false, originalText); return; }

            try {
                const { error } = await supabaseClient.from('membership_requests').insert([{ name, email, phone, amount }]);
                if (error) throw error;

                const detalles = `Cuota mensual elegida: ${amount}€`;
                sendEmail({ nombre: name, email: email, telefono: phone, tipo_formulario: 'Hazte Socio', detalles: detalles });

                showToast('¡Solicitud enviada!', 'success');
                this.reset();
            } catch (err) {
                showToast('Error al enviar.', 'error');
            } finally {
                setLoadingState(btn, false, originalText);
            }
        });
    }

    // ==========================================
    // --- Formulario de donación (PREPARADO PARA PRODUCCIÓN) ---
    // ==========================================
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        const amountBtns = donationForm.querySelectorAll('.amount-btn');
        const customInput = donationForm.querySelector('#customAmount');
        const totalSpan = document.getElementById('donationTotal');
        
        // Función para calcular el total visualmente
        function updateTotal() {
            const activeBtn = donationForm.querySelector('.amount-btn.active');
            let amount = activeBtn ? parseFloat(activeBtn.dataset.amount) : (customInput?.value ? parseFloat(customInput.value) : 20);
            const isMonthly = donationForm.querySelector('input[name="type"]:checked')?.value === 'monthly';
            if (totalSpan) totalSpan.textContent = isMonthly ? `${amount}€/mes` : `${amount}€`;
        }

        // Lógica de los botones de cantidad
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

        // ==========================================
        // MANEJO DEL ENVÍO DEL FORMULARIO DE DONACIÓN
        // ==========================================
        donationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // 1. Activar estado de carga
            if (typeof setLoadingState === 'function') {
                setLoadingState(btn, true, originalText);
            }

            // 2. Recopilar datos del formulario
            const formData = new FormData(this);
            const amount = formData.get('custom_amount') || donationForm.querySelector('.amount-btn.active')?.dataset.amount || '20';
            const type = formData.get('type');
            const name = formData.get('donor_name');
            const email = formData.get('donor_email');
            const phone = formData.get('donor_phone');
            const paymentMethod = formData.get('paymentMethod');

            try {
                // 3. (Opcional pero recomendado) Guardar el intento en Supabase para tener registro
                /* 
                await supabaseClient.from('donations').insert([{ 
                    name, email, phone, amount, 
                    type: type === 'monthly' ? 'Mensual' : 'Única',
                    payment_method: paymentMethod,
                    status: 'Pendiente de pago'
                }]);
                */

                // ==========================================================
                // 🚨 ZONA DE INTEGRACIÓN DE PAGO REAL 🚨
                // Cuando tengas el código, BORRA el "setTimeout" de abajo 
                // y DESCOMENTA la opción que vayas a usar:
                // ==========================================================

                /* 
                // OPCIÓN A: PAYPAL (Redirección simple con Hosted Button)
                // Reemplaza 'TU_HOSTED_BUTTON_ID' con el ID real de PayPal
                const paypalUrl = `https://www.paypal.com/donate/?hosted_button_id=TU_HOSTED_BUTTON_ID&amount=${amount}`;
                window.location.href = paypalUrl;
                */

                /* 
                // OPCIÓN B: STRIPE PAYMENT LINKS (Recomendado por facilidad)
                // Creas un "Payment Link" en Stripe y le pasas el email como referencia
                const stripeUrl = `https://buy.stripe.com/TU_ENLACE_DE_STRIPE_AQUI?client_reference_id=${encodeURIComponent(email)}&prefilled_email=${encodeURIComponent(email)}`;
                window.location.href = stripeUrl;
                */

                /* 
                // OPCIÓN C: PAYPAL JS SDK (Avanzado, abre ventana modal)
                // Requiere añadir el script de PayPal en el <head> del HTML
                // paypal.Buttons({ createOrder: function() { ... } }).render('#paypal-button-container');
                */

                // ==========================================================
                // MODO PRUEBA ACTUAL (Simulación)
                // ==========================================================
                setTimeout(() => {
                    showToast(`Modo prueba: Se procesaría una donación de ${amount}€ por ${paymentMethod}.`, 'info');
                    if (typeof setLoadingState === 'function') {
                        setLoadingState(btn, false, originalText);
                    }
                    // this.reset(); // Descomentar en producción para limpiar el formulario
                }, 1500);

            } catch (err) {
                console.error('Error procesando donación:', err);
                showToast('Hubo un error al procesar la solicitud.', 'error');
                if (typeof setLoadingState === 'function') {
                    setLoadingState(btn, false, originalText);
                }
            }
        });
        
        // Inicializar el total al cargar
        updateTotal();
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
            showToast('¡Gracias por suscribirte!', 'success');
            this.reset();
        });
    });
}

function setSelectedDog(dogName) { 
    localStorage.setItem('selectedDog', dogName); 
}

// Exponer globalmente
window.setSelectedDog = setSelectedDog;
window.showToast = showToast;
