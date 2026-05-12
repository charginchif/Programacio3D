/**
 * main.js — Game orchestrator
 * Wires together all systems: scene, player, shooting, targets, effects, audio, UI
 */
import * as THREE from 'three';
import { buildScene }      from './scene.js';
import { Player }          from './player.js';
import { TargetManager }   from './targets.js';
import { EffectsManager }  from './effects.js';
import { ShootingSystem }  from './shooting.js';
import { AudioManager }    from './audio.js';
import { UI }              from './ui.js';

// ── DOM refs ─────────────────────────────────────────────────────────────
const canvas       = document.getElementById('game-canvas');
const startScreen  = document.getElementById('start-screen');
const startBtn     = document.getElementById('start-btn');
const pauseScreen  = document.getElementById('pause-screen');
const resumeBtn    = document.getElementById('resume-btn');

// ── Three.js core ─────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 300);

// ── Systems ──────────────────────────────────────────────────────────────
buildScene(scene, renderer);

const audio    = new AudioManager();
const ui       = new UI();
const player   = new Player(camera, canvas);
const targets  = new TargetManager(scene);
const effects  = new EffectsManager(scene);
const shooter  = new ShootingSystem(camera, targets, effects, audio, ui);

// ── State ────────────────────────────────────────────────────────────────
let gameRunning = false;
let gamePaused  = false;
let elapsed     = 0;
let clock       = new THREE.Clock(false);

// Wave system
let wave         = 1;
let waveTimer    = 0;
const WAVE_DUR   = 45; // seconds per wave

// ── Start screen particles ────────────────────────────────────────────────
(function spawnBgParticles() {
  const container = document.getElementById('bg-particles');
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = 2 + Math.random() * 5;
    const colors = ['#ff2d78','#00f5ff','#b44fff','#ffe500','#00ff88'];
    el.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: 0;
      box-shadow: 0 0 ${size * 2}px currentColor;
    `;
    container.appendChild(el);
  }
})();

// ── Start button ─────────────────────────────────────────────────────────
startBtn.addEventListener('click', startGame);
resumeBtn.addEventListener('click', resumeGame);

function startGame() {
  audio.resume();
  startScreen.style.display = 'none';
  gameRunning = true;
  gamePaused  = false;
  clock.start();

  // Initial spawn
  targets.reset();
  targets.setWave(1);
  effects.reset();
  ui.reset();
  wave = 1;
  waveTimer = 0;
  ui.setWave(1);
  audio.playWaveStart();

  player.lock();
  animate();
}

// ── Pause on ESC ─────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && gameRunning) {
    if (!gamePaused) pauseGame();
  }
});

document.addEventListener('pointerlockchange', () => {
  if (!document.pointerLockElement && gameRunning && !gamePaused) {
    pauseGame();
  }
});

function pauseGame() {
  gamePaused = true;
  clock.stop();
  pauseScreen.classList.remove('hidden');
}

function resumeGame() {
  gamePaused = false;
  pauseScreen.classList.add('hidden');
  clock.start();
  player.lock();
}

// ── Resize ───────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ── Wave progression ──────────────────────────────────────────────────────
function updateWave(delta) {
  waveTimer += delta;
  if (waveTimer >= WAVE_DUR) {
    wave++;
    waveTimer = 0;
    ui.setWave(wave);
    targets.setWave(wave);
    shooter.setFireRate(Math.max(0.06, 0.12 - wave * 0.01));
    audio.playWaveStart();
  }
}

// ── Animation loop ────────────────────────────────────────────────────────
function animate() {
  if (!gameRunning) return;
  requestAnimationFrame(animate);

  if (gamePaused) {
    renderer.render(scene, camera);
    return;
  }

  const delta = Math.min(clock.getDelta(), 0.05);
  elapsed += delta;

  player.update(delta);
  shooter.update(delta);
  targets.update(delta, elapsed);
  effects.update(delta);
  ui.update(delta);
  updateWave(delta);

  renderer.render(scene, camera);
}

// Initial render before game starts
renderer.render(scene, camera);
