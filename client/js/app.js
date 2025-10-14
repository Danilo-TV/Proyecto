document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // MANEJO DEL PRELOADER
    // ===================================================================
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
    });

    // ===================================================================
    // CARGA DINÁMICA DE COMPONENTES E INICIALIZACIÓN
    // ===================================================================
    const loadComponent = (url, placeholderId, callback) => {
        fetch(url)
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

    // Cargar NAV y luego inicializar sus componentes interactivos
    loadComponent('_nav.html', 'nav-placeholder', () => {
        initializeUserMenu();
        initializeThemeSwitcher();
    });

    // Cargar FOOTER y luego inicializar AOS
    loadComponent('_footer.html', 'footer-placeholder', () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 1000, once: true });
        }
    });

    // ===================================================================
    // LÓGICA DEL MENÚ DE USUARIO
    // ===================================================================
    function initializeUserMenu() {
        const loggedInMenu = document.getElementById('logged-in-menu');
        const loggedOutMenu = document.getElementById('logged-out-menu');
        const userMenuToggle = document.getElementById('user-menu-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        const logoutButton = document.getElementById('logout-button');
        const usernameDisplay = document.querySelector('.username-display');
        const usernameDropdownDisplay = document.getElementById('username-dropdown-display');

        const mockUser = { isLoggedIn: false, username: 'JaneDoe' };

        if (mockUser.isLoggedIn) {
            if(loggedInMenu) loggedInMenu.style.display = 'flex';
            if(loggedOutMenu) loggedOutMenu.style.display = 'none';
            if(usernameDisplay) usernameDisplay.textContent = mockUser.username;
            if(usernameDropdownDisplay) usernameDropdownDisplay.textContent = mockUser.username;
        } else {
            if(loggedInMenu) loggedInMenu.style.display = 'none';
            if(loggedOutMenu) loggedOutMenu.style.display = 'flex';
        }

        if (userMenuToggle) {
            userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (userDropdown) userDropdown.classList.toggle('show');
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                alert('Has cerrado sesión.');
                window.location.reload();
            });
        }

        document.addEventListener('click', (e) => {
            if (userDropdown && !userDropdown.contains(e.target) && userMenuToggle && !userMenuToggle.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // ===================================================================
    // LÓGICA DEL INTERRUPTOR DE TEMA (CORREGIDA PARA USAR data-theme)
    // ===================================================================
    function initializeThemeSwitcher() {
        const themeToggles = [
            document.getElementById('theme-toggle-logged-in'),
            document.getElementById('theme-toggle-logged-out')
        ].filter(Boolean);

        const applyTheme = (isDark) => {
            if (isDark) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
            }
            themeToggles.forEach(toggle => { if(toggle) toggle.checked = isDark });
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };

        themeToggles.forEach(toggle => {
            if(toggle) {
                toggle.addEventListener('change', () => applyTheme(toggle.checked));
            }
        });
        
        applyTheme(localStorage.getItem('theme') === 'dark');
    }

    // ===================================================================
    // DATOS DE EJEMPLO Y RENDERIZADO DE CONTENIDO
    // ===================================================================
    const projectsData = [
        { id: 1, titulo: "Plataforma de E-learning Interactiva", descripcion: "Solución completa para educación online con gamificación.", imagen_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop", tags: ["React", "Node.js"] },
        { id: 2, titulo: "Dashboard de Análisis de Datos", descripcion: "Visualización de métricas de negocio en tiempo real.", imagen_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", tags: ["React", "D3.js"] },
        { id: 4, titulo: "Sitio Web E-commerce de Moda", descripcion: "Tienda online con diseño moderno y pasarela de pago.", imagen_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop", tags: ["Vue.js", "Stripe"] }
    ];

    const blogPostsData = [
        { id: 1, titulo: "Desplegando Aplicaciones de Alto Tráfico", categoria: "Backend", fecha: "28 de Feb, 2025", autor: "Usuario Principal", imagen_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" },
        { id: 2, titulo: "Secretos de CSS para Interfaces Modernas", categoria: "Frontend", fecha: "15 de Mar, 2025", autor: "Usuario Principal", imagen_url: "https://images.unsplash.com/photo-1524749292158-7540c2494485?q=80&w=800&auto=format&fit=crop" },
        { id: 3, titulo: "Cómo Estructurar tu Próximo Proyecto Monorepo", categoria: "Arquitectura", fecha: "02 de Abr, 2025", autor: "Usuario Principal", imagen_url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=800&auto=format&fit=crop" }
    ];

    const portfolioGallery = document.getElementById('portfolio-gallery');
    if (portfolioGallery) {
        portfolioGallery.innerHTML = '';
        projectsData.slice(0, 3).forEach(item => {
            portfolioGallery.innerHTML += `
                <div class="portfolio-item" data-aos="fade-up">
                    <img src="${item.imagen_url}" alt="${item.titulo}" loading="lazy">
                    <div class="portfolio-info">
                        <h3>${item.titulo}</h3>
                        <p>${item.descripcion}</p>
                        <a href="project-detail.html?id=${item.id}" class="cta-link">Ver Proyecto &rarr;</a>
                    </div>
                </div>
            `;
        });
    }

    const portfolioFullContainer = document.getElementById('portfolio-gallery-container');
    if (portfolioFullContainer) {
        portfolioFullContainer.innerHTML = '';
        projectsData.forEach(item => {
            portfolioFullContainer.innerHTML += `
                <div class="blog-card" data-aos="fade-up">
                    <img src="${item.imagen_url}" alt="${item.titulo}" loading="lazy">
                    <div class="blog-card-content">
                        <h3>${item.titulo}</h3>
                        <p>${item.descripcion}</p>
                        <a href="project-detail.html?id=${item.id}" class="cta-link">Ver Detalles &rarr;</a>
                    </div>
                </div>
            `;
        });
    }

    const blogPreviewContainer = document.getElementById('blog-posts-preview');
    if (blogPreviewContainer) {
        blogPreviewContainer.innerHTML = '';
        blogPostsData.slice(0, 3).forEach(post => {
            blogPreviewContainer.innerHTML += `
                <div class="blog-card" data-aos="fade-up">
                    <img src="${post.imagen_url}" alt="${post.titulo}" loading="lazy">
                    <div class="blog-card-content">
                        <span class="blog-card-category">${post.categoria}</span>
                        <h3>${post.titulo}</h3>
                        <p class="blog-card-meta">Por ${post.autor} el ${post.fecha}</p>
                        <a href="#" class="cta-link">Leer Más &rarr;</a>
                    </div>
                </div>
            `;
        });
    }

    const blogFullContainer = document.getElementById('blog-posts-container');
    if (blogFullContainer) {
        blogFullContainer.innerHTML = '';
        blogPostsData.forEach(post => {
            blogFullContainer.innerHTML += `
                 <div class="blog-card" data-aos="fade-up">
                    <img src="${post.imagen_url}" alt="${post.titulo}" loading="lazy">
                    <div class="blog-card-content">
                        <span class="blog-card-category">${post.categoria}</span>
                        <h3>${post.titulo}</h3>
                        <p class="blog-card-meta">Por ${post.autor} el ${post.fecha}</p>
                        <a href="#" class="cta-link">Leer Más &rarr;</a>
                    </div>
                </div>
            `;
        });
    }
});