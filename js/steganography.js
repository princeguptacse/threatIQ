// ==========================================
// Elite Feature 2: Client-Side Steganography Lab (LSB Encoding/Decoding)
// ==========================================

class SteganoLab {
  constructor() {
    this.carrierImg = null;
  }

  init() {
    const fileInput = document.getElementById("stego-file-input");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          this.loadCarrier(e.target.files[0]);
        }
      });
    }
  }

  loadSampleCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    // Create a rich gradient image
    const grad = ctx.createLinearGradient(0, 0, 300, 300);
    grad.addColorStop(0, "#06b6d4");
    grad.addColorStop(0.5, "#3b82f6");
    grad.addColorStop(1, "#10b981");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 300, 300);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px monospace";
    ctx.fillText("STEGANO CARRIER", 50, 150);

    this.carrierImg = canvas;
    this.displayCarrier(canvas);
  }

  loadCarrier(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        this.carrierImg = canvas;
        this.displayCarrier(canvas);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  displayCarrier(canvas) {
    const preview = document.getElementById("stego-preview-container");
    if (!preview) return;
    preview.innerHTML = `
      <div class="text-center space-y-2">
        <img src="${canvas.toDataURL()}" class="max-h-48 mx-auto rounded-lg border border-slate-700 shadow-md" />
        <span class="text-xs font-mono text-emerald-400 block font-bold">✓ Carrier Image Ready (${canvas.width}x${canvas.height} px)</span>
      </div>
    `;
  }

  encodeSecret() {
    if (!this.carrierImg) {
      this.loadSampleCanvas();
    }

    const secretText = document.getElementById("stego-secret-input")?.value || "PixelWars2026_TopSecretKey";
    const canvas = document.createElement("canvas");
    canvas.width = this.carrierImg.width;
    canvas.height = this.carrierImg.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(this.carrierImg, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Convert secret text into binary string with null terminator (00000000)
    let binaryMessage = "";
    for (let i = 0; i < secretText.length; i++) {
      binaryMessage += secretText.charCodeAt(i).toString(2).padStart(8, "0");
    }
    binaryMessage += "00000000"; // End marker

    if (binaryMessage.length > data.length / 4 * 3) {
      alert("Error: Secret message exceeds carrier pixel capacity!");
      return;
    }

    // Embed in LSB of RGB channels
    let bitIdx = 0;
    for (let i = 0; i < data.length && bitIdx < binaryMessage.length; i++) {
      if ((i + 1) % 4 === 0) continue; // Skip alpha channel
      const bit = parseInt(binaryMessage[bitIdx], 10);
      data[i] = (data[i] & 0xFE) | bit; // Set lowest bit
      bitIdx++;
    }

    ctx.putImageData(imgData, 0, 0);

    // Download encoded stego image
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stego_carrier_encoded_${new Date().getTime()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const statusEl = document.getElementById("stego-status");
      if (statusEl) {
        statusEl.innerHTML = `<span class="text-emerald-400 font-bold">✓ SECRET EMBEDDED! Carrier PNG downloaded with undetectable LSB payload.</span>`;
      }
      alert("🔐 SUCCESS: Secret message encoded into image pixels using LSB steganography! Downloaded as PNG.");
    }, "image/png");
  }

  decodeSecret() {
    const decodeInput = document.getElementById("stego-decode-file");
    if (!decodeInput || !decodeInput.files || !decodeInput.files[0]) {
      alert("Please choose an encoded PNG image to extract secret data.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        let binaryString = "";
        let extractedText = "";

        for (let i = 0; i < data.length; i++) {
          if ((i + 1) % 4 === 0) continue; // Skip alpha
          binaryString += (data[i] & 1).toString();

          if (binaryString.length === 8) {
            const charCode = parseInt(binaryString, 2);
            if (charCode === 0) break; // Null terminator reached
            extractedText += String.fromCharCode(charCode);
            binaryString = "";
          }
        }

        const outEl = document.getElementById("stego-decoded-output");
        if (outEl) {
          outEl.textContent = extractedText || "[No valid LSB payload detected in this image]";
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(decodeInput.files[0]);
  }
}

window.SteganoLab = new SteganoLab();
