// Ad White Component
// Creates a white-background ad with col-7 image and col-5 tagline + CTA
// Usage: createAdWhite({ image: 'img.png', tagline: '...', ctaText: '...', ctaUrl: '...', pageType: 'root' })

(function() {
    'use strict';

    function resolveImagePath(image, pageType) {
        const assetPath = pageType === 'blog' ? '../assets' : 'assets';
        return image.startsWith('http') || image.startsWith('/')
            ? image
            : `${assetPath}/images/${image}`;
    }

    function createAdWhite(config) {
        const {
            image,
            tagline,
            ctaText,
            ctaUrl,
            pageType = 'root'
        } = config;

        if (!image || !tagline) {
            console.warn('createAdWhite: Missing required parameters');
            return '';
        }

        const imagePath = resolveImagePath(image, pageType);

        const isClickable = ctaUrl && ctaUrl !== '#';
        const wrapperTag = isClickable ? 'a' : 'div';
        const hrefAttr = isClickable ? `href="${ctaUrl}"` : '';
        const wrapperClass = isClickable
            ? 'ad-white-section ad ad-clickable'
            : 'ad-white-section ad';

        const ctaHTML = ctaText ? `<div class="ad-white-cta-wrapper"><span class="ad-white-cta">${ctaText}</span></div>` : '';

        return `
            <${wrapperTag} class="${wrapperClass}" ${hrefAttr}>
              <div class="row g-0 align-items-center">
                <div class="col-7">
                  <img src="${imagePath}" alt="${tagline}" class="ad-white-img img-fluid w-100">
                </div>
                <div class="col-5 ad-white-content" style="padding-left: 20px;">
                  <p class="ad-white-tagline">${tagline}</p>
                  ${ctaHTML}
                </div>
              </div>
              <span class="ad-label">Ad</span>
            </${wrapperTag}>
        `.trim();
    }

    window.createAdWhite = createAdWhite;
})();
