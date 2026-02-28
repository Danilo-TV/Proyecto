import { getPortfolioItems } from './apiService.js';
import { CartService } from './services/cartService.js';

document.addEventListener('DOMContentLoaded', async () => {

    const galleryContainer = document.getElementById('portfolio-gallery-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    let portfolioData = []; // Almacenar los datos de los proyectos para un acceso fácil

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
            const imageUrl = item.imagen_despues;
            const price = parseFloat(String(item.precio).replace(/[^0-9.-]+/g, ""));

            const portfolioCardHTML = `
                <article class="blog-card" data-aos="fade-up">
                    <img src="${imageUrl}" alt="${item.titulo}" class="blog-card-image" loading="lazy">
                    <div class="blog-card-content">
                        <h3>${item.titulo}</h3>
                        <p class="post-excerpt">${item.descripcion}</p>
                        <a href="project-detail.html?id=${item.id}" class="read-more-btn">Ver Caso de Estudio &rarr;</a>
                        
                        <div class="card-actions-footer">
                             <span class="item-price">€${price.toFixed(2)}</span>
                             <button class="btn btn-primary btn-add-to-cart" data-item-id="${item.id}">Añadir al Carrito</button>
                        </div>
                    </div>
                </article>
            `;
            galleryContainer.innerHTML += portfolioCardHTML;
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

    // === MANEJO DE EVENTOS ===
    if (galleryContainer) {
        galleryContainer.addEventListener('click', e => {
            const addToCartButton = e.target.closest('.btn-add-to-cart');
            if (!addToCartButton) return;

            e.preventDefault();
            const itemId = parseInt(addToCartButton.dataset.itemId, 10);
            const itemToAdd = portfolioData.find(item => item.id === itemId);

            if (itemToAdd) {
                CartService.addItem(itemToAdd, 1);
                
                // Feedback visual para el usuario
                addToCartButton.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
                addToCartButton.disabled = true;
                addToCartButton.style.opacity = '0.8';

                setTimeout(() => {
                    addToCartButton.innerHTML = 'Añadir al Carrito';
                    addToCartButton.disabled = false;
                    addToCartButton.style.opacity = '1';
                }, 2000);
            }
        });
    }


    // === FLUJO PRINCIPAL ===
    if (loadingIndicator) loadingIndicator.style.display = 'block';

    const { data: fetchedItems, error } = await getPortfolioItems();

    if (loadingIndicator) loadingIndicator.style.display = 'none';

    if (error) {
        renderError('No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo más tarde.');
    } else if (fetchedItems) {
        portfolioData = fetchedItems; // Guardar datos en la variable local
        renderPortfolioItems(portfolioData);
    }
});
