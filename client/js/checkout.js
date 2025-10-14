document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // DATOS DE EJEMPLO (REUTILIZADOS)
    // ===================================================================
    const projectsData = [
        { id: 1, titulo: "Plataforma de E-learning Interactiva", imagen_principal: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=100&auto=format&fit=crop", precio: "4,999" },
        { id: 2, titulo: "Dashboard de Análisis de Datos", imagen_principal: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=100&auto=format&fit=crop", precio: "3,500" },
        { id: 4, titulo: "Sitio Web E-commerce de Moda", imagen_principal: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=100&auto=format&fit=crop", precio: "5,500" },
        // Los datos deben ser consistentes a través de los archivos JS.
    ];

    const summaryContainer = document.getElementById('summary-container');
    const paymentForm = document.getElementById('payment-form');
    const checkoutFormContainer = document.querySelector('.checkout-form');

    function renderOrderSummary() {
        if (!summaryContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = parseInt(urlParams.get('projectId'));
        const project = projectsData.find(p => p.id === projectId);

        if (!project) {
            summaryContainer.innerHTML = '<p>No se pudo cargar el resumen de tu pedido.</p>';
            return;
        }

        const subtotal = parseFloat(project.precio.replace(',', ''));
        const tax = subtotal * 0.10; // 10% de impuestos
        const total = subtotal + tax;

        const summaryHTML = `
            <div class="summary-item">
                <img src="${project.imagen_principal}" alt="${project.titulo}" class="summary-item-image">
                <div class="summary-item-info">
                    <h3>${project.titulo}</h3>
                    <p>$${project.precio}</p>
                </div>
            </div>
            <div class="summary-total">
                 <div class="total-row">
                    <span>Total</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
        `;

        summaryContainer.innerHTML = summaryHTML;
    }

    function handlePaymentSimulation() {
        if (!paymentForm || !checkoutFormContainer) return;

        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenimos el envío real del formulario

            // Creamos el mensaje de confirmación
            const confirmationHTML = `
                <div class="confirmation-message" style="display: block;" data-aos="zoom-in">
                    <i class="fas fa-check-circle"></i>
                    <h2>¡Gracias por tu compra!</h2>
                    <p>Hemos recibido tu pedido y pronto nos pondremos en contacto contigo para discutir los siguientes pasos.</p>
                    <a href="index.html" class="cta-button">Volver al Inicio</a>
                </div>
            `;

            // Reemplazamos el formulario con el mensaje
            checkoutFormContainer.innerHTML = confirmationHTML;

            // Disparar animación de AOS para el nuevo contenido
            AOS.refresh(); 
        });
    }

    renderOrderSummary();
    handlePaymentSimulation();

});
