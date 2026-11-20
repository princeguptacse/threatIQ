// ==========================================
// Module 4: SentinelSOC — Simulated SOC Dashboard
// ==========================================

const INITIAL_INCIDENTS = [
  {
    id: "INC-2026-901",
    timestamp: "Just now",
    type: "Ransomware Canary Trigger",
    target: "db-replica-cluster-04",
    sourceIp: "194.26.29.114 (TOR Exit Node)",
    severity: "CRITICAL",
    mitreTechnique: "T1486 (Data Encrypted for Impact)",
    description: "A tripwire honeyfile (/var/data/share/canary_audit.xlsx) experienced rapid entropy changes matching LockBit 3.0 encryption patterns.",
    status: "ACTIVE",
    playbook: [
      { step: 1, action: "Isolate Endpoint from VLAN", completed: false },
      { step: 2, action: "Revoke Service Account Tokens", completed: false },
      { step: 3, action: "Capture Memory Dump for Forensics", completed: false },
      { step: 4, action: "Restore Volume from Immutable Snapshot", completed: false }
    ],
    lessons: "Maintain offline, immutable storage snapshots and implement canary honeypot files with high-priority filesystem event alerting."
  },
  {
    id: "INC-2026-902",
    timestamp: "2 mins ago",
    type: "L7 HTTP Flood / Edge DDoS",
    target: "api.company.global/v2/auth",
    sourceIp: "Botnet Cluster (14,200 Distributed IPs)",
    severity: "HIGH",
    mitreTechnique: "T1499 (Endpoint Denial of Service)",
    description: "Inbound HTTP request rates surged to 68,000 requests/second with randomized User-Agents and query parameter junk.",
    status: "ACTIVE",
    playbook: [
      { step: 1, action: "Enable Cloudflare Under-Attack Mode / JS Challenge", completed: false },
      { step: 2, action: "Enforce API Rate Limit (50 req/min per IP)", completed: false },
      { step: 3, action: "Geo-Fence traffic from non-operational ASN zones", completed: false }
    ],
    lessons: "Implement adaptive rate-limiting and behavior-based bot management at the CDN edge before requests hit origin servers."
  },
  {
    id: "INC-2026-903",
    timestamp: "6 mins ago",
    type: "SQL Injection (SQLi) Attempt",
    target: "store-checkout-backend",
    sourceIp: "45.154.255.88 (Unregistered VPS)",
    severity: "HIGH",
    mitreTechnique: "T1190 (Exploit Public-Facing Application)",
    description: "WAF intercepted payload: ' OR 1=1; EXEC xp_cmdshell('whoami'); -- against parameter 'order_id'.",
    status: "ACTIVE",
    playbook: [
      { step: 1, action: "Confirm WAF Drop Rule Enforced", completed: false },
      { step: 2, action: "Inspect Database Query Logs for Parameterized Binding", completed: false },
      { step: 3, action: "Add Threat Actor Subnet to Blackhole Table", completed: false }
    ],
    lessons: "Always use parameterized queries (PreparedStatements) or an ORM; never concatenate untrusted user input directly into SQL strings."
  },
  {
    id: "INC-2026-904",
    timestamp: "14 mins ago",
    type: "SSH Credential Stuffing Wave",
    target: "bastion-host-us-east",
    sourceIp: "185.220.101.42 (Known Scanner)",
    severity: "MEDIUM",
    mitreTechnique: "T1110.004 (Credential Stuffing)",
    description: "Over 800 authentication attempts per minute cycling through leaked root and service account password dictionaries.",
    status: "ACTIVE",
    playbook: [
      { step: 1, action: "Verify SSH Key-Only Authentication Enforced", completed: false },
      { step: 2, action: "Trigger Fail2Ban Auto-Jail for 72 Hours", completed: false },
      { step: 3, action: "Change Bastion Listening Port & Bind to Tailscale VPN", completed: false }
    ],
    lessons: "Disable password authentication entirely on SSH daemons, enforce Ed25519 public keys, and place administrative bastions behind a zero-trust mesh VPN."
  }
];

class SentinelSOC {
  constructor() {
    this.incidents = JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
    this.selectedIncidentId = this.incidents[0].id;
    this.blockedThreatCount = 142890;
    this.chart = null;
  }

  init() {
    this.renderIncidentFeed();
    this.renderIncidentDetails(this.selectedIncidentId);
    this.initChart();
    this.startLiveStream();
  }

  renderIncidentFeed() {
    const listEl = document.getElementById("soc-incidents-feed");
    if (!listEl) return;

    listEl.innerHTML = this.incidents.map(inc => `
      <div 
        onclick="window.SentinelSOC.selectIncident('${inc.id}')"
        class="p-3 rounded-lg border transition cursor-pointer ${
          inc.id === this.selectedIncidentId 
            ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10' 
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }"
      >
        <div class="flex items-center justify-between text-xs font-mono mb-1">
          <span class="text-slate-400 font-bold">${inc.id}</span>
          <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
            inc.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
            inc.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
            'bg-blue-950 text-blue-400 border border-blue-800'
          }">${inc.severity}</span>
        </div>
        <div class="text-sm font-semibold text-slate-200 truncate">${inc.type}</div>
        <div class="flex items-center justify-between text-xs text-slate-500 mt-1 font-mono">
          <span>${inc.target}</span>
          <span class="${inc.status === 'MITIGATED' ? 'text-emerald-400 font-bold' : 'text-amber-400'}">${inc.status}</span>
        </div>
      </div>
    `).join("");
  }

