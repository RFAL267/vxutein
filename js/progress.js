document.addEventListener("DOMContentLoaded", () => {
  const progress = document.querySelector(".progress");

  if (!progress) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;

    progress.style.height = scrolled + "%";
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress(); // чтобы сразу выставилось при загрузке
});