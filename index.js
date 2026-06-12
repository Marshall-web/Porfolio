document.addEventListener('DOMContentLoaded', () => {
    // 1. Typewriter Animation
    const phrases = [
        "I build high-performance software systems.",
        "I design interactive, modern web experiences.",
        "I engineer robust backends and clean APIs.",
        "I translate complex concepts into reality."
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');

    function typeWriter() {
        if (!typewriterElement) return;
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 65;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before typing next phrase
        }

        setTimeout(typeWriter, typeSpeed);
    }

    typeWriter();

    // 2. Mobile Navigation Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Hamburger morph animations
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when nav link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // 3. Scroll Progress Indicator & Back to Top & Active Link Observer
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');
    const navLinksAll = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Scroll Progress Bar
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0) {
            const scrolled = (window.pageYOffset / docHeight) * 100;
            if (scrollProgress) scrollProgress.style.width = scrolled + '%';
        }

        // Back to Top Button
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Active Link update
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 220) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Accent Theme Switcher logic
    const customizerToggle = document.getElementById('customizerToggle');
    const customizerPanel = document.getElementById('customizerPanel');
    const themeDots = document.querySelectorAll('.theme-dot');

    if (customizerToggle && customizerPanel) {
        customizerToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            customizerPanel.classList.toggle('active');
        });

        // Close customizer clicking outside
        document.addEventListener('click', (e) => {
            if (!customizerPanel.contains(e.target) && e.target !== customizerToggle) {
                customizerPanel.classList.remove('active');
            }
        });
    }

    // Check cached theme
    const savedTheme = localStorage.getItem('ndm-portfolio-theme') || 'emerald';
    setTheme(savedTheme);

    themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const selectedTheme = dot.getAttribute('data-theme');
            setTheme(selectedTheme);
        });
    });

    function setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('ndm-portfolio-theme', themeName);
        
        themeDots.forEach(dot => {
            if (dot.getAttribute('data-theme') === themeName) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // 5. Scroll Reveal Intersection Observers
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger specific section animations
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                if (entry.target.id === 'stats') {
                    animateStatsCounters();
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Animate Skill Progress Widths
    function animateSkillBars() {
        const progressBars = document.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-progress');
            bar.style.width = targetWidth;
        });
    }

    // Numerical Stats Counter Animation
    let statsAnimated = false;
    function animateStatsCounters() {
        if (statsAnimated) return;
        statsAnimated = true;
        
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds total animation
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;
            
            // Adjust step increment for larger values like 1200
            const increment = target > 100 ? Math.ceil(target / 60) : 1;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.innerHTML = target + '<span>+</span>';
                    clearInterval(counter);
                } else {
                    stat.innerHTML = current + '<span>+</span>';
                }
            }, target > 100 ? 25 : stepTime);
        });
    }

    // 6. Project Filter Tabs
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow for transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(25px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });

    // 7. Contact Form Handling & Validations & Toast Message
    const contactForm = document.getElementById('contactForm');
    const toastContainer = document.getElementById('toastContainer');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const messageInput = document.getElementById('contactMessage');
            let hasError = false;

            // Simple resets
            [nameInput, emailInput, messageInput].forEach(input => {
                if (input) input.style.borderColor = '';
            });

            // Validate fields
            if (!nameInput.value.trim()) {
                nameInput.style.borderColor = '#ef4444';
                hasError = true;
            }
            if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
                emailInput.style.borderColor = '#ef4444';
                hasError = true;
            }
            if (!messageInput.value.trim()) {
                messageInput.style.borderColor = '#ef4444';
                hasError = true;
            }

            if (hasError) {
                showToast("Please fill in all fields with valid information.", "error");
                return;
            }

            // Simulate form submission success
            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                showToast(`Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`, "success");
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function showToast(message, type = 'success') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
        
        toastContainer.appendChild(toast);

        // Remove toast animation sequence
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    }
});