  selectIncident(id) {
    this.selectedIncidentId = id;
    this.renderIncidentFeed();
    this.renderIncidentDetails(id);
  }

  renderIncidentDetails(id) {
    const inc = this.incidents.find(i => i.id === id);
    const container = document.getElementById("soc-incident-details");
    if (!container || !inc) return;

    const allStepsDone = inc.playbook.every(s => s.completed);

    container.innerHTML = `
      <div class="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div class="text-xs font-mono text-cyan-400">${inc.id} • ${inc.mitreTechnique}</div>
            <h3 class="text-base font-bold text-white mt-0.5">${inc.type}</h3>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold ${
            inc.status === 'MITIGATED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-rose-950 text-rose-400 border border-rose-700 animate-pulse'
          }">${inc.status === 'MITIGATED' ? '✓ RESOLVED & MITIGATED' : '● UNDER ACTIVE CONTAINMENT'}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div class="p-2.5 bg-slate-950 rounded border border-slate-800">
            <span class="text-slate-500 block">SOURCE / ACTOR IP:</span>
            <span class="text-rose-400 font-semibold">${inc.sourceIp}</span>
          </div>
          <div class="p-2.5 bg-slate-950 rounded border border-slate-800">
            <span class="text-slate-500 block">TARGET ASSET:</span>
            <span class="text-slate-200 font-semibold">${inc.target}</span>
          </div>
        </div>

        <div class="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300">
          <span class="text-slate-500 font-mono block text-[11px] mb-1">INCIDENT TELEMETRY:</span>
          ${inc.description}
        </div>

        <div>
          <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 font-bold">
            <i data-lucide="shield" class="w-4 h-4 text-cyan-400"></i>
            <span>Interactive Response Playbook:</span>
          </h4>
          <div class="space-y-2">
            ${inc.playbook.map((step, idx) => `
              <div class="p-2.5 rounded-lg border flex items-center justify-between text-xs font-mono ${
                step.completed ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'
              }">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }">${step.completed ? '✓' : idx + 1}</span>
                  <span>${step.action}</span>
                </div>
                ${!step.completed ? `
                  <button 
                    onclick="window.SentinelSOC.executePlaybookStep('${inc.id}', ${step.step})"
                    class="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-bold transition shadow-sm"
                  >
                    Execute Step
                  </button>
                ` : `
                  <span class="text-emerald-400 text-[11px] font-bold">Mitigated</span>
                `}
              </div>
            `).join("")}
          </div>
        </div>

        ${inc.status === 'MITIGATED' ? `
          <div class="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 space-y-1">
            <div class="font-mono font-bold flex items-center gap-1">
              <i data-lucide="check-check" class="w-4 h-4 text-emerald-400"></i>
              <span>POST-MORTEM & HARDENING GUIDANCE:</span>
            </div>
            <p class="text-slate-300">${inc.lessons}</p>
          </div>
        ` : ''}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  executePlaybookStep(incId, stepNumber) {
    const inc = this.incidents.find(i => i.id === incId);
    if (!inc) return;

    const targetStep = inc.playbook.find(s => s.step === stepNumber);
    if (targetStep) {
      targetStep.completed = true;
    }

    if (inc.playbook.every(s => s.completed)) {
      inc.status = "MITIGATED";
      this.blockedThreatCount += 1;
      const countEl = document.getElementById("threats-blocked-count");
      if (countEl) countEl.textContent = this.blockedThreatCount.toLocaleString();

      if (typeof confetti === "function") {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      }
    }

    this.renderIncidentFeed();
    this.renderIncidentDetails(incId);
  }

  initChart() {
    const ctx = document.getElementById("threat-chart");
    if (!ctx || !window.Chart) return;

    this.chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["DDoS", "SQL Injection", "Ransomware / Malware", "Credential Stuffing", "Phishing"],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            "rgba(6, 182, 212, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(244, 63, 94, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(168, 85, 247, 0.8)"
          ],
          borderColor: "#0f172a",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#94a3b8",
              font: { family: "JetBrains Mono", size: 10 },
              boxWidth: 12
            }
          }
        }
      }
    });
  }

  startLiveStream() {
    setInterval(() => {
      this.blockedThreatCount += Math.floor(Math.random() * 5 + 1);
      const countEl = document.getElementById("threats-blocked-count");
      if (countEl) countEl.textContent = this.blockedThreatCount.toLocaleString();
    }, 3500);
  }
}

window.SentinelSOC = new SentinelSOC();
