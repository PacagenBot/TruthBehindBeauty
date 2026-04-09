// Product Showcase Component
// Usage: createProductShowcase({ image: 'img.png', alt: 'Product', url: '...', description: '...', pageType: 'root' })
// Optional: load product-reviews.js before this for review text support

(function() {
    'use strict';

    function resolveImagePath(image, pageType) {
        const assetPath = pageType === 'blog' ? '../assets' : 'assets';
        return image.startsWith('http') || image.startsWith('/')
            ? image
            : `${assetPath}/images/${image}`;
    }

    function createProductShowcase(config) {
        const {
            image,
            alt,
            url,
            description,
            clickable = true,
            pageType = 'root'
        } = config;

        if (!image || !alt) return '';

        const imagePath = resolveImagePath(image, pageType);

        let reviewText = '';
        if (url && typeof getProductReview !== 'undefined' && typeof formatReviewText !== 'undefined') {
            const review = getProductReview(url);
            reviewText = formatReviewText(review);
        }

        if (clickable && url) {
            return `
                <div class="product-card-inline" style="max-width:470px;margin-left:auto;margin-right:auto;">
                    <div class="product-card-image">
                        <img src="${imagePath}" alt="${alt}" style="width:100%;height:250px;object-fit:cover;display:block;">
                    </div>
                    <h3 class="product-card-title">${alt}</h3>
                    ${description ? `<p class="product-card-description" style="padding:0 20px;margin-bottom:6px;">${description}</p>` : ''}
                    <div class="product-card-content">
                        ${reviewText ? `<p class="product-card-reviews">${reviewText}</p>` : ''}
                        <a href="${url}" class="product-card-btn" target="_blank" rel="noopener noreferrer">Shop Now</a>
                    </div>
                </div>
            `.trim();
        } else {
            return `
                <div class="article-content-image d-flex">
                    <img src="${imagePath}" class="article-img" alt="${alt}">
                </div>
            `.trim();
        }
    }

    function insertProductShowcase(targetSelector, config) {
        const target = document.querySelector(targetSelector);
        if (target) {
            target.innerHTML = createProductShowcase(config);
        }
    }

    window.createProductShowcase = createProductShowcase;
    window.insertProductShowcase = insertProductShowcase;
})();
