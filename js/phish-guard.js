// ==========================================
// Module 1: PhishGuard & Social Engineering Lab
// ==========================================

const PHISHING_SCENARIOS = [
  {
    id: "scen-1",
    title: "Executive Impersonation / Urgent Wire Transfer",
    category: "Business Email Compromise (BEC)",
    difficulty: "Medium",
    senderDisplay: "Jonathan Vance (CEO)",
    senderAddress: "ceo-office@company-corp-secure.co",
    realDomainWarning: "Registered 2 days ago via privacy proxy, lookalike domain of company-corp.com",
    subject: "STRICTLY CONFIDENTIAL: Immediate Acquisition Retainer Wire",
    date: "Today at 08:42 AM",
    body: `
      <p class="mb-3">Hi,</p>
      <p class="mb-3">I am currently boarding a closed-door board meeting in Zurich with limited cellular connection. We are finalizing the confidential acquisition discussed last week.</p>
      <p class="mb-3">Our legal counsel requires an escrow retainer payment of <strong>$48,500.00</strong> to be executed via wire transfer before 11:00 AM CET today to avoid forfeiture penalty.</p>
      <div class="p-3 my-3 bg-slate-900/80 rounded border border-amber-500/30 text-amber-300 font-mono text-xs">
        WIRE DETAILS:<br>
        Bank: First Continental Trust (Zurich Escrow Agent)<br>
        IBAN: CH93 0000 0000 1234 5678 9<br>
        Ref: Project Phoenix - Escrow Deposit
      </div>
      <p class="mb-3">Please expedite and reply directly with the PDF confirmation. Do not call my mobile as I am airborne.</p>
      <p>Best regards,<br><strong>Jonathan Vance</strong><br><span class="text-xs text-slate-400">Chief Executive Officer</span></p>
    `,
    redFlags: [
      {
        target: "Domain Spoofing",
        detail: "The sender domain is 'company-corp-secure.co' instead of the authentic '@company-corp.com'. Attackers register lookalike domains specifically for BEC.",
        severity: "CRITICAL"
      },
      {
        target: "Artificial Urgency & Secrecy",
        detail: "Demands immediate action ('before 11:00 AM') and instructs the recipient not to verify over the phone ('Do not call my mobile').",
        severity: "HIGH"
      },
      {
        target: "Bypassing Normal Payment Controls",
        detail: "Requesting wires without an internal Purchase Order (PO) or dual-authorization approval workflow.",
        severity: "CRITICAL"
      },
      {
        target: "SPF/DKIM Alignment Failure",
        detail: "Simulated Header Audit: SPF=SoftFail (~all), DKIM=None. The originating IP is not authorized to send mail for the executive.",
        severity: "HIGH"
      }
    ],
    tips: "Always establish an Out-of-Band verification protocol: never wire funds or share sensitive financial data based purely on email communication without secondary verbal or in-person confirmation."
  },
  {
    id: "scen-2",
    title: "Google Workspace Urgent Password Expiration",
    category: "Credential Harvester / Homograph Attack",
    difficulty: "Hard",
    senderDisplay: "Google Workspace Security Team",
    senderAddress: "no-reply@accounts.gооgle.com",
    realDomainWarning: "Homograph attack: Uses Cyrillic small 'о' (U+043E) instead of Latin 'o' (Punycode: xn--ggle-q50aa.com)",
    subject: "Action Required: Your Single Sign-On session will expire in 2 hours",
    date: "Today at 09:15 AM",
    body: `
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">G</div>
        <div>
          <span class="text-xs font-semibold text-slate-300">Google Cloud Identity & Access</span><br>
          <span class="text-xs text-slate-500">Security Bulletin ID: SEC-8910-X</span>
        </div>
      </div>
      <p class="mb-3 text-sm">Dear Administrator / Workspace User,</p>
      <p class="mb-3 text-sm">We detected an anomalous authorization token request targeting your active workspace profile from an unrecognized IP in Singapore (103.253.142.11).</p>
      <p class="mb-4 text-sm">In compliance with mandatory corporate policy 800-63B, your credentials must be re-authenticated within <strong>120 minutes</strong> or access to all cloud drive documents, email, and API tokens will be temporarily quarantined.</p>
      <div class="my-4 text-center">
        <a href="#demo-phish-click" onclick="event.preventDefault(); window.PhishGuard.triggerSimulatedTrap();" class="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded text-sm shadow-lg shadow-blue-600/30 transition">
          Re-Authenticate Workspace Credentials
        </a>
        <p class="mt-2 text-xs text-slate-500 font-mono">Destination: https://accounts.gооgle.com.auth-token-verify.net/sso/login</p>
      </div>
      <p class="text-xs text-slate-400">If you believe this is in error, contact your internal IT Helpdesk immediately.</p>
    `,
    redFlags: [
      {
        target: "Cyrillic Homoglyph Attack",
        detail: "The address looks like 'google.com' but uses Cyrillic 'о'. In Punycode, this resolves to an entirely external attacker-controlled domain.",
        severity: "CRITICAL"
      },
      {
        target: "Deceptive Link Target",
        detail: "The anchor text claims to go to Google, but the actual destination subdomain is 'auth-token-verify.net'.",
        severity: "CRITICAL"
      },
      {
        target: "Fear-Inducing Deadline",
        detail: "Threatens quarantine of all enterprise documents within 120 minutes to provoke hasty emotional reactions.",
        severity: "MEDIUM"
      },
      {
        target: "Fake Security Bulletin Reference",
        detail: "Cites NIST SP 800-63B out of context to manufacture an aura of legitimate technical authority.",
        severity: "LOW"
      }
    ],
    tips: "Always check the full URL in the browser address bar for the root domain (the part right before the first single slash). Never click direct links in unexpected re-auth emails; navigate directly to the known service URL."
  },
  {
    id: "scen-3",
    title: "Quishing (QR Phishing) MFA Reset Notice",
    category: "Quishing (QR Code Phishing)",
    difficulty: "Medium",
    senderDisplay: "IT Helpdesk & Identity Portal",
    senderAddress: "it-support@mfa-authenticator-portal.com",
    realDomainWarning: "Third-party unregistered domain designed to bypass email text scanners",
    subject: "Mandatory: Migrate to Microsoft Authenticator 2.0 via Secure QR",
    date: "Today at 10:02 AM",
    body: `
      <p class="mb-3 text-sm">Hello Employee,</p>
      <p class="mb-3 text-sm">Our cybersecurity infrastructure is transitioning all Multi-Factor Authentication (MFA) tokens to our new enterprise gateway. Old hardware keys and SMS verification codes will be decommissioned tonight.</p>
      <p class="mb-4 text-sm">To synchronize your smartphone without exposing private seed keys to email crawlers, scan the dynamic QR code below using your mobile camera or authenticator application:</p>
      <div class="my-4 flex flex-col items-center justify-center p-4 bg-slate-900 rounded-lg border border-slate-700">
        <!-- SVG QR Code Mock -->
        <div class="w-36 h-36 bg-white p-2 rounded flex items-center justify-center relative cursor-pointer hover:ring-2 hover:ring-cyan-400 transition" onclick="window.PhishGuard.triggerSimulatedTrap()">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <rect width="100" height="100" fill="white"/>
            <!-- Top Left Finder -->
            <rect x="10" y="10" width="24" height="24" fill="black"/>
            <rect x="14" y="14" width="16" height="16" fill="white"/>
            <rect x="18" y="18" width="8" height="8" fill="black"/>
            <!-- Top Right Finder -->
            <rect x="66" y="10" width="24" height="24" fill="black"/>
            <rect x="70" y="14" width="16" height="16" fill="white"/>
            <rect x="74" y="18" width="8" height="8" fill="black"/>
            <!-- Bottom Left Finder -->
            <rect x="10" y="66" width="24" height="24" fill="black"/>
            <rect x="14" y="70" width="16" height="16" fill="white"/>
            <rect x="18" y="74" width="8" height="8" fill="black"/>
            <!-- QR Pattern Dots -->
            <rect x="42" y="15" width="6" height="6" fill="black"/>
            <rect x="52" y="25" width="6" height="6" fill="black"/>
            <rect x="42" y="42" width="16" height="16" fill="black"/>
            <rect x="66" y="46" width="8" height="8" fill="black"/>
            <rect x="45" y="72" width="10" height="6" fill="black"/>
            <rect x="65" y="70" width="12" height="12" fill="black"/>
          </svg>
        </div>
        <p class="text-xs text-slate-400 mt-2 font-mono">Scan via Mobile Camera to complete token binding</p>
      </div>
      <p class="text-xs text-amber-300/80">Notice: Failure to synchronize within 8 hours will require physical badge deactivation.</p>
    `,
    redFlags: [
      {
        target: "Quishing Vector (Bypassing Secure Email Gateways)",
        detail: "Attackers embed URLs inside QR code images because traditional email filters cannot easily inspect text within an image, moving the victim onto their personal, unmanaged mobile browser.",
        severity: "CRITICAL"
      },
      {
        target: "Unverified IT Support Sender",
        detail: "Legitimate IT teams send notifications from the verified primary enterprise domain, not third-party variations like 'mfa-authenticator-portal.com'.",
        severity: "HIGH"
      },
      {
        target: "Threat of Physical Consequence",
        detail: "Threatening badge deactivation forces emotional compliance without stopping to verify with local IT personnel.",
        severity: "MEDIUM"
      }
    ],
    tips: "Treat QR codes in emails with extreme skepticism. When scanning a QR code with a phone, carefully examine the full decoded URL preview before opening it in a browser."
  }
];

