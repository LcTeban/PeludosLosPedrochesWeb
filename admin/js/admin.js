// ========================================
// CONFIGURACIÓN Y AUTENTICACIÓN
// ========================================
(function() {
    const token = localStorage.getItem('adminToken');
    if (token !== 'authenticated') {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('authCheck').style.display = 'none';
    document.getElementById('adminWrapper').style.display = 'flex';
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

const SUPABASE_URL = 'https://grknhpyouzhmhqpjjomg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya25ocHlvdXpobWhxcGpqb21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQ0NTQsImV4cCI6MjA5MjI4MDQ1NH0.z2z_eP7DCj_s-JY-ewzZ7RYXGZ0TgAOKzK4HxyoOeic';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let dogs = [];
let blogPosts = [];
let settings = {};
let currentSection = 'dashboard';
let selectedImageFile = null;
let selectedBlogImageFile = null;
let selectedLogoFile = null;
let selectedFiles = [];
let existingImagesToKeep = [];
let adminCurrentPage = 1;
const adminPerPage = 10;
let currentMessages = [];
let currentRequests = [];
let currentVolunteers = [];
let currentSponsors = [];
let currentFosters = [];
let currentMembers = [];

// ========================================
// INICIALIZACIÓN Y NAVEGACIÓN
// ========================================
async function init() {
    await loadSettings();
    await loadDogs();
    await loadBlogPosts();
    renderPage();
    setupNavigation();
    setupMobileMenu();
    setupFloatingMenu();
}

function setupNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentSection = this.dataset.page;
            adminCurrentPage = 1;
            await renderPage();
            if (window.innerWidth <= 768) {
                document.getElementById('adminSidebar').classList.remove('active');
                document.getElementById('sidebarOverlay').classList.remove('active');
            }
        });
    });
}

function setupMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (toggle) {
        toggle.addEventListener('click', function() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

function setupFloatingMenu() {
    const btn = document.getElementById('floatingMenuBtn');
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (btn) {
        btn.addEventListener('click', function() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }
}

// ========================================
// CARGA DE DATOS
// ========================================
async function loadSettings() {
    try {
        const { data, error } = await supabaseClient.from('settings').select('*');
        if (error) throw error;
        if (data) data.forEach(item => { settings[item.key] = item.value; });
    } catch (error) {
        console.error('Error cargando settings:', error);
    }
}

async function loadDogs() {
    try {
        const { data, error } = await supabaseClient.from('dogs').select('*').order('id', { ascending: false });
        if (error) throw error;
        dogs = data || [];
    } catch (error) {
        console.error('Error cargando perros:', error);
    }
}

async function loadBlogPosts() {
    try {
        const { data, error } = await supabaseClient.from('blog_posts').select('*').order('id', { ascending: false });
        if (error) throw error;
        blogPosts = data || [];
    } catch (error) {
        console.error('Error cargando blog:', error);
    }
}

async function loadMessages() {
    try {
        const { data, error } = await supabaseClient.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        currentMessages = data || [];
        return currentMessages;
    } catch (err) { console.error(err); currentMessages = []; return []; }
}

async function loadAdoptionRequests() {
    try {
        const { data, error } = await supabaseClient.from('adoption_requests').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        currentRequests = data || [];
        return currentRequests;
    } catch (err) { console.error(err); currentRequests = []; return []; }
}

async function loadVolunteerRequests() {
    try {
        const { data, error } = await supabaseClient.from('volunteer_requests').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        currentVolunteers = data || [];
        return currentVolunteers;
    } catch (err) { console.error(err); currentVolunteers = []; return []; }
}

async function loadSponsorRequests() {
    try {
        const { data, error } = await supabaseClient.from('sponsor_requests').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        currentSponsors = data || [];
        return currentSponsors;
    } catch (err) { console.error(err); currentSponsors = []; return []; }
}

async function loadFosterRequests() {
    try {
        const { data, error } = await supabaseClient.from('foster_requests').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        currentFosters = data || [];
        return currentFosters;
    } catch (err) { console.error(err); currentFosters = []; return []; }
}

async function loadMembershipRequests() {
    try {
        const { data, error } = await supabaseClient.from('membership_requests').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        currentMembers = data || [];
        return currentMembers;
    } catch (err) { console.error(err); currentMembers = []; return []; }
}

// ========================================
// RENDERIZADO DE PÁGINAS
// ========================================
async function renderPage(page = 1) {
    adminCurrentPage = page;
    const content = document.getElementById('adminContent');
    const toggleBtn = '<button class="mobile-menu-toggle" id="mobileMenuToggle"><i class="fas fa-bars"></i> Menú</button>';
    let html = '';
    if (currentSection === 'dashboard') html = renderDashboard();
    else if (currentSection === 'dogs') html = renderDogsPage(adminCurrentPage);
    else if (currentSection === 'blog') html = renderBlogPage(adminCurrentPage);
    else if (currentSection === 'settings') html = renderSettingsPage();
    else if (currentSection === 'messages') {
        if (currentMessages.length === 0) await loadMessages();
        html = renderMessagesPage(currentMessages, adminCurrentPage);
    }
    else if (currentSection === 'adoptions') {
        if (currentRequests.length === 0) await loadAdoptionRequests();
        html = renderAdoptionsAdminPage(currentRequests, adminCurrentPage);
    }
    else if (currentSection === 'volunteers') {
        if (currentVolunteers.length === 0) await loadVolunteerRequests();
        html = renderVolunteersPage(currentVolunteers, adminCurrentPage);
    }
    else if (currentSection === 'sponsors') {
        if (currentSponsors.length === 0) await loadSponsorRequests();
        html = renderSponsorsPage(currentSponsors, adminCurrentPage);
    }
    else if (currentSection === 'fosters') {
        if (currentFosters.length === 0) await loadFosterRequests();
        html = renderFostersPage(currentFosters, adminCurrentPage);
    }
    else if (currentSection === 'members') {
        if (currentMembers.length === 0) await loadMembershipRequests();
        html = renderMembersPage(currentMembers, adminCurrentPage);
    }
    content.innerHTML = toggleBtn + html;
    document.getElementById('mobileMenuToggle')?.addEventListener('click', function() {
        document.getElementById('adminSidebar').classList.add('active');
        document.getElementById('sidebarOverlay').classList.add('active');
    });
}

function goToAdminPage(page) {
    renderPage(page);
}

function renderDashboard() {
    const available = dogs.filter(d => d.status !== 'Adoptado').length;
    const adopted = dogs.filter(d => d.status === 'Adoptado').length;
    const dashboardDogs = dogs.filter(d => d.status !== 'Adoptado').slice(0, 5);
    return `
        <div class="admin-header"><h1>Dashboard</h1></div>
        <div class="stats-grid">
            <div class="stat-card"><h4>Perros en refugio</h4><div class="number">${available}</div></div>
            <div class="stat-card"><h4>Perros adoptados</h4><div class="number">${adopted}</div></div>
            <div class="stat-card"><h4>Entradas blog</h4><div class="number">${blogPosts.length}</div></div>
            <div class="stat-card"><h4>Donaciones</h4><div class="number">1.250€</div></div>
        </div>
        <div class="admin-section">
            <h2>Perros disponibles</h2>
            <div class="dogs-table">
                <table class="admin-table">
                    <thead><tr><th>Nombre</th><th>Raza</th><th>Edad</th><th>Estado</th></tr></thead>
                    <tbody>
                        ${dashboardDogs.map(d => `
                            <tr>
                                <td>${d.name}</td>
                                <td>${d.breed}</td>
                                <td>${d.age}</td>
                                <td><span class="status-badge status-${d.status?.toLowerCase().replace(' ', '-') || 'disponible'}">${d.status || 'Disponible'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="dogs-cards-grid">
                ${dashboardDogs.map(d => `
                    <div class="dog-admin-card">
                        ${d.image_url ? `<img src="${d.image_url}" alt="${d.name}">` : '<div class="dog-placeholder">🐕</div>'}
                        <h4>${d.name}</h4>
                        <p>${d.breed} · ${d.age}</p>
                        <p class="dog-desc">${d.description ? d.description.substring(0, 60) + '...' : ''}</p>
                        <span class="status-badge status-${d.status?.toLowerCase().replace(' ', '-') || 'disponible'}">${d.status || 'Disponible'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderDogsPage(page = 1) {
    const totalPages = Math.ceil(dogs.length / adminPerPage);
    const start = (page - 1) * adminPerPage;
    const paginatedDogs = dogs.slice(start, start + adminPerPage);
    
    let paginationHtml = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="admin-page-btn ${i === page ? 'active' : ''}" onclick="goToAdminPage(${i})">${i}</button>`;
        }
    }
    
    return `
        <div class="admin-header"><h1>Gestión de Perros</h1></div>
        <div class="admin-section">
            <h2>
                Listado de perros
                <div style="display: flex; gap: 10px;">
                    <button class="btn-add" onclick="openModal('dog')"><i class="fas fa-plus"></i> Añadir perro</button>
                    <button class="btn-add" style="background: #2c5f2d;" onclick="openImportModal()"><i class="fas fa-file-csv"></i> Importar perros</button>
                </div>
            </h2>
            <div class="dogs-table">
                <table class="admin-table">
                    <thead><tr><th>Foto</th><th>Nombre</th><th>Raza</th><th>Edad</th><th>Estado</th><th>Acciones</th></tr></thead>
                    <tbody>
                        ${paginatedDogs.map(d => `
                            <tr>
                                <td>${d.image_url ? `<img src="${d.image_url}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : '🐕'}</td>
                                <td>${d.name}</td>
                                <td>${d.breed}</td>
                                <td>${d.age}</td>
                                <td><span class="status-badge status-${d.status?.toLowerCase().replace(' ', '-') || 'disponible'}">${d.status || 'Disponible'}</span></td>
                                <td>
                                    <button class="btn-icon" onclick="openModal('dog', ${d.id})">✏️</button>
                                    <button class="btn-icon" onclick="deleteDog(${d.id})">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="dogs-cards-grid">
                ${paginatedDogs.map(d => `
                    <div class="dog-admin-card">
                        ${d.image_url ? `<img src="${d.image_url}" alt="${d.name}">` : '<div class="dog-placeholder">🐕</div>'}
                        <h4>${d.name}</h4>
                        <p>${d.breed} · ${d.age}</p>
                        <p class="dog-desc">${d.description ? d.description.substring(0, 60) + '...' : ''}</p>
                        <span class="status-badge status-${d.status?.toLowerCase().replace(' ', '-') || 'disponible'}">${d.status || 'Disponible'}</span>
                        <div class="card-actions">
                            <button class="btn-icon" onclick="openModal('dog', ${d.id})">✏️</button>
                            <button class="btn-icon" onclick="deleteDog(${d.id})">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="admin-pagination">${paginationHtml}</div>
        </div>
    `;
}

function renderBlogPage(page = 1) {
    const totalPages = Math.ceil(blogPosts.length / adminPerPage);
    const start = (page - 1) * adminPerPage;
    const paginatedPosts = blogPosts.slice(start, start + adminPerPage);
    
    let paginationHtml = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="admin-page-btn ${i === page ? 'active' : ''}" onclick="goToAdminPage(${i})">${i}</button>`;
        }
    }
    
    return `
        <div class="admin-header"><h1>Gestión del Blog</h1></div>
        <div class="admin-section">
            <h2>Entradas <button class="btn-add" onclick="openModal('blog')"><i class="fas fa-plus"></i> Nueva entrada</button></h2>
            <div class="blog-table">
                <table class="admin-table">
                    <thead><tr><th>Imagen</th><th>Título</th><th>Extracto</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
                    <tbody>
                        ${paginatedPosts.map(p => `
                            <tr>
                                <td>${p.image_url ? `<img src="${p.image_url}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : '📰'}</td>
                                <td>${p.title}</td>
                                <td>${p.excerpt || ''}</td>
                                <td>${p.created_at ? new Date(p.created_at).toLocaleDateString('es-ES') : '-'}</td>
                                <td><span class="status-badge ${p.status === 'Publicado' ? 'status-disponible' : ''}">${p.status || 'Publicado'}</span></td>
                                <td>
                                    <button class="btn-icon" onclick="openModal('blog', ${p.id})">✏️</button>
                                    <button class="btn-icon" onclick="deleteBlogPost(${p.id})">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="blog-cards-grid">
                ${paginatedPosts.map(p => `
                    <div class="blog-admin-card">
                        ${p.image_url ? `<img src="${p.image_url}" alt="${p.title}">` : '<div class="blog-placeholder">📰</div>'}
                        <h4>${p.title}</h4>
                        <p class="blog-excerpt">${p.excerpt || ''}</p>
                        <div class="blog-meta">
                            <p>${p.created_at ? new Date(p.created_at).toLocaleDateString('es-ES') : '-'}</p>
                            <span class="status-badge ${p.status === 'Publicado' ? 'status-disponible' : ''}">${p.status || 'Publicado'}</span>
                        </div>
                        <div class="card-actions">
                            <button class="btn-icon" onclick="openModal('blog', ${p.id})">✏️</button>
                            <button class="btn-icon" onclick="deleteBlogPost(${p.id})">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="admin-pagination">${paginationHtml}</div>
        </div>
    `;
}

function renderSettingsPage() {
    return `
        <div class="admin-header"><h1>Configuración</h1></div>
        
        <!-- Logo -->
        <div class="admin-section">
            <h2>Logo</h2>
            <div class="form-group">
                <label>Logo actual</label>
                <div style="margin-bottom: 15px;">
                    ${settings.logo_url ? 
                        `<img src="${settings.logo_url}" style="max-width: 200px; max-height: 100px;">` : 
                        '<div style="font-size: 3rem;">🐾</div>'}
                </div>
            </div>
            <div class="form-group">
                <label>Subir nuevo logo</label>
                <input type="file" id="logoImage" accept="image/*" onchange="previewLogo(this)">
                <div class="image-preview" id="logoPreview"></div>
            </div>
            <div class="form-group"><label>Texto del logo</label><input type="text" id="logoText" value="${settings.logo_text || '🐾 PELUDOS LOS PEDROCHES'}"></div>
            <div class="form-group"><label>Subtítulo</label><input type="text" id="logoSubtitle" value="${settings.logo_subtitle || 'Protectora de Animales'}"></div>
            <button class="btn-save" onclick="saveLogoSettings()">Guardar logo</button>
        </div>
        
        <!-- Imágenes de secciones -->
        <div class="admin-section">
            <h2>Imágenes de las secciones</h2>
            
            <div class="form-group">
                <label>Imagen de Voluntariado</label>
                <div style="margin-bottom: 10px;">
                    ${settings.volunteer_image ? 
                        `<img src="${settings.volunteer_image}" style="max-width: 300px; max-height: 150px; border-radius: 8px;">` : 
                        '<span style="color: #999;">Sin imagen</span>'}
                </div>
                <input type="file" id="volunteerImageInput" accept="image/*" onchange="previewSectionImage(this, 'volunteerPreview')">
                <div class="image-preview" id="volunteerPreview"></div>
                <button class="btn-save" style="margin-top: 10px;" onclick="saveSectionImage('volunteer')">Guardar imagen</button>
            </div>
            
            <div class="form-group">
                <label>Imagen de Apadrinamiento</label>
                <div style="margin-bottom: 10px;">
                    ${settings.apadrina_image ? 
                        `<img src="${settings.apadrina_image}" style="max-width: 300px; max-height: 150px; border-radius: 8px;">` : 
                        '<span style="color: #999;">Sin imagen</span>'}
                </div>
                <input type="file" id="apadrinaImageInput" accept="image/*" onchange="previewSectionImage(this, 'apadrinaPreview')">
                <div class="image-preview" id="apadrinaPreview"></div>
                <button class="btn-save" style="margin-top: 10px;" onclick="saveSectionImage('apadrina')">Guardar imagen</button>
            </div>
            
            <div class="form-group">
                <label>Imagen de Casa de Acogida</label>
                <div style="margin-bottom: 10px;">
                    ${settings.acoge_image ? 
                        `<img src="${settings.acoge_image}" style="max-width: 300px; max-height: 150px; border-radius: 8px;">` : 
                        '<span style="color: #999;">Sin imagen</span>'}
                </div>
                <input type="file" id="acogeImageInput" accept="image/*" onchange="previewSectionImage(this, 'acogePreview')">
                <div class="image-preview" id="acogePreview"></div>
                <button class="btn-save" style="margin-top: 10px;" onclick="saveSectionImage('acoge')">Guardar imagen</button>
            </div>
            
            <div class="form-group">
                <label>Imagen de Quiénes Somos</label>
                <div style="margin-bottom: 10px;">
                    ${settings.about_image ? 
                        `<img src="${settings.about_image}" style="max-width: 300px; max-height: 150px; border-radius: 8px;">` : 
                        '<span style="color: #999;">Sin imagen</span>'}
                </div>
                <input type="file" id="aboutImageInput" accept="image/*" onchange="previewSectionImage(this, 'aboutPreview')">
                <div class="image-preview" id="aboutPreview"></div>
                <button class="btn-save" style="margin-top: 10px;" onclick="saveSectionImage('about')">Guardar imagen</button>
            </div>
        </div>
        
        <!-- Página Quiénes Somos -->
        <div class="admin-section">
            <h2>Página "Quiénes Somos"</h2>
            <div class="form-group"><label>Título principal</label><input type="text" id="aboutTitle" value="${settings.about_title || 'QUIÉNES SOMOS'}"></div>
            <div class="form-group"><label>Subtítulo</label><input type="text" id="aboutSubtitle" value="${settings.about_subtitle || ''}"></div>
            <div class="form-group"><label>Historia (HTML permitido)</label><textarea id="aboutHistory" rows="6">${settings.about_history || ''}</textarea></div>
            <div class="form-group"><label>Misión</label><textarea id="aboutMission" rows="3">${settings.about_mission || ''}</textarea></div>
            <div class="form-group"><label>Visión</label><textarea id="aboutVision" rows="3">${settings.about_vision || ''}</textarea></div>
            <div class="form-group"><label>Valores</label><textarea id="aboutValues" rows="3">${settings.about_values || ''}</textarea></div>
            <div class="form-group"><label>Colaboraciones (HTML permitido)</label><textarea id="aboutCollaborations" rows="5">${settings.about_collaborations || ''}</textarea></div>
            <button class="btn-save" onclick="saveAboutSettings()">Guardar página "Quiénes Somos"</button>
        </div>
        
        <!-- Colores -->
        <div class="admin-section">
            <h2>Colores</h2>
            <div class="form-group"><label>Color principal</label><input type="color" id="primaryColor" value="${settings.primary_color || '#e04f2e'}"></div>
            <div class="form-group"><label>Color secundario</label><input type="color" id="secondaryColor" value="${settings.secondary_color || '#2c5f2d'}"></div>
            <button class="btn-save" onclick="saveColorSettings()">Guardar colores</button>
        </div>
        
        <!-- Contacto -->
        <div class="admin-section">
            <h2>Contacto</h2>
            <div class="form-group"><label>Teléfono principal</label><input type="text" id="phone1" value="${settings.contact_phone1 || '661 44 79 42'}"></div>
            <div class="form-group"><label>Teléfono secundario</label><input type="text" id="phone2" value="${settings.contact_phone2 || '666 86 16 20'}"></div>
            <div class="form-group"><label>Email</label><input type="email" id="email" value="${settings.contact_email || 'peludoslospedroches@gmail.com'}"></div>
            <button class="btn-save" onclick="saveContactSettings()">Guardar contacto</button>
        </div>
    `;
}

function renderMessagesPage(messages, page = 1) {
    const totalPages = Math.ceil(messages.length / adminPerPage);
    const start = (page - 1) * adminPerPage;
    const paginatedMessages = messages.slice(start, start + adminPerPage);
    
    let paginationHtml = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="admin-page-btn ${i === page ? 'active' : ''}" onclick="goToAdminPage(${i})">${i}</button>`;
        }
    }
    
    return `
        <div class="admin-header"><h1>Mensajes de Contacto</h1></div>
        <div class="admin-section">
            <table class="admin-table">
                <thead><tr><th>Fecha</th><th>Nombre</th><th>Email</th><th>Asunto</th><th>Mensaje</th></tr></thead>
                <tbody>
                    ${paginatedMessages.map(m => `
                        <tr>
                            <td data-label="Fecha">${new Date(m.created_at).toLocaleDateString('es-ES')}</td>
                            <td data-label="Nombre">${m.name}</td>
                            <td data-label="Email">${m.email}</td>
                            <td data-label="Asunto">${m.subject || '-'}</td>
                            <td data-label="Mensaje">${m.message}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="admin-pagination">${paginationHtml}</div>
        </div>
    `;
}

function renderAdoptionsAdminPage(requests, page = 1) {
    const totalPages = Math.ceil(requests.length / adminPerPage);
    const start = (page - 1) * adminPerPage;
    const paginatedRequests = requests.slice(start, start + adminPerPage);
    
    let paginationHtml = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="admin-page-btn ${i === page ? 'active' : ''}" onclick="goToAdminPage(${i})">${i}</button>`;
        }
    }
    
    return `
        <div class="admin-header"><h1>Solicitudes de Adopción</h1></div>
        <div class="admin-section">
            <table class="admin-table">
                <thead><tr><th>Fecha</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Perro</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                    ${paginatedRequests.map(r => `
                        <tr>
                            <td data-label="Fecha">${new Date(r.created_at).toLocaleDateString('es-ES')}</td>
                            <td data-label="Nombre">${r.name}</td>
                            <td data-label="Email">${r.email}</td>
                            <td data-label="Teléfono">${r.phone || '-'}</td>
                            <td data-label="Perro">${r.dog_name || '-'}</td>
                            <td data-label="Estado"><span class="status-badge status-${r.status?.toLowerCase() || 'pendiente'}">${r.status || 'Pendiente'}</span></td>
                            <td data-label="Acciones">
                                <button class="btn-icon" onclick="updateRequestStatus(${r.id}, 'Aprobada')">✅</button>
                                <button class="btn-icon" onclick="updateRequestStatus(${r.id}, 'Rechazada')">❌</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="admin-pagination">${paginationHtml}</div>
        </div>
    `;
}

// --- NUEVAS FUNCIONES DE RENDERIZADO PARA LOS FORMULARIOS (con clase form-table) ---
function renderVolunteersPage(data, page = 1) {
    const totalPages = Math.ceil(data.length / adminPerPage);
    const start = (page - 1) * adminPerPage;
    const paginated = data.slice(start, start + adminPerPage);
    
    let paginationHtml = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="admin-page-btn ${i === page ? 'active' : ''}" onclick="goToAdminPage(${i})">${i}</button>`;
        }
    }
    
    return `
        <div class="admin-header"><h1>Solicitudes de Voluntariado</h1></div>
        <div class="admin-section">
            <table class="admin-table form-table">
                <thead><tr><th>Fecha</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Disponibilidad</th><th>Intereses</th></tr></thead>
                <tbody>
                    ${paginated.map(v => `
                        <tr>
                            <td data-label="Fecha">${new Date(v.created_at).toLocaleDateString('es-ES')}</td>
                            <td data-label="Nombre">${v.name}</td>
                            <td data-label="Email">${v.email}</td>
                            <td data-label="Teléfono">${v.phone || '-'}</td>
                            <td data-label="Disponibilidad">${v.availability || '-'}</td>
                            <td data-label="Intereses">${v.interests || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="admin-pagination">${paginationHtml}</div>
        </div>
    `;
}

function renderSponsorsPage(data, page = 1) {
    const totalPages = Math.ceil(data.length / adminPerPage);
    const start = (page - 1) * adminPerPage;
    const paginated = data.slice(start, start + adminPerPage);
    
    let paginationHtml = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="admin-page-btn ${i === page ? 'active' : ''}" onclick="goToAdminPage(${i})">${i}</button>`;
        }
    }
    
    return `
        <div class="admin-header"><h1>Solicitudes de Apadrinamiento</h1></div>
        <div class="admin-section">
            <table class="admin-table form-table">
                <thead><tr><th>Fecha</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Decisión</th><th>Perro</th><th>Aportación</th></tr></thead>
                <tbody>
                    ${paginated.map(s => `
                        <tr>
                            <td data-label="Fecha">${new Date(s.created_at).toLocaleDateString('es-ES')}</td>
                            <td data-label="Nombre">${s.name}</td>
                            <td data-label="Email">${s.email}</td>
                            <td data-label="Teléfono">${s.phone || '-'}</td>
                            <td data-label="Decisión">${s.dog_choice === 'especifico' ? 'Eligió perro' : 'Elegid por mí'}</td>
                            <td data-label="Perro">${s.specific_dog || '-'}</td>
                            <td data-label="Aportación">${s.amount ? s.amount + '€/mes' : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="admin-pagination">${paginationHtml}</div>
        </div>
    `;
}

function renderFostersPage(data, page = 1) {
    const totalPages = Math.ceil(data.length / adminPerPage);
    const start = (page - 1) * adminPerPage;
    const paginated = data.slice(start, start + adminPerPage);
    
    let paginationHtml = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="admin-page-btn ${i === page ? 'active' : ''}" onclick="goToAdminPage(${i})">${i}</button>`;
        }
    }
    
    return `
        <div class="admin-header"><h1>Solicitudes de Acogida</h1></div>
        <div class="admin-section">
            <table class="admin-table form-table">
                <thead><tr><th>Fecha</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Vivienda</th><th>Otros animales</th><th>Mensaje</th></tr></thead>
                <tbody>
                    ${paginated.map(f => `
                        <tr>
                            <td data-label="Fecha">${new Date(f.created_at).toLocaleDateString('es-ES')}</td>
                            <td data-label="Nombre">${f.name}</td>
                            <td data-label="Email">${f.email}</td>
                            <td data-label="Teléfono">${f.phone || '-'}</td>
                            <td data-label="Vivienda">${f.housing_type || '-'}</td>
                            <td data-label="Otros animales">${f.has_pets || '-'}</td>
                            <td data-label="Mensaje">${f.message || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="admin-pagination">${paginationHtml}</div>
        </div>
    `;
}

function renderMembersPage(data, page = 1) {
    const totalPages = Math.ceil(data.length / adminPerPage);
    const start = (page - 1) * adminPerPage;
    const paginated = data.slice(start, start + adminPerPage);
    
    let paginationHtml = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="admin-page-btn ${i === page ? 'active' : ''}" onclick="goToAdminPage(${i})">${i}</button>`;
        }
    }
    
    return `
        <div class="admin-header"><h1>Solicitudes de Membresía (Socios)</h1></div>
        <div class="admin-section">
            <table class="admin-table form-table">
                <thead><tr><th>Fecha</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Cuota</th></tr></thead>
                <tbody>
                    ${paginated.map(m => `
                        <tr>
                            <td data-label="Fecha">${new Date(m.created_at).toLocaleDateString('es-ES')}</td>
                            <td data-label="Nombre">${m.name}</td>
                            <td data-label="Email">${m.email}</td>
                            <td data-label="Teléfono">${m.phone || '-'}</td>
                            <td data-label="Cuota">${m.amount ? m.amount + '€/mes' : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="admin-pagination">${paginationHtml}</div>
        </div>
    `;
}

async function updateRequestStatus(id, status) {
    await supabaseClient.from('adoption_requests').update({ status }).eq('id', id);
    await loadAdoptionRequests();
    renderPage(adminCurrentPage);
}

// ========================================
// FUNCIONES DE GUARDADO
// ========================================
async function saveLogoSettings() {
    const logoText = document.getElementById('logoText').value;
    const logoSubtitle = document.getElementById('logoSubtitle').value;
    let logoUrl = settings.logo_url;
    if (selectedLogoFile) {
        logoUrl = await uploadFile(selectedLogoFile, 'logos');
        if (!logoUrl) { showToast('Error al subir el logo', 'error'); return; }
    }
    await supabaseClient.from('settings').update({ value: logoText }).eq('key', 'logo_text');
    await supabaseClient.from('settings').update({ value: logoSubtitle }).eq('key', 'logo_subtitle');
    if (logoUrl) await supabaseClient.from('settings').upsert({ key: 'logo_url', value: logoUrl });
    showToast('Logo actualizado');
    selectedLogoFile = null;
    init();
}

async function saveColorSettings() {
    const primary = document.getElementById('primaryColor').value;
    const secondary = document.getElementById('secondaryColor').value;
    await supabaseClient.from('settings').update({ value: primary }).eq('key', 'primary_color');
    await supabaseClient.from('settings').update({ value: secondary }).eq('key', 'secondary_color');
    showToast('Colores actualizados');
    init();
}

async function saveContactSettings() {
    const phone1 = document.getElementById('phone1')?.value;
    const phone2 = document.getElementById('phone2')?.value;
    const email = document.getElementById('email')?.value;
    if (phone1) await supabaseClient.from('settings').update({ value: phone1 }).eq('key', 'contact_phone1');
    if (phone2) await supabaseClient.from('settings').update({ value: phone2 }).eq('key', 'contact_phone2');
    if (email) await supabaseClient.from('settings').update({ value: email }).eq('key', 'contact_email');
    showToast('Contacto actualizado');
    init();
}

async function saveAboutSettings() {
    const fields = {
        'about_title': 'aboutTitle',
        'about_subtitle': 'aboutSubtitle',
        'about_history': 'aboutHistory',
        'about_mission': 'aboutMission',
        'about_vision': 'aboutVision',
        'about_values': 'aboutValues',
        'about_collaborations': 'aboutCollaborations'
    };
    for (const [key, inputId] of Object.entries(fields)) {
        const value = document.getElementById(inputId)?.value || '';
        await supabaseClient.from('settings').update({ value }).eq('key', key);
        settings[key] = value;
    }
    showToast('Página "Quiénes Somos" actualizada');
}

// ========================================
// SUBIDA DE ARCHIVOS
// ========================================
async function uploadFile(file, bucket) {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    try {
        const { data, error } = await supabaseClient.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: true });
        if (error) throw error;
        const { data: urlData } = supabaseClient.storage.from(bucket).getPublicUrl(fileName);
        return urlData.publicUrl;
    } catch (error) {
        console.error('Error subiendo archivo:', error);
        return null;
    }
}

// ========================================
// MODALES Y FORMULARIOS
// ========================================
function openModal(type, id = null) {
    const modal = document.getElementById('editModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    if (type === 'dog') {
        const dog = id ? dogs.find(d => d.id === id) : { name: '', breed: '', age: '', gender: 'Macho', size: 'Mediano', status: 'Disponible', description: '', badge: '', image_url: '', images: [] };
        const existingImages = (dog.images && dog.images.length > 0) ? dog.images : (dog.image_url ? [dog.image_url] : []);
        existingImagesToKeep = [...existingImages];
        selectedFiles = [];
        
        const imagesPreviewHtml = existingImagesToKeep.map((url, index) => 
            `<div style="position:relative; display:inline-block; margin:5px;">
                <img src="${url}" style="width:80px; height:80px; object-fit:cover; border-radius:5px;">
                <button type="button" onclick="removeExistingImage(${index})" style="position:absolute; top:0; right:0; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px;">&times;</button>
            </div>`
        ).join('');

        title.textContent = id ? 'Editar perro' : 'Añadir perro';
        body.innerHTML = `
            <div class="form-group">
                <label>Fotos del perro (puedes seleccionar varias)</label>
                <input type="file" id="dogImages" accept="image/*" multiple onchange="previewMultipleImages(this)">
                <div class="image-preview" id="imagePreview" style="display:flex; flex-wrap:wrap;">
                    ${imagesPreviewHtml}
                </div>
                <div id="newImagesPreview" style="display:flex; flex-wrap:wrap;"></div>
            </div>
            <div class="form-group"><label>Nombre *</label><input type="text" id="dogName" value="${dog.name || ''}" required></div>
            <div class="form-group"><label>Raza</label><input type="text" id="dogBreed" value="${dog.breed || ''}"></div>
            <div class="form-group"><label>Edad</label><input type="text" id="dogAge" value="${dog.age || ''}"></div>
            <div class="form-group"><label>Sexo</label><select id="dogGender"><option ${dog.gender === 'Macho' ? 'selected' : ''}>Macho</option><option ${dog.gender === 'Hembra' ? 'selected' : ''}>Hembra</option></select></div>
            <div class="form-group"><label>Tamaño</label><select id="dogSize"><option ${dog.size === 'Pequeño' ? 'selected' : ''}>Pequeño</option><option ${dog.size === 'Mediano' ? 'selected' : ''}>Mediano</option><option ${dog.size === 'Grande' ? 'selected' : ''}>Grande</option></select></div>
            <div class="form-group"><label>Estado</label><select id="dogStatus"><option ${dog.status === 'Disponible' ? 'selected' : ''}>Disponible</option><option ${dog.status === 'En acogida' ? 'selected' : ''}>En acogida</option><option ${dog.status === 'Adoptado' ? 'selected' : ''}>Adoptado</option></select></div>
            <div class="form-group"><label>Etiqueta</label><input type="text" id="dogBadge" value="${dog.badge || ''}"></div>
            <div class="form-group"><label>Descripción</label><textarea id="dogDescription" rows="3">${dog.description || ''}</textarea></div>
            <button class="btn-save" onclick="saveDog(${id || 'null'})">Guardar perro</button>
        `;
    } else if (type === 'blog') {
        const post = id ? blogPosts.find(p => p.id === id) : { title: '', excerpt: '', content: '', status: 'Publicado', image_url: '' };
        title.textContent = id ? 'Editar entrada' : 'Nueva entrada';
        body.innerHTML = `
            <div class="form-group"><label>Imagen</label><input type="file" id="blogImage" accept="image/*" onchange="previewBlogImage(this)"><div class="image-preview" id="blogImagePreview">${post.image_url ? `<img src="${post.image_url}">` : ''}</div></div>
            <div class="form-group"><label>Título *</label><input type="text" id="postTitle" value="${post.title || ''}" required></div>
            <div class="form-group"><label>Extracto</label><input type="text" id="postExcerpt" value="${post.excerpt || ''}"></div>
            <div class="form-group"><label>Contenido</label><textarea id="postContent" rows="6">${post.content || ''}</textarea></div>
            <div class="form-group"><label>Estado</label><select id="postStatus"><option ${post.status === 'Publicado' ? 'selected' : ''}>Publicado</option><option ${post.status === 'Borrador' ? 'selected' : ''}>Borrador</option></select></div>
            <button class="btn-save" onclick="saveBlogPost(${id || 'null'})">Guardar entrada</button>
        `;
        selectedBlogImageFile = null;
    }
    modal.classList.add('active');
}

function previewMultipleImages(input) {
    const newPreview = document.getElementById('newImagesPreview');
    newPreview.innerHTML = '';
    selectedFiles = Array.from(input.files);
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.style.cssText = 'position:relative; display:inline-block; margin:5px;';
            div.innerHTML = `
                <img src="${e.target.result}" style="width:80px; height:80px; object-fit:cover; border-radius:5px;">
                <button type="button" onclick="removeNewFile(${index})" style="position:absolute; top:0; right:0; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px;">&times;</button>
            `;
            newPreview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function removeNewFile(index) {
    selectedFiles.splice(index, 1);
    const newPreview = document.getElementById('newImagesPreview');
    newPreview.innerHTML = '';
    selectedFiles.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.style.cssText = 'position:relative; display:inline-block; margin:5px;';
            div.innerHTML = `
                <img src="${e.target.result}" style="width:80px; height:80px; object-fit:cover; border-radius:5px;">
                <button type="button" onclick="removeNewFile(${i})" style="position:absolute; top:0; right:0; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px;">&times;</button>
            `;
            newPreview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function removeExistingImage(index) {
    existingImagesToKeep.splice(index, 1);
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = existingImagesToKeep.map((url, i) => 
        `<div style="position:relative; display:inline-block; margin:5px;">
            <img src="${url}" style="width:80px; height:80px; object-fit:cover; border-radius:5px;">
            <button type="button" onclick="removeExistingImage(${i})" style="position:absolute; top:0; right:0; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px;">&times;</button>
        </div>`
    ).join('');
}

function previewImage(input) {
    const file = input.files[0];
    if (file) {
        selectedImageFile = file;
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}">`; };
        reader.readAsDataURL(file);
    }
}

