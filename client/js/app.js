document.addEventListener('DOMContentLoaded', () => {

    // URL Base de la API de Django. ¡Asegúrate de que el puerto sea el correcto!
    const API_BASE_URL = 'http://127.0.0.1:8000';

    // MANEJO DEL PRELOADER
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
    });

    // CARGA DINÁMICA DE COMPONENTES (NAV & FOOTER)
    const loadComponent = (url, placeholderId, callback) => {
        // Se añade un parámetro anti-caché para asegurar que se carga la última versión
        fetch(`${url}?v=${new Date().getTime()}`)
            .then(response => {
                if (!response.ok) throw new Error(`Error al cargar ${url}: ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                }
                if (callback) callback();
            })
            .catch(error => console.error(`Fallo al cargar ${placeholderId}:`, error));
    };

    // LÓGICA COMPLETA DE MENÚ DE USUARIO Y CAMBIO DE TEMA
    function initializeUserMenuAndTheme() {
        const loggedOutMenu = document.getElementById('logged-out-menu');
        const loggedInMenu = document.getElementById('logged-in-menu');
        const userMenuToggle = document.getElementById('user-menu-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        const logoutButton = document.getElementById('logout-button');
        const usernameDisplay = document.querySelector('#logged-in-menu .username-display');
        const usernameDropdownDisplay = document.getElementById('username-dropdown-display');
        const themeToggles = Array.from(document.querySelectorAll('[id^="theme-toggle-"]'));

        const checkLoginState = () => {
            const token = localStorage.getItem('authToken');
            const username = localStorage.getItem('username');

            if (token && username) {
                if (loggedInMenu) loggedInMenu.classList.add('show-menu');
                if (loggedOutMenu) loggedOutMenu.classList.remove('show-menu');
                if (usernameDisplay) usernameDisplay.textContent = username;
                if (usernameDropdownDisplay) usernameDropdownDisplay.textContent = username;
            } else {
                if (loggedOutMenu) loggedOutMenu.classList.add('show-menu');
                if (loggedInMenu) loggedInMenu.classList.remove('show-menu');
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

        if (userDropdown) {
            userDropdown.addEventListener('click', (e) => e.stopPropagation());
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                window.location.reload();
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

    // CONEXIÓN CON API DEL BLOG Y RENDERIZADO
    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    
    const createPostCard = (post) => {
        const postData = {
            id: post.id,
            titulo: post.titulo || 'Sin título',
            fecha: formatDate(post.fecha_publicacion),
            autor: post.autor_username || 'Anónimo',
            imagen_url: post.imagen_principal || 'https://images.unsplash.com/photo-1570498839593-e565b39455fc?q=80&w=800&auto=format&fit=crop'
        };
        return `
            <div class="blog-card" data-aos="fade-up">
                <img src="${postData.imagen_url}" alt="${postData.titulo}" loading="lazy">
                <div class="blog-card-content">
                    <h3>${postData.titulo}</h3>
                    <p class="blog-card-meta">Por ${postData.autor} el ${postData.fecha}</p>
                    <a href="post-detail.html?id=${postData.id}" class="cta-link">Leer Más &rarr;</a>
                </div>
            </div>
        `;
    };

    const loadBlogPosts = async () => {
        const blogPreviewContainer = document.getElementById('blog-posts-preview');
        const blogFullContainer = document.getElementById('blog-posts-container');
        if (!blogPreviewContainer && !blogFullContainer) return;

        try {
            const response = await fetch(`${API_BASE_URL}/blog/posts_blog/`);
            if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
            const posts = await response.json();

            if (blogPreviewContainer) {
                blogPreviewContainer.innerHTML = '';
                posts.slice(0, 3).forEach(post => blogPreviewContainer.innerHTML += createPostCard(post));
            }
            if (blogFullContainer) {
                blogFullContainer.innerHTML = '';
                posts.forEach(post => blogFullContainer.innerHTML += createPostCard(post));
            }
        } catch (error) {
            console.error('Error al cargar las entradas del blog:', error);
            const errorMessage = '<p>No se pudieron cargar las entradas. Verifique la conexión con la API.</p>';
            if (blogPreviewContainer) blogPreviewContainer.innerHTML = errorMessage;
            if (blogFullContainer) blogFullContainer.innerHTML = errorMessage;
        }
    };
    
    // CONEXIÓN CON API DEL PORTAFOLIO Y RENDERIZADO
    const createProjectCard = (project, isFullPage) => {
        const imageUrl = project.imagen_antes || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop';
        
        if (isFullPage) {
            return `
                <div class="blog-card" data-aos="fade-up">
                    <img src="${imageUrl}" alt="${project.titulo}" loading="lazy">
                    <div class="blog-card-content">
                        <h3>${project.titulo}</h3>
                        <p>${project.descripcion}</p>
                        <a href="project-detail.html?id=${project.id}" class="cta-link">Ver Detalles &rarr;</a>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="portfolio-item" data-aos="fade-up">
                    <img src="${imageUrl}" alt="${project.titulo}" loading="lazy">
                    <div class="portfolio-info">
                        <h3>${project.titulo}</h3>
                        <p>${project.descripcion.substring(0, 100)}...</p> 
                        <a href="project-detail.html?id=${project.id}" class="cta-link">Ver Proyecto &rarr;</a>
                    </div>
                </div>
            `;
        }
    };

    const loadPortfolioProjects = async () => {
        const portfolioPreviewContainer = document.getElementById('portfolio-gallery');
        const portfolioFullContainer = document.getElementById('portfolio-gallery-container');
        if (!portfolioPreviewContainer && !portfolioFullContainer) return;

        try {
            const response = await fetch(`${API_BASE_URL}/portafolio/items_portafolio/`);
            if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
            const projects = await response.json();
            
            if (portfolioPreviewContainer) {
                portfolioPreviewContainer.innerHTML = '';
                projects.slice(0, 3).forEach(project => {
                    portfolioPreviewContainer.innerHTML += createProjectCard(project, false);
                });
            }
            if (portfolioFullContainer) {
                portfolioFullContainer.innerHTML = '';
                projects.forEach(project => {
                    portfolioFullContainer.innerHTML += createProjectCard(project, true);
                });
            }

        } catch (error) {
            console.error('Error al cargar los proyectos del portafolio:', error);
            const errorMessage = '<p>No se pudieron cargar los proyectos. Verifique la conexión con la API.</p>';
            if (portfolioPreviewContainer) portfolioPreviewContainer.innerHTML = errorMessage;
            if (portfolioFullContainer) portfolioFullContainer.innerHTML = errorMessage;
        }
    };

    // --- INICIALIZACIÓN PRINCIPAL ---
    loadComponent('_nav.html', 'nav-placeholder', () => {
        initializeUserMenuAndTheme();
        loadBlogPosts();
        loadPortfolioProjects();
    });

    loadComponent('_footer.html', 'footer-placeholder', () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 1000, once: true });
        }
    });
});
