// Main JavaScript file for Daily Fitness Edit

// Head Component - Insert favicon and stylesheets
function insertHeadElements(pageType = 'root') {
    // Check if head elements already exist to prevent duplicates
    if (document.querySelector('link[rel="icon"]')) {
        return; // Already inserted
    }
    
    // Determine the correct path based on page type
    const assetPath = pageType === 'blog' ? '../assets' : 'assets';
    
    // Create the head elements
    const headElements = `
        <!-- Favicon -->
        <link rel="icon" type="image/png" href="${assetPath}/images/DFE-logo.png">
        <link rel="apple-touch-icon" sizes="180x180" href="${assetPath}/images/DFE-logo.png">
        <link rel="manifest" href="${assetPath}/images/site.webmanifest">

        <!-- Additional Meta Tags -->
        <meta name="theme-color" content="#202020">
        <meta name="msapplication-TileColor" content="#202020">
    `;
    
    // Insert the elements into the head
    document.head.insertAdjacentHTML('beforeend', headElements);
    
    // Load stylesheets with proper loading detection
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
function insertNavigation(pageType = 'root', currentPage = '') {
    // Determine the correct paths based on page type
    const homePath = pageType === 'blog' ? '../index.html' : 'index.html';
    const logoPath = pageType === 'blog' ? '../assets/images/DFE-logoH.png' : 'assets/images/DFE-logoH.png';
    const blogPath = pageType === 'blog' ? 'index.html' : 'blog/index.html';
    
    // Create navigation HTML
    const navigationHTML = `
        <header class="site-header">
            <div class="logo">
                <a href="${homePath}">
                    <img src="${logoPath}" alt="Daily Fitness Edit Logo">
                </a>
            </div>
            <div class="header-spacer"></div>
            <button class="hamburger-menu" aria-label="Open menu" onclick="toggleMobileMenu()">
                <span class="hamburger-bar"></span>
                <span class="hamburger-bar"></span>
                <span class="hamburger-bar"></span>
            </button>
        </header>
    `;
    
    // Insert navigation at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navigationHTML);
}


// Footer Component - Insert footer HTML
function insertFooter(pageType = 'root') {
    // Determine the correct paths based on page type
    const privacyPath = pageType === 'blog' ? '../privacy-policy.html' : 'privacy-policy.html';
    const termsPath = pageType === 'blog' ? '../terms-of-service.html' : 'terms-of-service.html';
    
    // Create footer HTML
    const footerHTML = `
        <footer>
            <div class="container">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <p>&copy; 2026 Daily Fitness Edit. All rights reserved.</p>
                        <p>
                            <a href="${privacyPath}">Privacy Policy</a> | 
                            <a href="${termsPath}">Terms of Service</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    `;
    
    // Insert footer at the end of body
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
    hamburger.classList.toggle('active');
}

// Load components immediately when script loads (before DOM ready)
(function() {
    // Check if we're in a subdirectory (blog or pages)
    const isInSubdir = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/pages/');
    const pageType = isInSubdir ? 'blog' : 'root';
    
    // Determine current page for active state
    let currentPage = '';
    if (window.location.pathname.includes('/blog/') || window.location.pathname.includes('/pages/')) {
        currentPage = 'blog';
    } else if (window.location.pathname.includes('quiz.html')) {
        currentPage = 'quiz';
    }
    
    // Insert head elements immediately
    insertHeadElements(pageType);
    
    // Insert navigation and footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!document.querySelector('nav')) {
                insertNavigation(pageType, currentPage);
            }
            if (!document.querySelector('footer')) {
                insertFooter(pageType);
            }
        });
    } else {
        // DOM already loaded
        if (!document.querySelector('nav')) {
            insertNavigation(pageType, currentPage);
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