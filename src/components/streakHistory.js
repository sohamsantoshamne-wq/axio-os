import { store } from '../store.js';
import { sounds } from '../audio.js';

export function renderStreakHistory(container) {
  const data = store.data;
  const currentYear = data.selectedYear;
  const currentMonth = data.selectedMonth;

  const now = new Date();
  const isCurrentMonth = now.getFullYear() === currentYear && now.getMonth() === currentMonth;
  const todayDay = now.getDate();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthKey = store.getMonthKey(currentYear, currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate day-by-day stats
  const habits = data.habits || [];
  const totalHabits = habits.length;

  let totalCompletions = 0;
  let activeDaysCount = 0;
  const dayStats = {};

  for (let d = 1; d <= daysInMonth; d++) {
    let completedForDay = 0;
    habits.forEach(h => {
      if (h.checks && h.checks[monthKey] && h.checks[monthKey][d]) {
        completedForDay++;
        totalCompletions++;
      }
    });

    const pct = totalHabits > 0 ? Math.round((completedForDay / totalHabits) * 100) : 0;
    if (completedForDay > 0) activeDaysCount++;

    const dateObj = new Date(currentYear, currentMonth, d);
    dayStats[d] = {
      day: d,
      dayName: dayNamesShort[dateObj.getDay()],
      completed: completedForDay,
      total: totalHabits,
      percent: pct,
      isToday: isCurrentMonth && d === todayDay
    };
  }

  // Calculate Best Overall Streak and Current Streak
  let maxStreak = 0;
  habits.forEach(h => {
    const s = store.getHabitStreak(h.id);
    if (s > maxStreak) maxStreak = s;
  });

  const totalPossible = totalHabits * (isCurrentMonth ? todayDay : daysInMonth);
  const monthlyScore = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;

  let grade = 'A+';
  if (monthlyScore < 60) grade = 'C';
  else if (monthlyScore < 75) grade = 'B';
  else if (monthlyScore < 85) grade = 'A';

  container.innerHTML = `
    <div class="streak-history-view">
      <!-- Top Title & Month Switcher -->
      <div class="streak-header-card">
        <div class="streak-title-wrap">
          <div class="section-badge">
            <span class="live-dot pulse"></span> MONTHLY STREAK & HISTORY ARCHIVE
          </div>
          <h2 class="view-title">Discipline & Consistency History</h2>
          <p class="view-subtitle">Review your habit streaks, active days, and complete monthly history archives</p>
        </div>

        <div class="streak-month-picker">
          <div class="selector-box">
            <label>Year</label>
            <select id="history-year-select" class="nexus-select">
              ${Array.from({ length: 17 }, (_, i) => 2024 + i).map(y => `
                <option value="${y}" ${currentYear === y ? 'selected' : ''}>${y}</option>
              `).join('')}
            </select>
          </div>

          <div class="selector-box">
            <label>Month</label>
            <select id="history-month-select" class="nexus-select">
              ${monthNames.map((name, idx) => `
                <option value="${idx}" ${currentMonth === idx ? 'selected' : ''}>${name}</option>
              `).join('')}
            </select>
          </div>

          <button id="history-today-btn" class="nexus-btn btn-secondary">
            Today
          </button>

          <button id="history-share-streak-btn" class="nexus-btn btn-primary" title="Generate Shareable Social Streak Card">
            <span>📸</span> Share Card
          </button>
        </div>
      </div>

      <!-- Streak Analytics Stats Grid -->
      <div class="streak-stats-grid">
        <div class="streak-stat-box">
          <div class="stat-top">
            <span class="stat-label">Current Streak</span>
            <span class="stat-emoji-pill" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">🔥</span>
          </div>
          <div class="stat-main-val font-mono text-gold">${maxStreak} <span class="stat-unit">Days</span></div>
          <div class="stat-desc">Consecutive days without breaking chain</div>
        </div>

        <div class="streak-stat-box">
          <div class="stat-top">
            <span class="stat-label">Days Active This Month</span>
            <span class="stat-emoji-pill" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">📅</span>
          </div>
          <div class="stat-main-val font-mono text-emerald">${activeDaysCount} <span class="stat-unit">/ ${daysInMonth} Days</span></div>
          <div class="stat-desc">${daysInMonth - activeDaysCount} rest or off days</div>
        </div>

        <div class="streak-stat-box">
          <div class="stat-top">
            <span class="stat-label">Monthly Consistency</span>
            <span class="stat-emoji-pill" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">📈</span>
          </div>
          <div class="stat-main-val font-mono text-cyan">${monthlyScore}% <span class="grade-pill">${grade}</span></div>
          <div class="stat-desc">${totalCompletions} total habit completions recorded</div>
        </div>

        <div class="streak-stat-box">
          <div class="stat-top">
            <span class="stat-label">Active Habits</span>
            <span class="stat-emoji-pill" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">⭐</span>
          </div>
          <div class="stat-main-val font-mono text-white">${totalHabits} <span class="stat-unit">Routines</span></div>
          <div class="stat-desc">Daily active habits tracked</div>
        </div>
      </div>

      <!-- Monthly Calendar Heatmap Grid -->
      <div class="streak-calendar-panel">
        <div class="card-header-compact">
          <h3 class="section-title">📅 ${monthNames[currentMonth]} ${currentYear} Consistency Map</h3>
          <span class="badge-pill font-mono">${activeDaysCount} Active Days</span>
        </div>

        <div class="calendar-heat-grid">
          ${Object.values(dayStats).map(d => {
            const isFull = d.percent === 100;
            const isGood = d.percent >= 60;
            const isZero = d.completed === 0;

            return `
              <div class="cal-day-cell ${d.isToday ? 'cal-today' : ''} ${isFull ? 'status-full' : isGood ? 'status-good' : isZero ? 'status-empty' : 'status-partial'}"
                   title="${monthNames[currentMonth]} ${d.day} (${d.dayName}): ${d.completed}/${d.total} habits (${d.percent}%)">
                <div class="cal-day-header">
                  <span class="cal-day-num font-mono">${d.day}</span>
                  <span class="cal-day-name">${d.dayName}</span>
                </div>
                <div class="cal-day-body">
                  <div class="cal-pct-text font-mono">${d.percent}%</div>
                  <div class="cal-mini-bar">
                    <div class="cal-mini-fill" style="width: ${d.percent}%;"></div>
                  </div>
                </div>
                ${d.isToday ? '<span class="cal-today-badge">TODAY</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Habit-by-Habit Streak History Table -->
      <div class="habit-streaks-panel">
        <div class="card-header-compact">
          <h3 class="section-title">🔥 Habit Streak Leaderboard</h3>
          <span class="badge-pill">${habits.length} Tracked</span>
        </div>

        <div class="habit-streaks-list">
          ${habits.map(h => {
            const checks = (h.checks && h.checks[monthKey]) || {};
            const doneCount = Object.keys(checks).length;
            const streak = store.getHabitStreak(h.id);
            const rate = daysInMonth > 0 ? Math.round((doneCount / daysInMonth) * 100) : 0;

            return `
              <div class="habit-streak-card" data-habit-id="${h.id}" title="Click to view and share streak brag card" style="cursor: pointer;">
                <div class="habit-streak-left">
                  <div class="habit-streak-icon" style="background: ${h.color}18; border: 1px solid ${h.color}40;">
                    ${h.emoji}
                  </div>
                  <div class="habit-streak-info">
                    <span class="habit-streak-title">${h.name}</span>
                    <span class="habit-streak-cat" style="color: ${h.color};">${h.category} • ${h.timeOfDay}</span>
                  </div>
                </div>

                <div class="habit-streak-middle">
                  <div class="streak-dot-row" title="Monthly completion timeline (Days 1 to ${daysInMonth})">
                    ${Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const isChecked = !!checks[day];
                      const isTodayDay = isCurrentMonth && day === todayDay;
                      return `
                        <span class="timeline-dot ${isChecked ? 'dot-done' : 'dot-miss'} ${isTodayDay ? 'dot-today' : ''}" 
                              style="${isChecked ? `background: ${h.color};` : ''}"
                              title="Day ${day}: ${isChecked ? 'Completed' : 'Missed'}"></span>
                      `;
                    }).join('')}
                  </div>
                </div>

                <div class="habit-streak-right">
                  <div class="streak-pill-box">
                    <span class="streak-pill-label">Streak</span>
                    <span class="streak-pill-val font-mono">🔥 ${streak}d</span>
                  </div>

                  <div class="streak-pill-box">
                    <span class="streak-pill-label">Month</span>
                    <span class="streak-pill-val font-mono text-emerald">${doneCount}/${daysInMonth}d</span>
                  </div>

                  <div class="streak-pill-box">
                    <span class="streak-pill-label">Rate</span>
                    <span class="streak-pill-val font-mono text-cyan">${rate}%</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  attachStreakHandlers(container);
}

function attachStreakHandlers(container) {
  const yearSelect = container.querySelector('#history-year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', (e) => {
      store.setSelectedMonthYear(parseInt(e.target.value), store.data.selectedMonth);
      sounds.playPop();
    });
  }

  const monthSelect = container.querySelector('#history-month-select');
  if (monthSelect) {
    monthSelect.addEventListener('change', (e) => {
      store.setSelectedMonthYear(store.data.selectedYear, parseInt(e.target.value));
      sounds.playPop();
    });
  }

  const todayBtn = container.querySelector('#history-today-btn');
  if (todayBtn) {
    todayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const now = new Date();
      store.setSelectedMonthYear(now.getFullYear(), now.getMonth());
      sounds.playPop();
    });
  }

  const shareBtn = container.querySelector('#history-share-streak-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-modal', { detail: { modal: 'share-streak' } }));
      sounds.playPop();
    });
  }

  // Allow clicking on any habit streak card to view/share the brag card
  const habitCards = container.querySelectorAll('.habit-streak-card');
  habitCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-modal', { detail: { modal: 'share-streak' } }));
      sounds.playPop();
    });
  });
}
