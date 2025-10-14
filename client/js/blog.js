document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo. En un futuro, esto vendrá de una API.
    const samplePosts = [
        {
            id: 1,
            title: "Introducción a la Programación Asíncrona en JavaScript",
            author: "Danilo T.",
            date: "15 de Julio, 2024",
            excerpt: "Descubre los conceptos clave de la asincronía en JS, desde callbacks hasta Async/Await, y mejora el rendimiento de tus aplicaciones.",
            imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop",
            postUrl: "post-detail.html?id=1" // Enlace a la página de detalle
        },
        {
            id: 2,
            title: "10 Trucos Esenciales de CSS para Desarrolladores Frontend",
            author: "Danilo T.",
            date: "10 de Julio, 2024",
            excerpt: "Lleva tus habilidades de CSS al siguiente nivel con estos trucos y técnicas que te ayudarán a crear layouts más complejos y animaciones fluidas.",
            imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421b436d?q=80&w=2070&auto=format&fit=crop",
            postUrl: "post-detail.html?id=2"
        },
        {
            id: 3,
            title: "Configurando un Entorno de Desarrollo con Docker",
            author: "Danilo T.",
            date: "05 de Julio, 2024",
            excerpt: "Aprende a usar Docker para crear entornos de desarrollo consistentes y reproducibles, eliminando el clásico problema de 'en mi máquina funciona'.",
            imageUrl: "https://images.unsplash.com/photo-1617478755421-a45236a880b1?q=80&w=1932&auto=format&fit=crop",
            postUrl: "post-detail.html?id=3"
        },
         {
            id: 4,
            title: "Guía de Inicio Rápido para React Hooks",
            author: "Danilo T.",
            date: "01 de Julio, 2024",
            excerpt: "Entiende y utiliza los hooks más importantes de React como useState, useEffect y useContext para escribir componentes más limpios y funcionales.",
            imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1548&auto=format&fit=crop",
            postUrl: "post-detail.html?id=4"
        }
    ];

    const postsContainer = document.getElementById('blog-posts-container');

    function renderPosts() {
        if (!postsContainer) return;

        // Limpiamos el mensaje de 'Cargando...'
        postsContainer.innerHTML = '';

        // Si no hay posts, mostramos un mensaje
        if (samplePosts.length === 0) {
            postsContainer.innerHTML = '<p>No hay artículos disponibles en este momento.</p>';
            return;
        }

        // Creamos y añadimos cada tarjeta de post
        samplePosts.forEach(post => {
            const postCard = `
                <article class="blog-card" data-aos="fade-up">
                    <img src="${post.imageUrl}" alt="${post.title}" class="blog-card-image" loading="lazy">
                    <div class="blog-card-content">
                        <h3>${post.title}</h3>
                        <div class="post-meta">
                            <span class="author-date">Por ${post.author} / ${post.date}</span>
                        </div>
                        <p class="post-excerpt">${post.excerpt}</p>
                        <a href="${post.postUrl}" class="read-more-btn">Leer Más &rarr;</a>
                    </div>
                </article>
            `;
            postsContainer.innerHTML += postCard;
        });
    }

    renderPosts();
});
