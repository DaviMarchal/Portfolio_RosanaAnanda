// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - iniciando script');
    
    // Elementos do DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const contactForm = document.getElementById('contactForm');
    
    console.log('Elementos encontrados:', {
        hamburger: !!hamburger,
        navMenu: !!navMenu,
        navLinks: navLinks.length,
        header: !!header,
        contactForm: !!contactForm
    });
    
    // ===== TAB NAVIGATION SYSTEM =====
    function initTabNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const tabContents = document.querySelectorAll('.tab-content');
        
        function showTab(targetId) {
            // Hide all tabs
            tabContents.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show target tab immediately
            const targetTab = document.querySelector(targetId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`a[href="${targetId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
        
        // Handle navigation clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                showTab(targetId);
                
                // Close mobile menu if open
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Show initial tab (inicio)
        showTab('#inicio');
    }
    
    // Menu Mobile Toggle
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    // Event listeners para o menu mobile
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Initialize tab navigation
    initTabNavigation();
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Header scroll effect
    function handleScroll() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(247, 243, 232, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(247, 243, 232, 0.95)';
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scroll para links internos
    function smoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = header.offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    smoothScroll();
    
    // Animações de scroll (Intersection Observer)
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Adicionar classe fade-in aos elementos que devem ser animados
        const animatedElements = document.querySelectorAll(
            '.course-card, .portfolio-card, .contact-item, .service-text, .profile-text, .stat-item'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
    
    initScrollAnimations();
    
    // Validação e envio do formulário de contato
    function initContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter dados do formulário
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const phone = formData.get('phone').trim();
            const message = formData.get('message').trim();
            
            // Validação básica
            if (!validateForm(name, email, message)) {
                return;
            }
            
            // Criar mensagem para WhatsApp
            const whatsappMessage = createWhatsAppMessage(name, email, phone, message);
            
            // Abrir WhatsApp
            const whatsappUrl = `https://wa.me/5571999732154?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Mostrar mensagem de sucesso
            showNotification('Mensagem enviada! Você será redirecionado para o WhatsApp.', 'success');
            
            // Limpar formulário
            contactForm.reset();
        });
    }
    
    // Função de validação do formulário
    function validateForm(name, email, message) {
        const errors = [];
        
        if (!name || name.length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!email || !isValidEmail(email)) {
            errors.push('E-mail inválido');
        }
        
        if (!message || message.length < 10) {
            errors.push('Mensagem deve ter pelo menos 10 caracteres');
        }
        
        if (errors.length > 0) {
            showNotification(errors.join('\n'), 'error');
            return false;
        }
        
        return true;
    }
    
    // Validar formato de e-mail
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Criar mensagem para WhatsApp
    function createWhatsAppMessage(name, email, phone, message) {
        let whatsappMessage = `*Nova mensagem do site*\n\n`;
        whatsappMessage += `*Nome:* ${name}\n`;
        whatsappMessage += `*E-mail:* ${email}\n`;
        
        if (phone) {
            whatsappMessage += `*Telefone:* ${phone}\n`;
        }
        
        whatsappMessage += `\n*Mensagem:*\n${message}`;
        
        return whatsappMessage;
    }
    
    // Sistema de notificações
    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Adicionar estilos
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            font-family: 'Poppins', sans-serif;
        `;
        
        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        `;
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Event listener para fechar
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Adicionar animações CSS para notificações
    function addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-message {
                white-space: pre-line;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }
    
    addNotificationStyles();
    initContactForm();

    
    // Efeito parallax suave no hero
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Inicializar parallax apenas em telas maiores
    if (window.innerWidth > 768) {
        initParallax();
    }
    
    // Garantir que todas as imagens sejam visíveis imediatamente
    function ensureImagesVisible() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.display = 'block';
        });
    }
    
    // Executar imediatamente e após carregamento
    ensureImagesVisible();
    setTimeout(ensureImagesVisible, 100);
    setTimeout(ensureImagesVisible, 500);
    
    // Garantir visibilidade quando DOM estiver pronto
    document.addEventListener('DOMContentLoaded', ensureImagesVisible);
    window.addEventListener('load', ensureImagesVisible);
    
    // Contador animado para estatísticas
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent.replace('+', ''));
                    let current = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target + '+';
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current) + '+';
                        }
                    }, 30);
                    
                    counterObserver.unobserve(counter);
                }
            });
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    initCounters();
    
    // Melhorar acessibilidade do teclado
    function initKeyboardNavigation() {
        // Permitir navegação por teclado no menu mobile
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
        
        // Escape para fechar menu mobile
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                hamburger.focus();
            }
        });
    }
    
    initKeyboardNavigation();
    
    // Detectar preferência de movimento reduzido
    function respectMotionPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Desabilitar animações complexas
            document.documentElement.style.setProperty('--transition-normal', '0.1s');
            document.documentElement.style.setProperty('--transition-slow', '0.1s');
        }
    }
    
    respectMotionPreferences();
    
    // Performance: debounce para eventos de scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Aplicar debounce ao scroll
    const debouncedScroll = debounce(handleScroll, 10);
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', debouncedScroll);
    
    // Adicionar indicador de carregamento
    function showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Carregando...</p>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(247, 243, 232, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease-out;
        `;
        
        const loaderContent = loader.querySelector('.loader-content');
        loaderContent.style.cssText = `
            text-align: center;
            color: #8A724C;
        `;
        
        const spinner = loader.querySelector('.loader-spinner');
        spinner.style.cssText = `
            width: 40px;
            height: 40px;
            border: 4px solid #DCC9A7;
            border-top: 4px solid #8A724C;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        `;
        
        // Adicionar animação do spinner
        const spinnerStyle = document.createElement('style');
        spinnerStyle.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinnerStyle);
        
        document.body.appendChild(loader);
        
        // Remover loader quando a página estiver carregada
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.remove();
                    }
                }, 500);
            }, 500);
        });
    }
    
    // Mostrar loader apenas se a página ainda estiver carregando
    if (document.readyState === 'loading') {
        showLoadingIndicator();
    }
    
    // Função para abrir modal de imagem
    window.openImageModal = function(imageSrc, title) {
        console.log('openImageModal chamada com:', imageSrc, title);
        
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeModal(this)">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <button class="modal-close" onclick="closeModal(this)">&times;</button>
                    <img src="${imageSrc}" alt="${title}" class="modal-image">
                    <h3 class="modal-title">${title}</h3>
                </div>
            </div>
        `;
        
        // Adicionar estilos do modal
        if (!document.querySelector('#modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .image-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                }
                .modal-overlay {
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    background: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                .modal-image {
                    width: 100%;
                    height: auto;
                    max-height: 70vh;
                    object-fit: contain;
                    display: block;
                }
                .modal-title {
                    padding: 20px;
                    margin: 0;
                    color: #8A724C;
                    font-size: 1.2rem;
                    text-align: center;
                    border-top: 1px solid #eee;
                }
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 24px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                    transition: background 0.3s ease;
                }
                .modal-close:hover {
                    background: rgba(0, 0, 0, 0.9);
                }
            `;
            document.head.appendChild(modalStyles);
        }
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    };
    
    // Função para fechar modal
    window.closeModal = function(element) {
        const modal = element.closest('.image-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    };
    
    // Função para abrir modal de vídeo (placeholder para futuros vídeos)
    window.openVideoModal = function(videoId) {
        if (videoId === 'radio-sociedade') {
            window.open('https://www.youtube.com/watch?v=GmHQ6N9KElc&t=176s', '_blank');
        } else {
            alert(`Vídeo "${videoId}" será adicionado em breve!`);
        }
    };
    
    // Função para abrir vídeo do YouTube
    window.openYouTubeVideo = function(url) {
        console.log('openYouTubeVideo chamada com:', url);
        window.open(url, '_blank');
    };
    

    
    console.log('Funções JavaScript carregadas:', {
        openImageModal: typeof window.openImageModal,
        openVideoModal: typeof window.openVideoModal,
        openYouTubeVideo: typeof window.openYouTubeVideo,
        closeModal: typeof window.closeModal
    });
    
    console.log('🎉 Portfólio da Rosana Ananda carregado com sucesso!');
    console.log('💻 Desenvolvido por Davi Marchal © 2025');
});