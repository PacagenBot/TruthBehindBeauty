// Main JavaScript file for Truth Behind Beauty

// Head Component - Insert favicon and stylesheets
function insertHeadElements(pageType = 'root') {
    // Determine the correct path based on page type
    const assetPath = pageType === 'blog' ? '../assets' : 'assets';

    // Only inject favicon tags if not already present in the HTML
    if (!document.querySelector('link[rel="icon"]')) {
        const headElements = `
        <!-- Favicon -->
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">

        <!-- Additional Meta Tags -->
        <meta name="theme-color" content="#202020">
        <meta name="msapplication-TileColor" content="#202020">
    `;
        document.head.insertAdjacentHTML('beforeend', headElements);
    }

    // Always load stylesheets to reveal the page
    loadStylesheets(assetPath);
}

// Load stylesheets and show content when ready
function loadStylesheets(assetPath) {
    let stylesheetsLoaded = 0;
    const totalStylesheets = 2;
    let contentShown = false;
    
    function showContent() {
        if (!contentShown) {
            contentShown = true;
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
        }
    }
    
    function onStylesheetLoad() {
        stylesheetsLoaded++;
        if (stylesheetsLoaded === totalStylesheets) {
            // All stylesheets loaded, show the content
            showContent();
        }
    }
    
    // Fallback: Show content after 2 seconds even if CSS doesn't load
    setTimeout(showContent, 2000);
    
    // Load main stylesheet
    const mainCSS = document.createElement('link');
    mainCSS.rel = 'stylesheet';
    mainCSS.href = `${assetPath}/css/style.css`;
    mainCSS.onload = onStylesheetLoad;
    mainCSS.onerror = onStylesheetLoad; // Show content even if CSS fails
    document.head.appendChild(mainCSS);
    
    // Load Bootstrap CSS
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css';

    // Load Google Fonts (Oswald + Roboto)
    const googleFonts = document.createElement('link');
    googleFonts.rel = 'stylesheet';
    googleFonts.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
    document.head.appendChild(googleFonts);
    bootstrapCSS.integrity = 'sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr';
    bootstrapCSS.crossOrigin = 'anonymous';
    bootstrapCSS.onload = onStylesheetLoad;
    bootstrapCSS.onerror = onStylesheetLoad; // Show content even if CSS fails
    document.head.appendChild(bootstrapCSS);
}

// Navigation Component - Insert navigation HTML
function insertNavigation(pageType = 'root') {
    // Determine the correct paths based on page type
    const homePath = pageType === 'blog' ? '../index.html' : 'index.html';
    const logoPath = pageType === 'blog' ? '../assets/images/TBB-logos.png' : 'assets/images/TBB-logos.png';
    const hotTakesPath = pageType === 'blog' ? 'hot-takes.html' : 'pages/hot-takes.html';
    const spottedPath  = pageType === 'blog' ? 'spotted.html'   : 'pages/spotted.html';
    const reviewsPath  = pageType === 'blog' ? 'reviews.html'   : 'pages/reviews.html';
    const routinesPath = pageType === 'blog' ? 'routines.html'  : 'pages/routines.html';

    // Create navigation HTML
    const navigationHTML = `
        <div class="site-header-wrap">
          <header class="site-header">
              <div class="header-left"></div>
              <div class="logo">
                  <a href="${homePath}">
                      <img src="${logoPath}" alt="Truth Behind Beauty Logo">
                  </a>
              </div>
              <div class="header-right">
                  <button class="hamburger-menu" aria-label="Open menu" onclick="toggleMobileMenu()">
                      <span class="hamburger-bar"></span>
                      <span class="hamburger-bar"></span>
                      <span class="hamburger-bar"></span>
                  </button>
              </div>
          </header>
          <nav class="sub-nav">
              <ul class="sub-nav__list">
                  <li><a href="${hotTakesPath}">Hot Takes</a></li>
                  <li><a href="${spottedPath}">Spotted</a></li>
                  <li><a href="${reviewsPath}">Reviews</a></li>
                  <li><a href="${routinesPath}">Routines</a></li>
              </ul>
          </nav>
        </div>
        <div class="mobile-menu-overlay" id="mobileMenuOverlay">
            <button class="mobile-menu-close" onclick="toggleMobileMenu()">Close</button>
            <nav class="mobile-menu-nav">
                <ul>
                    <li><a href="${hotTakesPath}">Hot Takes</a></li>
                    <li><a href="${spottedPath}">Spotted</a></li>
                    <li><a href="${reviewsPath}">Reviews</a></li>
                    <li><a href="${routinesPath}">Routines</a></li>
                </ul>
            </nav>
        </div>
        <div class="mobile-menu-dim" id="mobileMenuDim" onclick="toggleMobileMenu()"></div>
    `;

    // Insert navigation at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navigationHTML);

    // Keep body padding-top in sync with the combined header height
    const wrap = document.querySelector('.site-header-wrap');
    function syncPadding() {
        document.body.style.paddingTop = wrap.offsetHeight + 'px';
    }
    syncPadding();
    if (window.ResizeObserver) {
        new ResizeObserver(syncPadding).observe(wrap);
    } else {
        window.addEventListener('resize', syncPadding);
    }
}


