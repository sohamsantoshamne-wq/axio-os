// Web Audio API Synthesizer - Ultra-low latency, zero external assets
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = (localStorage.getItem('axio_sound_enabled') ?? localStorage.getItem('nexus_sound_enabled')) !== 'false';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('axio_sound_enabled', this.enabled);
    if (this.enabled) {
      this.playCheck();
    }
    return this.enabled;
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {
      console.warn(e);
    }
  }

  playCheck() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Executive Tactile Transient (Apple haptic click style)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2.0, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.035);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

      // 2. Subtle warm acoustic glass ping (crystal resonance)
      const ping = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(880, now); // A5 pure glass ping
      ping.frequency.exponentialRampToValueAtTime(587.33, now + 0.06); // D5 decay
      pingGain.gain.setValueAtTime(0.07, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      ping.connect(pingGain);
      pingGain.connect(this.ctx.destination);

      osc.start(now);
      ping.start(now);
      osc.stop(now + 0.04);
      ping.stop(now + 0.07);
    } catch (e) {
      console.warn(e);
    }
  }

  playUncheck() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.032);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.036);
    } catch (e) {
      console.warn(e);
    }
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.09;
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  playStreak() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.08;
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.33);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  playDing() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.41);
    } catch (e) {
      console.warn(e);
    }
  }

  playWater() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch (e) {
      console.warn(e);
    }
  }

  // Resonant Mindfulness Bell / Singing Bowl Chime (Focus Timer Completion)
  playBell() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [528, 792, 1056].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        const startGain = [0.26, 0.12, 0.05][idx];
        gain.gain.setValueAtTime(startGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.65);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // --- Offline Ambient Soundscape Synthesizer ---
  startAmbient(type = 'brown', volume = 0.5) {
    this.stopAmbient();
    this.init();
    if (!this.ctx) return;

    try {
      this.ambientVolume = Math.max(0, Math.min(1, volume));
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);
      this.ambientType = type;

      const sampleRate = this.ctx.sampleRate;

      if (type === 'brown') {
        // Deep Brownian noise (ADHD masking / Laser Focus)
        const bufferSize = sampleRate * 3;
        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + (0.02 * white)) / 1.02;
          data[i] = lastOut * 3.5;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);

        source.connect(filter);
        filter.connect(this.ambientGain);
        source.start();
        this.ambientSource = source;

      } else if (type === 'rain') {
        // Heavy Rain: Filtered Pink Noise + randomized droplet spatters
        const bufferSize = sampleRate * 3;
        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
          b6 = white * 0.115926;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, this.ctx.currentTime);

        source.connect(filter);
        filter.connect(this.ambientGain);
        source.start();
        this.ambientSource = source;

        // Subtle randomized droplet spatters
        this.ambientInterval = setInterval(() => {
          if (!this.ctx || !this.ambientGain) return;
          try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            const f = 1900 + Math.random() * 1400;
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.exponentialRampToValueAtTime(f * 0.5, t + 0.038);
            g.gain.setValueAtTime(0.015, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.042);
            osc.connect(g);
            g.connect(this.ambientGain);
            osc.start(t);
            osc.stop(t + 0.045);
          } catch(e) {}
        }, 240);

      } else if (type === 'binaural') {
        // Cyber Binaural Waves (216 Hz & 226 Hz -> 10 Hz Alpha frequency)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(216, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(226, this.ctx.currentTime);

        const panner1 = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
        const panner2 = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

        if (panner1 && panner2) {
          panner1.pan.setValueAtTime(-0.85, this.ctx.currentTime);
          panner2.pan.setValueAtTime(0.85, this.ctx.currentTime);
          osc1.connect(panner1);
          panner1.connect(this.ambientGain);
          osc2.connect(panner2);
          panner2.connect(this.ambientGain);
        } else {
          osc1.connect(this.ambientGain);
          osc2.connect(this.ambientGain);
        }

        osc1.start();
        osc2.start();
        this.ambientSource = [osc1, osc2];

      } else if (type === 'keyboard') {
        // Mechanical Keystroke Ambience
        this.ambientInterval = setInterval(() => {
          if (!this.ctx || !this.ambientGain) return;
          try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            const fil = this.ctx.createBiquadFilter();
            fil.type = 'bandpass';
            fil.frequency.setValueAtTime(1700 + Math.random() * 900, t);
            fil.Q.setValueAtTime(3.0, t);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320 + Math.random() * 90, t);
            osc.frequency.exponentialRampToValueAtTime(70, t + 0.024);

            g.gain.setValueAtTime(0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.027);

            osc.connect(fil);
            fil.connect(g);
            g.connect(this.ambientGain);

            osc.start(t);
            osc.stop(t + 0.03);
          } catch(e) {}
        }, 280);
      }
    } catch(err) {
      console.warn('Ambient start error:', err);
    }
  }

  stopAmbient() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientSource) {
      try {
        if (Array.isArray(this.ambientSource)) {
          this.ambientSource.forEach(s => {
            try { s.stop(); s.disconnect(); } catch(e) {}
          });
        } else {
          this.ambientSource.stop();
          this.ambientSource.disconnect();
        }
      } catch(e) {}
      this.ambientSource = null;
    }
    if (this.ambientGain) {
      try { this.ambientGain.disconnect(); } catch(e) {}
      this.ambientGain = null;
    }
    this.ambientType = null;
  }

  setAmbientVolume(vol) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
    }
  }

  isAmbientPlaying() {
    return !!(this.ambientSource || this.ambientInterval);
  }
}

export const sounds = new SoundManager();
