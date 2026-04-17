// Ad Side Component
// Desktop: vertical image, fixed in right whitespace beside article
// Mobile: horizontal image, full-width, entire image clickable
// Usage: createAdSide({ ctaUrl: '...', pageType: 'blog', mode: 'desktop'|'mobile', image: 'filename.png' })

(function() {
    'use strict';

    function resolveImagePath(image, pageType) {
        const assetPath = pageType === 'blog' ? '../assets' : 'assets';
        return `${assetPath}/images/${image}`;
    }

    function createAdSide(config) {
        const {
            ctaUrl = '#',
            pageType = 'root',
            mode = 'desktop',
            image
        } = config;

        const defaultImage = mode === 'mobile' ? 'prada_horizontal.png' : 'prada_vertical.png';
        const imagePath = resolveImagePath(image || defaultImage, pageType);

        return `<a href="${ctaUrl}" class="ad-side-link" target="_blank" rel="noopener"><img src="${imagePath}" alt="Ad" class="ad-side-img"><span class="ad-label">Ad</span></a>`;
    }

    window.createAdSide = createAdSide;
})();
