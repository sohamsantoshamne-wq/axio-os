import './style.css';
import { store } from './store.js';
import { sounds } from './audio.js';
import { setupModals } from './modals.js';
import { renderHabitMatrix } from './components/habitMatrix.js';
import { renderStreakHistory } from './components/streakHistory.js';
import { renderChartsView } from './components/chartsView.js';
import { renderOverview } from './components/overview.js';
import { renderFocusView } from './components/focusView.js';
import LZString from 'lz-string';
import confetti from 'canvas-confetti';
import { checkLicenseActivation } from './license.js';

let currentTab = 'matrix'; // Start with habit grid matching user's reference

function initApp() {
  const mainContent = document.getElementById('main-content');
  const navTabs = document.getElementById('main-nav-tabs');

  // Enforce VIP License Check (Secures offline downloads against unpaid use)
  checkLicenseActivation();

  // Verify daily rollover (reset daily water, sync date)
  store.checkDailyReset();

  // Initialize Modal Engine
  setupModals();

  // Setup Live Real-Time Clock with Midnight Rollover Engine
  startLiveClock();

  // Update Header Level & XP
  updateHeaderStats();

  // Apply Initial Theme
  document.body.setAttribute('data-theme', store.data.settings.theme || 'cyberpunk');

  // Check for incoming sync payload (e.g. from QR code or sync link)
  checkIncomingSync();

  // Setup Sound Toggle
  setupSoundToggle();

  // Setup Settings Button
  setupSettingsButton();

  // Setup Phone Sync Button
  setupPhoneSyncButton();

  // Setup PWA Standalone Install Handler
  setupPwaInstall();

  // Tab switching navigation
  navTabs.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.nav-tab-btn');
    if (!tabBtn) return;
    const targetTab = tabBtn.dataset.tab;
    switchTab(targetTab);
    sounds.playPop();
  });

  // Global event listener for custom tab switch
  window.addEventListener('switch-tab', (e) => {
    const tabId = e.detail && e.detail.tab;
    if (tabId && tabId !== currentTab) {
      switchTab(tabId);
      sounds.playPop();
    }
  });

  // Reactive store listener
  store.subscribe((data, event, meta) => {
    document.body.setAttribute('data-theme', store.data.settings.theme || 'cyberpunk');
    updateHeaderStats();
    renderActiveTab();
  });

  // Setup Keyboard Shortcuts
  setupKeyboardShortcuts();

  // Render initial tab
  renderActiveTab();
}

function switchTab(tabId) {
  currentTab = tabId;

  // Update active state on nav tab buttons
  const buttons = document.querySelectorAll('.nav-tab-btn');
  buttons.forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderActiveTab();
}

function renderActiveTab() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  if (currentTab === 'matrix') {
    renderHabitMatrix(mainContent);
  } else if (currentTab === 'streaks') {
    renderStreakHistory(mainContent);
  } else if (currentTab === 'charts') {
    renderChartsView(mainContent);
  } else if (currentTab === 'focus') {
    renderFocusView(mainContent);
  } else if (currentTab === 'overview') {
    renderOverview(mainContent);
  }
}

function updateHeaderStats() {
  const data = store.data;
  const now = new Date();
  const today = now.getDate();
  const monthKey = store.getMonthKey(now.getFullYear(), now.getMonth());

  const habits = data.habits || [];
  const total = habits.length;
  let done = 0;
  habits.forEach(h => {
    if (h.checks && h.checks[monthKey] && h.checks[monthKey][today]) {
      done++;
    }
  });

  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const labelEl = document.getElementById('header-today-summary');
  const fillEl = document.getElementById('header-today-fill');

  if (labelEl) labelEl.textContent = `${done}/${total} Done Today (${percent}%)`;
  if (fillEl) fillEl.style.width = `${percent}%`;
}

function startLiveClock() {
  const timeEl = document.getElementById('live-clock-time');
  const dateEl = document.getElementById('live-clock-date');
  let lastActiveDay = new Date().getDate();

  function update() {
    const now = new Date();
    const is24h = (store.data.settings && store.data.settings.clockFormat === '24h');
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24h
      });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    // Midnight Rollover Engine: If day changes while app is open, update UI dynamically
    const currentDay = now.getDate();
    if (currentDay !== lastActiveDay) {
      lastActiveDay = currentDay;
      store.checkDailyReset();
      renderActiveTab();
      updateHeaderStats();
    }
  }

  update();
  setInterval(update, 1000);
}

function setupSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  function updateIcon() {
    if (soundIcon) {
      soundIcon.textContent = sounds.enabled ? '🔊' : '🔇';
    }
  }

  updateIcon();

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      sounds.toggleSound();
      updateIcon();
    });
  }
}

function setupSettingsButton() {
  const settingsBtn = document.getElementById('open-settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-modal', { detail: { modal: 'settings' } }));
      sounds.playPop();
    });
  }
}

function setupPhoneSyncButton() {
  const syncBtn = document.getElementById('open-phone-sync-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-modal', { detail: { modal: 'phone-sync' } }));
      sounds.playPop();
    });
  }
}

function checkIncomingSync() {
  const hash = window.location.hash;
  if (hash && hash.includes('sync=')) {
    try {
      const encoded = hash.split('sync=')[1];
      if (!encoded) return;
      const json = LZString.decompressFromEncodedURIComponent(encoded);
      if (json) {
        const success = store.importJSON(json);
        if (success) {
          window.history.replaceState(null, '', window.location.pathname);
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
          sounds.playDing();
          alert('✓ Synchronized with your PC! All habits, streaks, and progress are now live on your phone.');
        }
      }
    } catch (e) {
      console.warn('Sync decode error', e);
    }
  }
}

function setupPwaInstall() {
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            installBtn.style.display = 'none';
          }
          deferredPrompt = null;
        }
      });
    }
  });
}

function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // If typing in input, don't trigger shortcuts
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (e.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('close-modal'));
      }
      return;
    }

    if (e.key === '1') switchTab('matrix');
    else if (e.key === '2') switchTab('streaks');
    else if (e.key === '3') switchTab('charts');
    else if (e.key === '4') switchTab('overview');
    else if (e.key === 'Escape') {
      window.dispatchEvent(new CustomEvent('close-modal'));
    }
  });
}

// Bootstrap immediately to prevent any render lag
initApp();
