import { getBlogPosts } from './apiService.js';

document.addEventListener('DOMContentLoaded', async () => {

    const postsContainer = document.getElementById('blog-posts-container');

    /**
     * Crea un extracto corto a partir del contenido completo de un post.
     * @param {string} content - El contenido HTML del post.
     * @param {number} length - La longitud máxima del extracto.
     * @returns {string} - Un extracto de texto plano.
     */
    function createExcerpt(content, length = 100) {
        // Eliminar etiquetas HTML para obtener texto plano
        const text = content.replace(/<[^>]*>/g, '');
        if (text.length <= length) {
            return text;
        }
        // Cortar y añadir elipsis
        return text.substring(0, length) + '...';
    }

    /**
     * Renderiza los posts del blog en el contenedor principal.
     * @param {Array} posts - Un array de objetos de post del blog.
     */
    function renderBlogPosts(posts) {
        if (!postsContainer) return;

        postsContainer.innerHTML = ''; // Limpiar mensaje de "Cargando..."

        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-center">No hay artículos disponibles en este momento.</p>';
            return;
        }

        posts.forEach(post => {
            const excerpt = createExcerpt(post.contenido, 120);
            const postDate = new Date(post.fecha_publicacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

            const postCardHTML = `
                <article class="blog-card" data-aos="fade-up">
                    <a href="post-detail.html?id=${post.id}" class="blog-card-image-link">
                        <img src="${post.imagen_principal}" alt="${post.titulo}" class="blog-card-image" loading="lazy">
                    </a>
                    <div class="blog-card-content">
                        <div class="blog-card-meta">
                            <span>Por ${post.autor_username || 'Admin'}</span> | <span>${postDate}</span>
                        </div>
                        <h3 class="blog-card-title">
                            <a href="post-detail.html?id=${post.id}">${post.titulo}</a>
                        </h3>
                        <p class="blog-card-excerpt">${excerpt}</p>
                        <a href="post-detail.html?id=${post.id}" class="read-more-btn">Leer más &rarr;</a>
                    </div>
                </article>
            `;
            postsContainer.innerHTML += postCardHTML;
        });
    }

    /**
     * Muestra un mensaje de error en la UI.
     * @param {string} message - El mensaje de error a mostrar.
     */
    function renderError(message) {
        if (postsContainer) {
            postsContainer.innerHTML = `<div class="form-status form-status--error" style="display: block;">${message}</div>`;
        }
    }

    // --- Flujo Principal ---
    const { data: blogPosts, error } = await getBlogPosts();

    if (error) {
        renderError('No se pudieron cargar los artículos. Por favor, inténtalo de nuevo más tarde.');
    } else {
        renderBlogPosts(blogPosts);
    }

    // Refrescar AOS para que las animaciones se apliquen a los nuevos elementos
    if (window.AOS) {
        AOS.init({
            once: true
        });
        AOS.refresh();
    }
});
