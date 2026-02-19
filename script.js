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
    initFormValidation();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
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
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
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
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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
    if (!particlesContainer) return;
    
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
    
    // Random animation
    const duration = Math.random() * 3 + 3;
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(particle);
}

// Typewriter effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const text = typewriterElement.getAttribute('data-text') || 'Mohammad Abu Yahya';
    let i = 0;
    const speed = 100;
    
    function typeWriter() {
        if (i < text.length) {
            typewriterElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            typewriterElement.classList.add('cursor');
        }
    }
    
    // Start the typewriter effect
    setTimeout(typeWriter, 500);
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
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.section, .project-card, .timeline-item, .cert-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Counter animations
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const increment = target / 50;
                    let current = 0;
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            if (current > target) current = target;
                            
                            // Format number based on decimal places
                            if (target % 1 === 0) {
                                counter.textContent = Math.floor(current);
                            } else {
                                counter.textContent = current.toFixed(2);
                            }
                            
                            setTimeout(updateCounter, 20);
                        } else {
                            counter.textContent = target % 1 === 0 ? target.toString() : target.toFixed(2);
                        }
                    };
                    
                    updateCounter();
                });
                observer.unobserve(entry.target);
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
                <h4>eJPTv2 - Preparation Course</h4>
                <p>INE Security</p>
                <p>The eJPTv2 preparation course covers essential penetration testing skills including network scanning, vulnerability assessment, web application attacks, and post-exploitation techniques.</p>
                <div class="cert-details">
                    <p><strong>Topics Covered:</strong></p>
                    <ul>
                        <li>Network Penetration Testing</li>
                        <li>Web Application Security</li>
                        <li>Vulnerability Assessment</li>
                        <li>Report Writing</li>
                        <li>Ethical Hacking Methodology</li>
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
                        <li>Continual Improvement</li>
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
                        <li>Risk Management</li>
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
                        <li>Post-Exploitation</li>
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
                        <li>Alert Triage</li>
                    </ul>
                </div>
            </div>
        `
    };
    
    // Open modal on button click
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const certId = this.getAttribute('data-cert');
            const certCard = this.closest('.cert-card');
            const title = certCard.querySelector('h3').textContent;
            
            document.getElementById('modal-cert-title').textContent = title;
            document.getElementById('modal-cert-content').innerHTML = 
                certContent[certId] || '<p>Certificate details not available.</p>';
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Use EmailJS for form submission
            emailjs.sendForm("service_20f3ekj", "template_t6kx8ju", this)
                .then(function() {
                    showNotification("✅ Message sent successfully! I'll get back to you soon.", "success");
                    contactForm.reset();
                }, function(error) {
                    showNotification("❌ Failed to send message. Please try again.", "error");
                    console.error('EmailJS Error:', error);
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Toggle body scroll
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
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    if (skillBars.length === 0) return;
    
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
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
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
    
    window.addEventListener('scroll', requestTick);
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (field.type) {
        case 'text':
            if (field.id === 'name') {
                if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'textarea':
            if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--danger-color)';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'var(--danger-color)';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// Notification system
function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = "notification " + type;
    notification.style.display = "block";
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.style.display = "none";
    }, 5000);
}

// Smooth scroll to top on page refresh
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// Initialize on load
window.addEventListener('load', function() {
    // Add loaded class for fade-in effects
    document.body.classList.add('loaded');
    
    // Preload images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
});
