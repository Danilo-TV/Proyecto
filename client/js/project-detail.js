document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    const projectContainer = document.getElementById('project-container');
    const template = document.getElementById('project-detail-template');

    // Obtiene el SLUG del proyecto desde la URL, no el ID.
    const getProjectSlug = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    };

    // Muestra un mensaje de error estandarizado en el contenedor principal.
    const displayError = (message) => {
        if (projectContainer) {
            projectContainer.innerHTML = `<p class="form-input-soft">${message}</p>`;
        }
    };

    // Formatea la fecha a un formato legible.
    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        return new Date(dateString).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    };

    /**
     * Renderiza los datos del proyecto usando el template y los nuevos campos de la API.
     */
    const renderProject = (project) => {
        if (!template) {
            displayError("Error crítico: La plantilla del proyecto no se encuentra en el DOM.");
            return;
        }

        // Actualiza el SEO de la página
        document.title = `${project.title} - LuxeConvert`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', project.excerpt || `Detalles de la transformación ${project.title}.`);
        }

        const clone = template.content.cloneNode(true);

        // Poblar datos usando los nuevos nombres de campo de la API
        clone.getElementById('project-title').textContent = project.title || 'Título no disponible';
        clone.getElementById('project-date').textContent = `Realizado en: ${formatDate(project.completed_date)}`;
        clone.getElementById('project-description').innerHTML = project.description ? project.description.replace(/\n/g, '<br>') : 'Descripción no disponible.';
        clone.getElementById('project-img-antes').src = project.before_image_url || '';
        clone.getElementById('project-img-despues').src = project.after_image_url || '';

        if (projectContainer) {
            projectContainer.innerHTML = ''; // Limpiar mensaje de "cargando..."
            projectContainer.appendChild(clone);

            // Re-inicializa AOS para que detecte el contenido cargado dinámicamente
            if (window.AOS) {
                AOS.refresh();
            }
        } 
    };

    /**
     * Función principal para obtener y renderizar el proyecto por su slug.
     */
    const main = async () => {
        const projectSlug = getProjectSlug();

        if (!projectSlug) {
            displayError('No se ha especificado un proyecto. Por favor, selecciona uno del portafolio.');
            return;
        }

        try {
            // Llama al nuevo endpoint de la API con el slug
            const response = await fetch(`${API_BASE_URL}/portfolio/projects/${projectSlug}/`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('La transformación que buscas no existe.');
                } else {
                    throw new Error(`Error del servidor: ${response.status}`);
                }
            }

            const project = await response.json();
            renderProject(project);

        } catch (error) {
            console.error('Error al obtener los detalles del proyecto:', error);
            displayError(`No se pudo cargar la transformación. Motivo: ${error.message}`);
        }
    };

    // --- INICIALIZACIÓN ---
    main();
});
