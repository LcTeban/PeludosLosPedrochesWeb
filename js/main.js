// ========================================
// PELUDOS LOS PEDROCHES – main.js (VERSIÓN LIMPIA Y SEGURA)
// ========================================
const SUPABASE_URL = 'https://grknhpyouzhmhqpjjomg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya25ocHlvdXpobWhxcGpqb21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQ0NTQsImV4cCI6MjA5MjI4MDQ1NH0.z2z_eP7DCj_s-JY-ewzZ7RYXGZ0TgAOKzK4HxyoOeic';

// Usamos 'supabaseClient' para no interferir con ninguna otra variable
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('✅ Supabase inicializado como supabaseClient');

// Variables globales
let dogs = [];
let blogPosts = [];
let settings = {};

// Cargar configuración y aplicarla
async function loadSettings() {
    try {
        const { data, error } = await supabaseClient.from('settings').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
            settings = {};
            data.forEach(item => { settings[item.key] = item.value; });
            console.log('✅ Configuración cargada:', settings);
            applySettings();
        } else {
            console.warn('⚠️ No se encontraron ajustes, usando valores por defecto');
            loadDefaultSettings();
        }
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
    
    // Logo imagen
    const logoIcon = document.getElementById('logoIcon');
    if (logoIcon) {
        logoIcon.innerHTML = '';
        if (settings.logo_url) {
            const img = document.createElement('img');
            img.src = settings.logo_url;
            img.alt = settings.logo_text || 'Logo';
            img.style.maxHeight = '45px';
            img.onerror = () => {
                console.warn('⚠️ Falló la carga de la imagen del logo, usando emoji');
                logoIcon.innerHTML = '<span class="logo-emoji">🐾</span>';
            };
            logoIcon.appendChild(img);
        } else {
            logoIcon.innerHTML = '<span class="logo-emoji">🐾</span>';
        }
    }
    
    // Textos
    const logoTextEl = document.getElementById('logoText');
    if (logoTextEl) logoTextEl.textContent = settings.logo_text || 'PELUDOS LOS PEDROCHES';
    const logoSubtitleEl = document.getElementById('logoSubtitle');
    if (logoSubtitleEl) logoSubtitleEl.textContent = settings.logo_subtitle || 'Protectora de Animales';
    
    // Colores
    if (settings.primary_color) {
        document.documentElement.style.setProperty('--primary', settings.primary_color);
        console.log('🎨 Color primario aplicado:', settings.primary_color);
    }
    if (settings.secondary_color) {
        document.documentElement.style.setProperty('--secondary', settings.secondary_color);
        console.log('🎨 Color secundario aplicado:', settings.secondary_color);
    }
    
    updateContactInfo();
}

function updateContactInfo() {
    const phone1 = document.querySelector('[data-contact="phone1"]');
    if (phone1) {
        phone1.href = `tel:${settings.contact_phone1?.replace(/\s/g, '')}`;
        phone1.textContent = settings.contact_phone1;
    }
    const phone2 = document.querySelector('[data-contact="phone2"]');
    if (phone2) {
        phone2.href = `tel:${settings.contact_phone2?.replace(/\s/g, '')}`;
        phone2.textContent = settings.contact_phone2;
    }
    const email = document.querySelector('[data-contact="email"]');
    if (email) {
        email.href = `mailto:${settings.contact_email}`;
        email.textContent = settings.contact_email;
    }
    const address = document.querySelector('[data-contact="address"]');
    if (address) {
        address.textContent = settings.contact_address;
    }
}

// Cargar perros
async function loadDogs() {
    try {
        const { data, error } = await supabaseClient.from('dogs').select('*').order('id', { ascending: false });
        if (error) throw error;
        dogs = data || [];
        console.log('✅ Perros cargados:', dogs.length);
        renderDogs();
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
    renderDogs();
}

function renderDogs() {
    const container = document.getElementById('featuredDogs');
    if (!container) return;
    const dogsToShow = dogs.filter(d => d.badge).length > 0 ? dogs.filter(d => d.badge).slice(0, 3) : dogs.slice(0, 3);
    container.innerHTML = dogsToShow.map(dog => `
        <div class="dog-card fade-in">
            <div class="dog-image">
                ${dog.image_url ? `<img src="${dog.image_url}" alt="${dog.name}" style="width:100%;height:100%;object-fit:cover">` : '<div class="placeholder-image">🐕</div>'}
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
                <a href="pages/adopta.html" class="btn-adopt">Quiero adoptar</a>
            </div>
        </div>
    `).join('');
}

// Cargar blog
async function loadBlogPosts() {
    try {
        const { data, error } = await supabaseClient.from('blog_posts').select('*').eq('status', 'Publicado').order('id', { ascending: false });
        if (error) throw error;
        blogPosts = data || [];
        console.log('✅ Blog cargado:', blogPosts.length);
        renderBlogPreview();
    } catch (err) {
        console.error('❌ Error cargando blog:', err);
        blogPosts = [];
        renderBlogPreview();
    }
}

function renderBlogPreview() {
    const container = document.getElementById('blogPreview');
    if (!container) return;
    const postsToShow = blogPosts.slice(0, 3);
    container.innerHTML = postsToShow.map(post => `
        <article class="blog-card fade-in" onclick="openBlogModal(${post.id})">
            <div class="blog-image"><div class="placeholder-image">📰</div></div>
            <div class="blog-content">
                <div class="blog-date">${post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES') : ''}</div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <span class="card-link">Leer más <i class="fas fa-arrow-right"></i></span>
            </div>
        </article>
    `).join('');
}

// Menú móvil
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    if (btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

// Arranque
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM listo, cargando datos...');
    await loadSettings();
    await loadDogs();
    await loadBlogPosts();
    initMobileMenu();
    console.log('🏁 Aplicación inicializada');
});
