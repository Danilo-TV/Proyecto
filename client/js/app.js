document.addEventListener('DOMContentLoaded', () => {

    // ==================== SELECTORS ==================== 
    const API_BASE_URL = 'http://localhost:8000';
    const preloader = document.getElementById('preloader');
    
    // Selectors de contenido dinámico
    const portfolioGallery = document.getElementById('portfolio-gallery');
    const blogPostsContainer = document.getElementById('blog-posts');
    const contactForm = document.getElementById('contact-form');

    // Selectors del menú de usuario
    const loggedOutMenu = document.getElementById('logged-out-menu');
    const loggedInMenu = document.getElementById('logged-in-menu');
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutButton = document.getElementById('logout-button');
    const usernameDisplay = document.getElementById('username-display');
    const usernameDropdownDisplay = document.getElementById('username-dropdown-display');
    const themeToggle = document.getElementById('theme-toggle'); // Ahora es un checkbox

    // ==================== PRELOADER ==================== 
    window.addEventListener('load', () => {
        if(preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // ==================== THEME (DARK/LIGHT MODE) ==================== 
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggle) themeToggle.checked = theme === 'dark';
    };

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // ==================== LÓGICA DE AUTENTICACIÓN (NO BLOQUEANTE) ==================== 
    const checkAuthStatus = () => {
        const token = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');

        if (token && username && loggedInMenu && loggedOutMenu) {
            // Usuario está logueado
            loggedOutMenu.style.display = 'none';
            loggedInMenu.style.display = 'block';
            usernameDisplay.textContent = username;
            usernameDropdownDisplay.textContent = username;
        } else if (loggedInMenu && loggedOutMenu){
            // Usuario no está logueado
            loggedOutMenu.style.display = 'flex';
            loggedInMenu.style.display = 'none';
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        window.location.reload();
    };

    if (logoutButton) logoutButton.addEventListener('click', logout);

    // --- Control del menú desplegable ---
    if (userMenuToggle) {
        userMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el evento de clic en la ventana se dispare inmediatamente
            if(userDropdown) userDropdown.classList.toggle('show');
        });
    }

    // Cierra el dropdown si se hace clic fuera de él
    window.addEventListener('click', (e) => {
        if (userDropdown && userDropdown.classList.contains('show')) {
            if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        }
    });


    // ==================== API & DYNAMIC CONTENT (NO BLOQUEANTE) ==================== 
    const renderPortfolio = async () => {
        if (!portfolioGallery) return;
        try {
            const response = await fetch(`${API_BASE_URL}/portafolio/items_portafolio/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const items = await response.json();
            portfolioGallery.innerHTML = '';
            items.forEach(item => {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                portfolioItem.innerHTML = `
                    <img src="${item.imagen_url || 'https://picsum.photos/400/250'}" alt="${item.titulo}" loading="lazy">
                    <div class="item-content">
                        <h3>${item.titulo}</h3>
                        <p>${item.descripcion}</p>
                        <a href="${item.url}" target="_blank">Ver Proyecto</a>
                    </div>
                `;
                portfolioGallery.appendChild(portfolioItem);
            });
        } catch (error) {
            console.error('Error al cargar el portafolio:', error);
            portfolioGallery.innerHTML = '<p>No se pudieron cargar los proyectos. Inténtalo de nuevo más tarde.</p>';
        }
    };

    const renderBlogPosts = async () => {
        if (!blogPostsContainer) return;
        try {
            const response = await fetch(`${API_BASE_URL}/blog/posts_blog/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const posts = await response.json();
            blogPostsContainer.innerHTML = '';
            posts.slice(0, 3).forEach(post => {
                const blogPost = document.createElement('div');
                blogPost.className = 'blog-post';
                blogPost.innerHTML = `
                    <img src="${post.imagen_url || 'https://picsum.photos/400/250'}" alt="${post.titulo}" loading="lazy">
                    <div class="post-content">
                        <h3>${post.titulo}</h3>
                        <p class="post-meta">${new Date(post.fecha_publicacion).toLocaleDateString()}</p>
                        <p>${post.contenido.substring(0, 100)}...</p>
                        <a href="#">Leer más</a>
                    </div>
                `;
                blogPostsContainer.appendChild(blogPost);
            });
        } catch (error) {
            console.error('Error al cargar el blog:', error);
            blogPostsContainer.innerHTML = '<p>No se pudieron cargar las entradas del blog. Inténtalo de nuevo más tarde.</p>';
        }
    };

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formStatus = document.getElementById('form-status');
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            if(!formStatus) return;
            formStatus.textContent = 'Enviando...';
            formStatus.style.color = 'var(--text-color)';

            try {
                const response = await fetch(`${API_BASE_URL}/portafolio/contactos_portafolio/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    formStatus.textContent = '¡Gracias por tu mensaje! Te contactaré pronto.';
                    formStatus.style.color = 'green';
                    contactForm.reset();
                } else {
                    throw new Error('Hubo un problema al enviar el mensaje.');
                }

            } catch (error) {
                console.error('Error en el formulario de contacto:', error);
                formStatus.textContent = 'Lo sentimos, ha ocurrido un error. Por favor, inténtalo más tarde.';
                formStatus.style.color = 'red';
            }
        });
    }

    // ==================== INITIALIZE ==================== 
    // 1. Cargar tema guardado (esto es rápido)
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // 2. Comprobar estado de autenticación (rápido, solo lee localStorage)
    checkAuthStatus();

    // 3. Empezar a cargar contenido dinámico (esto puede tardar, pero no bloquea lo demás)
    renderPortfolio();
    renderBlogPosts();
    
    // 4. Iniciar animaciones
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
    }
});
