// ========================================
// PELUDOS LOS PEDROCHES – main.js CORREGIDO
// ========================================
const SUPABASE_URL = 'https://grknhpyouzhmhqpjjomg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya25ocHlvdXpobWhxcGpqb21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQ0NTQsImV4cCI6MjA5MjI4MDQ1NH0.z2z_eP7DCj_s-JY-ewzZ7RYXGZ0TgAOKzK4HxyoOeic';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('✅ Supabase inicializado');

let dogs = [];
let blogPosts = [];
let settings = {};

// ========================================
// CARGA DE CONFIGURACIÓN
// ========================================
async function loadSettings() {
    try {
        const { data, error } = await supabaseClient.from('settings').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
            settings = {};
            data.forEach(item => { settings[item.key] = item.value; });
            console.log('✅ Configuración cargada:', settings);
        } else {
            console.warn('⚠️ Sin ajustes en Supabase, usando valores por defecto');
            loadDefaultSettings();
            return;
        }
        applySettings();
    } catch (err) {
        console.error('❌ Error cargando settings:', err);
        loadDefaultSettings();
    }
}

function loadDefaultSettings() {
    settings = {
        logo_text: 'PELUDOS LOS PEDROCHES',
        logo_subtitle: 'Protectora de Animales',
        primary_color: '#e04f2e',
        secondary_color: '#2c5f2d',
        contact_phone1: '661 44 79 42',
        contact_phone2: '666 86 16 20',
        contact_email: 'peludoslospedroches@gmail.com',
        contact_address: 'Comarca de Los Pedroches, Córdoba',
        logo_url: ''
    };
    applySettings();
}

function applySettings() {
    console.log('🎨 Aplicando configuración...');
    const logoIcon = document.getElementById('logoIcon');
    if (logoIcon) {
        logoIcon.innerHTML = '';
        if (settings.logo_url) {
            const img = document.createElement('img');
            img.src = settings.logo_url;
            img.alt = settings.logo_text || 'Logo';
            img.style.maxHeight = '45px';
            img.onerror = () => {
                logoIcon.innerHTML = '<span class="logo-emoji">🐾</span>';
            };
            logoIcon.appendChild(img);
        } else {
            logoIcon.innerHTML = '<span class="logo-emoji">🐾</span>';
        }
    }
    const logoTextEl = document.getElementById('logoText');
    if (logoTextEl) logoTextEl.textContent = settings.logo_text || 'PELUDOS LOS PEDROCHES';
    const logoSubtitleEl = document.getElementById('logoSubtitle');
    if (logoSubtitleEl) logoSubtitleEl.textContent = settings.logo_subtitle || 'Protectora de Animales';

    if (settings.primary_color) document.documentElement.style.setProperty('--primary', settings.primary_color);
    if (settings.secondary_color) document.documentElement.style.setProperty('--secondary', settings.secondary_color);
    updateContactInfo();
    applySectionImages();  // Añadido para imágenes de secciones
    applyAboutContent();
}

function updateContactInfo() {
    const phone1 = document.querySelector('[data-contact="phone1"]');
    if (phone1) {
        phone1.href = `tel:${settings.contact_phone1?.replace(/\s/g, '') || ''}`;
        phone1.textContent = settings.contact_phone1 || '';
    }
    const phone2 = document.querySelector('[data-contact="phone2"]');
    if (phone2) {
        phone2.href = `tel:${settings.contact_phone2?.replace(/\s/g, '') || ''}`;
        phone2.textContent = settings.contact_phone2 || '';
    }
    const email = document.querySelector('[data-contact="email"]');
    if (email) {
        email.href = `mailto:${settings.contact_email || ''}`;
        email.textContent = settings.contact_email || '';
    }
    const address = document.querySelector('[data-contact="address"]');
    if (address) address.textContent = settings.contact_address || '';
}

// ========================================
// IMÁGENES DE SECCIONES
// ========================================
function applySectionImages() {
    const sections = [
        { id: 'sectionImage-volunteer', key: 'volunteer_image', defaultEmoji: '🤝🐕' },
        { id: 'sectionImage-apadrina', key: 'apadrina_image', defaultEmoji: '🐕❤️' },
        { id: 'sectionImage-acoge', key: 'acoge_image', defaultEmoji: '🏠🐕' },
        { id: 'sectionImage-about', key: 'about_image', defaultEmoji: '🐕🐕🐕' }
    ];

    sections.forEach(section => {
        const container = document.getElementById(section.id);
        if (!container) return;

        const imageUrl = settings[section.key];
        if (imageUrl) {
            container.innerHTML = '';
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = section.id;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '10px';
            img.onerror = () => {
                container.innerHTML = section.defaultEmoji;
            };
            container.appendChild(img);
        }
    });
}

