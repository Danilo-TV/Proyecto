import { getPortfolioItems, getBlogPosts } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {

    const portfolioWrapper = document.getElementById('portfolio-carousel-wrapper');
    const blogWrapper = document.getElementById('blog-carousel-wrapper');

    const FALLBACK_IMAGE_PORTFOLIO = 'https://placehold.co/600x400/1e1e1e/ffffff?text=LuxeConvert';
    const FALLBACK_IMAGE_BLOG = 'https://placehold.co/600x400/1e1e1e/ffffff?text=LuxeConvert';

    // --- RENDER FUNCTIONS ---

    const renderPortfolioItems = (items) => {
        if (!portfolioWrapper) return;
        portfolioWrapper.innerHTML = items.map(item => `
            <div class="swiper-slide">
                <a href="project-detail.html?id=${item.id}" class="portfolio-card">
                    <img src="${item.imagen_despues || FALLBACK_IMAGE_PORTFOLIO}" alt="${item.titulo}" class="portfolio-card__image">
                    <div class="portfolio-card__overlay">
                        <h3 class="portfolio-card__title">${item.titulo}</h3>
                    </div>
                </a>
            </div>
        `).join('');
    };

    const renderBlogPosts = (posts) => {
        if (!blogWrapper) return;
        blogWrapper.innerHTML = posts.map(post => {
            const excerpt = post.contenido ? post.contenido.substring(0, 100) + '...' : 'No hay contenido disponible.';
            return `
                <div class="swiper-slide">
                    <div class="blog-card">
                        <a href="post-detail.html?id=${post.id}" class="blog-card__image-link">
                             <div class="blog-card__image-container">
                                 <img src="${post.imagen_principal || FALLBACK_IMAGE_BLOG}" alt="${post.titulo}" class="blog-card__image">
                             </div>
                        </a>
                        <div class="blog-card__content">
                            <h3 class="blog-card__title">${post.titulo}</h3>
                            <p class="blog-card__excerpt">${excerpt}</p>
                            <a href="post-detail.html?id=${post.id}" class="blog-card__link">Leer más <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    // --- INITIALIZE CAROUSELS ---

    const initializeCarousels = (portfolioItems = [], blogPosts = []) => {
        const maxPortfolioSlides = 3;
        const maxBlogSlides = 3;
        const portfolioLoop = portfolioItems.length > maxPortfolioSlides;
        const blogLoop = blogPosts.length > maxBlogSlides;

        const portfolioCarouselEl = document.querySelector('.portfolio-carousel');
        if (portfolioCarouselEl && portfolioCarouselEl.parentElement) {
            portfolioCarouselEl.parentElement.classList.add('carousel-container');
        }

        const blogCarouselEl = document.querySelector('.blog-carousel');
        if (blogCarouselEl && blogCarouselEl.parentElement) {
            blogCarouselEl.parentElement.classList.add('carousel-container');
        }

        new Swiper('.portfolio-carousel', {
            loop: portfolioLoop,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: { el: '.portfolio-carousel .swiper-pagination', clickable: true },
            navigation: { 
                // **CORRECCIÓN: Invertir selectores para que las flechas funcionen correctamente**
                nextEl: '.portfolio-carousel .swiper-button-prev', 
                prevEl: '.portfolio-carousel .swiper-button-next' 
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: maxPortfolioSlides },
            }
        });

        new Swiper('.blog-carousel', {
            loop: blogLoop,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: { el: '.blog-carousel .swiper-pagination', clickable: true },
            navigation: { 
                // **CORRECCIÓN: Invertir selectores para que las flechas funcionen correctamente**
                nextEl: '.blog-carousel .swiper-button-prev',
                prevEl: '.blog-carousel .swiper-button-next'
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: maxBlogSlides },
            }
        });
    };

    // --- LOAD AND RENDER DATA ---

    const loadData = async () => {
        const [portfolioResult, blogResult] = await Promise.all([ getPortfolioItems(), getBlogPosts() ]);
        
        const portfolioData = portfolioResult.data || [];
        const blogData = blogResult.data || [];

        if (portfolioResult.data) {
            renderPortfolioItems(portfolioData);
        } else {
            if (portfolioWrapper) portfolioWrapper.innerHTML = '<p>No se pudieron cargar las transformaciones.</p>';
        }

        if (blogResult.data) {
            renderBlogPosts(blogData);
        } else {
            if (blogWrapper) blogWrapper.innerHTML = '<p>No se pudieron cargar los artículos.</p>';
        }
        
        initializeCarousels(portfolioData, blogData);
    };

    loadData();
});
