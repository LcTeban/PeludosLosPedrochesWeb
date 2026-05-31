// ========================================
// PELUDOS LOS PEDROCHES – INICIALIZACIÓN SEGURA
// ========================================

document.addEventListener('DOMContentLoaded', async function() {

    if (typeof initBlogListeners === 'function') initBlogListeners();

    if (typeof loadSettings === 'function') {
        try { await loadSettings(); } catch (e) {}
    }

    if (typeof loadDogs === 'function') {
        try { await loadDogs(); } catch (e) {}
    }

    if (typeof loadBlogPosts === 'function') {
        try { await loadBlogPosts(); } catch (e) {}
    }

    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initDropdownMobile === 'function') initDropdownMobile();

    if (typeof initNewsletter === 'function') initNewsletter();
    if (typeof initForms === 'function') initForms();

    if (typeof window.initScrollReveal === 'function') {
        window.initScrollReveal();
    } else {
        var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        for (var i = 0; i < reveals.length; i++) {
            reveals[i].classList.add('visible');
        }
    }

    var selectedDog = localStorage.getItem('selectedDog');
    if (selectedDog) {
        var select = document.querySelector('select[name="perro"]');
        if (select) {
            var opt = Array.from(select.options).find(o => o.value === selectedDog);
            if (opt) opt.selected = true;
        }
        localStorage.removeItem('selectedDog');
    }

    var sizeFilter = document.getElementById('sizeFilter');
    var ageFilter = document.getElementById('ageFilter');
    var genderFilter = document.getElementById('genderFilter');
    var searchInput = document.getElementById('searchDog');

    if (sizeFilter || ageFilter || genderFilter || searchInput) {
        function applyFilters() {
            var filters = {};
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
});
