document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.creating1');
    if (!section) return;

    // --- ЧАСТЬ 1: Бесконечная прокрутка для ВСЕХ слайдеров ---
    const sliders = section.querySelectorAll('.slider-main');
    
    sliders.forEach(sliderNode => {
        const wrapper = sliderNode.querySelector('.swiper-wrapper');
        const slides = sliderNode.querySelectorAll('.swiper-slide');
        if (!wrapper || slides.length === 0) return;

        // Дублируем контент
        const originalContent = wrapper.innerHTML;
        wrapper.innerHTML = originalContent + originalContent; 

        let animation;

        const startAnimation = () => {
            if (animation) animation.kill();

            // Т.к. элементы лежат в Grid (а не display: none), scrollWidth считается корректно даже у скрытых!
            const totalWidth = wrapper.scrollWidth;
            const halfWidth = totalWidth / 2;

            gsap.set(wrapper, { x: 0 });
            animation = gsap.to(wrapper, {
                x: -halfWidth,
                duration: 100, // Скорость
                ease: "none",
                repeat: -1,
                overwrite: "auto" 
            });
        };

        window.addEventListener('load', startAnimation);
        setTimeout(startAnimation, 100);

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(startAnimation, 200);
        });
    });

    // --- ЧАСТЬ 2: Логика переключения этапов (Табов) с анимацией ---
    const buttons = section.querySelectorAll('.step-btn');
    
    // Предварительная настройка: все неактивные элементы опущены на 50px вниз
    gsap.set('.slider-main:not(.active), .step_article:not(.active)', { 
        y: 50, 
        autoAlpha: 0 // autoAlpha в GSAP рулит сразу opacity и visibility
    });
    
    let isAnimating = false; // Блокировка от спама кликами

    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Игнорируем клик, если этот таб уже активен или идет анимация
            if (this.classList.contains('active') || isAnimating) return;
            
            isAnimating = true;

            const targetId = this.dataset.id;
            
            // Находим текущие элементы
            const currentBtn = section.querySelector('.step-btn.active');
            const currentSlider = section.querySelector('.slider-main.active');
            const currentArticle = section.querySelector('.step_article.active');
            
            // Находим новые элементы, которые нужно показать
            const nextSlider = section.querySelector(`.slider-main[data-slider="${targetId}"]`);
            const nextArticle = section.querySelector(`.step_article[data-content="${targetId}"]`);

            // 1. Переключаем классы кнопок
            currentBtn.classList.remove('active');
            this.classList.add('active');

            // 2. Анимация ухода (старые элементы уезжают ВВЕРХ и исчезают)
            gsap.to([currentSlider, currentArticle], {
                y: -50,
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    currentSlider.classList.remove('active');
                    currentArticle.classList.remove('active');
                    // Сбрасываем их позицию вниз для будущих анимаций появления
                    gsap.set([currentSlider, currentArticle], { y: 50 });
                }
            });

            // 3. Анимация появления (новые элементы выезжают СНИЗУ)
            nextSlider.classList.add('active');
            nextArticle.classList.add('active');
            
            gsap.to([nextSlider, nextArticle], { 
                y: 0, 
                autoAlpha: 1, 
                duration: 0.5, 
                delay: 0.2, // Небольшая задержка, чтобы старый контент успел начать исчезать
                ease: "power2.out",
                onComplete: () => { 
                    isAnimating = false; // Разблокируем клики
                }
            });
        });
    });
});