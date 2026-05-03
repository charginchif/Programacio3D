import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ─────────────────────────────────────────────
// 1. ESCENA BÁSICA
// ─────────────────────────────────────────────
const scene = new THREE.Scene();

// Fondo con gradiente radial (via textura)
const bgCanvas = document.createElement('canvas');
bgCanvas.width = 512; bgCanvas.height = 512;
const ctx = bgCanvas.getContext('2d');
const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 360);
grad.addColorStop(0, '#1a1a2e');
grad.addColorStop(1, '#0a0a0f');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, 512, 512);
scene.background = new THREE.CanvasTexture(bgCanvas);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0.9, 0);
controls.maxPolarAngle = Math.PI / 1.8;
controls.minDistance = 1.5;
controls.maxDistance = 10;

// ─────────────────────────────────────────────
// 2. ILUMINACIÓN
// ─────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xc8b8ff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
dirLight.position.set(4, 8, 4);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 20;
dirLight.shadow.camera.left = -4;
dirLight.shadow.camera.right = 4;
dirLight.shadow.camera.top = 4;
dirLight.shadow.camera.bottom = -4;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x7c5cfc, 0.4);
fillLight.position.set(-3, 2, -2);
scene.add(fillLight);

// ─────────────────────────────────────────────
// 3. PISO
// ─────────────────────────────────────────────
const floorGeom = new THREE.CircleGeometry(5, 64);
const floorMat = new THREE.MeshStandardMaterial({
    color: 0x111118,
    roughness: 0.85,
    metalness: 0.1
});
const floor = new THREE.Mesh(floorGeom, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Grid decorativa
const gridHelper = new THREE.GridHelper(10, 20, 0x222233, 0x1a1a28);
gridHelper.position.y = 0.005;
scene.add(gridHelper);

// ─────────────────────────────────────────────
// 4. CARGAR MODELO GLB CON GLTFLoader
// ─────────────────────────────────────────────
const loader = new GLTFLoader();
let mixer = null;
let actions = {};
let activeAction = null;
let animationNames = [];

// Modelo "RobotExpressive" del repositorio oficial de Three.js
const MODEL_URL = 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb';

loader.load(
    MODEL_URL,
    (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(model);

        // ─────────────────────────────────────
        // 5. CONFIGURAR ANIMACIONES
        // ─────────────────────────────────────
        mixer = new THREE.AnimationMixer(model);

        gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            actions[clip.name] = action;
            animationNames.push(clip.name);
        });

        console.log('Animaciones disponibles:', animationNames);

        // Crear botones del HUD
        createAnimationButtons();

        // Iniciar con la primera animación (generalmente "Idle" o la primera del array)
        const startName = animationNames.includes('Idle') ? 'Idle' : animationNames[0];
        if (startName) {
            playAnimation(startName);
        }

        // Ocultar loading y mostrar HUD
        document.getElementById('loading-overlay').classList.add('hidden');
        document.getElementById('hud').classList.add('visible');
        document.getElementById('info').classList.add('visible');
    },
    (xhr) => {
        const pct = (xhr.loaded / xhr.total * 100).toFixed(0);
        document.querySelector('#loading-overlay p').textContent =
            `Cargando modelo… ${pct}%`;
    },
    (error) => {
        console.error('Error al cargar el modelo:', error);
        document.querySelector('#loading-overlay p').textContent =
            '❌ Error al cargar el modelo. Revisa la consola.';
    }
);

// ─────────────────────────────────────────────
// 6. FUNCIONES DE ANIMACIÓN (crossfade)
// ─────────────────────────────────────────────
function playAnimation(name) {
    const newAction = actions[name];
    if (!newAction || newAction === activeAction) return;

    if (activeAction) {
        // Crossfade suave entre animaciones
        activeAction.fadeOut(0.4);
    }

    newAction.reset();
    newAction.fadeIn(0.4);
    newAction.play();

    activeAction = newAction;

    // Actualizar estado visual de los botones
    document.querySelectorAll('.anim-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.name === name);
    });
}

// ─────────────────────────────────────────────
// 7. CREAR BOTONES DE INTERFAZ
// ─────────────────────────────────────────────
function createAnimationButtons() {
    const container = document.getElementById('animation-buttons');
    const hintsEl = document.getElementById('key-hints');
    const hintsArr = [];

    animationNames.forEach((name, idx) => {
        const btn = document.createElement('button');
        btn.className = 'anim-btn';
        btn.textContent = name;
        btn.dataset.name = name;
        btn.addEventListener('click', () => playAnimation(name));
        container.appendChild(btn);

        // Solo mostramos hints para las primeras 9
        if (idx < 9) {
            hintsArr.push(`<kbd>${idx + 1}</kbd> ${name}`);
        }
    });

    hintsEl.innerHTML = hintsArr.join(' &nbsp;·&nbsp; ');
}

// ─────────────────────────────────────────────
// 8. INPUT DEL USUARIO (teclado)
// ─────────────────────────────────────────────
window.addEventListener('keydown', (e) => {
    // Teclas 1-9 cambian la animación
    const num = parseInt(e.key);
    if (num >= 1 && num <= 9 && num <= animationNames.length) {
        playAnimation(animationNames[num - 1]);
    }
});

// ─────────────────────────────────────────────
// 9. LOOP DE RENDER + ACTUALIZACIÓN DE MIXER
// ─────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Actualizar el mixer de animación
    if (mixer) mixer.update(delta);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// ─────────────────────────────────────────────
// 10. RESPONSIVE
// ─────────────────────────────────────────────
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
