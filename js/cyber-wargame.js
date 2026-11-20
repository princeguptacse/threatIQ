// ==========================================
// Elite Feature 1: Red Team vs Blue Team Cyber War Game
// ==========================================

class CyberWarGame {
  constructor() {
    this.serverHealth = 100;
    this.threatLevel = "NORMAL";
    this.wave = 1;
    this.score = 0;
    this.gameRunning = false;
    this.timer = null;
    this.currentAttack = null;
    this.attackInterval = null;
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById("wargame-container");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Game HUD Header -->
        <div class="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 font-bold text-lg font-mono">
              ⚔️
            </div>
            <div>
              <div class="text-xs font-mono text-slate-500 uppercase">CYBER WAR GAME (SIMULATOR)</div>
              <h3 class="text-sm font-bold text-white">Red Team Infiltration vs Blue Team Defense</h3>
            </div>
          </div>

          <div class="flex items-center gap-4 text-xs font-mono">
            <div>
              <span class="text-slate-500 block text-[10px]">CURRENT WAVE:</span>
              <span id="wg-wave" class="text-cyan-400 font-bold text-sm">WAVE ${this.wave} / 5</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">SCORE / XP:</span>
              <span id="wg-score" class="text-emerald-400 font-bold text-sm">${this.score} XP</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px]">SERVER INTEGRITY:</span>
              <span id="wg-health-text" class="text-emerald-400 font-bold text-sm">${this.serverHealth}%</span>
            </div>
          </div>
        </div>

        <!-- Health Bar -->
        <div class="space-y-1.5 font-mono text-xs">
          <div class="flex justify-between text-slate-400">
            <span>INFRASTRUCTURE HEALTH</span>
            <span id="wg-threat-status" class="text-emerald-400 font-bold">STATUS: STABLE</span>
          </div>
          <div class="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div id="wg-health-bar" class="h-full bg-emerald-500 transition-all duration-300" style="width: ${this.serverHealth}%"></div>
          </div>
        </div>

        <!-- Battlefield Arena (2 Columns: Red Attack vs Blue Defense) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <!-- Red Team (Attacker Feed) -->
          <div class="p-5 rounded-xl border border-rose-500/30 bg-rose-950/10 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-rose-900/40 text-xs font-mono">
              <span class="text-rose-400 font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                RED TEAM (INCOMING ATTACK VECTOR)
              </span>
              <span class="text-slate-500 font-bold" id="wg-countdown">READY</span>
            </div>

            <div id="wg-red-box" class="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-rose-900/50 rounded-lg">
              <i data-lucide="shield-alert" class="w-8 h-8 text-rose-500 mb-2"></i>
              <p class="text-xs text-slate-400">Click "Start Cyber Battle" to initiate autonomous Red Team attack sequences.</p>
            </div>
          </div>

          <!-- Blue Team (Defense Controls) -->
          <div class="p-5 rounded-xl border border-cyan-500/30 bg-cyan-950/10 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-cyan-900/40 text-xs font-mono">
              <span class="text-cyan-400 font-bold flex items-center gap-1.5">
                <i data-lucide="shield-check" class="w-4 h-4"></i>
                BLUE TEAM (TACTICAL COUNTERMEASURES)
              </span>
              <span class="text-slate-500">CLICK TO COUNTER</span>
            </div>

            <div id="wg-blue-box" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <button onclick="window.CyberWarGame.deployDefense('WAF_RATE_LIMIT')" class="p-3 bg-slate-900 border border-slate-700 hover:border-cyan-400 rounded-lg text-left transition disabled:opacity-40" id="btn-def-1">
                <div class="font-bold text-cyan-300">🛡️ Deploy Edge WAF</div>
                <div class="text-[10px] text-slate-400 mt-0.5">Counters: L7 DDoS Floods</div>
              </button>
              <button onclick="window.CyberWarGame.deployDefense('ENFORCE_MFA')" class="p-3 bg-slate-900 border border-slate-700 hover:border-cyan-400 rounded-lg text-left transition disabled:opacity-40" id="btn-def-2">
                <div class="font-bold text-cyan-300">🔑 Enforce FIDO2 MFA</div>
                <div class="text-[10px] text-slate-400 mt-0.5">Counters: Credential Stuffing</div>
              </button>
              <button onclick="window.CyberWarGame.deployDefense('PARAMETRIZED_SQL')" class="p-3 bg-slate-900 border border-slate-700 hover:border-cyan-400 rounded-lg text-left transition disabled:opacity-40" id="btn-def-3">
                <div class="font-bold text-cyan-300">🧱 Prepared Statements</div>
                <div class="text-[10px] text-slate-400 mt-0.5">Counters: SQL Injection</div>
              </button>
              <button onclick="window.CyberWarGame.deployDefense('ISOLATE_HONEYPOT')" class="p-3 bg-slate-900 border border-slate-700 hover:border-cyan-400 rounded-lg text-left transition disabled:opacity-40" id="btn-def-4">
                <div class="font-bold text-cyan-300">☣️ Isolate Host & Canary</div>
                <div class="text-[10px] text-slate-400 mt-0.5">Counters: Ransomware</div>
              </button>
            </div>
          </div>

