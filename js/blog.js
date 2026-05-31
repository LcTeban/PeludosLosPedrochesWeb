// ========================================
// PELUDOS LOS PEDROCHES – BLOG
// ========================================

function initBlogListeners() {
    let modal = document.getElementById('blogModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'blogModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header"><h2 id="modalTitle"></h2><button class="modal-close" onclick="closeBlogModal()">&times;</button></div>
                <div class="modal-body" id="modalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) { if (e.target === modal) closeBlogModal(); });
    }
    document.body.addEventListener('click', function(e) {
        const card = e.target.closest('.blog-card');
        if (card) { const postId = parseInt(card.dataset.id); openBlogModal(postId); }
    });
}

async function loadBlogPosts() {
    try {
        const { data, error } = await supabaseClient.from('blog_posts').select('*').eq('status', 'Publicado').order('id', { ascending: false });
        if (error) throw error;
        blogPosts = data || [];
        renderBlogPreview();
        renderAllBlogPosts();
    } catch (err) { blogPosts = []; renderBlogPreview(); renderAllBlogPosts(); }
}

function renderBlogPreview() {
    const container = document.getElementById('blogPreview');
    if (!container) return;
    const postsToShow = blogPosts.slice(0, 3);
    container.innerHTML = postsToShow.map(post => createBlogCard(post)).join('');
}

function renderAllBlogPosts() {
    const container = document.getElementById('allBlogPosts');
    if (!container) return;
    if (blogPosts.length === 0) { container.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No hay entradas publicadas aún.</p>'; return; }
    container.innerHTML = blogPosts.map(post => createBlogCard(post)).join('');
}

function createBlogCard(post) {
    const imageHtml = post.image_url 
        ? `<div class="blog-image-wrapper"><img src="${post.image_url}" alt="${post.title}" loading="lazy" onclick="event.stopPropagation(); openLightbox('${post.image_url}');"></div>` 
        : '<div class="blog-image-wrapper"><div class="placeholder-image">📰</div></div>';
    const date = post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    return `
        <article class="blog-card fade-in" data-id="${post.id}">
            ${imageHtml}
            <div class="blog-content">
                <div class="blog-date"><i class="far fa-calendar"></i> ${date}</div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <span class="card-link">Leer más <i class="fas fa-arrow-right"></i></span>
            </div>
        </article>
    `;
}

function openBlogModal(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    let modal = document.getElementById('blogModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'blogModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header"><h2 id="modalTitle"></h2><button class="modal-close" onclick="closeBlogModal()">&times;</button></div>
                <div class="modal-body" id="modalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) { if (e.target === modal) closeBlogModal(); });
    }
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    if (!titleEl || !bodyEl) return;
    const date = post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    titleEl.textContent = post.title;
    bodyEl.innerHTML = `
        ${post.image_url ? `<div class="blog-modal-image" onclick="openLightbox('${post.image_url}')"><img src="${post.image_url}" alt="${post.title}" loading="lazy"></div>` : ''}
        <div class="blog-modal-date"><i class="far fa-calendar"></i> ${date}</div>
        <div class="blog-modal-text">${post.content || post.excerpt}</div>
    `;
    modal.classList.add('active');
}

function closeBlogModal() { const modal = document.getElementById('blogModal'); if (modal) modal.classList.remove('active'); }

// Exponer globalmente
window.openBlogModal = openBlogModal;
window.closeBlogModal = closeBlogModal;
window.closeModal = closeBlogModal;
