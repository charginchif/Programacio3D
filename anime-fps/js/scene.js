/**
 * scene.js — Three.js scene setup: arena, lighting, skybox, decorations
 */
import * as THREE from 'three';

export function buildScene(scene, renderer) {
  // ── Renderer setup ──────────────────────────────────────────────────
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace  = THREE.SRGBColorSpace;

  // ── Fog ─────────────────────────────────────────────────────────────
  scene.fog = new THREE.FogExp2(0x06060f, 0.022);
  scene.background = new THREE.Color(0x06060f);

  // ── Ambient / hemisphere light ───────────────────────────────────────
  const hemi = new THREE.HemisphereLight(0x1a1a3e, 0x06060f, 0.5);
  scene.add(hemi);

  // ── Directional light (moon-like) ────────────────────────────────────
  const dir = new THREE.DirectionalLight(0x6060ff, 0.8);
  dir.position.set(10, 30, 10);
  dir.castShadow = true;
  dir.shadow.mapSize.setScalar(2048);
  dir.shadow.camera.near = 0.5;
  dir.shadow.camera.far  = 100;
  dir.shadow.camera.left = dir.shadow.camera.bottom = -30;
  dir.shadow.camera.right = dir.shadow.camera.top   =  30;
  scene.add(dir);

  // ── Floor ────────────────────────────────────────────────────────────
  const floorSize = 60;
  const floorGeo  = new THREE.PlaneGeometry(floorSize, floorSize, 30, 30);
  const floorMat  = new THREE.MeshStandardMaterial({
    color: 0x0a0a1a,
    metalness: 0.6,
    roughness: 0.5,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Grid overlay on floor
  const gridHelper = new THREE.GridHelper(floorSize, 30, 0x00f5ff, 0x0d0d2e);
  gridHelper.position.y = 0.01;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.3;
  scene.add(gridHelper);

  // ── Walls ────────────────────────────────────────────────────────────
  _buildWalls(scene, floorSize / 2);

  // ── Pillars ──────────────────────────────────────────────────────────
  _buildPillars(scene);

  // ── Floating neon lights ──────────────────────────────────────────────
  _buildAmbientLights(scene);

  // ── Stars / particles overhead ────────────────────────────────────────
  _buildStars(scene);
}

function _buildWalls(scene, half) {
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x080818,
    metalness: 0.5,
    roughness: 0.7,
    emissive: 0x000010,
    emissiveIntensity: 0.3,
  });
  const h = 10, t = 0.5;
  const configs = [
    { w: half * 2 + t, d: t, x: 0,     z: -half, ry: 0 },
    { w: half * 2 + t, d: t, x: 0,     z:  half, ry: 0 },
    { w: t,            d: half * 2 + t, x: -half, z: 0,  ry: 0 },
    { w: t,            d: half * 2 + t, x:  half, z: 0,  ry: 0 },
  ];
  for (const c of configs) {
    const geo  = new THREE.BoxGeometry(c.w, h, c.d);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(c.x, h / 2, c.z);
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Neon trim on top of wall
    const trimGeo = new THREE.BoxGeometry(c.w, 0.08, c.d + 0.1);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      emissiveIntensity: 3,
    });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(c.x, h + 0.04, c.z);
    scene.add(trim);
  }
}

function _buildPillars(scene) {
  const positions = [
    [-14, -14], [14, -14], [-14, 14], [14, 14],
    [-7,  0],   [7,  0],  [0, -7],  [0, 7],
  ];
  const pillarColors = [0xff2d78, 0x00f5ff, 0xb44fff, 0xffe500];

  positions.forEach(([x, z], i) => {
    const h   = 4 + Math.random() * 4;
    const geo = new THREE.CylinderGeometry(0.35, 0.4, h, 8);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0d0d22,
      metalness: 0.7,
      roughness: 0.3,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, h / 2, z);
    mesh.castShadow = true;
    scene.add(mesh);

    // Glowing cap
    const capColor = pillarColors[i % pillarColors.length];
    const capGeo   = new THREE.CylinderGeometry(0.5, 0.35, 0.2, 8);
    const capMat   = new THREE.MeshStandardMaterial({
      color: capColor,
      emissive: capColor,
      emissiveIntensity: 3,
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(x, h + 0.1, z);
    scene.add(cap);

    // Light from cap
    const light = new THREE.PointLight(capColor, 1.5, 10);
    light.position.set(x, h + 0.5, z);
    scene.add(light);
  });
}

function _buildAmbientLights(scene) {
  const colors  = [0xff2d78, 0x00f5ff, 0xb44fff, 0x00ff88];
  const corners = [[-20, -20], [20, -20], [-20, 20], [20, 20]];
  corners.forEach(([x, z], i) => {
    const light = new THREE.PointLight(colors[i], 2, 25);
    light.position.set(x, 6, z);
    scene.add(light);
  });
}

function _buildStars(scene) {
  const count  = 800;
  const geo    = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = 15 + Math.random() * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat  = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(geo, mat));
}
