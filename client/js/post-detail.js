import { getBlogPostDetails, getCommentsForPost, createComment } from './apiService.js';
import { isUserLoggedIn } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {

    // --- Selectores del DOM ---
    const postContainer = document.getElementById('post-container');
    const commentsList = document.getElementById('comments-list');
    const commentsSection = document.getElementById('comments-section');
    const commentFormContainer = document.getElementById('comment-form-container');
    const commentLoginFormPrompt = document.getElementById('comment-login-prompt');
    const commentForm = document.getElementById('comment-form');
    const commentBody = document.getElementById('comment-body');

    const getPostId = () => new URLSearchParams(window.location.search).get('id');

    // --- Renderizado ---
    const renderError = (container, message) => {
        container.innerHTML = `<div class="form-status form-status--error" style="display: block;">${message}</div>`;
    };

    const renderPost = (post) => {
        document.title = `${post.titulo} - LuxeConvert`;
        document.querySelector('meta[name="description"]').setAttribute('content', post.contenido.substring(0, 155));
        
        const postDate = new Date(post.fecha_publicacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

        postContainer.innerHTML = `
            <div class="post-header-lux" data-aos="fade-down">
                <h1 class="post-title-lux">${post.titulo}</h1>
                <p class="post-meta-lux">
                    <span>Por ${post.autor_username || 'Admin'}</span>
                    <span class="separator">|</span>
                    <span>${postDate}</span>
                </p>
            </div>
            <div class="post-image-container-lux" data-aos="fade-down" data-aos-delay="150">
                <img src="${post.imagen_principal}" alt="Imagen principal del artículo: ${post.titulo}" class="post-image-lux">
            </div>
            <div class="post-body-lux" data-aos="fade-down" data-aos-delay="300">
                ${post.contenido}
            </div>
        `;
    };

    const renderComments = (comments) => {
        commentsList.innerHTML = '';

        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments-message">Todavía no hay comentarios. ¡Sé el primero en compartir tu opinión!</p>';
            return;
        }

        comments.forEach(comment => {
            const commentDate = new Date(comment.fecha_comentario).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric'});
            const li = document.createElement('li');
            li.className = 'comment-card-lux';
            li.innerHTML = `
                <div class="comment-card-lux__header">
                    <span class="comment-author-lux">${comment.autor_username || 'Anónimo'}</span>
                    <span class="comment-date-lux">${commentDate}</span>
                </div>
                <p class="comment-body-lux">${comment.cuerpo_comentario}</p>
            `;
            commentsList.appendChild(li);
        });
    };

    const handleCommentForm = () => {
        if (isUserLoggedIn()) {
            commentLoginFormPrompt.style.display = 'none';
            commentForm.style.display = 'block';
        } else {
            commentLoginFormPrompt.style.display = 'block';
            commentForm.style.display = 'none';
        }
    };

    // --- Lógica de la aplicación ---
    const postId = getPostId();
    if (!postId) {
        renderError(postContainer, 'No se ha especificado ningún artículo.');
        commentsSection.style.display = 'none';
        return;
    }

    // Cargar Post y Comentarios en paralelo
    const [postResult, commentsResult] = await Promise.all([
        getBlogPostDetails(postId),
        getCommentsForPost(postId)
    ]);

    // Renderizar Post
    if (postResult.error) {
        renderError(postContainer, `Error al cargar el artículo: ${postResult.error}`);
    } else {
        renderPost(postResult.data);
    }

    // Renderizar Comentarios
    if (commentsResult.error) {
        commentsList.innerHTML = '<p class="no-comments-message">No se pudieron cargar los comentarios.</p>';
    } else {
        renderComments(commentsResult.data);
    }

    // Gestionar Formulario de Comentarios
    handleCommentForm();
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = commentBody.value.trim();
        if (!content) return;

        const commentData = { 
            post_fk: postId, 
            cuerpo_comentario: content,
        };

        const { data: newComment, error } = await createComment(commentData);

        if (error) {
            alert(`Error al enviar el comentario: ${error}`);
        } else {
            commentBody.value = '';
            const { data, error: fetchError } = await getCommentsForPost(postId);
            if (!fetchError) {
                renderComments(data);
                const lastComment = commentsList.querySelector('.comment-card-lux:last-child');
                if(lastComment) lastComment.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Refrescar AOS después del renderizado dinámico
    setTimeout(() => {
        if (window.AOS) {
            AOS.refresh();
        }
    }, 100);
});
