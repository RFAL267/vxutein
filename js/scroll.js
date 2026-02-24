// js/scroll.js
// Должен подключаться после gsap.min.js

// Проверка, что GSAP и ScrollTrigger подключены
if (gsap && ScrollTrigger) {
  
  // Регистрируем плагин
  gsap.registerPlugin(ScrollTrigger);

  // Все элементы с нужным классом
  const scrollElements = document.querySelectorAll(".scroll-fade-up");

  scrollElements.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 70%",   // когда верх элемента достигнет 80% высоты окна
        toggleActions: "play none none none", // play only
      },
      y: 100,               // смещение по Y
      opacity: 0,           // стартовая прозрачность
      duration: 1,          // время анимации
      ease: "power2.out",
    });
  });

}