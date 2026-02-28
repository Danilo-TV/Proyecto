document.addEventListener('DOMContentLoaded', () => {
    const orderIdElement = document.getElementById('order-id');

    if (orderIdElement) {
        const orderId = localStorage.getItem('LuxeOrderConfirmationId');

        if (orderId) {
            orderIdElement.textContent = orderId;
            // Opcional: limpiar el ID de localStorage después de mostrarlo para no volver a verlo si se recarga la página.
            // localStorage.removeItem('LuxeOrderConfirmationId'); 
        } else {
            orderIdElement.textContent = 'N/A';
        }
    }
});