function previewBlogImage(input) {
    const file = input.files[0];
    if (file) {
        selectedBlogImageFile = file;
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById('blogImagePreview').innerHTML = `<img src="${e.target.result}">`; };
        reader.readAsDataURL(file);
    }
}

function previewLogo(input) {
    const file = input.files[0];
    if (file) {
        selectedLogoFile = file;
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById('logoPreview').innerHTML = `<img src="${e.target.result}" style="max-width: 200px;">`; };
        reader.readAsDataURL(file);
    }
}

function previewSectionImage(input, previewId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" style="max-width: 200px; border-radius: 8px;">`; };
        reader.readAsDataURL(file);
    }
}

async function saveSectionImage(section) {
    let inputId, key;
    switch(section) {
        case 'volunteer': inputId = 'volunteerImageInput'; key = 'volunteer_image'; break;
        case 'apadrina': inputId = 'apadrinaImageInput'; key = 'apadrina_image'; break;
        case 'acoge': inputId = 'acogeImageInput'; key = 'acoge_image'; break;
        case 'about': inputId = 'aboutImageInput'; key = 'about_image'; break;
        default: return;
    }
    const fileInput = document.getElementById(inputId);
    if (!fileInput || !fileInput.files[0]) { showToast('Selecciona una imagen', 'error'); return; }
    const imageUrl = await uploadFile(fileInput.files[0], 'secciones');
    if (!imageUrl) { showToast('Error al subir la imagen', 'error'); return; }
    await supabaseClient.from('settings').update({ value: imageUrl }).eq('key', key);
    settings[key] = imageUrl;
    showToast('Imagen guardada correctamente');
    renderPage();
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    selectedImageFile = null;
    selectedBlogImageFile = null;
    selectedLogoFile = null;
    selectedFiles = [];
    existingImagesToKeep = [];
}

