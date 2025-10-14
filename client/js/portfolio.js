document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // DATOS COMPLETOS DEL PORTAFOLIO
    // Estos son los mismos datos que se usarán en la página de detalle.
    // ===================================================================
    const portfolioItems = [
        {
            id: 1,
            titulo: "Plataforma de E-learning Interactiva",
            descripcion: "Desarrollo de una plataforma web completa para cursos online, con seguimiento de progreso y gamificación.",
            imagen_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
            tags: ["React", "Node.js", "MongoDB"]
        },
        {
            id: 2,
            titulo: "Dashboard de Análisis de Datos",
            descripcion: "Creación de un panel de control en tiempo real para visualizar métricas de negocio críticas usando D3.js y React.",
            imagen_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
            tags: ["React", "D3.js", "Firebase"]
        },
        {
            id: 3,
            titulo: "Aplicación Móvil de Red Social",
            descripcion: "Diseño y desarrollo de una app móvil híbrida para una comunidad de nicho, enfocada en la experiencia de usuario.",
            imagen_url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop",
            tags: ["React Native", "GraphQL", "PostgreSQL"]
        },
        {
            id: 4,
            titulo: "Sitio Web E-commerce de Moda",
            descripcion: "Tienda online con un diseño moderno, pasarela de pago integrada con Stripe y gestión de inventario.",
            imagen_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
            tags: ["Vue.js", "Stripe", "Django"]
        },
        {
            id: 5,
            titulo: "Herramienta de Visualización de Algoritmos",
            descripcion: "Una aplicación web educativa que permite a los estudiantes visualizar el funcionamiento de algoritmos clásicos paso a paso.",
            imagen_url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
            tags: ["JavaScript", "HTML5 Canvas", "CSS"]
        },
        {
            id: 6,
            titulo: "Blog Personal con CMS Propio",
            descripcion: "Creación de un blog desde cero con un panel de administración a medida para gestionar el contenido.",
            imagen_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
            tags: ["PHP", "Laravel", "MySQL"]
        }
    ];

    const galleryContainer = document.getElementById('portfolio-gallery-container');

    function renderPortfolioItems() {
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '';

        if (portfolioItems.length === 0) {
            galleryContainer.innerHTML = '<p>No hay proyectos para mostrar en este momento.</p>';
            return;
        }

        portfolioItems.forEach(item => {
            // El enlace ahora apunta a la página de detalle con el ID del proyecto.
            const portfolioCard = `
                <article class="blog-card" data-aos="fade-up">
                    <img src="${item.imagen_url}" alt="${item.titulo}" class="blog-card-image" loading="lazy">
                    <div class="blog-card-content">
                        <h3>${item.titulo}</h3>
                        <p class="post-excerpt">${item.descripcion}</p>
                        <a href="project-detail.html?id=${item.id}" class="read-more-btn">Ver Detalles &rarr;</a>
                    </div>
                </article>
            `;
            galleryContainer.innerHTML += portfolioCard;
        });
    }

    renderPortfolioItems();
});
