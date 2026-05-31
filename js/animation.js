// ========================================
// PELUDOS LOS PEDROCHES – ANIMACIONES CON FALLBACK
// ========================================

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    // Si no hay elementos para animar, no hacer nada
    if (reveals.length === 0) return;

    // Observer normal para las animaciones
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));

    // FALLBACK: Si después de 3 segundos algún elemento sigue sin ser visible,
    // forzar su visibilidad (por si el observer falla en algunos navegadores)
    setTimeout(() => {
        reveals.forEach(el => {
            if (!el.classList.contains('visible')) {
                el.classList.add('visible');
            }
        });
    }, 3000);
}

// Exponer globalmente por si acaso
window.initScrollReveal = initScrollReveal;
