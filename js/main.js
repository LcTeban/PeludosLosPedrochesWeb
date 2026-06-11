// ========================================
// PELUDOS LOS PEDROCHES – INICIALIZACIÓN SEGURA Y RÁPIDA
// ========================================

document.addEventListener('DOMContentLoaded', async function() {
    // 1. Iniciar listeners de UI básica inmediatamente
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initDropdownMobile === 'function') initDropdownMobile();
    if (typeof initNewsletter === 'function') initNewsletter();
    if (typeof initForms === 'function') initForms();
    if (typeof initBlogListeners === 'function') initBlogListeners();

    // 2. Cargar datos de Supabase EN PARALELO (Mucho más rápido)
    try {
        await Promise.all([
            typeof loadSettings === 'function' ? loadSettings() : Promise.resolve(),
            typeof loadDogs === 'function' ? loadDogs() : Promise.resolve(),
            typeof loadBlogPosts === 'function' ? loadBlogPosts() : Promise.resolve()
        ]);
    } catch (e) {
        console.warn('Error cargando algunos datos:', e);
    }

    // 3. Animaciones de scroll
    if (typeof window.initScrollReveal === 'function') {
        window.initScrollReveal();
    } else {
        var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        for (var i = 0; i < reveals.length; i++) {
            reveals[i].classList.add('visible');
        }
    }

    // 4. Seleccionar perro para adopción (Desde URL o localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    let selectedDog = urlParams.get('perro') || localStorage.getItem('selectedDog');
    
    if (selectedDog) {
        var select = document.querySelector('select[name="perro"]');
        if (select) {
            var opt = Array.from(select.options).find(o => o.value.toLowerCase() === selectedDog.toLowerCase());
            if (opt) {
                opt.selected = true;
                // Scroll suave al formulario si venimos de una tarjeta
                const formSection = document.getElementById('formulario');
                if (formSection && urlParams.get('perro')) {
                    setTimeout(() => formSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);
                }
            }
        }
        localStorage.removeItem('selectedDog');
    }

    // 5. Filtros de perros (Tamaño, Edad, Sexo, Búsqueda)
    var sizeFilter = document.getElementById('sizeFilter');
    var ageFilter = document.getElementById('ageFilter');
    var genderFilter = document.getElementById('genderFilter');
    var searchInput = document.getElementById('searchDog');

    if (sizeFilter || ageFilter || genderFilter || searchInput) {
        function applyFilters() {
            var filters = {};
            if (sizeFilter?.value) filters.size = sizeFilter.value;
            if (ageFilter?.value) filters.age = ageFilter.value; // ¡Nuevo!
            if (genderFilter?.value) filters.gender = genderFilter.value;
            if (searchInput?.value) filters.search = searchInput.value;
            
            if (typeof renderDogsList === 'function') renderDogsList(filters, 1);
        }
        
        sizeFilter?.addEventListener('change', applyFilters);
        ageFilter?.addEventListener('change', applyFilters);
        genderFilter?.addEventListener('change', applyFilters);
        searchInput?.addEventListener('input', applyFilters);
    }
});
