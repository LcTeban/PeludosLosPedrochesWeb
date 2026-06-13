// ========================================
// PELUDOS LOS PEDROCHES – GESTIÓN DE COOKIES (RGPD)
// ========================================

(function() {
    'use strict';

    // Comprobar si el usuario ya aceptó/rechazó las cookies
    function getCookieConsent() {
        return localStorage.getItem('cookieConsent');
    }

    // Guardar la decisión del usuario
    function setCookieConsent(value) {
        localStorage.setItem('cookieConsent', value);
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
    }

    // Crear el banner de cookies dinámicamente
    function createCookieBanner() {
        // Si ya dio consentimiento, no mostrar el banner
        if (getCookieConsent()) return;

        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookieBanner';
        banner.innerHTML = `
            <div class="cookie-banner-text">
                🍪 Usamos cookies para mejorar tu experiencia. Las cookies esenciales son necesarias para el funcionamiento de la web. 
                Puedes aceptar todas o rechazar las no esenciales. 
                <a href="/pages/privacidad.html" target="_blank">Más información</a>
            </div>
            <div class="cookie-banner-buttons">
                <button class="cookie-btn cookie-btn-reject" id="cookieReject">Solo esenciales</button>
                <button class="cookie-btn cookie-btn-accept" id="cookieAccept">Aceptar todas</button>
            </div>
        `;

        document.body.appendChild(banner);

        // Mostrar el banner con animación después de 1 segundo
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);

        // Eventos de los botones
        document.getElementById('cookieAccept').addEventListener('click', function() {
            setCookieConsent('accepted');
            hideBanner();
            // Aquí puedes activar Google Analytics, Facebook Pixel, etc.
            console.log('✅ Cookies aceptadas');
        });

        document.getElementById('cookieReject').addEventListener('click', function() {
            setCookieConsent('rejected');
            hideBanner();
            console.log('❌ Cookies rechazadas (solo esenciales)');
        });
    }

    // Ocultar el banner con animación
    function hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 400);
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createCookieBanner);
    } else {
        createCookieBanner();
    }

    // Exponer función global para permitir al usuario cambiar su decisión
    window.resetCookieConsent = function() {
        localStorage.removeItem('cookieConsent');
        localStorage.removeItem('cookieConsentDate');
        location.reload();
    };
})();