// Footer Component - Insert footer HTML
function insertFooter(pageType = 'root') {
    const privacyPath = pageType === 'blog' ? '../privacy-policy.html' : 'privacy-policy.html';
    const termsPath = pageType === 'blog' ? '../terms-of-service.html' : 'terms-of-service.html';
    const homePath = pageType === 'blog' ? '../index.html' : 'index.html';
    const hotTakesPath = pageType === 'blog' ? 'hot-takes.html' : 'pages/hot-takes.html';
    const spottedPath  = pageType === 'blog' ? 'spotted.html'   : 'pages/spotted.html';
    const reviewsPath  = pageType === 'blog' ? 'reviews.html'   : 'pages/reviews.html';
    const routinesPath = pageType === 'blog' ? 'routines.html'  : 'pages/routines.html';

    const footerHTML = `
        <footer class="tbb-footer">
            <div class="tbb-footer-main">
                <div class="row g-0 justify-content-lg-center">
                    <!-- Keep in touch -->
                    <div class="col-12 col-lg-3 tbb-footer-col tbb-footer-keep-touch order-4 order-lg-1">
                        <p class="tbb-footer-kit">Keep in touch</p>
                        <div class="tbb-footer-social-icons">
                            <a href="https://www.instagram.com/truth_behindbeauty/" target="_blank" rel="noopener noreferrer" class="tbb-footer-social-link" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                    <circle cx="12" cy="12" r="4"/>
                                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61564705677207" target="_blank" rel="noopener noreferrer" class="tbb-footer-social-link" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <!-- Nav links -->
                    <div class="col-12 col-lg-3 tbb-footer-col tbb-footer-nav-col order-3 order-lg-2">
                        <ul class="tbb-footer-nav">
                            <li><a href="${hotTakesPath}">HOT TAKES</a></li>
                            <li><a href="${spottedPath}">SPOTTED</a></li>
                            <li><a href="${reviewsPath}">REVIEWS</a></li>
                            <li><a href="${routinesPath}">ROUTINES</a></li>
                            <li><a href="${homePath}">HOME</a></li>
                        </ul>
                    </div>
                    <!-- Newsletter -->
                    <div class="col-12 col-lg-4 tbb-footer-col tbb-footer-newsletter-col order-1 order-lg-3">
                        <p class="tbb-footer-newsletter-heading"><em>Subscribe To Our</em> <strong>NEWSLETTER</strong></p>
                        <form class="tbb-footer-form" onsubmit="return false;">
                            <input type="email" placeholder="someone@gmail.com" aria-label="Email address">
                            <button type="submit" aria-label="Subscribe">&#8594;</button>
                        </form>
                        <p class="tbb-footer-disclaimer">By clicking signing up, you agree to receive emails from Truth Behind Beauty and accept our web terms of use and privacy and cookie policy.</p>
                    </div>
                </div>
            </div>
            <div class="tbb-footer-bottom">
                <p>&copy; 2026 Truth Behind Beauty. All rights reserved. | <a href="${termsPath}">Terms of Service</a> and <a href="${privacyPath}">Privacy Policy</a>.</p>
            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

//Quote Component - Reusbale testimonial block
function createQuoteComponent({ testimonial, author}) {
    return `
        
        <div class="quote-card p-3 my-3 border rounded-4">
            <p class="quote-text fs-5 fst-italic m-2 text-left">“${testimonial}”</p>
            <p class="quote-author fw-semibold mb-1" style="text-align: right; margin-right: 40px;">– ${author}</p>
        </div>
    
    `;
}

// Image Component - Reusable image + caption block
function createImageComponent({ src, alt, caption }) {
    // Adjust image path if needed (for blog pages, etc.)
   
    
    return `
      <div class="d-flex flex-column align-items-center my-4">
        <img 
          src="assets/images/${src}" 
          alt="${alt}" 
          class="rounded-2 mb-2 img-fluid"
          style="width: 100%; height: auto;"
        >
        <p class="text-muted text-center small">${caption}</p>
      </div>
    `;
  }


// Hamburger menu toggle
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const dim = document.getElementById('mobileMenuDim');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    dim.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
}

// Load components immediately when script loads (before DOM ready)
(function() {
    // Check if we're in a subdirectory (blog or pages)
    const isInSubdir = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/pages/');
    const pageType = isInSubdir ? 'blog' : 'root';
    
    // Insert head elements immediately
    insertHeadElements(pageType);
    
    // Insert navigation and footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!document.querySelector('nav')) {
                insertNavigation(pageType);
            }
            if (!document.querySelector('footer')) {
                insertFooter(pageType);
            }
        });
    } else {
        // DOM already loaded
        if (!document.querySelector('nav')) {
            insertNavigation(pageType);
        }
        if (!document.querySelector('footer')) {
            insertFooter(pageType);
        }
    }
})();

function createProductShowcase(config) {
    const {
        image,
        alt,
        url,
        description,
        clickable = true,
        pageType = 'root'
    } = config;

    reviews ={
        "https://www.pacagen.com/products/cat-allergen-neutralizing-spray": ["4.72 out of 5 stars", "(600+ reviews)"],
        "https://www.pacagen.com/products/dog-allergen-neutralizing-spray": ["4.87 out of 5 stars", ""],
        "https://www.pacagen.com/products/dust-allergen-neutralizing-spray": ["4.86 out of 5 stars", ""],
        "https://www.pacagen.com/products/cat-food-topper-chicken": ["4.80 out of 5 stars", "(200+ reviews)"],
        "https://www.pacagen.com/products/cat-allergen-reducing-supplement": ["4.80 out of 5 stars", "(200+ reviews)"],
        "https://www.pacagen.com/products/allergen-neutralizing-spray": ["4.72 out of 5 stars", "(600+ reviews)"]
    }
    
    // Determine the correct asset path
    const assetPath = pageType === 'blog' ? '../assets' : 'assets';
    
    if (clickable && url) {
        return `
        <a href="javascript:void(0)" class="d-flex w-md-65 justify-content-center align-items-center text-decoration-none" onclick="f('${url}')">
            <div class="card p-2 mt-3 mb-3">
                <div class="row mx-auto">
                    <div class="col-5 col-sm-4 col-md-3 p-0 px-md-2">
                        <img src="${assetPath}/images/${image}" class=" rounded-4" alt="${alt}">
                    </div>
                    <div class="col-7 my-auto col-sm-8 col-md-9">
                        <h3 class="card-title"><b>${alt}</b></h3>
                        <p class="card-reviews mb-1">★★★★★ &nbsp ${reviews[url][0]} ${reviews[url][1]}</p>
                        <p class="card-description mb-0">${description}</p>
                        <div class="ctabutton mt-2">Claim your 15% off now</div>
                    </div>
                </div>
            </div>
        </a>
        `;
    } else {
        return `
            <div class="article-content-image d-flex">
                <img src="${assetPath}/images/${image}" class="article-img" alt="${alt}">
            </div>
        `;
    }
}

// Function to insert product showcase into page
function insertProductShowcase(targetSelector, config) {
    const target = document.querySelector(targetSelector);
    if (target) {
        target.insertAdjacentHTML('afterend', createProductShowcase(config));
    }
}


// Wait for DOM to be fully loaded for additional functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});