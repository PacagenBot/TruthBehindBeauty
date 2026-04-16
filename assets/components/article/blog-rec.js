// Blog Recommendation Component
// Usage: insertBlogRec('#target', { articles: [{image, title, url}], pageType: 'blog' })

(function () {
    'use strict';

    // Inject styles once
    if (!document.getElementById('blog-rec-styles')) {
        var style = document.createElement('style');
        style.id = 'blog-rec-styles';
        style.textContent = `
            .blog-rec {
                border-top: 3px solid #aa1313;
                padding-top: 20px;
                margin: 40px 0 0;
            }
            .blog-rec-heading {
                font-family: "Oswald", "Arial", sans-serif;
                font-style: normal;
                font-weight: bold;
                font-size: 1.8rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin: 0 0 16px;
                color: #111;
            }
            .blog-rec-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .blog-rec-item {
                text-decoration: none;
                color: inherit;
                display: block;
            }
            .blog-rec-item img {
                width: 100%;
                aspect-ratio: 16 / 9;
                object-fit: cover;
                display: block;
                margin-bottom: 10px;
            }
            .blog-rec-title {
                font-family: Georgia, serif;
                font-size: 0.92rem;
                line-height: 1.45;
                color: #111;
                margin: 0;
            }
            .blog-rec-item:hover .blog-rec-title {
                text-decoration: underline;
            }
            @media (max-width: 768px) {
                .blog-rec-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function resolveImagePath(image, pageType) {
        var assetPath = pageType === 'blog' ? '../assets' : 'assets';
        return image.startsWith('http') || image.startsWith('/')
            ? image
            : assetPath + '/images/' + image;
    }

    function createBlogRec(config) {
        var articles = (config.articles || []).slice(0, 2);
        var pageType = config.pageType || 'root';

        if (articles.length === 0) return '';

        var items = articles.map(function (a) {
            var src = resolveImagePath(a.image, pageType);
            return '<a class="blog-rec-item" href="' + a.url + '">' +
                '<img src="' + src + '" alt="' + a.title + '">' +
                '<p class="blog-rec-title">' + a.title + '</p>' +
                '</a>';
        }).join('');

        return '<div class="blog-rec">' +
            '<p class="blog-rec-heading">You Might Also Like</p>' +
            '<div class="blog-rec-grid">' + items + '</div>' +
            '</div>';
    }

    function insertBlogRec(selector, config) {
        var target = document.querySelector(selector);
        if (target) {
            target.innerHTML = createBlogRec(config);
        }
    }

    window.createBlogRec = createBlogRec;
    window.insertBlogRec = insertBlogRec;
})();
