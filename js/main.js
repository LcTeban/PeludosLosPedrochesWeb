// ========================================
// PELUDOS LOS PEDROCHES - CON SUPABASE
// CREDENCIALES REALES - VERSIÓN COMPLETA
// ========================================

// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://grknhpyouzhmhqpjjomg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya25ocHlvdXpobWhxcGpqb21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQ0NTQsImV4cCI6MjA5MjI4MDQ1NH0.z2z_eP7DCj_s-JY-ewzZ7RYXGZ0TgAOKzK4HxyoOeic';

// Inicializar Supabase
let supabase;
if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Variables globales
let dogs = [];
let blogPosts = [];
let settings = {};

// ========================================
// CARGAR CONFIGURACIÓN DESDE SUPABASE
// ========================================
async function loadSettings() {
    if (!supabase) {
        loadSettingsFromLocal();
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
            data.forEach(item => {
                settings[item.key] = item.value;
            });
        } else {
            loadSettingsFromLocal();
            return;
        }
        
        applySettings();
    } catch (error) {
        console.error('Error cargando configuración:', error);
        loadSettingsFromLocal();
    }
}

function loadSettingsFromLocal() {
    settings = {
        logo_text: '🐾 PELUDOS LOS PEDROCHES',
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
    // Actualizar logo
    const logoIcon = document.getElementById('logoIcon');
    const logoEmoji = document.querySelector('.logo-emoji');
    const logoTextEl = document.getElementById('logoText');
    const logoSubtitleEl = document.getElementById('logoSubtitle');
    
    // Si hay una imagen de logo configurada, mostrarla
    if (settings.logo_url) {
        if (logoIcon) {
            if (logoEmoji) logoEmoji.style.display = 'none';
            
            let imgEl = logoIcon.querySelector('img');
            if (!imgEl) {
                imgEl = document.createElement('img');
                logoIcon.appendChild(imgEl);
            }
            imgEl.src = settings.logo_url;
            imgEl.alt = settings.logo_text || 'Peludos Los Pedroches';
            imgEl.style.display = 'block';
        }
    } else {
        if (logoEmoji) logoEmoji.style.display = 'block';
        const imgEl = logoIcon?.querySelector('img');
        if (imgEl) imgEl.style.display = 'none';
    }
    
    // Actualizar textos
    if (logoTextEl) logoTextEl.textContent = settings.logo_text || 'PELUDOS LOS PEDROCHES';
    if (logoSubtitleEl) logoSubtitleEl.textContent = settings.logo_subtitle || 'Protectora de Animales';
    
    // Actualizar colores
    if (settings.primary_color) {
        document.documentElement.style.setProperty('--primary', settings.primary_color);
    }
    if (settings.secondary_color) {
        document.documentElement.style.setProperty('--secondary', settings.secondary_color);
    }
    
    updateContactInfo();
}

function updateContactInfo() {
    document.querySelectorAll('[data-contact="phone1"]').forEach(el => {
        el.href = `tel:${settings.contact_phone1?.replace(/\s/g, '')}`;
        el.textContent = settings.contact_phone1;
    });
    document.querySelectorAll('[data-contact="phone2"]').forEach(el => {
        el.href = `tel:${settings.contact_phone2?.replace(/\s/g, '')}`;
        el.textContent = settings.contact_phone2;
    });
    document.querySelectorAll('[data-contact="email"]').forEach(el => {
        el.href = `mailto:${settings.contact_email}`;
        el.textContent = settings.contact_email;
    });
    document.querySelectorAll('[data-contact="address"]').forEach(el => {
        el.textContent = settings.contact_address;
    });
}

// ========================================
// CARGAR PERROS DESDE SUPABASE
// ========================================
async function loadDogs() {
    if (!supabase) {
        loadDogsFromLocal();
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('dogs')
            .select('*')
            .order('id', { ascending: false });
        
        if (error) throw error;
        
        dogs = data || getDefaultDogs();
        localStorage.setItem('dogs', JSON.stringify(dogs));
        
        if (document.getElementById('featuredDogs')) loadFeaturedDogs();
        if (document.getElementById('dogsList')) loadDogsList();
        if (document.getElementById('sponsorDogs')) loadSponsorDogs();
    } catch (error) {
        console.error('Error cargando perros:', error);
        loadDogsFromLocal();
    }
}

function loadDogsFromLocal() {
    dogs = JSON.parse(localStorage.getItem('dogs')) || getDefaultDogs();
    if (document.getElementById('featuredDogs')) loadFeaturedDogs();
    if (document.getElementById('dogsList')) loadDogsList();
}

function getDefaultDogs() {
    return [
        { id: 1, name: 'Luna', breed: 'Mastina atigrada', age: '2 años', size: 'Grande', gender: 'Hembra', badge: 'Urgente', description: 'Cariñosa a rabiar y juguetona.', image_url: null, status: 'Disponible' },
        { id: 2, name: 'Arena', breed: 'Cruce de labrador', age: '2 años', size: 'Mediano', gender: 'Hembra', badge: 'En acogida', description: 'Activa y noble.', image_url: null, status: 'En acogida' },
        { id: 3, name: 'Toby', breed: 'Podenco', age: '1 año', size: 'Mediano', gender: 'Macho', badge: 'Nuevo', description: 'Joven y juguetón.', image_url: null, status: 'Disponible' }
    ];
}

// ========================================
// CARGAR BLOG DESDE SUPABASE
// ========================================
async function loadBlogPosts() {
    if (!supabase) {
        loadBlogFromLocal();
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'Publicado')
            .order('id', { ascending: false });
        
        if (error) throw error;
        
        blogPosts = data || getDefaultBlogPosts();
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        
        if (document.getElementById('blogPreview')) loadBlogPreview();
    } catch (error) {
        console.error('Error cargando blog:', error);
        loadBlogFromLocal();
    }
}