class PhishGuardLab {
  constructor() {
    this.currentScenarioIndex = 0;
    this.inspected = false;
    this.score = 0;
    this.totalAttempts = 0;
  }

  init() {
    this.renderScenarioList();
    this.loadScenario(0);
    this.setupEventListeners();
  }

  renderScenarioList() {
    const listEl = document.getElementById("phish-scenarios-list");
    if (!listEl) return;

    listEl.innerHTML = PHISHING_SCENARIOS.map((scen, idx) => `
      <button 
        onclick="window.PhishGuard.loadScenario(${idx})" 
        class="w-full text-left p-3 rounded-lg border transition flex items-center justify-between ${
          idx === this.currentScenarioIndex 
            ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' 
            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
        }"
      >
        <div>
          <div class="text-xs font-mono uppercase tracking-wider text-slate-500">${scen.category}</div>
          <div class="text-sm font-semibold truncate mt-0.5">${scen.title}</div>
        </div>
        <span class="text-xs px-2 py-0.5 rounded font-mono ${
          scen.difficulty === 'Hard' ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50' : 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
        }">${scen.difficulty}</span>
      </button>
    `).join("");
  }

  loadScenario(index) {
    this.currentScenarioIndex = index;
    this.inspected = false;
    this.renderScenarioList();

    const scen = PHISHING_SCENARIOS[index];
    const previewEl = document.getElementById("phish-email-view");
    const flagsEl = document.getElementById("phish-flags-view");
    const statusEl = document.getElementById("phish-audit-status");

    if (previewEl) {
      previewEl.innerHTML = `
        <div class="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          <!-- Fake Email Client Header -->
          <div class="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span class="ml-2 text-xs font-mono text-slate-400">Incoming Message Inspector</span>
            </div>
            <div class="text-xs text-slate-500 font-mono">${scen.date}</div>
          </div>

          <!-- Metadata Box -->
          <div class="p-4 border-b border-slate-800/80 bg-slate-950/40 text-xs space-y-1.5 font-mono">
            <div class="flex"><span class="text-slate-500 w-16">FROM:</span> <span class="text-slate-300 font-semibold">${scen.senderDisplay} &lt;<span class="text-cyan-400">${scen.senderAddress}</span>&gt;</span></div>
            <div class="flex"><span class="text-slate-500 w-16">TO:</span> <span class="text-slate-300">security-candidate@target-firm.internal</span></div>
            <div class="flex"><span class="text-slate-500 w-16">SUBJECT:</span> <span class="text-slate-100 font-bold">${scen.subject}</span></div>
          </div>

          <!-- Email Body -->
          <div class="p-6 text-slate-200 text-sm leading-relaxed">
            ${scen.body}
          </div>

          <!-- Interaction Footer -->
          <div class="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <button onclick="window.PhishGuard.inspectRedFlags()" class="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono flex items-center gap-2 transition">
                <i data-lucide="scan" class="w-4 h-4"></i>
                <span>Run Deep Threat Audit</span>
              </button>
              <button onclick="window.PhishGuard.markVerdict('phish')" class="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-mono flex items-center gap-2 transition">
                <i data-lucide="shield-alert" class="w-4 h-4"></i>
                <span>Flag as Malicious Phishing</span>
              </button>
            </div>
            <div id="phish-feedback" class="text-xs font-mono"></div>
          </div>
        </div>
      `;
    }

    if (flagsEl) {
      flagsEl.innerHTML = `
        <div class="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
          <i data-lucide="shield-question" class="w-10 h-10 mx-auto text-slate-600 mb-2"></i>
          <p class="text-sm">Click "Run Deep Threat Audit" to reveal hidden attack vectors and security telemetry.</p>
        </div>
      `;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  inspectRedFlags() {
    this.inspected = true;
    const scen = PHISHING_SCENARIOS[this.currentScenarioIndex];
    const flagsEl = document.getElementById("phish-flags-view");
    if (!flagsEl) return;

    flagsEl.innerHTML = `
      <div class="space-y-4">
        <div class="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
          <div class="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <i data-lucide="crosshair" class="w-4 h-4"></i>
            <span>ANALYSIS SUMMARY: ${scen.category}</span>
          </div>
          <p class="text-xs text-slate-300">${scen.realDomainWarning}</p>
        </div>

        <div class="space-y-2">
          ${scen.redFlags.map((flag, idx) => `
            <div class="p-3 rounded-lg border bg-slate-900/80 ${
              flag.severity === 'CRITICAL' ? 'border-rose-500/30 text-rose-200' :
              flag.severity === 'HIGH' ? 'border-amber-500/30 text-amber-200' :
              'border-blue-500/30 text-blue-200'
            }">
              <div class="flex items-center justify-between text-xs font-mono mb-1">
                <span class="font-bold flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full ${
                    flag.severity === 'CRITICAL' ? 'bg-rose-500' :
                    flag.severity === 'HIGH' ? 'bg-amber-500' : 'bg-blue-400'
                  }"></span>
                  #${idx + 1} ${flag.target}
                </span>
                <span class="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                  flag.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400' :
                  flag.severity === 'HIGH' ? 'bg-amber-950 text-amber-400' : 'bg-blue-950 text-blue-400'
                }">${flag.severity}</span>
              </div>
              <p class="text-xs text-slate-300 leading-normal">${flag.detail}</p>
            </div>
          `).join("")}
        </div>

        <div class="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300">
          <div class="font-mono font-bold flex items-center gap-1 mb-1">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
            <span>DEFENSIVE PROTOCOL</span>
          </div>
          <p class="text-slate-300">${scen.tips}</p>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  markVerdict(type) {
    const feedbackEl = document.getElementById("phish-feedback");
    if (!feedbackEl) return;

    if (type === "phish") {
      this.score += 100;
      feedbackEl.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1"><i data-lucide="check-circle" class="w-4 h-4"></i> CORRECT! Threat Neutralized (+100 XP)</span>`;
      if (typeof confetti === "function") {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
      }
      this.inspectRedFlags();
    }
    if (window.lucide) window.lucide.createIcons();
  }

  triggerSimulatedTrap() {
    alert("⚠️ SIMULATED PHISHING TRAP CAUGHT!\n\nIn a real-world scenario, your session token or credentials would have been sent to an attacker's C2 server.\n\nNotice the address bar and destination domain before entering credentials!");
  }

  setupEventListeners() {}
}

window.PhishGuard = new PhishGuardLab();
