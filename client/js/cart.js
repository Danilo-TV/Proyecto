import { CartService } from './services/cartService.js';
import { getPortfolioItems } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores del DOM ---
    const loadingEl = document.getElementById('cart-loading');
    const emptyEl = document.getElementById('cart-empty');
    const itemsContainerEl = document.getElementById('cart-items-container');
    const summaryContainerEl = document.getElementById('cart-summary-container');
    const crossSellContainerEl = document.getElementById('cross-sell-container');
    const crossSellSectionEl = document.getElementById('cross-sell-section');

    const summarySubtotalEl = document.getElementById('summary-subtotal');
    const summaryDiscountEl = document.getElementById('summary-discount');
    const summaryTotalEl = document.getElementById('summary-total');

    let allPortfolioItems = []; // Cache para todos los items del portafolio

    const formatCurrency = (amount) => `€${amount.toFixed(2)}`;

    // ==================== LÓGICA DE VENTA CRUZADA (CROSS-SELL) ====================
    async function renderCrossSellItems() {
        if (!crossSellContainerEl) return;
        
        try {
            // Cargar items del portafolio si aún no se han cargado
            if (allPortfolioItems.length === 0) {
                const { data, error } = await getPortfolioItems();
                if (error) {
                    console.error("Error al cargar items para cross-selling:", error);
                    if (crossSellSectionEl) crossSellSectionEl.style.display = 'none';
                    return;
                }
                allPortfolioItems = data || [];
            }

            const cartItemIds = CartService.getCart().map(item => item.id);
            
            const suggestedItems = allPortfolioItems
                .filter(item => !cartItemIds.includes(item.id)) // Excluir items ya en el carrito
                .sort(() => 0.5 - Math.random()) // Mezclar aleatoriamente
                .slice(0, 3); // Tomar los primeros 3

            if (suggestedItems.length === 0) {
                if (crossSellSectionEl) crossSellSectionEl.style.display = 'none';
                return;
            }

            crossSellContainerEl.innerHTML = ''; // Limpiar sugerencias anteriores
            suggestedItems.forEach(item => {
                const price = parseFloat(String(item.precio).replace(/[^0-9.-]+/g,""));
                const card = `
                    <div class="blog-card blog-card--small">
                        <img src="${item.imagen_despues}" alt="${item.titulo}" class="blog-card-image" loading="lazy">
                        <div class="blog-card-content">
                            <h3>${item.titulo}</h3>
                            <div class="card-actions-footer">
                                <span class="item-price">${formatCurrency(price)}</span>
                                <button class="btn btn-primary btn-add-to-cart-cross" data-item-id="${item.id}">Añadir</button>
                            </div>
                        </div>
                    </div>
                `;
                crossSellContainerEl.innerHTML += card;
            });
            if (crossSellSectionEl) crossSellSectionEl.style.display = 'block';

        } catch (error) {
            console.error("Fallo en renderCrossSellItems:", error);
            if (crossSellSectionEl) crossSellSectionEl.style.display = 'none';
        }
    }

    // ==================== RENDERIZADO PRINCIPAL DE LA VISTA DEL CARRITO ====================
    function renderCartView() {
        const cartItems = CartService.getCart();
        
        if (loadingEl) loadingEl.style.display = 'none';

        if (cartItems.length === 0) {
            if (emptyEl) emptyEl.style.display = 'block';
            if (itemsContainerEl) itemsContainerEl.style.display = 'none';
            if (summaryContainerEl) summaryContainerEl.style.display = 'none';
            if (crossSellSectionEl) crossSellSectionEl.style.display = 'none';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';
        if (itemsContainerEl) itemsContainerEl.innerHTML = '';

        cartItems.forEach(item => {
            const price = parseFloat(String(item.precio).replace(/[^0-9.-]+/g,""));
            const article = document.createElement('article');
            article.className = 'cart-item';
            article.innerHTML = `
                <div class="cart-item__image">
                    <img src="${item.imagen_principal || item.imagen_despues || './img/placeholder.png'}" alt="${item.titulo}">
                </div>
                <div class="cart-item__details">
                    <h3 class="cart-item__title">${item.titulo}</h3>
                    <p class="cart-item__price">${formatCurrency(price)}</p>
                    <div class="cart-item__quantity">
                        <label for="qty-${item.id}">Cantidad:</label>
                        <input type="number" id="qty-${item.id}" class="form-input form-input-soft" value="${item.quantity}" min="1" data-item-id="${item.id}">
                    </div>
                </div>
                <div class="cart-item__actions">
                    <button class="btn-icon btn-remove-item" data-item-id="${item.id}" title="Eliminar item"><i class="fas fa-trash"></i></button>
                </div>
            `;
            if (itemsContainerEl) itemsContainerEl.appendChild(article);
        });

        const { subtotal, discount, total } = CartService.getTotals(cartItems);
        if (summarySubtotalEl) summarySubtotalEl.textContent = formatCurrency(subtotal);
        if (summaryDiscountEl) summaryDiscountEl.textContent = `-${formatCurrency(discount)}`;
        if (summaryTotalEl) summaryTotalEl.textContent = formatCurrency(total);

        if (itemsContainerEl) itemsContainerEl.style.display = 'block';
        if (summaryContainerEl) summaryContainerEl.style.display = 'block';
        
        renderCrossSellItems(); // Cargar productos para cross-selling
    }

    // ==================== MANEJO DE EVENTOS ====================
    function setupEventListeners() {
        // Eventos para los items del carrito (eliminar, cambiar cantidad)
        if (itemsContainerEl) {
            itemsContainerEl.addEventListener('click', (e) => {
                const removeButton = e.target.closest('.btn-remove-item');
                if (removeButton) {
                    const itemId = parseInt(removeButton.dataset.itemId);
                    CartService.removeItem(itemId);
                    // El evento 'cartUpdated' se encarga de re-renderizar
                }
            });

            itemsContainerEl.addEventListener('change', (e) => {
                const quantityInput = e.target.closest('input[type="number"]');
                if (quantityInput) {
                    const itemId = parseInt(quantityInput.dataset.itemId);
                    const newQuantity = parseInt(quantityInput.value, 10);
                    CartService.updateItemQuantity(itemId, newQuantity);
                    // El evento 'cartUpdated' se encarga de re-renderizar
                }
            });
        }

        // Eventos para la sección de cross-selling
        if (crossSellSectionEl) {
            crossSellSectionEl.addEventListener('click', e => {
                const addButton = e.target.closest('.btn-add-to-cart-cross');
                if (!addButton) return;

                const itemId = parseInt(addButton.dataset.itemId, 10);
                const itemToAdd = allPortfolioItems.find(item => item.id === itemId);
                if (itemToAdd) {
                    CartService.addItem(itemToAdd, 1);
                    // El evento 'cartUpdated' se encargará de re-renderizar todo.
                }
            });
        }
    }

    // ==================== INICIALIZACIÓN ====================
    setupEventListeners();
    renderCartView(); // Renderizado inicial

    // Escuchar actualizaciones globales del carrito
    window.addEventListener('cartUpdated', renderCartView);
});
