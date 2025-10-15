document.addEventListener('DOMContentLoaded', () => {
    // La URL base correcta es /auth/ según la configuración de Django.
    const API_URL = 'http://localhost:8000/auth/';

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const formStatus = document.getElementById('form-status');

    const setStatus = (message, isError = false) => {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.style.color = isError ? 'red' : 'green';
        }
    };

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setStatus('Enviando datos...', false);
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_URL}register/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include',
                });

                const result = await response.json();

                if (response.ok) {
                    setStatus('¡Registro exitoso! Redirigiendo...', false);
                    setTimeout(() => { window.location.href = 'login.html'; }, 2000);
                } else {
                    const errorMessage = Object.values(result).join('\n');
                    setStatus(`Error en el registro: ${errorMessage}`, true);
                }
            } catch (error) {
                console.error('Error de red o de servidor:', error);
                setStatus('No se pudo conectar con el servidor. Revisa que la URL de la API sea correcta y el servidor backend esté activo.', true);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setStatus('Iniciando sesión...', false);
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_URL}login/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include',
                });
                const result = await response.json();

                if (response.ok) {
                    setStatus('¡Inicio de sesión exitoso! Redirigiendo...', false);
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('username', result.username); 
                    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
                } else {
                    setStatus(result.error || 'Usuario o contraseña incorrectos.', true);
                }
            } catch (error) {
                console.error('Error de red o de servidor:', error);
                setStatus('No se pudo conectar con el servidor. Revisa que la URL de la API sea correcta y el servidor backend esté activo.', true);
            }
        });
    }
});