// ========================================
// IMPORTACIÓN CSV
// ========================================
function openImportModal() { document.getElementById('importModal').classList.add('active'); }
function closeImportModal() { document.getElementById('importModal').classList.remove('active'); }

async function importCSV() {
    const fileInput = document.getElementById('csvFileInput');
    const statusDiv = document.getElementById('importStatus');
    if (!fileInput.files[0]) { statusDiv.innerHTML = '<p style="color: #e04f2e;">❌ Selecciona un archivo CSV primero.</p>'; return; }
    const file = fileInput.files[0];
    statusDiv.innerHTML = '<p style="color: #666;">⏳ Leyendo archivo...</p>';
    Papa.parse(file, {
        header: true, skipEmptyLines: true, encoding: 'UTF-8',
        complete: async function(results) {
            if (results.errors.length > 0) { statusDiv.innerHTML = '<p style="color: #e04f2e;">❌ Error al leer el archivo CSV.</p>'; return; }
            const perros = results.data.map(row => ({
                name: row['Nombre'] || '', breed: row['Raza'] || '', age: row['Edad'] || '',
                size: row['Tamaño'] || 'Mediano', gender: row['Sexo'] || 'Macho',
                description: row['Descripción'] || '', badge: row['Etiqueta'] || '',
                status: row['Estado'] || 'Disponible', image_url: '', images: []
            }));
            const validos = perros.filter(p => p.name.trim() !== '');
            if (validos.length === 0) { statusDiv.innerHTML = '<p style="color: #e04f2e;">❌ No se encontraron perros válidos.</p>'; return; }
            statusDiv.innerHTML = `<p style="color: #666;">⏳ Importando ${validos.length} perros...</p>`;
            try {
                const { error } = await supabaseClient.from('dogs').insert(validos);
                if (error) throw error;
                statusDiv.innerHTML = `<p style="color: #2c5f2d;">✅ ${validos.length} perros importados correctamente.</p>`;
                await loadDogs();
                renderPage();
                setTimeout(closeImportModal, 1500);
            } catch (error) {
                statusDiv.innerHTML = `<p style="color: #e04f2e;">❌ Error al importar: ${error.message}</p>`;
            }
        },
        error: function(error) { statusDiv.innerHTML = `<p style="color: #e04f2e;">❌ Error al procesar: ${error.message}</p>`; }
    });
}

