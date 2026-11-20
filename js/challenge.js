// ==========================================
// Elite Feature: Defender Challenge & Certificate Engine
// ==========================================

const CHALLENGE_QUESTIONS = [
  {
    q: "You receive an email from 'it-support@micros0ft-azure.net' demanding you re-authenticate your SSO account within 45 minutes to prevent suspension. What is the primary attack indicator?",
    options: [
      { text: "The sender domain uses zero '0' instead of 'o' (Homoglyph Attack)", correct: true },
      { text: "The email was sent during non-business hours", correct: false },
      { text: "It was sent to multiple recipients", correct: false },
      { text: "The subject line contains standard title casing", correct: false }
    ],
    explanation: "Attackers register typo-squatted and homoglyph domains ('micros0ft') to impersonate trusted enterprise identity portals."
  },
  {
    q: "Which credential architecture offers the highest mathematical entropy and resistance against offline GPU brute-force attacks?",
    options: [
      { text: "P@ssw0rd123! (11 characters)", correct: false },
      { text: "correct-horse-battery-staple (4 random Diceware words, ~78 bits entropy)", correct: true },
      { text: "Admin2026# (9 characters)", correct: false },
      { text: "1234567890Aa! (13 sequential characters)", correct: false }
    ],
    explanation: "Passphrase length expands the combinatorial search space exponentially ($Pool^{Length}$), making multi-word passphrases virtually immune to offline dictionary and GPU cluster attacks."
  },
  {
    q: "Why is uploading unscrubbed raw mobile camera photos to public web forums a serious physical privacy hazard?",
    options: [
      { text: "Photos can contain malware scripts in their color palettes", correct: false },
      { text: "EXIF metadata often embeds exact GPS latitude/longitude and hardware serial numbers", correct: true },
      { text: "JPEG files expose the user's local IP address", correct: false },
      { text: "PNG compression removes image copyright watermarks", correct: false }
    ],
    explanation: "Modern smartphones automatically embed GPS coordinates, altitude, and device hardware tags into EXIF headers, allowing bad actors to triangulate your exact residence or travel patterns."
  },
  {
    q: "Under standard Safe Harbor and ISO/IEC 29147 Responsible Disclosure rules, what should an ethical security researcher do upon identifying a remote code execution vulnerability?",
    options: [
      { text: "Exfiltrate database records to verify financial impact", correct: false },
      { text: "Share a public Proof of Concept on social media to force a quick fix", correct: false },
      { text: "Sanitize findings, calculate CVSS 3.1 score, and report confidentially to the vendor's security contact", correct: true },
      { text: "Demand immediate cryptocurrency compensation before providing details", correct: false }
    ],
    explanation: "Responsible disclosure requires strictly confidential reporting without system disruption, data exfiltration, or extortion, allowing vendors adequate time to remediate."
  },
  {
    q: "How does FIDO2 / WebAuthn (Passkeys) fundamentally eliminate credential phishing?",
    options: [
      { text: "It encrypts passwords with a longer master key", correct: false },
      { text: "Authentication uses asymmetric public-key cryptography bound to the authentic browser origin URL", correct: true },
      { text: "It sends SMS one-time codes through encrypted cellular towers", correct: false },
      { text: "It requires biometric fingerprint scans to be uploaded to cloud databases", correct: false }
    ],
    explanation: "Passkeys sign cryptographic challenges with a private key stored strictly in secure hardware. The browser automatically verifies the origin domain, so a fake phishing site receives a signature for the wrong origin—making credential theft impossible."
  }
];

class DefenderChallenge {
  constructor() {
    this.currentQ = 0;
    this.score = 0;
    this.userName = "Security Champion";
  }

  init() {
    this.renderQuestion();
  }

