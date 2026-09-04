// Ad White Component
// Creates a white-background ad with col-7 image and col-5 tagline + CTA
// Usage: createAdWhite({ image: 'img.png', tagline: '...', ctaText: '...', ctaUrl: '...', pageType: 'root' })

(function() {
    'use strict';

    if (!document.getElementById('ad-white-styles')) {
        var style = document.createElement('style');
        style.id = 'ad-white-styles';
        style.textContent = [
            '.ad-white-section{display:block;background:#fff;border:1px solid #e8e8e8;overflow:hidden;position:relative;text-decoration:none;color:inherit;margin:2rem auto;width:70%}',
            '.ad-white-section .row{min-height:180px;align-items:stretch!important}',
            '.ad-white-section .col-7{align-self:stretch}',
            '.ad-white-section .ad-white-img{display:block;width:100%;height:100%;object-fit:cover}',
            '.ad-white-content{padding:2.5rem 3rem;display:flex;flex-direction:column;justify-content:center;gap:0.5rem}',
            '.ad-white-tagline{font-family:"Proxima Nova","Montserrat",Buvera,sans-serif;font-size:clamp(1rem,2.5vw,1.4rem);font-weight:600;line-height:1.3;color:#222;margin:0}',
            '.ad-white-cta{display:inline-block;background:#aa1313;color:#fff;font-family:"DM Sans",Buvera,sans-serif;font-weight:600;font-size:0.85rem;letter-spacing:0.05em;text-transform:uppercase;padding:0.45rem 1.2rem;border-radius:2px}',
            '.ad-white-section .ad-label{position:absolute;bottom:0.35rem;right:0.5rem;font-size:0.62rem;color:#aaa;font-family:Buvera,sans-serif}',
            '@media(max-width:576px){.ad-white-section{width:100%}.ad-white-section .row{min-height:unset;flex-direction:column}.ad-white-section .col-7,.ad-white-section .col-5{width:100%;max-width:100%;flex:0 0 100%}.ad-white-content{padding:1rem 1.25rem}}'
        ].join('\n');
        document.head.appendChild(style);
    }

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
