document.addEventListener("DOMContentLoaded", () => {
    // Получаем все элементы слайдера
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.slider_next');
    
    // Если слайдов нет, скрипт не выполняется
    if (slides.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false; // Блокировка от двойных кликов
    let autoPlayTimer;

    // --- Инициализация ---
    // Уводим все слайды вправо (xPercent: 100) и скрываем
    gsap.set(slides, { autoAlpha: 0, xPercent: 100 });
    // Возвращаем первый слайд в центр (xPercent: 0) и показываем
    gsap.set(slides[currentIndex], { autoAlpha: 1, xPercent: 0 });

    // --- Функция переключения на следующий слайд ---
    function goToNextSlide() {
        // Защита: если анимация уже идет, ничего не делаем
        if (isAnimating) return;
        isAnimating = true;

        const currentSlide = slides[currentIndex];
        
        // Вычисляем индекс следующего слайда. Если это конец массива, возвращаемся к 0
        currentIndex = (currentIndex + 1) % slides.length;
        const nextSlide = slides[currentIndex];

        // 1. Анимируем текущий слайд: он уезжает влево и исчезает
        gsap.to(currentSlide, {
            xPercent: -100,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.inOut"
        });

        // 2. Подготавливаем следующий слайд: ставим его справа перед тем, как он въедет
        gsap.set(nextSlide, { xPercent: 100 });

        // 3. Анимируем следующий слайд: он въезжает в центр
        gsap.to(nextSlide, {
            xPercent: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                isAnimating = false; // Снимаем блокировку, когда анимация закончилась
            }
        });

        // Сбрасываем таймер автоплея, чтобы после клика он не переключился сразу же
        resetAutoPlay();
    }

    // --- Функция управления таймером автоплея ---
    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        // Запускаем автоматическое переключение каждые 3000 мс (3 секунды)
        autoPlayTimer = setInterval(goToNextSlide, 5000);
    }

    // --- Обработчик клика по кнопке ---
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextSlide);
    }

    // Запускаем автоплей при загрузке страницы
    resetAutoPlay();
});