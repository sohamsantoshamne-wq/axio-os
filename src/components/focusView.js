import { store } from '../store.js';
import { sounds } from '../audio.js';
import confetti from 'canvas-confetti';

// Focus Timer State (Persists during navigation across tabs in the current session)
let timerInterval = null;
let currentMode = 'deep_work'; // 'deep_work', 'ultra', 'sprint', 'short_break', 'long_break'
let totalSeconds = 25 * 60;
let secondsRemaining = 25 * 60;
let isRunning = false;
let linkedHabitId = '';

const PRESETS = {
  deep_work: { name: 'Deep Work', minutes: 25, isBreak: false, icon: '⚡' },
  ultra: { name: 'Ultra Focus', minutes: 50, isBreak: false, icon: '🧠' },
  sprint: { name: 'Quick Sprint', minutes: 15, isBreak: false, icon: '🚀' },
  short_break: { name: 'Short Break', minutes: 5, isBreak: true, icon: '☕' },
  long_break: { name: 'Long Break', minutes: 15, isBreak: true, icon: '🌴' }
};

let activeAmbient = 'brown'; // 'brown', 'rain', 'binaural', 'keyboard'
let ambientVolume = 0.5;

export function renderFocusView(container) {
  const data = store.data;
  const focusStats = data.focus || { sessionsToday: 0, totalMinutesToday: 0, lifetimeSessions: 0 };
  const habits = data.habits || [];

  const mins = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
  const secs = (secondsRemaining % 60).toString().padStart(2, '0');

  // SVG circular stroke calculation (circumference = 2 * PI * 110 = ~691.15)
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const preset = PRESETS[currentMode] || PRESETS.deep_work;
  const isAmbientActive = sounds.isAmbientPlaying();

  container.innerHTML = `
    <div class="focus-chamber-view">
      <!-- Focus Chamber Header -->
      <div class="focus-header-bar">
        <div class="focus-title-wrap">
          <div class="focus-badge">
            <span class="live-dot ${isRunning ? 'pulse' : ''}"></span> DEEP WORK FOCUS CHAMBER
          </div>
          <h2 class="focus-main-heading">Zero-Distraction <span class="text-gradient">Flow State</span></h2>
          <p class="focus-subheading">Sync your focus sessions with habits and listen to generative offline soundscapes.</p>
        </div>

        <!-- Focus Metric Pills -->
        <div class="focus-stats-row">
          <div class="focus-stat-pill">
            <span class="stat-pill-label">Sessions Today</span>
            <strong class="stat-pill-value font-mono text-cyan" id="focus-stat-sessions">${focusStats.sessionsToday || 0}</strong>
          </div>
          <div class="focus-stat-pill">
            <span class="stat-pill-label">Focus Time</span>
            <strong class="stat-pill-value font-mono text-emerald" id="focus-stat-minutes">${focusStats.totalMinutesToday || 0}m</strong>
          </div>
          <div class="focus-stat-pill">
            <span class="stat-pill-label">Total Completed</span>
            <strong class="stat-pill-value font-mono text-gold">${focusStats.lifetimeSessions || 0}</strong>
          </div>
        </div>
      </div>

      <!-- Main Dual Chamber: Left = Timer, Right = Soundscapes & Habit Sync -->
      <div class="focus-chamber-grid">
        
        <!-- Timer Card -->
        <div class="focus-timer-card">
          <!-- Preset Selector Row -->
          <div class="focus-presets-pills">
            <button class="preset-pill ${currentMode === 'deep_work' ? 'active' : ''}" data-preset="deep_work">⚡ 25m Deep Work</button>
            <button class="preset-pill ${currentMode === 'ultra' ? 'active' : ''}" data-preset="ultra">🧠 50m Ultra</button>
            <button class="preset-pill ${currentMode === 'sprint' ? 'active' : ''}" data-preset="sprint">🚀 15m Sprint</button>
            <button class="preset-pill ${currentMode === 'short_break' ? 'active' : ''}" data-preset="short_break">☕ 5m Rest</button>
            <button class="preset-pill ${currentMode === 'long_break' ? 'active' : ''}" data-preset="long_break">🌴 15m Break</button>
          </div>

          <!-- Circular Glowing Clock Ring -->
          <div class="timer-dial-wrapper">
            <svg class="timer-dial-svg" width="280" height="280" viewBox="0 0 280 280">
              <defs>
                <linearGradient id="timer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8"/>
                  <stop offset="50%" stop-color="#f97316"/>
                  <stop offset="100%" stop-color="#10b981"/>
                </linearGradient>
              </defs>
              <!-- Background Track Ring -->
              <circle cx="140" cy="140" r="${radius}" class="timer-ring-bg" />
              <!-- Progress Ring -->
              <circle cx="140" cy="140" r="${radius}" 
                      id="timer-ring-progress" 
                      class="timer-ring-bar ${isRunning ? 'glowing' : ''}" 
                      stroke-dasharray="${circumference}" 
                      stroke-dashoffset="${strokeDashoffset}" />
            </svg>

            <!-- Digital Display Inside Circle -->
            <div class="timer-center-content">
              <span class="timer-mode-badge">${preset.icon} ${preset.name.toUpperCase()}</span>
              <div class="timer-digits font-mono" id="focus-timer-digits">${mins}:${secs}</div>
              <span class="timer-status-hint">${isRunning ? 'FLOW ACTIVE • KEEP FOCUS' : 'PRESS START TO ENTER FLOW'}</span>
            </div>
          </div>

          <!-- Timer Action Controls -->
          <div class="timer-buttons-row">
            <button type="button" class="timer-btn-primary ${isRunning ? 'running' : ''}" id="btn-toggle-timer">
              <span>${isRunning ? '⏸️ Pause Session' : '▶ Start Focus Session'}</span>
            </button>
            <button type="button" class="timer-btn-secondary" id="btn-reset-timer" title="Reset Session">
              <span>🔄 Reset</span>
            </button>
          </div>
        </div>

        <!-- Right Side: Habit Linker & Offline Ambient Audio Synthesizer -->
        <div class="focus-tools-side">
          
          <!-- Habit Auto-Complete Linker Card -->
          <div class="focus-tool-card habit-sync-card">
            <div class="tool-card-header">
              <div class="tool-title-wrap">
                <span class="tool-icon">🔗</span>
                <div>
                  <h4 class="tool-card-title">Auto-Complete Habit on Finish</h4>
                  <p class="tool-card-desc">Automatically check off today's habit when this focus session finishes.</p>
                </div>
              </div>
            </div>

            <div class="habit-select-wrapper">
              <select id="select-linked-habit" class="focus-habit-select">
                <option value="">-- No linked habit (General Focus) --</option>
                ${habits.map(h => `
                  <option value="${h.id}" ${linkedHabitId === h.id ? 'selected' : ''}>
                    ${h.emoji} ${h.name} (${h.category})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Offline Ambient Soundscapes Synthesizer Card -->
          <div class="focus-tool-card ambient-card">
            <div class="tool-card-header">
              <div class="tool-title-wrap">
                <span class="tool-icon">🎧</span>
                <div>
                  <h4 class="tool-card-title">Offline Ambient Soundscapes</h4>
                  <p class="tool-card-desc">Zero-download, synthesized sound to mask distractions & enter flow.</p>
                </div>
              </div>
              <div class="ambient-eq ${isAmbientActive ? 'active' : ''}" id="ambient-equalizer">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>

            <!-- Sound Selector Grid -->
            <div class="ambient-modes-grid">
              <button type="button" class="ambient-pill ${activeAmbient === 'brown' ? 'selected' : ''}" data-ambient="brown">
                <span class="ambient-emoji">🌊</span>
                <span class="ambient-label">Brown Noise<br><small style="color: #94a3b8; font-size: 10px;">ADHD & Deep Rumble</small></span>
              </button>

              <button type="button" class="ambient-pill ${activeAmbient === 'rain' ? 'selected' : ''}" data-ambient="rain">
                <span class="ambient-emoji">🌧️</span>
                <span class="ambient-label">Heavy Rain<br><small style="color: #94a3b8; font-size: 10px;">Pink Noise & Raindrops</small></span>
              </button>

              <button type="button" class="ambient-pill ${activeAmbient === 'binaural' ? 'selected' : ''}" data-ambient="binaural">
                <span class="ambient-emoji">⚡</span>
                <span class="ambient-label">Alpha Waves<br><small style="color: #94a3b8; font-size: 10px;">432Hz Binaural Focus</small></span>
              </button>

              <button type="button" class="ambient-pill ${activeAmbient === 'keyboard' ? 'selected' : ''}" data-ambient="keyboard">
                <span class="ambient-emoji">⌨️</span>
                <span class="ambient-label">Tactile Typing<br><small style="color: #94a3b8; font-size: 10px;">Mechanical Ambience</small></span>
              </button>
            </div>

            <!-- Ambient Playback & Volume Control -->
            <div class="ambient-controls-bar">
              <button type="button" class="btn-toggle-ambient ${isAmbientActive ? 'playing' : ''}" id="btn-toggle-ambient">
                <span>${isAmbientActive ? '⏹ Stop Sound' : '▶ Play Ambient Audio'}</span>
              </button>

              <div class="ambient-volume-wrap">
                <span style="font-size: 13px;">🔊</span>
                <input type="range" id="ambient-volume-slider" min="0" max="1" step="0.05" value="${ambientVolume}" class="ambient-slider">
                <span class="volume-val font-mono" id="ambient-volume-label">${Math.round(ambientVolume * 100)}%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  attachFocusHandlers(container);
}

