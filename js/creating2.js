document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.creating2');
    if (!section) return;

    const wrapper2 = section.querySelector('.swiper-wrapper');
    const slides2 = section.querySelectorAll('.swiper-slide');

    if (!wrapper2 || slides2.length === 0) return;

    const originalContent = wrapper2.innerHTML;
    wrapper2.innerHTML = originalContent + originalContent; 

    let animation; 

    const startAnimation = () => {
        if (animation) animation.kill();

        const totalWidth = wrapper2.scrollWidth;
        const halfWidth = totalWidth / 2;

        gsap.set(wrapper2, { x: 0 });

        animation = gsap.to(wrapper2, {
            x: -halfWidth,
            duration: 100, 
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