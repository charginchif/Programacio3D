/**
 * targets.js — Dynamic target spawning and management
 * Targets: floating anime-style orbs with glowing rings
 */
import * as THREE from 'three';

const TARGET_COLORS = [
  { core: 0xff2d78, ring: 0xff8fb8, glow: '#ff2d78' },  // Pink
  { core: 0x00f5ff, ring: 0x80faff, glow: '#00f5ff' },  // Cyan
  { core: 0xffe500, ring: 0xfff280, glow: '#ffe500' },  // Yellow
  { core: 0xb44fff, ring: 0xd99fff, glow: '#b44fff' },  // Purple
  { core: 0x00ff88, ring: 0x80ffcc, glow: '#00ff88' },  // Green
];

export class TargetManager {
  constructor(scene) {
    this.scene   = scene;
    this.targets = [];
    this.maxTargets = 8;
    this.spawnTimer = 0;
    this.spawnInterval = 2.5; // seconds
    this.arenaSize = 22;
    this.wave = 1;
  }

  setWave(w) {
    this.wave = w;
    this.maxTargets    = 6 + w * 2;
    this.spawnInterval = Math.max(0.8, 2.5 - w * 0.2);
  }

  _createTarget() {
    const group = new THREE.Group();
    const palette = TARGET_COLORS[Math.floor(Math.random() * TARGET_COLORS.length)];

    // Core sphere
    const coreGeo  = new THREE.SphereGeometry(0.45, 20, 20);
    const coreMat  = new THREE.MeshStandardMaterial({
      color: palette.core,
      emissive: palette.core,
      emissiveIntensity: 1.2,
      metalness: 0.3,
      roughness: 0.2,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Inner ring
    const ringGeo = new THREE.TorusGeometry(0.7, 0.06, 8, 40);
    const ringMat = new THREE.MeshStandardMaterial({
      color: palette.ring,
      emissive: palette.ring,
      emissiveIntensity: 2,
      transparent: true,
      opacity: 0.9,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Outer ring (tilted)
    const ring2 = ring.clone();
    ring2.rotation.set(Math.PI / 3, 0, Math.PI / 4);
    group.add(ring2);

    // Point light (glow)
    const light = new THREE.PointLight(palette.core, 2.5, 6);
    group.add(light);

    // Random position in arena
    const a    = this.arenaSize;
    const posX = (Math.random() - 0.5) * a * 2;
    const posZ = (Math.random() - 0.5) * a * 2;
    const posY = 1.2 + Math.random() * 3;
    group.position.set(posX, posY, posZ);

    // Metadata
    group.userData = {
      isTarget: true,
      palette,
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed: 0.8 + Math.random() * 0.6,
      rotSpeed: (0.5 + Math.random() * 1.0) * (Math.random() < 0.5 ? 1 : -1),
      ring1: ring,
      ring2: ring2,
      core,
      light,
      baseY: posY,
      hit: false,
    };

    this.scene.add(group);
    this.targets.push(group);
    return group;
  }

  update(delta, elapsed) {
    // Spawn
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnInterval && this.targets.length < this.maxTargets) {
      this._createTarget();
      this.spawnTimer = 0;
    }

    // Animate
    for (const t of this.targets) {
      const ud = t.userData;
      // Float
      t.position.y = ud.baseY + Math.sin(elapsed * ud.floatSpeed + ud.floatOffset) * 0.4;
      // Rotate rings
      ud.ring1.rotation.z += delta * ud.rotSpeed;
      ud.ring2.rotation.y += delta * ud.rotSpeed * 0.7;
      // Pulse emissive
      const pulse = 0.9 + Math.sin(elapsed * 3 + ud.floatOffset) * 0.3;
      ud.core.material.emissiveIntensity = pulse * 1.2;
      ud.light.intensity = pulse * 2.5;
    }
  }

  /** Returns the target group if the ray hits one, else null */
  checkRaycast(raycaster) {
    const meshes = [];
    for (const t of this.targets) {
      t.traverse(child => { if (child.isMesh) meshes.push(child); });
    }
    const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length === 0) return null;

    // Find which target group was hit
    let hitObj = hits[0].object;
    while (hitObj.parent && !hitObj.userData.isTarget) {
      hitObj = hitObj.parent;
    }
    if (!hitObj.userData.isTarget) return null;
    return hitObj;
  }

  destroyTarget(target) {
    const idx = this.targets.indexOf(target);
    if (idx !== -1) this.targets.splice(idx, 1);
    this.scene.remove(target);

    // Dispose geometry and materials
    target.traverse(child => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
  }

  reset() {
    for (const t of [...this.targets]) this.destroyTarget(t);
    this.spawnTimer = 0;
  }
}
