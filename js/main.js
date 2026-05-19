// ========================================
// PELUDOS LOS PEDROCHES – main.js COMPLETO
// ========================================
const SUPABASE_URL = 'https://grknhpyouzhmhqpjjomg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya25ocHlvdXpobWhxcGpqb21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQ0NTQsImV4cCI6MjA5MjI4MDQ1NH0.z2z_eP7DCj_s-JY-ewzZ7RYXGZ0TgAOKzK4HxyoOeic';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('✅ Supabase inicializado');

let dogs = [];
let blogPosts = [];
let settings = {};
let currentPage = 1;
let perPage = 9; // 3 columnas x 3 filas
let currentFilters = {};

// Variables del carrusel (declaradas una sola vez)
let currentDogImages = [];
let currentImageIndex = 0;

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
    applySectionImages();
    applyAboutContent();
}

function updateContactInfo() {
    const phone1 = document.querySelector('[data-contact="phone1"]');
    if (phone1) { phone1.href = `tel:${settings.contact_phone1?.replace(/\s/g, '')}`; phone1.textContent = settings.contact_phone1; }
    const phone2 = document.querySelector('[data-contact="phone2"]');
    if (phone2) { phone2.href = `tel:${settings.contact_phone2?.replace(/\s/g, '')}`; phone2.textContent = settings.contact_phone2; }
    const email = document.querySelector('[data-contact="email"]');
    if (email) { email.href = `mailto:${settings.contact_email}`; email.textContent = settings.contact_email; }
    const address = document.querySelector('[data-contact="address"]');
    if (address) address.textContent = settings.contact_address;
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
            img.onerror = () => { container.innerHTML = section.defaultEmoji; };
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
        { id: 1, name: 'Luna', breed: 'Mastina atigrada', age: '2 años', gender: 'Hembra', badge: 'Urgente', description: 'Cariñosa a rabiar y juguetona.', images: [], status: 'Disponible' },
        { id: 2, name: 'Arena', breed: 'Cruce de labrador', age: '2 años', gender: 'Hembra', badge: 'En acogida', description: 'Activa y noble.', images: [], status: 'En acogida' },
        { id: 3, name: 'Toby', breed: 'Podenco', age: '1 año', gender: 'Macho', badge: 'Nuevo', description: 'Joven y juguetón.', images: [], status: 'Disponible' }
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

function renderDogsList(filter = {}, page = 1) {
    const container = document.getElementById('dogsList');
    if (!container) return;

    // Guardar filtros y página actual
    currentFilters = filter;
    currentPage = page;

    let filtered = dogs.filter(d => d.status !== 'Adoptado');
    if (filter.size) filtered = filtered.filter(d => d.size?.toLowerCase().includes(filter.size));
    if (filter.gender) filtered = filtered.filter(d => d.gender?.toLowerCase() === filter.gender);
    if (filter.search) filtered = filtered.filter(d => d.name?.toLowerCase().includes(filter.search.toLowerCase()));

    const totalPages = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    const paginatedDogs = filtered.slice(start, start + perPage);

    container.innerHTML = paginatedDogs.map(dog => createDogCard(dog)).join('');
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagContainer = document.getElementById('pagination');
    if (!pagContainer) return;
    if (totalPages <= 1) {
        pagContainer.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    pagContainer.innerHTML = html;
}

function goToPage(page) {
    renderDogsList(currentFilters, page);
    // Scroll suave al principio de la lista (opcional)
    document.getElementById('dogsList')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const firstImage = (dog.images && dog.images.length > 0) ? dog.images[0] : dog.image_url;
    const imageHtml = firstImage 
        ? `<img src="${firstImage}" alt="${dog.name}" style="width:100%;height:100%;object-fit:cover;">` 
        : `<div class="placeholder-image">🐕</div>`;
    return `
        <div class="dog-card fade-in" onclick="openDogModal(${dog.id})" style="cursor:pointer;">
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
                <a href="adopta.html#formulario" class="btn-adopt" onclick="event.stopPropagation(); setSelectedDog('${dog.name}');">Quiero adoptar</a>
            </div>
        </div>
    `;
}

// ========================================
// MODAL DE PERRO (CON CARRUSEL Y LIGHTBOX)
// ========================================
function openDogModal(dogId) {
    const dog = dogs.find(d => d.id === dogId);
    if (!dog) return;

    const images = (dog.images && dog.images.length > 0) ? dog.images : (dog.image_url ? [dog.image_url] : []);
    currentDogImages = images;
    currentImageIndex = 0;

    let modal = document.getElementById('dogModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dogModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
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

    renderDogModalBody(dog);
    modal.classList.add('active');
}

function renderDogModalBody(dog) {
    const body = document.getElementById('dogModalBody');
    const titleEl = document.getElementById('dogModalTitle');
    titleEl.textContent = dog.name;

    let carouselHtml = '';
    if (currentDogImages.length > 0) {
        carouselHtml = `
            <div style="position: relative; width: 100%; max-height: 400px; overflow: hidden; margin-bottom: 20px; text-align: center;">
                <img id="dogCarouselImage" src="${currentDogImages[currentImageIndex]}" 
                     style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 10px; cursor: pointer;" 
                     onclick="openLightbox(document.getElementById('dogCarouselImage').src)"
                ${currentDogImages.length > 1 ? `
                    <button onclick="prevImage()" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; font-size:20px;">‹</button>
                    <button onclick="nextImage()" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; font-size:20px;">›</button>
                    <div style="margin-top:10px;">
                        ${currentDogImages.map((_, i) => `<span style="display:inline-block; width:10px; height:10px; background:${i === currentImageIndex ? '#e04f2e' : '#ccc'}; border-radius:50%; margin:0 3px;"></span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        carouselHtml = '<div class="placeholder-image" style="height:250px;">🐕</div>';
    }

    body.innerHTML = `
        ${carouselHtml}
        <div class="dog-details" style="margin-bottom:15px;">
            <span><i class="fas fa-paw"></i> ${dog.breed}</span>
            <span><i class="fas fa-calendar"></i> ${dog.age}</span>
            <span><i class="fas fa-${dog.gender === 'Macho' ? 'mars' : 'venus'}"></i> ${dog.gender}</span>
            <span><i class="fas fa-ruler"></i> ${dog.size}</span>
        </div>
        <p style="margin-bottom:20px;">${dog.description}</p>
        <a href="adopta.html#formulario" class="btn btn-primary" style="display:block; text-align:center;" onclick="setSelectedDog('${dog.name}')">¡Quiero adoptar a ${dog.name}!</a>
    `;
}

function prevImage() {
    if (currentDogImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentDogImages.length) % currentDogImages.length;
    document.getElementById('dogCarouselImage').src = currentDogImages[currentImageIndex];
    updateCarouselIndicators();
}

function nextImage() {
    if (currentDogImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentDogImages.length;
    document.getElementById('dogCarouselImage').src = currentDogImages[currentImageIndex];
    updateCarouselIndicators();
}

function updateCarouselIndicators() {
    const dots = document.querySelectorAll('#dogModal .modal-body span[style*="border-radius:50%"]');
    dots.forEach((dot, i) => {
        dot.style.background = i === currentImageIndex ? '#e04f2e' : '#ccc';
    });
}

function openLightbox(url) {
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.style.cssText = 'display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:3000; align-items:center; justify-content:center; cursor:zoom-out;';
        lightbox.innerHTML = `
            <img id="lightboxImg" style="max-width:90%; max-height:90%; object-fit:contain; border-radius:10px;">
            <button id="lightboxClose" style="position:absolute; top:20px; right:30px; background:white; color:black; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; font-size:24px;">&times;</button>
        `;
        document.body.appendChild(lightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target === lightbox.querySelector('img')) closeLightbox();
        });
        lightbox.querySelector('#lightboxClose').addEventListener('click', closeLightbox);
    }
    document.getElementById('lightboxImg').src = url;
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.style.display = 'none';
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
        modal.addEventListener('click', function(e) { if (e.target === modal) closeBlogModal(); });
    }
    document.body.addEventListener('click', function(e) {
        const card = e.target.closest('.blog-card');
        if (card) {
            const postId = parseInt(card.dataset.id);
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
        ? `<div class="blog-image-wrapper"><img src="${post.image_url}" alt="${post.title}" onclick="event.stopPropagation(); openLightbox('${post.image_url}');"></div>` 
        : '<div class="blog-image-wrapper"><div class="placeholder-image">📰</div></div>';
    const date = post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    return `
        <article class="blog-card fade-in" data-id="${post.id}">
            ${imageHtml}
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
        modal.addEventListener('click', function(e) { if (e.target === modal) closeBlogModal(); });
    }
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    if (!titleEl || !bodyEl) return;
    const date = post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    titleEl.textContent = post.title;
    bodyEl.innerHTML = `
        ${post.image_url ? `<div class="blog-modal-image" onclick="openLightbox('${post.image_url}')"><img src="${post.image_url}" alt="${post.title}"></div>` : ''}
        <div class="blog-modal-date"><i class="far fa-calendar"></i> ${date}</div>
        <div class="blog-modal-text">${post.content || post.excerpt}</div>
    `;
    modal.classList.add('active');
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    if (modal) modal.classList.remove('active');
}

// ========================================
// MENÚ MÓVIL Y DROPDOWNS
// ========================================
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !nav.classList.contains('active'));
            icon.classList.toggle('fa-times', nav.classList.contains('active'));
        }
    });

    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || window.innerWidth > 768) return;

        const parentLi = link.closest('li');
        if (parentLi && parentLi.classList.contains('dropdown') && parentLi.querySelector('ul.dropdown-menu')) {
            return;
        }

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
                e.preventDefault();
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });
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
        if (!formData.name || !formData.email || !formData.message) {
            showToast('Por favor completa los campos obligatorios.', 'error');
            return;
        }
        try {
            const { error } = await supabaseClient.from('contact_messages').insert([formData]);
            if (error) throw error;
            showToast('¡Mensaje enviado correctamente!', 'success');
            this.reset();
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
            showToast('Hubo un error al enviar. Intenta de nuevo.', 'error');
        }
    });
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
    initScrollReveal();

    // Animaciones al hacer scroll
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
}
    
    const perPageSelect = document.getElementById('perPageSelect');
if (perPageSelect) {
    perPageSelect.addEventListener('change', function() {
        perPage = parseInt(this.value);
        renderDogsList(currentFilters, 1);
    });
}
    
    const selectedDog = localStorage.getItem('selectedDog');
    if (selectedDog) {
        const select = document.querySelector('select[name="perro"]');
        if (select) {
            const opt = Array.from(select.options).find(o => o.value === selectedDog);
            if (opt) opt.selected = true;
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
    renderDogsList(filters, 1); // siempre volver a página 1 al filtrar
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
window.prevImage = prevImage;
window.nextImage = nextImage;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.openBlogModal = openBlogModal;
window.closeBlogModal = closeBlogModal;
window.closeModal = closeBlogModal;
window.setSelectedDog = setSelectedDog;
window.goToPage = goToPage;
