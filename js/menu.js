// ========================================
// PELUDOS LOS PEDROCHES – MENÚ MÓVIL Y DROPDOWNS
// ========================================

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !nav.classList.contains('active'));
            icon.classList.toggle('fa-times', nav.classList.contains('active'));
        }
    });

    nav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || window.innerWidth > 768) return;

        const parentLi = link.closest('li');
        if (parentLi && parentLi.classList.contains('dropdown') && parentLi.querySelector('ul.dropdown-menu')) {
            return;
        }

        nav.classList.remove('active');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
}

function initDropdownMobile() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector(':scope > a');
        if (!link) return;
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });
                dropdown.classList.toggle('active');
            }
        });
    });
}
