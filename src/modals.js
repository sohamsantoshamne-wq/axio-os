import { store } from './store.js';
import { sounds } from './audio.js';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import LZString from 'lz-string';

export function setupModals() {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  let modalOpenedTime = 0;
  let isBackdropMousedown = false;

  window.addEventListener('open-modal', (e) => {
    const modalType = e.detail && e.detail.modal;
    if (modalType) {
      modalOpenedTime = Date.now();
      isBackdropMousedown = false;
      renderModal(modalContainer, modalType);
    }
  });

  window.addEventListener('close-modal', () => {
    modalContainer.innerHTML = '';
    modalContainer.classList.remove('active');
  });

  // Track mousedown to verify click originated strictly on the backdrop itself
  modalContainer.addEventListener('mousedown', (e) => {
    isBackdropMousedown = (e.target === modalContainer);
  });

  // Close on backdrop click only if mousedown began on the backdrop and at least 350ms has elapsed
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer && isBackdropMousedown && (Date.now() - modalOpenedTime > 350)) {
      window.dispatchEvent(new CustomEvent('close-modal'));
    }
  });
}

function renderModal(container, type) {
  container.classList.add('active');

  if (type === 'add-habit') {
    renderAddHabitModal(container);
  } else if (type === 'settings') {
    renderSettingsModal(container);
  } else if (type === 'share-streak') {
    renderShareStreakModal(container);
  } else if (type === 'phone-sync') {
    renderPhoneSyncModal(container);
  }

  // Prevent any clicks or mousedowns inside modal card from bubbling up to backdrop
  const card = container.querySelector('.modal-card');
  if (card) {
    card.addEventListener('mousedown', (e) => e.stopPropagation());
    card.addEventListener('click', (e) => e.stopPropagation());
  }
}

