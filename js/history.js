//history.js
document.addEventListener("DOMContentLoaded", () => {
  const historySection = document.querySelector(".history");
  if (!historySection) return;

  const slides = historySection.querySelectorAll(".slide");
  const nextBtn = historySection.querySelector(".slider_next");

  if (!slides.length) return;

  let currentIndex = 0;
  let isAnimating = false;
  let autoPlayTimer;
  let typingTimer;

  // сохраняем оригинальный HTML
  slides.forEach(slide => {
    const article = slide.querySelector("article");
    if (article) {
      article.dataset.original = article.innerHTML.trim();
      article.innerHTML = "";
    }
  });

  // --- УМНЫЙ typewriter ---
  function typeWriterHTML(element, html, speed = 10) {
    element.innerHTML = "";
    let i = 0;
    let isTag = false;
    let output = "";

    function type() {
      if (i >= html.length) return;

      const char = html[i];
      output += char;

      if (char === "<") isTag = true;
      if (char === ">") isTag = false;

      element.innerHTML = output;
      i++;

      if (isTag) {
        type(); // мгновенно дописываем тег
      } else {
        typingTimer = setTimeout(type, speed);
      }
    }

    type();
  }

  function stopTypeWriter(element) {
    clearTimeout(typingTimer);
    if (element?.dataset.original) {
      element.innerHTML = element.dataset.original;
    }
  }

  // --- стартовое состояние ---
  gsap.set(slides, { autoAlpha: 0, xPercent: 100 });
  gsap.set(slides[currentIndex], { autoAlpha: 1, xPercent: 0 });

  // печать первого
  const firstArticle = slides[currentIndex].querySelector("article");
  if (firstArticle) {
    typeWriterHTML(firstArticle, firstArticle.dataset.original);
  }

  function goToNextSlide() {
    if (isAnimating) return;
    isAnimating = true;

    const currentSlide = slides[currentIndex];
    const currentArticle = currentSlide.querySelector("article");
    stopTypeWriter(currentArticle);

    currentIndex = (currentIndex + 1) % slides.length;

    const nextSlide = slides[currentIndex];
    const nextArticle = nextSlide.querySelector("article");

    if (nextArticle) nextArticle.innerHTML = "";

    gsap.to(currentSlide, {
      xPercent: -100,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });

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

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(goToNextSlide, 10000);
  }

  nextBtn?.addEventListener("click", goToNextSlide);

  resetAutoPlay();
});