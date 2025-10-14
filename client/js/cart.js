document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // DATOS DE EJEMPLO (REUTILIZADOS)
    // En una aplicación real, no duplicaríamos estos datos.
    // Lo ideal sería tener una fuente única (ej. un JSON o una API).
    // ===================================================================
    const projectsData = [
        { id: 1, titulo: "Plataforma de E-learning Interactiva", imagen_principal: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=200&auto=format&fit=crop", precio: "4,999" },
        { id: 2, titulo: "Dashboard de Análisis de Datos", imagen_principal: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=200&auto=format&fit=crop", precio: "3,500" },
        { id: 3, titulo: "Aplicación Móvil de Red Social", imagen_principal: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=200&auto=format&fit=crop", precio: "6,200" },
        { id: 4, titulo: "Sitio Web E-commerce de Moda", imagen_principal: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200&auto=format&fit=crop", precio: "5,500" },
        // Añadir los demás proyectos si se quiere que todos se puedan comprar
    ];

    const cartContainer = document.getElementById('cart-container');

    function renderCart() {
        if (!cartContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = parseInt(urlParams.get('projectId'));
        const project = projectsData.find(p => p.id === projectId);

        if (!project) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>Parece que no has añadido ningún servicio. ¡Explora nuestro portafolio!</p>
                    <a href="portfolio.html" class="cta-button">Ver Proyectos</a>
                </div>
            `;
            return;
        }

        // Asumimos un subtotal y total simples ya que solo hay un item.
        const subtotal = parseFloat(project.precio.replace(',', ''));
        const tax = subtotal * 0.10; // Ejemplo de un 10% de impuestos
        const total = subtotal + tax;

        const cartHTML = `
            <div class="cart-item">
                <img src="${project.imagen_principal}" alt="${project.titulo}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3>${project.titulo}</h3>
                    <p>Servicio de desarrollo personalizado</p>
                </div>
                <div class="cart-item-price">$${project.precio}</div>
            </div>

            <div class="cart-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Impuestos (10%):</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <strong>Total:</strong>
                    <strong>$${total.toFixed(2)}</strong>
                </div>
            </div>

            <div class="checkout-actions">
                <a href="portfolio.html" class="continue-shopping-btn">&larr; Seguir explorando</a>
                <a href="checkout.html?projectId=${project.id}" class="proceed-to-checkout-btn">Proceder al Pago</a>
            </div>
        `;

        cartContainer.innerHTML = cartHTML;
    }

    renderCart();
});