        </div>

        <!-- Start / Restart Controls -->
        <div class="flex items-center justify-between pt-2">
          <button 
            id="wg-start-btn" 
            onclick="window.CyberWarGame.toggleGame()" 
            class="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-600/30"
          >
            <i data-lucide="play" class="w-4 h-4"></i>
            <span>Start Cyber Battle (Wave 1)</span>
          </button>
          <span class="text-xs text-slate-500 font-mono">Test your reaction time & defensive tactics under real simulated load</span>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  toggleGame() {
    if (this.gameRunning) {
      this.stopGame();
    } else {
      this.startGame();
    }
  }

  startGame() {
    this.gameRunning = true;
    this.serverHealth = 100;
    this.wave = 1;
    this.score = 0;
    this.updateHUD();

    const startBtn = document.getElementById("wg-start-btn");
    if (startBtn) {
      startBtn.innerHTML = `<i data-lucide="square" class="w-4 h-4"></i><span>Abort Cyber Battle</span>`;
      startBtn.classList.replace("bg-rose-600", "bg-slate-700");
    }

    this.launchNextAttack();
  }

  stopGame() {
    this.gameRunning = false;
    clearTimeout(this.timer);
    clearInterval(this.attackInterval);

    const startBtn = document.getElementById("wg-start-btn");
    if (startBtn) {
      startBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i><span>Start Cyber Battle</span>`;
      startBtn.classList.replace("bg-slate-700", "bg-rose-600");
    }

    const redBox = document.getElementById("wg-red-box");
    if (redBox) {
      redBox.innerHTML = `
        <div class="text-xs font-mono text-slate-400">Battle aborted or completed. Click Start to play again.</div>
      `;
    }
  }

  launchNextAttack() {
    if (!this.gameRunning || this.serverHealth <= 0) return;

    const attacks = [
      {
        name: "Layer 7 HTTP Flood (DDoS)",
        desc: "Botnet sending 85,000 req/sec to /api/checkout",
        counter: "WAF_RATE_LIMIT",
        damage: 25,
        timeLimit: 5
      },
      {
        name: "Credential Stuffing Attack",
        desc: "Compromised credential list being sprayed against /login endpoint",
        counter: "ENFORCE_MFA",
        damage: 20,
        timeLimit: 5
      },
      {
        name: "Blind SQL Injection (SQLi)",
        desc: "Threat actor probing UNION SELECT sleep(5) on search query parameter",
        counter: "PARAMETRIZED_SQL",
        damage: 30,
        timeLimit: 5
      },
      {
        name: "Ransomware Lateral Movement",
        desc: "Ransomware canary canary.docx detected rapid entropy changes",
        counter: "ISOLATE_HONEYPOT",
        damage: 35,
        timeLimit: 4
      }
    ];

    this.currentAttack = attacks[Math.floor(Math.random() * attacks.length)];
    let timeLeft = this.currentAttack.timeLimit;

    const redBox = document.getElementById("wg-red-box");
    const countEl = document.getElementById("wg-countdown");

    if (redBox) {
      redBox.innerHTML = `
        <div class="space-y-1 font-mono text-xs">
          <div class="text-rose-400 font-bold text-sm animate-pulse">${this.currentAttack.name}</div>
          <p class="text-slate-300 text-[11px]">${this.currentAttack.desc}</p>
          <div class="text-amber-400 text-[11px] font-bold mt-2">Threat Impact: -${this.currentAttack.damage}% Health</div>
        </div>
      `;
    }

    if (countEl) countEl.textContent = `CRITICAL: ${timeLeft}s LEFT`;

    this.attackInterval = setInterval(() => {
      timeLeft--;
      if (countEl) countEl.textContent = `CRITICAL: ${timeLeft}s LEFT`;

      if (timeLeft <= 0) {
        clearInterval(this.attackInterval);
        this.inflictDamage();
      }
    }, 1000);
  }

  deployDefense(type) {
    if (!this.gameRunning || !this.currentAttack) return;

    if (type === this.currentAttack.counter) {
      // Successful mitigation!
      clearInterval(this.attackInterval);
      this.score += 150;
      this.wave++;

      const redBox = document.getElementById("wg-red-box");
      const countEl = document.getElementById("wg-countdown");
      if (countEl) countEl.textContent = "ATTACK BLOCKED!";
      if (redBox) {
        redBox.innerHTML = `
          <div class="text-emerald-400 font-mono text-xs font-bold space-y-1">
            <div class="text-base">✓ COUNTERMEASURE SUCCESSFUL!</div>
            <div>+150 XP • Attack Neutralized</div>
          </div>
        `;
      }

      if (typeof confetti === "function") {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
      }

      this.updateHUD();

      if (this.wave > 5) {
        this.victory();
      } else {
        setTimeout(() => this.launchNextAttack(), 1500);
      }
    } else {
      // Wrong counter!
      this.serverHealth = Math.max(0, this.serverHealth - 10);
      this.updateHUD();
      alert("⚠️ WRONG DEFENSE! That countermeasure does not mitigate this attack vector!");
    }
  }

  inflictDamage() {
    this.serverHealth = Math.max(0, this.serverHealth - this.currentAttack.damage);
    this.updateHUD();

    const redBox = document.getElementById("wg-red-box");
    if (redBox) {
      redBox.innerHTML = `
        <div class="text-rose-400 font-mono text-xs font-bold space-y-1">
          <div class="text-base">💥 IMPACT PENETRATED!</div>
          <div>Server took -${this.currentAttack.damage}% Damage</div>
        </div>
      `;
    }

    if (this.serverHealth <= 0) {
      this.gameOver();
    } else {
      setTimeout(() => this.launchNextAttack(), 2000);
    }
  }

  updateHUD() {
    const waveEl = document.getElementById("wg-wave");
    const scoreEl = document.getElementById("wg-score");
    const healthTextEl = document.getElementById("wg-health-text");
    const healthBarEl = document.getElementById("wg-health-bar");
    const threatStatusEl = document.getElementById("wg-threat-status");

    if (waveEl) waveEl.textContent = `WAVE ${Math.min(this.wave, 5)} / 5`;
    if (scoreEl) scoreEl.textContent = `${this.score} XP`;
    if (healthTextEl) healthTextEl.textContent = `${this.serverHealth}%`;

    if (healthBarEl) {
      healthBarEl.style.width = `${this.serverHealth}%`;
      if (this.serverHealth > 50) {
        healthBarEl.className = "h-full bg-emerald-500 transition-all duration-300";
        if (threatStatusEl) {
          threatStatusEl.textContent = "STATUS: STABLE";
          threatStatusEl.className = "text-emerald-400 font-bold";
        }
      } else if (this.serverHealth > 25) {
        healthBarEl.className = "h-full bg-amber-500 transition-all duration-300";
        if (threatStatusEl) {
          threatStatusEl.textContent = "STATUS: ELEVATED RISK";
          threatStatusEl.className = "text-amber-400 font-bold";
        }
      } else {
        healthBarEl.className = "h-full bg-rose-500 transition-all duration-300";
        if (threatStatusEl) {
          threatStatusEl.textContent = "STATUS: CRITICAL FAILURE IMMINENT";
          threatStatusEl.className = "text-rose-400 font-bold animate-pulse";
        }
      }
    }
  }

  victory() {
    this.stopGame();
    alert(`🏆 BLUE TEAM VICTORY!\n\nYou successfully defended the enterprise infrastructure across all 5 attack waves!\nFinal Score: ${this.score} XP`);
  }

  gameOver() {
    this.stopGame();
    alert("💀 INFRASTRUCTURE BREACHED!\n\nServer health reached 0%. Review your incident response playbook and try again!");
  }
}

window.CyberWarGame = new CyberWarGame();
