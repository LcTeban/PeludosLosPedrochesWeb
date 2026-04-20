// ========================================
// PELUDOS LOS PEDROCHES - CON SUPABASE
// VERSIÓN CORREGIDA - CARGA ASEGURADA
// ========================================

const SUPABASE_URL = 'https://grknhpyouzhmhqpjjomg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya25ocHlvdXpobWhxcGpqb21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQ0NTQsImV4cCI6MjA5MjI4MDQ1NH0.z2z_eP7DCj_s-JY-ewzZ7RYXGZ0TgAOKzK4HxyoOeic';

let supabase;
if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let dogs = [];
let blogPosts = [];
let settings = {};

// ========================================
// CARGAR CONFIGURACIÓN (FORZADO)
// ========================================
async function loadSettings() {
    if (!supabase) {
        console.warn('Supabase no inicializado');
        loadSettingsFromLocal();
        return;
    }
    
    try {
        const { data, error } = await supabase.from('settings').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
            settings = {};
            data.forEach(item => { settings[item.key] = item.value; });
            console.log('✅ Configuración cargada:', settings);
        } else {
            loadSettingsFromLocal();
            return;
        }
        
        applySettings();
    } catch (error) {
        console.error('❌ Error cargando configuración:', error);
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
    console.log('🎨 Aplicando configuración...');
    
    // Logo imagen
    const logoIcon = document.getElementById('logoIcon');
    const logoEmoji = document.querySelector('.logo-emoji');
    const logoTextEl = document.getElementById('logoText');
    const logoSubtitleEl = document.getElementById('logoSubtitle');
    
    if (settings.logo_url && logoIcon) {
        if (logoEmoji) logoEmoji.style.display = 'none';
        let imgEl = logoIcon.querySelector('img');
        if (!imgEl) {
            imgEl = document.createElement('img');
            imgEl.alt = settings.logo_text || 'Logo';
            logoIcon.appendChild(imgEl);
        }
        imgEl.src = settings.logo_url;
        imgEl.style.display = 'block';
        imgEl.style.maxHeight = '50px';
    } else if (logoEmoji) {
        logoEmoji.style.display = 'block';
        const imgEl = logoIcon?.querySelector('img');
        if (imgEl) imgEl.style.display = 'none';
    }
    
    // Textos
    if (logoTextEl) logoTextEl.textContent = settings.logo_text || 'PELUDOS LOS PEDROCHES';
    if (logoSubtitleEl) logoSubtitleEl.textContent = settings.logo_subtitle || 'Protectora de Animales';
    
    // Colores
    if (settings.primary_color) {
        document.documentElement.style.setProperty('--primary', settings.primary_color);
    }
    if (settings.secondary_color) {
        document.documentElement.style.setProperty('--secondary', settings.secondary_color);
    }
    
    updateContactInfo();
}

function updateContactInfo() {
    // Actualizar elementos con data-contact
    document.querySelectorAll('[data-contact="phone1"]').forEach(el => {
        if (settings.contact_phone1) {
            el.href = `tel:${settings.contact_phone1.replace(/\s/g, '')}`;
            el.textContent = settings.contact_phone1;
        }
    });
    document.querySelectorAll('[data-contact="phone2"]').forEach(el => {
        if (settings.contact_phone2) {
            el.href = `tel:${settings.contact_phone2.replace(/\s/g, '')}`;
            el.textContent = settings.contact_phone2;
        }
    });
    document.querySelectorAll('[data-contact="email"]').forEach(el => {
        if (settings.contact_email) {
            el.href = `mailto:${settings.contact_email}`;
            el.textContent = settings.contact_email;
        }
    });
    document.querySelectorAll('[data-contact="address"]').forEach(el => {
        if (settings.contact_address) el.textContent = settings.contact_address;
    });
}

// ========================================
// CARGAR PERROS Y BLOG (SIN CAMBIOS)
// ========================================
async function loadDogs() {
    if (!supabase) { loadDogsFromLocal(); return; }
    try {
        const { data, error } = await supabase.from('dogs').select('*').order('id', { ascending: false });
        if (error) throw error;
        dogs = data || [];
        console.log('🐕 Perros cargados:', dogs.length);
        if (document.getElementById('featuredDogs')) loadFeaturedDogs();
        if (document.getElementById('dogsList')) loadDogsList();
        if (document.getElementById('sponsorDogs')) loadSponsorDogs();
    } catch (e) { console.error('Error perros:', e); loadDogsFromLocal(); }
}

function loadDogsFromLocal() {
    dogs = JSON.parse(localStorage.getItem('dogs')) || [];
    if (document.getElementById('featuredDogs')) loadFeaturedDogs();
}

async function loadBlogPosts() {
    if (!supabase) { loadBlogFromLocal(); return; }
    try {
        const { data } = await supabase.from('blog_posts').select('*').eq('status', 'Publicado').order('id', { ascending: false });
        blogPosts = data || [];
        console.log('📰 Blog cargado:', blogPosts.length);
        if (document.getElementById('blogPreview')) loadBlogPreview();
    } catch (e) { loadBlogFromLocal(); }
}

function loadBlogFromLocal() {
    blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    if (document.getElementById('blogPreview')) loadBlogPreview();
}

// ... (resto de funciones: loadFeaturedDogs, createDogCard, initMobileMenu, etc., se mantienen igual que en la versión anterior completa)

// ========================================
// INICIALIZACIÓN (FORZADA)
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await loadDogs();
    await loadBlogPosts();
    
    initMobileMenu();
    initDropdownMobile();
    initNewsletter();
    initForms();
});

// Asegurar que las funciones globales estén disponibles
window.openBlogModal = openBlogModal;
window.closeModal = closeModal;
window.setSelectedDog = setSelectedDog;
