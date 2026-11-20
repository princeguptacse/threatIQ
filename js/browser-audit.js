// ==========================================
// Module 3.2: Browser Fingerprinting & Footprint Audit
// ==========================================

class BrowserAudit {
  constructor() {
    this.fingerprintData = {};
  }

  init() {
    this.runAudit();
  }

  generateCanvasHash() {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("Aegis-OS-Fingerprint!@#", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("Aegis-OS-Fingerprint!@#", 4, 17);
      
      const dataUri = canvas.toDataURL();
      // Simple hash
      let hash = 0;
      for (let i = 0; i < dataUri.length; i++) {
        const char = dataUri.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      return "0x" + Math.abs(hash).toString(16).toUpperCase();
    } catch (e) {
      return "Blocked / Canvas Shielded";
    }
  }

  getWebGLInfo() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return { vendor: "Unsupported", renderer: "Unsupported" };
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        return {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "Standard Vendor",
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "Standard GPU"
        };
      }
      return { vendor: "Generic WebGL", renderer: "Generic GPU" };
    } catch (e) {
      return { vendor: "Shielded", renderer: "Shielded" };
    }
  }

  runAudit() {
    const webgl = this.getWebGLInfo();
    const canvasHash = this.generateCanvasHash();

    this.fingerprintData = {
      os: navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform || "macOS / Linux",
      screen: `${window.screen.width} x ${window.screen.height} (${window.screen.colorDepth}-bit)`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      cores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Logical Cores` : "Restricted",
      ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB Approximate` : "Restricted / Protected",
      gpuVendor: webgl.vendor,
      gpuRenderer: webgl.renderer,
      canvasHash: canvasHash,
      language: navigator.language || "en-US",
      cookiesEnabled: navigator.cookieEnabled ? "Enabled" : "Blocked",
      doNotTrack: navigator.doNotTrack === "1" ? "Enabled (1)" : "Disabled (0)"
    };

    this.render();
  }

  render() {
    const container = document.getElementById("browser-audit-grid");
    if (!container) return;

    const data = this.fingerprintData;

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        <div class="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
          <span class="text-slate-500 block text-[11px]">HARDWARE GRAPHICS (GPU):</span>
          <span class="text-cyan-300 font-semibold truncate block mt-0.5" title="${data.gpuRenderer}">${data.gpuRenderer}</span>
        </div>
        <div class="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
          <span class="text-slate-500 block text-[11px]">CANVAS ENTROPY HASH:</span>
          <span class="text-emerald-400 font-bold block mt-0.5">${data.canvasHash}</span>
        </div>
        <div class="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
          <span class="text-slate-500 block text-[11px]">DISPLAY METRICS:</span>
          <span class="text-slate-200 block mt-0.5">${data.screen}</span>
        </div>
        <div class="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
          <span class="text-slate-500 block text-[11px]">TIMEZONE & LOCALE:</span>
          <span class="text-slate-200 block mt-0.5">${data.timezone} (${data.language})</span>
        </div>
        <div class="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
          <span class="text-slate-500 block text-[11px]">CPU & MEMORY CONSTRAINTS:</span>
          <span class="text-slate-200 block mt-0.5">${data.cores} | RAM: ${data.ram}</span>
        </div>
        <div class="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
          <span class="text-slate-500 block text-[11px]">DO NOT TRACK (DNT) HEADER:</span>
          <span class="${data.doNotTrack.includes('Enabled') ? 'text-emerald-400' : 'text-amber-400'} block mt-0.5">${data.doNotTrack}</span>
        </div>
      </div>
      
      <div class="mt-4 p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-lg text-xs space-y-2">
        <div class="flex items-center gap-2 text-cyan-400 font-mono font-bold">
          <i data-lucide="info" class="w-4 h-4"></i>
          <span>WHY DOES THIS MATTER FOR PRIVACY?</span>
        </div>
        <p class="text-slate-300 leading-relaxed">
          Third-party trackers combine these passive data points (GPU shader precision, Canvas font rasterization, and hardware metrics) to build a <strong>unique mathematical fingerprint</strong>. This allows advertising networks to track your web browsing activity across different domains even when using Incognito mode or clearing cookies.
        </p>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
}

window.BrowserAudit = new BrowserAudit();
