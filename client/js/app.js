document.addEventListener('DOMContentLoaded', () => {

    // ==================== SELECTORS ==================== 
    const API_BASE_URL = 'http://localhost:8000';
    const portfolioGallery = document.getElementById('portfolio-gallery');
    const blogPostsContainer = document.getElementById('blog-posts');
    const contactForm = document.getElementById('contact-form');
    const themeToggle = document.getElementById('theme-toggle');
    const preloader = document.getElementById('preloader');

    // ==================== PRELOADER ==================== 
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // ==================== THEME (DARK/LIGHT MODE) ==================== 
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            themeToggle.classList.replace('fa-sun', 'fa-moon');
        } else {
            themeToggle.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // ==================== API & DYNAMIC CONTENT ==================== 
    const renderPortfolio = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/portafolio/items_portafolio/`);
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
            portfolioGallery.innerHTML = '<p>No se pudieron cargar los proyectos.</p>';
        }
    };

    const renderBlogPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/blog/posts_blog/`);
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
            blogPostsContainer.innerHTML = '<p>No se pudieron cargar las entradas del blog.</p>';
        }
    };

    // ==================== CONTACT FORM ==================== 
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE_URL}/portafolio/contactos_portafolio/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('¡Gracias por tu mensaje! Te contactaré pronto.');
                contactForm.reset();
            } else {
                throw new Error('Hubo un problema al enviar el mensaje.');
            }

        } catch (error) {
            console.error('Error en el formulario de contacto:', error);
            alert('Lo sentimos, ha ocurrido un error. Por favor, inténtalo más tarde.');
        }
    });

    // ==================== TESTIMONIAL SLIDER ==================== 
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) {
                testimonial.classList.add('active');
            }
        });
    }

    if (testimonials.length > 0) {
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000); // Cambia cada 5 segundos
    }


    // ==================== INITIALIZE ==================== 
    renderPortfolio();
    renderBlogPosts();
    AOS.init({ duration: 1000, once: true });
});
