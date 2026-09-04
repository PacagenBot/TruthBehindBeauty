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
        const isClickable = ctaUrl && ctaUrl !== '#';
        const wrapperTag = isClickable ? 'a' : 'div';
        const hrefAttr = isClickable ? `href="${ctaUrl}" target="_blank" rel="noopener"` : '';
        const wrapperClass = isClickable ? 'ad-side-link' : 'ad-side-link ad-side-static';

        return `<${wrapperTag} ${hrefAttr} class="${wrapperClass}"><img src="${imagePath}" alt="Ad" class="ad-side-img"><span class="ad-label">Ad</span></${wrapperTag}>`;
    }

    window.createAdSide = createAdSide;
})();
