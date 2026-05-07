/**
 * effects.js — Visual effects: particle explosions, muzzle flash, bullet trails
 */
import * as THREE from 'three';

export class EffectsManager {
  constructor(scene) {
    this.scene    = scene;
    this.particles = []; // { mesh, velocity, life, maxLife }
    this.trails    = []; // { mesh, life, maxLife }
    this.flashes   = []; // { light, life }
  }

  /** Particle explosion at world position with given color */
  spawnExplosion(position, color = 0xff2d78, count = 22) {
    for (let i = 0; i < count; i++) {
      const size = 0.05 + Math.random() * 0.12;
      const geo  = new THREE.SphereGeometry(size, 4, 4);
      const mat  = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(position);

      // Random velocity
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random()) * 8 + 2,
        (Math.random() - 0.5) * 10,
      );

      const maxLife = 0.4 + Math.random() * 0.4;
      this.scene.add(mesh);
      this.particles.push({ mesh, velocity: vel, life: maxLife, maxLife });
    }

    // Energy ring
    this._spawnRing(position, color);
    // Point flash
    this._spawnFlash(position, color);
  }

  _spawnRing(position, color) {
    const geo = new THREE.TorusGeometry(0.1, 0.04, 6, 24);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    mesh.rotation.x = Math.PI / 2;
    const maxLife = 0.35;
    this.scene.add(mesh);
    this.trails.push({ mesh, life: maxLife, maxLife, type: 'ring' });
  }

  _spawnFlash(position, color) {
    const light = new THREE.PointLight(color, 8, 8);
    light.position.copy(position);
    this.scene.add(light);
    this.flashes.push({ light, life: 0.15, maxLife: 0.15 });
  }

  /** Muzzle flash at camera position */
  spawnMuzzleFlash(camera) {
    const pos = new THREE.Vector3();
    camera.getWorldPosition(pos);
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    pos.addScaledVector(forward, 0.5);
    pos.y -= 0.15;

    const light = new THREE.PointLight(0xffe500, 12, 4);
    light.position.copy(pos);
    this.scene.add(light);
    this.flashes.push({ light, life: 0.06, maxLife: 0.06 });
  }

  /** Bullet trail from camera to hit point */
  spawnTrail(from, to) {
    const dir    = to.clone().sub(from);
    const length = dir.length();
    const geo    = new THREE.CylinderGeometry(0.015, 0.015, length, 4);
    const mat    = new THREE.MeshBasicMaterial({
      color: 0xffe500,
      transparent: true,
      opacity: 0.8,
    });
    const mesh = new THREE.Mesh(geo, mat);

    const mid = from.clone().add(to).multiplyScalar(0.5);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );

    const maxLife = 0.12;
    this.scene.add(mesh);
    this.trails.push({ mesh, life: maxLife, maxLife, type: 'trail' });
  }

  update(delta) {
    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
        continue;
      }
      const t = p.life / p.maxLife;
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.velocity.y -= 18 * delta; // gravity
      p.mesh.material.opacity = t;
      const s = 0.5 + t * 0.5;
      p.mesh.scale.setScalar(s);
    }

    // Trails / rings
    for (let i = this.trails.length - 1; i >= 0; i--) {
      const tr = this.trails[i];
      tr.life -= delta;
      if (tr.life <= 0) {
        this.scene.remove(tr.mesh);
        tr.mesh.geometry.dispose();
        tr.mesh.material.dispose();
        this.trails.splice(i, 1);
        continue;
      }
      const t = tr.life / tr.maxLife;
      tr.mesh.material.opacity = t * 0.8;
      if (tr.type === 'ring') {
        const scale = 1 + (1 - t) * 5;
        tr.mesh.scale.setScalar(scale);
      }
    }

    // Flashes
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.life -= delta;
      if (f.life <= 0) {
        this.scene.remove(f.light);
        this.flashes.splice(i, 1);
        continue;
      }
      f.light.intensity = (f.life / f.maxLife) * 12;
    }
  }

  reset() {
    [...this.particles].forEach(p => {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    });
    this.particles = [];
    [...this.trails].forEach(t => {
      this.scene.remove(t.mesh);
      t.mesh.geometry.dispose();
      t.mesh.material.dispose();
    });
    this.trails = [];
    this.flashes.forEach(f => this.scene.remove(f.light));
    this.flashes = [];
  }
}
