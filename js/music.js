const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');

    // 1. Анимация появления кнопки через GSAP
    // Кнопка плавно спускается сверху в угол (0, 0) за 1.5 секунды
    gsap.fromTo(btn, 
        { y: -100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, ease: "power2.out" }
    );

    // 2. Функция одноразового запуска музыки
    function startAudio() {
        audio.play().then(() => {
            // Если запустилось успешно — удаляем все лишние «слушатели»
            window.removeEventListener('scroll', startAudio);
            document.removeEventListener('click', startAudio);
            console.log("Музыка запущена, проверки отключены.");
        }).catch(err => {
            // Браузер всё еще может блокировать до первого реального взаимодействия
            console.log("Ожидание взаимодействия для звука...");
        });
    }

    // Слушаем и скролл, и клик для первого запуска
    window.addEventListener('scroll', startAudio);
    document.addEventListener('click', startAudio);

    // 3. Логика кнопки (Пауза/Плей + класс active)
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Чтобы не дублировать запуск функции startAudio
        
        if (audio.paused) {
            audio.play();
            btn.classList.remove('active'); // Убираем класс, если играет
        } else {
            audio.pause();
            btn.classList.add('active'); // Добавляем класс, если на паузе
        }
    });