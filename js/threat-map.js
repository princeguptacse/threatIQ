// ==========================================
// Elite Feature: Canvas Global Threat Attack Map
// ==========================================

class ThreatMap {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.nodes = [
      { name: "US-East (HQ)", x: 0.28, y: 0.38, isTarget: true },
      { name: "Frankfurt", x: 0.52, y: 0.32, isTarget: false },
      { name: "Tokyo", x: 0.84, y: 0.42, isTarget: false },
      { name: "Singapore", x: 0.78, y: 0.58, isTarget: false },
      { name: "São Paulo", x: 0.35, y: 0.75, isTarget: false },
      { name: "Sydney", x: 0.88, y: 0.82, isTarget: false },
      { name: "London", x: 0.48, y: 0.28, isTarget: false },
      { name: "Mumbai", x: 0.68, y: 0.48, isTarget: false }
    ];
    this.attacks = [];
    this.animationId = null;
  }

  init() {
    this.canvas = document.getElementById("threat-map-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Spawn attacks continuously
    setInterval(() => this.spawnAttack(), 1200);
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = Math.max(rect.height, 260);
  }

  spawnAttack() {
    const attackers = this.nodes.filter(n => !n.isTarget);
    const src = attackers[Math.floor(Math.random() * attackers.length)];
    const target = this.nodes.find(n => n.isTarget);
    const types = ["DDoS HTTP Flood", "SQLi Probe", "Credential Stuffing", "Canary Trigger", "Port Scan"];
    const type = types[Math.floor(Math.random() * types.length)];
    const isCritical = type.includes("Canary") || type.includes("DDoS");

    this.attacks.push({
      src,
      target,
      progress: 0,
      speed: 0.008 + Math.random() * 0.006,
      type,
      color: isCritical ? "#f43f5e" : "#06b6d4"
    });

    // Update Live Attack Ticker in DOM
    const ticker = document.getElementById("threat-map-ticker");
    if (ticker) {
      ticker.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-cyan-400'} animate-ping mr-1"></span>
        <span class="${isCritical ? 'text-rose-400 font-bold' : 'text-cyan-300'}">${src.name} &rarr; ${target.name} [${type}]</span>
      `;
    }
  }

  animate() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark clear background
    this.ctx.fillStyle = "rgba(9, 13, 22, 0.25)";
    this.ctx.fillRect(0, 0, w, h);

    // Draw grid lines
    this.ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Draw Nodes
    this.nodes.forEach(node => {
      const nx = node.x * w;
      const ny = node.y * h;

      this.ctx.beginPath();
      this.ctx.arc(nx, ny, node.isTarget ? 6 : 4, 0, Math.PI * 2);
      this.ctx.fillStyle = node.isTarget ? "#10b981" : "#38bdf8";
      this.ctx.shadowBlur = node.isTarget ? 15 : 8;
      this.ctx.shadowColor = node.isTarget ? "#10b981" : "#38bdf8";
      this.ctx.fill();

      // Node label
      this.ctx.font = "9px 'JetBrains Mono', monospace";
      this.ctx.fillStyle = "#94a3b8";
      this.ctx.shadowBlur = 0;
      this.ctx.fillText(node.name, nx + 8, ny + 3);
    });

    // Draw & update attack arcs
    for (let i = this.attacks.length - 1; i >= 0; i--) {
      const a = this.attacks[i];
      a.progress += a.speed;

      const sx = a.src.x * w;
      const sy = a.src.y * h;
      const tx = a.target.x * w;
      const ty = a.target.y * h;

      // Arc curve control point
      const cx = (sx + tx) / 2;
      const cy = Math.min(sy, ty) - 50;

      // Draw faint arc trajectory
      this.ctx.beginPath();
      this.ctx.moveTo(sx, sy);
      this.ctx.quadraticCurveTo(cx, cy, tx, ty);
      this.ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      // Calculate particle position along quadratic bezier curve
      const t = a.progress;
      const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * tx;
      const py = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ty;

      // Draw glowing projectile
      this.ctx.beginPath();
      this.ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      this.ctx.fillStyle = a.color;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = a.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      if (a.progress >= 1) {
        // Impact burst at target
        this.ctx.beginPath();
        this.ctx.arc(tx, ty, 14, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
        this.ctx.fill();
        this.attacks.splice(i, 1);
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

window.ThreatMap = new ThreatMap();
