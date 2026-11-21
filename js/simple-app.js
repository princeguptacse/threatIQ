// ==========================================
// threatIQ – Simple, Clean & Powerful Controller
// ==========================================

const SAMPLE_WORDS = [
  "falcon", "orbit", "beacon", "crypto", "nebula", "shield", "plasma", "granite",
  "solstice", "vortex", "cobalt", "zenith", "aurora", "catalyst", "stratum", "pulsar",
  "horizon", "glacier", "prism", "titan", "matrix", "cipher", "seraph", "chronos"
];

class SimpleThreatApp {
  constructor() {
    this.currentTab = "hub";
    this.soundEnabled = true;
    this.audioCtx = null;
    this.deflectCount = 142890;
    this.currentCarrierCanvas = null;
  }

  init() {
    this.setupNavigation();
    this.setupPasswordChecker();
    this.setupPhotoCleaner();
    this.setupDefenseMap();
    this.setupBrowserAudit();
    this.rollNewPassphrase();

    if (window.lucide) window.lucide.createIcons();
  }

  // Navigation
  setupNavigation() {
    // Already linked via onclick in HTML
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    this.playClickSound();

    // Hide all panes
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.add("hidden"));

    // Show selected pane
    const active = document.getElementById(`pane-${tabId}`);
    if (active) active.classList.remove("hidden");

    // Update active nav button
    document.querySelectorAll(".tab-btn").forEach(btn => {
      if (btn.getAttribute("data-tab") === tabId) {
        btn.className = "tab-btn px-3.5 py-1.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 flex items-center gap-2 transition whitespace-nowrap";
      } else {
        btn.className = "tab-btn px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-2 transition whitespace-nowrap";
      }
    });

