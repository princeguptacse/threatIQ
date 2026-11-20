// ==========================================
// Elite Feature: Interactive JWT & Session Security Inspector
// ==========================================

const SAMPLE_JWTS = {
  algNone: "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlfQ.",
  leakedPii: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzkwOSIsImVtYWlsIjoidmljdGltQGNvbXBhbnkuY29tIiwic3NuIjoiMTIzLTQ1LTY3ODkiLCJwbGFpbl9wYXNzd29yZCI6IlNlY3JldDEyMyEiLCJleHAiOjE1MTYyMzkwMjJ9.4z_eQGgP6w_zX5M1s6hT3a8R1wP-q0L2a7X8Z8q8v7A",
  hardened: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImF1dGgtMjAyNiJ9.eyJzdWIiOiJ1c2VyXzQ0OTAiLCJyb2xlIjoidmlld2VyIiwiYXVkIjoiaHR0cHM6Ly9hcGkudGhyZWF0aXEuaW8iLCJleHAiOjE3OTU3Mzg4MDB9.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1g"
};

class JwtInspector {
  constructor() {}

  init() {
    const input = document.getElementById("jwt-input");
    if (input) {
      input.addEventListener("input", (e) => this.inspect(e.target.value));
      this.inspect(SAMPLE_JWTS.algNone);
    }
  }

  loadSample(type) {
    const input = document.getElementById("jwt-input");
    if (input && SAMPLE_JWTS[type]) {
      input.value = SAMPLE_JWTS[type];
      this.inspect(SAMPLE_JWTS[type]);
    }
  }

  base64UrlDecode(str) {
    try {
      let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }
      return decodeURIComponent(atob(base64).split("").map(c => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
    } catch (e) {
      return null;
    }
  }

  inspect(token) {
    const container = document.getElementById("jwt-output-container");
    if (!container) return;

    if (!token || token.trim() === "") {
      container.innerHTML = `<div class="p-6 text-center text-slate-500 font-mono text-xs">Paste a JSON Web Token above to inspect its cryptographic claims and headers.</div>`;
      return;
    }

    const parts = token.trim().split(".");
    if (parts.length < 2 || parts.length > 3) {
      container.innerHTML = `<div class="p-4 bg-rose-950/40 border border-rose-500/50 rounded-lg text-rose-300 font-mono text-xs">⚠️ Malformed Token: Standard JWTs must consist of 3 dot-separated segments (Header.Payload.Signature).</div>`;
      return;
    }

    const headerStr = this.base64UrlDecode(parts[0]);
    const payloadStr = this.base64UrlDecode(parts[1]);
    const signature = parts[2] || "";

    let headerObj = null;
    let payloadObj = null;

    try { headerObj = JSON.parse(headerStr); } catch (e) {}
    try { payloadObj = JSON.parse(payloadStr); } catch (e) {}

    const warnings = [];
    let isVulnerable = false;

    // Check 1: alg: none
    if (headerObj && String(headerObj.alg).toLowerCase() === "none") {
      isVulnerable = true;
      warnings.push({
        type: "CRITICAL: 'alg: none' Signature Bypass (CVE-2015-9235)",
        detail: "The token specifies an algorithm of 'none', instructing verification libraries to accept unsigned forged tokens without signature validation.",
        severity: "CRITICAL"
      });
    }

    // Check 2: Missing signature
    if (!signature) {
      isVulnerable = true;
      warnings.push({
        type: "CRITICAL: Unsigned Token (Missing Signature)",
        detail: "The token has an empty signature block. Any attacker can tamper with user roles or IDs without detection if the backend doesn't reject unsigned tokens.",
        severity: "CRITICAL"
      });
    }

    // Check 3: Leaked sensitive PII in payload
    if (payloadStr && /password|ssn|secret|credit_card/i.test(payloadStr)) {
      isVulnerable = true;
      warnings.push({
        type: "HIGH: Sensitive Credential / PII Leaked in Payload",
        detail: "JWT payloads are Base64Url-encoded, NOT encrypted! Anyone inspecting network requests or storage can read exposed passwords or sensitive records.",
        severity: "HIGH"
      });
    }

    // Check 4: Expiration status
    if (payloadObj && payloadObj.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (payloadObj.exp < now) {
        warnings.push({
          type: "INFO: Token Expired",
          detail: `Expired at ${new Date(payloadObj.exp * 1000).toLocaleString()}. Server must reject this token unless refreshed.`,
          severity: "MEDIUM"
        });
      }
    } else {
      warnings.push({
        type: "WARNING: Missing Expiration Claim ('exp')",
        detail: "Token does not have a finite lifespan. If intercepted, it remains valid indefinitely.",
        severity: "HIGH"
      });
    }

    container.innerHTML = `
      <div class="space-y-4 font-mono text-xs">
        
        <!-- Status Banner -->
        <div class="p-3 rounded-xl border flex items-center justify-between ${
          isVulnerable ? 'bg-rose-950/50 border-rose-500/50 text-rose-300' : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
        }">
          <span class="font-bold flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full ${isVulnerable ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}"></span>
            ${isVulnerable ? '🚨 VULNERABILITY AUDIT: INSECURE TOKEN' : '✓ CRYPTOGRAPHIC AUDIT: VALID FORMAT'}
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
            isVulnerable ? 'bg-rose-900 text-rose-200' : 'bg-emerald-900 text-emerald-200'
          }">${isVulnerable ? 'FLAGGED RISKS' : 'HARDENED'}</span>
        </div>

        <!-- Visual Segment Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <!-- Header -->
          <div class="p-3 bg-slate-950 rounded-lg border border-rose-500/40 space-y-1">
            <span class="text-rose-400 font-bold block text-[10px]">1. HEADER (ALGORITHM):</span>
            <pre class="text-[11px] text-slate-300 bg-black/60 p-2 rounded overflow-x-auto">${headerStr || 'Invalid'}</pre>
          </div>

          <!-- Payload -->
          <div class="p-3 bg-slate-950 rounded-lg border border-purple-500/40 space-y-1 md:col-span-2">
            <span class="text-purple-400 font-bold block text-[10px]">2. PAYLOAD (PUBLIC CLAIMS):</span>
            <pre class="text-[11px] text-slate-300 bg-black/60 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">${payloadStr || 'Invalid'}</pre>
          </div>
        </div>

        <!-- Signature -->
        <div class="p-3 bg-slate-950 rounded-lg border border-cyan-500/40">
          <span class="text-cyan-400 font-bold block text-[10px] mb-1">3. SIGNATURE VERIFICATION HASH:</span>
          <div class="text-[11px] text-slate-400 break-all select-all font-mono">
            ${signature ? signature : '<span class="text-rose-400 font-bold">[EMPTY SIGNATURE - REJECT BY DEFAULT]</span>'}
          </div>
        </div>

        <!-- Warnings List -->
        <div class="space-y-2">
          ${warnings.map(w => `
            <div class="p-2.5 rounded border text-[11px] ${
              w.severity === 'CRITICAL' ? 'bg-rose-950/40 border-rose-500/40 text-rose-200' :
              w.severity === 'HIGH' ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' :
              'bg-blue-950/40 border-blue-500/40 text-blue-200'
            }">
              <div class="font-bold flex items-center justify-between mb-0.5">
                <span>⚠️ ${w.type}</span>
                <span class="text-[9px] uppercase px-1 rounded bg-black/50">${w.severity}</span>
              </div>
              <p class="text-slate-300">${w.detail}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
}

window.JwtInspector = new JwtInspector();
