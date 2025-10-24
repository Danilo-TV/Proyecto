import { getPortfolioItemDetails } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {

    const projectContainer = document.getElementById('project-container');
    const template = document.getElementById('project-detail-template');

    const getProjectId = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    const displayError = (message) => {
        if (projectContainer) {
            projectContainer.innerHTML = `<div class="form-status form-status--error" style="display: block; margin-top: 2rem;">${message}</div>`;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    /**
     * Renderiza los datos del proyecto usando el template y el modelo ItemPortafolio.
     */
    const renderProject = (project) => {
        if (!template) {
            displayError("Error crítico: La plantilla del proyecto no se encuentra en el DOM.");
            return;
        }

        document.title = `${project.titulo} - LuxeConvert`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', project.descripcion || `Detalles de la transformación ${project.titulo}.`);
        }

        const clone = template.content.cloneNode(true);

        // Poblar datos usando los nombres de campo del modelo ItemPortafolio
        clone.getElementById('project-title').textContent = project.titulo || 'Título no disponible';
        clone.getElementById('project-date').textContent = `Realizado en: ${formatDate(project.fecha_trabajo)}`;
        clone.getElementById('project-description').innerHTML = project.descripcion ? project.descripcion.replace(/\n/g, '<br>') : 'Descripción no disponible.';
        clone.getElementById('project-img-antes').src = project.imagen_antes || '';
        clone.getElementById('project-img-despues').src = project.imagen_despues || '';

        if (projectContainer) {
            projectContainer.innerHTML = ''; // Limpiar "cargando..."
            projectContainer.appendChild(clone);

            if (window.AOS) {
                AOS.refresh();
            }
        } 
    };

    /**
     * Función principal para obtener y renderizar el proyecto por su ID.
     */
    const main = async () => {
        const projectId = getProjectId();

        if (!projectId) {
            displayError('No se ha especificado un proyecto. Por favor, selecciona uno del portafolio.');
            return;
        }

        projectContainer.innerHTML = '<div class="spinner" style="margin: 4rem auto;"></div>';

        const { data: project, error } = await getPortfolioItemDetails(projectId);

        if (error) {
            displayError(`No se pudo cargar la transformación. Motivo: ${error}`);
        } else if (project) {
            renderProject(project);
        }
    };

    main();
});
