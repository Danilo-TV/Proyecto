document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    // Contenedores principales del DOM
    const postContainer = document.getElementById('post-container');
    const commentsList = document.getElementById('comments-list');
    const commentsLoading = document.getElementById('comments-loading');
    const commentFormContainer = document.getElementById('comment-form-container');
    const commentForm = document.getElementById('comment-form');
    const commentLoginPrompt = document.getElementById('comment-login-prompt');

    // Obtiene el slug del post desde la URL, no el ID
    const getPostSlug = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    };

    const postSlug = getPostSlug();

    if (!postSlug) {
        if (postContainer) postContainer.innerHTML = '<p class="form-input-soft">Error: No se ha especificado un artículo.</p>';
        if (commentsLoading) commentsLoading.style.display = 'none';
        return;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    /**
     * Renderiza el contenido principal del post con el nuevo diseño.
     */
    const renderPost = (post) => {
        document.title = `${post.title} - LuxeConvert`; // Actualiza el título de la página
        if (!postContainer) return;
        
        postContainer.innerHTML = `
            <header class="post-header" data-aos="fade-in">
                <h1 class="section__title">${post.title}</h1>
                <div class="post-meta">
                    <span>Por <strong>${post.author_username || 'Anónimo'}</strong></span>
                    <span class="separator">&bull;</span>
                    <span>${formatDate(post.published_date)}</span>
                    <span class="separator">&bull;</span>
                    <span>Categoría: ${post.category_name}</span>
                </div>
            </header>
            <div class="post-image-container" data-aos="fade-up">
                <img src="${post.image_url}" alt="${post.title}" class="post-image">
            </div>
            <div class="post-body" data-aos="fade-up" data-aos-delay="100">
                ${post.body} 
            </div>
        `;
    };

    /**
     * Renderiza un único comentario con el nuevo diseño.
     */
    const renderComment = (comment) => {
        const li = document.createElement('li');
        li.className = 'comment-card';
        li.innerHTML = `
            <div class="comment-header">
                <strong class="comment-author">${comment.user_username || 'Usuario'}</strong>
                <time class="comment-date">${formatDate(comment.created_at)}</time>
            </div>
            <p class="comment-body">${comment.body}</p>
        `;
        return li;
    };

    /**
     * Carga el post y sus comentarios desde la API RESTful.
     */
    const loadPostAndComments = async () => {
        try {
            const [postResponse, commentsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/blog/posts/${postSlug}/`),
                fetch(`${API_BASE_URL}/blog/posts/${postSlug}/comments/`)
            ]);

            if (!postResponse.ok) throw new Error('No se pudo cargar el artículo.');
            const post = await postResponse.json();
            renderPost(post);

            if (commentsLoading) commentsLoading.style.display = 'none';
            if (!commentsList) return;

            commentsList.innerHTML = '';
            if (commentsResponse.ok) {
                const comments = await commentsResponse.json();
                if (comments.length > 0) {
                    comments.forEach(comment => commentsList.appendChild(renderComment(comment)));
                } else {
                    commentsList.innerHTML = '<li class="form-input-soft">Todavía no hay comentarios. ¡Sé el primero!</li>';
                }
            } else {
                 commentsList.innerHTML = '<li class="form-input-soft">No se pudieron cargar los comentarios.</li>';
            }

        } catch (error) {
            console.error("Error al cargar los datos:", error);
            if (postContainer) postContainer.innerHTML = `<p class="form-input-soft">Error al cargar el contenido: ${error.message}</p>`;
            if (commentsLoading) commentsLoading.textContent = 'No se pudieron cargar los comentarios.';
        } finally {
            if (typeof AOS !== 'undefined') {
                AOS.refresh(); // Usa refresh para animar el contenido cargado dinámicamente
            }
        }
    };

    /**
     * Configura la visibilidad del formulario de comentarios basada en el estado de autenticación.
     */
    const setupCommentForm = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            if (commentLoginPrompt) commentLoginPrompt.style.display = 'none';
            if (commentForm) commentForm.style.display = 'block';
        } else {
            if (commentLoginPrompt) commentLoginPrompt.style.display = 'block';
            if (commentForm) commentForm.style.display = 'none';
        }
    };

    /**
     * Maneja el envío del formulario de nuevo comentario.
     */
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const commentBodyInput = document.getElementById('comment-body');
            const commentText = commentBodyInput.value.trim();
            const token = localStorage.getItem('authToken');

            if (!commentText) {
                // Podríamos agregar un mensaje de estado aquí también
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/blog/posts/${postSlug}/comments/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ body: commentText })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Error al enviar el comentario.');
                }

                const newComment = await response.json();
                
                // Limpia el mensaje de "no hay comentarios" si existe
                const noCommentsMessage = commentsList.querySelector('.form-input-soft');
                if (noCommentsMessage) {
                    noCommentsMessage.remove();
                }

                commentsList.appendChild(renderComment(newComment));
                commentBodyInput.value = '';

            } catch (error) {
                console.error('Error al enviar comentario:', error);
                // En una implementación futura, mostrar este error en el DOM
                alert(`Error: ${error.message}`);
            }
        });
    }

    // --- INICIALIZACIÓN ---
    loadPostAndComments();
    setupCommentForm();
});
