/**
 * ===================================================================================
 *  auth.js - Módulo para Autenticación y Gestión de Usuario
 * ===================================================================================
 *  REFECTORIZADO: Este script ahora es un módulo que exporta su funcionalidad.
 */

const userMenuButton = document.getElementById('user-menu-button');
const userMenu = document.getElementById('user-menu');
const userNameElement = document.getElementById('user-name');
const logoutButton = document.getElementById('logout-button');

const TOKEN_KEY = 'authToken';
const USERNAME_KEY = 'username';

/**
 * Obtiene el token de autenticación del almacenamiento local.
 * @returns {string|null} El token o null si no existe.
 */
export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Obtiene el nombre de usuario del almacenamiento local.
 * @returns {string|null} El nombre de usuario o null si no existe.
 */
function getUsername() {
    return localStorage.getItem(USERNAME_KEY);
}

/**
 * Verifica si el usuario ha iniciado sesión.
 * @returns {boolean} True si hay un token, de lo contrario False.
 */
export function isUserLoggedIn() {
    return !!getAuthToken();
}

/**
 * Guarda el token y el nombre de usuario en el almacenamiento local.
 * @param {string} token - El token de autenticación.
 * @param {string} username - El nombre del usuario.
 */
export function saveLoginData(token, username) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    updateUI();
}

/**
 * Limpia los datos de sesión del almacenamiento local y actualiza la UI.
 */
function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    updateUI();
    // Redirigir a la página de inicio o donde sea apropiado después del logout
    if (window.location.pathname.includes('post-detail.html')) {
        window.location.reload();
    } else {
        window.location.href = 'index.html';
    }
}

/**
 * Actualiza la interfaz de usuario para reflejar el estado de autenticación.
 */
function updateUI() {
    if (isUserLoggedIn()) {
        // Usuario logueado
        if (userMenuButton) {
            userMenuButton.style.display = 'block';
        }
        if (userNameElement) {
            userNameElement.textContent = getUsername() || 'Usuario';
        }
    } else {
        // Usuario no logueado
        if (userMenuButton) {
            userMenuButton.style.display = 'none';
        }
    }
}

// --- Event Listeners ---

if (userMenuButton) {
    userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el listener del documento lo cierre inmediatamente
        if (userMenu) {
            userMenu.classList.toggle('show');
        }
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

// Cerrar el menú si se hace clic fuera de él
document.addEventListener('click', (e) => {
    if (userMenu && userMenu.classList.contains('show') && !userMenu.contains(e.target)) {
        userMenu.classList.remove('show');
    }
});

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', updateUI);
