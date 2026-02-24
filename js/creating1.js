document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.creating1');
    if (!section) return;

    const wrapper = section.querySelector('.swiper-wrapper');
    const slides = section.querySelectorAll('.swiper-slide');

    if (!wrapper || slides.length === 0) return;

    // 1. Дублируем контент ОДИН раз для создания бесшовной ленты
    const originalContent = wrapper.innerHTML;
    wrapper.innerHTML = originalContent + originalContent; 

    let animation; // Переменная для хранения анимации

    const startAnimation = () => {
        // Останавливаем предыдущую анимацию, если она была (нужно для ресайза)
        if (animation) animation.kill();

        // Рассчитываем ширину одной половины ленты
        const totalWidth = wrapper.scrollWidth;
        const halfWidth = totalWidth / 2;

        // 2. Устанавливаем начальную точку
        gsap.set(wrapper, { x: 0 });

        // 3. Анимируем СЛЕВА НАПРАВО (x уходит в минус)
        animation = gsap.to(wrapper, {
            x: -halfWidth,
            duration: 100, // Скорость: чем меньше, тем быстрее
            ease: "none",
            repeat: -1,
            // Если нужно будет управлять анимацией извне
            overwrite: "auto" 
        });
    };

    // 4. Ждем загрузки картинок, чтобы правильно вычислить scrollWidth
    window.addEventListener('load', startAnimation);
    
    // На случай, если картинки уже в кэше и load не сработает
    // или если ты используешь динамическую подгрузку
    setTimeout(startAnimation, 100);

    // 5. ДОПОЛНИТЕЛЬНО: Пересчет при изменении размера экрана (Resize)
    // Чтобы на мобилках или при повороте экрана слайдер не "ломался"
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(startAnimation, 200);
    });
});