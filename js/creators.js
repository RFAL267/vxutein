document.addEventListener("DOMContentLoaded", () => {
    // Ищем элементы только внутри секции creators
    const creatorsSection = document.querySelector('.creators');
    if (!creatorsSection) return;

    const slides = creatorsSection.querySelectorAll('.slide');
    const nextBtn = creatorsSection.querySelector('.slider_next');
    
    if (slides.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false;
    let autoPlayTimer;
    let typingTimer; // Таймер для эффекта печати

    // --- Умная функция эффекта печатания с поддержкой HTML-тегов ---
    function typeWriterHTML(element, htmlString, speed = 25) {
        element.innerHTML = ""; 
        let i = 0;
        let isTag = false;
        let currentHTML = "";

        function type() {
            if (i < htmlString.length) {
                let char = htmlString.charAt(i);
                currentHTML += char;
                
                // Проверяем, внутри ли мы HTML-тега
                if (char === "<") isTag = true;
                if (char === ">") isTag = false;
                
                element.innerHTML = currentHTML;
                i++;

                // Если мы внутри тега, пропускаем его моментально, иначе делаем паузу
                if (isTag) {
                    type(); 
                } else {
                    typingTimer = setTimeout(type, speed);
                }
            }
        }
        type();
    }

    // --- Функция остановки печати ---
    function stopTypeWriter(element) {
        clearTimeout(typingTimer);
        // Если анимация прервана, сразу выводим весь текст
        if (element && element.dataset.text) {
            element.innerHTML = element.dataset.text; 
        }
    }

    // --- Инициализация ---
    gsap.set(slides, { autoAlpha: 0, xPercent: 100 });
    gsap.set(slides[currentIndex], { autoAlpha: 1, xPercent: 0 });
    
    // Запускаем печать текста для самого первого слайда при загрузке
    const firstArticle = slides[currentIndex].querySelector('article');
    if (firstArticle && firstArticle.dataset.text) {
        typeWriterHTML(firstArticle, firstArticle.dataset.text);
    }

    // --- Переключение слайда ---
    function goToNextSlide() {
        if (isAnimating) return;
        isAnimating = true;

        const currentSlide = slides[currentIndex];
        const currentArticle = currentSlide.querySelector('article');
        
        // Моментально дописываем текст текущего слайда, если он еще не дописался
        if (currentArticle) stopTypeWriter(currentArticle);

        currentIndex = (currentIndex + 1) % slides.length;
        const nextSlide = slides[currentIndex];
        const nextArticle = nextSlide.querySelector('article');

        // Очищаем текст у следующего слайда перед его выездом
        if (nextArticle) nextArticle.innerHTML = "";

        // Убираем текущий слайд
        gsap.to(currentSlide, {
            xPercent: -100,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.inOut",
        });

        // Подготавливаем и выкатываем следующий слайд
        gsap.set(nextSlide, { xPercent: 100 });

        gsap.to(nextSlide, {
            xPercent: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                isAnimating = false;
                // Как только слайд выехал — запускаем анимацию текста
                if (nextArticle && nextArticle.dataset.text) {
                    typeWriterHTML(nextArticle, nextArticle.dataset.text);
                }
            }
        });

        resetAutoPlay();
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        // Увеличил интервал до 7 секунд, чтобы успевал пропечататься и прочитаться текст
        autoPlayTimer = setInterval(goToNextSlide, 8000); 
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextSlide);
    }

    resetAutoPlay();
});