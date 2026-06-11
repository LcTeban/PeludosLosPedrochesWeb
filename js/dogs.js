// ========================================
// PELUDOS LOS PEDROCHES – PERROS
// ========================================

async function loadDogs() {
    try {
        const { data, error } = await supabaseClient.from('dogs').select('*').order('id', { ascending: false });
        if (error) throw error;
        dogs = data || [];
        
        if (dogs.length === 0) {
            renderEmptyState('featuredDogs', 'Pronto tendremos peludos buscando hogar.');
            renderEmptyState('dogsList', 'No hay perros disponibles en este momento.');
            renderEmptyState('sponsorDogs', 'No hay perros disponibles para apadrinar.');
            return;
        }

        renderFeaturedDogs();
        renderDogsList();
        renderSponsorDogs();
        fillAdoptionSelect();
    } catch (err) {
        console.error('Error cargando perros:', err);
        renderErrorState('featuredDogs');
        renderErrorState('dogsList');
    }
}

function renderEmptyState(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:var(--gray); padding:40px;">${message}</p>`;
    }
}

function renderErrorState(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:var(--primary); padding:40px;"><i class="fas fa-exclamation-triangle"></i> Error al cargar los peludos. Por favor, recarga la página.</p>`;
    }
}

function renderFeaturedDogs() {
    const container = document.getElementById('featuredDogs');
    if (!container) return;
    const dogsToShow = dogs.filter(d => d.badge).length >= 3 ? dogs.filter(d => d.badge).slice(0, 3) : dogs.slice(0, 3);
    container.innerHTML = dogsToShow.map(dog => createDogCard(dog)).join('');
}

let currentPage = 1;
let perPage = 6;
let currentFilters = {};

// Función helper para parsear la edad y poder filtrar correctamente
function parseAgeToYears(ageStr) {
    if (!ageStr) return 99;
    const lower = ageStr.toLowerCase();
    if (lower.includes('mes') || lower.includes('month')) {
        const num = parseInt(lower) || 0;
        return num / 12;
    }
    if (lower.includes('año') || lower.includes('year') || lower.includes('senior')) {
        const num = parseInt(lower) || 99;
        return num;
    }
    return 99;
}

function renderDogsList(filter = {}, page = 1) {
    const container = document.getElementById('dogsList');
    if (!container) return;
    currentFilters = filter;
    currentPage = page;
    
    let filtered = dogs.filter(d => d.status !== 'Adoptado');
    
    if (filter.size) filtered = filtered.filter(d => d.size?.toLowerCase().includes(filter.size));
    if (filter.gender) filtered = filtered.filter(d => d.gender?.toLowerCase() === filter.gender);
    if (filter.search) filtered = filtered.filter(d => d.name?.toLowerCase().includes(filter.search.toLowerCase()) || d.breed?.toLowerCase().includes(filter.search.toLowerCase()));
    
    // Filtro de edad
    if (filter.age) {
        filtered = filtered.filter(d => {
            const ageYears = parseAgeToYears(d.age);
            if (filter.age === 'cachorro') return ageYears < 1;
            if (filter.age === 'adulto') return ageYears >= 1 && ageYears <= 7;
            if (filter.age === 'senior') return ageYears > 7;
            return true;
        });
    }

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:var(--gray); padding:40px;">No hay perros que coincidan con esos filtros.</p>`;
        renderPagination(0);
        return;
    }

    const totalPages = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    const paginatedDogs = filtered.slice(start, start + perPage);
    container.innerHTML = paginatedDogs.map(dog => createDogCard(dog)).join('');
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagContainer = document.getElementById('pagination');
    if (!pagContainer) return;
    if (totalPages <= 1) { pagContainer.innerHTML = ''; return; }
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    pagContainer.innerHTML = html;
}

