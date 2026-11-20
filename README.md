# 🛡️ threatIQ — AI-Powered Cybersecurity & Digital Safety Platform

> **Official Entry for Pixel Wars X26 — 24-Hour Remote Hackathon (21 November 2026)**  
> **Category:** Cybersecurity, Privacy & Ethical Hacking  
> **Author:** Prince (Roll: 044) | Bosscoder School of Technology  
> **License:** MIT Open Source  

---

## 🎯 Problem Statement Alignment

> *"Create interfaces that educate, inform, or support safer digital behaviour. Ideas include cyber-awareness portals, security product websites, vulnerability-reporting interfaces, password-safety tools, or simulated security dashboards. Keep demonstrations ethical and safe; do not build tools intended to compromise real systems."*

**threatIQ** delivers an unbeatable, all-in-one ethical cyber defense operating suite featuring **10 interactive client-side security modules**:

| Category Prompt | threatIQ Module | Live Interactive Capability |
| :--- | :--- | :--- |
| **Simulated Security Dashboards** | ⚔️ **Cyber War Game (Battle Arena)** | Real-time battle simulator: Red Team attack waves (DDoS, SQLi, Ransomware, Credential Stuffing) vs. Blue Team tactical countermeasures. |
| **Security Product Websites / AI** | 🤖 **AI Threat Copilot & Triage** | Paste raw shell scripts, SQL queries, or server logs to receive instant MITRE ATT&CK mapping, CWE classification, and drop-in defensive code. |
| **Cyber-Awareness Portals** | 🎣 **PhishGuard & Quishing Lab** | Realistic Business Email Compromise, Cyrillic lookalike homoglyphs (`accounts.gооgle.com`), and QR code credential traps with live scoring. |
| **Cyber-Awareness & URL Safety** | 🔗 **URL & Homoglyph De-Cloaker** | Scans URLs for non-ASCII Punycode characters, open redirect parameters, high-risk TLDs, and nested subdomain brand impersonation. |
| **Password-Safety Tools** | 🔐 **CipherFortress & Web Crypto** | Shannon entropy math, brute-force crack times on 8x RTX 4090 GPU rigs vs. Quantum Grover speedup, and native SHA-256 Avalanche Effect visualizer. |
| **Privacy & Safe Digital Behavior** | 🕵️ **PrivacyShield (EXIF Scrubber)** | **Working client-side tool**: Drag-and-drop photos to expose hidden camera serials and GPS tags, with a 1-click sanitizer that downloads clean PNGs. |
| **Digital Privacy & Ethical Hacking**| 🖼️ **Image Steganography Lab** | Encode confidential secrets into raw image pixel bits (LSB manipulation) and extract hidden payloads from carrier PNGs. |
| **Simulated Security Dashboards** | 🚨 **SentinelSOC & Global Threat Map**| Animated HTML5 Canvas world threat arc visualizer with live incident response playbooks and Chart.js vector distribution analytics. |
| **Vulnerability-Reporting Interfaces**| 🛡️ **DiscloseSafe (CVSS v3.1)** | Official FIRST CVSS v3.1 calculator that dynamically computes base scores, compiles vector strings, and generates markdown disclosure reports. |
| **Educational Gamification** | 🏆 **Defender Challenge & Cert** | 5-question speed evaluation testing practical cyber hygiene with a personalized, downloadable "Certified Defender" credential. |

---

## 🚀 Deep Architectural Highlights

### 1. ⚔️ Red Team vs Blue Team Cyber War Game
- Real-time event loop with ticking health meter and attack waves.
- Players analyze threat signatures and select matching countermeasures (*Edge WAF Rate-Limiting*, *FIDO2 MFA Enforcement*, *Prepared Statements*, *Host Isolation*).
- Dynamic win/loss state with confetti and audio feedback.

### 2. 🤖 AI Threat Copilot & Payload Triage
- Client-side heuristic analyzer for:
  - Log4Shell JNDI injection (`${jndi:ldap://...}`)
  - OS command chaining (`ping 127.0.0.1; curl ... | bash`)
  - Stored XSS cookie stealing (`<script>document.cookie...</script>`)
  - Blind SQL injection (`UNION SELECT ...`)
  - Directory traversal (`../../../../etc/passwd`)
- Extracts Indicators of Compromise (IOCs) and outputs drop-in secure code.

### 3. 🖼️ LSB Steganography Engine
- Uses HTML5 Canvas `getImageData` and `putImageData` to manipulate the least significant bit (bit 0) of the red, green, and blue color channels.
- Encodes arbitrary ASCII strings into image rasters without visible color shifts.
- Decodes hidden null-terminated binary streams back into readable text.

### 4. 🕵️ EXIF Geotag Metadata Scrubber
- Reads binary EXIF markers directly in the browser using FileReader.
- Re-draws selected images onto an offline canvas element and exports an uncompressed PNG blob, permanently stripping all GPS tags, device serials, and timestamps.

### 5. 🚨 Animated Global Threat Map (Canvas)
- Custom quadratic bezier curve renderer calculating projectile trajectories between simulated global telemetry nodes (US-East, Frankfurt, Tokyo, Singapore, São Paulo, London, Mumbai).

---

## 💻 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/<your-username>/threatiq.git
cd threatiq

# Open directly in browser or run via Python
python3 -m http.server 8080
```
Open `http://localhost:8080` or simply double-click `index.html`.

---

## 🌐 Instant Live Deployment Guide

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/<your-username>/threatiq.git
   git push -u origin main
   ```
2. **Deploy via GitHub Pages**:
   - Go to **Settings > Pages > Branch: `main` / root > Save**.
   - Your live URL: `https://<your-username>.github.io/threatiq/`
3. *(Alternative)* **Deploy via Vercel**:
   - Import your repository on [vercel.com](https://vercel.com) and click **Deploy**.

---

## ⚖️ Ethical Hacking & Safe Harbor Statement

threatIQ was engineered exclusively for defensive, educational, and digital awareness purposes. All attack demonstrations are strictly sandboxed and compliant with ISO/IEC 29147 responsible disclosure standards.
