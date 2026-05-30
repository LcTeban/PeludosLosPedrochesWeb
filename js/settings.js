// ========================================
// PELUDOS LOS PEDROCHES – CONFIGURACIÓN VISUAL
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
