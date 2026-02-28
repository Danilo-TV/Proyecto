import { CartService } from './services/cartService.js';
import { api } from './apiService.js'; // Importamos la instancia de apiService

document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores del DOM ---
    const summaryItemsContainerEl = document.getElementById('summary-items-container');
    const summarySubtotalEl = document.getElementById('summary-subtotal');
    const summaryDiscountEl = document.getElementById('summary-discount');
    const summaryTotalEl = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutButton = document.getElementById('checkout-button');
    const formStatusEl = document.getElementById('form-status');

    const formatCurrency = (amount) => `€${amount.toFixed(2)}`;

    function renderCheckoutSummary() {
        const cartItems = CartService.getCart();

        if (cartItems.length === 0) {
            // Si el carrito está vacío, redirigir al usuario al carrito para ver el mensaje de "vacío".
            window.location.href = '/cart.html';
            return;
        }

        if (summaryItemsContainerEl) summaryItemsContainerEl.innerHTML = '';

        cartItems.forEach(item => {
            const price = parseFloat(String(item.precio).replace(/[^0-9.-]+/g, ""));
            const itemEl = document.createElement('div');
            itemEl.className = 'summary-item';
            itemEl.innerHTML = `
                <span class="summary-item__title">${item.titulo} (x${item.quantity})</span>
                <span class="summary-item__price">${formatCurrency(price * item.quantity)}</span>
            `;
            if (summaryItemsContainerEl) summaryItemsContainerEl.appendChild(itemEl);
        });

        const { subtotal, discount, total } = CartService.getTotals(cartItems);
        if (summarySubtotalEl) summarySubtotalEl.textContent = formatCurrency(subtotal);
        if (summaryDiscountEl) summaryDiscountEl.textContent = `-${formatCurrency(discount)}`;
        if (summaryTotalEl) summaryTotalEl.textContent = formatCurrency(total);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (checkoutButton) {
            checkoutButton.disabled = true;
            checkoutButton.innerHTML = '<span class="spinner-sm"></span> Procesando...';
        }
        if (formStatusEl) formStatusEl.style.display = 'none';

        const formData = new FormData(checkoutForm);
        const cartItems = CartService.getCart();
        const { total } = CartService.getTotals(cartItems);

        const orderPayload = {
            cliente_nombre: formData.get('name'),
            cliente_email: formData.get('email'),
            // En un caso real, aquí iría el token de pago seguro (ej. de Stripe), no los datos de la tarjeta.
            // Esto es solo una simulación para el flujo.
            detalles_pago: {
                cardNumber: formData.get('card-number'), // NO HACER EN PRODUCCIÓN
                expiryDate: formData.get('expiry-date'), // NO HACER EN PRODUCCIÓN
                cvc: formData.get('cvc'),                // NO HACER EN PRODUCCIÓN
            },
            items: cartItems.map(item => ({
                producto_id: item.id,
                cantidad: item.quantity,
                precio_unitario: parseFloat(String(item.precio).replace(/[^0-9.-]+/g, ""))
            })),
            monto_total: total
        };

        try {
            // Usamos el apiService para llamar al endpoint de la API
            const response = await api.post('/api/ecommerce/crear-pedido/', orderPayload);
            
            if (response && (response.status === 201 || response.status === 200)) {
                // Éxito
                CartService.clearCart();
                // Guardar ID de pedido para mostrarlo en la página de confirmación
                localStorage.setItem('LuxeOrderConfirmationId', response.data.pedido_id);
                window.location.href = '/confirmation.html'; 
            } else {
                throw new Error(response.data.error || 'El servidor devolvió una respuesta inesperada.');
            }

        } catch (error) {
            console.error("Error al crear el pedido:", error);
            if (formStatusEl) {
                formStatusEl.textContent = `Error: ${error.message || 'No se pudo procesar el pedido. Por favor, intente de nuevo.'}`;
                formStatusEl.style.display = 'block';
            }
            if (checkoutButton) {
                checkoutButton.disabled = false;
                checkoutButton.textContent = 'Confirmar y Pagar';
            }
        }
    }

    // --- Inicialización ---
    renderCheckoutSummary();

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleFormSubmit);
    }
});