// Comprehensive Emoji Database covering what 1000+ people track
const EMOJI_DATABASE = [
  // Popular / Core
  { emoji: '⏰', name: 'alarm wake up morning early', cat: 'popular' },
  { emoji: '💪', name: 'gym workout muscle bicep strength', cat: 'popular' },
  { emoji: '💧', name: 'water hydrate hydration drink', cat: 'popular' },
  { emoji: '📖', name: 'read book reading learning pages', cat: 'popular' },
  { emoji: '💻', name: 'code deep work laptop programming work', cat: 'popular' },
  { emoji: '🥗', name: 'clean diet salad food nutrition healthy', cat: 'popular' },
  { emoji: '🧘', name: 'meditation meditate yoga mindfulness zen', cat: 'popular' },
  { emoji: '🌙', name: 'sleep bedtime night recovery rest', cat: 'popular' },
  { emoji: '🏃', name: 'run running cardio marathon jog', cat: 'popular' },
  { emoji: '🎯', name: 'focus goal target discipline habits', cat: 'popular' },
  { emoji: '⚡', name: 'energy sprint deep work productivity power', cat: 'popular' },
  { emoji: '💰', name: 'save money finance cash budget wealth', cat: 'popular' },
  { emoji: '🚫', name: 'no quit break habit discipline stop', cat: 'popular' },
  { emoji: '🧊', name: 'cold plunge shower ice bath recovery', cat: 'popular' },
  { emoji: '✍️', name: 'journal journaling writing reflect diary', cat: 'popular' },

  // Fitness & Sports
  { emoji: '🏋️', name: 'weightlifting heavy lift bench squat deadlift barbell', cat: 'fitness' },
  { emoji: '🚴', name: 'cycle cycling bike biking cardio ride', cat: 'fitness' },
  { emoji: '🏊', name: 'swim swimming pool laps cardio', cat: 'fitness' },
  { emoji: '🥊', name: 'boxing punch fight sparring bag combat', cat: 'fitness' },
  { emoji: '🧗', name: 'climbing bouldering rock climb grip', cat: 'fitness' },
  { emoji: '🤸', name: 'calisthenics gymnastics stretch flexible', cat: 'fitness' },
  { emoji: '👟', name: 'walk 10k steps walking daily steps cardio', cat: 'fitness' },
  { emoji: '🥋', name: 'martial arts bjj karate judo grappling', cat: 'fitness' },
  { emoji: '🎾', name: 'tennis racket court sport game match', cat: 'fitness' },
  { emoji: '⚽', name: 'football soccer ball training drills match', cat: 'fitness' },
  { emoji: '🏀', name: 'basketball hoops court sport training', cat: 'fitness' },
  { emoji: '🏸', name: 'badminton shuttlecock racket sport', cat: 'fitness' },
  { emoji: '🛹', name: 'skate skateboard skateboarding skatepark', cat: 'fitness' },
  { emoji: '⏱️', name: 'hiit timer interval sprints circuit', cat: 'fitness' },
  { emoji: '🏆', name: 'pr trophy personal record win milestone champion', cat: 'fitness' },

  // Health & Nutrition
  { emoji: '🍎', name: 'apple fruit vitamin clean snack healthy', cat: 'nutrition' },
  { emoji: '🥑', name: 'avocado healthy fats keto clean food', cat: 'nutrition' },
  { emoji: '🥦', name: 'broccoli greens veggies vegetable micronutrients', cat: 'nutrition' },
  { emoji: '🥩', name: 'steak beef meat high protein carnivore', cat: 'nutrition' },
  { emoji: '🍳', name: 'eggs breakfast cooking protein cook', cat: 'nutrition' },
  { emoji: '🍌', name: 'banana preworkout carbs potassium energy', cat: 'nutrition' },
  { emoji: '🍵', name: 'green tea matcha herbal tea detox antioxidant', cat: 'nutrition' },
  { emoji: '☕', name: 'coffee black coffee espresso morning caffeine', cat: 'nutrition' },
  { emoji: '🥛', name: 'milk protein shake whey casein shake', cat: 'nutrition' },
  { emoji: '💊', name: 'supplements creatine vitamins medicine fish oil zinc', cat: 'nutrition' },
  { emoji: '🥕', name: 'carrot raw veggies carrots salad', cat: 'nutrition' },
  { emoji: '🫐', name: 'blueberries berries antioxidant superfood fruit', cat: 'nutrition' },
  { emoji: '🧂', name: 'electrolytes salt hydration minerals sodium', cat: 'nutrition' },
  { emoji: '🍱', name: 'meal prep lunch box cooking meal prep Sunday', cat: 'nutrition' },
  { emoji: '🥣', name: 'oats oatmeal porridge fiber breakfast', cat: 'nutrition' },
  { emoji: '🥜', name: 'nuts almonds peanut butter healthy snack', cat: 'nutrition' },

  // Work, Study & Focus
  { emoji: '📚', name: 'study books learning reading education exam', cat: 'productivity' },
  { emoji: '🧠', name: 'brain memory thinking neuro cognitive learning', cat: 'productivity' },
  { emoji: '💡', name: 'idea brainstorm innovation insight creative', cat: 'productivity' },
  { emoji: '📅', name: 'calendar plan schedule daily agenda timeblock', cat: 'productivity' },
  { emoji: '📝', name: 'todo list notes tasks check off planning', cat: 'productivity' },
  { emoji: '📈', name: 'growth metric analytics kpi business sales', cat: 'productivity' },
  { emoji: '💼', name: 'work career office job professional client', cat: 'productivity' },
  { emoji: '🎧', name: 'focus music podcast audio binaural beats deep', cat: 'productivity' },
  { emoji: '🚀', name: 'launch startup project ship momentum scale', cat: 'productivity' },
  { emoji: '⏳', name: 'pomodoro timer 25 min time management sprints', cat: 'productivity' },
  { emoji: '🛠️', name: 'build tool project repair create crafting', cat: 'productivity' },
  { emoji: '🔬', name: 'research science experiment lab analyze study', cat: 'productivity' },
  { emoji: '🗣️', name: 'language speech practice duolingo speaking public', cat: 'productivity' },
  { emoji: '🎨', name: 'design art draw painting creative UI UX', cat: 'productivity' },
  { emoji: '🎹', name: 'piano keyboard instrument practice play music', cat: 'productivity' },
  { emoji: '🎸', name: 'guitar chords practice instrument music play', cat: 'productivity' },

  // Mindset, Sleep & Wellness
  { emoji: '🕊️', name: 'peace gratitude calm prayer stillness soul', cat: 'mindset' },
  { emoji: '☀️', name: 'morning sun sunlight outdoor circadian light', cat: 'mindset' },
  { emoji: '🌅', name: 'sunrise early wake dawn 5am routine', cat: 'mindset' },
  { emoji: '🛌', name: 'bed sleep early 8 hours rest recharge', cat: 'mindset' },
  { emoji: '🌳', name: 'nature walk park green trees grounding forest', cat: 'mindset' },
  { emoji: '🌿', name: 'herbal fresh air breath nature calm', cat: 'mindset' },
  { emoji: '🕯️', name: 'evening candle relax wind down calm night', cat: 'mindset' },
  { emoji: '💖', name: 'self care love mental health empathy kindness', cat: 'mindset' },
  { emoji: '🫁', name: 'breath breathwork pranayama box breathing wim hof', cat: 'mindset' },
  { emoji: '📵', name: 'screen detox no phone offline digital detox', cat: 'mindset' },
  { emoji: '🚶', name: 'evening walk stroll stretch unwind step', cat: 'mindset' },
  { emoji: '🐾', name: 'pet dog walk puppy cat companion care', cat: 'mindset' },
  { emoji: '🫂', name: 'family call friends connection social relationship', cat: 'mindset' },
  { emoji: '🛁', name: 'bath soak hot epsom salts relaxation', cat: 'mindset' },
  { emoji: '🚿', name: 'shower hygiene cold rinse fresh clean', cat: 'mindset' },
  { emoji: '📿', name: 'rosary mantra meditation prayer spiritual bead', cat: 'mindset' },

  // Wealth & Finance
  { emoji: '💳', name: 'credit card no spend budget limit check', cat: 'wealth' },
  { emoji: '🏦', name: 'bank deposit emergency fund savings interest', cat: 'wealth' },
  { emoji: '💎', name: 'diamond net worth investments asset value', cat: 'wealth' },
  { emoji: '🪙', name: 'coins gold crypto bitcoin dollar cent', cat: 'wealth' },
  { emoji: '📊', name: 'chart financial review balance sheet cashflow', cat: 'wealth' },
  { emoji: '🧾', name: 'receipts invoices taxes expense log accounting', cat: 'wealth' },
  { emoji: '💵', name: 'cash income dollar money paid earnings', cat: 'wealth' },
  { emoji: '🏷️', name: 'coupon discounts save bargain sale frugal', cat: 'wealth' },
  { emoji: '🐖', name: 'piggy bank savings reserve wealth stash', cat: 'wealth' },

  // Break Bad Habits (Harm Reduction & Quitting)
  { emoji: '🚭', name: 'no smoking vape cigarette smoke nicotine quit', cat: 'breakHabits' },
  { emoji: '🍺', name: 'no alcohol sober beer wine drink partying quit', cat: 'breakHabits' },
  { emoji: '🍰', name: 'no sugar cake sweets dessert craving keto zero', cat: 'breakHabits' },
  { emoji: '🍫', name: 'no chocolate candy sweets sugar junk cravings', cat: 'breakHabits' },
  { emoji: '🍔', name: 'no junk food fast food mcdonalds clean eating', cat: 'breakHabits' },
  { emoji: '🍟', name: 'no fries fried food grease clean diet', cat: 'breakHabits' },
  { emoji: '🎮', name: 'no gaming video games screen limit discipline', cat: 'breakHabits' },
  { emoji: '📱', name: 'no doomscroll instagram tiktok social media limits', cat: 'breakHabits' },
  { emoji: '📺', name: 'no tv netflix binging screen time entertainment', cat: 'breakHabits' },
  { emoji: '🛋️', name: 'no lazy couch potato procrastination movement', cat: 'breakHabits' },
  { emoji: '💤', name: 'no snooze snooze button wake immediately alarm', cat: 'breakHabits' },
  { emoji: '🍿', name: 'no late night snacking snacks junk eating', cat: 'breakHabits' },

  // Lifestyle & Hygiene
  { emoji: '🧹', name: 'clean room tidy desk sweep chore vacuum', cat: 'lifestyle' },
  { emoji: '🪥', name: 'teeth brushing floss oral hygiene teeth', cat: 'lifestyle' },
  { emoji: '🧼', name: 'skincare wash face cleanse soap hygiene', cat: 'lifestyle' },
  { emoji: '🧺', name: 'laundry wash clothes clean wardrobe chore', cat: 'lifestyle' },
  { emoji: '🌱', name: 'plants water gardening flora care green', cat: 'lifestyle' },
  { emoji: '🛏️', name: 'make bed morning routine tidy bedroom discipline', cat: 'lifestyle' },
  { emoji: '🧴', name: 'sunscreen lotion skin moisturize care', cat: 'lifestyle' }
];

