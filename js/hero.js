// анимация hero_title
gsap.to(".hero_title", {
  y: 10,                  // смещение вверх/вниз
  duration: 3,             // длительность анимации
  repeat: -1,              // бесконечно
  yoyo: true,              // движение туда/обратно
  ease: "sine.inOut"       // плавное easing
});

// анимация всех элементов .sh
gsap.utils.toArray(".sh").forEach((el, i) => {
  gsap.to(el, {
    y: 5 + Math.random() * 100, // небольшое случайное смещение
    x: 2 + Math.random() * 50, // лёгкая горизонтальная дрожь
    duration: 2 + Math.random() * 2, // разная скорость для каждого
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: i * 0.3  // небольшая разбежка, чтобы не синхронизировались
  });
});