  renderQuestion() {
    const container = document.getElementById("challenge-container");
    if (!container) return;

    if (this.currentQ >= CHALLENGE_QUESTIONS.length) {
      this.renderCertificateView(container);
      return;
    }

    const qData = CHALLENGE_QUESTIONS[this.currentQ];

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-cyan-400 font-bold">CHALLENGE QUESTION ${this.currentQ + 1} OF ${CHALLENGE_QUESTIONS.length}</span>
          <span class="text-emerald-400 font-bold">SCORE: ${this.score} / ${this.currentQ * 100} XP</span>
        </div>

        <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div class="bg-cyan-500 h-full transition-all duration-300" style="width: ${((this.currentQ) / CHALLENGE_QUESTIONS.length) * 100}%"></div>
        </div>

        <p class="text-sm font-semibold text-white leading-relaxed pt-2">${qData.q}</p>

        <div class="space-y-2 pt-2">
          ${qData.options.map((opt, idx) => `
            <button 
              onclick="window.DefenderChallenge.submitAnswer(${opt.correct})"
              class="w-full text-left p-3.5 rounded-lg border border-slate-800 bg-slate-950/70 hover:border-cyan-500/50 hover:bg-slate-900 text-xs font-mono text-slate-300 transition flex items-center gap-3"
            >
              <span class="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">${String.fromCharCode(65 + idx)}</span>
              <span>${opt.text}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  submitAnswer(isCorrect) {
    if (isCorrect) {
      this.score += 100;
      if (typeof confetti === "function") {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      }
    }
    this.currentQ++;
    this.renderQuestion();
  }

  renderCertificateView(container) {
    container.innerHTML = `
      <div class="text-center space-y-4 py-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
          <i data-lucide="award" class="w-8 h-8"></i>
        </div>

        <h3 class="text-xl font-bold text-white">Challenge Completed!</h3>
        <p class="text-xs font-mono text-cyan-400">FINAL SCORE: ${this.score} / 500 XP (${Math.round((this.score / 500) * 100)}%)</p>

        <div class="max-w-md mx-auto space-y-3 pt-2 text-left">
          <label class="block text-xs font-mono text-slate-400">Enter Your Name for the Certified Defender Certificate:</label>
          <div class="flex gap-2">
            <input 
              id="cert-name-input" 
              type="text" 
              value="Prince (Roll 044)" 
              class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white focus:outline-none focus:border-cyan-400" 
            />
            <button 
              onclick="window.DefenderChallenge.generateCertificate()" 
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded transition shrink-0"
            >
              Generate
            </button>
          </div>
        </div>

        <div class="pt-4">
          <canvas id="cert-canvas" width="800" height="520" class="w-full max-w-xl mx-auto rounded-xl border border-cyan-500/40 shadow-2xl bg-slate-950"></canvas>
        </div>

        <div class="pt-2">
          <button onclick="window.DefenderChallenge.downloadCert()" class="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-cyan-600/30 transition inline-flex items-center gap-2">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>Download Certified Defender Certificate (PNG)</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.generateCertificate();
  }

  generateCertificate() {
    const input = document.getElementById("cert-name-input");
    const name = input ? input.value.trim() : "Security Champion";
    const canvas = document.getElementById("cert-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, 800, 520);

    // Subtle Grid pattern
    ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 520);
      ctx.stroke();
    }
    for (let y = 0; y < 520; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // Outer Cyber Border
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 480);

    ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, 748, 468);

    // Corner accents
    const corners = [[20, 20], [780, 20], [20, 500], [780, 500]];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(cx - 5, cy - 5, 10, 10);
    });

    // Header Badge
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("AEGIS-OS • PIXEL WARS X26 HACKATHON", 400, 70);

    // Main Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("CERTIFICATE OF CYBER DEFENSE EXCELLENCE", 400, 120);

    // Divider line
    ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 140);
    ctx.lineTo(550, 140);
    ctx.stroke();

    // Body text
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("This official credential acknowledges that", 400, 180);

    // Candidate Name
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 32px 'JetBrains Mono', monospace";
    ctx.fillText(name.toUpperCase(), 400, 235);

    // Subtitle
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("has successfully completed the Aegis-OS Threat Detection & Ethical Defense Evaluation", 400, 280);
    ctx.fillText("demonstrating mastery over Phishing Inspection, Password Entropy, and EXIF Privacy.", 400, 305);

    // Score & XP Badge
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(280, 340, 240, 45);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1;
    ctx.strokeRect(280, 340, 240, 45);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.fillText(`SCORE: ${this.score} / 500 XP`, 400, 368);

    // Signatures & Hash
    ctx.fillStyle = "#64748b";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("VERIFICATION HASH: 0x9F4B...2026", 50, 460);
    ctx.fillText("DATE ISSUED: 2026-11-21 (IST)", 50, 480);

    ctx.textAlign = "right";
    ctx.fillText("ISSUING PLATFORM: AEGIS-OS DEFENSE SUITE", 750, 460);
    ctx.fillText("SAFE HARBOR COMPLIANT • DEFCON-4", 750, 480);
  }

  downloadCert() {
    const canvas = document.getElementById("cert-canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `Aegis_Defender_Certificate_${new Date().getTime()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

window.DefenderChallenge = new DefenderChallenge();
