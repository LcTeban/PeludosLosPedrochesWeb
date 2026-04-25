// ========================================
// PELUDOS LOS PEDROCHES – main.js VERSIÓN ESTABLE
// ========================================
const SUPABASE_URL = 'https://grknhpyouzhmhqpjjomg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya25ocHlvdXpobWhxcGpqb21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQ0NTQsImV4cCI6MjA5MjI4MDQ1NH0.z2z_eP7DCj_s-JY-ewzZ7RYXGZ0TgAOKzK4HxyoOeic';

// Crear el cliente directamente (sin funciones extra)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('✅ Supabase inicializado');

// Variables
let dogs = [];
let blogPosts = [];
let settings = {};

// Cargar configuración
async function loadSettings() {
    try {
        const { data, error } = await supabase.from('settings').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
            data.forEach(item => { settings[item.key] = item.value; });
            console.log('✅ Configuración cargada:', settings);
        } else {
            console.warn('⚠️ No se encontraron ajustes en Supabase');
            loadDefaultSettings();
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
    document.getElementById('logoText').textContent = settings.logo_text;
    document.getElementById('logoSubtitle').textContent = settings.logo_subtitle;
    
    const logoIcon = document.getElementById('logoIcon');
    if (settings.logo_url) {
        let img = logoIcon.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            logoIcon.appendChild(img);
        }
        img.src = settings.logo_url;
        img.style.maxHeight = '45px';
    }
    
    document.documentElement.style.setProperty('--primary', settings.primary_color);
    document.documentElement.style.setProperty('--secondary', settings.secondary_color);
}

// Cargar perros
async function loadDogs() {
    try {
        const { data, error } = await supabase.from('dogs').select('*').order('id', { ascending: false });
        if (error) throw error;
        dogs = data;
        console.log('✅ Perros cargados:', dogs.length);
        renderDogs();
    } catch (err) {
        console.error('❌ Error cargando perros:', err);
        loadDefaultDogs();
    }
}

function loadDefaultDogs() {
    dogs = [
        { name: 'Luna', breed: 'Mastina', age: '2 años', gender: 'Hembra', badge: 'Urgente', description: 'Cariñosa a rabiar.', image_url: null, status: 'Disponible' },
        { name: 'Arena', breed: 'Cruce de labrador', age: '2 años', gender: 'Hembra', badge: 'En acogida', description: 'Activa y noble.', image_url: null, status: 'En acogida' },
        { name: 'Toby', breed: 'Podenco', age: '1 año', gender: 'Macho', badge: 'Nuevo', description: 'Joven y juguetón.', image_url: null, status: 'Disponible' }
    ];
    renderDogs();
}

function renderDogs() {
    const container = document.getElementById('featuredDogs');
    if (!container) return;
    const dogsToShow = dogs.filter(d => d.badge).slice(0, 3).length > 0 ? dogs.filter(d => d.badge).slice(0, 3) : dogs.slice(0, 3);
    container.innerHTML = dogsToShow.map(dog => `
        <div class="dog-card">
            <div class="dog-image">${dog.image_url ? `<img src="${dog.image_url}" style="width:100%;height:100%;object-fit:cover">` : '<div class="placeholder-image">🐕</div>'}</div>
            <div class="dog-info">
                <h3>${dog.name}</h3>
                <p>${dog.breed} – ${dog.age}</p>
                <a href="pages/adopta.html" class="btn-adopt">Quiero adoptar</a>
            </div>
        </div>
    `).join('');
}

// Cargar blog
async function loadBlogPosts() {
    try {
        const { data, error } = await supabase.from('blog_posts').select('*').eq('status', 'Publicado').order('id', { ascending: false });
        if (error) throw error;
        blogPosts = data;
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
        <article class="blog-card" onclick="openBlogModal(${post.id})">
            <div class="blog-image"><div class="placeholder-image">📰</div></div>
            <div class="blog-content">
                <div class="blog-date">${post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES') : ''}</div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
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
        btn.addEventListener('click', () => nav.classList.toggle('active'));
    }
}

// Inicio
window.addEventListener('load', async () => {
    await loadSettings();
    await loadDogs();
    await loadBlogPosts();
    initMobileMenu();
    console.log('🚀 App lista');
});
