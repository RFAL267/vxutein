document.addEventListener("DOMContentLoaded", (event) => {
  // Регистрируем плагин
  gsap.registerPlugin(ScrollTrigger);

  // Находим все элементы с классом scroll_anim внутри секции inlife
  const fadeUpElements = document.querySelectorAll(".inlife .scroll_anim");

  // --- Функция для бесконечной левитации ---
  function startLevitating() {
    gsap.to(fadeUpElements, {
      y: -30,               // Элементы будут плавно подниматься на 15px вверх от своей финальной позиции
      duration: 2.5,        // Время движения в одну сторону
      yoyo: true,           // Возвращаться обратно (туда-сюда)
      repeat: -1,           // Повторять бесконечно
      ease: "sine.inOut",   // Идеально плавный старт и остановка для эффекта "дыхания" или парения
      stagger: 0.2          // Асинхронность: чтобы элементы левитировали не одновременно, а вразнобой
    });
  }

  // --- Основная анимация появления ---
  gsap.from(fadeUpElements, {
    scrollTrigger: {
      trigger: ".inlife .grid", 
      start: "top 80%",         
      toggleActions: "play none none none" 
    },
    y: 80,               
    opacity: 0,          
    duration: 3,       
    stagger: 0.15,       
    ease: "power3.out",
    // Запускаем функцию левитации сразу после того, как появление полностью завершится
    onComplete: startLevitating 
  });
});