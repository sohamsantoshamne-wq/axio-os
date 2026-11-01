import { store } from '../store.js';
import { sounds } from '../audio.js';
import confetti from 'canvas-confetti';

export function renderOverview(container) {
  const data = store.data;

  // Current date
  const now = new Date();
  const todayDay = now.getDate();
  const actualYear = now.getFullYear();
  const actualMonth = now.getMonth();
  const todayMonthKey = store.getMonthKey(actualYear, actualMonth);

  const currentYear = data.selectedYear || actualYear;
  const currentMonth = data.selectedMonth !== undefined ? data.selectedMonth : actualMonth;
  const monthKey = store.getMonthKey(currentYear, currentMonth);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Today habit progress (strictly evaluated for today's real date & month)
  let todayHabitsCompleted = 0;
  const habitsList = data.habits || [];
  habitsList.forEach(h => {
    if (h.checks && h.checks[todayMonthKey] && h.checks[todayMonthKey][todayDay]) {
      todayHabitsCompleted++;
    }
  });
  const todayPct = habitsList.length > 0
    ? Math.round((todayHabitsCompleted / habitsList.length) * 100)
    : 0;

  // Best habit streak
  let bestStreak = 0;
  habitsList.forEach(h => {
    const s = store.getHabitStreak(h.id);
    if (s > bestStreak) bestStreak = s;
  });

  // Monthly discipline stats
  let totalPossible = habitsList.length * daysInMonth;
  let totalDoneThisMonth = 0;
  const dailyDoneCounts = {};
  for (let d = 1; d <= daysInMonth; d++) dailyDoneCounts[d] = 0;

  habitsList.forEach(h => {
    const checks = (h.checks && h.checks[monthKey]) || {};
    for (let d = 1; d <= daysInMonth; d++) {
      if (checks[d]) {
        totalDoneThisMonth++;
        dailyDoneCounts[d]++;
      }
    }
  });

  const monthRate = totalPossible > 0 ? Math.round((totalDoneThisMonth / totalPossible) * 100) : 0;
  let flawlessDays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    if (habitsList.length > 0 && dailyDoneCounts[d] === habitsList.length) {
      flawlessDays++;
    }
  }

  container.innerHTML = `
    <div class="overview-view">
      <!-- Welcome Hero Banner -->
      <div class="overview-hero-banner">
        <div class="hero-left">
          <div class="hero-badge">
            <span class="live-dot pulse"></span> DAILY DISCIPLINE COMMAND HUB
          </div>
          <h2 class="hero-greeting">Welcome Back, <span class="text-gradient">${data.user.name}</span></h2>
          <p class="hero-subtext">You have completed <strong class="text-emerald">${todayHabitsCompleted} of ${habitsList.length} habits</strong> today. Keep the momentum unbroken.</p>
        </div>

        <!-- Sensible Today's Focus Widget -->
        <div class="focus-summary-widget">
          <div class="focus-metric-item">
            <span class="focus-metric-val text-emerald font-mono">${todayHabitsCompleted}/${habitsList.length}</span>
            <span class="focus-metric-label">Habits Today</span>
          </div>
          <div class="focus-metric-divider"></div>
          <div class="focus-metric-item">
            <span class="focus-metric-val text-cyan font-mono">${todayPct}%</span>
            <span class="focus-metric-label">Today Done</span>
          </div>
          <div class="focus-metric-divider"></div>
          <div class="focus-metric-item">
            <span class="focus-metric-val text-gold font-mono">🔥 ${bestStreak}d</span>
            <span class="focus-metric-label">Best Streak</span>
          </div>
        </div>
      </div>

      <!-- 3 Habit Discipline Pillars -->
      <div class="overview-pillars-grid">
        <!-- Pillar 1: Today's Routine Execution -->
        <div class="pillar-card habit-pillar">
          <div class="pillar-header">
            <div class="pillar-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
              ⚡
            </div>
            <div>
              <h3 class="pillar-title">Today's Habits</h3>
              <span class="pillar-status font-mono">${todayHabitsCompleted} of ${habitsList.length} Done</span>
            </div>
            <span class="pillar-pct font-mono text-emerald">${todayPct}%</span>
          </div>

          <div class="pillar-bar-track">
            <div class="pillar-bar-fill bg-emerald" style="width: ${todayPct}%;"></div>
          </div>

          <div class="pillar-action-row">
            <button class="nav-shortcut-btn" data-target-tab="matrix">
              Open Habit Grid →
            </button>
          </div>
        </div>

        <!-- Pillar 2: Unbroken Streaks & Discipline -->
        <div class="pillar-card streak-pillar">
          <div class="pillar-header">
            <div class="pillar-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
              🔥
            </div>
            <div>
              <h3 class="pillar-title">Unbroken Momentum</h3>
              <span class="pillar-status font-mono">${bestStreak} Days Chain Active</span>
            </div>
            <span class="pillar-pct font-mono text-gold">
              🔥 ${bestStreak}d
            </span>
          </div>

          <div class="pillar-bar-track">
            <div class="pillar-bar-fill bg-gold" style="width: ${Math.min(100, Math.max(12, bestStreak * 4))}%;"></div>
          </div>

          <div class="pillar-action-row">
            <button class="nav-shortcut-btn" data-target-tab="streaks">
              View Streaks Leaderboard →
            </button>
          </div>
        </div>

        <!-- Pillar 3: Monthly Consistency -->
        <div class="pillar-card month-pillar">
          <div class="pillar-header">
            <div class="pillar-icon-box" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">
              📅
            </div>
            <div>
              <h3 class="pillar-title">Monthly Consistency</h3>
              <span class="pillar-status font-mono">${totalDoneThisMonth} Checks Logged</span>
            </div>
            <span class="pillar-pct font-mono text-cyan">${monthRate}%</span>
          </div>

          <div class="pillar-bar-track">
            <div class="pillar-bar-fill bg-cyan" style="width: ${monthRate}%;"></div>
          </div>

          <div class="pillar-action-row">
            <button class="nav-shortcut-btn" data-target-tab="streaks">
              View Monthly Calendar Heatmap →
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Action Deck & Today's Checklist -->
      <div class="overview-dual-grid">
        <!-- Today's Fast Checklist -->
        <div class="today-fast-card">
          <div class="card-header-compact">
            <h3 class="section-title">Today's Routine Checklist</h3>
            <span class="badge-pill font-mono">${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>

          <div class="fast-habit-list">
            ${habitsList.map(h => {
              const isChecked = !!(h.checks && h.checks[todayMonthKey] && h.checks[todayMonthKey][todayDay]);
              return `
                <div class="fast-habit-item ${isChecked ? 'completed' : ''}">
                  <button class="fast-check-btn ${isChecked ? 'checked' : ''}" 
                          data-habit-id="${h.id}" 
                          data-day="${todayDay}"
                          data-month-key="${todayMonthKey}"
                          title="${isChecked ? 'Click to undo' : 'Mark complete'}">
                    <span class="check-icon">✓</span>
                  </button>
                  <span class="fast-emoji">${h.emoji}</span>
                  <div class="fast-habit-info">
                    <span class="fast-name">${h.name}</span>
                    <span class="fast-sub">${h.timeOfDay} • ${h.category}</span>
                  </div>
                  <span class="fast-xp-badge font-mono" style="color: var(--cyan); background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.25);">${h.category}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Quick Log & Highlights Column -->
        <div class="quick-log-side">
          <!-- Monthly Scorecard Widget -->
          <div class="quick-card score-summary-card">
            <div class="card-header-compact">
              <span class="section-title">📊 Discipline Scorecard</span>
              <span class="badge-pill font-mono text-emerald">${monthRate}%</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Total Done</div>
                <div style="font-size: 20px; font-weight: 800; color: #fff;" class="font-mono">${totalDoneThisMonth}</div>
              </div>
              <div style="width: 1px; height: 30px; background: rgba(255,255,255,0.1);"></div>
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Flawless Days</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--gold);" class="font-mono">${flawlessDays}</div>
              </div>
              <div style="width: 1px; height: 30px; background: rgba(255,255,255,0.1);"></div>
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Best Streak</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--cyan);" class="font-mono">🔥 ${bestStreak}d</div>
              </div>
            </div>
          </div>

          <!-- Quick System Shortcuts -->
          <div class="quick-card shortcuts-card">
            <span class="section-title">⚡ Quick Actions</span>
            <div class="shortcuts-btns-grid">
              <button class="shortcut-btn" id="quick-start-focus-btn" style="border-color: rgba(6, 182, 212, 0.4); color: var(--cyan);">
                <span>⏱️</span> Deep Work
              </button>
              <button class="shortcut-btn" id="quick-add-habit-btn">
                <span>➕</span> Add Habit
              </button>
              <button class="shortcut-btn" id="quick-view-charts-btn">
                <span>📈</span> View Charts
              </button>
              <button class="shortcut-btn" id="quick-view-streaks-btn">
                <span>🔥</span> View Streaks
              </button>
              <button class="shortcut-btn" id="quick-confetti-btn">
                <span>🎉</span> Celebrate
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Badges & Consistency Milestones Showcase -->
      <div class="overview-badges-card" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 22px; margin-top: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin: 0 0 2px 0;">🏆 Consistency Badges & Milestones</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin: 0;">Unlock achievements through unbroken daily discipline.</p>
          </div>
          <span style="font-size: 12px; font-weight: 800; color: var(--gold); background: rgba(245, 158, 11, 0.12); padding: 4px 12px; border-radius: 9999px; border: 1px solid rgba(245, 158, 11, 0.25);" class="font-mono">
            ${(() => {
              let checksCount = 0;
              habitsList.forEach(h => {
                if (h.checks) {
                  Object.values(h.checks).forEach(mc => { checksCount += Object.keys(mc).length; });
                }
              });
              const lf = (data.focus && data.focus.lifetimeSessions) || 0;
              const unlockedCount = [
                checksCount >= 1,
                bestStreak >= 7,
                bestStreak >= 14,
                bestStreak >= 30,
                lf >= 1,
                checksCount >= 100
              ].filter(Boolean).length;
              return `${unlockedCount} / 6 Unlocked`;
            })()}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          ${(() => {
            let checksCount = 0;
            habitsList.forEach(h => {
              if (h.checks) {
                Object.values(h.checks).forEach(mc => { checksCount += Object.keys(mc).length; });
              }
            });
            const lf = (data.focus && data.focus.lifetimeSessions) || 0;
            const badgeList = [
              { icon: '🥉', name: 'First Spark', desc: 'Completed first habit', unlocked: checksCount >= 1 },
              { icon: '🛡️', name: 'Iron Will', desc: '7-day streak reached', unlocked: bestStreak >= 7 },
              { icon: '🧘', name: 'Monk Mode', desc: '14-day streak reached', unlocked: bestStreak >= 14 },
              { icon: '👑', name: 'Titan', desc: '30-day streak reached', unlocked: bestStreak >= 30 },
              { icon: '⏱️', name: 'Deep Worker', desc: 'Completed focus session', unlocked: lf >= 1 },
              { icon: '💎', name: 'Centurion', desc: '100 total habit check-ins', unlocked: checksCount >= 100 }
            ];
            return badgeList.map(b => `
              <div style="background: ${b.unlocked ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.35)'}; border: 1px solid ${b.unlocked ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255,255,255,0.06)'}; border-radius: 12px; padding: 14px; display: flex; align-items: center; gap: 12px; opacity: ${b.unlocked ? '1' : '0.45'}; transition: all 0.2s;">
                <span style="font-size: 26px; filter: ${b.unlocked ? 'none' : 'grayscale(1)'};">${b.icon}</span>
                <div>
                  <div style="font-size: 13px; font-weight: 800; color: ${b.unlocked ? '#fff' : '#94a3b8'};">${b.name}</div>
                  <div style="font-size: 11px; color: ${b.unlocked ? 'var(--cyan)' : '#64748b'};">${b.desc}</div>
                </div>
              </div>
            `).join('');
          })()}
        </div>
      </div>
    </div>
  `;

  attachOverviewHandlers(container);
}

function attachOverviewHandlers(container) {
  // Navigation shortcuts
  const navBtns = container.querySelectorAll('.nav-shortcut-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.targetTab;
      window.dispatchEvent(new CustomEvent('switch-tab', { detail: { tab } }));
      sounds.playPop();
    });
  });

  const chartsBtn = container.querySelector('#quick-view-charts-btn');
  if (chartsBtn) {
    chartsBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('switch-tab', { detail: { tab: 'charts' } }));
      sounds.playPop();
    });
  }

  const focusBtn = container.querySelector('#quick-start-focus-btn');
  if (focusBtn) {
    focusBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('switch-tab', { detail: { tab: 'focus' } }));
      sounds.playPop();
    });
  }

  // Fast habit toggle
  const checkBtns = container.querySelectorAll('.fast-check-btn');
  checkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const habitId = btn.dataset.habitId;
      const day = parseInt(btn.dataset.day);
      const customMonthKey = btn.dataset.monthKey;
      const isChecked = btn.classList.contains('checked');

      if (!isChecked) {
        sounds.playCheck();
        btn.classList.add('checked');
        const parent = btn.closest('.fast-habit-item');
        if (parent) parent.classList.add('completed');
      } else {
        sounds.playUncheck();
        btn.classList.remove('checked');
        const parent = btn.closest('.fast-habit-item');
        if (parent) parent.classList.remove('completed');
      }

      store.toggleHabitDay(habitId, day, customMonthKey);
    });
  });

  // Quick modals
  const addHabitBtn = container.querySelector('#quick-add-habit-btn');
  if (addHabitBtn) {
    addHabitBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-modal', { detail: { modal: 'add-habit' } }));
      sounds.playPop();
    });
  }

  const viewStreaksBtn = container.querySelector('#quick-view-streaks-btn');
  if (viewStreaksBtn) {
    viewStreaksBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('switch-tab', { detail: { tab: 'streaks' } }));
      sounds.playPop();
    });
  }


  const confettiBtn = container.querySelector('#quick-confetti-btn');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
      sounds.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    });
  }
}
