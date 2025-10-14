document.addEventListener('DOMContentLoaded', () => {
    // Replicamos los datos de ejemplo. En una app real, esto vendría de una API o un módulo compartido.
    const samplePosts = [
        {
            id: 1,
            title: "Introducción a la Programación Asíncrona en JavaScript",
            author: "Danilo T.",
            date: "15 de Julio, 2024",
            excerpt: "Descubre los conceptos clave de la asincronía en JS, desde callbacks hasta Async/Await, y mejora el rendimiento de tus aplicaciones.",
            imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2070&auto=format&fit=crop",
            content: `
                <p>La programación asíncrona es un pilar fundamental en JavaScript que permite realizar operaciones de larga duración sin bloquear el hilo principal de ejecución. Esto es crucial para mantener una interfaz de usuario fluida y receptiva.</p>
                <blockquote>En este artículo, exploraremos las diferentes técnicas que JavaScript nos ofrece para manejar la asincronía, comenzando por los clásicos callbacks y terminando con la sintaxis moderna de Async/Await.</blockquote>
                <h2>Callbacks: La Forma Original</h2>
                <p>Un callback es simplemente una función que se pasa como argumento a otra función, con la expectativa de que la función contenedora la llame (call back) en un momento adecuado. Aunque efectivos, los callbacks pueden llevar a un código anidado y difícil de leer, conocido como 'Callback Hell'.</p>
                <h2>Promesas: Un Mejor Enfoque</h2>
                <p>Las promesas (Promises) llegaron para resolver el problema del Callback Hell. Una promesa es un objeto que representa la eventual finalización (o falla) de una operación asíncrona. Permiten encadenar operaciones de una manera mucho más limpia y legible usando <code>.then()</code> para los éxitos y <code>.catch()</code> para los errores.</p>
                <h2>Async/Await: Azúcar Sintáctico</h2>
                <p>La adición de <code>async</code> y <code>await</code> en ES2017 revolucionó la forma en que escribimos código asíncrono. Nos permite escribir código que parece síncrono pero que se ejecuta de manera no bloqueante. Es, en esencia, una forma más elegante de trabajar con promesas, haciendo el código aún más intuitivo.</p>
            `
        },
        // ... (los otros posts también tendrían una propiedad 'content')
    ];

    const postContainer = document.getElementById('post-container');
    const pageTitle = document.querySelector('title');

    function getPostIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'));
    }

    function findPostById(id) {
        // Nota: En una app real, haríamos una petición a la API como /api/posts/${id}
        return samplePosts.find(post => post.id === id);
    }

    function renderPost() {
        const postId = getPostIdFromUrl();
        const post = findPostById(postId);

        if (!postContainer) return;

        if (post) {
            // Actualizamos el título de la página
            pageTitle.textContent = `${post.title} - Mi Portafolio`;

            // Creamos el HTML para el post
            const postHtml = `
                <header class="post-header" data-aos="fade-up">
                    <h1>${post.title}</h1>
                    <div class="post-meta">
                        <span><i class="fas fa-user"></i> Por ${post.author}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${post.date}</span>
                    </div>
                </header>
                <img src="${post.imageUrl}" alt="${post.title}" class="post-featured-image" data-aos="fade-up" data-aos-delay="100">
                <div class="post-content" data-aos="fade-up" data-aos-delay="200">
                    ${post.content || '<p>' + post.excerpt + '</p>'} 
                </div>
            `;
            postContainer.innerHTML = postHtml;
        } else {
            postContainer.innerHTML = '<p>Artículo no encontrado. Por favor, <a href="blog.html">vuelve al blog</a>.</p>';
            pageTitle.textContent = "Artículo no encontrado";
        }
    }

    renderPost();
});
