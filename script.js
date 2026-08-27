document.addEventListener('DOMContentLoaded', function() {
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

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
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

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

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

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 50;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        const duration = Math.random() * 3 + 3;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(particle);
    }
}

function initTypewriter() {
    const el = document.querySelector('.typewriter');
    if (!el) return;
    const text = el.getAttribute('data-text') || 'Mohammad Abu Yahya';
    let i = 0;
    const speed = 100;
    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            el.classList.add('cursor');
        }
    }
    setTimeout(type, 500);
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section, .project-card, .timeline-item, .cert-card')
        .forEach(el => observer.observe(el));
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const increment = target / 50;
                    let current = 0;
                    const update = () => {
                        if (current < target) {
                            current += increment;
                            if (current > target) current = target;
                            counter.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(2);
                            setTimeout(update, 20);
                        } else {
                            counter.textContent = target % 1 === 0 ? target.toString() : target.toFixed(2);
                        }
                    };
                    update();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) observer.observe(statsSection);
}

function initCertificateModal() {
    const modal = document.getElementById('cert-modal');
    const previewBtns = document.querySelectorAll('.cert-preview-btn');
    const closeBtn = document.querySelector('.close');
    if (!modal) return;

    const certContent = {
        'ejptv2': `<div class="cert-preview-content"><h4>eJPTv2 - Preparation Course</h4><p>INE Security</p><p>The eJPTv2 preparation course covers essential penetration testing skills including network scanning, vulnerability assessment, web application attacks, and post-exploitation techniques.</p><div class="cert-details"><p><strong>Topics Covered:</strong></p><ul><li>Network Penetration Testing</li><li>Web Application Security</li><li>Vulnerability Assessment</li><li>Report Writing</li><li>Ethical Hacking Methodology</li></ul></div></div>`,
        'iso27001': `<div class="cert-preview-content"><h4>ISO/IEC 27001 Lead Auditor</h4><p>Mastermind Assurance</p><p>This certification demonstrates the ability to perform and lead Information Security Management System (ISMS) audits in accordance with ISO 27001 standards.</p><div class="cert-details"><p><strong>Skills Acquired:</strong></p><ul><li>ISMS Audit Planning</li><li>Risk Assessment Methodologies</li><li>Compliance Verification</li><li>Audit Reporting</li><li>Continual Improvement</li></ul></div></div>`,
        'google-cyber': `<div class="cert-preview-content"><h4>Cybersecurity Certificate</h4><p>Google</p><p>This comprehensive program covers foundational cybersecurity concepts, tools, and best practices for protecting systems and networks from cyber threats.</p><div class="cert-details"><p><strong>Key Areas:</strong></p><ul><li>Security Fundamentals</li><li>Network Defense</li><li>Incident Response</li><li>Security Operations</li><li>Risk Management</li></ul></div></div>`,
        'peh': `<div class="cert-preview-content"><h4>Practical Ethical Hacker</h4><p>TCM Security</p><p>Hands-on training in ethical hacking methodologies, tools, and techniques used by professional penetration testers and security researchers.</p><div class="cert-details"><p><strong>Practical Skills:</strong></p><ul><li>Reconnaissance Techniques</li><li>Exploitation Methods</li><li>Privilege Escalation</li><li>Persistence Mechanisms</li><li>Post-Exploitation</li></ul></div></div>`,
        'soc101': `<div class="cert-preview-content"><h4>SOC 101</h4><p>TCM Security</p><p>Foundational training in Security Operations Center (SOC) operations, including monitoring, detection, analysis, and response to security incidents.</p><div class="cert-details"><p><strong>Covered Topics:</strong></p><ul><li>SIEM Operations</li><li>Threat Detection</li><li>Incident Response Procedures</li><li>Security Monitoring</li><li>Alert Triage</li></ul></div></div>`
    };

    previewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const certId = this.getAttribute('data-cert');
            const card = this.closest('.cert-card');
            const title = card.querySelector('h3').textContent;
            document.getElementById('modal-cert-title').textContent = title;
            document.getElementById('modal-cert-content').innerHTML = certContent[certId] || '<p>Certificate details not available.</p>';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && modal.style.display === 'block') closeModal(); });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        emailjs.sendForm('service_20f3ekj', 'template_t6kx8ju', this)
            .then(() => {
                showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            })
            .catch((error) => {
                showNotification('❌ Failed to send message. Please try again.', 'error');
                console.error('EmailJS Error:', error);
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

function initSkillBars() {
    const bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.getAttribute('data-skill') + '%';
            }
        });
    }, { threshold: 0.5 });
    bars.forEach(bar => observer.observe(bar));
}

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => observer.observe(img));
}

function initPerformanceOptimizations() {
    let ticking = false;
    function update() { updateActiveNavLink(); ticking = false; }
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    });
}

function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() { validateField(this); });
        input.addEventListener('input', function() { clearFieldError(this); });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    switch (field.type) {
        case 'text':
            if (field.id === 'name' && value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;
        case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
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
    const existing = field.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
    field.style.borderColor = '';
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.className = 'notification ' + type;
    notification.style.display = 'block';
    setTimeout(() => { notification.style.display = 'none'; }, 5000);
}

window.addEventListener('beforeunload', function() { window.scrollTo(0, 0); });
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) img.classList.add('loaded');
        else img.addEventListener('load', function() { this.classList.add('loaded'); });
    });
});
