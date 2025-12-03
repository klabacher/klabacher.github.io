document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DO MENU HAMBURGER (MOBILE) ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- 2. NAVBAR STICKY (SOME/APARECE NO SCROLL) ---
    let lastScrollY = window.scrollY;
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) { // Só aplica depois de rolar 100px
            if (window.scrollY > lastScrollY) {
                // Rolando para baixo
                header.classList.add('nav-hidden');
            } else {
                // Rolando para cima
                header.classList.remove('nav-hidden');
            }
        }
        lastScrollY = window.scrollY;
    });

    // --- 3. BARRA DE PROGRESSO DE SCROLL ---
    const progressBar = document.getElementById('scroll-progress-bar');

    const updateProgressBar = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    };

    window.addEventListener('scroll', updateProgressBar);

    // --- 4. BOTÃO "VOLTAR AO TOPO" ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // --- 5. EFEITO DE DIGITAÇÃO (HERO) ---
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const text = typingElement.getAttribute('data-text');
        let index = 0;

        function type() {
            if (index < text.length) {
                typingElement.textContent = text.substring(0, index + 1);
                index++;
                setTimeout(type, 100 + (Math.random() * 100)); // Velocidade de digitação
            } else {
                // Mantém o cursor piscando
                typingElement.style.borderRight = "3px solid var(--accent-cyan)";
                typingElement.classList.add('typing-complete');
            }
        }
        setTimeout(type, 1000); // Delay inicial
    }

    // --- 6. ANIMAÇÕES DE SCROLL (INTERSECTION OBSERVER) ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona delay se especificado no data-attribute
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);

                observer.unobserve(entry.target); // Anima só uma vez
            }
        });
    }, {
        threshold: 0.1 // Ativa quando 10% do elemento está visível
    });

    scrollElements.forEach(el => observer.observe(el));

    // --- 7. SEÇÕES EXPANSÍVEIS (PROJETOS E CASOS) ---
    const toggles = document.querySelectorAll('.collapsible-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.dataset.target;
            const content = document.getElementById(targetId);
            const expandButton = toggle.querySelector('.expand-button');

            if (content && expandButton) {
                expandButton.classList.toggle('expanded');

                if (content.style.maxHeight) {
                    // Fechando
                    content.style.maxHeight = null;
                } else {
                    // Abrindo
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    });

    // --- 8. EFEITO PARALLAX SIMPLES (HERO) ---
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    });

    // --- 9. EFEITO MAGNÉTICO (BOTÕES E CARDS) ---

    // Botões CTA
    document.querySelectorAll('.magnetic-button').forEach(btn => {
        const strength = 0.4; // Força do "puxão"

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * strength;
            const y = (e.clientY - rect.top - rect.height / 2) * strength;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Cards (3D Hover)
    document.querySelectorAll('.magnetic-card').forEach(card => {
        const strength = 0.08; // Força da rotação (menor)

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = (-(y - rect.height / 2) * strength).toFixed(2);
            const rotateY = ((x - rect.width / 2) * strength).toFixed(2);

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

});