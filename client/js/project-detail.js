document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const projectContainer = document.getElementById('project-container');

    // Obtener el ID del proyecto desde la URL
    const getProjectId = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    const projectId = getProjectId();

    if (!projectId) {
        projectContainer.innerHTML = '<p>Error: No se ha especificado un ID de proyecto.</p>';
        return;
    }

    /**
     * Renderiza el contenido principal del proyecto.
     */
    const renderProject = (project) => {
        document.title = `${project.titulo} - Mi Portafolio`; // Actualizar el título de la página
        projectContainer.innerHTML = `
            <h1 class="project-title" data-aos="fade-up">${project.titulo}</h1>
            <p class="project-description" data-aos="fade-up" data-aos-delay="100">${project.descripcion}</p>
            
            <div class="project-images-container" data-aos="fade-up" data-aos-delay="200">
                <div class="image-comparison">
                    <div class="image-wrapper">
                        <h3>Antes</h3>
                        <img src="${project.imagen_antes}" alt="Imagen Antes del trabajo en ${project.titulo}">
                    </div>
                    <div class="image-wrapper">
                        <h3>Después</h3>
                        <img src="${project.imagen_despues}" alt="Imagen Después del trabajo en ${project.titulo}">
                    </div>
                </div>
            </div>
        `;
    };

    /**
     * Carga los datos del proyecto desde la API.
     */
    const loadProjectDetails = async () => {
        try {
            const response = await fetch(`/portafolio/items_portafolio/${projectId}/`);
            if (!response.ok) {
                throw new Error('El proyecto no fue encontrado o no se pudo cargar.');
            }
            const project = await response.json();
            renderProject(project);

        } catch (error) {
            console.error("Error al cargar los detalles del proyecto:", error);
            projectContainer.innerHTML = `<p style="text-align: center;">${error.message}</p>`;
        } finally {
            // Re-inicializar AOS después de cargar el contenido dinámico
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 800, once: true });
            }
        }
    };

    // --- INICIALIZACIÓN ---
    loadProjectDetails();
});
