import { store } from '../store.js';
import { sounds } from '../audio.js';
import confetti from 'canvas-confetti';

// Active view state
let selectedRange = 'month'; // '7d' | '14d' | 'month'
let selectedMetric = 'pct';  // 'pct' | 'count'

export function renderChartsView(container) {
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
  const dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const habits = data.habits || [];
  const totalHabits = habits.length;

  // 1. Calculate Day-by-Day Stats
  const dayStats = [];
  let totalCompletionsInMonth = 0;
  let flawlessDaysCount = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    let completedCount = 0;
    const completedHabitNames = [];

    habits.forEach(h => {
      if (h.checks && h.checks[monthKey] && h.checks[monthKey][d]) {
        completedCount++;
        totalCompletionsInMonth++;
        completedHabitNames.push(h.name);
      }
    });

    const pct = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
    if (totalHabits > 0 && completedCount === totalHabits) flawlessDaysCount++;

    const dateObj = new Date(currentYear, currentMonth, d);
    dayStats.push({
      day: d,
      dateObj,
      dayOfWeekShort: dayNamesShort[dateObj.getDay()],
      dayOfWeekFull: dayNamesFull[dateObj.getDay()],
      dayOfWeekIndex: dateObj.getDay(),
      completed: completedCount,
      total: totalHabits,
      percent: pct,
      isToday: isCurrentMonth && d === todayDay,
      habits: completedHabitNames
    });
  }

  // Filter day stats based on selectedRange
  let filteredDays = [...dayStats];
  if (selectedRange === '7d') {
    const endDay = isCurrentMonth ? todayDay : daysInMonth;
    const startDay = Math.max(1, endDay - 6);
    filteredDays = dayStats.filter(d => d.day >= startDay && d.day <= endDay);
  } else if (selectedRange === '14d') {
    const endDay = isCurrentMonth ? todayDay : daysInMonth;
    const startDay = Math.max(1, endDay - 13);
    filteredDays = dayStats.filter(d => d.day >= startDay && d.day <= endDay);
  }

  // Overall Range Metrics
  const rangePossible = filteredDays.length * totalHabits;
  const rangeDone = filteredDays.reduce((acc, d) => acc + d.completed, 0);
  const rangeAvgPct = rangePossible > 0 ? Math.round((rangeDone / rangePossible) * 100) : 0;

  // 2. Day-of-Week Aggregates (Mon - Sun)
  // Index order: 1 (Mon), 2 (Tue), 3 (Wed), 4 (Thu), 5 (Fri), 6 (Sat), 0 (Sun)
  const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];
  const weekdayStats = weekdayOrder.map(wIdx => {
    const matchingDays = dayStats.filter(d => d.dayOfWeekIndex === wIdx);
    const count = matchingDays.length;
    const totalDone = matchingDays.reduce((acc, d) => acc + d.completed, 0);
    const possible = count * totalHabits;
    const avgPct = possible > 0 ? Math.round((totalDone / possible) * 100) : 0;

    return {
      nameShort: dayNamesShort[wIdx],
      nameFull: dayNamesFull[wIdx],
      avgPct,
      totalDone,
      occurrences: count
    };
  });

  // Best performing day
  let bestWeekday = weekdayStats[0];
  weekdayStats.forEach(ws => {
    if (ws.avgPct > bestWeekday.avgPct) bestWeekday = ws;
  });

  // Weekday vs Weekend Average
  const weekdayDays = weekdayStats.slice(0, 5);
  const weekendDays = weekdayStats.slice(5, 7);
  const weekdayAvg = Math.round(weekdayDays.reduce((a, b) => a + b.avgPct, 0) / 5);
  const weekendAvg = Math.round(weekendDays.reduce((a, b) => a + b.avgPct, 0) / 2);

  // 3. Category Breakdown for Donut Chart
  const categoryMap = {};
  const categoryPalette = {
    'Health': '#10b981',
    'Productivity': '#38bdf8',
    'Mindset': '#a855f7',
    'Evening': '#f59e0b',
    'Morning': '#f97316',
    'Fitness': '#06b6d4',
    'General': '#6366f1'
  };

  habits.forEach(h => {
    const cat = h.category || 'General';
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        habitsCount: 0,
        checksCount: 0,
        color: categoryPalette[cat] || h.color || '#38bdf8'
      };
    }
    categoryMap[cat].habitsCount++;

    const checks = (h.checks && h.checks[monthKey]) || {};
    categoryMap[cat].checksCount += Object.keys(checks).length;
  });

  const categories = Object.values(categoryMap).sort((a, b) => b.checksCount - a.checksCount);
  const totalCatChecks = categories.reduce((acc, c) => acc + c.checksCount, 0);

  categories.forEach(c => {
    c.percent = totalCatChecks > 0 ? Math.round((c.checksCount / totalCatChecks) * 100) : 0;
  });

  // 4. Habit Ranking Leaderboard
  const rankedHabits = habits.map(h => {
    const checks = (h.checks && h.checks[monthKey]) || {};
    const done = Object.keys(checks).length;
    const rate = daysInMonth > 0 ? Math.round((done / daysInMonth) * 100) : 0;
    const streak = store.getHabitStreak(h.id);

    let tier = 'Elite';
    let tierColor = '#10b981';
    if (rate < 50) { tier = 'Needs Focus'; tierColor = '#f43f5e'; }
    else if (rate < 75) { tier = 'Building'; tierColor = '#f59e0b'; }
    else if (rate < 90) { tier = 'Strong'; tierColor = '#06b6d4'; }

    return {
      ...h,
      done,
      rate,
      streak,
      tier,
      tierColor
    };
  }).sort((a, b) => b.rate - a.rate);

  // 5. SVG Line Graph Path Generation
  const svgW = 900;
  const svgH = 320;
  const padLeft = 55;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 50;

  const plotW = svgW - padLeft - padRight;
  const plotH = svgH - padTop - padBottom;

  const pointCount = filteredDays.length;
  const points = filteredDays.map((d, idx) => {
    const x = padLeft + (pointCount > 1 ? (idx / (pointCount - 1)) * plotW : plotW / 2);
    const val = selectedMetric === 'pct' ? d.percent : (totalHabits > 0 ? (d.completed / totalHabits) * 100 : 0);
    const y = padTop + plotH - ((val / 100) * plotH);
    return {
      x,
      y,
      val,
      day: d.day,
      dayName: d.dayOfWeekShort,
      completed: d.completed,
      total: d.total,
      pct: d.percent,
      isToday: d.isToday
    };
  });

  // Spline Path Builder (Smooth Bezier)
  function createSpline(pts) {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let p = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const midX = (p0.x + p1.x) / 2;
      p += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return p;
  }

  const linePath = createSpline(points);
  const bottomY = padTop + plotH;
  const firstX = points.length > 0 ? points[0].x : padLeft;
  const lastX = points.length > 0 ? points[points.length - 1].x : padLeft + plotW;
  const areaPath = points.length > 0 ? `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z` : '';

  // 80% Benchmark Line Y
  const benchmarkY = padTop + plotH - (0.8 * plotH);

  // 6. SVG Donut Chart Math
  const donutRadius = 95;
  const donutCircumference = 2 * Math.PI * donutRadius; // ≈ 596.9
  let currentOffset = 0;
  const donutSlices = categories.map(cat => {
    const fraction = totalCatChecks > 0 ? cat.checksCount / totalCatChecks : (1 / Math.max(1, categories.length));
    const dashLength = fraction * donutCircumference;
    const gapLength = donutCircumference - dashLength;
    const offset = currentOffset;
    currentOffset += dashLength;

    return {
      ...cat,
      fraction,
      dashLength,
      gapLength,
      offset
    };
  });

  container.innerHTML = `
    <div class="analytics-view">
      
      <!-- Top Title Bar & Time Switchers -->
      <div class="analytics-header-card">
        <div class="analytics-title-wrap">
          <div class="section-badge">
            <span class="live-dot pulse"></span> PERFORMANCE METRICS & CHARTS
          </div>
          <h2 class="view-title">Discipline Analytics & Insights</h2>
          <p class="view-subtitle">Interactive line graphs, category breakdowns, and weekday performance curves</p>
        </div>

        <div class="analytics-controls">
          <!-- Range Picker Buttons -->
          <div class="analytics-segmented-control" id="range-toggle-group">
            <button class="seg-btn ${selectedRange === '7d' ? 'active' : ''}" data-range="7d">Last 7 Days</button>
            <button class="seg-btn ${selectedRange === '14d' ? 'active' : ''}" data-range="14d">Last 14 Days</button>
            <button class="seg-btn ${selectedRange === 'month' ? 'active' : ''}" data-range="month">This Month</button>
          </div>

          <!-- Metric Picker Buttons -->
          <div class="analytics-segmented-control" id="metric-toggle-group">
            <button class="seg-btn ${selectedMetric === 'pct' ? 'active' : ''}" data-metric="pct">% Consistency</button>
            <button class="seg-btn ${selectedMetric === 'count' ? 'active' : ''}" data-metric="count">Habits Done</button>
          </div>

          <button id="charts-share-card-btn" class="nexus-btn btn-primary" title="Export Social Streak Brag Card">
            <span>📸</span> Share Brag Card
          </button>
        </div>
      </div>

      <!-- 4 Top KPI Analytics Cards -->
      <div class="analytics-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Discipline Velocity</span>
            <span class="kpi-icon" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">📈</span>
          </div>
          <div class="kpi-val text-cyan font-mono">${rangeAvgPct}%</div>
          <div class="kpi-subtext">Average completion over ${filteredDays.length} days</div>
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill bg-cyan" style="width: ${rangeAvgPct}%;"></div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Peak Discipline Day</span>
            <span class="kpi-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">🏆</span>
          </div>
          <div class="kpi-val text-emerald font-mono">${bestWeekday.nameShort} <span class="kpi-val-sub">(${bestWeekday.avgPct}%)</span></div>
          <div class="kpi-subtext">Highest habit adherence weekday</div>
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill bg-emerald" style="width: ${bestWeekday.avgPct}%;"></div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Flawless 100% Days</span>
            <span class="kpi-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">✨</span>
          </div>
          <div class="kpi-val text-gold font-mono">${flawlessDaysCount} <span class="kpi-val-sub">/ ${daysInMonth} Days</span></div>
          <div class="kpi-subtext">Every single habit ticked off</div>
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill bg-gold" style="width: ${daysInMonth > 0 ? (flawlessDaysCount / daysInMonth) * 100 : 0}%;"></div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Total Check-Ins</span>
            <span class="kpi-icon" style="background: rgba(168, 85, 247, 0.15); color: #a855f7;">⚡</span>
          </div>
          <div class="kpi-val text-violet font-mono">${totalCompletionsInMonth}</div>
          <div class="kpi-subtext">Logged in ${monthNames[currentMonth]} ${currentYear}</div>
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill bg-violet" style="width: ${Math.min(100, Math.max(15, (totalCompletionsInMonth / (totalHabits * daysInMonth || 1)) * 100))}%;"></div>
          </div>
        </div>
      </div>

      <!-- Main Line Graph: Daily Trend Curve -->
      <div class="chart-panel-card line-chart-card">
        <div class="chart-panel-header">
          <div>
            <h3 class="chart-panel-title">
              <span>📈</span> Daily Discipline & Completion Curve
            </h3>
            <p class="chart-panel-subtitle">
              Interactive trend line of daily habit execution for ${monthNames[currentMonth]} ${currentYear}
            </p>
          </div>
          <div class="chart-legend-wrap">
            <span class="legend-item"><span class="legend-dot bg-cyan"></span> Actual Completion</span>
            <span class="legend-item"><span class="legend-dot bg-gold dashed"></span> 80% Target Goal</span>
          </div>
        </div>

        <!-- SVG Line Graph Viewport -->
        <div class="chart-svg-container" id="line-chart-container">
          <svg viewBox="0 0 ${svgW} ${svgH}" class="analytics-line-svg" preserveAspectRatio="none">
            <defs>
              <!-- Gradient under curve -->
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.38"/>
                <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.12"/>
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0"/>
              </linearGradient>

              <!-- Stroke Gradient -->
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#06b6d4"/>
                <stop offset="50%" stop-color="#38bdf8"/>
                <stop offset="100%" stop-color="#10b981"/>
              </linearGradient>

              <!-- Filter for Point Glow -->
              <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#38bdf8" flood-opacity="0.8"/>
              </filter>
            </defs>

            <!-- Grid Horizontal Reference Lines -->
            <line x1="${padLeft}" y1="${padTop}" x2="${svgW - padRight}" y2="${padTop}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <text x="${padLeft - 10}" y="${padTop + 4}" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">100%</text>

            <line x1="${padLeft}" y1="${padTop + (plotH * 0.25)}" x2="${svgW - padRight}" y2="${padTop + (plotH * 0.25)}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <text x="${padLeft - 10}" y="${padTop + (plotH * 0.25) + 4}" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">75%</text>

            <line x1="${padLeft}" y1="${padTop + (plotH * 0.50)}" x2="${svgW - padRight}" y2="${padTop + (plotH * 0.50)}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <text x="${padLeft - 10}" y="${padTop + (plotH * 0.50) + 4}" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">50%</text>

            <line x1="${padLeft}" y1="${padTop + (plotH * 0.75)}" x2="${svgW - padRight}" y2="${padTop + (plotH * 0.75)}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <text x="${padLeft - 10}" y="${padTop + (plotH * 0.75) + 4}" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">25%</text>

            <line x1="${padLeft}" y1="${bottomY}" x2="${svgW - padRight}" y2="${bottomY}" stroke="rgba(255,255,255,0.12)" />
            <text x="${padLeft - 10}" y="${bottomY + 4}" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">0%</text>

            <!-- 80% Target Benchmark Line -->
            <line x1="${padLeft}" y1="${benchmarkY}" x2="${svgW - padRight}" y2="${benchmarkY}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.65" />

            <!-- Shaded Area Fill -->
            ${areaPath ? `<path d="${areaPath}" fill="url(#areaGradient)" />` : ''}

            <!-- Spline Line Curve -->
            ${linePath ? `<path d="${linePath}" fill="none" stroke="url(#strokeGradient)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />` : ''}

            <!-- X-Axis Day Labels & Interactive Points -->
            ${points.map((pt) => `
              <g class="chart-point-group" data-day="${pt.day}" data-name="${pt.dayName}" data-pct="${pt.pct}" data-done="${pt.completed}" data-total="${pt.total}">
                <!-- Hover Guide Line (Hidden by default, shown via CSS on hover) -->
                <line x1="${pt.x}" y1="${padTop}" x2="${pt.x}" y2="${bottomY}" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" stroke-dasharray="2,2" class="point-guide-line" />
                
                <!-- Data Point Circle -->
                <circle cx="${pt.x}" cy="${pt.y}" r="${pt.isToday ? 6.5 : 4.5}" fill="${pt.isToday ? '#10b981' : '#38bdf8'}" stroke="#070a12" stroke-width="2.5" class="chart-data-circle" filter="url(#pointGlow)"/>
                
                <!-- X Label -->
                <text x="${pt.x}" y="${bottomY + 22}" fill="${pt.isToday ? '#10b981' : '#94a3b8'}" font-size="11" font-weight="${pt.isToday ? '800' : '600'}" text-anchor="middle" font-family="'JetBrains Mono', monospace">
                  ${pt.day}
                </text>
              </g>
            `).join('')}
          </svg>

          <!-- Floating Tooltip for Interactive Inspection -->
          <div id="chart-floating-tooltip" class="chart-tooltip" style="display: none;">
            <div class="tooltip-date font-mono" id="tt-date">--</div>
            <div class="tooltip-score text-cyan font-mono" id="tt-score">0% Discipline</div>
            <div class="tooltip-count text-muted" id="tt-count">0/0 Habits Completed</div>
          </div>
        </div>
      </div>

      <!-- Dual Grid: Category Pie/Donut Diagram + Weekday Bar Chart -->
      <div class="analytics-dual-grid">
        
        <!-- Chart 2: Category Donut / Pie Diagram -->
        <div class="chart-panel-card donut-chart-card">
          <div class="chart-panel-header">
            <div>
              <h3 class="chart-panel-title">
                <span>🍩</span> Habit Category Distribution
              </h3>
              <p class="chart-panel-subtitle">Proportion of consistency & energy allocation</p>
            </div>
            <span class="badge-pill font-mono">${categories.length} Categories</span>
          </div>

          <div class="donut-content-layout">
            <!-- SVG Donut Graphic -->
            <div class="donut-svg-wrap">
              <svg viewBox="0 0 300 300" class="donut-svg">
                <!-- Drop Shadow Filter -->
                <defs>
                  <filter id="donutGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#38bdf8" flood-opacity="0.4"/>
                  </filter>
                </defs>

                <!-- Track Background -->
                <circle cx="150" cy="150" r="${donutRadius}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="28" />

                <!-- Donut Slices -->
                <g transform="rotate(-90 150 150)">
                  ${donutSlices.map(s => `
                    <circle cx="150" cy="150" r="${donutRadius}"
                            fill="none"
                            stroke="${s.color}"
                            stroke-width="28"
                            stroke-dasharray="${s.dashLength} ${s.gapLength}"
                            stroke-dashoffset="-${s.offset}"
                            class="donut-segment"
                            data-cat="${s.name}"
                            data-pct="${s.percent}"
                            data-checks="${s.checksCount}">
                    </circle>
                  `).join('')}
                </g>

                <!-- Donut Center Text -->
                <text x="150" y="140" fill="#fff" font-size="28" font-weight="800" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif">
                  ${totalCatChecks}
                </text>
                <text x="150" y="165" fill="#64748b" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1" font-family="'JetBrains Mono', monospace">
                  TOTAL CHECKS
                </text>
              </svg>
            </div>

            <!-- Category Legend Table & Progress Bars -->
            <div class="donut-legend-list">
              ${categories.map(c => `
                <div class="category-legend-card" style="border-left: 3px solid ${c.color};">
                  <div class="cat-legend-top">
                    <div class="cat-name-group">
                      <span class="cat-dot" style="background: ${c.color}; box-shadow: 0 0 8px ${c.color};"></span>
                      <span class="cat-title">${c.name}</span>
                    </div>
                    <span class="cat-pct font-mono" style="color: ${c.color};">${c.percent}%</span>
                  </div>
                  <div class="cat-legend-sub font-mono">
                    <span>${c.checksCount} check-ins</span> • <span>${c.habitsCount} habits</span>
                  </div>
                  <div class="cat-bar-track">
                    <div class="cat-bar-fill" style="width: ${c.percent}%; background: ${c.color};"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Chart 3: Day-of-the-Week Consistency Bar Chart -->
        <div class="chart-panel-card weekday-chart-card">
          <div class="chart-panel-header">
            <div>
              <h3 class="chart-panel-title">
                <span>📊</span> Weekday Adherence Pattern
              </h3>
              <p class="chart-panel-subtitle">Consistency performance from Monday through Sunday</p>
            </div>
            <div class="weekday-badges">
              <span class="badge-pill font-mono text-cyan">W-Days: ${weekdayAvg}%</span>
              <span class="badge-pill font-mono text-gold">Weekend: ${weekendAvg}%</span>
            </div>
          </div>

          <div class="weekday-bars-container">
            ${weekdayStats.map(ws => {
              const isBest = ws.nameShort === bestWeekday.nameShort;
              return `
                <div class="weekday-bar-col ${isBest ? 'is-best' : ''}">
                  <span class="bar-val-label font-mono">${ws.avgPct}%</span>
                  <div class="bar-pill-track">
                    <div class="bar-pill-fill ${isBest ? 'bg-gold' : 'bg-cyan'}" style="height: ${Math.max(12, ws.avgPct)}%;">
                      ${isBest ? '<span class="crown-icon">👑</span>' : ''}
                    </div>
                  </div>
                  <span class="bar-day-name font-mono ${isBest ? 'text-gold' : ''}">${ws.nameShort}</span>
                  <span class="bar-occ-label font-mono">${ws.totalDone} checks</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

      <!-- Chart 4: Habit-by-Habit Ranking Performance Matrix -->
      <div class="chart-panel-card leaderboard-chart-card">
        <div class="chart-panel-header">
          <div>
            <h3 class="chart-panel-title">
              <span>🏆</span> Routine Consistency Ranking & Tier Matrix
            </h3>
            <p class="chart-panel-subtitle">Sorted by monthly adherence rate and unbroken streak length</p>
          </div>
          <span class="badge-pill">${rankedHabits.length} Habits Tracked</span>
        </div>

        <div class="ranking-matrix-list">
          ${rankedHabits.map((h, idx) => {
            return `
              <div class="ranking-row">
                <!-- Rank Medal -->
                <div class="rank-pos-badge ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : ''} font-mono">
                  #${idx + 1}
                </div>

                <!-- Habit Identity -->
                <div class="rank-habit-identity">
                  <div class="rank-emoji-box" style="background: ${h.color}22; border-color: ${h.color}60;">
                    ${h.emoji}
                  </div>
                  <div class="rank-name-info">
                    <span class="rank-habit-title">${h.name}</span>
                    <span class="rank-habit-meta font-mono" style="color: ${h.color};">${h.category} • ${h.timeOfDay}</span>
                  </div>
                </div>

                <!-- Progress Bar & Completion Ratio -->
                <div class="rank-bar-wrap">
                  <div class="rank-bar-info">
                    <span class="rank-stat font-mono text-white">${h.done}/${daysInMonth} Days Logged</span>
                    <span class="rank-pct font-mono" style="color: ${h.color};">${h.rate}%</span>
                  </div>
                  <div class="rank-track">
                    <div class="rank-fill" style="width: ${h.rate}%; background: ${h.color}; box-shadow: 0 0 10px ${h.color}55;"></div>
                  </div>
                </div>

                <!-- Streak Flame Badge -->
                <div class="rank-streak-pill font-mono">
                  🔥 ${h.streak}d
                </div>

                <!-- Performance Tier Badge -->
                <div class="rank-tier-pill font-mono" style="color: ${h.tierColor}; border-color: ${h.tierColor}40; background: ${h.tierColor}18;">
                  ${h.tier}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;

  attachChartsEventHandlers(container);
}

function attachChartsEventHandlers(container) {
  // Range Switcher
  const rangeBtns = container.querySelectorAll('#range-toggle-group .seg-btn');
  rangeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      selectedRange = btn.dataset.range;
      sounds.playPop();
      renderChartsView(container);
    });
  });

  // Metric Switcher
  const metricBtns = container.querySelectorAll('#metric-toggle-group .seg-btn');
  metricBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      selectedMetric = btn.dataset.metric;
      sounds.playPop();
      renderChartsView(container);
    });
  });

  // Share Card Button
  const shareBtn = container.querySelector('#charts-share-card-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-modal', { detail: { modal: 'share-streak' } }));
      sounds.playPop();
    });
  }

  // Interactive Hover on Line Graph Points
  const pointGroups = container.querySelectorAll('.chart-point-group');
  const tooltip = container.querySelector('#chart-floating-tooltip');
  const svgContainer = container.querySelector('#line-chart-container');
  const ttDate = container.querySelector('#tt-date');
  const ttScore = container.querySelector('#tt-score');
  const ttCount = container.querySelector('#tt-count');

  pointGroups.forEach(group => {
    group.addEventListener('mouseenter', (e) => {
      const day = group.dataset.day;
      const dayName = group.dataset.name;
      const pct = group.dataset.pct;
      const done = group.dataset.done;
      const total = group.dataset.total;

      if (tooltip && ttDate && ttScore && ttCount) {
        ttDate.textContent = `Day ${day} (${dayName})`;
        ttScore.textContent = `${pct}% Discipline Score`;
        ttCount.textContent = `${done} of ${total} Habits Completed`;
        tooltip.style.display = 'block';

        // Position tooltip relative to container
        const rect = svgContainer.getBoundingClientRect();
        const circle = group.querySelector('.chart-data-circle');
        const cRect = circle.getBoundingClientRect();
        const leftPos = cRect.left - rect.left - 70;
        const topPos = cRect.top - rect.top - 80;

        tooltip.style.left = `${Math.max(10, Math.min(rect.width - 160, leftPos))}px`;
        tooltip.style.top = `${Math.max(10, topPos)}px`;
      }
      sounds.playPop();
    });

    group.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.display = 'none';
    });
  });
}
