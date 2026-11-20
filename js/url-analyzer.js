// ==========================================
// Elite Feature 4: Malicious URL & Homoglyph De-Cloaker
// ==========================================

class UrlAnalyzer {
  constructor() {}

  init() {
    const input = document.getElementById("url-analyzer-input");
    if (input) {
      input.addEventListener("input", (e) => this.analyze(e.target.value));
      this.analyze(input.value || "https://pаypal.com/login?redirect=http://stealer-c2.xyz/auth");
    }
  }

  loadPreset(url) {
    const input = document.getElementById("url-analyzer-input");
    if (input) {
      input.value = url;
      this.analyze(url);
    }
  }

  analyze(rawUrl) {
    const container = document.getElementById("url-analyzer-output");
    if (!container) return;

    if (!rawUrl || rawUrl.trim() === "") {
      container.innerHTML = `<div class="p-6 text-center text-slate-500 font-mono text-xs">Enter a URL above to inspect for deceptive cloaking and homoglyphs.</div>`;
      return;
    }

    let urlObj = null;
    let parseError = false;
    try {
      urlObj = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
    } catch (e) {
      parseError = true;
    }

    const host = urlObj ? urlObj.hostname : rawUrl;
    const flags = [];
    let riskScore = 15;

    // 1. Homoglyph / Non-ASCII Punycode Detection
    let hasNonAscii = false;
    for (let i = 0; i < host.length; i++) {
      if (host.charCodeAt(i) > 127) {
        hasNonAscii = true;
        break;
      }
    }

    if (hasNonAscii) {
      riskScore += 45;
      flags.push({
        title: "IDN Homoglyph / Punycode Deception Detected",
        detail: `The domain '${host}' contains non-Latin Unicode characters (e.g. Cyrillic lookalikes). It disguises an attacker domain to visually mimic authentic brands.`,
        severity: "CRITICAL"
      });
    }

    // 2. IP as Hostname
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
      riskScore += 30;
      flags.push({
        title: "Raw IP Address Used As Hostname",
        detail: "Legitimate corporate platforms rarely direct users to raw uncertificated IP addresses.",
        severity: "HIGH"
      });
    }

    // 3. Suspicious / Abused TLDs
    if (/\.(xyz|top|tk|ml|ga|cf|gq|work|stream|click|loan)$/i.test(host)) {
      riskScore += 25;
      flags.push({
        title: "High-Risk Top-Level Domain (TLD)",
        detail: `The TLD of this host is statistically prevalent among automated phishing kits and disposable C2 servers.`,
        severity: "MEDIUM"
      });
    }

    // 4. Open Redirect Pattern
    if (urlObj && /[?&](redirect|url|goto|next|target|dest)=/i.test(urlObj.search)) {
      riskScore += 20;
      flags.push({
        title: "Potential Open Redirect Parameter",
        detail: "Query parameters containing redirect targets may bounce the victim through an authentic domain onto an attacker-controlled endpoint.",
        severity: "HIGH"
      });
    }

    // 5. Excessive Subdomains
    const parts = host.split(".");
    if (parts.length > 3) {
      riskScore += 15;
      flags.push({
        title: "Subdomain Nesting Deception",
        detail: `Contains ${parts.length} domain segments. Phishers frequently prepend legitimate brand names as subdomains (e.g. 'paypal.com.verify-user.net').`,
        severity: "MEDIUM"
      });
    }

    riskScore = Math.min(riskScore, 100);

    let badgeClass = "text-emerald-400 border-emerald-700 bg-emerald-950";
    let statusText = "LOW SUSPICION";
    if (riskScore >= 75) {
      badgeClass = "text-rose-400 border-rose-700 bg-rose-950 animate-pulse";
      statusText = "CRITICAL PHISHING RISK";
    } else if (riskScore >= 45) {
      badgeClass = "text-amber-400 border-amber-700 bg-amber-950";
      statusText = "MODERATE SUSPICION";
    }

    container.innerHTML = `
      <div class="space-y-4 font-mono text-xs">
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span class="text-slate-500 block text-[10px]">DECEPTIVE RISK INDEX:</span>
            <span class="text-2xl font-bold ${riskScore >= 75 ? 'text-rose-400' : 'text-amber-400'}">${riskScore} / 100</span>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}">${statusText}</span>
        </div>

        <div class="p-3 bg-slate-950 rounded-lg border border-slate-800">
          <span class="text-slate-500 block text-[10px]">RESOLVED ROOT HOSTNAME:</span>
          <span class="text-cyan-300 font-bold text-sm break-all">${host}</span>
        </div>

        <div class="space-y-2">
          ${flags.length > 0 ? flags.map(f => `
            <div class="p-3 rounded-lg border bg-slate-900 ${
              f.severity === 'CRITICAL' ? 'border-rose-500/40 text-rose-200' :
              f.severity === 'HIGH' ? 'border-amber-500/40 text-amber-200' :
              'border-blue-500/40 text-blue-200'
            }">
              <div class="flex items-center justify-between font-bold mb-1">
                <span>⚠️ ${f.title}</span>
                <span class="text-[10px] uppercase px-1.5 py-0.5 rounded ${
                  f.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400' :
                  f.severity === 'HIGH' ? 'bg-amber-950 text-amber-400' : 'bg-blue-950 text-blue-400'
                }">${f.severity}</span>
              </div>
              <p class="text-[11px] text-slate-300">${f.detail}</p>
            </div>
          `).join("") : `
            <div class="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-300">
              ✓ No obvious homoglyph characters, open redirects, or anomalous TLD patterns found.
            </div>
          `}
        </div>
      </div>
    `;
  }
}

window.UrlAnalyzer = new UrlAnalyzer();
