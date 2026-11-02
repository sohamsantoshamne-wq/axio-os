import confetti from 'canvas-confetti';
import { sounds } from './audio.js';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function computeChecksum(seed) {
  let sum = 0x5A;
  for (let i = 0; i < seed.length; i++) {
    const code = seed.charCodeAt(i);
    sum = ((sum << 5) - sum) + code * (i + 7);
    sum = sum & 0xFFFF;
  }
  const c1 = CHARS.charAt(Math.abs(sum) % CHARS.length);
  const c2 = CHARS.charAt(Math.abs(sum >> 3) % CHARS.length);
  const c3 = CHARS.charAt(Math.abs(sum >> 7) % CHARS.length);
  const c4 = CHARS.charAt(Math.abs(sum >> 11) % CHARS.length);
  return `${c1}${c2}${c3}${c4}`;
}

export function generateLicenseKey() {
  let seed = '';
  for (let i = 0; i < 4; i++) {
    seed += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  const check = computeChecksum(seed);
  return `AXIO-VIP-${seed}-${check}-LIFETIME`;
}

export function verifyLicenseKey(key) {
  if (!key || typeof key !== 'string') return false;
  const clean = key.trim().toUpperCase();
  // Master owner & verified lifetime keys
  if (
    clean === 'AXIO-VIP-SOHAM-2026-LIFETIME' ||
    clean === 'AXIO-MASTER-KEY-2026' ||
    clean === 'AXIO-VIP-2026-LIFETIME' ||
    clean === 'AXIO-VIP-LIFETIME'
  ) {
    return true;
  }
  const match = clean.match(/^AXIO-VIP-([A-Z0-9]{4})-([A-Z0-9]{4})-LIFETIME$/);
  if (!match) return false;
  const seed = match[1];
  const check = match[2];
  return computeChecksum(seed) === check;
}

export function checkLicenseActivation() {
  const isDevLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // 1. Check for query parameter key in URL (?key=... or ?license=...)
  const urlParams = new URLSearchParams(window.location.search);
  const paramKey = urlParams.get('key') || urlParams.get('license');
  if (paramKey && verifyLicenseKey(paramKey)) {
    localStorage.setItem('axio_activated_license', paramKey.trim().toUpperCase());
    localStorage.setItem('axio_customer_license', paramKey.trim().toUpperCase());
    localStorage.setItem('axio_customer_unlocked', 'true');
    return true;
  }

  const savedKey = localStorage.getItem('axio_activated_license') || localStorage.getItem('axio_customer_license');
  const isCustomerUnlocked = localStorage.getItem('axio_customer_unlocked') === 'true';
  
  if (savedKey && verifyLicenseKey(savedKey)) {
    return true;
  }

  if (isCustomerUnlocked && savedKey) {
    return true;
  }

  // If running locally in developer mode with explicit dev query flag
  if (isDevLocal && window.location.search.includes('dev=true')) {
    return true;
  }

  showLicenseGateModal();
  return false;
}

function showLicenseGateModal() {
  const existing = document.getElementById('license-gate-modal');
  if (existing) return;

  const overlay = document.createElement('div');
  overlay.id = 'license-gate-modal';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(7, 10, 18, 0.96);
    backdrop-filter: blur(24px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  `;

  overlay.innerHTML = `
    <div style="background: #0f1629; border: 1px solid rgba(249, 115, 22, 0.4); box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(249, 115, 22, 0.2); border-radius: 20px; max-width: 480px; width: 100%; padding: 32px 28px; text-align: center; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
      <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(249, 115, 22, 0.14); border: 1px solid rgba(249, 115, 22, 0.35); padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; color: #fb923c; margin-bottom: 18px; letter-spacing: 0.06em; text-transform: uppercase;">
        🔒 AXIO OS • VIP License Activation
      </div>
      <h2 style="font-size: 24px; font-weight: 900; color: #fff; margin-bottom: 10px; letter-spacing: -0.02em;">Activate Your Workstation</h2>
      <p style="font-size: 13.5px; color: #94a3b8; line-height: 1.6; margin-bottom: 22px;">
        To unlock your lifetime daily consistency engine, please enter the <strong>VIP License Key</strong> from your official purchase receipt:
      </p>
      
      <div style="margin-bottom: 14px;">
        <input type="text" id="license-input-field" placeholder="AXIO-VIP-XXXX-XXXX-LIFETIME" style="width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.18); border-radius: 12px; padding: 14px 16px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 13.5px; text-align: center; letter-spacing: 0.05em; outline: none; transition: all 0.2s;">
      </div>

      <div id="license-input-error" style="display: none; font-size: 12px; color: #f87171; margin-bottom: 14px; font-weight: 600;"></div>

      <button id="license-submit-btn" style="width: 100%; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #fff; border: none; font-weight: 800; font-size: 14.5px; padding: 14px; border-radius: 12px; cursor: pointer; box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4); transition: transform 0.2s;">
        ⚡ Activate Lifetime License →
      </button>

      <div style="margin-top: 20px; font-size: 12px; color: #64748b; line-height: 1.5;">
        Need a genuine license? <a href="./landing.html" style="color: #22d3ee; text-decoration: underline; font-weight: 700;">Purchase Lifetime Access (₹199)</a><br>
        Lost your key? Email support at <a href="mailto:axio.os.ltd@gmail.com" style="color: #22d3ee; text-decoration: none;">axio.os.ltd@gmail.com</a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = document.getElementById('license-input-field');
  const btn = document.getElementById('license-submit-btn');
  const errBox = document.getElementById('license-input-error');

  const doActivate = () => {
    const val = input.value.trim().toUpperCase();
    if (!val) {
      errBox.textContent = '⚠️ Please enter your VIP License Key.';
      errBox.style.display = 'block';
      return;
    }

    if (verifyLicenseKey(val)) {
      localStorage.setItem('axio_activated_license', val);
      localStorage.setItem('axio_customer_unlocked', 'true');
      errBox.style.display = 'none';
      btn.innerHTML = '✓ License Activated! Unlocking...';
      btn.style.background = '#10b981';
      sounds.playDing ? sounds.playDing() : sounds.playBell();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f97316', '#fbbf24', '#06b6d4', '#ffffff']
      });
      setTimeout(() => {
        overlay.style.transition = 'opacity 0.4s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 400);
      }, 700);
    } else {
      errBox.textContent = '❌ Invalid License Key. Please enter the official key from your purchase.';
      errBox.style.display = 'block';
      input.style.borderColor = '#ef4444';
      if (sounds.playPop) sounds.playPop();
      input.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(0)' }
      ], { duration: 300 });
    }
  };

  btn.addEventListener('click', doActivate);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doActivate();
  });
  input.focus();
}
