import { store } from '../store.js';
import { sounds } from '../audio.js';
import confetti from 'canvas-confetti';

// Persistent module-level state memory across renders
let lastKnownMatrixScrollLeft = null;
let lastRenderedMonthKey = null;
let currentActiveFilter = 'all';

export function renderHabitMatrix(container) {
  // Capture current horizontal scroll position BEFORE wiping HTML to eliminate any jump
  const existingScroll = container.querySelector('#matrix-scroll-container');
  if (existingScroll && existingScroll.scrollLeft > 0) {
    lastKnownMatrixScrollLeft = existingScroll.scrollLeft;
  }

  const data = store.data;
  const currentYear = data.selectedYear;
  const currentMonth = data.selectedMonth; // 0-indexed
  const monthKey = store.getMonthKey(currentYear, currentMonth);

  // If user deliberately changed month or year, reset persistent scroll memory
  if (lastRenderedMonthKey !== null && lastRenderedMonthKey !== monthKey) {
    lastKnownMatrixScrollLeft = null;
  }
  lastRenderedMonthKey = monthKey;

  // Today reference
  const now = new Date();
  const isCurrentMonthAndYear = now.getFullYear() === currentYear && now.getMonth() === currentMonth;
  const todayDate = now.getDate();

  // Number of days in selected month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day of week abbreviations
  const dayNamesShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Calculate day of week for each day in this month
  const daysInfo = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(currentYear, currentMonth, day);
    daysInfo.push({
      day,
      dayOfWeek: dayNamesShort[d.getDay()],
      isToday: isCurrentMonthAndYear && day === todayDate
    });
  }

  // Calculate week spans based on weekStart setting ('Mo' vs 'Su')
  const weekStart = (data.settings && data.settings.weekStart) || 'Mo';
  const weekEndDay = weekStart === 'Mo' ? 'Su' : 'Sa';

  const weeks = [];
  let currentWeek = [];
  daysInfo.forEach((item, index) => {
    currentWeek.push(item);
    if (item.dayOfWeek === weekEndDay || index === daysInfo.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Calculate stats
  let totalChecksPossible = data.habits.length * daysInMonth;
  let totalChecksDone = 0;
  let todayCompletedCount = 0;
  const dailyDoneCounts = {};

  for (let d = 1; d <= daysInMonth; d++) {
    dailyDoneCounts[d] = 0;
  }

  data.habits.forEach(habit => {
    const checks = (habit.checks && habit.checks[monthKey]) || {};
    for (let d = 1; d <= daysInMonth; d++) {
      if (checks[d]) {
        totalChecksDone++;
        dailyDoneCounts[d]++;
        if (isCurrentMonthAndYear && d === todayDate) {
          todayCompletedCount++;
        }
      }
    }
  });

  const monthCompletionRate = totalChecksPossible > 0
    ? Math.round((totalChecksDone / totalChecksPossible) * 100)
    : 0;

  // Calculate Weekly Rhythm statistics (inspired by reference sheets & executive OS)
  const weeklyStats = weeks.map((weekDays, wIdx) => {
    const weekStartDay = weekDays[0].day;
    const weekEndDay = weekDays[weekDays.length - 1].day;
    const daysInThisWeek = weekDays.length;
    const targetChecks = data.habits.length * daysInThisWeek;
    let completedChecks = 0;

    data.habits.forEach(habit => {
      const checks = (habit.checks && habit.checks[monthKey]) || {};
      weekDays.forEach(wd => {
        if (checks[wd.day]) {
          completedChecks++;
        }
      });
    });

    const completionRate = targetChecks > 0
      ? Math.round((completedChecks / targetChecks) * 100)
      : 0;

    const containsToday = weekDays.some(wd => wd.isToday);
    const isPastWeek = isCurrentMonthAndYear
      ? weekEndDay < todayDate
      : (now.getFullYear() > currentYear || (now.getFullYear() === currentYear && now.getMonth() > currentMonth));

    // Ring stroke color
    let ringColor = 'var(--cyan)';
    if (completionRate >= 80) ringColor = 'var(--emerald)';
    else if (completionRate >= 50) ringColor = '#f59e0b';
    else if (completionRate > 0) ringColor = '#f97316';
    else ringColor = 'rgba(255, 255, 255, 0.18)';

    return {
      weekIndex: wIdx + 1,
      startDay: weekStartDay,
      endDay: weekEndDay,
      daysCount: daysInThisWeek,
      targetChecks,
      completedChecks,
      completionRate,
      containsToday,
      isPastWeek,
      ringColor
    };
  });

  // Check if all habits are already completed for today
  const allHabitsDoneToday = data.habits.length > 0 && data.habits.every(h => {
    const checks = (h.checks && h.checks[monthKey]) || {};
    return !!checks[todayDate];
  });

  // Render HTML structure
  container.innerHTML = `
    <div class="habit-matrix-view">
      <!-- Matrix Top Controls Bar -->
      <div class="matrix-topbar">
        <div class="matrix-title-group">
          <div class="matrix-badge">
            <span class="live-dot pulse"></span> DAILY DISCIPLINE MATRIX
          </div>
          <h2 class="view-title">Habit Momentum Grid</h2>
          <p class="view-subtitle">Don't break the chain • Streak multipliers • Live daily completion</p>
        </div>

        <div class="matrix-selectors">
          <!-- Dynamic Multi-Year Range (Decades of Lifetime History) -->
          <div class="selector-box">
            <label>Year</label>
            <select id="matrix-year-select" class="nexus-select">
              ${Array.from({ length: 17 }, (_, i) => 2024 + i).map(y => `
                <option value="${y}" ${currentYear === y ? 'selected' : ''}>${y}</option>
              `).join('')}
            </select>
          </div>

          <!-- Month Selector -->
          <div class="selector-box">
            <label>Month</label>
            <select id="matrix-month-select" class="nexus-select">
              ${monthNames.map((name, idx) => `
                <option value="${idx}" ${currentMonth === idx ? 'selected' : ''}>${name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Quick Jump Today Button -->
          <button id="jump-today-btn" class="nexus-btn btn-secondary" title="Jump to today's date column">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Today
          </button>

          <!-- Power Action: Check / Undo All Today -->
          <button id="mark-all-today-btn" class="nexus-btn ${allHabitsDoneToday ? 'btn-primary' : 'btn-secondary'}" title="${allHabitsDoneToday ? 'All routines completed today! Click to undo all for today' : 'Mark all routines complete for today'}">
            ${allHabitsDoneToday ? '✓ Done (Undo All)' : '⚡ Check All Today'}
          </button>

          <!-- Overall Completion Score -->
          <div class="matrix-score-card">
            <div class="score-label">Monthly Score</div>
            <div class="score-value ${monthCompletionRate >= 80 ? 'text-emerald' : 'text-cyan'}">
              ${monthCompletionRate}%
            </div>
          </div>

          <!-- Share Streak Card Button -->
          <button id="open-share-streak-btn" class="nexus-btn btn-secondary" title="Generate Shareable Social Streak Card">
            <span>📸</span> Share
          </button>

          <!-- Add Habit Button -->
          <button id="open-add-habit-btn" class="nexus-btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Habit
          </button>
        </div>
      </div>

      <!-- Weekly Rhythm Circular Completion Rings Strip (Directly inspired by Reference Sheet) -->
      <div class="weekly-rhythm-strip">
        <div class="weekly-rhythm-header">
          <div class="weekly-rhythm-title">
            <span class="rhythm-glow-dot"></span>
            <span>WEEKLY PROGRESS RINGS</span>
          </div>
          <span class="weekly-rhythm-hint">Click any ring card to auto-focus that week in the matrix</span>
        </div>

        <div class="weekly-rhythm-grid">
          ${weeklyStats.map(w => {
            // Circumference for r=20 is 2 * PI * 20 = 125.66
            const circumference = 125.66;
            const strokeOffset = (circumference * (1 - w.completionRate / 100)).toFixed(1);
            return `
              <div class="weekly-rhythm-card ${w.containsToday ? 'is-current-week' : ''}" 
                   data-week-start="${w.startDay}"
                   role="button"
                   tabindex="0"
                   title="Week ${w.weekIndex} (${monthNames[currentMonth].slice(0, 3)} ${w.startDay} - ${w.endDay}): ${w.completedChecks}/${w.targetChecks} checks completed (${w.completionRate}%)">
                <div class="week-card-head">
                  <span class="week-title-text">Week ${w.weekIndex}</span>
                  ${w.containsToday 
                    ? '<span class="week-badge-current">ACTIVE</span>' 
                    : `<span class="week-dates-span">${w.startDay}–${w.endDay}</span>`}
                </div>

                <div class="week-card-content">
                  <div class="week-ring-box">
                    <svg class="week-ring-svg" viewBox="0 0 50 50">
                      <circle class="ring-track" cx="25" cy="25" r="20" stroke-width="4.5" fill="none" />
                      <circle class="ring-bar" cx="25" cy="25" r="20" stroke-width="4.5" fill="none"
                        stroke-dasharray="125.66"
                        stroke-dashoffset="${strokeOffset}"
                        stroke-linecap="round"
                        transform="rotate(-90 25 25)"
                        style="stroke: ${w.ringColor};"
                      />
                      <text x="25" y="29" class="ring-val-text">${w.completionRate}%</text>
                    </svg>
                  </div>

                  <div class="week-stat-details">
                    <div class="week-count-row">
                      <span class="week-count-done">${w.completedChecks}</span>
                      <span class="week-count-sep">/</span>
                      <span class="week-count-target">${w.targetChecks}</span>
                    </div>
                    <span class="week-stat-sub">completed</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Quick Category Filter Pills -->
      <div class="habit-filter-bar">
        <span class="filter-label">Filter:</span>
        <button class="filter-pill ${currentActiveFilter === 'all' ? 'active' : ''}" data-filter="all">All Habits (${data.habits.length})</button>
        <button class="filter-pill ${currentActiveFilter === 'Morning' ? 'active' : ''}" data-filter="Morning">🌅 Morning</button>
        <button class="filter-pill ${currentActiveFilter === 'Fitness' ? 'active' : ''}" data-filter="Fitness">🏃 Movement</button>
        <button class="filter-pill ${currentActiveFilter === 'Health' ? 'active' : ''}" data-filter="Health">🥗 Health</button>
        <button class="filter-pill ${currentActiveFilter === 'Productivity' ? 'active' : ''}" data-filter="Productivity">⚡ Deep Work</button>
        <button class="filter-pill ${currentActiveFilter === 'Mindset' ? 'active' : ''}" data-filter="Mindset">🧘 Mindset</button>
        <button class="filter-pill ${currentActiveFilter === 'Evening' ? 'active' : ''}" data-filter="Evening">🌙 Evening</button>
      </div>

      <!-- Main Spreadsheet Grid Table Container -->
      <div class="matrix-table-wrapper" id="matrix-scroll-container">
        <table class="matrix-table">
          <thead>
            <!-- Row 1: Week Span Headers (Week 1, Week 2, etc.) -->
            <tr class="week-header-row">
              <th class="sticky-col habit-col-header" rowspan="3">
                <div class="habit-header-content">
                  <span class="habit-header-title">My Habits</span>
                  <span class="habit-count-badge">${data.habits.length} Active</span>
                </div>
              </th>
              ${weeks.map((week, idx) => {
                const wStat = weeklyStats[idx];
                const pct = wStat ? wStat.completionRate : 0;
                const startDay = wStat ? wStat.startDay : (week[0] ? week[0].day : 1);
                return `
                  <th colspan="${week.length}" class="week-group-header" data-week-start="${startDay}" title="Click to scroll to Week ${idx + 1} (${wStat ? wStat.startDay + '–' + wStat.endDay : ''})">
                    <span class="wgh-title">Week ${idx + 1}</span>
                    <span class="wgh-pct ${pct >= 80 ? 'text-emerald' : pct >= 50 ? 'text-cyan' : 'text-muted'}">${pct}%</span>
                  </th>
                `;
              }).join('')}
              <th rowspan="3" class="stats-col-header">Streak</th>
              <th rowspan="3" class="stats-col-header">Rate</th>
            </tr>

            <!-- Row 2: Day of Week (Su, Mo, Tu, We, Th, Fr, Sa) -->
            <tr class="dayname-header-row">
              ${daysInfo.map(item => `
                <th class="dayname-cell ${item.isToday ? 'today-header' : ''}">
                  ${item.dayOfWeek}
                </th>
              `).join('')}
            </tr>

            <!-- Row 3: Day Number (1, 2, 3 ... 31) -->
            <tr class="daynum-header-row">
              ${daysInfo.map(item => `
                <th class="daynum-cell ${item.isToday ? 'today-header today-daynum' : ''}" data-day="${item.day}">
                  <span class="num-wrap">${item.day}</span>
                  ${item.isToday ? '<span class="today-pill">NOW</span>' : ''}
                </th>
              `).join('')}
            </tr>
          </thead>

          <tbody>
            ${data.habits.map(habit => {
              const checks = (habit.checks && habit.checks[monthKey]) || {};
              const habitChecksCount = Object.keys(checks).length;
              const habitRate = daysInMonth > 0 ? Math.round((habitChecksCount / daysInMonth) * 100) : 0;
              const streak = store.getHabitStreak(habit.id, currentYear, currentMonth);
              const isTodayChecked = isCurrentMonthAndYear && !!checks[todayDate];
              const habitColor = habit.color || '#38bdf8';

              // Habit strength label
              const strengthLabel = habitRate >= 85 ? 'Master' : habitRate >= 70 ? 'Strong' : habitRate >= 45 ? 'Building' : 'Starting';
              const strengthClass = habitRate >= 70 ? 'text-emerald' : habitRate >= 45 ? 'text-cyan' : 'text-muted';

              return `
                <tr class="habit-row" data-category="${habit.category}" data-habit-id="${habit.id}" style="${currentActiveFilter !== 'all' && habit.category.toLowerCase() !== currentActiveFilter.toLowerCase() ? 'display: none;' : ''}">
                  <!-- Sticky Habit Title Column with 1-Click Today Action -->
                  <td class="sticky-col habit-name-cell">
                    <div class="habit-cell-wrapper">
                      <div class="habit-emoji-box" style="background: ${habitColor}22; border-color: ${habitColor}60;">
                        <span>${habit.emoji}</span>
                      </div>
                      <div class="habit-meta">
                        <div class="habit-title-row">
                          <span class="habit-name-text" title="${habit.name}">${habit.name}</span>
                          <!-- 1-Click Today Fast Check Button -->
                          ${isCurrentMonthAndYear ? `
                            <button class="habit-quick-today-btn ${isTodayChecked ? 'today-done' : 'today-pending'}" 
                                    data-habit-id="${habit.id}" 
                                    data-day="${todayDate}"
                                    title="${isTodayChecked ? 'Today completed! Click to undo' : 'Quick check for today'}">
                              ${isTodayChecked ? '✓ Done' : '+ Today'}
                            </button>
                          ` : ''}
                        </div>
                        <div class="habit-tags">
                          <span class="habit-cat-tag" style="color: ${habitColor}; border-color: ${habitColor}40;">
                            ${habit.category}
                          </span>
                          <span class="habit-time-tag">${habit.timeOfDay}</span>
                          <span class="habit-strength-tag ${strengthClass}">${strengthLabel}</span>
                        </div>
                      </div>
                      <button class="delete-habit-btn" data-habit-id="${habit.id}" title="Delete Habit">
                        &times;
                      </button>
                    </div>
                  </td>

                  <!-- Day Checkbox Matrix Cells with "Don't Break The Chain" Effect -->
                  ${daysInfo.map(item => {
                    const isChecked = !!checks[item.day];
                    const prevChecked = item.day > 1 && !!checks[item.day - 1];
                    const nextChecked = item.day < daysInMonth && !!checks[item.day + 1];

                    let chainClass = '';
                    if (isChecked) {
                      if (prevChecked && nextChecked) chainClass = 'chain-middle';
                      else if (!prevChecked && nextChecked) chainClass = 'chain-start';
                      else if (prevChecked && !nextChecked) chainClass = 'chain-end';
                      else chainClass = 'chain-single';
                    }

                    return `
                      <td class="checkbox-cell ${item.isToday ? 'today-col' : ''} ${chainClass}" style="--habit-color: ${habitColor};">
                        <div class="chain-bridge ${chainClass}" style="--habit-color: ${habitColor};"></div>
                        <div class="custom-tick-box ${isChecked ? 'checked' : ''}" 
                             role="button"
                             tabindex="0"
                             data-habit-id="${habit.id}" 
                             data-day="${item.day}"
                             style="${isChecked ? `background: ${habitColor}; border-color: ${habitColor}; box-shadow: 0 0 12px ${habitColor}55;` : ''}"
                             title="${habit.name} • ${monthNames[currentMonth]} ${item.day} (${item.dayOfWeek}) • ${isChecked ? 'Completed' : 'Click to complete'}">
                          <div class="tick-mark">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                            </svg>
                          </div>
                        </div>
                      </td>
                    `;
                  }).join('')}

                  <!-- Habit Streak Column -->
                  <td class="stat-cell streak-cell">
                    <span class="streak-badge ${streak > 0 ? 'active' : ''}"><span class="streak-fire">🔥</span><span class="streak-val">${streak}d</span></span>
                  </td>

                  <!-- Habit Monthly Rate Column -->
                  <td class="stat-cell rate-cell">
                    <div class="mini-rate-wrap">
                      <span class="rate-num">${habitRate}%</span>
                      <div class="mini-rate-bar">
                        <div class="mini-rate-fill" style="width: ${habitRate}%; background: ${habitColor};"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>

          <!-- Daily Completion Summary Row (Bottom of grid, as shown in reference) -->
          <tfoot>
            <tr class="summary-score-row">
              <td class="sticky-col summary-label-cell">
                <div class="summary-label-content">
                  <span class="summary-title">Daily Score</span>
                  <span class="summary-sub">${totalChecksDone} checks logged</span>
                </div>
              </td>
              ${daysInfo.map(item => {
                const count = dailyDoneCounts[item.day] || 0;
                const totalH = data.habits.length;
                const pct = totalH > 0 ? Math.round((count / totalH) * 100) : 0;
                const isFull = pct === 100;
                return `
                  <td class="summary-day-cell ${item.isToday ? 'today-col' : ''} ${isFull ? 'full-day' : ''}">
                    <div class="day-progress-wrap" title="${monthNames[currentMonth]} ${item.day}: ${count}/${totalH} (${pct}%)">
                      <span class="day-pct-text ${pct === 100 ? 'text-emerald font-bold' : pct >= 50 ? 'text-cyan' : 'text-muted'}">
                        ${pct}%
                      </span>
                      <div class="day-vbar">
                        <div class="day-vbar-fill ${pct === 100 ? 'bg-gold' : pct >= 50 ? 'bg-emerald' : 'bg-cyan'}" style="height: ${pct}%;"></div>
                      </div>
                    </div>
                  </td>
                `;
              }).join('')}
              <td colspan="2" class="summary-end-cell">
                <span class="total-checks-badge">✓ ${totalChecksDone} Done</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="matrix-insights-grid">
        <div class="insight-card">
          <div class="insight-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
            🔥
          </div>
          <div class="insight-info">
            <div class="insight-title">Active Discipline Streak</div>
            <div class="insight-value">${calculateBestStreak(data.habits)} Days Running</div>
            <div class="insight-sub">Consecutive momentum chain active</div>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">
            🎯
          </div>
          <div class="insight-info">
            <div class="insight-title">Today's Remaining</div>
            <div class="insight-value">${calculateRemainingToday(data.habits, todayDate, monthKey)} Left</div>
            <div class="insight-sub">${todayCompletedCount} of ${data.habits.length} habits done today</div>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
            👑
          </div>
          <div class="insight-info">
            <div class="insight-title">Flawless Days</div>
            <div class="insight-value">${countFlawlessDays(dailyDoneCounts, data.habits.length, daysInMonth)} Days</div>
            <div class="insight-sub">100% completion logged for all routines</div>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">
            ⚡
          </div>
          <div class="insight-info">
            <div class="insight-title">Total Monthly Check-Ins</div>
            <div class="insight-value">${totalChecksDone} Done</div>
            <div class="insight-sub">${monthCompletionRate}% overall monthly consistency</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Synchronously restore scroll position IMMEDIATELY before layout paint
  const scrollContainer = container.querySelector('#matrix-scroll-container');
  if (scrollContainer) {
    if (lastKnownMatrixScrollLeft !== null) {
      scrollContainer.scrollLeft = lastKnownMatrixScrollLeft;
    } else if (isCurrentMonthAndYear) {
      const todayCell = container.querySelector('.today-daynum');
      if (todayCell) {
        const offset = todayCell.offsetLeft - scrollContainer.offsetWidth / 2 + 100;
        scrollContainer.scrollLeft = Math.max(0, offset);
        lastKnownMatrixScrollLeft = scrollContainer.scrollLeft;
      }
    }
  }

  attachMatrixHandlers(container, isCurrentMonthAndYear, todayDate);
}

function calculateBestStreak(habits) {
  let max = 0;
  habits.forEach(h => {
    const s = store.getHabitStreak(h.id);
    if (s > max) max = s;
  });
  return max;
}

function calculateRemainingToday(habits, todayDate, monthKey) {
  let count = 0;
  habits.forEach(h => {
    const checks = (h.checks && h.checks[monthKey]) || {};
    if (!checks[todayDate]) count++;
  });
  return count;
}

function countFlawlessDays(dailyDoneCounts, totalHabits, daysInMonth) {
  if (totalHabits === 0) return 0;
  let flawless = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    if (dailyDoneCounts[d] === totalHabits) flawless++;
  }
  return flawless;
}

function attachMatrixHandlers(container, isCurrentMonthAndYear, todayDate) {
  // Year selector
  const yearSelect = container.querySelector('#matrix-year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', (e) => {
      lastKnownMatrixScrollLeft = null;
      store.setSelectedMonthYear(parseInt(e.target.value), store.data.selectedMonth);
    });
  }

  // Month selector
  const monthSelect = container.querySelector('#matrix-month-select');
  if (monthSelect) {
    monthSelect.addEventListener('change', (e) => {
      lastKnownMatrixScrollLeft = null;
      store.setSelectedMonthYear(store.data.selectedYear, parseInt(e.target.value));
    });
  }

  // Jump to today button
  const jumpBtn = container.querySelector('#jump-today-btn');
  if (jumpBtn) {
    jumpBtn.addEventListener('click', () => {
      const now = new Date();
      lastKnownMatrixScrollLeft = null;
      if (!isCurrentMonthAndYear) {
        store.setSelectedMonthYear(now.getFullYear(), now.getMonth());
      }
      setTimeout(() => {
        const todayHeader = container.querySelector('.today-daynum');
        const scrollBox = container.querySelector('#matrix-scroll-container');
        if (todayHeader && scrollBox) {
          const stickyCol = scrollBox.querySelector('.sticky-col');
          const stickyWidth = stickyCol ? stickyCol.offsetWidth : 280;
          // Position today right in clear view beside the sticky habit title column
          const offset = Math.max(0, todayHeader.offsetLeft - stickyWidth - 10);
          scrollBox.scrollTo({ left: offset, behavior: 'smooth' });
          lastKnownMatrixScrollLeft = offset;
          todayHeader.classList.add('week-jump-glow');
          setTimeout(() => todayHeader.classList.remove('week-jump-glow'), 1200);
          sounds.playPop();
        }
      }, isCurrentMonthAndYear ? 20 : 120);
    });
  }

  // Power Action: Check / Undo All Today
  const markAllBtn = container.querySelector('#mark-all-today-btn');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      const now = new Date();
      const currentRealMonthKey = store.getMonthKey(now.getFullYear(), now.getMonth());
      const realToday = now.getDate();

      // If viewing another month, switch to current month
      if (!isCurrentMonthAndYear) {
        store.setSelectedMonthYear(now.getFullYear(), now.getMonth());
      }

      // Check if all are already done for today
      const allDone = store.data.habits.every(h => h.checks && h.checks[currentRealMonthKey] && h.checks[currentRealMonthKey][realToday]);

      if (allDone) {
        // Toggle all off (Undo All)
        store.data.habits.forEach(h => {
          if (h.checks && h.checks[currentRealMonthKey]) {
            delete h.checks[currentRealMonthKey][realToday];
          }
        });
        store.addXP(-100, 'Undo all habits for today');
        sounds.playUncheck();
      } else {
        // Mark all on
        store.data.habits.forEach(h => {
          if (!h.checks) h.checks = {};
          if (!h.checks[currentRealMonthKey]) h.checks[currentRealMonthKey] = {};
          h.checks[currentRealMonthKey][realToday] = true;
        });
        store.addXP(100, 'Completed all habits today!');
        sounds.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      store.saveData();
      store.notify('habits_bulk_checked');
    });
  }

  // Quick 1-click today button on each habit row
  const quickTodayBtns = container.querySelectorAll('.habit-quick-today-btn');
  quickTodayBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const habitId = btn.dataset.habitId;
      const day = parseInt(btn.dataset.day);
      const isDone = btn.classList.contains('today-done');

      // Preserve current exact horizontal scroll position
      const scrollBox = container.querySelector('#matrix-scroll-container');
      if (scrollBox) {
        lastKnownMatrixScrollLeft = scrollBox.scrollLeft;
      }

      if (!isDone) {
        sounds.playCheck();
      } else {
        sounds.playUncheck();
      }

      store.toggleHabitDay(habitId, day);
    });
  });

  // Filter pills
  const filterPills = container.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.filter;
      currentActiveFilter = cat;
      const rows = container.querySelectorAll('.habit-row');
      rows.forEach(r => {
        if (cat === 'all' || r.dataset.category.toLowerCase() === cat.toLowerCase()) {
          r.style.display = '';
        } else {
          r.style.display = 'none';
        }
      });
      sounds.playPop();
    });
  });

  // Checkbox toggle clicks
  const checkBoxes = container.querySelectorAll('.custom-tick-box');
  checkBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      e.preventDefault();
      const habitId = box.dataset.habitId;
      const day = parseInt(box.dataset.day);
      const isChecked = box.classList.contains('checked');

      // Preserve current exact horizontal scroll position
      const scrollBox = container.querySelector('#matrix-scroll-container');
      if (scrollBox) {
        lastKnownMatrixScrollLeft = scrollBox.scrollLeft;
      }

      if (!isChecked) {
        sounds.playCheck();
        box.classList.add('checked');
        box.classList.add('pop-anim');
        setTimeout(() => box.classList.remove('pop-anim'), 400);

        if (isCurrentMonthAndYear && day === todayDate) {
          const now = new Date();
          const monthKey = store.getMonthKey(now.getFullYear(), now.getMonth());
          const remaining = calculateRemainingToday(store.data.habits, todayDate, monthKey);
          if (remaining <= 1) {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
            sounds.playDing();
          }
        }
      } else {
        sounds.playUncheck();
        box.classList.remove('checked');
      }

      store.toggleHabitDay(habitId, day);
    });
  });

  // Delete habit button
  const deleteBtns = container.querySelectorAll('.delete-habit-btn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const habitId = btn.dataset.habitId;
      if (confirm('Delete this habit and all its check history?')) {
        store.deleteHabit(habitId);
        sounds.playPop();
      }
    });
  });


  // Open share streak card modal
  const shareBtn = container.querySelector('#open-share-streak-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-modal', { detail: { modal: 'share-streak' } }));
      sounds.playPop();
    });
  }

  // Open add habit modal
  const addBtn = container.querySelector('#open-add-habit-btn');
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-modal', { detail: { modal: 'add-habit' } }));
      sounds.playPop();
    });
  }

  // Streak badge click to open share modal
  const streakCells = container.querySelectorAll('.stat-cell.streak-cell');
  streakCells.forEach(cell => {
    cell.style.cursor = 'pointer';
    cell.title = 'Click to generate shareable streak brag card';
    cell.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-modal', { detail: { modal: 'share-streak' } }));
      sounds.playPop();
    });
  });

  // Helper: Smoothly scroll precisely to a day column right beside the sticky habit column
  function scrollToDay(startDay) {
    if (!startDay) return;
    const targetHeader = container.querySelector(`.daynum-cell[data-day="${startDay}"]`);
    if (targetHeader && finalScrollContainer) {
      const stickyCol = finalScrollContainer.querySelector('.sticky-col');
      const stickyWidth = stickyCol ? stickyCol.offsetWidth : 280;
      // Exactly align targetHeader right beside the sticky habit title column (never hidden under it)
      const targetScrollLeft = Math.max(0, targetHeader.offsetLeft - stickyWidth - 2);

      finalScrollContainer.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
      lastKnownMatrixScrollLeft = targetScrollLeft;
      sounds.playPop();

      targetHeader.classList.add('week-jump-glow');
      setTimeout(() => targetHeader.classList.remove('week-jump-glow'), 1200);
    }
  }

  // Weekly Rhythm Cards click -> smooth scroll precisely to that week's column
  const rhythmCards = container.querySelectorAll('.weekly-rhythm-card');
  rhythmCards.forEach(card => {
    card.addEventListener('click', () => {
      scrollToDay(card.dataset.weekStart);
    });
  });

  // Table Week Group Headers click -> smooth scroll precisely to that week's column
  const weekGroupHeaders = container.querySelectorAll('.week-group-header');
  weekGroupHeaders.forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      scrollToDay(header.dataset.weekStart);
    });
  });

  // Maintain exact horizontal scroll position (zero jumping or sliding)
  const finalScrollContainer = container.querySelector('#matrix-scroll-container');
  if (finalScrollContainer) {
    // Keep lastKnownMatrixScrollLeft continuously synced as user scrolls
    finalScrollContainer.addEventListener('scroll', () => {
      lastKnownMatrixScrollLeft = finalScrollContainer.scrollLeft;
    }, { passive: true });

    if (lastKnownMatrixScrollLeft !== null) {
      finalScrollContainer.scrollLeft = lastKnownMatrixScrollLeft;
    }
  }
}
