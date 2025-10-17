import axios from 'axios';

// =========================================================================
// 1. CONFIGURACIÓN DE LA API Y CONSTANTES
// =========================================================================

// URL base del Dashboard API. Asegúrese de que coincida con su configuración
// (ej. 'http://localhost:8000/api/v1/blog' si el router está prefijado así)
const API_BASE_URL = 'http://localhost:8000/blog'; 

// Instancia de Axios para manejar todas las peticiones del Blog
const blogApi = axios.create({
    baseURL: API_BASE_URL,
});

/**
 * Función auxiliar para generar el objeto de configuración de la petición
 * que incluye el Token de autenticación, necesario para acciones de escritura.
 * @param {string} token - El token de autenticación del usuario.
 */
const getConfig = (token) => ({
    headers: {
        // Formato requerido por Django REST Framework (DRF)
        'Authorization': `Token ${token}`, 
        'Content-Type': 'application/json',
    }
});

// =========================================================================
// 2. OPERACIONES PÚBLICAS (GET - Acceso Anónimo)
// El backend usa IsAdminOrReadOnly o IsAuthenticatedOrReadOnly, permitiendo GET anónimo.
// =========================================================================

/**
 * [GET /posts_blog/] Lista todos los posts del blog.
 * No requiere token de autenticación.
 */
export const getAllBlogPosts = async () => {
    try {
        const response = await blogApi.get('/posts_blog/'); // Endpoint de Posts [Query anterior]
        return response.data;
    } catch (error) {
        console.error("Error al listar posts:", error);
        throw error;
    }
};

/**
 * [GET /posts_blog/:id/] Obtiene un post específico.
 * No requiere token de autenticación.
 * @param {string | number} postId - El ID o slug del PostBlog.
 */
export const getBlogPostDetail = async (postId) => {
    try {
        const response = await blogApi.get(`/posts_blog/${postId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener post ${postId}:`, error);
        throw error;
    }
};

/**
 * [GET /comentarios/] Lista todos los comentarios.
 * No requiere token de autenticación.
 */
export const getAllComments = async () => {
    try {
        const response = await blogApi.get('/comentarios/'); // Endpoint de Comentarios [Query anterior]
        return response.data;
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        throw error;
    }
};

// =========================================================================
// 3. OPERACIONES DE USUARIO AUTENTICADO (COMENTARIOS)
// Requiere Token, ya que el modelo Comentario necesita un usuario_fk [Query anterior].
// =========================================================================

/**
 * [POST /comentarios/] Crea un nuevo comentario. Requiere Token de cualquier usuario logeado.
 * @param {string} token - El token de autenticación del usuario.
 * @param {object} commentData - Datos del comentario (usando snake_case: post_fk, cuerpo_comentario).
 */
export const createBlogComment = async (token, commentData) => {
    try {
        const config = getConfig(token);
        // commentData debe usar snake_case para ser consistente con el backend de Django [1]
        const response = await blogApi.post('/comentarios/', commentData, config); 
        return response.data;
    } catch (error) {
        // Devuelve 401 si no hay token o es inválido.
        console.error("Error al crear comentario. ¿Token o post_fk faltante?", error.response?.data);
        throw error;
    }
};


// =========================================================================
// 4. OPERACIONES DE ADMINISTRADOR (CRUD DE POSTS)
// Requiere Token y que el usuario sea Admin (is_staff), debido al permiso IsAdminOrReadOnly [Query anterior].
// =========================================================================

/**
 * [POST /posts_blog/] Crea un nuevo post. Requiere Token de Administrador.
 * @param {string} token - El token de autenticación del administrador.
 * @param {object} postData - Datos del post (usando snake_case: titulo, contenido, imagen_principal).
 */
export const createBlogPost = async (token, postData) => {
    try {
        const config = getConfig(token);
        const response = await blogApi.post('/posts_blog/', postData, config); 
        return response.data;
    } catch (error) {
        // Devuelve 403 Forbidden si el usuario autenticado NO es administrador (is_staff).
        console.error("Error al crear post. Permisos insuficientes (Admin requerido):", error.response?.data);
        throw error;
    }
};

/**
 * [PUT /posts_blog/:id/] Actualiza completamente un post existente. Requiere Token de Administrador.
 * @param {string} token - El token de autenticación del administrador.
 * @param {number} postId - ID del post a actualizar.
 * @param {object} postData - Nuevos datos del post (usando snake_case).
 */
export const updateBlogPost = async (token, postId, postData) => {
    try {
        const config = getConfig(token);
        const response = await blogApi.put(`/posts_blog/${postId}/`, postData, config);
        return response.data;
    } catch (error) {
        // Devuelve 403 Forbidden si el usuario autenticado NO es administrador.
        console.error(`Error al actualizar post ${postId}. Permisos insuficientes (Admin requerido):`, error.response?.data);
        throw error;
    }
};

/**
 * [DELETE /posts_blog/:id/] Elimina un post. Requiere Token de Administrador.
 * @param {string} token - El token de autenticación del administrador.
 * @param {number} postId - ID del post a eliminar.
 */
export const deleteBlogPost = async (token, postId) => {
    try {
        const config = getConfig(token);
        const response = await blogApi.delete(`/posts_blog/${postId}/`, config); 
        return response.data;
    } catch (error) {
        // Devuelve 403 Forbidden si el usuario autenticado NO es administrador.
        console.error(`Error al eliminar post ${postId}. Permisos insuficientes (Admin requerido):`, error.response?.data);
        throw error;
    }
};