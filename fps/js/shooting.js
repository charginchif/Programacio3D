/**
 * shooting.js — Shooting system: raycasting, cooldown, fire rate
 */
import * as THREE from 'three';

export class ShootingSystem {
  constructor(camera, targetManager, effectsManager, audioManager, ui) {
    this.camera   = camera;
    this.targets  = targetManager;
    this.effects  = effectsManager;
    this.audio    = audioManager;
    this.ui       = ui;

    this.cooldown    = 0;
    this.fireRate    = 0.12; // seconds between shots
    this.isFiring    = false;

    this.raycaster   = new THREE.Raycaster();
    this.screenCenter = new THREE.Vector2(0, 0);

    this._bindEvents();
  }

  _bindEvents() {
    document.addEventListener('mousedown', (e) => {
      if (e.button === 0) this.isFiring = true;
    });
    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.isFiring = false;
    });
  }

  tryShoot() {
    if (this.cooldown > 0) return;
    this._fire();
    this.cooldown = this.fireRate;
  }

  _fire() {
    // Audio
    this.audio.playShoot();

    // HUD crosshair
    this.ui.triggerShoot();

    // Muzzle flash
    this.effects.spawnMuzzleFlash(this.camera);

    // Raycast from camera center
    this.raycaster.setFromCamera(this.screenCenter, this.camera);

    const hitTarget = this.targets.checkRaycast(this.raycaster);

    if (hitTarget) {
      // Hit point
      const hitPoint = hitTarget.position.clone();

      // Trail
      const from = new THREE.Vector3();
      this.camera.getWorldPosition(from);
      const fwd = new THREE.Vector3();
      this.camera.getWorldDirection(fwd);
      from.addScaledVector(fwd, 0.5);
      this.effects.spawnTrail(from, hitPoint);

      // Explosion
      this.effects.spawnExplosion(hitPoint, hitTarget.userData.palette.core);

      // Audio
      this.audio.playHit();
      this.audio.playKill();

      // Score + UI
      this.ui.showHitFlash();
      this.ui.registerKill();
      this.ui.addScore(100);

      // Destroy target
      this.targets.destroyTarget(hitTarget);

    } else {
      // Miss — trail to a distant point
      const from = new THREE.Vector3();
      this.camera.getWorldPosition(from);
      const fwd = new THREE.Vector3();
      this.camera.getWorldDirection(fwd);
      const to = from.clone().addScaledVector(fwd, 80);
      this.effects.spawnTrail(from, to);
    }
  }

  update(delta) {
    if (this.cooldown > 0) this.cooldown = Math.max(0, this.cooldown - delta);
    if (this.isFiring) this.tryShoot();
  }

  setFireRate(rate) {
    this.fireRate = rate;
  }
}
