// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initParticles();
    initTypewriter();
    initScrollAnimations();
    initCounters();
    initCertificateModal();
    initContactForm();
    initMobileMenu();
    initSkillBars();
    initLazyLoading();
    initPerformanceOptimizations();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling and active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Particles animation
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size
    const size = Math.random() * 4 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation duration
    const duration = Math.random() * 3 + 3;
    particle.style.animationDuration = duration + 's';
    
    // Random animation delay
    const delay = Math.random() * 2;
    particle.style.animationDelay = delay + 's';
    
    container.appendChild(particle);
}

// Typewriter effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const text = typewriterElement.getAttribute('data-text');
    let i = 0;
    let speed = 100;
    
    function typeWriter() {
        if (i < text.length) {
            typewriterElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // Add blinking cursor after text is complete
            typewriterElement.classList.add('cursor');
        }
    }
    
    // Start the typewriter effect
    setTimeout(typeWriter, 1000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        observer.observe(card);
    });
    
    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Counter animations
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const increment = target / 100;
                    let current = 0;
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            if (current > target) current = target;
                            counter.innerText = target % 1 === 0 ? Math.floor(current) : current.toFixed(2);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target % 1 === 0 ? target : target.toFixed(2);
                        }
                    };
                    
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Certificate Modal
function initCertificateModal() {
    const modal = document.getElementById('cert-modal');
    const previewButtons = document.querySelectorAll('.cert-preview-btn');
    const closeBtn = document.querySelector('.close');
    
    if (!modal) return;
    
    // Certificate preview content
    const certContent = {
        'ejptv2': `
            <div class="cert-preview-content">
                <h4>eJPTv2 - prep course</h4>
                <p>INE Security</p>
                <p>The eJPTv2 preparation course covers essential penetration testing skills including network scanning, vulnerability assessment, web application attacks, and post-exploitation techniques.</p>
                <div class="cert-details">
                    <p><strong>Topics Covered:</strong></p>
                    <ul>
                        <li>Network Penetration Testing</li>
                        <li>Web Application Security</li>
                        <li>Vulnerability Assessment</li>
                        <li>Report Writing</li>
                    </ul>
                </div>
            </div>
        `,
        'iso27001': `
            <div class="cert-preview-content">
                <h4>ISO/IEC 27001 Lead Auditor</h4>
                <p>Mastermind Assurance</p>
                <p>This certification demonstrates the ability to perform and lead Information Security Management System (ISMS) audits in accordance with ISO 27001 standards.</p>
                <div class="cert-details">
                    <p><strong>Skills Acquired:</strong></p>
                    <ul>
                        <li>ISMS Audit Planning</li>
                        <li>Risk Assessment Methodologies</li>
                        <li>Compliance Verification</li>
                        <li>Audit Reporting</li>
                    </ul>
                </div>
            </div>
        `,
        'google-cyber': `
            <div class="cert-preview-content">
                <h4>Cybersecurity Certificate</h4>
                <p>Google</p>
                <p>This comprehensive program covers foundational cybersecurity concepts, tools, and best practices for protecting systems and networks from cyber threats.</p>
                <div class="cert-details">
                    <p><strong>Key Areas:</strong></p>
                    <ul>
                        <li>Security Fundamentals</li>
                        <li>Network Defense</li>
                        <li>Incident Response</li>
                        <li>Security Operations</li>
                    </ul>
                </div>
            </div>
        `,
        'peh': `
            <div class="cert-preview-content">
                <h4>Practical Ethical Hacker</h4>
                <p>TCM Security</p>
                <p>Hands-on training in ethical hacking methodologies, tools, and techniques used by professional penetration testers and security researchers.</p>
                <div class="cert-details">
                    <p><strong>Practical Skills:</strong></p>
                    <ul>
                        <li>Reconnaissance Techniques</li>
                        <li>Exploitation Methods</li>
                        <li>Privilege Escalation</li>
                        <li>Persistence Mechanisms</li>
                    </ul>
                </div>
            </div>
        `,
        'soc101': `
            <div class="cert-preview-content">
                <h4>SOC 101</h4>
                <p>TCM Security</p>
                <p>Foundational training in Security Operations Center (SOC) operations, including monitoring, detection, analysis, and response to security incidents.</p>
                <div class="cert-details">
                    <p><strong>Covered Topics:</strong></p>
                    <ul>
                        <li>SIEM Operations</li>
                        <li>Threat Detection</li>
                        <li>Incident Response Procedures</li>
                        <li>Security Monitoring</li>
                    </ul>
                </div>
            </div>
        `,
        'ccna': `
            <div class="cert-preview-content">
                <h4>CCNA prep</h4>
                <p>David Bombal</p>
                <p>Preparation course for Cisco Certified Network Associate (CCNA) certification, covering networking fundamentals, IP connectivity, and network security basics.</p>
                <div class="cert-details">
                    <p><strong>Key Concepts:</strong></p>
                    <ul>
                        <li>Network Fundamentals</li>
                        <li>IP Addressing</li>
                        <li>Routing and Switching</li>
                        <li>Network Security Basics</li>
                    </ul>
                </div>
            </div>
        `
    };
    
    // Open modal on button click
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const certId = this.getAttribute('data-cert');
            const title = this.closest('.cert-card').querySelector('h3').textContent;
            
            document.getElementById('modal-cert-title').textContent = title;
            document.getElementById('modal-cert-content').innerHTML = certContent[certId] || '<p>Certificate details not available.</p>';
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            hideFormErrors();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            const errors = validateForm(name, email, subject, message);
            
            if (errors.length > 0) {
                showFormErrors(errors);
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.getAttribute('data-skill');
                entry.target.style.width = skillLevel + '%';
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        updateActiveNavLink();
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    // Replace the scroll event listener in initNavigation
    window.removeEventListener('scroll', updateActiveNavLink);
    window.addEventListener('scroll', requestTick);
    
    // Preload critical resources
    const criticalLinks = [
        'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Enhanced form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(name, email, subject, message) {
    const errors = [];
    
    if (!name.trim()) errors.push('Name is required');
    if (!email.trim()) errors.push('Email is required');
    else if (!validateEmail(email)) errors.push('Please enter a valid email address');
    if (!subject.trim()) errors.push('Subject is required');
    if (!message.trim()) errors.push('Message is required');
    else if (message.trim().length < 10) errors.push('Message must be at least 10 characters long');
    
    return errors;
}

// Enhanced error handling
function showFormErrors(errors) {
    const errorContainer = document.getElementById('form-errors') || createErrorContainer();
    errorContainer.innerHTML = errors.map(error => `<p class="error-message">${error}</p>`).join('');
    errorContainer.style.display = 'block';
}

function createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'form-errors';
    container.className = 'form-errors';
    const form = document.getElementById('contact-form');
    form.insertBefore(container, form.firstChild);
    return container;
}

function hideFormErrors() {
    const errorContainer = document.getElementById('form-errors');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

