// ==========================================
// Elite Feature: Web Crypto Hashing & Avalanche Lab
// ==========================================

class CryptoLab {
  constructor() {
    this.previousHash = "";
  }

  init() {
    const input = document.getElementById("crypto-input");
    if (input) {
      input.addEventListener("input", (e) => this.processHash(e.target.value));
      this.processHash(input.value || "PixelWars2026");
    }
  }

  async sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async processHash(text) {
    const currentHash = await this.sha256(text);
    const hashOutput = document.getElementById("crypto-hash-output");
    const avalancheDiff = document.getElementById("crypto-avalanche-diff");

    if (hashOutput) {
      hashOutput.textContent = currentHash;
    }

    if (avalancheDiff && this.previousHash && this.previousHash !== currentHash) {
      // Calculate how many hex characters flipped
      let flipped = 0;
      for (let i = 0; i < currentHash.length; i++) {
        if (currentHash[i] !== this.previousHash[i]) flipped++;
      }
      const pct = Math.round((flipped / currentHash.length) * 100);
      avalancheDiff.innerHTML = `
        <span class="text-cyan-400 font-bold">${flipped} / 64 characters changed (${pct}% Avalanche Effect)</span>
        <span class="block text-slate-400 text-[11px] mt-0.5">Changing just one character completely scrambles the output hash. This cryptographic property is called the Avalanche Effect.</span>
      `;
    }

    this.previousHash = currentHash;
  }
}

window.CryptoLab = new CryptoLab();
