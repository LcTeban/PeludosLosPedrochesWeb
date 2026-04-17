// ========================================
// PELUDOS LOS PEDROCHES - JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initDropdownMobile();
    initNewsletter();
    loadFeaturedDogs();
    loadBlogPreview();
});

// Menú móvil
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
    }
}

// Dropdowns en móvil
function initDropdownMobile() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active-dropdown');
            }
        });
    });
}

// Newsletter
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showNotification('¡Gracias por suscribirte! Te mantendremos informado.', 'success');
            this.reset();
        });
    }
}

// Cargar perros destacados
function loadFeaturedDogs() {
    const container = document.getElementById('featuredDogs');
    if (!container) return;
    
    const dogs = [
        {
            name: 'Luna',
            breed: 'Mastina',
            age: '2 años',
            description: 'Cariñosa y juguetona. Sus saltos a modo de saludo son su seña de identidad.',
            badge: 'Urgente'
        },
        {
            name: 'Arena',
            breed: 'Cruce labrador',
            age: '2 años',
            description: 'Perrita activa, buena, noble y cariñosa. No deja a nadie indiferente.',
            badge: 'En acogida'
        },
        {
            name: 'Toby',
            breed: 'Podenco',
            age: '1 año',
            description: 'Joven y juguetón, busca familia activa que le dé mucho cariño.',
            badge: 'Nuevo'
        }
    ];
    
    let html = '';
    dogs.forEach(dog => {
        html += `
            <div class="dog-card">
                <div class="dog-image">
                    <div class="placeholder-image">🐕</div>
                    <span class="dog-badge">${dog.badge}</span>
                </div>
                <div class="dog-info">
                    <h3 class="dog-name">${dog.name}</h3>
                    <div class="dog-details">
                        <span><i class="fas fa-paw"></i> ${dog.breed}</span>
                        <span><i class="fas fa-calendar"></i> ${dog.age}</span>
                    </div>
                    <p class="dog-description">${dog.description}</p>
                    <a href="pages/adopta.html" class="btn-adopt">Conóceme</a>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Cargar blog preview
function loadBlogPreview() {
    const container = document.getElementById('blogPreview');
    if (!container) return;
    
    const posts = [
        {
            date: '20 Enero, 2024',
            title: 'Bendición de animales por San Antón',
            excerpt: 'Un año más celebramos la tradicional bendición en Pozoblanco.'
        },
        {
            date: '15 Diciembre, 2023',
            title: 'Refugio al límite de capacidad',
            excerpt: 'Superamos los 70 perros y necesitamos casas de acogida urgentes.'
        },
        {
            date: '5 Noviembre, 2023',
            title: 'Colaboración con Fundación Gypaetus',
            excerpt: 'Seguimos trabajando contra el uso de cebos envenenados.'
        }
    ];
    
    let html = '';
    posts.forEach(post => {
        html += `
            <article class="blog-card">
                <div class="blog-image">
                    <div class="placeholder-image">📰</div>
                </div>
                <div class="blog-content">
                    <div class="blog-date"><i class="far fa-calendar"></i> ${post.date}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="pages/blog.html" class="card-link">Leer más <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
    });
    
    container.innerHTML = html;
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28A745' : '#e04f2e'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

console.log('🐾 Peludos Los Pedroches - Web cargada correctamente');