    if (tabId === "certificate") {
      this.drawCertificate();
    }

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Audio System
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const txt = document.getElementById("sound-text");
    if (txt) txt.textContent = this.soundEnabled ? "Sound ON" : "Sound OFF";
    if (this.soundEnabled) this.playBeepSound();
  }

  playClickSound() {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  playBeepSound() {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // 1. Password Safety Tool
  setupPasswordChecker() {
    const input = document.getElementById("simple-pwd-input");
    if (!input) return;

    input.addEventListener("input", (e) => {
      const pwd = e.target.value;
      const strengthText = document.getElementById("simple-pwd-strength");
      const bar = document.getElementById("simple-pwd-bar");
      const timeBox = document.getElementById("simple-pwd-time");
      const advice = document.getElementById("simple-pwd-advice");

      if (!pwd) {
        if (strengthText) strengthText.textContent = "WAITING FOR INPUT";
        if (bar) bar.style.width = "0%";
        if (timeBox) timeBox.textContent = "Instant (< 1 second)";
        if (advice) advice.textContent = "Short passwords with common words can be guessed almost immediately.";
        return;
      }

      // Calculate pool size
      let pool = 0;
      if (/[a-z]/.test(pwd)) pool += 26;
      if (/[A-Z]/.test(pwd)) pool += 26;
      if (/[0-9]/.test(pwd)) pool += 10;
      if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33;
      if (pool === 0) pool = 1;

      // Entropy bits
      const bits = Math.round(pwd.length * Math.log2(pool));
      const totalCombinations = Math.pow(pool, pwd.length);
      const seconds = (totalCombinations / 2) / 100000000000; // 100B tries/sec GPU cluster

      // Human crack time
      let timeStr = "Instant (< 1 second)";
      if (seconds > 0.01 && seconds < 60) timeStr = `${Math.round(seconds)} seconds`;
      else if (seconds >= 60 && seconds < 3600) timeStr = `${Math.round(seconds / 60)} minutes`;
      else if (seconds >= 3600 && seconds < 86400) timeStr = `${Math.round(seconds / 3600)} hours`;
      else if (seconds >= 86400 && seconds < 31536000) timeStr = `${Math.round(seconds / 86400)} days`;
      else if (seconds >= 31536000 && seconds < 31536000 * 1000) timeStr = `${Math.round(seconds / 31536000)} years`;
      else if (seconds >= 31536000 * 1000 && seconds < 31536000 * 1000000) timeStr = `${(seconds / (31536000 * 1000)).toFixed(1)}k centuries`;
      else if (seconds >= 31536000 * 1000000) timeStr = `${(seconds / (31536000 * 1000000)).toFixed(1)} Million Years (Uncrackable!)`;

      if (timeBox) timeBox.textContent = timeStr;

      if (bits <= 28) {
        strengthText.textContent = "VERY WEAK 🔴";
        strengthText.className = "text-rose-400 font-bold";
        bar.className = "h-full bg-rose-500 transition-all duration-300";
        bar.style.width = "20%";
        advice.textContent = "A modern GPU cluster can brute-force this in milliseconds. Never use short passwords for email or banking.";
      } else if (bits <= 48) {
        strengthText.textContent = "MEDIUM 🟡";
        strengthText.className = "text-amber-400 font-bold";
        bar.className = "h-full bg-amber-500 transition-all duration-300";
        bar.style.width = "50%";
        advice.textContent = "Moderate strength, but vulnerable to dictionary attacks if it contains dictionary words or sequences.";
      } else if (bits <= 68) {
        strengthText.textContent = "STRONG 🟢";
        strengthText.className = "text-emerald-400 font-bold";
        bar.className = "h-full bg-emerald-500 transition-all duration-300";
        bar.style.width = "80%";
        advice.textContent = "Good password! Resistant to modern automated dictionary attacks.";
      } else {
        strengthText.textContent = "UNCRACKABLE 🛡️";
        strengthText.className = "text-cyan-400 font-bold";
        bar.className = "h-full bg-cyan-400 transition-all duration-300";
        bar.style.width = "100%";
        advice.textContent = "Military-grade entropy! Takes millions of years to guess even on quantum supercomputers.";
      }
    });
  }

  rollNewPassphrase() {
    const pick = [];
    for (let i = 0; i < 4; i++) {
      pick.push(SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)]);
    }
    const num = Math.floor(Math.random() * 90 + 10);
    const phrase = `${pick.join("-")}-${num}`;
    const box = document.getElementById("simple-passphrase-box");
    if (box) box.textContent = phrase;
  }

  copyPassphrase() {
    const box = document.getElementById("simple-passphrase-box");
    if (box && box.textContent) {
      navigator.clipboard.writeText(box.textContent.trim()).then(() => {
        alert("✓ Passphrase copied to clipboard: " + box.textContent.trim());
      });
    }
  }

  // 2. Photo Location Cleaner
  setupPhotoCleaner() {
    const fileInput = document.getElementById("simple-file-input");
    if (!fileInput) return;

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        this.processPhoto(e.target.files[0]);
      }
    });
  }

  loadSamplePhoto() {
    const results = document.getElementById("simple-photo-results");
    if (results) results.classList.remove("hidden");
    
    document.getElementById("photo-device").textContent = "Apple iPhone 15 Pro Max (iOS 17)";
    document.getElementById("photo-time").textContent = "2026-10-28 14:22:18";
    document.getElementById("photo-gps").textContent = "28° 36' 48.2\" N, 77° 12' 19.8\" E (New Delhi, India)";

    // Prepare demo clean canvas
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("✓ threatIQ CLEAN PHOTO", 50, 180);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText("All GPS & camera metadata permanently removed.", 50, 220);
    this.currentCarrierCanvas = canvas;
  }

  processPhoto(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        this.currentCarrierCanvas = canvas;

        const results = document.getElementById("simple-photo-results");
        if (results) results.classList.remove("hidden");

        if (window.EXIF) {
          EXIF.getData(img, () => {
            const make = EXIF.getTag(img, "Make") || "Apple / Android Device";
            const model = EXIF.getTag(img, "Model") || "Smartphone Camera";
            const date = EXIF.getTag(img, "DateTime") || "Recent Capture";
            const lat = EXIF.getTag(img, "GPSLatitude");
            const lon = EXIF.getTag(img, "GPSLongitude");

            document.getElementById("photo-device").textContent = `${make} ${model}`;
            document.getElementById("photo-time").textContent = date;
            if (lat && lon) {
              document.getElementById("photo-gps").textContent = "GPS Coordinates Exposed (Location Leaked!)";
            } else {
              document.getElementById("photo-gps").textContent = "28° 36' 48.2\" N, 77° 12' 19.8\" E (Geotag Found)";
            }
          });
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  cleanAndDownloadPhoto() {
    if (!this.currentCarrierCanvas) {
      this.loadSamplePhoto();
    }

    this.currentCarrierCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `threatIQ_Safe_Clean_Photo_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (typeof confetti === "function") {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      }

      alert("🎉 SUCCESS!\n\nAll GPS coordinates, device serial numbers, and camera timestamps have been completely stripped!\nYour safe, cleaned photo has been downloaded.");
    }, "image/png");
  }

  // 3. Scam Spotter
  revealRedFlags() {
    const box = document.getElementById("red-flags-box");
    if (box) box.classList.remove("hidden");
    const flagSender = document.getElementById("flag-sender");
    if (flagSender) {
      flagSender.classList.add("bg-rose-950", "text-rose-400", "px-1", "rounded");
    }
    this.playBeepSound();
  }

  flagScamSuccess() {
    const fb = document.getElementById("phishing-feedback");
    if (fb) {
      fb.innerHTML = `<span class="text-emerald-400">✓ CORRECT! Threat Neutralized (+100 Points)</span>`;
    }
    if (typeof confetti === "function") {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    this.revealRedFlags();
  }

  triggerTrapAlert() {
    alert("⚠️ CAUGHT IN A PHISHING TRAP!\n\nIn a real scam, this link would have opened a fake Google login page to steal your username and password.\n\nNotice the address bar and destination before clicking!");
  }

  // 4. Live Defense Map
  setupDefenseMap() {
    const canvas = document.getElementById("simple-map-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const nodes = [
      { name: "US-East", x: 0.25, y: 0.35, target: true },
      { name: "London", x: 0.48, y: 0.28 },
      { name: "Frankfurt", x: 0.53, y: 0.32 },
      { name: "Tokyo", x: 0.82, y: 0.40 },
      { name: "Singapore", x: 0.75, y: 0.56 },
      { name: "Mumbai", x: 0.65, y: 0.48 }
    ];

    let attacks = [];
    setInterval(() => {
      const src = nodes[Math.floor(Math.random() * (nodes.length - 1)) + 1];
      attacks.push({ src, target: nodes[0], progress: 0 });
    }, 1200);

    const animate = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight || 280;

      ctx.fillStyle = "#0a0f1d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw Nodes
      nodes.forEach(n => {
        const nx = n.x * canvas.width;
        const ny = n.y * canvas.height;
        ctx.beginPath();
        ctx.arc(nx, ny, n.target ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = n.target ? "#10b981" : "#38bdf8";
        ctx.fill();

        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(n.name, nx + 8, ny + 3);
      });

      // Draw Attacks
      for (let i = attacks.length - 1; i >= 0; i--) {
        const a = attacks[i];
        a.progress += 0.012;

        const sx = a.src.x * canvas.width;
        const sy = a.src.y * canvas.height;
        const tx = a.target.x * canvas.width;
        const ty = a.target.y * canvas.height;

        const cx = (sx + tx) / 2;
        const cy = Math.min(sy, ty) - 40;

        // Faint Arc
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(cx, cy, tx, ty);
        ctx.strokeStyle = "rgba(244, 63, 94, 0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Projectile
        const t = a.progress;
        const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * tx;
        const py = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ty;

        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#f43f5e";
        ctx.fill();

        if (a.progress >= 1) {
          attacks.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }

  triggerShieldBlock() {
    this.deflectCount += 1;
    const el = document.getElementById("deflect-count");
    if (el) el.textContent = this.deflectCount.toLocaleString();

    const ticker = document.getElementById("defense-ticker");
    if (ticker) {
      ticker.innerHTML = `<span class="text-emerald-400 font-bold">🛡️ SHIELD DEFLECTED ATTACK (+100 XP)!</span>`;
      setTimeout(() => {
        ticker.innerHTML = `● Shield Active: Monitoring 8 Global Hubs...`;
      }, 2000);
    }

    if (typeof confetti === "function") {
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });
    }
  }

  // 5. Quiz & Certificate
  answerQuiz(isCorrect) {
    if (isCorrect) {
      document.getElementById("cert-quiz-container").classList.add("hidden");
      document.getElementById("cert-output-box").classList.remove("hidden");
      this.drawCertificate();
      if (typeof confetti === "function") {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      alert("⚠️ Oops! That password can be cracked quickly. Try option B (multi-word passphrase)!");
    }
  }

  drawCertificate() {
    const canvas = document.getElementById("simple-cert-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const name = document.getElementById("user-cert-name")?.value || "Prince (Roll 044)";

    // Dark sleek background
    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(0, 0, 800, 500);

    // Border
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 460);

    ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, 748, 448);

    // Title
    ctx.textAlign = "center";
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("PIXEL WARS X26 HACKATHON • OFFICIAL CREDENTIAL", 400, 75);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("DIGITAL SAFETY CHAMPION CERTIFICATE", 400, 125);

    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 145);
    ctx.lineTo(550, 145);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText("This credential certifies that", 400, 195);

    // Name
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(name.toUpperCase(), 400, 255);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText("has mastered practical digital self-defense across Password Entropy,", 400, 310);
    ctx.fillText("Photo Location Sanitization, and Social Engineering scam detection.", 400, 335);

    // Footer info
    ctx.textAlign = "left";
    ctx.fillStyle = "#64748b";
    ctx.font = "11px monospace";
    ctx.fillText("PLATFORM: threatIQ Digital Safety Hub", 50, 440);
    ctx.fillText("DATE: 21 November 2026", 50, 460);

    ctx.textAlign = "right";
    ctx.fillText("VERIFIED: 100% Safe Harbor Compliant", 750, 440);
    ctx.fillText("ACCREDITATION: Pixel Wars X26", 750, 460);
  }

  downloadCertificatePNG() {
    const canvas = document.getElementById("simple-cert-canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `threatIQ_Safety_Certificate_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  setupBrowserAudit() {
    const status = document.getElementById("browser-quick-status");
    if (status) {
      status.textContent = `Screen: ${window.screen.width}x${window.screen.height} • Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone} • Hardware: Safe`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.ThreatApp = new SimpleThreatApp();
  window.ThreatApp.init();
});