// ========================================
// CRUD DE PERROS Y BLOG
// ========================================
async function saveDog(id) {
    const name = document.getElementById('dogName')?.value;
    if (!name) { showToast('El nombre es obligatorio', 'error'); return; }
    let newUrls = [];
    if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
            const url = await uploadFile(file, 'dogs');
            if (url) newUrls.push(url);
        }
    }
    const finalImages = [...existingImagesToKeep, ...newUrls];
    const dogData = {
        name, breed: document.getElementById('dogBreed')?.value || '',
        age: document.getElementById('dogAge')?.value || '',
        gender: document.getElementById('dogGender')?.value || 'Macho',
        size: document.getElementById('dogSize')?.value || 'Mediano',
        status: document.getElementById('dogStatus')?.value || 'Disponible',
        badge: document.getElementById('dogBadge')?.value || '',
        description: document.getElementById('dogDescription')?.value || '',
        images: finalImages,
        image_url: finalImages.length > 0 ? finalImages[0] : ''
    };
    if (id && id !== 'null') {
        await supabaseClient.from('dogs').update(dogData).eq('id', id);
    } else {
        await supabaseClient.from('dogs').insert([dogData]);
    }
    closeModal();
    await loadDogs();
    renderPage();
    showToast('Perro guardado');
}