function renderAddHabitModal(container) {
  const colors = [
    '#38bdf8', // Cyan
    '#10b981', // Emerald
    '#14b8a6', // Teal
    '#6366f1', // Indigo
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#f59e0b', // Amber
    '#f97316', // Orange
    '#84cc16'  // Lime
  ];

  let selectedEmoji = '⏰';
  let selectedColor = colors[0];
  let activeEmojiTab = 'all';
  let emojiSearchQuery = '';

  container.innerHTML = `
    <div class="modal-card modal-card-wide">
      <div class="modal-header">
        <div class="modal-title-group">
          <h3 class="modal-title">✨ Create New Habit</h3>
          <span class="modal-subtitle">Track any routine with customized emoji, frequency, and time slot</span>
        </div>
        <button class="modal-close-btn">&times;</button>
      </div>

      <form id="add-habit-form" class="modal-form">
        <!-- Habit Name & Live Emoji Preview -->
        <div class="habit-name-row">
          <div class="emoji-live-preview-box" id="modal-emoji-preview" style="background: ${selectedColor}22; border-color: ${selectedColor}60;">
            <span class="preview-emoji-symbol">${selectedEmoji}</span>
          </div>

          <div class="form-group flex-1">
            <label>Habit Name <span class="text-rose">*</span></label>
            <input type="text" id="habit-name-input" placeholder="e.g. Wake up at 05:00, Cold Plunge, Read 20 pages..." required autofocus />
          </div>
        </div>

        <!-- Comprehensive 100+ Emoji Hub -->
        <div class="form-group emoji-hub-group">
          <div class="emoji-hub-header">
            <label>Choose Icon (100+ Curated Emojis or Type Custom)</label>
            <div class="custom-emoji-input-wrap">
              <span class="custom-label">Custom:</span>
              <input type="text" id="custom-emoji-input" placeholder="Type or paste any emoji (Win + .)" maxlength="4" />
            </div>
          </div>

          <!-- Emoji Category Filter Tabs -->
          <div class="emoji-cat-tabs" id="emoji-cat-tabs">
            <button type="button" class="emoji-cat-btn active" data-cat="all">🔥 All</button>
            <button type="button" class="emoji-cat-btn" data-cat="fitness">💪 Fitness</button>
            <button type="button" class="emoji-cat-btn" data-cat="nutrition">🥗 Diet</button>
            <button type="button" class="emoji-cat-btn" data-cat="productivity">⚡ Work</button>
            <button type="button" class="emoji-cat-btn" data-cat="mindset">🧘 Mindset</button>
            <button type="button" class="emoji-cat-btn" data-cat="wealth">💰 Money</button>
            <button type="button" class="emoji-cat-btn" data-cat="breakHabits">🚫 Quit</button>
            <button type="button" class="emoji-cat-btn" data-cat="lifestyle">🏠 Home</button>
          </div>

          <!-- Search Emojis Input -->
          <div class="emoji-search-bar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="emoji-search-input" placeholder="Search emojis (e.g. gym, water, sleep, code, tea)..." />
          </div>

          <!-- Scrollable Emoji Grid -->
          <div class="emoji-picker-scroll-grid" id="emoji-grid-container">
            <!-- Dynamically populated -->
          </div>
        </div>

        <!-- Category & Time Row -->
        <div class="form-row">
          <div class="form-group flex-1">
            <label>Routine Category</label>
            <select id="habit-cat-select" class="nexus-select">
              <option value="Morning">🌅 Morning Routine</option>
              <option value="Fitness">🏃 Exercise & Movement</option>
              <option value="Health">🥗 Health & Nutrition</option>
              <option value="Productivity">⚡ Deep Work & Study</option>
              <option value="Mindset">🧘 Mindfulness & Peace</option>
              <option value="Evening">🌙 Evening & Sleep</option>
              <option value="Lifestyle">✨ Daily Lifestyle</option>
              <option value="Discipline">🚫 Break Bad Habit</option>
            </select>
          </div>

          <div class="form-group flex-1">
            <label>Time Slot / Target</label>
            <input type="text" id="habit-time-input" placeholder="e.g. 05:00 AM, Post-Workout" value="06:00 AM" />
          </div>
        </div>

        <!-- Quick Time Presets -->
        <div class="time-presets-row">
          <span class="preset-label">Quick Times:</span>
          <button type="button" class="time-chip" data-time="05:00 AM">🌅 05:00 AM</button>
          <button type="button" class="time-chip" data-time="07:00 AM">☀️ 07:00 AM</button>
          <button type="button" class="time-chip" data-time="10:00 AM">⚡ 10:00 AM</button>
          <button type="button" class="time-chip" data-time="01:00 PM">🥗 01:00 PM</button>
          <button type="button" class="time-chip" data-time="05:30 PM">💪 05:30 PM</button>
          <button type="button" class="time-chip" data-time="10:30 PM">🌙 10:30 PM</button>
          <button type="button" class="time-chip" data-time="All Day">⭐ All Day</button>
        </div>

        <!-- Accent Colors -->
        <div class="form-group">
          <label>Accent Tag Color</label>
          <div class="color-picker-grid">
            ${colors.map((c, idx) => `
              <button type="button" class="color-opt-btn ${idx === 0 ? 'selected' : ''}" data-color="${c}" style="background: ${c};" title="Select color"></button>
            `).join('')}
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="nexus-btn btn-secondary modal-cancel-btn">Cancel</button>
          <button type="submit" class="nexus-btn btn-primary">Save & Add Habit</button>
        </div>
      </form>
    </div>
  `;

  const gridContainer = container.querySelector('#emoji-grid-container');
  const previewBox = container.querySelector('#modal-emoji-preview');
  const previewSymbol = container.querySelector('.preview-emoji-symbol');
  const customEmojiInput = container.querySelector('#custom-emoji-input');
  const searchInput = container.querySelector('#emoji-search-input');
  const timeInput = container.querySelector('#habit-time-input');

  function renderEmojiGrid() {
    let filtered = EMOJI_DATABASE;

    if (activeEmojiTab !== 'all') {
      filtered = filtered.filter(item => item.cat === activeEmojiTab);
    }

    if (emojiSearchQuery.trim() !== '') {
      const q = emojiSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => item.name.includes(q) || item.emoji.includes(q));
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = `<div class="empty-emoji-msg">No emoji found. Type any custom emoji in the field above!</div>`;
      return;
    }

    gridContainer.innerHTML = filtered.map(item => `
      <button type="button" class="emoji-opt-btn ${item.emoji === selectedEmoji ? 'selected' : ''}" data-emoji="${item.emoji}" title="${item.name}">
        ${item.emoji}
      </button>
    `).join('');

    // Attach click handlers to rendered emojis
    gridContainer.querySelectorAll('.emoji-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        gridContainer.querySelectorAll('.emoji-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedEmoji = btn.dataset.emoji;
        if (customEmojiInput) customEmojiInput.value = '';
        updatePreview();
        sounds.playPop();
      });
    });
  }

  function updatePreview() {
    if (previewSymbol) previewSymbol.textContent = selectedEmoji;
    if (previewBox) {
      previewBox.style.background = `${selectedColor}22`;
      previewBox.style.borderColor = `${selectedColor}60`;
    }
  }

  renderEmojiGrid();

  // Category tab switching
  container.querySelectorAll('.emoji-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.emoji-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeEmojiTab = btn.dataset.cat;
      renderEmojiGrid();
      sounds.playPop();
    });
  });

  // Search input live filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      emojiSearchQuery = e.target.value;
      renderEmojiGrid();
    });
  }

  // Custom emoji typing or pasting
  if (customEmojiInput) {
    customEmojiInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        selectedEmoji = val;
        updatePreview();
        gridContainer.querySelectorAll('.emoji-opt-btn').forEach(b => b.classList.remove('selected'));
      }
    });
  }

  // Quick time preset chips
  container.querySelectorAll('.time-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (timeInput) timeInput.value = chip.dataset.time;
      sounds.playPop();
    });
  });

  // Color picker
  container.querySelectorAll('.color-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.color-opt-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedColor = btn.dataset.color;
      updatePreview();
      sounds.playPop();
    });
  });

  // Form submission
  const form = container.querySelector('#add-habit-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#habit-name-input').value;
    const category = container.querySelector('#habit-cat-select').value;
    const timeOfDay = container.querySelector('#habit-time-input').value;

    store.addHabit({
      name,
      emoji: selectedEmoji,
      category,
      color: selectedColor,
      timeOfDay
    });

    sounds.playLevelUp();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
    window.dispatchEvent(new CustomEvent('close-modal'));
  });

  attachModalCloseHandlers(container);
}




