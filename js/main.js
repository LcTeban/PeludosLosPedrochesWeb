// ========================================
// PELUDOS LOS PEDROCHES - MAIN.JS DEFINITIVO
// ========================================

const SUPABASE_URL = 'https://grknhpyouzhmhqpjjomg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya25ocHlvdXpobWhxcGpqb21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQ0NTQsImV4cCI6MjA5MjI4MDQ1NH0.z2z_eP7DCj_s-JY-ewzZ7RYXGZ0TgAOKzK4HxyoOeic';

let supabase = null;

function initSupabase() {
    try {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            window.supabase = supabase; // exposición global
            console.log('✅ Supabase inicializado correctamente');
            return true;
        }
    } catch (error) {
        console.error('❌ Error al inicializar Supabase:', error);
    }
    console.warn('⚠️ Supabase no disponible en este momento, se reintentará...');
    return false;
}

// Intentar inicializar cada 200ms hasta que funcione, o abandonar tras 5 segundos
let intentos = 0;
function intentarInicializarSupabase(callback) {
    if (initSupabase()) {
        callback();
    } else {
        intentos++;
        if (intentos < 25) { // 25 * 200ms = 5 segundos
            setTimeout(() => intentarInicializarSupabase(callback), 200);
        } else {
            console.warn('⚠️ No se pudo conectar con Supabase. La web funcionará con datos locales.');
            callback();
        }
    }
}

let dogs = [];
let blogPosts = [];
let settings = {};

// ========================================
// CARGAR CONFIGURACIÓN
// ========================================
async function loadSettings() {
    if (!supabase) {
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
    try {
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
        
        if (logoTextEl) logoTextEl.textContent = settings.logo_text || 'PELUDOS LOS PEDROCHES';
        if (logoSubtitleEl) logoSubtitleEl.textContent = settings.logo_subtitle || 'Protectora de Animales';
        
        if (settings.primary_color) document.documentElement.style.setProperty('--primary', settings.primary_color);
        if (settings.secondary_color) document.documentElement.style.setProperty('--secondary', settings.secondary_color);
        
        updateContactInfo();
    } catch (e) {
        console.error('Error applying settings:', e);
    }
}

function updateContactInfo() {
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
// PERROS Y BLOG (similar a antes)
// ========================================
async function loadDogs() { ... } // incluye logs y carga desde local si falla
async function loadBlogPosts() { ... }

// ... Resto de funciones (initMobileMenu, etc.) se mantienen igual que el archivo completo que pasé antes

// ========================================
// INICIALIZACIÓN
// ========================================
intentarInicializarSupabase(async function() {
    console.log('🚀 Iniciando app...');
    await loadSettings();
    await loadDogs();
    await loadBlogPosts();
    
    initMobileMenu();
    initDropdownMobile();
    initNewsletter();
    initForms();
    
    if (document.getElementById('dogsList')) initFilters();
    
    const selectedDog = localStorage.getItem('selectedDog');
    if (selectedDog) {
        const select = document.querySelector('select[name="perro"]');
        if (select) {
            const opt = Array.from(select.options).find(o => o.value === selectedDog);
            if (opt) opt.selected = true;
        }
        localStorage.removeItem('selectedDog');
    }
});

// Exponer globales
window.openBlogModal = openBlogModal;
window.closeModal = closeModal;
window.setSelectedDog = setSelectedDog;
