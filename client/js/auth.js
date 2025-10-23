document.addEventListener('DOMContentLoaded', () => {

    // Este script se ejecuta después de que app.js ha cargado los componentes.

    // --- Constantes y Selectores del DOM ---
    const API_BASE_URL = 'http://127.0.0.1:8000/api/auth/';
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginStatus = document.getElementById('login-form-status');
    const registerStatus = document.getElementById('register-form-status');

    // --- No se puede continuar si los elementos básicos no están en el DOM ---
    if (!loginForm || !registerForm) {
        return;
    }

    // --- Funciones de Utilidad (ya definidas en app.js, pero las duplicamos para mantener este script autocontenido) ---
    const openModal = (modal) => modal && modal.classList.add('show');
    const closeModal = (modal) => modal && modal.classList.remove('show');

    // =========================================================================
    // FUNCIÓN MEJORADA PARA MOSTRAR ESTADO
    // =========================================================================
    const setStatus = (statusElement, message, type) => {
        if (!statusElement) return;
        statusElement.textContent = message;
        // Usamos un enfoque de clases BEM para mayor claridad
        statusElement.className = 'form-status'; 
        statusElement.classList.add(`form-status--${type}`);
        statusElement.style.display = 'block';
    };

    // =========================================================================
    // LÓGICA DEL FORMULARIO DE REGISTRO (CON UX MEJORADA)
    // =========================================================================
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        setStatus(registerStatus, 'Procesando tu registro...', 'processing');

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE_URL}register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus(registerStatus, '¡Registro exitoso! Por favor, inicia sesión.', 'success');
                
                setTimeout(() => {
                    closeModal(registerModal);
                    openModal(loginModal);
                    registerForm.reset();
                    registerStatus.style.display = 'none';
                }, 2000);
            } else {
                const errorMessage = Object.values(result).flat().join(' ');
                setStatus(registerStatus, errorMessage || 'Ocurrió un error en el registro.', 'error');
            }
        } catch (error) {
            setStatus(registerStatus, 'No se pudo conectar con el servidor.', 'error');
        }
    });

    // =========================================================================
    // LÓGICA DE INICIO DE SESIÓN (CON RECARGA SEGURA)
    // =========================================================================
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        setStatus(loginStatus, 'Iniciando sesión...', 'processing');

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE_URL}login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();

            if (response.ok) {
                setStatus(loginStatus, '¡Bienvenida! Actualizando la página...', 'success');
                
                localStorage.setItem('authToken', result.access);
                localStorage.setItem('username', result.user.username);
                
                setTimeout(() => {
                    window.location.reload();
                }, 1500);

            } else {
                setStatus(loginStatus, result.detail || 'Usuario o contraseña incorrectos.', 'error');
            }
        } catch (error) {
            setStatus(loginStatus, 'No se pudo conectar con el servidor.', 'error');
        }
    });
});
