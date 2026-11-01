// AXIO OS - Central State Store & Dual-Snapshot Offline Persistence Layer

export class Store {
  constructor() {
    this.STORAGE_KEY = 'axio_os_data_v1';
    this.BACKUP_KEY = 'axio_os_backup_snapshot';
    this.listeners = [];
    this.data = this.loadData();
  }

  getDefaultData() {
    // Current date reference (2026-10-31)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const todayDay = now.getDate();

    // Generate sample check completions for the current month
    const habit1Checks = {};
    const habit2Checks = {};
    const habit3Checks = {};
    const habit4Checks = {};
    const habit5Checks = {};
    const habit6Checks = {};
    const habit7Checks = {};
    const habit8Checks = {};

    // Mark active habit streaks for the last 14 days
    for (let d = 1; d <= todayDay; d++) {
      if (d % 6 !== 0) habit1Checks[d] = true; // Wake up at 5am
      if (d % 2 === 1) habit2Checks[d] = true; // Morning movement
      if (d > 5) habit3Checks[d] = true;       // Drink 3L water
      if (d % 3 !== 0) habit4Checks[d] = true; // Read 20 pages
      if (d > 8) habit5Checks[d] = true;       // Code / Deep work
      if (d % 4 !== 0) habit6Checks[d] = true; // Clean Diet / No Junk
      if (d > 10) habit7Checks[d] = true;      // 10m Meditation
      if (d % 5 !== 0) habit8Checks[d] = true; // Sleep by 11 PM
    }

    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    return {
      selectedYear: currentYear,
      selectedMonth: currentMonth, // 0 to 11
      user: {
        name: 'Soham',
        xp: 2450,
        characterClass: 'Discipline Master'
      },
      settings: {
        weekStart: 'Mo',
        clockFormat: '12h',
        theme: 'cyberpunk',
        sound: true
      },
      focus: {
        sessionsToday: 0,
        totalMinutesToday: 0,
        lifetimeSessions: 0,
        lastSessionDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`
      },
      habits: [
        {
          id: 'h1',
          name: 'Wake up at 05:00',
          emoji: '⏰',
          category: 'Morning',
          color: '#38bdf8',
          timeOfDay: '05:00 AM',
          checks: { [monthKey]: habit1Checks }
        },
        {
          id: 'h2',
          name: 'Morning Movement & Exercise',
          emoji: '🏃',
          category: 'Health',
          color: '#10b981',
          timeOfDay: '07:00 AM',
          checks: { [monthKey]: habit2Checks }
        },
        {
          id: 'h3',
          name: 'Drink 3.5L Pure Water',
          emoji: '💧',
          category: 'Health',
          color: '#06b6d4',
          timeOfDay: 'All Day',
          checks: { [monthKey]: habit3Checks }
        },
        {
          id: 'h4',
          name: 'Read 20 Pages',
          emoji: '📖',
          category: 'Mindset',
          color: '#a855f7',
          timeOfDay: '02:00 PM',
          checks: { [monthKey]: habit4Checks }
        },
        {
          id: 'h5',
          name: '2h Deep Work / Coding',
          emoji: '💻',
          category: 'Productivity',
          color: '#6366f1',
          timeOfDay: '10:00 AM',
          checks: { [monthKey]: habit5Checks }
        },
        {
          id: 'h6',
          name: 'Clean Diet & High Protein',
          emoji: '🥗',
          category: 'Health',
          color: '#22c55e',
          timeOfDay: 'All Day',
          checks: { [monthKey]: habit6Checks }
        },
        {
          id: 'h7',
          name: '15m Mindfulness & Breathwork',
          emoji: '🧘',
          category: 'Mindset',
          color: '#ec4899',
          timeOfDay: '08:00 PM',
          checks: { [monthKey]: habit7Checks }
        },
        {
          id: 'h8',
          name: 'In Bed by 10:45 PM',
          emoji: '🌙',
          category: 'Evening',
          color: '#f59e0b',
          timeOfDay: '10:45 PM',
          checks: { [monthKey]: habit8Checks }
        }
      ],
      lastActiveDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`
    };
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) || localStorage.getItem('nexus_prime_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.migrateSettings(parsed);
        return parsed;
      }
      // Check secondary redundant snapshot if primary key is absent
      const backup = localStorage.getItem(this.BACKUP_KEY) || localStorage.getItem('nexus_prime_backup_snapshot');
      if (backup) {
        const parsed = JSON.parse(backup);
        this.migrateSettings(parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved state, checking redundant snapshot', e);
      try {
        const backup = localStorage.getItem(this.BACKUP_KEY) || localStorage.getItem('nexus_prime_backup_snapshot');
        if (backup) {
          const parsed = JSON.parse(backup);
          this.migrateSettings(parsed);
          return parsed;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const defaultData = this.getDefaultData();
    this.saveData(defaultData);
    return defaultData;
  }

  migrateSettings(data) {
    let changed = false;
    if (!data.settings) {
      data.settings = {};
      changed = true;
    }
    const defaultSettings = {
      weekStart: 'Mo',
      clockFormat: '12h',
      theme: 'cyberpunk',
      sound: true
    };
    for (const k in defaultSettings) {
      if (data.settings[k] === undefined) {
        data.settings[k] = defaultSettings[k];
        changed = true;
      }
    }
    if (!data.focus) {
      data.focus = {
        sessionsToday: 0,
        totalMinutesToday: 0,
        lifetimeSessions: 0,
        lastSessionDate: data.lastActiveDate || ''
      };
      changed = true;
    }
    if (!data.lastActiveDate) {
      if (data.gym && data.gym.lastActiveDate) {
        data.lastActiveDate = data.gym.lastActiveDate;
      } else {
        const now = new Date();
        data.lastActiveDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      }
      changed = true;
    }

    // Auto-clean any legacy habits containing gym or workout
    if (data.habits && Array.isArray(data.habits)) {
      data.habits.forEach(h => {
        if (h.name && (h.name.toLowerCase().includes('gym') || h.name.toLowerCase().includes('workout') || h.name.toLowerCase().includes('iron'))) {
          h.name = 'Morning Movement & Exercise';
          h.emoji = '🏃';
          h.category = 'Health';
          changed = true;
        }
      });
    }

    // Scrub any legacy workout/expense data blocks
    if (data.gym) {
      delete data.gym;
      changed = true;
    }
    if (data.expenses) {
      delete data.expenses;
      changed = true;
    }

    if (changed) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem('nexus_prime_backup_snapshot', JSON.stringify(data));
      } catch (e) {}
    }
  }

  checkDailyReset() {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (!this.data.lastActiveDate) {
      this.data.lastActiveDate = todayStr;
      this.saveData();
      return;
    }
    if (this.data.lastActiveDate !== todayStr) {
      this.data.lastActiveDate = todayStr;
      this.data.selectedYear = now.getFullYear();
      this.data.selectedMonth = now.getMonth();
      if (this.data.focus) {
        this.data.focus.sessionsToday = 0;
        this.data.focus.totalMinutesToday = 0;
        this.data.focus.lastSessionDate = todayStr;
      }
      this.saveData();
      this.notify('day_rolled_over');
    }
  }

  recordFocusSession(minutes, habitId = null) {
    if (!this.data.focus) {
      this.data.focus = { sessionsToday: 0, totalMinutesToday: 0, lifetimeSessions: 0, lastSessionDate: '' };
    }
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (this.data.focus.lastSessionDate !== todayStr) {
      this.data.focus.sessionsToday = 0;
      this.data.focus.totalMinutesToday = 0;
      this.data.focus.lastSessionDate = todayStr;
    }
    this.data.focus.sessionsToday = (this.data.focus.sessionsToday || 0) + 1;
    this.data.focus.totalMinutesToday = (this.data.focus.totalMinutesToday || 0) + minutes;
    this.data.focus.lifetimeSessions = (this.data.focus.lifetimeSessions || 0) + 1;

    // Award 50 XP
    this.addXP(50, `Completed ${minutes}m Focus Session`);

    // Auto-complete linked habit if provided and not yet checked for today
    if (habitId) {
      const todayDay = now.getDate();
      const monthKey = this.getMonthKey(now.getFullYear(), now.getMonth());
      const habit = this.data.habits.find(h => h.id === habitId);
      if (habit) {
        if (!habit.checks) habit.checks = {};
        if (!habit.checks[monthKey]) habit.checks[monthKey] = {};
        if (!habit.checks[monthKey][todayDay]) {
          this.toggleHabitDay(habitId, todayDay, monthKey);
        }
      }
    }
    this.saveData();
    this.notify('focus_session_completed', { minutes, habitId });
  }

  saveData(dataToSave = this.data) {
    try {
      const json = JSON.stringify(dataToSave);
      localStorage.setItem(this.STORAGE_KEY, json);
      // Dual-layer persistence: write snapshot to protect against accidental browser corruption
      localStorage.setItem(this.BACKUP_KEY, json);
    } catch (e) {
      console.error('Storage quota or error', e);
    }
  }

  getStorageStats() {
    try {
      const json = localStorage.getItem(this.STORAGE_KEY) || '';
      const bytes = new Blob([json]).size;
      const kb = (bytes / 1024).toFixed(1);
      const maxKB = 5120; // 5 MB typical browser quota
      const pct = Math.min(100, ((bytes / (maxKB * 1024)) * 100).toFixed(2));
      return {
        bytes,
        kb,
        maxKB,
        pct,
        yearsRemaining: Math.max(25, Math.floor((maxKB - parseFloat(kb)) / 35))
      };
    } catch (e) {
      return { bytes: 0, kb: '0', maxKB: 5120, pct: '0', yearsRemaining: 30 };
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(event, meta = {}) {
    this.saveData();
    this.listeners.forEach(cb => cb(this.data, event, meta));
  }

  // --- XP & Level System ---
  addXP(amount, reason = '') {
    const oldLevel = this.getLevelInfo().level;
    this.data.user.xp = Math.max(0, (this.data.user.xp || 0) + amount);
    const newLevel = this.getLevelInfo().level;
    let leveledUp = false;
    if (newLevel > oldLevel) {
      leveledUp = true;
    }
    this.notify('xp_changed', { amount, reason, leveledUp, newLevel });
    return { leveledUp, newLevel };
  }

  getLevelInfo() {
    const xp = this.data.user.xp || 0;
    const level = Math.floor(xp / 350) + 1;
    const currentLevelBaseXP = (level - 1) * 350;
    const nextLevelXP = level * 350;
    const progressInLevel = xp - currentLevelBaseXP;
    const neededInLevel = 350;
    const percent = Math.min(100, Math.round((progressInLevel / neededInLevel) * 100));

    const titles = [
      'Cadet', 'Novice', 'Iron Will', 'Striker', 'Vanguard',
      'Centurion', 'Spartan', 'Discipline Master', 'Apex Sovereign', 'Mythic Ascendant'
    ];
    const title = titles[Math.min(titles.length - 1, level - 1)] || 'Titan';

    return {
      level,
      title,
      currentXP: xp,
      progressInLevel,
      neededInLevel,
      percent
    };
  }

  // --- Habits Matrix Methods ---
  getMonthKey(year = this.data.selectedYear, month = this.data.selectedMonth) {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
  }

  setSelectedMonthYear(year, month) {
    this.data.selectedYear = year;
    this.data.selectedMonth = month;
    this.notify('month_year_changed');
  }

  toggleHabitDay(habitId, dayNumber, customMonthKey = null) {
    const monthKey = customMonthKey || this.getMonthKey();
    const habit = this.data.habits.find(h => h.id === habitId);
    if (!habit) return;

    if (!habit.checks) habit.checks = {};
    if (!habit.checks[monthKey]) habit.checks[monthKey] = {};

    const currentlyChecked = !!habit.checks[monthKey][dayNumber];
    if (currentlyChecked) {
      delete habit.checks[monthKey][dayNumber];
      this.addXP(-25, 'Uncheck habit');
      this.notify('habit_toggled', { habitId, dayNumber, monthKey, checked: false });
    } else {
      habit.checks[monthKey][dayNumber] = true;
      this.addXP(25, `Completed: ${habit.name}`);
      this.notify('habit_toggled', { habitId, dayNumber, monthKey, checked: true });
    }
  }

  addHabit({ name, emoji, category, color, timeOfDay }) {
    const newHabit = {
      id: 'h_' + Date.now(),
      name: name.trim(),
      emoji: emoji || '⭐',
      category: category || 'General',
      color: color || '#38bdf8',
      timeOfDay: timeOfDay || 'Anytime',
      checks: {}
    };
    this.data.habits.push(newHabit);
    this.addXP(50, 'Created new habit');
    this.notify('habit_added', { habit: newHabit });
  }

  deleteHabit(habitId) {
    this.data.habits = this.data.habits.filter(h => h.id !== habitId);
    this.notify('habit_deleted', { habitId });
  }

  getHabitStreak(habitId, targetYear = this.data.selectedYear, targetMonth = this.data.selectedMonth) {
    const habit = this.data.habits.find(h => h.id === habitId);
    if (!habit || !habit.checks) return 0;

    const now = new Date();
    const isCurrent = (now.getFullYear() === targetYear && now.getMonth() === targetMonth);
    const monthKey = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
    const checks = habit.checks[monthKey] || {};

    let streak = 0;
    if (isCurrent) {
      const today = now.getDate();
      let checkDay = today;
      if (!checks[checkDay]) {
        checkDay = today - 1;
      }
      while (checkDay > 0 && checks[checkDay]) {
        streak++;
        checkDay--;
      }
    } else {
      // For historical/other months: calculate maximum consecutive streak in that month
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      let currentSeq = 0;
      let maxSeq = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        if (checks[d]) {
          currentSeq++;
          if (currentSeq > maxSeq) maxSeq = currentSeq;
        } else {
          currentSeq = 0;
        }
      }
      streak = maxSeq;
    }

    return streak;
  }

  updateSettings(partialSettings) {
    if (!this.data.settings) this.data.settings = {};
    this.data.settings = { ...this.data.settings, ...partialSettings };
    this.saveData();
    this.notify('settings_updated', { settings: this.data.settings });
  }



  // --- Reset & Import/Export ---
  resetToDefault() {
    this.data = this.getDefaultData();
    this.saveData();
    this.notify('reset');
  }

  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.habits) {
        this.data = parsed;
        this.saveData();
        this.notify('imported');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}

export const store = new Store();
