document.addEventListener("DOMContentLoaded", () => {
  const creatorsSection = document.querySelector(".creators");
  if (!creatorsSection) return;

  const slides = creatorsSection.querySelectorAll(".slide");
  const nextBtn = creatorsSection.querySelector(".slider_next");
  if (!slides.length) return;

  let currentIndex = 0;
  let isAnimating = false;
  let autoPlayTimer;

  // ===============================
  // 🔥 Сохраняем оригинальный HTML
  // ===============================
  slides.forEach((slide) => {
    const article = slide.querySelector("article");
    if (!article) return;

    article.dataset.original = article.innerHTML.trim();
    article.innerHTML = "";
    article._typingTimer = null; // персональный таймер
  });

  // =================================
  // 🚀 УЛЬТРА-ПЛАВНЫЙ TYPEWRITER
  // =================================
  function typeWriterHTML(element, html, speed = 10) {
    if (!element || !html) return;

    // 💥 гарантированно убиваем прошлую печать
    clearTimeout(element._typingTimer);

    let i = 0;
    let isTag = false;
    let buffer = "";

    element.innerHTML = "";

    function step() {
      if (i >= html.length) return;

      const char = html[i];
      buffer += char;

      if (char === "<") isTag = true;
      if (char === ">") isTag = false;

      // ⚡ одна запись в DOM за шаг
      element.innerHTML = buffer;
      i++;

      if (isTag) {
        step(); // тег дописываем мгновенно
      } else {
        element._typingTimer = setTimeout(step, speed);
      }
    }

    step();
  }

  // ===============================
  // 🛑 Мгновенно дописать текст
  // ===============================
  function stopTypeWriter(element) {
    if (!element) return;

    clearTimeout(element._typingTimer);
    element._typingTimer = null;

    if (element.dataset.original) {
      element.innerHTML = element.dataset.original;
    }
  }

  // ===============================
  // 🎬 Начальное состояние
  // ===============================
  gsap.set(slides, { autoAlpha: 0, xPercent: 100 });
  gsap.set(slides[currentIndex], { autoAlpha: 1, xPercent: 0 });

  const firstArticle = slides[currentIndex].querySelector("article");
  if (firstArticle) {
    typeWriterHTML(firstArticle, firstArticle.dataset.original);
  }

  // ===============================
  // ➡️ Переключение слайда
  // ===============================
  function goToNextSlide() {
    if (isAnimating) return;
    isAnimating = true;

    const currentSlide = slides[currentIndex];
    const currentArticle = currentSlide.querySelector("article");

    // 💥 гарантированно завершаем печать
    stopTypeWriter(currentArticle);

    currentIndex = (currentIndex + 1) % slides.length;

    const nextSlide = slides[currentIndex];
    const nextArticle = nextSlide.querySelector("article");

    if (nextArticle) nextArticle.innerHTML = "";

    // уводим текущий
    gsap.to(currentSlide, {
      xPercent: -100,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });

    // готовим следующий
    gsap.set(nextSlide, { xPercent: 100 });

    gsap.to(nextSlide, {
      xPercent: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        isAnimating = false;

        if (nextArticle) {
          typeWriterHTML(nextArticle, nextArticle.dataset.original);
        }
      },
    });

    resetAutoPlay();
  }

  // ===============================
  // ⏱ Автоплей
  // ===============================
  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(goToNextSlide, 10000);
  }

  nextBtn?.addEventListener("click", goToNextSlide);

  resetAutoPlay();
});