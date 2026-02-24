const container = document.querySelector(".model3d");
const canvas = document.getElementById("model3d-canvas");

// сцена
const scene = new THREE.Scene();
// прозрачный фон
scene.background = null;

// камера
const camera = new THREE.PerspectiveCamera(
100,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 3);

// рендер с прозрачным фоном
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// свет
scene.add(new THREE.AmbientLight(0xffffff, 1));

const dirLight = new THREE.DirectionalLight(0xffffff, 5);
dirLight.position.set(20,50,10);
scene.add(dirLight);

// controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false; // убираем масштабирование
controls.enablePan = false;  // убираем перемещение

// ===== загрузка модели GLB =====
let modelObject = null;
const loader = new THREE.GLTFLoader();
loader.load("3d/model.glb", (gltf) => {
    modelObject = gltf.scene;

    // фиксированный размер, без масштабирования под камеру
    // центрирование
    modelObject.position.set(0, 0, 0);

    scene.add(modelObject);
}, undefined, (error) => {
    console.error("Ошибка загрузки модели:", error);
});

// анимация
function animate() {
  requestAnimationFrame(animate);

  // авто-вращение модели вокруг Y
  if (modelObject) {
    modelObject.rotation.y += 0.002; // скорость вращения
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();

// адаптив
window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});