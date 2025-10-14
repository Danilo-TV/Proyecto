document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // DATOS DE EJEMPLO AMPLIADOS PARA LOS PROYECTOS
    // En una aplicación real, esto vendría de una base de datos o una API.
    // ===================================================================
    const projectsData = [
        {
            id: 1,
            titulo: "Plataforma de E-learning Interactiva",
            subtitulo: "Una solución completa para la educación online con gamificación.",
            descripcion_larga: `
                <p>Este proyecto representó el desafío de construir una plataforma de e-learning desde cero, diseñada para ser altamente interactiva y atractiva para los estudiantes. La meta era crear una experiencia de aprendizaje que fuera más allá de los videos tradicionales.</p>
                <p>Se implementó un sistema de seguimiento de progreso en tiempo real, quizzes interactivos después de cada módulo, y un sistema de recompensas basado en puntos y medallas para fomentar la participación (gamificación). La arquitectura se basó en un backend robusto con Node.js y una base de datos MongoDB para escalar eficientemente, mientras que el frontend se construyó con React para una interfaz de usuario rápida y reactiva.</p>
            `,
            imagen_principal: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
            galeria: [
                "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1588702547919-26089e690ecc?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop"
            ],
            tags: ["React", "Node.js", "MongoDB", "Gamificación"],
            precio: "4,999",
            url_compra: "cart.html" // Placeholder para el flujo de e-commerce
        },
        {
            id: 2,
            titulo: "Dashboard de Análisis de Datos",
            subtitulo: "Visualización de métricas de negocio en tiempo real.",
            descripcion_larga: "<p>Creación de un panel de control personalizado para una empresa de logística, permitiendo la visualización en tiempo real de métricas clave como la ubicación de la flota, tiempos de entrega y eficiencia de rutas. La herramienta se desarrolló utilizando D3.js para gráficos complejos y React para una interfaz modular y de alto rendimiento, conectada a una base de datos Firebase Realtime.</p>",
            imagen_principal: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
            galeria: [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop"
            ],
            tags: ["React", "D3.js", "Firebase", "GIS"],
            precio: "3,500",
            url_compra: "cart.html"
        },
        // Añadir más proyectos detallados si es necesario...
    ];

    const projectContainer = document.getElementById('project-container');

    function renderProjectDetails() {
        if (!projectContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = parseInt(urlParams.get('id'));
        const project = projectsData.find(p => p.id === projectId);

        if (!project) {
            projectContainer.innerHTML = '<p style="text-align: center;">No se encontró el proyecto. Por favor, <a href="portfolio.html">vuelve al portafolio</a>.</p>';
            return;
        }

        // Cambiar el título de la página
        document.title = `${project.titulo} - Mi Portafolio`;

        // Construir el HTML dinámicamente
        const projectHTML = `
            <header class="project-header" data-aos="fade-up">
                <h1 class="project-title">${project.titulo}</h1>
                <p class="project-subtitle">${project.subtitulo}</p>
            </header>

            <section class="project-gallery" data-aos="fade-up" data-aos-delay="100">
                <img src="${project.imagen_principal}" alt="Imagen principal de ${project.titulo}" id="main-gallery-image" class="gallery-main-image">
                <div class="gallery-thumbnails" id="gallery-thumbnails">
                    ${project.galeria.map((img, index) => `
                        <img src="${img}" alt="Miniatura ${index + 1}" class="${index === 0 ? 'active' : ''}" data-src="${img}">
                    `).join('')}
                </div>
            </section>

            <div class="project-content-grid" data-aos="fade-up" data-aos-delay="200">
                <section class="project-description">
                    <h3>Acerca del Proyecto</h3>
                    ${project.descripcion_larga}
                </section>

                <aside class="project-sidebar">
                    <div class="info-block">
                        <h4>Tecnologías Utilizadas</h4>
                        <div class="tech-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="ecommerce-block">
                        <div class="price">$${project.precio}</div>
                        <p class="price-note">Precio base del servicio/producto</p>
                        <a href="${project.url_compra}?projectId=${project.id}" class="cta-button buy-button">Adquirir Servicio</a>
                    </div>
                </aside>
            </div>
        `;

        projectContainer.innerHTML = projectHTML;

        addGalleryListeners();
    }

    function addGalleryListeners() {
        const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
        const mainImage = document.getElementById('main-gallery-image');

        if (!mainImage || thumbnails.length === 0) return;

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Actualizar imagen principal
                mainImage.src = thumb.dataset.src;

                // Actualizar clase activa
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }

    renderProjectDetails();

});
