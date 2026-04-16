// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only smoothly scroll internal section anchors
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // External routes (like index.html) will simply let the browser handle the redirect organically.
        });
    });

    // Intersection Observer for fade-in animations
    // To make elements fade in as they scroll into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply starting styles and observe glass cards / items
    const animatedElements = document.querySelectorAll('.glass-card, .glass-item, .section-header');
    
    animatedElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeObserver.observe(el);
    });

    // Subtly hide and unhide navbar on scroll / hover
    const navbar = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (window.pageYOffset > 50) {
            // Trigger threshold is the top 90px of screen
            if (e.clientY <= 90) {
                navbar.classList.remove('hidden');
            } else {
                navbar.classList.add('hidden');
            }
        }
    });

    // Tabs Logic for Design Gallery
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // PDF Modal Logic
    const pdfLinks = document.querySelectorAll('.portfolio-link');
    const pdfModal = document.getElementById('pdf-modal');
    const pdfFrame = document.getElementById('pdf-frame');
    const closeModal = document.querySelector('.close-modal');

    pdfLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pdfUrl = this.getAttribute('data-pdf');
            if(pdfUrl) {
                pdfFrame.src = pdfUrl;
                pdfModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            pdfModal.classList.remove('active');
            setTimeout(() => { pdfFrame.src = ""; }, 300); // Clear src after animation finishes
            document.body.style.overflow = '';
        });
    }

    // Close modal on outside click
    if (pdfModal) {
        pdfModal.addEventListener('click', (e) => {
            if(e.target === pdfModal) {
                closeModal.click();
            }
        });
    }

    // Image Modal Lightbox Logic
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeImageModal = document.querySelector('.close-image-modal');
    const galleryItems = document.querySelectorAll('.glass-item img');

    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            if (modalImage && imageModal) {
                modalImage.src = this.src;
                imageModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeImageModal && imageModal) {
        closeImageModal.addEventListener('click', () => {
            imageModal.classList.remove('active');
            setTimeout(() => { modalImage.src = ""; }, 300);
            document.body.style.overflow = '';
        });

        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal.click();
            }
        });
    }

    // Toggle Show More / Show Less Logic
    const toggleBtns = document.querySelectorAll('.toggle-more-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const grid = document.getElementById(targetId);
            if (grid) {
                if (grid.classList.contains('expanded')) {
                    grid.classList.remove('expanded');
                    this.textContent = 'Show More';
                } else {
                    grid.classList.add('expanded');
                    this.textContent = 'Show Less';
                }
            }
        });
    });

    // Custom Glassmorphism Ambient Glow Cursor
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    // Trail Cursor Elements
    const dots = [];
    const numDots = 7;
    // Premium color palette mirroring your neon assets
    const colors = ['#38bdf8', '#8b5cf6', '#ec4899', '#f43f5e', '#38bdf8', '#8b5cf6', '#ec4899']; 

    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot';
        dot.style.backgroundColor = colors[i];
        
        // Downscale nodes exponentially as they trail backwards
        const scale = 1 - (i / numDots);
        const size = 12 * scale; 
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.opacity = scale;
        
        document.body.appendChild(dot);
        dots.push({ element: dot, x: 0, y: 0 });
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Let the massive ambient glow jump instantly to prevent base background jitter
        requestAnimationFrame(() => {
            cursorGlow.style.left = mouseX + 'px';
            cursorGlow.style.top = mouseY + 'px';
        });
    });

    const animateTrail = () => {
        let x = mouseX;
        let y = mouseY;

        // Iterate through all dots and ease them sequentially towards the node immediately preceding them
        dots.forEach((dot, index) => {
            // Lerp tracking equation dictating speed and elasticity (0.3 is very smooth)
            dot.x += (x - dot.x) * 0.3;
            dot.y += (y - dot.y) * 0.3;
            
            dot.element.style.left = dot.x + 'px';
            dot.element.style.top = dot.y + 'px';

            x = dot.x;
            y = dot.y;
        });

        requestAnimationFrame(animateTrail);
    };

    animateTrail();

    // ==========================================
    // Native AJAX Form Submission (No Redirects)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Stop normal HTML execution pulling user to formspree.io
            
            const data = new FormData(contactForm);
            const originalBtnText = submitBtn.innerText;
            
            // Visual loading deployment
            submitBtn.innerText = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            try {
                // Pipe exactly to your Formspree ID via internal secure network fetch mapping
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.reset();
                    formStatus.innerText = "Thanks for reaching out. I’ll get back to you soon.";
                    formStatus.style.display = "block";
                    formStatus.style.color = "var(--primary-accent)";
                } else {
                    formStatus.innerText = "Oops! Something went wrong.";
                    formStatus.style.display = "block";
                    formStatus.style.color = "#f43f5e"; // Error layout color mapping 
                }
            } catch (error) {
                formStatus.innerText = "Oops! Network error.";
                formStatus.style.display = "block";
                formStatus.style.color = "#f43f5e";
            } finally {
                // Restore button state constraints
                submitBtn.innerText = originalBtnText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }
        });
    }

    // Endorsement Read More Toggle
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        const quoteText = btn.previousElementSibling;
        
        // Hide button if text doesn't overflow 8 lines
        setTimeout(() => {
            if (quoteText.scrollHeight <= quoteText.clientHeight) {
                btn.style.display = 'none';
            }
        }, 100);

        btn.addEventListener('click', function() {
            if (quoteText.style.webkitLineClamp === 'unset') {
                quoteText.style.webkitLineClamp = '8';
                this.textContent = 'Read more';
            } else {
                quoteText.style.webkitLineClamp = 'unset';
                this.textContent = 'Read less';
            }
        });
    });

});
