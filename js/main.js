// ========================================
// PELUDOS LOS PEDROCHES – INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM listo, iniciando...');
    
    initBlogListeners();
    await loadSettings();
    await loadDogs();
    await loadBlogPosts();
    initMobileMenu();
    initDropdownMobile();
    initNewsletter();
    initForms();
    initScrollReveal();

    const selectedDog = localStorage.getItem('selectedDog');
    if (selectedDog) {
        const select = document.querySelector('select[name="perro"]');
        if (select) {
            const opt = Array.from(select.options).find(o => o.value === selectedDog);
            if (opt) opt.selected = true;
        }
        localStorage.removeItem('selectedDog');
    }

    const sizeFilter = document.getElementById('sizeFilter');
    const ageFilter = document.getElementById('ageFilter');
    const genderFilter = document.getElementById('genderFilter');
    const searchInput = document.getElementById('searchDog');
    function applyFilters() {
        const filters = {};
        if (sizeFilter?.value) filters.size = sizeFilter.value;
        if (genderFilter?.value) filters.gender = genderFilter.value;
        if (searchInput?.value) filters.search = searchInput.value;
        renderDogsList(filters, 1);
    }
    sizeFilter?.addEventListener('change', applyFilters);
    ageFilter?.addEventListener('change', applyFilters);
    genderFilter?.addEventListener('change', applyFilters);
    searchInput?.addEventListener('input', applyFilters);

    console.log('🏁 Aplicación lista');
});
