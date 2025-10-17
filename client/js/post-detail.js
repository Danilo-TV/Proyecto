document.addEventListener('DOMContentLoaded', () => {

    // URL Base de la API de Django. ¡Asegúrate de que el puerto sea el correcto!
    const API_BASE_URL = 'http://127.0.0.1:8000';

    // Elementos del DOM
    const postContainer = document.getElementById('post-container');
    const commentsList = document.getElementById('comments-list');
    const commentsLoading = document.getElementById('comments-loading');
    const commentFormContainer = document.getElementById('comment-form-container');
    const commentForm = document.getElementById('comment-form');
    const commentLoginPrompt = document.getElementById('comment-login-prompt');

    // Obtener el ID del post desde la URL
    const getPostId = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    const postId = getPostId();

    if (!postId) {
        postContainer.innerHTML = '<p>Error: No se ha especificado un ID de post.</p>';
        commentsLoading.style.display = 'none';
        return;
    }

    /**
     * Formatea una fecha en formato YYYY-MM-DD a un formato más legible.
     */
    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    /**
     * Renderiza el contenido principal del post.
     */
    const renderPost = (post) => {
        document.title = `${post.titulo} - Mi Portafolio`;
        postContainer.innerHTML = `
            <h1 class="post-title" data-aos="fade-up">${post.titulo}</h1>
            <div class="post-meta" data-aos="fade-up" data-aos-delay="100">
                <span>Por ${post.autor_username || 'Anónimo'}</span> | 
                <span>${formatDate(post.fecha_publicacion)}</span>
            </div>
            <img src="${post.imagen_principal}" alt="Imagen del post" class="post-image" data-aos="fade-up" data-aos-delay="200">
            <div class="post-content" data-aos="fade-up" data-aos-delay="300">
                ${post.contenido} 
            </div>
        `;
    };

    /**
     * Renderiza un único comentario en la lista.
     */
    const renderComment = (comment) => {
        const li = document.createElement('li');
        li.className = 'comment-item';
        li.innerHTML = `
            <div class="comment-author">${comment.usuario_fk_username || 'Usuario'}</div>
            <div class="comment-body">${comment.cuerpo_comentario}</div>
            <div class="comment-date">${formatDate(comment.fecha_comentario)}</div>
        `;
        commentsList.appendChild(li);
    };

    /**
     * Carga el post y los comentarios desde la API.
     */
    const loadPostAndComments = async () => {
        try {
            const [postResponse, commentsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/blog/posts_blog/${postId}/`),
                fetch(`${API_BASE_URL}/blog/comentarios/?post_fk=${postId}`)
            ]);

            if (!postResponse.ok) throw new Error('No se pudo cargar el artículo.');
            const post = await postResponse.json();
            renderPost(post);

            if (!commentsResponse.ok) throw new Error('No se pudieron cargar los comentarios.');
            const comments = await commentsResponse.json();
            
            commentsLoading.style.display = 'none';
            if (comments.length > 0) {
                commentsList.innerHTML = ''; // Limpiar la lista antes de añadir nuevos comentarios
                comments.forEach(renderComment);
            } else {
                commentsList.innerHTML = '<p>Todavía no hay comentarios. ¡Sé el primero!</p>';
            }

        } catch (error) {
            console.error("Error al cargar los datos:", error);
            postContainer.innerHTML = `<p>Error al cargar el contenido: ${error.message}</p>`;
            commentsLoading.textContent = 'No se pudieron cargar los comentarios.';
        } finally {
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 800, once: true });
            }
        }
    };

    /**
     * Configura el formulario de comentarios basándose en el estado de login.
     */
    const setupCommentForm = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            commentLoginPrompt.style.display = 'none';
            commentForm.style.display = 'block';
        } else {
            commentLoginPrompt.style.display = 'block';
            commentForm.style.display = 'none';
        }
    };

    /**
     * Maneja el envío del formulario de comentarios.
     */
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentBodyInput = document.getElementById('comment-body');
        const commentText = commentBodyInput.value.trim();
        const token = localStorage.getItem('authToken');

        if (!commentText) {
            alert('Por favor, escribe un comentario.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/blog/comentarios/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    post_fk: postId,
                    cuerpo_comentario: commentText
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al enviar el comentario.');
            }

            const newComment = await response.json();
            newComment.usuario_fk_username = localStorage.getItem('username'); 

            if (commentsList.querySelector('p')) {
                commentsList.innerHTML = '';
            }

            renderComment(newComment);
            commentBodyInput.value = '';

        } catch (error) {
            console.error('Error al enviar comentario:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // --- INICIALIZACIÓN ---
    loadPostAndComments();
    setupCommentForm();
});
