// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Decode and set up email addresses
    setupEncodedEmails();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Skip if just "#" (link to top)
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize Bootstrap tooltips
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Navigation highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
});

/**
 * Apply configuration settings from config.js to the UI elements
 */
function applyConfigToUI() {
    // Make sure the config is loaded
    if (!window.websiteConfig) {
        console.error('Website configuration not found. Make sure config.js is loaded before main.js');
        return;
    }
    
    const config = window.websiteConfig;
    
    // Set project info
    if (document.getElementById('hero-title')) {
        document.getElementById('hero-title').textContent = config.project.name;
    }
    
    if (document.getElementById('hero-description')) {
        document.getElementById('hero-description').textContent = config.project.description;
    }
    
    if (document.getElementById('license-text')) {
        document.getElementById('license-text').textContent = `This project is licensed under the ${config.project.license}`;
    }
    
    // Set all GitHub links
    const githubLinks = [
        'github-btn',
        'github-hero-btn',
        'github-repo-btn',
        'github-star-link'
    ];
    
    githubLinks.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.href = config.links.github;
        }
    });
    
    // Set clone command
    if (document.getElementById('clone-command')) {
        document.getElementById('clone-command').textContent = 
            `git clone ${config.links.github}.git\ncd modsee`;
    }
    
    // Set documentation links
    const docLinks = ['docs-link', 'docs-footer-link'];
    docLinks.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.href = config.links.documentation;
        }
    });
    
    // Set website link
    if (document.getElementById('website-link')) {
        const element = document.getElementById('website-link');
        element.href = config.links.website;
        element.textContent = new URL(config.links.website).hostname;
    }
    
    // Set license link
    if (document.getElementById('license-link')) {
        document.getElementById('license-link').href = config.project.licenseUrl;
    }
}

/**
 * Decode and display encoded email addresses to prevent scraping
 */
function setupEncodedEmails() {
    const encodedEmails = document.querySelectorAll('.encoded-email');
    
    encodedEmails.forEach(element => {
        const name = element.getAttribute('data-name');
        const domain = element.getAttribute('data-domain');
        const tld = element.getAttribute('data-tld');
        
        if (name && domain && tld) {
            // Create the email text in a roundabout way to avoid easy scraping
            const emailAddress = name + String.fromCharCode(64) + domain + '.' + tld;
            
            // Display the email address obfuscated but readable for humans
            element.textContent = name + ' [at] ' + domain + '.' + tld;
            
            element.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'm' + 'a' + 'i' + 'l' + 't' + 'o' + ':' + emailAddress;
            });
            
            element.addEventListener('mouseover', function() {
                this.style.cursor = 'pointer';
                this.style.textDecoration = 'underline';
            });
            
            element.addEventListener('mouseout', function() {
                this.style.textDecoration = 'none';
            });
            
            element.setAttribute('title', 'Click to email us');
        }
    });
} 