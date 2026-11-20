// ==========================================
// Main Application Controller: threatIQ
// ==========================================

class ThreatIQApp {
  constructor() {
    this.currentTab = "overview";
    this.soundEnabled = false;
    this.audioCtx = null;
  }

  init() {
    this.setupNavigation();
    this.setupAudio();
    this.setupTerminal();

    // Initialize all submodules
    if (window.PhishGuard) window.PhishGuard.init();
    if (window.PasswordFortress) window.PasswordFortress.init();
    if (window.CryptoLab) window.CryptoLab.init();
    if (window.ExifScrubber) window.ExifScrubber.init();
    if (window.BrowserAudit) window.BrowserAudit.init();
    if (window.SentinelSOC) window.SentinelSOC.init();
    if (window.ThreatMap) window.ThreatMap.init();
    if (window.CvssCalculator) window.CvssCalculator.init();
    if (window.DefenderChallenge) window.DefenderChallenge.init();
    if (window.CyberWarGame) window.CyberWarGame.init();
    if (window.SteganoLab) window.SteganoLab.init();
    if (window.ThreatTriageAI) window.ThreatTriageAI.init();
    if (window.UrlAnalyzer) window.UrlAnalyzer.init();

    if (window.lucide) window.lucide.createIcons();
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll("[data-nav-target]");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-nav-target");
        this.switchTab(target);
      });
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    this.playSound("click");

    // Hide all tab panes
    const panes = document.querySelectorAll(".tab-pane");
    panes.forEach(pane => pane.classList.add("hidden"));

    // Show target tab pane
    const activePane = document.getElementById(`tab-${tabId}`);
    if (activePane) {
      activePane.classList.remove("hidden");
    }

    // Update active nav styling
    const navButtons = document.querySelectorAll("[data-nav-target]");
    navButtons.forEach(btn => {
      const target = btn.getAttribute("data-nav-target");
      if (target === tabId) {
        btn.classList.add("text-cyan-400", "border-cyan-400", "bg-cyan-950/30");
        btn.classList.remove("text-slate-400", "border-transparent");
      } else {
        btn.classList.remove("text-cyan-400", "border-cyan-400", "bg-cyan-950/30");
        btn.classList.add("text-slate-400", "border-transparent");
      }
    });

    // Refresh canvases/charts
    if (tabId === "sentinel-soc") {
      if (window.SentinelSOC && window.SentinelSOC.chart) {
        setTimeout(() => window.SentinelSOC.chart.resize(), 100);
      }
      if (window.ThreatMap) {
        setTimeout(() => window.ThreatMap.resize(), 100);
      }
    }

    if (window.lucide) window.lucide.createIcons();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  setupAudio() {
    const toggleBtn = document.getElementById("sound-toggle-btn");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      this.soundEnabled = !this.soundEnabled;
      toggleBtn.innerHTML = this.soundEnabled 
        ? `<i data-lucide="volume-2" class="w-4 h-4 text-cyan-400"></i><span class="text-xs font-mono text-cyan-400">HUD SFX ON</span>`
        : `<i data-lucide="volume-x" class="w-4 h-4 text-slate-500"></i><span class="text-xs font-mono text-slate-500">SFX OFF</span>`;
      if (window.lucide) window.lucide.createIcons();
      if (this.soundEnabled) this.playSound("beep");
    });
  }

  playSound(type) {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;
      if (type === "click") {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "beep") {
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  setupTerminal() {
    const termInput = document.getElementById("terminal-cmd-input");
    const termOutput = document.getElementById("terminal-history");

    if (!termInput || !termOutput) return;

    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = termInput.value.trim().toLowerCase();
        termInput.value = "";
        this.handleCommand(cmd, termOutput);
      }
    });
  }

  handleCommand(cmd, container) {
    const line = document.createElement("div");
    line.className = "text-xs font-mono mt-1";

    let response = "";
    if (cmd === "help") {
      response = `
        <div class="text-cyan-400 mb-1">AVAILABLE THREATIQ COMMANDS:</div>
        <div class="text-slate-300 space-y-0.5">
          • <span class="text-yellow-400">battle</span>: Launch Red Team vs Blue Team Cyber War Game<br>
          • <span class="text-yellow-400">triage</span>: Open AI Threat Intelligence Copilot<br>
          • <span class="text-yellow-400">stego</span>: Open LSB Steganography Lab<br>
          • <span class="text-yellow-400">url</span>: Open Malicious Link De-Cloaker<br>
          • <span class="text-yellow-400">challenge</span>: Open Defender Aptitude Challenge & Certificate<br>
          • <span class="text-yellow-400">scan</span>: Run quick environment security audit<br>
          • <span class="text-yellow-400">soc</span>: Switch to SentinelSOC & Global Threat Map<br>
          • <span class="text-yellow-400">pass</span>: Launch CipherFortress entropy engine<br>
          • <span class="text-yellow-400">phish</span>: Open Social Engineering Phishing Lab<br>
          • <span class="text-yellow-400">cvss</span>: Open CVSS 3.1 Calculator<br>
          • <span class="text-yellow-400">exif</span>: Open EXIF Metadata Scrubber<br>
          • <span class="text-yellow-400">clear</span>: Clear terminal buffer
        </div>
      `;
    } else if (cmd === "scan") {
      response = `<span class="text-emerald-400">[AUDIT COMPLETE] Screen: ${window.screen.width}x${window.screen.height} | Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone} | Cores: ${navigator.hardwareConcurrency || 4}</span>`;
    } else if (cmd === "battle" || cmd === "wargame") {
      this.switchTab("wargame");
      response = `<span class="text-cyan-400">Navigating to Red Team vs Blue Team Arena...</span>`;
    } else if (cmd === "triage" || cmd === "ai") {
      this.switchTab("ai-triage");
      response = `<span class="text-cyan-400">Navigating to AI Threat Intelligence Copilot...</span>`;
    } else if (cmd === "stego") {
      this.switchTab("steganography");
      response = `<span class="text-cyan-400">Navigating to Steganography Lab...</span>`;
    } else if (cmd === "url") {
      this.switchTab("url-analyzer");
      response = `<span class="text-cyan-400">Navigating to Malicious URL De-Cloaker...</span>`;
    } else if (cmd === "challenge" || cmd === "cert") {
      this.switchTab("challenge");
      response = `<span class="text-cyan-400">Navigating to Defender Challenge & Certificate...</span>`;
    } else if (cmd === "soc" || cmd === "playbook") {
      this.switchTab("sentinel-soc");
      response = `<span class="text-cyan-400">Navigating to SentinelSOC...</span>`;
    } else if (cmd === "phish") {
      this.switchTab("phish-guard");
      response = `<span class="text-cyan-400">Navigating to PhishGuard Lab...</span>`;
    } else if (cmd === "pass") {
      this.switchTab("cipher-fortress");
      response = `<span class="text-cyan-400">Navigating to CipherFortress...</span>`;
    } else if (cmd === "exif") {
      this.switchTab("privacy-shield");
      response = `<span class="text-cyan-400">Navigating to PrivacyShield EXIF Scrubber...</span>`;
    } else if (cmd === "cvss") {
      this.switchTab("disclose-safe");
      response = `<span class="text-cyan-400">Navigating to DiscloseSafe CVSS Calculator...</span>`;
    } else if (cmd === "clear") {
      container.innerHTML = "";
      return;
    } else if (cmd === "") {
      return;
    } else {
      response = `<span class="text-rose-400">Command not recognized: '${cmd}'. Type <span class="underline">help</span> for assistance.</span>`;
    }

    line.innerHTML = `<span class="text-slate-500 font-bold">$ threatiq-cli &gt;</span> <span class="text-slate-200">${cmd}</span><br>${response}`;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.ThreatIQ = new ThreatIQApp();
  window.ThreatIQ.init();
});