async function deleteDog(id) {
    if (confirm('¿Eliminar este perro?')) {
        await supabaseClient.from('dogs').delete().eq('id', id);
        await loadDogs();
        renderPage();
        showToast('Perro eliminado');
    }
}

async function saveBlogPost(id) {
    const title = document.getElementById('postTitle')?.value;
    if (!title) { showToast('El título es obligatorio', 'error'); return; }
    let imageUrl = id && id !== 'null' ? blogPosts.find(p => p.id === id)?.image_url || '' : '';
    if (selectedBlogImageFile) {
        imageUrl = await uploadFile(selectedBlogImageFile, 'blog');
        if (!imageUrl) { showToast('Error al subir la imagen', 'error'); return; }
    }
    const postData = { title, excerpt: document.getElementById('postExcerpt')?.value || '',
        content: document.getElementById('postContent')?.value || '',
        status: document.getElementById('postStatus')?.value || 'Publicado', image_url: imageUrl };
    if (id && id !== 'null') await supabaseClient.from('blog_posts').update(postData).eq('id', id);
    else await supabaseClient.from('blog_posts').insert([postData]);
    closeModal();
    await loadBlogPosts();
    renderPage();
    showToast('Entrada guardada');
}

async function deleteBlogPost(id) {
    if (confirm('¿Eliminar esta entrada?')) {
        await supabaseClient.from('blog_posts').delete().eq('id', id);
        await loadBlogPosts();
        renderPage();
        showToast('Entrada eliminada');
    }
}

