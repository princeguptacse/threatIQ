// ==========================================
// Module 5: DiscloseSafe — CVSS v3.1 Engine & Ethical VDP
// ==========================================

class CvssCalculator {
  constructor() {
    this.metrics = {
      AV: "N", // Network
      AC: "L", // Low
      PR: "N", // None
      UI: "N", // None
      S: "U",  // Unchanged
      C: "H",  // High
      I: "H",  // High
      A: "H"   // High
    };
  }

  init() {
    this.setupListeners();
    this.calculate();
  }

  setupListeners() {
    const keys = ["AV", "AC", "PR", "UI", "S", "C", "I", "A"];
    keys.forEach(key => {
      const inputs = document.querySelectorAll(`input[name="cvss-${key}"]`);
      inputs.forEach(input => {
        input.addEventListener("change", (e) => {
          this.metrics[key] = e.target.value;
          this.calculate();
        });
      });
    });
  }

  calculate() {
    const { AV, AC, PR, UI, S, C, I, A } = this.metrics;

    // Weights according to FIRST CVSS v3.1 Specification
    const weightAV = { N: 0.85, A: 0.62, L: 0.55, P: 0.20 }[AV];
    const weightAC = { L: 0.77, H: 0.44 }[AC];
    const weightUI = { N: 0.85, R: 0.62 }[UI];

    // PR depends on Scope
    let weightPR = 0.85;
    if (S === "U") {
      weightPR = { N: 0.85, L: 0.62, H: 0.27 }[PR];
    } else {
      weightPR = { N: 0.85, L: 0.68, H: 0.50 }[PR];
    }

    const weightC = { N: 0.0, L: 0.22, H: 0.56 }[C];
    const weightI = { N: 0.0, L: 0.22, H: 0.56 }[I];
    const weightA = { N: 0.0, L: 0.22, H: 0.56 }[A];

    // ISS (Impact Sub-Score)
    const iss = 1 - ((1 - weightC) * (1 - weightI) * (1 - weightA));

    // Impact
    let impact = 0;
    if (S === "U") {
      impact = 6.42 * iss;
    } else {
      impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
    }

    // Exploitability
    const exploitability = 8.22 * weightAV * weightAC * weightPR * weightUI;

    let baseScore = 0;
    if (impact <= 0) {
      baseScore = 0;
    } else if (S === "U") {
      baseScore = Math.min(Math.ceil((impact + exploitability) * 10) / 10, 10.0);
    } else {
      baseScore = Math.min(Math.ceil((1.08 * (impact + exploitability)) * 10) / 10, 10.0);
    }

    baseScore = Math.max(0, baseScore);

    // Vector String
    const vectorString = `CVSS:3.1/AV:${AV}/AC:${AC}/PR:${PR}/UI:${UI}/S:${S}/C:${C}/I:${I}/A:${A}`;

    // Severity mapping
    let severity = "NONE";
    let colorClass = "text-slate-400 border-slate-700 bg-slate-900";
    if (baseScore > 0.0 && baseScore <= 3.9) {
      severity = "LOW";
      colorClass = "text-blue-400 border-blue-700 bg-blue-950";
    } else if (baseScore >= 4.0 && baseScore <= 6.9) {
      severity = "MEDIUM";
      colorClass = "text-amber-400 border-amber-700 bg-amber-950";
    } else if (baseScore >= 7.0 && baseScore <= 8.9) {
      severity = "HIGH";
      colorClass = "text-orange-400 border-orange-700 bg-orange-950";
    } else if (baseScore >= 9.0) {
      severity = "CRITICAL";
      colorClass = "text-rose-400 border-rose-700 bg-rose-950 animate-pulse";
    }

    // Update UI
    const scoreEl = document.getElementById("cvss-score-value");
    const sevEl = document.getElementById("cvss-severity-badge");
    const vecEl = document.getElementById("cvss-vector-string");

    if (scoreEl) scoreEl.textContent = baseScore.toFixed(1);
    if (sevEl) {
      sevEl.textContent = severity;
      sevEl.className = `px-3 py-1 rounded-full text-xs font-mono font-bold border ${colorClass}`;
    }
    if (vecEl) vecEl.textContent = vectorString;
  }

  copyVector() {
    const vecEl = document.getElementById("cvss-vector-string");
    if (vecEl && vecEl.textContent) {
      navigator.clipboard.writeText(vecEl.textContent).then(() => {
        alert("CVSS 3.1 Vector string copied to clipboard!");
      });
    }
  }

  generateReport() {
    const title = document.getElementById("vdp-title")?.value || "Unauthenticated Remote Code Execution in API Gateway";
    const asset = document.getElementById("vdp-asset")?.value || "https://api.target-firm.internal/v1/auth";
    const cwe = document.getElementById("vdp-cwe")?.value || "CWE-89: SQL Injection";
    const desc = document.getElementById("vdp-desc")?.value || "During authorized security testing under safe harbor, an input sanitization bypass was identified...";
    const remediation = document.getElementById("vdp-remediation")?.value || "Enforce parameterized SQL prepared statements and validate input with strict regex schema.";
    const vector = document.getElementById("cvss-vector-string")?.textContent || "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H";
    const score = document.getElementById("cvss-score-value")?.textContent || "9.8";

    const reportMarkdown = `# 🛡️ RESPONSIBLE DISCLOSURE REPORT (CONFIDENTIAL)
**Date:** ${new Date().toISOString().split('T')[0]}
**Target Asset:** ${asset}
**CVSS v3.1 Severity Score:** ${score} (${vector})
**Vulnerability Classification:** ${cwe}

---

## 1. Executive Summary
**Title:** ${title}
${desc}

## 2. Technical Findings & Vector
- **CVSS 3.1 Vector String:** \`${vector}\`
- **Safe Harbor Compliance:** This finding was discovered in strict compliance with ethical disclosure guidelines without data exfiltration, system disruption, or denial of service.

## 3. Remediation & Hardening Recommendations
${remediation}

---
*Report formatted via ThreatIQ Ethical Disclosure Engine.*
`;

    const blob = new Blob([reportMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VDP_Report_${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("✅ Ethical Vulnerability Disclosure Report exported to Markdown successfully!");
  }
}

window.CvssCalculator = new CvssCalculator();