function loadBlogFromLocal() {
    blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || getDefaultBlogPosts();
    if (document.getElementById('blogPreview')) loadBlogPreview();
}

function getDefaultBlogPosts() {
    return [
        { id: 1, title: 'Bendición de animales', excerpt: 'Celebramos San Antón en Pozoblanco.', content: '<p>Contenido completo...</p>', status: 'Publicado', created_at: '2024-01-20' },
        { id: 2, title: 'Refugio al límite', excerpt: 'Necesitamos casas de acogida.', content: '<p>Contenido completo...</p>', status: 'Publicado', created_at: '2023-12-15' }
    ];
}

// ========================================
// MENÚ MÓVIL Y DROPDOWNS
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
// NEWSLETTER Y FORMULARIOS
// ========================================
function initNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('¡Gracias por suscribirte!', 'success');
            this.reset();
        });
    });
}

function initForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('¡Mensaje enviado!', 'success');
            this.reset();
        });
    }
    
    const adoptionForm = document.getElementById('adoptionForm');
    if (adoptionForm) {
        adoptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('¡Solicitud recibida!', 'success');
            this.reset();
        });
    }
    
    const donationForm = document.getElementById('donationForm');
    if (donationForm) initDonationForm(donationForm);
}

function initDonationForm(form) {
    const amountBtns = form.querySelectorAll('.amount-btn');
    const customAmount = form.querySelector('#customAmount');
    
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
        });
    });
    
    if (customAmount) {
        customAmount.addEventListener('input', function() {
            amountBtns.forEach(b => {
                b.style.background = 'white';
                b.style.color = '#333';
                b.style.borderColor = '#ddd';
            });
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Redirigiendo a pasarela de pago...', 'success');
    });
}

// ========================================
// PERROS Y BLOG (TARJETAS Y MODALES)
// ========================================
function loadFeaturedDogs() {
    const container = document.getElementById('featuredDogs');
    if (!container) return;
    const featured = dogs.filter(d => d.badge).slice(0, 3);
    const dogsToShow = featured.length ? featured : dogs.slice(0, 3);
    container.innerHTML = dogsToShow.map(dog => createDogCard(dog)).join('');
}

function loadDogsList(filter = {}) {
    const container = document.getElementById('dogsList');
    if (!container) return;
    
    let filteredDogs = dogs.filter(d => d.status !== 'Adoptado');
    
    if (filter.size) filteredDogs = filteredDogs.filter(d => d.size?.toLowerCase().includes(filter.size));
    if (filter.age) {
        filteredDogs = filteredDogs.filter(d => {
            const age = parseInt(d.age);
            if (filter.age === 'cachorro') return age < 1;
            if (filter.age === 'adulto') return age >= 1 && age <= 7;
            if (filter.age === 'senior') return age > 7;
            return true;
        });
    }
    if (filter.gender) filteredDogs = filteredDogs.filter(d => d.gender?.toLowerCase() === filter.gender);
    if (filter.search) filteredDogs = filteredDogs.filter(d => d.name?.toLowerCase().includes(filter.search.toLowerCase()));
    
    container.innerHTML = filteredDogs.map(dog => createDogCard(dog)).join('');
}

function createDogCard(dog) {
    const imageHtml = dog.image_url 
        ? `<img src="${dog.image_url}" alt="${dog.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
        : `<div class="placeholder-image">${dog.image || '🐕'}</div>`;
    
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
                <a href="adopta.html#formulario" class="btn-adopt" onclick="setSelectedDog('${dog.name}')">Quiero adoptar</a>
            </div>
        </div>
    `;
}

function loadSponsorDogs() {
    const container = document.getElementById('sponsorDogs');
    if (!container) return;
    const available = dogs.filter(d => d.status !== 'Adoptado').slice(0, 3);
    container.innerHTML = available.map(dog => createDogCard(dog)).join('');
}

function loadBlogPreview() {
    const container = document.getElementById('blogPreview');
    if (!container) return;
    const previewPosts = blogPosts.filter(p => p.status === 'Publicado').slice(0, 3);
    container.innerHTML = previewPosts.map(post => {
        const date = post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
        return `
            <article class="blog-card fade-in" onclick="openBlogModal(${post.id})">
                <div class="blog-image"><div class="placeholder-image">📰</div></div>
                <div class="blog-content">
                    <div class="blog-date"><i class="far fa-calendar"></i> ${date}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <span class="card-link">Leer más <i class="fas fa-arrow-right"></i></span>
                </div>
            </article>
        `;
    }).join('');
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
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body" id="modalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    }
    
    const date = post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    document.getElementById('modalTitle').textContent = post.title;
    document.getElementById('modalBody').innerHTML = `
        <div class="blog-date" style="margin-bottom:15px;color:#e04f2e;"><i class="far fa-calendar"></i> ${date}</div>
        <div style="line-height:1.8;color:#333;">${post.content || post.excerpt}</div>
    `;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('blogModal')?.classList.remove('active');
}

// ========================================
// UTILIDADES
// ========================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${type==='success'?'#2c5f2d':'#e04f2e'};color:white;padding:12px 18px;border-radius:8px;z-index:10000;`;
    toast.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':'info-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function setSelectedDog(dogName) {
    localStorage.setItem('selectedDog', dogName);
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', async function() {
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
            const option = Array.from(select.options).find(opt => opt.value === selectedDog);
            if (option) option.selected = true;
        }
        localStorage.removeItem('selectedDog');
    }
});

window.openBlogModal = openBlogModal;
window.closeModal = closeModal;
window.setSelectedDog = setSelectedDog;