function attachModalCloseHandlers(container) {
  const closeBtns = container.querySelectorAll('.modal-close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('close-modal'));
      sounds.playPop();
    });
  });

  const cancelBtns = container.querySelectorAll('.modal-cancel-btn');
  cancelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('close-modal'));
      sounds.playPop();
    });
  });
}

// ==========================================================================
// 1. Global Preferences & Settings Modal
// ==========================================================================
function renderSettingsModal(container) {
  const data = store.data;
  const s = data.settings || {};
  const stats = store.getStorageStats();

  container.innerHTML = `
    <div class="modal-card modal-card-wide animate-scale">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <span class="modal-header-icon">⚙️</span>
          <div>
            <h2 class="modal-title">Global Settings & Preferences</h2>
            <p class="modal-subtitle">Localization for international users • Zero cloud tracking • 100% Offline</p>
          </div>
        </div>
        <button class="modal-close-btn" title="Close (Esc)">✕</button>
      </div>

      <div class="modal-body">
        <div class="settings-grid">
          
          <!-- Localization & Formats -->
          <div class="settings-card-section">
            <div class="settings-section-title">🌍 International Formats & Units</div>
            



            <!-- Week Start Day -->
            <div class="settings-row">
              <div class="settings-label-wrap">
                <span class="settings-label-title">First Day of Week</span>
                <span class="settings-label-desc">Monday (ISO / Europe / Asia standard) vs Sunday (US standard)</span>
              </div>
              <div class="segmented-control" id="setting-week-segment">
                <button class="segmented-btn ${s.weekStart === 'Mo' ? 'active' : ''}" data-val="Mo">Monday</button>
                <button class="segmented-btn ${s.weekStart === 'Su' ? 'active' : ''}" data-val="Su">Sunday</button>
              </div>
            </div>

            <!-- Clock Format -->
            <div class="settings-row">
              <div class="settings-label-wrap">
                <span class="settings-label-title">Digital Clock Time</span>
                <span class="settings-label-desc">12-Hour AM/PM standard vs 24-Hour Military standard</span>
              </div>
              <div class="segmented-control" id="setting-clock-segment">
                <button class="segmented-btn ${s.clockFormat === '12h' ? 'active' : ''}" data-val="12h">12-Hour (AM/PM)</button>
                <button class="segmented-btn ${s.clockFormat === '24h' ? 'active' : ''}" data-val="24h">24-Hour (23:59)</button>
              </div>
            </div>

          </div>

          <!-- Aesthetic Theme -->
          <div class="settings-card-section">
            <div class="settings-section-title">🎨 Aesthetic Theme Presets</div>
            <div class="theme-options-grid">
              
              <div class="theme-option-btn ${s.theme === 'cyberpunk' || !s.theme ? 'active' : ''}" data-theme="cyberpunk">
                <div class="theme-swatch-circle" style="background: linear-gradient(135deg, #070a12 0%, #06b6d4 100%);"></div>
                <span style="font-size: 12px; font-weight: 700;">Cyberpunk Obsidian</span>
                <span style="font-size: 10px; color: var(--text-muted);">Neon Cyan & Emerald</span>
              </div>

              <div class="theme-option-btn ${s.theme === 'oled' ? 'active' : ''}" data-theme="oled">
                <div class="theme-swatch-circle" style="background: #000000; border-color: #333;"></div>
                <span style="font-size: 12px; font-weight: 700;">Pure OLED Black</span>
                <span style="font-size: 10px; color: var(--text-muted);">0-Lumen Pitch Black</span>
              </div>

              <div class="theme-option-btn ${s.theme === 'midnight' ? 'active' : ''}" data-theme="midnight">
                <div class="theme-swatch-circle" style="background: linear-gradient(135deg, #090714 0%, #a855f7 100%);"></div>
                <span style="font-size: 12px; font-weight: 700;">Tokyo Midnight</span>
                <span style="font-size: 10px; color: var(--text-muted);">Violet & Indigo Glow</span>
              </div>

              <div class="theme-option-btn ${s.theme === 'titanium' ? 'active' : ''}" data-theme="titanium">
                <div class="theme-swatch-circle" style="background: linear-gradient(135deg, #0c0e12 0%, #cbd5e1 100%);"></div>
                <span style="font-size: 12px; font-weight: 700;">Titanium Minimalist</span>
                <span style="font-size: 10px; color: var(--text-muted);">Frosted Monochrome</span>
              </div>

              <div class="theme-option-btn ${s.theme === 'copper' ? 'active' : ''}" data-theme="copper">
                <div class="theme-swatch-circle" style="background: linear-gradient(135deg, #18120e 0%, #f97316 100%); border-color: #f97316;"></div>
                <span style="font-size: 12px; font-weight: 700;">Sunset Copper</span>
                <span style="font-size: 10px; color: var(--text-muted);">Amber & Ember Luxury</span>
              </div>

            </div>
          </div>

          </div>

          <!-- Physical Backup & Offline Storage Stats -->
          <div class="settings-card-section">
            <div class="settings-section-title">🔒 Physical Backup & Offline Storage</div>
            
            <div class="settings-row">
              <div class="settings-label-wrap">
                <span class="settings-label-title">Hardware Storage Used</span>
                <span class="settings-label-desc">${stats.kb} KB of ${stats.maxKB} KB quota used (${stats.pct}%) • 25+ years capacity</span>
              </div>
              <span class="badge font-mono" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
                OFFLINE SECURE
              </span>
            </div>

            <div class="settings-row" style="flex-wrap: wrap;">
              <button class="btn btn-secondary" id="btn-export-json" style="font-size: 12px;">
                <span>📥 Export Backup JSON</span>
              </button>
              
              <label class="btn btn-secondary" style="font-size: 12px; cursor: pointer; margin: 0;">
                <span>📤 Restore Backup JSON</span>
                <input type="file" id="file-import-json" accept=".json" style="display: none;" />
              </label>

              <button class="btn btn-secondary" id="btn-reset-app" style="font-size: 12px; color: #f43f5e; border-color: rgba(244, 63, 94, 0.3);">
                <span>⚠️ Reset Defaults</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary modal-cancel-btn">Close</button>
        <button class="btn btn-primary" id="btn-save-settings">
          <span>✓ Save Preferences</span>
        </button>
      </div>
    </div>
  `;





  // Week Segment
  const weekSegment = container.querySelector('#setting-week-segment');
  if (weekSegment) {
    weekSegment.addEventListener('click', (e) => {
      const btn = e.target.closest('.segmented-btn');
      if (!btn) return;
      weekSegment.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      store.updateSettings({ weekStart: btn.dataset.val });
      sounds.playPop();
    });
  }

  // Clock Segment
  const clockSegment = container.querySelector('#setting-clock-segment');
  if (clockSegment) {
    clockSegment.addEventListener('click', (e) => {
      const btn = e.target.closest('.segmented-btn');
      if (!btn) return;
      clockSegment.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      store.updateSettings({ clockFormat: btn.dataset.val });
      sounds.playPop();
    });
  }

  // Theme Presets
  const themeButtons = container.querySelectorAll('.theme-option-btn');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const chosenTheme = btn.dataset.theme;
      store.updateSettings({ theme: chosenTheme });
      document.body.setAttribute('data-theme', chosenTheme);
      sounds.playPop();
    });
  });



  // Export JSON
  const exportBtn = container.querySelector('#btn-export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const json = store.exportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus-os-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      sounds.playStreak();
    });
  }

  // Import JSON
  const importInput = container.querySelector('#file-import-json');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = store.importJSON(event.target.result);
        if (success) {
          confetti({ particleCount: 70, spread: 60 });
          sounds.playStreak();
          window.dispatchEvent(new CustomEvent('close-modal'));
        } else {
          alert('Invalid backup JSON file.');
        }
      };
      reader.readAsText(file);
    });
  }

  // Reset defaults
  const resetBtn = container.querySelector('#btn-reset-app');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all habits and transactions to factory defaults?')) {
        store.resetToDefault();
        sounds.playPop();
        window.dispatchEvent(new CustomEvent('close-modal'));
      }
    });
  }

  // Save / Close
  const saveBtn = container.querySelector('#btn-save-settings');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      sounds.playCheck();
      window.dispatchEvent(new CustomEvent('close-modal'));
    });
  }

  attachModalCloseHandlers(container);
}



