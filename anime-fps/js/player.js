/**
 * player.js — First-person player controller
 * WASD movement + mouse look via Pointer Lock API
 */
import * as THREE from 'three';

export class Player {
  constructor(camera, domElement) {
    this.camera     = camera;
    this.domElement = domElement;

    // State
    this.speed      = 8;
    this.isLocked   = false;

    // Euler for mouse look
    this.euler      = new THREE.Euler(0, 0, 0, 'YXZ');
    this.sensitivity = 0.0018;

    // Movement keys
    this.keys = { w: false, a: false, s: false, d: false };

    // Physics
    this.velocity   = new THREE.Vector3();
    this.direction  = new THREE.Vector3();

    // Bob animation
    this.bobTimer   = 0;
    this.bobAmount  = 0.06;
    this.bobSpeed   = 9;
    this.baseY      = 1.7; // eye height

    // Initial camera position
    this.camera.position.set(0, this.baseY, 0);

    this._bindEvents();
  }

  _bindEvents() {
    // Pointer lock change
    document.addEventListener('pointerlockchange', () => {
      this.isLocked = document.pointerLockElement === this.domElement;
    });

    // Mouse look
    document.addEventListener('mousemove', (e) => {
      if (!this.isLocked) return;
      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.y -= e.movementX * this.sensitivity;
      this.euler.x -= e.movementY * this.sensitivity;
      // Clamp vertical look
      this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup')    this.keys.w = true;
      if (k === 'a' || k === 'arrowleft')  this.keys.a = true;
      if (k === 's' || k === 'arrowdown')  this.keys.s = true;
      if (k === 'd' || k === 'arrowright') this.keys.d = true;
    });
    document.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup')    this.keys.w = false;
      if (k === 'a' || k === 'arrowleft')  this.keys.a = false;
      if (k === 's' || k === 'arrowdown')  this.keys.s = false;
      if (k === 'd' || k === 'arrowright') this.keys.d = false;
    });
  }

  lock() {
    this.domElement.requestPointerLock();
  }

  unlock() {
    document.exitPointerLock();
  }

  isMoving() {
    return this.keys.w || this.keys.a || this.keys.s || this.keys.d;
  }

  update(delta) {
    if (!this.isLocked) return;

    // Movement direction (camera forward/right projected to XZ)
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    this.direction.set(0, 0, 0);
    if (this.keys.w) this.direction.add(forward);
    if (this.keys.s) this.direction.sub(forward);
    if (this.keys.d) this.direction.add(right);
    if (this.keys.a) this.direction.sub(right);

    if (this.direction.length() > 0) {
      this.direction.normalize();
      this.velocity.lerp(this.direction.multiplyScalar(this.speed), 10 * delta);
    } else {
      this.velocity.lerp(new THREE.Vector3(0, 0, 0), 12 * delta);
    }

    this.camera.position.addScaledVector(this.velocity, delta);

    // Arena bounds clamp
    const bound = 24;
    this.camera.position.x = Math.max(-bound, Math.min(bound, this.camera.position.x));
    this.camera.position.z = Math.max(-bound, Math.min(bound, this.camera.position.z));
    this.camera.position.y = this.baseY; // keep on ground

    // Head bob
    if (this.isMoving()) {
      this.bobTimer += delta * this.bobSpeed;
      const bobY = Math.sin(this.bobTimer) * this.bobAmount;
      const bobX = Math.sin(this.bobTimer * 0.5) * this.bobAmount * 0.5;
      this.camera.position.y = this.baseY + bobY;
      // Slight camera roll from side bob
      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.z = -bobX;
      this.camera.quaternion.setFromEuler(this.euler);
    } else {
      this.bobTimer = 0;
    }
  }
}
