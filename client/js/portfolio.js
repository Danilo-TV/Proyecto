import { getPortfolioItems } from './apiService.js';

document.addEventListener('DOMContentLoaded', async () => {

    const galleryContainer = document.getElementById('portfolio-gallery-container');
    const loadingIndicator = document.getElementById('loading-indicator');

    /**
     * Renderiza los ítems del portafolio en el contenedor de la galería.
     * @param {Array} items - Un array de objetos de ítems del portafolio.
     */
    function renderPortfolioItems(items) {
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '';

        if (items.length === 0) {
            galleryContainer.innerHTML = '<p class="text-center">No hay proyectos para mostrar en este momento.</p>';
            return;
        }

        items.forEach(item => {
            // CORRECCIÓN: El modelo ItemPortafolio usa `imagen_despues`. 
            // Usaremos esta imagen para la vista previa en la galería.
            const imageUrl = item.imagen_despues;
            
            const portfolioCard = `
                <article class="blog-card" data-aos="fade-up">
                    <img src="${imageUrl}" alt="${item.titulo}" class="blog-card-image" loading="lazy">
                    <div class="blog-card-content">
                        <h3>${item.titulo}</h3>
                        <p class="post-excerpt">${item.descripcion}</p>
                        <a href="project-detail.html?id=${item.id}" class="read-more-btn">Ver Caso de Estudio &rarr;</a>
                    </div>
                </article>
            `;
            galleryContainer.innerHTML += portfolioCard;
        });
    }

    /**
     * Muestra un mensaje de error en la UI.
     * @param {string} message - El mensaje de error a mostrar.
     */
    function renderError(message) {
        if (!galleryContainer) return;
        galleryContainer.innerHTML = `<div class="form-status form-status--error" style="display: block;">${message}</div>`;
    }

    // --- Flujo Principal ---
    if (loadingIndicator) loadingIndicator.style.display = 'block';

    const { data: portfolioItems, error } = await getPortfolioItems();

    if (loadingIndicator) loadingIndicator.style.display = 'none';

    if (error) {
        renderError('No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo más tarde.');
    } else if (portfolioItems) {
        renderPortfolioItems(portfolioItems);
    }
});
