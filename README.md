# 🛡️ Aegis-OS — Ethical Cybersecurity, Privacy & Threat Defense Suite

> **Official Entry for Pixel Wars X26 — 24-Hour Remote Hackathon (21 November 2026)**  
> **Category:** Cybersecurity, Privacy & Ethical Hacking  
> **Author:** Prince (Roll: 044) | Bosscoder School of Technology  
> **License:** MIT Open Source  

---

## 🎯 Problem Statement Alignment

> *"Create interfaces that educate, inform, or support safer digital behaviour. Ideas include cyber-awareness portals, security product websites, vulnerability-reporting interfaces, password-safety tools, or simulated security dashboards. Keep demonstrations ethical and safe; do not build tools intended to compromise real systems."*

**Aegis-OS** directly addresses all five suggested domains in a unified, high-tech, responsive cybersecurity defense operating platform:

1. **Cyber-Awareness Portal (`🎣 PhishGuard Lab`)**: Real-world interactive attack inspection (Business Email Compromise, Cyrillic Punycode homoglyphs, and Quishing QR code traps) with red flag diagnostics and live scoring.
2. **Password-Safety Tool (`🔐 CipherFortress`)**: Real-time Shannon entropy calculation (bits), offline GPU cluster (8x RTX 4090) vs. Quantum Shor/Grover crack-time estimations, dictionary pattern scanners, and cryptographic Diceware passphrase generator.
3. **Digital Privacy & Metadata Scrubber (`🕵️ PrivacyShield`)**: 100% client-side drag-and-drop tool that extracts camera serials and GPS coordinates from photos, strips all tracking headers with a 1-click sanitizer, and runs a passive browser fingerprinting audit.
4. **Simulated Security Dashboard (`🚨 SentinelSOC`)**: Live simulated SOC incident feed (Ransomware canary alerts, L7 DDoS floods, SQLi WAF blocks) with interactive remediation playbooks and dynamic Chart.js threat distributions.
5. **Vulnerability-Reporting Interface (`🛡️ DiscloseSafe`)**: Official FIRST CVSS v3.1 calculator that dynamically computes base scores, compiles vector strings, and generates markdown responsible disclosure reports under Safe Harbor standards.

---

## 🚀 Key Features & Interactive Modules

### 1. 🎣 PhishGuard & Social Engineering Lab
- **Interactive Scenarios**:
  - *Scenario 1 (BEC)*: Executive impersonation & urgent wire transfer.
  - *Scenario 2 (Homograph)*: Google Workspace lookalike login using Cyrillic `о` (`accounts.gооgle.com`).
  - *Scenario 3 (Quishing)*: QR code phishing designed to bypass Secure Email Gateways (SEGs).
- **Deep Threat Audit**: Click-to-reveal inspection of spoofed return paths, artificial urgency triggers, and concealed redirect links.
- **Defensive Protocol**: Step-by-step guidance on out-of-band verification and email header analysis (SPF, DKIM, DMARC).

### 2. 🔐 CipherFortress & Entropy Engine
- **Shannon Entropy Engine**: Computes exact bits of entropy using character pool sizing and password length.
- **Hardware Benchmarks**: Compares cracking times against:
  - Consumer CPU (10 Million guesses/sec)
  - 8x NVIDIA RTX 4090 Hashcat Rig ($10^{11}$ hashes/sec)
  - Theoretical Quantum Computer with Grover's $\sqrt{N}$ speedup
- **Cryptographic Diceware Generator**: Generates 4-word memorable passphrases with 78+ bits of entropy.
- **Passkey Comparison**: Demonstrates how FIDO2 / WebAuthn asymmetric cryptography eliminates shared-secret database credential breaches.

### 3. 🕵️ PrivacyShield (EXIF Scrubber & Browser Audit)
- **Real Working EXIF Tool**:
  - Drag-and-drop any JPEG/PNG photo or load a sample geotagged iPhone capture.
  - Exposes Make, Model, Timestamp, and GPS coordinates (Latitude/Longitude).
  - **1-Click Sanitizer**: Re-draws and renders clean raster Blobs stripped of all EXIF headers for immediate download.
- **Browser Fingerprinting Audit**:
  - Analyzes passive browser telemetry: WebGL GPU vendor/renderer, Canvas 2D entropy hash, screen resolution, timezone, CPU concurrency, and DNT status.

### 4. 🚨 SentinelSOC Incident Response Console
- **Real-Time Threat Telemetry**:
  - Ransomware canary alerts (Mitre ATT&CK T1486)
  - Layer-7 DDoS HTTP flood spikes (T1499)
  - SQL injection attempts blocked at WAF layer (T1190)
  - SSH credential stuffing waves (T1110.004)
- **Interactive Remediation Playbooks**:
  - Step through tactical actions: *Isolate Endpoint*, *Revoke Session Tokens*, *Push Edge WAF Rules*.
  - Dynamic threat mitigation scoring with live counter.
- **Visual Analytics**: Interactive Doughnut chart built with Chart.js displaying attack vector proportions.

### 5. 🛡️ DiscloseSafe — Official CVSS v3.1 Engine
- **Specification Compliant**: Calculates official CVSS v3.1 base score using weighted metrics for Attack Vector (AV), Attack Complexity (AC), Privileges Required (PR), User Interaction (UI), Scope (S), and Impact (C/I/A).
- **Vector String**: Instant vector compilation (e.g. `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`).
- **Markdown Export**: Generates compliant Responsible Disclosure vulnerability reports ready for submission to bug bounty programs.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: Semantic HTML5, Vanilla JavaScript (ES6+ Modules), Tailwind CSS
- **Visuals & HUD**: Lucide Icons, Custom Cyber Scanlines, Glassmorphism, JetBrains Mono typography
- **Data Visualization**: Chart.js (Doughnut threat distributions)
- **Client-Side Image Processing**: Exif.js + HTML5 Canvas raster sanitization
- **Web Audio API**: Real-time synthesizer for tactical HUD audio effects
- **Zero Build Friction**: 100% client-side static application. No complex dependencies, zero build-step errors, and instant deployment.

---

## 💻 How to Run Locally

You can run Aegis-OS locally with any standard HTTP server:

```bash
# Clone the repository
git clone https://github.com/prince-044/aegis-os.git
cd aegis-os

# Run using Python built-in server
python3 -m http.server 8000
```

Open `http://localhost:8000` in your web browser.

---

## 🌐 Instant Live Deployment Guide

Aegis-OS is pre-configured for instant deployment:

### Option A: GitHub Pages
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for Pixel Wars X26"
   git remote add origin https://github.com/<your-username>/aegis-os.git
   git push -u origin main
   ```
2. In GitHub, go to **Settings > Pages > Source > Deploy from a branch (`main` / root)**.
3. Your live URL will be active in seconds: `https://<your-username>.github.io/aegis-os/`.

### Option B: Vercel / Netlify
1. Drag and drop the `aegis-os` folder directly into [Vercel Dashboard](https://vercel.com) or [Netlify Drop](https://app.netlify.com/drop).
2. It deploys automatically as a static site with 100% uptime.

---

## ⚖️ Ethical Hacking & Safe Harbor Statement

Aegis-OS was designed and developed strictly for educational, defensive, and security awareness purposes. It contains no exploit payloads, does not perform unauthorized network reconnaissance, and adheres to ISO/IEC 29147 standards for responsible vulnerability disclosure.
