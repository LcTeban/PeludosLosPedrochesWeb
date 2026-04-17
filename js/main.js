// ========================================
// PELUDOS LOS PEDROCHES - JAVASCRIPT CORREGIDO
// ========================================

// Datos iniciales
let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [
    {
        id: 1,
        title: 'Bendición de animales por San Antón',
        excerpt: 'Un año más celebramos la tradicional bendición de animales en Pozoblanco. ¡Gracias a todos los que participasteis!',
        content: '<p>El pasado 17 de enero celebramos la tradicional bendición de animales por San Antón en Pozoblanco. Fue un día maravilloso donde decenas de familias trajeron a sus mascotas para recibir la bendición.</p><p>Desde Peludos Los Pedroches queremos agradecer a todos los asistentes y recordar la importancia de cuidar y respetar a nuestros animales. ¡Nos vemos el año que viene!</p>',
        date: '20 Enero, 2024',
        image: '🐕'
    },
    {
        id: 2,
        title: 'Nuestro refugio al límite de capacidad',
        excerpt: 'Superamos los 70 perros y necesitamos más casas de acogida urgentemente. La situación es crítica.',
        content: '<p>Actualmente tenemos más de 70 perros en nuestro refugio, una cifra que supera nuestra capacidad. Necesitamos urgentemente casas de acogida que puedan dar un hogar temporal a estos peludos mientras encuentran una familia definitiva.</p><p>Si puedes ayudar, por favor contacta con nosotros. Todos los gastos corren a cargo de la protectora: alimentación, veterinario, medicación... Tú solo pones el cariño y el espacio.</p><p><strong>¡Cada casa de acogida salva vidas!</strong></p>',
        date: '15 Diciembre, 2023',
        image: '🏠'
    },
    {
        id: 3,
        title: 'Colaboración con Fundación Gypaetus',
        excerpt: 'Seguimos trabajando en el proyecto Life contra el uso de cebos envenenados en la comarca.',
        content: '<p>Continuamos nuestra colaboración con la Fundación Gypaetus en el proyecto Life contra el uso de cebos envenenados. Estamos trabajando en la educación y adiestramiento de perros pastores para ganaderos de la zona.</p><p>Esta iniciativa ayuda a proteger tanto al ganado como a la fauna silvestre de la comarca de Los Pedroches. Los perros pastores adiestrados son una alternativa eficaz y ecológica para proteger al ganado de los ataques de depredadores.</p>',
        date: '5 Noviembre, 2023',
        image: '🦅'
    }
];

let dogs = JSON.parse(localStorage.getItem('dogs')) || [
    { id: 1, name: 'Luna', breed: 'Mastina atigrada', age: '2 años', size: 'Grande', gender: 'Hembra', badge: 'Urgente', description: 'Cariñosa a rabiar y juguetona. Ideal para campo. Sus saltos a modo de saludo son mi señal de identidad.', image: '🐕' },
    { id: 2, name: 'Arena', breed: 'Cruce de labrador', age: '2 años', size: 'Mediano', gender: 'Hembra', badge: 'En acogida', description: 'Perrita activa, buena, noble y cariñosa. No deja a nadie indiferente, si me conoces lo comprobarás.', image: '🐕' },
    { id: 3, name: 'Toby', breed: 'Podenco', age: '1 año', size: 'Mediano', gender: 'Macho', badge: 'Nuevo', description: 'Joven y juguetón, busca familia activa que le dé mucho cariño.', image: '🐕' },
    { id: 4, name: 'Rocky', breed: 'Mastín español', age: '4 años', size: 'Grande', gender: 'Macho', badge: '', description: 'Tranquilo y protector. Ideal para finca o casa con terreno. Muy bueno con niños.', image: '🐕' },
    { id: 5, name: 'Nala', breed: 'Podenco', age: '3 años', size: 'Mediano', gender: 'Hembra', badge: 'Urgente', description: 'Muy cariñosa, se lleva bien con todos los perros. Busca familia que le dé mucho amor.', image: '🐕' },
    { id: 6, name: 'Bruno', breed: 'Cruce', age: '5 años', size: 'Grande', gender: 'Macho', badge: '', description: 'Perro mayor muy tranquilo y agradecido. Perfecto para compañía.', image: '🐕' }
];

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initDropdownMobile();
    initNewsletter();
    loadFeaturedDogs();
    loadBlogPreview();
    initSmoothScroll();
    
    // Cargar perros en página de adopción
    if (document.getElementById('dogsList')) {
        loadDogsList();
        initFilters();
    }
    
    // Cargar perros en página de apadrinar
    if (document.getElementById('sponsorDogs')) {
        loadSponsorDogs();
    }
    
    // Inicializar formularios
    initForms();
});

// ========================================
// MENÚ MÓVIL
// ========================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar al hacer clic en un enlace
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    menuBtn.querySelector('i').classList.remove('fa-times');
                    menuBtn.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }
}