// ==========================================================================
// 3. Viral Social Streak "Brag Card" Generator Modal
// ==========================================================================
function renderShareStreakModal(container) {
  const data = store.data;
  
  // Calculate best active streak and completion rate
  let maxActiveStreak = 0;
  const habits = data.habits || [];
  const totalHabits = habits.length;
  let completedTodayCount = 0;
  const today = new Date().getDate();
  const monthKey = store.getMonthKey();

  habits.forEach(h => {
    const streak = store.getHabitStreak(h.id);
    const sVal = typeof streak === 'object' ? (streak.current || 0) : (parseInt(streak) || 0);
    if (sVal > maxActiveStreak) maxActiveStreak = sVal;
    if (h.checks && h.checks[monthKey] && h.checks[monthKey][today]) {
      completedTodayCount++;
    }
  });

  const todayRate = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 100;
  const displayStreak = Math.max(maxActiveStreak, 1);

  container.innerHTML = `
    <div class="modal-card modal-card-wide animate-scale">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <span class="modal-header-icon">📸</span>
          <div>
            <h2 class="modal-title">Share Your Streak (Viral Brag Card)</h2>
            <p class="modal-subtitle">High-resolution card optimized for Twitter/X, Instagram Stories, WhatsApp & LinkedIn</p>
          </div>
        </div>
        <button class="modal-close-btn" title="Close (Esc)">✕</button>
      </div>

      <div class="modal-body">
        <div class="share-streak-wrap">
          
          <!-- Canvas Container -->
          <div class="share-canvas-container">
            <canvas id="streak-brag-canvas" width="1200" height="675"></canvas>
          </div>

          <div id="share-copy-toast" style="display: none; font-size: 13px; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.12); padding: 8px 18px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.3); text-align: center;">
            ✓ Copied high-res image to clipboard! Ready to paste directly into WhatsApp, Twitter/X, or Instagram.
          </div>

        </div>
      </div>

      <!-- Action buttons unified & properly aligned -->
      <div class="modal-footer share-modal-footer">
        <button class="nexus-btn btn-primary" id="btn-download-streak-card">
          <span>⬇️</span> Download PNG Image
        </button>
        <button class="nexus-btn btn-secondary" id="btn-copy-streak-card">
          <span>📋</span> Copy to Clipboard
        </button>
        <button class="nexus-btn btn-secondary modal-cancel-btn">
          <span>✕</span> Close
        </button>
      </div>
    </div>
  `;

  // Draw the high-resolution canvas
  const canvas = container.querySelector('#streak-brag-canvas');
  if (canvas) {
    drawStreakCard(canvas, {
      userName: data.user.name || 'Soham',
      streakDays: displayStreak,
      todayRate,
      habits: habits.slice(0, 6)
    });
  }

  // Safe Download Button via Blob & object URL
  const dlBtn = container.querySelector('#btn-download-streak-card');
  if (dlBtn && canvas) {
    dlBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            const link = document.createElement('a');
            link.download = `axio-streak-${displayStreak}-days.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `axio-streak-${displayStreak}-days.png`;
            link.href = url;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              if (document.body.contains(link)) document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }, 1200);
          }
          if (sounds && typeof sounds.playStreak === 'function') {
            sounds.playStreak();
          } else if (sounds && typeof sounds.playPop === 'function') {
            sounds.playPop();
          }
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        }, 'image/png');
      } catch (err) {
        console.warn('Canvas export notice', err);
      }
    });
  }

  // Copy to Clipboard
  const copyBtn = container.querySelector('#btn-copy-streak-card');
  const toast = container.querySelector('#share-copy-toast');
  if (copyBtn && canvas) {
    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            sounds.playCheck();
            if (toast) {
              toast.style.display = 'inline-block';
              setTimeout(() => { toast.style.display = 'none'; }, 3500);
            }
          } catch (clipErr) {
            console.warn('Clipboard write API blocked, fallback to download', clipErr);
            if (dlBtn) dlBtn.click();
          }
        }, 'image/png');
      } catch (err) {
        console.warn('Clipboard notice', err);
        if (dlBtn) dlBtn.click();
      }
    });
  }

  attachModalCloseHandlers(container);
}

// Canvas Painting Helper for 1200x675 Brag Card
function drawStreakCard(canvas, info) {
  const ctx = canvas.getContext('2d');
  const W = 1200;
  const H = 675;

  // Background Dark Mesh
  ctx.fillStyle = '#06080f';
  ctx.fillRect(0, 0, W, H);

  // Radial Cyan Glow (Top Left)
  const grad1 = ctx.createRadialGradient(150, 100, 10, 150, 100, 450);
  grad1.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
  grad1.addColorStop(1, 'transparent');
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, W, H);

  // Radial Violet Glow (Bottom Right)
  const grad2 = ctx.createRadialGradient(1050, 550, 10, 1050, 550, 450);
  grad2.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
  grad2.addColorStop(1, 'transparent');
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, W, H);

  // Subtle Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  // Brand Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('⚡ AXIO OS', 70, 95);

  ctx.fillStyle = '#64748b';
  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillText('DAILY HABITS & RHYTHM', 70, 122);

  // Verified Pill (Top Right)
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.fillRect(W - 320, 75, 240, 38);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.strokeRect(W - 320, 75, 240, 38);

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.fillText('✓ 100% DISCIPLINE VERIFIED', W - 300, 100);

  // Big Streak Highlight (Center Top)
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 74px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`🔥 ${info.streakDays}-DAY UNBROKEN CHAIN`, 70, 240);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Today's Completion: ${info.todayRate}% • Daily Consistency Protocol Active`, 75, 280);

  // Habit Grid Showcase (Middle Section)
  const habits = info.habits || [];
  const startY = 330;
  const colW = 510;

  habits.forEach((h, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 70 + (col * (colW + 40));
    const y = startY + (row * 65);

    // Pill background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(x, y, colW, 52);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(x, y, colW, 52);

    // Left color bar
    ctx.fillStyle = h.color || '#38bdf8';
    ctx.fillRect(x, y, 5, 52);

    // Cleanse any legacy gym / workout terminology
    let cleanName = (h.name || 'Daily Routine')
      .replace(/gym\s*\/\s*iron\s*workout/i, 'Morning Movement & Exercise')
      .replace(/iron\s*workout/i, 'Morning Movement')
      .replace(/\bgym\b/i, 'Movement');
    let cleanEmoji = (cleanName.includes('Morning Movement') || cleanName.includes('Movement') || h.emoji === '💪') ? '🏃' : (h.emoji || '⭐');

    // Emoji + Name
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${cleanEmoji}  ${cleanName}`, x + 20, y + 33);

    // Status Check
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText('✓ ACTIVE', x + colW - 95, y + 32);
  });

  // Footer Section
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fillRect(70, H - 100, W - 140, 52);

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`✓ ${info.userName} • Consistency Score: ${info.todayRate}% • Daily Habits Tracked`, 95, H - 68);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.fillText('AXIO OS • 100% Free & Private • Stored Locally on PC', W - 530, H - 68);
}

// ==========================================================================
// 4. Instant PC <-> Phone Sync Modal (Zero Server Cost, User Device Memory)
// ==========================================================================
function renderPhoneSyncModal(container) {
  const dataJson = store.exportJSON();
  const compressed = LZString.compressToEncodedURIComponent(dataJson);
  const syncUrl = `${window.location.origin}${window.location.pathname}#sync=${compressed}`;

  container.innerHTML = `
    <div class="modal-card modal-card-wide animate-scale">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <span class="modal-header-icon">📱</span>
          <div>
            <h2 class="modal-title">Sync with Phone (Offline & Instant)</h2>
            <p class="modal-subtitle">Stored 100% on your own device memory • Zero database bills • No accounts needed</p>
          </div>
        </div>
        <button class="modal-close-btn" title="Close (Esc)">✕</button>
      </div>

      <div class="modal-body">
        <div class="phone-sync-container">
          
          <div class="qr-canvas-box">
            <canvas id="phone-sync-qr-canvas"></canvas>
            <span class="qr-scan-badge">📷 SCAN WITH PHONE CAMERA</span>
          </div>

          <div class="phone-sync-info">
            <h3 style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 6px;">How to track on your phone:</h3>
            <ol style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; padding-left: 18px; margin-bottom: 16px;">
              <li>Open your phone's <strong>Camera</strong> app.</li>
              <li>Point it at the QR code on the screen and tap the link banner.</li>
              <li>Your phone opens the app with all your habits, streaks, and data already loaded!</li>
            </ol>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="nexus-btn btn-primary" id="btn-copy-sync-link" style="font-size: 12.5px;">
                <span>🔗 Copy Sync Link to Clipboard</span>
              </button>

              <a class="nexus-btn btn-secondary" id="btn-share-whatsapp" target="_blank" style="font-size: 12.5px; text-decoration: none; justify-content: center;"
                href="https://api.whatsapp.com/send?text=${encodeURIComponent('Open your NEXUS OS sync link: ' + syncUrl)}">
                <span>💬 Send Link to My WhatsApp</span>
              </a>
            </div>

            <div id="sync-copy-toast" style="display: none; font-size: 12px; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.12); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.3); margin-top: 10px; text-align: center;">
              ✓ Sync Link Copied! Send it to yourself or open on your phone browser.
            </div>
          </div>

        </div>
      </div>

      <div class="modal-footer" style="display: flex; justify-content: flex-end; padding-top: 14px; border-top: 1px solid var(--border-subtle); margin-top: 16px;">
        <button class="nexus-btn btn-secondary modal-cancel-btn">Close</button>
      </div>
    </div>
  `;

  // Draw QR code onto canvas
  const canvas = container.querySelector('#phone-sync-qr-canvas');
  if (canvas) {
    QRCode.toCanvas(canvas, syncUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }, (err) => {
      if (err) console.warn('QR code generation notice', err);
    });
  }

  // Copy sync link listener
  const copyBtn = container.querySelector('#btn-copy-sync-link');
  const toast = container.querySelector('#sync-copy-toast');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(syncUrl).then(() => {
        sounds.playCheck();
        if (toast) {
          toast.style.display = 'block';
          setTimeout(() => { toast.style.display = 'none'; }, 3500);
        }
      });
    });
  }

  attachModalCloseHandlers(container);
}
