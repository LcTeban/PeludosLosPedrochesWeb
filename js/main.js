// ========================================
// PELUDOS LOS PEDROCHES – INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM listo, iniciando...');
    
    // Blog (listeners antes de cargar datos)
    if (typeof initBlogListeners === 'function') initBlogListeners();
    
    // Cargar datos desde Supabase
    if (typeof loadSettings === 'function') await loadSettings();
    if (typeof loadDogs === 'function') await loadDogs();
    if (typeof loadBlogPosts === 'function') await loadBlogPosts();
    
    // Inicializar componentes
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initDropdownMobile === 'function') initDropdownMobile();
    if (typeof initNewsletter === 'function') initNewsletter();
    if (typeof initForms === 'function') initForms();
    if (typeof initScrollReveal === 'function') initScrollReveal();

    // Recuperar perro seleccionado para el formulario de adopción
    const selectedDog = localStorage.getItem('selectedDog');
    if (selectedDog) {
        const select = document.querySelector('select[name="perro"]');
        if (select) {
            const opt = Array.from(select.options).find(o => o.value === selectedDog);
            if (opt) opt.selected = true;
        }
        localStorage.removeItem('selectedDog');
    }

    // Configurar filtros en la página de adopción
    const sizeFilter = document.getElementById('sizeFilter');
    const ageFilter = document.getElementById('ageFilter');
    const genderFilter = document.getElementById('genderFilter');
    const searchInput = document.getElementById('searchDog');
    
    if (sizeFilter || ageFilter || genderFilter || searchInput) {
        function applyFilters() {
            const filters = {};
            if (sizeFilter?.value) filters.size = sizeFilter.value;
            if (genderFilter?.value) filters.gender = genderFilter.value;
            if (searchInput?.value) filters.search = searchInput.value;
            if (typeof renderDogsList === 'function') renderDogsList(filters, 1);
        }
        
        sizeFilter?.addEventListener('change', applyFilters);
        ageFilter?.addEventListener('change', applyFilters);
        genderFilter?.addEventListener('change', applyFilters);
        searchInput?.addEventListener('input', applyFilters);
    }

    console.log('🏁 Aplicación lista');
});
