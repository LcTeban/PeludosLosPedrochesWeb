// ========================================
// PELUDOS LOS PEDROCHES – ANIMACIONES
// ========================================

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    reveals.forEach(el => observer.observe(el));
}