function applyAboutContent() {
    const titleEl = document.getElementById('aboutTitle');
    if (titleEl) titleEl.textContent = settings.about_title || 'QUIÉNES SOMOS';

    const subtitleEl = document.getElementById('aboutSubtitle');
    if (subtitleEl) subtitleEl.textContent = settings.about_subtitle || '';

    const historyEl = document.getElementById('aboutHistory');
    if (historyEl) historyEl.innerHTML = settings.about_history || '';

    const missionEl = document.getElementById('aboutMission');
    if (missionEl) missionEl.textContent = settings.about_mission || '';

    const visionEl = document.getElementById('aboutVision');
    if (visionEl) visionEl.textContent = settings.about_vision || '';

    const valuesEl = document.getElementById('aboutValues');
    if (valuesEl) valuesEl.textContent = settings.about_values || '';

    const collaborationsEl = document.getElementById('aboutCollaborations');
    if (collaborationsEl) collaborationsEl.innerHTML = settings.about_collaborations || '';
}

// ========================================
// CARGA DE PERROS
// ========================================
async function loadDogs() {
    try {
        const { data, error } = await supabaseClient.from('dogs').select('*').order('id', { ascending: false });
        if (error) throw error;
        dogs = data || [];
        console.log('🐕 Perros cargados:', dogs.length);
        renderFeaturedDogs();
        renderDogsList();
        renderSponsorDogs();
        fillAdoptionSelect();
    } catch (err) {
        console.error('❌ Error cargando perros:', err);
        loadDefaultDogs();
    }
}

function loadDefaultDogs() {
    dogs = [
        { id: 1, name: 'Luna', breed: 'Mastina atigrada', age: '2 años', gender: 'Hembra', badge: 'Urgente', description: 'Cariñosa a rabiar y juguetona.', image_url: null, status: 'Disponible' },
        { id: 2, name: 'Arena', breed: 'Cruce de labrador', age: '2 años', gender: 'Hembra', badge: 'En acogida', description: 'Activa y noble.', image_url: null, status: 'En acogida' },
        { id: 3, name: 'Toby', breed: 'Podenco', age: '1 año', gender: 'Macho', badge: 'Nuevo', description: 'Joven y juguetón.', image_url: null, status: 'Disponible' }
    ];
    renderFeaturedDogs();
    renderDogsList();
    renderSponsorDogs();
    fillAdoptionSelect();
}

function renderFeaturedDogs() {
    const container = document.getElementById('featuredDogs');
    if (!container) return;
    const dogsToShow = dogs.filter(d => d.badge).length >= 3 ? dogs.filter(d => d.badge).slice(0, 3) : dogs.slice(0, 3);
    container.innerHTML = dogsToShow.map(dog => createDogCard(dog)).join('');
}

function renderDogsList(filter = {}) {
    const container = document.getElementById('dogsList');
    if (!container) return;
    let filtered = dogs.filter(d => d.status !== 'Adoptado');
    if (filter.size) filtered = filtered.filter(d => d.size?.toLowerCase().includes(filter.size));
    if (filter.gender) filtered = filtered.filter(d => d.gender?.toLowerCase() === filter.gender);
    if (filter.search) filtered = filtered.filter(d => d.name?.toLowerCase().includes(filter.search.toLowerCase()));
    container.innerHTML = filtered.map(dog => createDogCard(dog)).join('');
}

function renderSponsorDogs() {
    const container = document.getElementById('sponsorDogs');
    if (!container) return;
    const available = dogs.filter(d => d.status !== 'Adoptado').slice(0, 3);
    container.innerHTML = available.map(dog => createDogCard(dog)).join('');
}

function fillAdoptionSelect() {
    const select = document.querySelector('select[name="perro"]');
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona un perro</option>';
    dogs.filter(d => d.status !== 'Adoptado').forEach(dog => {
        const option = document.createElement('option');
        option.value = dog.name;
        option.textContent = dog.name;
        select.appendChild(option);
    });
}

