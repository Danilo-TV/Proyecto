document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:8000/api/users'; // URL base para la autenticación

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const formStatus = document.getElementById('form-status');

    // Función para mostrar mensajes de estado en el formulario
    const setStatus = (message, isError = false) => {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.style.color = isError ? 'red' : 'green';
        }
    };

    // --- LÓGICA DE REGISTRO (sin cambios) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setStatus('Enviando datos...', false);
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_URL}/register/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();

                if (response.ok) {
                    setStatus('¡Registro exitoso! Redirigiendo a la página de login...', false);
                    setTimeout(() => { window.location.href = 'login.html'; }, 2000);
                } else {
                    const errorMessage = Object.values(result).join('\n');
                    setStatus(`Error en el registro: ${errorMessage}`, true);
                }
            } catch (error) {
                console.error('Error de red o de servidor:', error);
                setStatus('No se pudo conectar con el servidor. Inténtalo más tarde.', true);
            }
        });
    }

    // --- LÓGICA DE LOGIN (CORREGIDA para Token Simple) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setStatus('Iniciando sesión...', false);
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_URL}/login/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();

                if (response.ok) {
                    setStatus('¡Inicio de sesión exitoso! Redirigiendo...', false);
                    
                    // CORRECCIÓN: Guardar el token y el nombre de usuario que envía Django
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('username', result.username); 
                    
                    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
                } else {
                    setStatus(result.error || 'Usuario o contraseña incorrectos.', true);
                }
            } catch (error) {
                console.error('Error de red o de servidor:', error);
                setStatus('No se pudo conectar con el servidor. Inténtalo más tarde.', true);
            }
        });
    }
});