// ========================================
// DROPDOWN MÓVIL
// ========================================
function initDropdownMobile() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector(':scope > a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}

// ========================================
// NEWSLETTER
// ========================================
function initNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showToast('¡Gracias por suscribirte! Te mantendremos informado.', 'success');
            this.reset();
        });
    });
}

// ========================================
// SCROLL SUAVE
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ========================================
// CARGAR PERROS DESTACADOS (HOME)
// ========================================
function loadFeaturedDogs() {
    const container = document.getElementById('featuredDogs');
    if (!container) return;
    
    const featured = dogs.filter(dog => dog.badge).slice(0, 3);
    container.innerHTML = featured.map(dog => createDogCard(dog)).join('');
}

// ========================================
// CARGAR PERROS EN ADOPCIÓN
// ========================================
function loadDogsList(filter = {}) {
    const container = document.getElementById('dogsList');
    if (!container) return;
    
    let filteredDogs = [...dogs];
    
    if (filter.size) {
        filteredDogs = filteredDogs.filter(d => d.size.toLowerCase().includes(filter.size));
    }
    if (filter.age) {
        filteredDogs = filteredDogs.filter(d => {
            const age = parseInt(d.age);
            if (filter.age === 'cachorro') return age < 1;
            if (filter.age === 'adulto') return age >= 1 && age <= 7;
            if (filter.age === 'senior') return age > 7;
            return true;
        });
    }
    if (filter.gender) {
        filteredDogs = filteredDogs.filter(d => d.gender.toLowerCase() === filter.gender);
    }
    if (filter.search) {
        filteredDogs = filteredDogs.filter(d => 
            d.name.toLowerCase().includes(filter.search.toLowerCase())
        );
    }
    
    container.innerHTML = filteredDogs.map(dog => createDogCard(dog)).join('');
}

// ========================================
// CREAR TARJETA DE PERRO
// ========================================
function createDogCard(dog) {
    return `
        <div class="dog-card fade-in">
            <div class="dog-image">
                <div class="placeholder-image">${dog.image || '🐕'}</div>
                ${dog.badge ? `<span class="dog-badge">${dog.badge}</span>` : ''}
            </div>
            <div class="dog-info">
                <h3 class="dog-name">${dog.name}</h3>
                <div class="dog-details">
                    <span><i class="fas fa-paw"></i> ${dog.breed}</span>
                    <span><i class="fas fa-calendar"></i> ${dog.age}</span>
                    <span><i class="fas fa-${dog.gender === 'Macho' ? 'mars' : 'venus'}"></i> ${dog.gender}</span>
                </div>
                <p class="dog-description">${dog.description}</p>
                <a href="adopta.html#formulario" class="btn-adopt" onclick="setSelectedDog('${dog.name}')">Quiero adoptar</a>
            </div>
        </div>
    `;
}

// ========================================
// FILTROS
// ========================================
function initFilters() {
    const sizeFilter = document.querySelector('select[aria-label="Tamaño"]') || 
                       document.querySelector('select:first-of-type');
    const ageFilter = document.querySelectorAll('select')[1];
    const genderFilter = document.querySelectorAll('select')[2];
    const searchInput = document.querySelector('input[placeholder*="Buscar"]');
    const searchBtn = document.querySelector('button .fa-search')?.parentElement;
    
    function applyFilters() {
        const filters = {};
        if (sizeFilter?.value) filters.size = sizeFilter.value;
        if (ageFilter?.value) filters.age = ageFilter.value;
        if (genderFilter?.value) filters.gender = genderFilter.value;
        if (searchInput?.value) filters.search = searchInput.value;
        loadDogsList(filters);
    }
    
    if (sizeFilter) sizeFilter.addEventListener('change', applyFilters);
    if (ageFilter) ageFilter.addEventListener('change', applyFilters);
    if (genderFilter) genderFilter.addEventListener('change', applyFilters);
    if (searchBtn) searchBtn.addEventListener('click', applyFilters);
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') applyFilters();
        });
    }
}

// ========================================
// CARGAR PERROS PARA APADRINAR
// ========================================
function loadSponsorDogs() {
    const container = document.getElementById('sponsorDogs');
    if (!container) return;
    
    container.innerHTML = dogs.filter(d => d.status !== 'Adoptado').slice(0, 3).map(dog => `
        <div class="dog-card fade-in">
            <div class="dog-image">
                <div class="placeholder-image">${dog.image || '🐕'}</div>
            </div>
            <div class="dog-info">
                <h3 class="dog-name">${dog.name}</h3>
                <div class="dog-details">
                    <span><i class="fas fa-paw"></i> ${dog.breed}</span>
                    <span><i class="fas fa-calendar"></i> ${dog.age}</span>
                </div>
                <p class="dog-description">${dog.description}</p>
                <a href="apadrina.html#formulario" class="btn-adopt" onclick="setSelectedDog('${dog.name}')">Apadrinar</a>
            </div>
        </div>
    `).join('');
}

