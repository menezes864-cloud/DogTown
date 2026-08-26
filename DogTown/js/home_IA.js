document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MENU MOBILE (HAMBÚRGUER)
       ========================================================================== */
    const nav = document.querySelector('.navigation');
    const headerTop = document.querySelector('.header-top');

    // Cria o botão hambúrguer dinamicamente para dispositivos móveis
    const menuToggle = document.createElement('button');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-label', 'Abrir Menu');
    headerTop.insertBefore(menuToggle, nav);

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
    });

    // Fecha o menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '☰';
            }
        });
    });


    /* ==========================================================================
       2. FUNCIONALIDADE DE BUSCA
       ========================================================================== */
    const searchBtn = document.querySelector('.search');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const termo = prompt('O que você está procurando para o seu pet?');
            if (termo && termo.trim() !== '') {
                alert(`Buscando por: "${termo}"...`);
                // Exemplo de redirecionamento futuro:
                // window.location.href = `/DogTown/DogTown_Produtos.html?busca=${encodeURIComponent(termo)}`;
            }
        });
    }


    /* ==========================================================================
       3. EFEITO DE SCROLL SUAVE PARA LINKS INTERNOS
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });


    /* ==========================================================================
       4. BOTÃO DE WHATSAPP COM MENSAGEM PRÉ-DEFINIDA
       ========================================================================== */
    const whatsappBtn = document.querySelector('.btn-whatsapp');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const numero = '5519980296012';
            const mensagem = encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Dog Town.');
            window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
        });
    }


    /* ==========================================================================
       5. ANIMAÇÃO SUAVE AO ROLAR A PÁGINA (REVEAL)
       ========================================================================== */
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .product-card, .benefit');
    animatedElements.forEach(el => observer.observe(el));
});