// ========================================
// UTILIDADES
// ========================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${type === 'success' ? '#2c5f2d' : '#e04f2e'};color:white;padding:12px 18px;border-radius:8px;z-index:9999;`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

// ========================================
// EXPONER FUNCIONES GLOBALES
// ========================================
window.openModal = openModal;
window.closeModal = closeModal;
window.saveDog = saveDog;
window.deleteDog = deleteDog;
window.previewImage = previewImage;
window.previewMultipleImages = previewMultipleImages;
window.removeNewFile = removeNewFile;
window.removeExistingImage = removeExistingImage;
window.previewBlogImage = previewBlogImage;
window.previewLogo = previewLogo;
window.previewSectionImage = previewSectionImage;
window.saveSectionImage = saveSectionImage;
window.saveBlogPost = saveBlogPost;
window.deleteBlogPost = deleteBlogPost;
window.saveLogoSettings = saveLogoSettings;
window.saveColorSettings = saveColorSettings;
window.saveContactSettings = saveContactSettings;
window.saveAboutSettings = saveAboutSettings;
window.openImportModal = openImportModal;
window.closeImportModal = closeImportModal;
window.importCSV = importCSV;
window.updateRequestStatus = updateRequestStatus;
window.logout = logout;
window.goToAdminPage = goToAdminPage;
