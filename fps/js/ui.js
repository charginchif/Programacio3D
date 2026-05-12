/**
 * ui.js — HUD / UI management
 * Score, kills, combo, wave, notifications, crosshair effects
 */

export class UI {
  constructor() {
    this.scoreEl    = document.getElementById('score');
    this.killsEl    = document.getElementById('kills');
    this.waveEl     = document.getElementById('wave');
    this.comboEl    = document.getElementById('combo');
    this.crosshair  = document.getElementById('crosshair');
    this.hitFlash   = document.getElementById('hit-flash');
    this.killNotify = document.getElementById('kill-notify');

    this._score     = 0;
    this._kills     = 0;
    this._combo     = 1;
    this._wave      = 1;

    this._hitFlashTimer  = 0;
    this._notifyTimer    = 0;
    this._shootTimer     = 0;
    this._comboResetTimer = 0;
    this._COMBO_WINDOW   = 3.0; // seconds between kills to keep combo
  }

  // ---- Score ----
  get score() { return this._score; }

  addScore(base) {
    const pts = base * this._combo;
    this._score += pts;
    this.scoreEl.textContent = String(this._score).padStart(6, '0');
    // Pop animation
    this.scoreEl.classList.remove('score-pop');
    void this.scoreEl.offsetWidth; // reflow
    this.scoreEl.classList.add('score-pop');
    return pts;
  }

  // ---- Kills & Combo ----
  registerKill() {
    this._kills++;
    this.killsEl.textContent = this._kills;

    // Combo logic
    this._combo++;
    this._comboResetTimer = this._COMBO_WINDOW;
    this._updateComboDisplay();

    // Show combo notification
    const messages = [
      'GOLPE!', 'DOBLE!', 'TRIPLE!', 'CUÁDRUPLE!', 'IMPARABLE!',
      'DEVASTADOR!', 'INHUMANO!', 'DIOS DE LA GUERRA!',
    ];
    const msgIdx = Math.min(this._combo - 2, messages.length - 1);
    const msg = this._combo >= 2 ? messages[msgIdx] : 'OBJETIVO ELIMINADO';
    this._showNotify(msg);
  }

  _updateComboDisplay() {
    this.comboEl.textContent = `x${this._combo}`;
    const colors = ['#00f5ff','#00ff88','#ffe500','#ff2d78','#b44fff'];
    const idx = Math.min(this._combo - 1, colors.length - 1);
    this.comboEl.style.color = colors[idx];
    this.comboEl.style.textShadow = `0 0 12px ${colors[idx]}`;
  }

  _showNotify(text) {
    this.killNotify.textContent = text;
    this.killNotify.classList.remove('show');
    void this.killNotify.offsetWidth;
    this.killNotify.classList.add('show');
    this._notifyTimer = 1.2;
  }

  // ---- Wave ----
  setWave(w) {
    this._wave = w;
    this.waveEl.textContent = w;
  }

  // ---- Hit flash (when player hits target) ----
  showHitFlash() {
    this._hitFlashTimer = 0.12;
  }

  // ---- Crosshair shoot effect ----
  triggerShoot() {
    this._shootTimer = 0.1;
    this.crosshair.classList.add('shoot');
  }

  // ---- Update loop ----
  update(delta) {
    // Hit flash
    if (this._hitFlashTimer > 0) {
      this._hitFlashTimer -= delta;
      this.hitFlash.classList.toggle('active', this._hitFlashTimer > 0);
    }

    // Kill notify
    if (this._notifyTimer > 0) {
      this._notifyTimer -= delta;
      if (this._notifyTimer <= 0) {
        this.killNotify.classList.remove('show');
      }
    }

    // Crosshair
    if (this._shootTimer > 0) {
      this._shootTimer -= delta;
      if (this._shootTimer <= 0) {
        this.crosshair.classList.remove('shoot');
      }
    }

    // Combo reset
    if (this._combo > 1) {
      this._comboResetTimer -= delta;
      if (this._comboResetTimer <= 0) {
        this._combo = 1;
        this._updateComboDisplay();
      }
    }
  }

  reset() {
    this._score = 0;
    this._kills = 0;
    this._combo = 1;
    this._wave  = 1;
    this.scoreEl.textContent = '000000';
    this.killsEl.textContent = '0';
    this.waveEl.textContent  = '1';
    this._updateComboDisplay();
    this.hitFlash.classList.remove('active');
    this.killNotify.classList.remove('show');
    this.crosshair.classList.remove('shoot');
  }
}