function attachFocusHandlers(container) {
  const toggleBtn = container.querySelector('#btn-toggle-timer');
  const resetBtn = container.querySelector('#btn-reset-timer');
  const digitsEl = container.querySelector('#focus-timer-digits');
  const ringProgress = container.querySelector('#timer-ring-progress');
  const habitSelect = container.querySelector('#select-linked-habit');
  const presetBtns = container.querySelectorAll('.preset-pill');
  const ambientBtns = container.querySelectorAll('.ambient-pill');
  const toggleAmbientBtn = container.querySelector('#btn-toggle-ambient');
  const volumeSlider = container.querySelector('#ambient-volume-slider');
  const volumeLabel = container.querySelector('#ambient-volume-label');
  const eqBars = container.querySelector('#ambient-equalizer');

  // Preset Selection
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      if (!PRESETS[presetKey]) return;
      currentMode = presetKey;
      const p = PRESETS[presetKey];
      totalSeconds = p.minutes * 60;
      secondsRemaining = totalSeconds;
      if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
      }
      sounds.playPop();
      renderFocusView(container);
    });
  });

  // Toggle Timer (Start / Pause)
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sounds.playCheck();
      if (isRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
      updateTimerUI();
    });
  }

  // Reset Timer
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      sounds.playPop();
      pauseTimer();
      const p = PRESETS[currentMode] || PRESETS.deep_work;
      totalSeconds = p.minutes * 60;
      secondsRemaining = totalSeconds;
      updateTimerUI();
    });
  }

  // Linked Habit Selection
  if (habitSelect) {
    habitSelect.addEventListener('change', (e) => {
      linkedHabitId = e.target.value;
      sounds.playPop();
    });
  }

  // Ambient Mode Buttons
  ambientBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.ambient;
      activeAmbient = mode;
      ambientBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      sounds.playPop();

      // If ambient is already playing, switch sound immediately
      if (sounds.isAmbientPlaying()) {
        sounds.startAmbient(activeAmbient, ambientVolume);
      }
    });
  });

  // Toggle Ambient Audio
  if (toggleAmbientBtn) {
    toggleAmbientBtn.addEventListener('click', () => {
      sounds.playPop();
      if (sounds.isAmbientPlaying()) {
        sounds.stopAmbient();
        toggleAmbientBtn.classList.remove('playing');
        toggleAmbientBtn.innerHTML = '<span>▶ Play Ambient Audio</span>';
        if (eqBars) eqBars.classList.remove('active');
      } else {
        sounds.startAmbient(activeAmbient, ambientVolume);
        toggleAmbientBtn.classList.add('playing');
        toggleAmbientBtn.innerHTML = '<span>⏹ Stop Sound</span>';
        if (eqBars) eqBars.classList.add('active');
      }
    });
  }

  // Ambient Volume Slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      ambientVolume = parseFloat(e.target.value);
      if (volumeLabel) volumeLabel.textContent = `${Math.round(ambientVolume * 100)}%`;
      sounds.setAmbientVolume(ambientVolume);
    });
  }

  function startTimer() {
    isRunning = true;
    timerInterval = setInterval(() => {
      if (secondsRemaining <= 1) {
        clearInterval(timerInterval);
        isRunning = false;
        secondsRemaining = 0;
        updateTimerUI();
        onTimerComplete();
        return;
      }
      secondsRemaining--;
      updateTimerUI();
    }, 1000);
  }

  function pauseTimer() {
    isRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerUI() {
    const mins = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
    const secs = (secondsRemaining % 60).toString().padStart(2, '0');
    if (digitsEl) digitsEl.textContent = `${mins}:${secs}`;

    const radius = 110;
    const circumference = 2 * Math.PI * radius;
    const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
    const offset = circumference * (1 - progressRatio);
    if (ringProgress) {
      ringProgress.style.strokeDashoffset = offset;
      if (isRunning) {
        ringProgress.classList.add('glowing');
      } else {
        ringProgress.classList.remove('glowing');
      }
    }

    if (toggleBtn) {
      if (isRunning) {
        toggleBtn.classList.add('running');
        toggleBtn.innerHTML = '<span>⏸️ Pause Session</span>';
      } else {
        toggleBtn.classList.remove('running');
        toggleBtn.innerHTML = '<span>▶ Start Focus Session</span>';
      }
    }
  }

  function onTimerComplete() {
    const p = PRESETS[currentMode] || PRESETS.deep_work;
    
    // Play Mindfulness Bell Chime
    sounds.playBell();

    // Celebration Confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }

    // Record session and auto-complete linked habit
    if (!p.isBreak) {
      store.recordFocusSession(p.minutes, linkedHabitId || null);
    }

    // Reset timer
    totalSeconds = p.minutes * 60;
    secondsRemaining = totalSeconds;

    // Refresh view to display updated stats
    renderFocusView(container);
  }
}
