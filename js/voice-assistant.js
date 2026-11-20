// ==========================================
// Elite Feature: Tactical AI Voice Assistant (Speech Synthesis)
// ==========================================

class ThreatVoice {
  constructor() {
    this.enabled = false;
    this.synth = window.speechSynthesis;
    this.voice = null;
  }

  init() {
    const toggleBtn = document.getElementById("voice-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggle());
    }

    if (this.synth) {
      // Find suitable voice
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = this.synth.getVoices();
        this.voice = voices.find(v => v.lang.includes("en") && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Natural"))) || voices[0];
      };
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    const btn = document.getElementById("voice-toggle-btn");
    if (btn) {
      btn.innerHTML = this.enabled 
        ? `<i data-lucide="mic" class="w-4 h-4 text-emerald-400"></i><span class="text-xs font-mono text-emerald-400">VOICE ON</span>`
        : `<i data-lucide="mic-off" class="w-4 h-4 text-slate-500"></i><span class="text-xs font-mono text-slate-500">VOICE OFF</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
    if (this.enabled) {
      this.speak("threatIQ tactical AI voice assistant online.");
    }
  }

  speak(text) {
    if (!this.enabled || !this.synth) return;
    try {
      this.synth.cancel(); // Cancel any existing speech
      const utter = new SpeechSynthesisUtterance(text);
      if (this.voice) utter.voice = this.voice;
      utter.pitch = 0.95;
      utter.rate = 1.05;
      utter.volume = 0.85;
      this.synth.speak(utter);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }
}

window.ThreatVoice = new ThreatVoice();
