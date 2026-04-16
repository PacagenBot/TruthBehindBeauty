// Newsletter Component
// Usage: insertNewsletter('#target', { tagline: 'Get the truth delivered weekly.', pageType: 'blog' })

(function () {
    'use strict';

    if (!document.getElementById('tbb-newsletter-styles')) {
        var style = document.createElement('style');
        style.id = 'tbb-newsletter-styles';
        style.textContent = `
            .tbb-newsletter {
                display: flex;
                align-items: center;
                margin: 3rem 0;
                padding: 2rem 0;
                border-top: 2px solid #111;
                border-bottom: 1px solid #e0e0e0;
                gap: 2rem;
                background: #fff;
            }
            .tbb-newsletter-brand {
                font-family: 'Oswald', Arial, sans-serif;
                font-size: clamp(1rem, 2vw, 1.2rem);
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #111;
                margin: 0;
                line-height: 1.2;
                flex: 0 0 auto;
            }
            .tbb-newsletter-right {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            .tbb-newsletter-tagline {
                font-family: Georgia, serif;
                font-size: clamp(0.88rem, 1.8vw, 1rem);
                color: #444;
                margin: 0;
                flex: 1;
                min-width: 160px;
            }
            .tbb-newsletter-form {
                display: flex;
                gap: 0;
            }
            .tbb-newsletter-input {
                border: 1px solid #ccc;
                border-right: none;
                border-radius: 2px 0 0 2px;
                padding: 0.5rem 0.9rem;
                font-size: 0.85rem;
                font-family: Arial, sans-serif;
                outline: none;
                width: 200px;
            }
            .tbb-newsletter-input:focus { border-color: #111; }
            .tbb-newsletter-btn {
                background-color: #111;
                color: #fff;
                border: 1px solid #111;
                border-radius: 0 2px 2px 0;
                padding: 0.5rem 1rem;
                font-family: 'Oswald', Arial, sans-serif;
                font-size: 0.78rem;
                font-weight: 600;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                cursor: pointer;
                white-space: nowrap;
                transition: background-color 0.2s;
            }
            .tbb-newsletter-btn:hover { background-color: #333; }
            @media (max-width: 576px) {
                .tbb-newsletter { flex-direction: column; align-items: flex-start; gap: 1rem; }
                .tbb-newsletter-input { width: 100%; }
                .tbb-newsletter-form { width: 100%; }
                .tbb-newsletter-input { flex: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    function resolveLogoPath(pageType) {
        return pageType === 'blog' ? '../assets/images/TBB-logos.png' : 'assets/images/TBB-logos.png';
    }

    function createNewsletter(config) {
        var tagline = config.tagline || 'Get the truth delivered weekly.';
        var pageType = config.pageType || 'root';
        var logoSrc = resolveLogoPath(pageType);

        return '<div class="tbb-newsletter">' +
            '<p class="tbb-newsletter-brand">Truth Behind Beauty</p>' +
            '<div class="tbb-newsletter-right">' +
            '<p class="tbb-newsletter-tagline">' + tagline + '</p>' +
            '<form class="tbb-newsletter-form" onsubmit="return false;">' +
            '<input type="email" class="tbb-newsletter-input" placeholder="your@email.com" aria-label="Email address">' +
            '<button type="submit" class="tbb-newsletter-btn">Subscribe Now</button>' +
            '</form>' +
            '</div>' +
            '</div>';
    }

    function insertNewsletter(selector, config) {
        var target = document.querySelector(selector);
        if (target) target.innerHTML = createNewsletter(config);
    }

    window.createNewsletter = createNewsletter;
    window.insertNewsletter = insertNewsletter;
})();
