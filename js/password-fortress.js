// ==========================================
// Module 2: CipherFortress — Password & Entropy Engine
// ==========================================

const WORD_BANK = [
  "matrix", "quantum", "cipher", "falcon", "orbit", "beacon", "crypto", "nebula",
  "shield", "plasma", "timber", "granite", "solstice", "vortex", "cobalt", "zenith",
  "phantom", "aurora", "catalyst", "stratum", "pulsar", "echo", "vertex", "horizon",
  "glacier", "prism", "monolith", "seraph", "valkyrie", "chronos", "spectrum", "titan"
];

class PasswordFortress {
  constructor() {
    this.currentPassword = "";
  }

  init() {
    const input = document.getElementById("pwd-input");
    if (input) {
      input.addEventListener("input", (e) => this.analyze(e.target.value));
    }
    this.generatePassphrase();
  }

  calculateEntropy(pwd) {
    if (!pwd) return { bits: 0, poolSize: 0, length: 0 };
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33;

    if (pool === 0) pool = 1;
    const bits = Math.round(pwd.length * (Math.log2(pool)));
    return { bits, poolSize: pool, length: pwd.length };
  }

  formatCrackTime(seconds) {
    if (seconds <= 0.001) return "Instant (< 1 ms)";
    if (seconds < 1) return `${Math.round(seconds * 1000)} milliseconds`;
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 31536000 * 1000000) return `${(seconds / (31536000 * 1000)).toFixed(1)}k years`;
    if (seconds < 31536000 * 1000000000) return `${(seconds / (31536000 * 1000000)).toFixed(1)} Million years`;
    return "Centuries (Exceeds Age of Universe)";
  }

  analyze(pwd) {
    this.currentPassword = pwd;
    const { bits, poolSize, length } = this.calculateEntropy(pwd);

    // Elements
    const bitsEl = document.getElementById("entropy-bits");
    const barEl = document.getElementById("strength-bar");
    const statusTextEl = document.getElementById("strength-status");
    const cpuEl = document.getElementById("crack-cpu");
    const rtxEl = document.getElementById("crack-rtx");
    const quantumEl = document.getElementById("crack-quantum");
    const patternEl = document.getElementById("pattern-warnings");

    if (bitsEl) bitsEl.textContent = `${bits} bits`;

    // Calculate Combinations
    const totalCombinations = Math.pow(poolSize, length);

    // Speeds:
    // CPU: 10 Million tries/sec (offline hash)
    // RTX 4090 Cluster: 100 Billion tries/sec (10^11)
    // Quantum Grover speedup: effective combinations ~ sqrt(N)
    const cpuSec = (totalCombinations / 2) / 10000000;
    const rtxSec = (totalCombinations / 2) / 100000000000;
    const quantumSec = (Math.sqrt(totalCombinations) / 2) / 10000000000;

    if (cpuEl) cpuEl.textContent = this.formatCrackTime(cpuSec);
    if (rtxEl) rtxEl.textContent = this.formatCrackTime(rtxSec);
    if (quantumEl) quantumEl.textContent = this.formatCrackTime(quantumSec);

    // Strength classification
    let strength = "VERY WEAK";
    let colorClass = "bg-rose-500";
    let width = "15%";

    if (bits > 28 && bits <= 45) {
      strength = "WEAK";
      colorClass = "bg-amber-500";
      width = "35%";
    } else if (bits > 45 && bits <= 65) {
      strength = "MODERATE";
      colorClass = "bg-yellow-400";
      width = "60%";
    } else if (bits > 65 && bits <= 85) {
      strength = "STRONG";
      colorClass = "bg-emerald-500";
      width = "85%";
    } else if (bits > 85) {
      strength = "MILITARY GRADE (QUANTUM RESISTANT)";
      colorClass = "bg-cyan-400";
      width = "100%";
    }

    if (barEl) {
      barEl.style.width = width;
      barEl.className = `h-full rounded-full transition-all duration-300 ${colorClass}`;
    }
    if (statusTextEl) {
      statusTextEl.textContent = strength;
    }

    // Pattern Warnings
    const warnings = [];
    if (/^[a-zA-Z]+$/.test(pwd) && pwd.length > 0) warnings.push("No numbers or special symbols detected.");
    if (/^[0-9]+$/.test(pwd) && pwd.length > 0) warnings.push("Numeric-only passwords are trivially brute-forced.");
    if (/(.)\1{2,}/.test(pwd)) warnings.push("Contains repeating characters (e.g. 'aaa').");
    if (/12345|qwerty|password|admin|welcome/i.test(pwd)) warnings.push("Contains known dictionary pattern or keyboard sequence.");
    if (length > 0 && length < 12) warnings.push("Under 12 characters: modern offline GPU clusters can crack this in hours.");

    if (patternEl) {
      if (warnings.length > 0) {
        patternEl.innerHTML = warnings.map(w => `
          <div class="text-xs text-amber-300 flex items-center gap-1.5 py-1 border-b border-amber-950/40">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>${w}</span>
          </div>
        `).join("");
      } else if (pwd.length === 0) {
        patternEl.innerHTML = `<span class="text-xs text-slate-500">Type a password or passphrase above to run live entropy diagnostics.</span>`;
      } else {
        patternEl.innerHTML = `<div class="text-xs text-emerald-400 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> No common dictionary weaknesses or predictable keyboard walks found!</div>`;
      }
    }
  }

  generatePassphrase() {
    const wordCount = 4;
    const selected = [];
    for (let i = 0; i < wordCount; i++) {
      const idx = Math.floor(Math.random() * WORD_BANK.length);
      selected.push(WORD_BANK[idx]);
    }
    const num = Math.floor(Math.random() * 90 + 10);
    const pass = `${selected.join("-")}-${num}`;

    const recEl = document.getElementById("generated-passphrase");
    if (recEl) {
      recEl.textContent = pass;
    }
  }

  copyPassphrase() {
    const recEl = document.getElementById("generated-passphrase");
    if (recEl && recEl.textContent) {
      navigator.clipboard.writeText(recEl.textContent).then(() => {
        alert("Passphrase copied to clipboard: " + recEl.textContent);
      });
    }
  }
}

window.PasswordFortress = new PasswordFortress();