function goToPage(page) {
    renderDogsList(currentFilters, page);
    document.getElementById('dogsList')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderSponsorDogs() {
    const container = document.getElementById('sponsorDogs');
    if (!container) return;
    const available = dogs.filter(d => d.status !== 'Adoptado').slice(0, 3);
    container.innerHTML = available.map(dog => createDogCard(dog)).join('');
}

function fillAdoptionSelect() {
    const select = document.querySelector('select[name="perro"]');
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona un perro</option>';
    dogs.filter(d => d.status !== 'Adoptado').forEach(dog => {
        const option = document.createElement('option');
        option.value = dog.name;
        option.textContent = dog.name;
        select.appendChild(option);
    });
}

function createDogCard(dog) {
    const firstImage = (dog.images && dog.images.length > 0) ? dog.images[0] : dog.image_url;
    const imageHtml = firstImage 
        ? `<img src="${firstImage}" alt="${dog.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">` 
        : `<div class="placeholder-image">🐕</div>`;
    
    // ¡Mejora! Pasamos el nombre del perro por URL para que el formulario lo seleccione
    const adoptUrl = `/pages/adopta.html?perro=${encodeURIComponent(dog.name)}#formulario`;

    return `
        <div class="dog-card fade-in" onclick="openDogModal(${dog.id})" style="cursor:pointer;">
            <div class="dog-image">
               ${imageHtml}
               ${dog.badge ? `<span class="dog-badge">${dog.badge}</span>` : ''}
            </div>
            <div class="dog-info">
                <h3 class="dog-name">${dog.name}</h3>
                <div class="dog-details">
                    <span><i class="fas fa-paw"></i> ${dog.breed}</span>
                    <span><i class="fas fa-calendar"></i> ${dog.age}</span>
                    <span><i class="fas fa-${dog.gender === 'Macho' ? 'mars' : 'venus'}"></i> ${dog.gender}</span>
                </div>
                <p class="dog-description">${dog.description}</p>
                <a href="${adoptUrl}" class="btn-adopt" onclick="event.stopPropagation(); setSelectedDog('${dog.name}');">Quiero adoptar</a>
            </div>
        </div>
   `;
}

// ========================================
// MODAL DE PERRO (CON CARRUSEL Y LIGHTBOX)
// ========================================
function openDogModal(dogId) {
    const dog = dogs.find(d => d.id === dogId);
    if (!dog) return;

    const images = (dog.images && dog.images.length > 0) ? dog.images : (dog.image_url ? [dog.image_url] : []);
    currentDogImages = images;
    currentImageIndex = 0;

    let modal = document.getElementById('dogModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dogModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2 id="dogModalTitle"></h2>
                    <button class="modal-close" onclick="closeDogModal()">&times;</button>
                </div>
                <div class="modal-body" id="dogModalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) { if (e.target === modal) closeDogModal(); });
    }

    renderDogModalBody(dog);
    modal.classList.add('active');
}

function renderDogModalBody(dog) {
    const body = document.getElementById('dogModalBody');
    const titleEl = document.getElementById('dogModalTitle');
    titleEl.textContent = dog.name;

    let carouselHtml = '';
    if (currentDogImages.length > 0) {
        carouselHtml = `
            <div style="position: relative; width: 100%; max-height: 400px; overflow: hidden; margin-bottom: 20px; text-align: center;">
                <img id="dogCarouselImage" src="${currentDogImages[currentImageIndex]}" 
                    style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 10px; cursor: pointer;" 
                    onclick="openLightbox(document.getElementById('dogCarouselImage').src)">
               ${currentDogImages.length > 1 ? `
                    <button onclick="prevImage()" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; font-size:20px;">‹</button>
                    <button onclick="nextImage()" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; font-size:20px;">›</button>
                    <div style="margin-top:10px;">
                       ${currentDogImages.map((_, i) => `<span style="display:inline-block; width:10px; height:10px; background:${i === currentImageIndex ? '#e04f2e' : '#ccc'}; border-radius:50%; margin:0 3px;"></span>`).join('')}
                    </div>
               ` : ''}
            </div>
        `;
    } else {
        carouselHtml = '<div class="placeholder-image" style="height:250px;">🐕</div>';
    }

    const adoptUrl = `/pages/adopta.html?perro=${encodeURIComponent(dog.name)}#formulario`;

    body.innerHTML = `
       ${carouselHtml}
        <div class="dog-details" style="margin-bottom:15px;">
            <span><i class="fas fa-paw"></i> ${dog.breed}</span>
            <span><i class="fas fa-calendar"></i> ${dog.age}</span>
            <span><i class="fas fa-${dog.gender === 'Macho' ? 'mars' : 'venus'}"></i> ${dog.gender}</span>
            <span><i class="fas fa-ruler"></i> ${dog.size}</span>
        </div>
        <p style="margin-bottom:20px;">${dog.description}</p>
        <button class="btn btn-primary" style="display:block; width:100%; text-align:center;" onclick="adoptFromModal('${dog.name}')">¡Quiero adoptar a ${dog.name}!</button>
   `;
}

function adoptFromModal(dogName) {
    closeDogModal();
    setSelectedDog(dogName);
    window.location.href = `/pages/adopta.html?perro=${encodeURIComponent(dogName)}#formulario`;
}

function prevImage() {
    if (currentDogImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentDogImages.length) % currentDogImages.length;
    document.getElementById('dogCarouselImage').src = currentDogImages[currentImageIndex];
    updateCarouselIndicators();
}

function nextImage() {
    if (currentDogImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentDogImages.length;
    document.getElementById('dogCarouselImage').src = currentDogImages[currentImageIndex];
    updateCarouselIndicators();
}

function updateCarouselIndicators() {
    const dots = document.querySelectorAll('#dogModal .modal-body span[style*="border-radius:50%"]');
    dots.forEach((dot, i) => { dot.style.background = i === currentImageIndex ? '#e04f2e' : '#ccc'; });
}

function openLightbox(url) {
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.style.cssText = 'display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:3000; align-items:center; justify-content:center; cursor:zoom-out;';
        lightbox.innerHTML = `
            <img id="lightboxImg" style="max-width:90%; max-height:90%; object-fit:contain; border-radius:10px;">
            <button id="lightboxClose" style="position:absolute; top:20px; right:30px; background:white; color:black; border:none; border-radius:50%; width:40px; height:40px; cursor:pointer; font-size:24px;">&times;</button>
        `;
        document.body.appendChild(lightbox);
        lightbox.addEventListener('click', function(e) { if (e.target === lightbox || e.target === lightbox.querySelector('img')) closeLightbox(); });
        lightbox.querySelector('#lightboxClose').addEventListener('click', closeLightbox);
    }
    document.getElementById('lightboxImg').src = url;
    lightbox.style.display = 'flex';
}

function closeLightbox() { const lightbox = document.getElementById('lightbox'); if (lightbox) lightbox.style.display = 'none'; }
function closeDogModal() { const modal = document.getElementById('dogModal'); if (modal) modal.classList.remove('active'); }

// Exponer globalmente
window.openDogModal = openDogModal;
window.closeDogModal = closeDogModal;
window.adoptFromModal = adoptFromModal;
window.prevImage = prevImage;
window.nextImage = nextImage;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.goToPage = goToPage;