function createDogCard(dog) {
    const imageHtml = dog.image_url 
        ? `<img src="${dog.image_url}" alt="${dog.name}" style="width:100%;height:100%;object-fit:cover;">` 
        : `<div class="placeholder-image">🐕</div>`;
    return `
        <div class="dog-card fade-in">
            <div class="dog-image">
                ${imageHtml}
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
                <button class="btn-adopt" onclick="openDogModal(${dog.id})">Quiero adoptar</button>
            </div>
        </div>
    `;
}

// ========================================
// MODAL DE PERRO
// ========================================
function openDogModal(dogId) {
    const dog = dogs.find(d => d.id === dogId);
    if (!dog) return;

    let modal = document.getElementById('dogModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dogModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="dogModalTitle"></h2>
                    <button class="modal-close" onclick="closeDogModal()">&times;</button>
                </div>
                <div class="modal-body" id="dogModalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeDogModal();
        });
    }

    document.getElementById('dogModalTitle').textContent = dog.name;
    document.getElementById('dogModalBody').innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            ${dog.image_url 
                ? `<img src="${dog.image_url}" alt="${dog.name}" style="max-width:100%; max-height:300px; border-radius:10px;">` 
                : '<div class="placeholder-image" style="height:200px;">🐕</div>'}
        </div>
        <div class="dog-details" style="margin-bottom:15px;">
            <span><i class="fas fa-paw"></i> ${dog.breed}</span>
            <span><i class="fas fa-calendar"></i> ${dog.age}</span>
            <span><i class="fas fa-${dog.gender === 'Macho' ? 'mars' : 'venus'}"></i> ${dog.gender}</span>
            <span><i class="fas fa-ruler"></i> ${dog.size}</span>
        </div>
        <p style="margin-bottom:20px;">${dog.description}</p>
        <a href="adopta.html#formulario" class="btn btn-primary" style="display:block; text-align:center;" onclick="setSelectedDog('${dog.name}')">¡Quiero adoptar a ${dog.name}!</a>
    `;
    modal.classList.add('active');
}

function closeDogModal() {
    const modal = document.getElementById('dogModal');
    if (modal) modal.classList.remove('active');
}

// ========================================
// BLOG
// ========================================
function initBlogListeners() {
    let modal = document.getElementById('blogModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'blogModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle"></h2>
                    <button class="modal-close" onclick="closeBlogModal()">&times;</button>
                </div>
                <div class="modal-body" id="modalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeBlogModal();
        });
    }

    document.body.addEventListener('click', function(e) {
        const card = e.target.closest('.blog-card');
        if (card) {
            const postId = parseInt(card.dataset.id);
            console.log('Click en blog-card, postId:', postId);
            openBlogModal(postId);
        }
    });
}

async function loadBlogPosts() {
    try {
        const { data, error } = await supabaseClient.from('blog_posts').select('*').eq('status', 'Publicado').order('id', { ascending: false });
        if (error) throw error;
        blogPosts = data || [];
        console.log('📰 Blog cargado:', blogPosts.length);
        renderBlogPreview();
        renderAllBlogPosts();
    } catch (err) {
        console.error('❌ Error cargando blog:', err);
        blogPosts = [];
        renderBlogPreview();
        renderAllBlogPosts();
    }
}

function renderBlogPreview() {
    const container = document.getElementById('blogPreview');
    if (!container) return;
    const postsToShow = blogPosts.slice(0, 3);
    container.innerHTML = postsToShow.map(post => createBlogCard(post)).join('');
}

function renderAllBlogPosts() {
    const container = document.getElementById('allBlogPosts');
    if (!container) return;
    if (blogPosts.length === 0) {
        container.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No hay entradas publicadas aún.</p>';
        return;
    }
    container.innerHTML = blogPosts.map(post => createBlogCard(post)).join('');
}

function createBlogCard(post) {
    const imageHtml = post.image_url 
        ? `<img src="${post.image_url}" alt="${post.title}" style="width:100%;height:100%;object-fit:cover;">` 
        : '<div class="placeholder-image">📰</div>';
    const date = post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    return `
        <article class="blog-card fade-in" data-id="${post.id}">
            <div class="blog-image">${imageHtml}</div>
            <div class="blog-content">
                <div class="blog-date"><i class="far fa-calendar"></i> ${date}</div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <span class="card-link">Leer más <i class="fas fa-arrow-right"></i></span>
            </div>
        </article>
    `;
}

function openBlogModal(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    let modal = document.getElementById('blogModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'blogModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle"></h2>
                    <button class="modal-close" onclick="closeBlogModal()">&times;</button>
                </div>
                <div class="modal-body" id="modalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeBlogModal();
        });
    }

    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    if (!titleEl || !bodyEl) return;

    const date = post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    titleEl.textContent = post.title;
    bodyEl.innerHTML = `
        ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" style="width:100%; border-radius:10px; margin-bottom:15px;">` : ''}
        <div class="blog-date" style="margin-bottom:15px; color:#e04f2e;"><i class="far fa-calendar"></i> ${date}</div>
        <div style="line-height:1.8; color:#333;">${post.content || post.excerpt}</div>
    `;
    modal.classList.add('active');
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    if (modal) modal.classList.remove('active');
}

// ========================================
// MENÚ MÓVIL Y DROPDOWNS (CORREGIDO)
// ========================================
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    // Abrir/cerrar menú principal
    btn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !nav.classList.contains('active'));
            icon.classList.toggle('fa-times', nav.classList.contains('active'));
        }
    });

    // Cerrar menú SOLO al hacer clic en enlaces finales (no en dropdown toggles)
    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || window.innerWidth > 768) return;

        // Si el enlace es un dropdown toggle (tiene un submenú), no cerramos
        const parentLi = link.closest('li');
        if (parentLi && parentLi.classList.contains('dropdown') && parentLi.querySelector('ul.dropdown-menu')) {
            return; // No cerrar menú
        }

        // Si es un enlace normal, cerrar menú
        nav.classList.remove('active');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
}

function initDropdownMobile() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector(':scope > a');
        if (!link) return;
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Evitar navegación al hacer clic en el toggle
                // Cerrar otros dropdowns abiertos
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });
                // Alternar el actual
                dropdown.classList.toggle('active');
            }
        });
    });
}

// ========================================
// NEWSLETTER Y FORMULARIOS
// ========================================
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
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
        adoptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Solicitud recibida! Te contactaremos pronto.');
            this.reset();
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
        customInput?.addEventListener('input', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            updateTotal();
        });
        donationForm.querySelectorAll('input[name="type"]').forEach(radio => {
            radio.addEventListener('change', updateTotal);
        });

        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Redirigiendo a la pasarela de pago...');
        });
        
        updateTotal();
        
        donationForm.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const transferDetails = document.getElementById('transferDetails');
                if (transferDetails) {
                    transferDetails.style.display = this.value === 'transfer' ? 'block' : 'none';
                }
            });
        });
    }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================
function setSelectedDog(dogName) {
    localStorage.setItem('selectedDog', dogName);
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM listo, iniciando...');
    
    initBlogListeners();
    
    await loadSettings();
    await loadDogs();
    await loadBlogPosts();

    initMobileMenu();
    initDropdownMobile();
    initNewsletter();
    initForms();

    const selectedDog = localStorage.getItem('selectedDog');
    if (selectedDog) {
        const select = document.querySelector('select[name="perro"]');
        if (select) {
            const option = Array.from(select.options).find(o => o.value === selectedDog);
            if (option) option.selected = true;
        }
        localStorage.removeItem('selectedDog');
    }

    const sizeFilter = document.getElementById('sizeFilter');
    const ageFilter = document.getElementById('ageFilter');
    const genderFilter = document.getElementById('genderFilter');
    const searchInput = document.getElementById('searchDog');
    
    function applyFilters() {
        const filters = {};
        if (sizeFilter?.value) filters.size = sizeFilter.value;
        if (genderFilter?.value) filters.gender = genderFilter.value;
        if (searchInput?.value) filters.search = searchInput.value;
        renderDogsList(filters);
    }
    
    sizeFilter?.addEventListener('change', applyFilters);
    ageFilter?.addEventListener('change', applyFilters);
    genderFilter?.addEventListener('change', applyFilters);
    searchInput?.addEventListener('input', applyFilters);

    console.log('🏁 Aplicación lista');
});

// Exponer globalmente
window.openDogModal = openDogModal;
window.closeDogModal = closeDogModal;
window.openBlogModal = openBlogModal;
window.closeBlogModal = closeBlogModal;
window.closeModal = closeBlogModal;
window.setSelectedDog = setSelectedDog;