// ========================================
// BLOG PREVIEW
// ========================================
function loadBlogPreview() {
    const container = document.getElementById('blogPreview');
    if (!container) return;
    
    const previewPosts = blogPosts.filter(p => p.status === 'Publicado' || !p.status).slice(0, 3);
    container.innerHTML = previewPosts.map(post => `
        <article class="blog-card fade-in" onclick="openBlogModal(${post.id})">
            <div class="blog-image">
                <div class="placeholder-image">${post.image || '📰'}</div>
            </div>
            <div class="blog-content">
                <div class="blog-date"><i class="far fa-calendar"></i> ${post.date}</div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <span class="card-link">Leer más <i class="fas fa-arrow-right"></i></span>
            </div>
        </article>
    `).join('');
}

// ========================================
// MODAL DE BLOG
// ========================================
function openBlogModal(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    const modal = document.getElementById('blogModal');
    document.getElementById('modalTitle').textContent = post.title;
    document.getElementById('modalBody').innerHTML = `
        <div class="placeholder-image" style="height: 200px; margin-bottom: 20px; border-radius: 10px;">${post.image || '📰'}</div>
        <div class="blog-date" style="margin-bottom: 15px; color: #e04f2e;"><i class="far fa-calendar"></i> ${post.date}</div>
        <div style="line-height: 1.8; color: #333;">${post.content || post.excerpt}</div>
    `;
    modal.classList.add('active');
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

function closeModal() {
    document.getElementById('blogModal')?.classList.remove('active');
}

// ========================================
// FORMULARIOS
// ========================================
function initForms() {
    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('¡Mensaje enviado! Te responderemos lo antes posible.', 'success');
            this.reset();
        });
    }
    
    // Formulario de adopción
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
        adoptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('¡Solicitud recibida! Nos pondremos en contacto contigo.', 'success');
            this.reset();
        });
    }
    
    // Formulario de donación
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        initDonationForm(donationForm);
    }
    
    // Formulario de apadrinamiento
    const sponsorForm = document.getElementById('sponsorForm');
    if (sponsorForm) {
        sponsorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('¡Gracias por apadrinar! Te contactaremos pronto.', 'success');
            this.reset();
        });
    }
    
    // Formulario de acogida
    const acogeForm = document.getElementById('acogeForm');
    if (acogeForm) {
        acogeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('¡Gracias por ofrecerte! Te contactaremos pronto.', 'success');
            this.reset();
        });
    }
    
    // Formulario de voluntario
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('¡Gracias por querer ser voluntario! Te contactaremos.', 'success');
            this.reset();
        });
    }
}

// ========================================
// FORMULARIO DE DONACIÓN
// ========================================
function initDonationForm(form) {
    const amountBtns = form.querySelectorAll('.amount-btn');
    const customAmount = form.querySelector('#customAmount');
    const totalSpan = form.querySelector('#donationTotal');
    
    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            amountBtns.forEach(b => {
                b.style.background = 'white';
                b.style.color = '#333';
                b.style.borderColor = '#ddd';
            });
            this.style.background = '#e04f2e';
            this.style.color = 'white';
            this.style.borderColor = '#e04f2e';
            if (customAmount) customAmount.value = '';
            updateTotal();
        });
    });
    
    if (customAmount) {
        customAmount.addEventListener('input', function() {
            amountBtns.forEach(b => {
                b.style.background = 'white';
                b.style.color = '#333';
                b.style.borderColor = '#ddd';
            });
            updateTotal();
        });
    }
    
    function updateTotal() {
        if (!totalSpan) return;
        let amount = 0;
        const activeBtn = form.querySelector('.amount-btn[style*="e04f2e"]');
        if (activeBtn) {
            amount = parseFloat(activeBtn.dataset.amount);
        } else if (customAmount?.value) {
            amount = parseFloat(customAmount.value);
        }
        const isMonthly = form.querySelector('input[name="type"]:checked')?.value === 'monthly';
        totalSpan.textContent = isMonthly ? `${amount}€/mes` : `${amount}€`;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Redirigiendo a la pasarela de pago seguro...', 'success');
    });
}

// ========================================
// TOAST (NOTIFICACIONES)
// ========================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}" style="margin-right: 10px;"></i>
        ${message}
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================
function setSelectedDog(dogName) {
    localStorage.setItem('selectedDog', dogName);
}

// Obtener perro seleccionado en formularios
document.addEventListener('DOMContentLoaded', function() {
    const selectedDog = localStorage.getItem('selectedDog');
    if (selectedDog) {
        const select = document.querySelector('select[name="perro"]');
        if (select) {
            const option = Array.from(select.options).find(opt => opt.value === selectedDog);
            if (option) option.selected = true;
        }
        localStorage.removeItem('selectedDog');
    }
});

// ========================================
// FUNCIONES GLOBALES
// ========================================
window.openBlogModal = openBlogModal;
window.closeModal = closeModal;
window.setSelectedDog = setSelectedDog;

console.log('🐾 Peludos Los Pedroches - Web cargada correctamente');
