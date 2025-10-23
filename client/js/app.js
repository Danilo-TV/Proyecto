document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    // =========================================================================
    // 1. MANEJO DEL PRELOADER
    // =========================================================================
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.addEventListener('transitionend', () => preloader.style.display = 'none');
        }
    });

    // =========================================================================
    // 2. CARGA DINÁMICA DE COMPONENTES
    // =========================================================================
    const loadComponent = (url, placeholderId) => {
        return fetch(`${url}?v=${new Date().getTime()}`)
            .then(response => {
                if (!response.ok) throw new Error(`Error al cargar ${url}: ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                }
            });
    };

    // =========================================================================
    // 3. LÓGICA DE MENÚ DE USUARIO Y CAMBIO DE TEMA (RESTAURADA)
    // =========================================================================
    function initializeUserMenuAndTheme() {
        const loggedOutMenu = document.getElementById('logged-out-menu');
        const loggedInMenu = document.getElementById('logged-in-menu');
        const userMenuToggle = document.getElementById('user-menu-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        const logoutButton = document.getElementById('logout-button');
        const usernameDisplay = document.querySelector('#logged-in-menu .username-display');
        const usernameDropdownDisplay = document.getElementById('username-dropdown-display');
        const themeToggles = Array.from(document.querySelectorAll('.theme-toggle'));

        const checkLoginState = () => {
            const token = localStorage.getItem('authToken');
            const username = localStorage.getItem('username');
            if (token && username) {
                if (loggedInMenu) loggedInMenu.style.display = 'flex';
                if (loggedOutMenu) loggedOutMenu.style.display = 'none';
                if (usernameDisplay) usernameDisplay.textContent = username;
                if (usernameDropdownDisplay) usernameDropdownDisplay.textContent = username;
            } else {
                if (loggedOutMenu) loggedOutMenu.style.display = 'flex';
                if (loggedInMenu) loggedInMenu.style.display = 'none';
            }
        };

        if (userMenuToggle) {
            userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (userDropdown) userDropdown.classList.toggle('show');
            });
        }

        document.addEventListener('click', () => {
            if (userDropdown && userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
            }
        });

        if (userDropdown) userDropdown.addEventListener('click', (e) => e.stopPropagation());

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                window.location.href = 'index.html';
            });
        }

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeToggles.forEach(toggle => {
                if (toggle) toggle.checked = (theme === 'dark');
            });
        };

        themeToggles.forEach(toggle => {
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    applyTheme(e.target.checked ? 'dark' : 'light');
                });
            }
        });

        checkLoginState();
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    }

    // =========================================================================
    // 4. LÓGICA DE MODALES DE AUTENTICACIÓN (RESTAURADA)
    // =========================================================================
    function initializeAuthModals() {
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        const loginBtn = document.getElementById('login-modal-trigger');
        const registerBtn = document.getElementById('register-modal-trigger');
        const closeButtons = document.querySelectorAll('.close-modal-btn');
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');

        if (!loginModal || !registerModal) return;

        const openModal = (modal) => { if (modal) modal.classList.add('show'); };
        const closeModal = (modal) => { if (modal) modal.classList.remove('show'); };

        if(loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
        if(registerBtn) registerBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                closeModal(loginModal);
                closeModal(registerModal);
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target === loginModal) closeModal(loginModal);
            if (e.target === registerModal) closeModal(registerModal);
        });

        if(switchToRegister) switchToRegister.addEventListener('click', (e) => { 
            e.preventDefault(); 
            closeModal(loginModal); 
            openModal(registerModal); 
        });

        if(switchToLogin) switchToLogin.addEventListener('click', (e) => { 
            e.preventDefault(); 
            closeModal(registerModal); 
            openModal(loginModal); 
        });
    }

    // =========================================================================
    // 5. LÓGICA DEL FORMULARIO DE NEWSLETTER
    // =========================================================================
    function initializeNewsletterForm() {
        // Lógica del newsletter (si existe) va aquí
    }

    // =========================================================================
    // 6. LÓGICA DEL ACORDEÓN DE FAQ (NUEVA)
    // =========================================================================
    function initializeFaqAccordion() {
        const faqContainer = document.getElementById('faq-accordion');
        if (!faqContainer) return;

        const faqItems = faqContainer.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const wasActive = item.classList.contains('active');
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    if (!wasActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // =========================================================================
    // 7. CARGA DE CONTENIDO CONDICIONAL
    // =========================================================================
    function loadPageSpecificContent() {
        // Lógica para cargar contenido específico de la página va aquí
    }

    // =========================================================================
    // 8. SECUENCIA DE INICIALIZACIÓN PRINCIPAL (CORREGIDA Y COMPLETA)
    // =========================================================================
    const initComponents = async () => {
        try {
            await Promise.all([
                loadComponent('partials/_nav.html', 'nav-placeholder'),
                loadComponent('partials/_footer.html', 'footer-placeholder'),
                loadComponent('partials/_modals.html', 'modals-placeholder')
            ]);

            // Inicializar todos los componentes después de que el HTML base esté cargado.
            initializeUserMenuAndTheme();
            initializeAuthModals();
            initializeNewsletterForm();
            initializeFaqAccordion();
            loadPageSpecificContent();

            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 800, once: true, delay: 100 });
            }

        } catch (error) {
            console.error('Fallo al cargar e inicializar los componentes de la plantilla:', error);
        }
    };

    initComponents();
});