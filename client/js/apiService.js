/**
 * ===================================================================================
 *  apiService.js - Módulo Centralizado para la Comunicación con la API
 * ===================================================================================
 */

import { getAuthToken } from './auth.js';

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Función genérica para realizar peticiones fetch y manejar respuestas.
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    // Inyectar el token de autenticación si está disponible
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Token ${token}`,
        };
    }

    // Asegurar que el Content-Type se establezca para los métodos POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(options.method) && options.body) {
        options.headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: `Error ${response.status}: ${response.statusText}` }));
            throw new Error(errorData.detail);
        }

        return response.status === 204 ? { data: null } : { data: await response.json() };

    } catch (error) {
        console.error(`Error en la petición a ${url}:`, error);
        return { error: error.message || 'Ocurrió un error de red o el servidor no está disponible.' };
    }
}

// ===================================================================================
//  SERVICIOS DEL PORTAFOLIO
// ===================================================================================

export const getPortfolioItems = () => request('/portafolio/items_portafolio/');

export const getPortfolioItemDetails = (id) => request(`/portafolio/items_portafolio/${id}/`);

// ===================================================================================
//  SERVICIOS DEL BLOG
// ===================================================================================

// CORRECCIÓN: El endpoint correcto es 'posts_blog'
export const getBlogPosts = () => request('/blog/posts_blog/');

// CORRECCIÓN: El endpoint correcto es 'posts_blog/:id'
export const getBlogPostDetails = (id) => request(`/blog/posts_blog/${id}/`);

// NUEVO: Obtener comentarios para un post específico
export const getCommentsForPost = (postId) => request(`/blog/comentarios/?post_fk=${postId}`);

// NUEVO: Crear un nuevo comentario para un post
export const createComment = (commentData) => {
    return request('/blog/comentarios/', {
        method: 'POST',
        body: JSON.stringify(commentData),
    });
};
