var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=new class{constructor(){this.STORAGE_KEY=`axio_os_data_v3`,this.BACKUP_KEY=`axio_os_backup_snapshot_v3`,this.listeners=[],this.data=this.loadData()}getDefaultData(){let e=new Date,t=e.getFullYear(),n=e.getMonth(),r=e.getDate(),i={},a={},o={},s={},c={},l={},u={},d={},f=`${t}-${String(n+1).padStart(2,`0`)}`;return{selectedYear:t,selectedMonth:n,user:{name:`Executive`,xp:0,characterClass:`Rookie`},settings:{weekStart:`Mo`,clockFormat:`12h`,theme:`cyberpunk`,sound:!0},focus:{sessionsToday:0,totalMinutesToday:0,lifetimeSessions:0,lastSessionDate:`${t}-${String(n+1).padStart(2,`0`)}-${String(r).padStart(2,`0`)}`},habits:[{id:`h1`,name:`Wake up at 05:00`,emoji:`⏰`,category:`Morning`,color:`#38bdf8`,timeOfDay:`05:00 AM`,checks:{[f]:i}},{id:`h2`,name:`Morning Movement & Exercise`,emoji:`🏃`,category:`Health`,color:`#10b981`,timeOfDay:`07:00 AM`,checks:{[f]:a}},{id:`h3`,name:`Drink 3.5L Pure Water`,emoji:`💧`,category:`Health`,color:`#06b6d4`,timeOfDay:`All Day`,checks:{[f]:o}},{id:`h4`,name:`Read 20 Pages`,emoji:`📖`,category:`Mindset`,color:`#a855f7`,timeOfDay:`02:00 PM`,checks:{[f]:s}},{id:`h5`,name:`2h Deep Work / Coding`,emoji:`💻`,category:`Productivity`,color:`#6366f1`,timeOfDay:`10:00 AM`,checks:{[f]:c}},{id:`h6`,name:`Clean Diet & High Protein`,emoji:`🥗`,category:`Health`,color:`#22c55e`,timeOfDay:`All Day`,checks:{[f]:l}},{id:`h7`,name:`15m Mindfulness & Breathwork`,emoji:`🧘`,category:`Mindset`,color:`#ec4899`,timeOfDay:`08:00 PM`,checks:{[f]:u}},{id:`h8`,name:`In Bed by 10:45 PM`,emoji:`🌙`,category:`Evening`,color:`#f59e0b`,timeOfDay:`10:45 PM`,checks:{[f]:d}}],lastActiveDate:`${t}-${String(n+1).padStart(2,`0`)}-${String(r).padStart(2,`0`)}`}}loadData(){try{[`nexus_prime_data_v1`,`nexus_prime_backup_snapshot`,`axio_os_data_v1`,`axio_os_backup_snapshot`,`axio_os_data_v2`,`axio_os_backup_snapshot_v2`].forEach(e=>{try{localStorage.removeItem(e)}catch{}})}catch{}try{let e=localStorage.getItem(this.STORAGE_KEY);if(e){let t=JSON.parse(e);return this.migrateSettings(t),t}let t=localStorage.getItem(this.BACKUP_KEY);if(t){let e=JSON.parse(t);return this.migrateSettings(e),e}}catch(e){console.warn(`Failed to parse saved state`,e)}let e=this.getDefaultData();return this.saveData(e),e}migrateSettings(e){let t=!1;e.settings||(e.settings={},t=!0);let n={weekStart:`Mo`,clockFormat:`12h`,theme:`cyberpunk`,sound:!0};for(let r in n)e.settings[r]===void 0&&(e.settings[r]=n[r],t=!0);if(e.focus||(e.focus={sessionsToday:0,totalMinutesToday:0,lifetimeSessions:0,lastSessionDate:e.lastActiveDate||``},t=!0),!e.lastActiveDate){if(e.gym&&e.gym.lastActiveDate)e.lastActiveDate=e.gym.lastActiveDate;else{let t=new Date;e.lastActiveDate=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}-${String(t.getDate()).padStart(2,`0`)}`}t=!0}if(e.habits&&Array.isArray(e.habits)&&e.habits.forEach(e=>{e.name&&(e.name.toLowerCase().includes(`gym`)||e.name.toLowerCase().includes(`workout`)||e.name.toLowerCase().includes(`iron`))&&(e.name=`Morning Movement & Exercise`,e.emoji=`🏃`,e.category=`Health`,t=!0)}),e.gym&&(delete e.gym,t=!0),e.expenses&&(delete e.expenses,t=!0),t)try{localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e)),localStorage.setItem(this.BACKUP_KEY,JSON.stringify(e))}catch{}}checkDailyReset(){let e=new Date,t=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`;this.data.lastActiveDate?this.data.lastActiveDate!==t&&(this.data.lastActiveDate=t,this.data.selectedYear=e.getFullYear(),this.data.selectedMonth=e.getMonth(),this.data.focus&&(this.data.focus.sessionsToday=0,this.data.focus.totalMinutesToday=0,this.data.focus.lastSessionDate=t),this.saveData(),this.notify(`day_rolled_over`)):(this.data.lastActiveDate=t,this.saveData())}recordFocusSession(e,t=null){this.data.focus||(this.data.focus={sessionsToday:0,totalMinutesToday:0,lifetimeSessions:0,lastSessionDate:``});let n=new Date,r=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,`0`)}-${String(n.getDate()).padStart(2,`0`)}`;if(this.data.focus.lastSessionDate!==r&&(this.data.focus.sessionsToday=0,this.data.focus.totalMinutesToday=0,this.data.focus.lastSessionDate=r),this.data.focus.sessionsToday=(this.data.focus.sessionsToday||0)+1,this.data.focus.totalMinutesToday=(this.data.focus.totalMinutesToday||0)+e,this.data.focus.lifetimeSessions=(this.data.focus.lifetimeSessions||0)+1,this.addXP(50,`Completed ${e}m Focus Session`),t){let e=n.getDate(),r=this.getMonthKey(n.getFullYear(),n.getMonth()),i=this.data.habits.find(e=>e.id===t);i&&(i.checks||={},i.checks[r]||(i.checks[r]={}),i.checks[r][e]||this.toggleHabitDay(t,e,r))}this.saveData(),this.notify(`focus_session_completed`,{minutes:e,habitId:t})}saveData(e=this.data){try{let t=JSON.stringify(e);localStorage.setItem(this.STORAGE_KEY,t),localStorage.setItem(this.BACKUP_KEY,t)}catch(e){console.error(`Storage quota or error`,e)}}getStorageStats(){try{let e=localStorage.getItem(this.STORAGE_KEY)||``,t=new Blob([e]).size,n=(t/1024).toFixed(1),r=5120;return{bytes:t,kb:n,maxKB:r,pct:Math.min(100,(t/(r*1024)*100).toFixed(2)),yearsRemaining:Math.max(25,Math.floor((r-parseFloat(n))/35))}}catch{return{bytes:0,kb:`0`,maxKB:5120,pct:`0`,yearsRemaining:30}}}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}notify(e,t={}){this.saveData(),this.listeners.forEach(n=>n(this.data,e,t))}addXP(e,t=``){let n=this.getLevelInfo().level;this.data.user.xp=Math.max(0,(this.data.user.xp||0)+e);let r=this.getLevelInfo().level,i=!1;return r>n&&(i=!0),this.notify(`xp_changed`,{amount:e,reason:t,leveledUp:i,newLevel:r}),{leveledUp:i,newLevel:r}}getLevelInfo(){let e=this.data.user.xp||0,t=Math.floor(e/350)+1,n=(t-1)*350;t*350;let r=e-n,i=Math.min(100,Math.round(r/350*100)),a=[`Cadet`,`Novice`,`Iron Will`,`Striker`,`Vanguard`,`Centurion`,`Spartan`,`Discipline Master`,`Apex Sovereign`,`Mythic Ascendant`];return{level:t,title:a[Math.min(a.length-1,t-1)]||`Titan`,currentXP:e,progressInLevel:r,neededInLevel:350,percent:i}}getMonthKey(e=this.data.selectedYear,t=this.data.selectedMonth){return`${e}-${String(t+1).padStart(2,`0`)}`}setSelectedMonthYear(e,t){this.data.selectedYear=e,this.data.selectedMonth=t,this.notify(`month_year_changed`)}toggleHabitDay(e,t,n=null){let r=n||this.getMonthKey(),i=this.data.habits.find(t=>t.id===e);i&&(i.checks||={},i.checks[r]||(i.checks[r]={}),i.checks[r][t]?(delete i.checks[r][t],this.addXP(-25,`Uncheck habit`),this.notify(`habit_toggled`,{habitId:e,dayNumber:t,monthKey:r,checked:!1})):(i.checks[r][t]=!0,this.addXP(25,`Completed: ${i.name}`),this.notify(`habit_toggled`,{habitId:e,dayNumber:t,monthKey:r,checked:!0})))}addHabit({name:e,emoji:t,category:n,color:r,timeOfDay:i}){let a={id:`h_`+Date.now(),name:e.trim(),emoji:t||`⭐`,category:n||`General`,color:r||`#38bdf8`,timeOfDay:i||`Anytime`,checks:{}};this.data.habits.push(a),this.addXP(50,`Created new habit`),this.notify(`habit_added`,{habit:a})}deleteHabit(e){this.data.habits=this.data.habits.filter(t=>t.id!==e),this.notify(`habit_deleted`,{habitId:e})}getHabitStreak(e,t=this.data.selectedYear,n=this.data.selectedMonth){let r=this.data.habits.find(t=>t.id===e);if(!r||!r.checks)return 0;let i=new Date,a=i.getFullYear()===t&&i.getMonth()===n,o=`${t}-${String(n+1).padStart(2,`0`)}`,s=r.checks[o]||{},c=0;if(a){let e=i.getDate(),t=e;for(s[t]||(t=e-1);t>0&&s[t];)c++,t--}else{let e=new Date(t,n+1,0).getDate(),r=0,i=0;for(let t=1;t<=e;t++)s[t]?(r++,r>i&&(i=r)):r=0;c=i}return c}updateSettings(e){this.data.settings||(this.data.settings={}),this.data.settings={...this.data.settings,...e},this.saveData(),this.notify(`settings_updated`,{settings:this.data.settings})}resetToDefault(){this.data=this.getDefaultData(),this.saveData(),this.notify(`reset`)}exportJSON(){return JSON.stringify(this.data,null,2)}importJSON(e){try{let t=JSON.parse(e);if(t&&t.habits)return this.data=t,this.saveData(),this.notify(`imported`),!0}catch(e){console.error(e)}return!1}},u=new class{constructor(){this.ctx=null,this.enabled=localStorage.getItem(`axio_sound_enabled`)!==`false`}init(){if(!this.ctx){let e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state===`suspended`&&this.ctx.resume()}toggleSound(){return this.enabled=!this.enabled,localStorage.setItem(`axio_sound_enabled`,this.enabled),this.enabled&&this.playCheck(),this.enabled}playPop(){if(this.enabled&&(this.init(),this.ctx))try{let e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type=`sine`,e.frequency.setValueAtTime(440,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(880,this.ctx.currentTime+.06),t.gain.setValueAtTime(.12,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.06),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.07)}catch(e){console.warn(e)}}playCheck(){if(this.enabled&&(this.init(),this.ctx))try{let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain(),r=this.ctx.createBiquadFilter();r.type=`bandpass`,r.frequency.setValueAtTime(1400,e),r.Q.setValueAtTime(2,e),t.type=`sine`,t.frequency.setValueAtTime(320,e),t.frequency.exponentialRampToValueAtTime(70,e+.035),n.gain.setValueAtTime(.24,e),n.gain.exponentialRampToValueAtTime(.001,e+.038);let i=this.ctx.createOscillator(),a=this.ctx.createGain();i.type=`sine`,i.frequency.setValueAtTime(880,e),i.frequency.exponentialRampToValueAtTime(587.33,e+.06),a.gain.setValueAtTime(.07,e),a.gain.exponentialRampToValueAtTime(.001,e+.065),t.connect(r),r.connect(n),n.connect(this.ctx.destination),i.connect(a),a.connect(this.ctx.destination),t.start(e),i.start(e),t.stop(e+.04),i.stop(e+.07)}catch(e){console.warn(e)}}playUncheck(){if(this.enabled&&(this.init(),this.ctx))try{let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain(),r=this.ctx.createBiquadFilter();r.type=`lowpass`,r.frequency.setValueAtTime(800,e),t.type=`sine`,t.frequency.setValueAtTime(220,e),t.frequency.exponentialRampToValueAtTime(60,e+.032),n.gain.setValueAtTime(.12,e),n.gain.exponentialRampToValueAtTime(.001,e+.035),t.connect(r),r.connect(n),n.connect(this.ctx.destination),t.start(e),t.stop(e+.036)}catch(e){console.warn(e)}}playLevelUp(){if(this.enabled&&(this.init(),this.ctx))try{[523.25,659.25,783.99,1046.5].forEach((e,t)=>{let n=this.ctx.createOscillator(),r=this.ctx.createGain(),i=this.ctx.currentTime+t*.09;n.type=`triangle`,n.frequency.setValueAtTime(e,i),r.gain.setValueAtTime(.15,i),r.gain.exponentialRampToValueAtTime(.001,i+.35),n.connect(r),r.connect(this.ctx.destination),n.start(i),n.stop(i+.36)})}catch(e){console.warn(e)}}playStreak(){if(this.enabled&&(this.init(),this.ctx))try{[440,554.37,659.25,880].forEach((e,t)=>{let n=this.ctx.createOscillator(),r=this.ctx.createGain(),i=this.ctx.currentTime+t*.08;n.type=`triangle`,n.frequency.setValueAtTime(e,i),r.gain.setValueAtTime(.18,i),r.gain.exponentialRampToValueAtTime(.001,i+.32),n.connect(r),r.connect(this.ctx.destination),n.start(i),n.stop(i+.33)})}catch(e){console.warn(e)}}playDing(){if(this.enabled&&(this.init(),this.ctx))try{let e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type=`sine`,e.frequency.setValueAtTime(1200,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(800,this.ctx.currentTime+.4),t.gain.setValueAtTime(.2,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.4),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.41)}catch(e){console.warn(e)}}playWater(){if(this.enabled&&(this.init(),this.ctx))try{let e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type=`sine`,e.frequency.setValueAtTime(650,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(950,this.ctx.currentTime+.08),t.gain.setValueAtTime(.15,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.12),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.13)}catch(e){console.warn(e)}}playBell(){if(this.enabled&&(this.init(),this.ctx))try{let e=this.ctx.currentTime;[528,792,1056].forEach((t,n)=>{let r=this.ctx.createOscillator(),i=this.ctx.createGain();r.type=`sine`,r.frequency.setValueAtTime(t,e);let a=[.26,.12,.05][n];i.gain.setValueAtTime(a,e),i.gain.exponentialRampToValueAtTime(1e-4,e+2.6),r.connect(i),i.connect(this.ctx.destination),r.start(e),r.stop(e+2.65)})}catch(e){console.warn(e)}}startAmbient(e=`brown`,t=.5){if(this.stopAmbient(),this.init(),this.ctx)try{this.ambientVolume=Math.max(0,Math.min(1,t)),this.ambientGain=this.ctx.createGain(),this.ambientGain.gain.setValueAtTime(this.ambientVolume,this.ctx.currentTime),this.ambientGain.connect(this.ctx.destination),this.ambientType=e;let n=this.ctx.sampleRate;if(e===`brown`){let e=n*3,t=this.ctx.createBuffer(1,e,n),r=t.getChannelData(0),i=0;for(let t=0;t<e;t++){let e=Math.random()*2-1;i=(i+.02*e)/1.02,r[t]=i*3.5}let a=this.ctx.createBufferSource();a.buffer=t,a.loop=!0;let o=this.ctx.createBiquadFilter();o.type=`lowpass`,o.frequency.setValueAtTime(450,this.ctx.currentTime),a.connect(o),o.connect(this.ambientGain),a.start(),this.ambientSource=a}else if(e===`rain`){let e=n*3,t=this.ctx.createBuffer(1,e,n),r=t.getChannelData(0),i=0,a=0,o=0,s=0,c=0,l=0,u=0;for(let t=0;t<e;t++){let e=Math.random()*2-1;i=.99886*i+e*.0555179,a=.99332*a+e*.0750759,o=.969*o+e*.153852,s=.8665*s+e*.3104856,c=.55*c+e*.5329522,l=-.7616*l-e*.016898,r[t]=(i+a+o+s+c+l+u+e*.5362)*.12,u=e*.115926}let d=this.ctx.createBufferSource();d.buffer=t,d.loop=!0;let f=this.ctx.createBiquadFilter();f.type=`lowpass`,f.frequency.setValueAtTime(1100,this.ctx.currentTime),d.connect(f),f.connect(this.ambientGain),d.start(),this.ambientSource=d,this.ambientInterval=setInterval(()=>{if(this.ctx&&this.ambientGain)try{let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type=`sine`;let r=1900+Math.random()*1400;t.frequency.setValueAtTime(r,e),t.frequency.exponentialRampToValueAtTime(r*.5,e+.038),n.gain.setValueAtTime(.015,e),n.gain.exponentialRampToValueAtTime(1e-4,e+.042),t.connect(n),n.connect(this.ambientGain),t.start(e),t.stop(e+.045)}catch{}},240)}else if(e===`binaural`){let e=this.ctx.createOscillator(),t=this.ctx.createOscillator();e.type=`sine`,t.type=`sine`,e.frequency.setValueAtTime(216,this.ctx.currentTime),t.frequency.setValueAtTime(226,this.ctx.currentTime);let n=this.ctx.createStereoPanner?this.ctx.createStereoPanner():null,r=this.ctx.createStereoPanner?this.ctx.createStereoPanner():null;n&&r?(n.pan.setValueAtTime(-.85,this.ctx.currentTime),r.pan.setValueAtTime(.85,this.ctx.currentTime),e.connect(n),n.connect(this.ambientGain),t.connect(r),r.connect(this.ambientGain)):(e.connect(this.ambientGain),t.connect(this.ambientGain)),e.start(),t.start(),this.ambientSource=[e,t]}else e===`keyboard`&&(this.ambientInterval=setInterval(()=>{if(this.ctx&&this.ambientGain)try{let e=this.ctx.currentTime,t=this.ctx.createOscillator(),n=this.ctx.createGain(),r=this.ctx.createBiquadFilter();r.type=`bandpass`,r.frequency.setValueAtTime(1700+Math.random()*900,e),r.Q.setValueAtTime(3,e),t.type=`sine`,t.frequency.setValueAtTime(320+Math.random()*90,e),t.frequency.exponentialRampToValueAtTime(70,e+.024),n.gain.setValueAtTime(.08,e),n.gain.exponentialRampToValueAtTime(.001,e+.027),t.connect(r),r.connect(n),n.connect(this.ambientGain),t.start(e),t.stop(e+.03)}catch{}},280))}catch(e){console.warn(`Ambient start error:`,e)}}stopAmbient(){if(this.ambientInterval&&=(clearInterval(this.ambientInterval),null),this.ambientSource){try{Array.isArray(this.ambientSource)?this.ambientSource.forEach(e=>{try{e.stop(),e.disconnect()}catch{}}):(this.ambientSource.stop(),this.ambientSource.disconnect())}catch{}this.ambientSource=null}if(this.ambientGain){try{this.ambientGain.disconnect()}catch{}this.ambientGain=null}this.ambientType=null}setAmbientVolume(e){this.ambientVolume=Math.max(0,Math.min(1,e)),this.ambientGain&&this.ctx&&this.ambientGain.gain.setValueAtTime(this.ambientVolume,this.ctx.currentTime)}isAmbientPlaying(){return!!(this.ambientSource||this.ambientInterval)}},d={};(function e(t,n,r,i){var a=!!(t.Worker&&t.Blob&&t.Promise&&t.OffscreenCanvas&&t.OffscreenCanvasRenderingContext2D&&t.HTMLCanvasElement&&t.HTMLCanvasElement.prototype.transferControlToOffscreen&&t.URL&&t.URL.createObjectURL),o=typeof Path2D==`function`&&typeof DOMMatrix==`function`,s=(function(){if(!t.OffscreenCanvas)return!1;try{var e=new OffscreenCanvas(1,1),n=e.getContext(`2d`);n.fillRect(0,0,1,1);var r=e.transferToImageBitmap();n.createPattern(r,`no-repeat`)}catch{return!1}return!0})();function c(){}function l(e){var r=n.exports.Promise,i=r===void 0?t.Promise:r;return typeof i==`function`?new i(e):(e(c,c),null)}var u=(function(e,t){return{transform:function(n){if(e)return n;if(t.has(n))return t.get(n);var r=new OffscreenCanvas(n.width,n.height);return r.getContext(`2d`).drawImage(n,0,0),t.set(n,r),r},clear:function(){t.clear()}}})(s,new Map),d=function(){var e,t,n={},r=0;return typeof requestAnimationFrame==`function`&&typeof cancelAnimationFrame==`function`?(e=function(e){var t=Math.random();return n[t]=requestAnimationFrame(function i(a){r===a||r+16-1<a?(r=a,delete n[t],e()):n[t]=requestAnimationFrame(i)}),t},t=function(e){n[e]&&cancelAnimationFrame(n[e])}):(e=function(e){return setTimeout(e,16)},t=function(e){return clearTimeout(e)}),{frame:e,cancel:t}}(),f=(function(){var t,n,i={};function o(e){function t(t,n){e.postMessage({options:t||{},callback:n})}e.init=function(t){var n=t.transferControlToOffscreen();e.postMessage({canvas:n},[n])},e.fire=function(r,a,o){if(n)return t(r,null),n;var s=Math.random().toString(36).slice(2);return n=l(function(a){function c(t){t.data.callback===s&&(delete i[s],e.removeEventListener(`message`,c),n=null,u.clear(),o(),a())}e.addEventListener(`message`,c),t(r,s),i[s]=c.bind(null,{data:{callback:s}})}),n},e.reset=function(){for(var t in e.postMessage({reset:!0}),i)i[t](),delete i[t]}}return function(){if(t)return t;if(!r&&a){var n=[`var CONFETTI, SIZE = {}, module = {};`,`(`+e.toString()+`)(this, module, true, SIZE);`,`onmessage = function(msg) {`,`  if (msg.data.options) {`,`    CONFETTI(msg.data.options).then(function () {`,`      if (msg.data.callback) {`,`        postMessage({ callback: msg.data.callback });`,`      }`,`    });`,`  } else if (msg.data.reset) {`,`    CONFETTI && CONFETTI.reset();`,`  } else if (msg.data.resize) {`,`    SIZE.width = msg.data.resize.width;`,`    SIZE.height = msg.data.resize.height;`,`  } else if (msg.data.canvas) {`,`    SIZE.width = msg.data.canvas.width;`,`    SIZE.height = msg.data.canvas.height;`,`    CONFETTI = module.exports.create(msg.data.canvas);`,`  }`,`}`].join(`
`);try{t=new Worker(URL.createObjectURL(new Blob([n])))}catch(e){return typeof console<`u`&&typeof console.warn==`function`&&console.warn(`🎊 Could not load worker`,e),null}o(t)}return t}})(),p={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:[`square`,`circle`],zIndex:100,colors:[`#26ccff`,`#a25afd`,`#ff5e7e`,`#88ff5a`,`#fcff42`,`#ffa62d`,`#ff36ff`],disableForReducedMotion:!1,scalar:1};function m(e,t){return t?t(e):e}function h(e){return e!=null}function g(e,t,n){return m(e&&h(e[t])?e[t]:p[t],n)}function _(e){return e<0?0:Math.floor(e)}function v(e,t){return Math.floor(Math.random()*(t-e))+e}function y(e){return parseInt(e,16)}function b(e){return e.map(x)}function x(e){var t=String(e).replace(/[^0-9a-f]/gi,``);return t.length<6&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),{r:y(t.substring(0,2)),g:y(t.substring(2,4)),b:y(t.substring(4,6))}}function S(e){var t=g(e,`origin`,Object);return t.x=g(t,`x`,Number),t.y=g(t,`y`,Number),t}function C(e){e.width=document.documentElement.clientWidth,e.height=document.documentElement.clientHeight}function w(e){var t=e.getBoundingClientRect();e.width=t.width,e.height=t.height}function T(e){var t=document.createElement(`canvas`);return t.style.position=`fixed`,t.style.top=`0px`,t.style.left=`0px`,t.style.pointerEvents=`none`,t.style.zIndex=e,t}function E(e,t,n,r,i,a,o,s,c){e.save(),e.translate(t,n),e.rotate(a),e.scale(r,i),e.arc(0,0,1,o,s,c),e.restore()}function D(e){var t=e.angle*(Math.PI/180),n=e.spread*(Math.PI/180);return{x:e.x,y:e.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:e.startVelocity*.5+Math.random()*e.startVelocity,angle2D:-t+(.5*n-Math.random()*n),tiltAngle:(Math.random()*.5+.25)*Math.PI,color:e.color,shape:e.shape,tick:0,totalTicks:e.ticks,decay:e.decay,drift:e.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:e.gravity*3,ovalScalar:.6,scalar:e.scalar,flat:e.flat}}function O(e,t){t.x+=Math.cos(t.angle2D)*t.velocity+t.drift,t.y+=Math.sin(t.angle2D)*t.velocity+t.gravity,t.velocity*=t.decay,t.flat?(t.wobble=0,t.wobbleX=t.x+10*t.scalar,t.wobbleY=t.y+10*t.scalar,t.tiltSin=0,t.tiltCos=0,t.random=1):(t.wobble+=t.wobbleSpeed,t.wobbleX=t.x+10*t.scalar*Math.cos(t.wobble),t.wobbleY=t.y+10*t.scalar*Math.sin(t.wobble),t.tiltAngle+=.1,t.tiltSin=Math.sin(t.tiltAngle),t.tiltCos=Math.cos(t.tiltAngle),t.random=Math.random()+2);var n=t.tick++/t.totalTicks,r=t.x+t.random*t.tiltCos,i=t.y+t.random*t.tiltSin,a=t.wobbleX+t.random*t.tiltCos,s=t.wobbleY+t.random*t.tiltSin;if(e.fillStyle=`rgba(`+t.color.r+`, `+t.color.g+`, `+t.color.b+`, `+(1-n)+`)`,e.beginPath(),o&&t.shape.type===`path`&&typeof t.shape.path==`string`&&Array.isArray(t.shape.matrix))e.fill(N(t.shape.path,t.shape.matrix,t.x,t.y,Math.abs(a-r)*.1,Math.abs(s-i)*.1,Math.PI/10*t.wobble));else if(t.shape.type===`bitmap`){var c=Math.PI/10*t.wobble,l=Math.abs(a-r)*.1,d=Math.abs(s-i)*.1,f=t.shape.bitmap.width*t.scalar,p=t.shape.bitmap.height*t.scalar,m=new DOMMatrix([Math.cos(c)*l,Math.sin(c)*l,-Math.sin(c)*d,Math.cos(c)*d,t.x,t.y]);m.multiplySelf(new DOMMatrix(t.shape.matrix));var h=e.createPattern(u.transform(t.shape.bitmap),`no-repeat`);h.setTransform(m),e.globalAlpha=1-n,e.fillStyle=h,e.fillRect(t.x-f/2,t.y-p/2,f,p),e.globalAlpha=1}else if(t.shape===`circle`)e.ellipse?e.ellipse(t.x,t.y,Math.abs(a-r)*t.ovalScalar,Math.abs(s-i)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI):E(e,t.x,t.y,Math.abs(a-r)*t.ovalScalar,Math.abs(s-i)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI);else if(t.shape===`star`)for(var g=Math.PI/2*3,_=4*t.scalar,v=8*t.scalar,y=t.x,b=t.y,x=5,S=Math.PI/x;x--;)y=t.x+Math.cos(g)*v,b=t.y+Math.sin(g)*v,e.lineTo(y,b),g+=S,y=t.x+Math.cos(g)*_,b=t.y+Math.sin(g)*_,e.lineTo(y,b),g+=S;else e.moveTo(Math.floor(t.x),Math.floor(t.y)),e.lineTo(Math.floor(t.wobbleX),Math.floor(i)),e.lineTo(Math.floor(a),Math.floor(s)),e.lineTo(Math.floor(r),Math.floor(t.wobbleY));return e.closePath(),e.fill(),t.tick<t.totalTicks}function k(e,t,n,a,o){var s=t.slice(),c=e.getContext(`2d`),f,p,m=l(function(t){function l(){f=p=null,c.clearRect(0,0,a.width,a.height),u.clear(),o(),t()}function m(){r&&(a.width!==i.width||a.height!==i.height)&&(a.width=e.width=i.width,a.height=e.height=i.height),!a.width&&!a.height&&(n(e),a.width=e.width,a.height=e.height),c.clearRect(0,0,a.width,a.height),s=s.filter(function(e){return O(c,e)}),s.length?f=d.frame(m):l()}f=d.frame(m),p=l});return{addFettis:function(e){return s=s.concat(e),m},canvas:e,promise:m,reset:function(){f&&d.cancel(f),p&&p()}}}function A(e,n){var r=!e,i=!!g(n||{},`resize`),o=!1,s=g(n,`disableForReducedMotion`,Boolean),c=a&&g(n||{},`useWorker`)?f():null,u=r?C:w,d=e&&c?!!e.__confetti_initialized:!1,p=typeof matchMedia==`function`&&matchMedia(`(prefers-reduced-motion)`).matches,m;function h(t,n,r){for(var i=g(t,`particleCount`,_),a=g(t,`angle`,Number),o=g(t,`spread`,Number),s=g(t,`startVelocity`,Number),c=g(t,`decay`,Number),l=g(t,`gravity`,Number),d=g(t,`drift`,Number),f=g(t,`colors`,b),p=g(t,`ticks`,Number),h=g(t,`shapes`),y=g(t,`scalar`),x=!!g(t,`flat`),C=S(t),w=i,T=[],E=e.width*C.x,O=e.height*C.y;w--;)T.push(D({x:E,y:O,angle:a,spread:o,startVelocity:s,color:f[w%f.length],shape:h[v(0,h.length)],ticks:p,decay:c,gravity:l,drift:d,scalar:y,flat:x}));return m?m.addFettis(T):(m=k(e,T,u,n,r),m.promise)}function y(n){var a=s||g(n,`disableForReducedMotion`,Boolean),f=g(n,`zIndex`,Number);if(a&&p)return l(function(e){e()});r&&m?e=m.canvas:r&&!e&&(e=T(f),document.body.appendChild(e)),i&&!d&&u(e);var _={width:e.width,height:e.height};c&&!d&&c.init(e),d=!0,c&&(e.__confetti_initialized=!0);function v(){if(c){var t={getBoundingClientRect:function(){if(!r)return e.getBoundingClientRect()}};u(t),c.postMessage({resize:{width:t.width,height:t.height}})}else _.width=_.height=null}function y(){m=null,i&&(o=!1,t.removeEventListener(`resize`,v)),r&&e&&(document.body.contains(e)&&document.body.removeChild(e),e=null,d=!1)}return i&&!o&&(o=!0,t.addEventListener(`resize`,v,!1)),c?c.fire(n,_,y):h(n,_,y)}return y.reset=function(){c&&c.reset(),m&&m.reset()},y}var j;function M(){return j||=A(null,{useWorker:!0,resize:!0}),j}function N(e,t,n,r,i,a,o){var s=new Path2D(e),c=new Path2D;c.addPath(s,new DOMMatrix(t));var l=new Path2D;return l.addPath(c,new DOMMatrix([Math.cos(o)*i,Math.sin(o)*i,-Math.sin(o)*a,Math.cos(o)*a,n,r])),l}function P(e){if(!o)throw Error(`path confetti are not supported in this browser`);var t,n;typeof e==`string`?t=e:(t=e.path,n=e.matrix);var r=new Path2D(t),i=document.createElement(`canvas`).getContext(`2d`);if(!n){for(var a=1e3,s=a,c=a,l=0,u=0,d,f,p=0;p<a;p+=2)for(var m=0;m<a;m+=2)i.isPointInPath(r,p,m,`nonzero`)&&(s=Math.min(s,p),c=Math.min(c,m),l=Math.max(l,p),u=Math.max(u,m));d=l-s,f=u-c;var h=10,g=Math.min(h/d,h/f);n=[g,0,0,g,-Math.round(d/2+s)*g,-Math.round(f/2+c)*g]}return{type:`path`,path:t,matrix:n}}function ee(e){var t,n=1,r=`#000000`,i=`"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif`;typeof e==`string`?t=e:(t=e.text,n=`scalar`in e?e.scalar:n,i=`fontFamily`in e?e.fontFamily:i,r=`color`in e?e.color:r);var a=10*n,o=``+a+`px `+i,s=new OffscreenCanvas(a,a),c=s.getContext(`2d`);c.font=o;var l=c.measureText(t),u=Math.ceil(l.actualBoundingBoxRight+l.actualBoundingBoxLeft),d=Math.ceil(l.actualBoundingBoxAscent+l.actualBoundingBoxDescent),f=2,p=l.actualBoundingBoxLeft+f,m=l.actualBoundingBoxAscent+f;u+=f+f,d+=f+f,s=new OffscreenCanvas(u,d),c=s.getContext(`2d`),c.font=o,c.fillStyle=r,c.fillText(t,p,m);var h=1/n;return{type:`bitmap`,bitmap:s.transferToImageBitmap(),matrix:[h,0,0,h,-u*h/2,-d*h/2]}}n.exports=function(){return M().apply(this,arguments)},n.exports.reset=function(){M().reset()},n.exports.create=A,n.exports.shapeFromPath=P,n.exports.shapeFromText=ee})((function(){return typeof window<`u`?window:typeof self<`u`?self:this||{}})(),d,!1);var f=d.exports;d.exports.create;var p=o(((e,t)=>{t.exports=function(){return typeof Promise==`function`&&Promise.prototype&&Promise.prototype.then}})),m=o((e=>{var t,n=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];e.getSymbolSize=function(e){if(!e)throw Error(`"version" cannot be null or undefined`);if(e<1||e>40)throw Error(`"version" should be in range from 1 to 40`);return e*4+17},e.getSymbolTotalCodewords=function(e){return n[e]},e.getBCHDigit=function(e){let t=0;for(;e!==0;)t++,e>>>=1;return t},e.setToSJISFunction=function(e){if(typeof e!=`function`)throw Error(`"toSJISFunc" is not a valid function.`);t=e},e.isKanjiModeEnabled=function(){return t!==void 0},e.toSJIS=function(e){return t(e)}})),h=o((e=>{e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(t){if(typeof t!=`string`)throw Error(`Param is not a string`);switch(t.toLowerCase()){case`l`:case`low`:return e.L;case`m`:case`medium`:return e.M;case`q`:case`quartile`:return e.Q;case`h`:case`high`:return e.H;default:throw Error(`Unknown EC Level: `+t)}}e.isValid=function(e){return e&&e.bit!==void 0&&e.bit>=0&&e.bit<4},e.from=function(n,r){if(e.isValid(n))return n;try{return t(n)}catch{return r}}})),g=o(((e,t)=>{function n(){this.buffer=[],this.length=0}n.prototype={get:function(e){let t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)==1},put:function(e,t){for(let n=0;n<t;n++)this.putBit((e>>>t-n-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(e){let t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}},t.exports=n})),_=o(((e,t)=>{function n(e){if(!e||e<1)throw Error(`BitMatrix size must be defined and greater than 0`);this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}n.prototype.set=function(e,t,n,r){let i=e*this.size+t;this.data[i]=n,r&&(this.reservedBit[i]=!0)},n.prototype.get=function(e,t){return this.data[e*this.size+t]},n.prototype.xor=function(e,t,n){this.data[e*this.size+t]^=n},n.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]},t.exports=n})),v=o((e=>{var t=m().getSymbolSize;e.getRowColCoords=function(e){if(e===1)return[];let n=Math.floor(e/7)+2,r=t(e),i=r===145?26:Math.ceil((r-13)/(2*n-2))*2,a=[r-7];for(let e=1;e<n-1;e++)a[e]=a[e-1]-i;return a.push(6),a.reverse()},e.getPositions=function(t){let n=[],r=e.getRowColCoords(t),i=r.length;for(let e=0;e<i;e++)for(let t=0;t<i;t++)e===0&&t===0||e===0&&t===i-1||e===i-1&&t===0||n.push([r[e],r[t]]);return n}})),y=o((e=>{var t=m().getSymbolSize,n=7;e.getPositions=function(e){let r=t(e);return[[0,0],[r-n,0],[0,r-n]]}})),b=o((e=>{e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(e){return e!=null&&e!==``&&!isNaN(e)&&e>=0&&e<=7},e.from=function(t){return e.isValid(t)?parseInt(t,10):void 0},e.getPenaltyN1=function(e){let n=e.size,r=0,i=0,a=0,o=null,s=null;for(let c=0;c<n;c++){i=a=0,o=s=null;for(let l=0;l<n;l++){let n=e.get(c,l);n===o?i++:(i>=5&&(r+=t.N1+(i-5)),o=n,i=1),n=e.get(l,c),n===s?a++:(a>=5&&(r+=t.N1+(a-5)),s=n,a=1)}i>=5&&(r+=t.N1+(i-5)),a>=5&&(r+=t.N1+(a-5))}return r},e.getPenaltyN2=function(e){let n=e.size,r=0;for(let t=0;t<n-1;t++)for(let i=0;i<n-1;i++){let n=e.get(t,i)+e.get(t,i+1)+e.get(t+1,i)+e.get(t+1,i+1);(n===4||n===0)&&r++}return r*t.N2},e.getPenaltyN3=function(e){let n=e.size,r=0,i=0,a=0;for(let t=0;t<n;t++){i=a=0;for(let o=0;o<n;o++)i=i<<1&2047|e.get(t,o),o>=10&&(i===1488||i===93)&&r++,a=a<<1&2047|e.get(o,t),o>=10&&(a===1488||a===93)&&r++}return r*t.N3},e.getPenaltyN4=function(e){let n=0,r=e.data.length;for(let t=0;t<r;t++)n+=e.data[t];return Math.abs(Math.ceil(n*100/r/5)-10)*t.N4};function n(t,n,r){switch(t){case e.Patterns.PATTERN000:return(n+r)%2==0;case e.Patterns.PATTERN001:return n%2==0;case e.Patterns.PATTERN010:return r%3==0;case e.Patterns.PATTERN011:return(n+r)%3==0;case e.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(r/3))%2==0;case e.Patterns.PATTERN101:return n*r%2+n*r%3==0;case e.Patterns.PATTERN110:return(n*r%2+n*r%3)%2==0;case e.Patterns.PATTERN111:return(n*r%3+(n+r)%2)%2==0;default:throw Error(`bad maskPattern:`+t)}}e.applyMask=function(e,t){let r=t.size;for(let i=0;i<r;i++)for(let a=0;a<r;a++)t.isReserved(a,i)||t.xor(a,i,n(e,a,i))},e.getBestMask=function(t,n){let r=Object.keys(e.Patterns).length,i=0,a=1/0;for(let o=0;o<r;o++){n(o),e.applyMask(o,t);let r=e.getPenaltyN1(t)+e.getPenaltyN2(t)+e.getPenaltyN3(t)+e.getPenaltyN4(t);e.applyMask(o,t),r<a&&(a=r,i=o)}return i}})),x=o((e=>{var t=h(),n=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],r=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];e.getBlocksCount=function(e,r){switch(r){case t.L:return n[(e-1)*4+0];case t.M:return n[(e-1)*4+1];case t.Q:return n[(e-1)*4+2];case t.H:return n[(e-1)*4+3];default:return}},e.getTotalCodewordsCount=function(e,n){switch(n){case t.L:return r[(e-1)*4+0];case t.M:return r[(e-1)*4+1];case t.Q:return r[(e-1)*4+2];case t.H:return r[(e-1)*4+3];default:return}}})),S=o((e=>{var t=new Uint8Array(512),n=new Uint8Array(256);(function(){let e=1;for(let r=0;r<255;r++)t[r]=e,n[e]=r,e<<=1,e&256&&(e^=285);for(let e=255;e<512;e++)t[e]=t[e-255]})(),e.log=function(e){if(e<1)throw Error(`log(`+e+`)`);return n[e]},e.exp=function(e){return t[e]},e.mul=function(e,r){return e===0||r===0?0:t[n[e]+n[r]]}})),C=o((e=>{var t=S();e.mul=function(e,n){let r=new Uint8Array(e.length+n.length-1);for(let i=0;i<e.length;i++)for(let a=0;a<n.length;a++)r[i+a]^=t.mul(e[i],n[a]);return r},e.mod=function(e,n){let r=new Uint8Array(e);for(;r.length-n.length>=0;){let e=r[0];for(let i=0;i<n.length;i++)r[i]^=t.mul(n[i],e);let i=0;for(;i<r.length&&r[i]===0;)i++;r=r.slice(i)}return r},e.generateECPolynomial=function(n){let r=new Uint8Array([1]);for(let i=0;i<n;i++)r=e.mul(r,new Uint8Array([1,t.exp(i)]));return r}})),w=o(((e,t)=>{var n=C();function r(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}r.prototype.initialize=function(e){this.degree=e,this.genPoly=n.generateECPolynomial(this.degree)},r.prototype.encode=function(e){if(!this.genPoly)throw Error(`Encoder not initialized`);let t=new Uint8Array(e.length+this.degree);t.set(e);let r=n.mod(t,this.genPoly),i=this.degree-r.length;if(i>0){let e=new Uint8Array(this.degree);return e.set(r,i),e}return r},t.exports=r})),T=o((e=>{e.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}})),E=o((e=>{var t=`[0-9]+`,n=`[A-Z $%*+\\-./:]+`,r=`(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+`;r=r.replace(/u/g,`\\u`);var i=`(?:(?![A-Z0-9 $%*+\\-./:]|`+r+`)(?:.|[\r
]))+`;e.KANJI=new RegExp(r,`g`),e.BYTE_KANJI=RegExp(`[^A-Z0-9 $%*+\\-./:]+`,`g`),e.BYTE=new RegExp(i,`g`),e.NUMERIC=new RegExp(t,`g`),e.ALPHANUMERIC=new RegExp(n,`g`);var a=RegExp(`^`+r+`$`),o=RegExp(`^[0-9]+$`),s=RegExp(`^[A-Z0-9 $%*+\\-./:]+$`);e.testKanji=function(e){return a.test(e)},e.testNumeric=function(e){return o.test(e)},e.testAlphanumeric=function(e){return s.test(e)}})),D=o((e=>{var t=T(),n=E();e.NUMERIC={id:`Numeric`,bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:`Alphanumeric`,bit:2,ccBits:[9,11,13]},e.BYTE={id:`Byte`,bit:4,ccBits:[8,16,16]},e.KANJI={id:`Kanji`,bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(e,n){if(!e.ccBits)throw Error(`Invalid mode: `+e);if(!t.isValid(n))throw Error(`Invalid version: `+n);return n>=1&&n<10?e.ccBits[0]:n<27?e.ccBits[1]:e.ccBits[2]},e.getBestModeForData=function(t){return n.testNumeric(t)?e.NUMERIC:n.testAlphanumeric(t)?e.ALPHANUMERIC:n.testKanji(t)?e.KANJI:e.BYTE},e.toString=function(e){if(e&&e.id)return e.id;throw Error(`Invalid mode`)},e.isValid=function(e){return e&&e.bit&&e.ccBits};function r(t){if(typeof t!=`string`)throw Error(`Param is not a string`);switch(t.toLowerCase()){case`numeric`:return e.NUMERIC;case`alphanumeric`:return e.ALPHANUMERIC;case`kanji`:return e.KANJI;case`byte`:return e.BYTE;default:throw Error(`Unknown mode: `+t)}}e.from=function(t,n){if(e.isValid(t))return t;try{return r(t)}catch{return n}}})),O=o((e=>{var t=m(),n=x(),r=h(),i=D(),a=T(),o=7973,s=t.getBCHDigit(o);function c(t,n,r){for(let i=1;i<=40;i++)if(n<=e.getCapacity(i,r,t))return i}function l(e,t){return i.getCharCountIndicator(e,t)+4}function u(e,t){let n=0;return e.forEach(function(e){let r=l(e.mode,t);n+=r+e.getBitsLength()}),n}function d(t,n){for(let r=1;r<=40;r++)if(u(t,r)<=e.getCapacity(r,n,i.MIXED))return r}e.from=function(e,t){return a.isValid(e)?parseInt(e,10):t},e.getCapacity=function(e,r,o){if(!a.isValid(e))throw Error(`Invalid QR Code version`);o===void 0&&(o=i.BYTE);let s=(t.getSymbolTotalCodewords(e)-n.getTotalCodewordsCount(e,r))*8;if(o===i.MIXED)return s;let c=s-l(o,e);switch(o){case i.NUMERIC:return Math.floor(c/10*3);case i.ALPHANUMERIC:return Math.floor(c/11*2);case i.KANJI:return Math.floor(c/13);case i.BYTE:default:return Math.floor(c/8)}},e.getBestVersionForData=function(e,t){let n,i=r.from(t,r.M);if(Array.isArray(e)){if(e.length>1)return d(e,i);if(e.length===0)return 1;n=e[0]}else n=e;return c(n.mode,n.getLength(),i)},e.getEncodedBits=function(e){if(!a.isValid(e)||e<7)throw Error(`Invalid QR Code version`);let n=e<<12;for(;t.getBCHDigit(n)-s>=0;)n^=o<<t.getBCHDigit(n)-s;return e<<12|n}})),k=o((e=>{var t=m(),n=1335,r=21522,i=t.getBCHDigit(n);e.getEncodedBits=function(e,a){let o=e.bit<<3|a,s=o<<10;for(;t.getBCHDigit(s)-i>=0;)s^=n<<t.getBCHDigit(s)-i;return(o<<10|s)^r}})),A=o(((e,t)=>{var n=D();function r(e){this.mode=n.NUMERIC,this.data=e.toString()}r.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(e){let t,n,r;for(t=0;t+3<=this.data.length;t+=3)n=this.data.substr(t,3),r=parseInt(n,10),e.put(r,10);let i=this.data.length-t;i>0&&(n=this.data.substr(t),r=parseInt(n,10),e.put(r,i*3+1))},t.exports=r})),j=o(((e,t)=>{var n=D(),r=`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:`.split(``);function i(e){this.mode=n.ALPHANUMERIC,this.data=e}i.getBitsLength=function(e){return 11*Math.floor(e/2)+e%2*6},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(e){let t=0;for(;t+2<=this.data.length;t+=2){let n=r.indexOf(this.data[t])*45;n+=r.indexOf(this.data[t+1]),e.put(n,11)}this.data.length%2&&e.put(r.indexOf(this.data[t]),6)},t.exports=i})),M=o(((e,t)=>{var n=D();function r(e){this.mode=n.BYTE,this.data=typeof e==`string`?new TextEncoder().encode(e):new Uint8Array(e)}r.getBitsLength=function(e){return e*8},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(e){for(let t=0,n=this.data.length;t<n;t++)e.put(this.data[t],8)},t.exports=r})),N=o(((e,t)=>{var n=D(),r=m();function i(e){this.mode=n.KANJI,this.data=e}i.getBitsLength=function(e){return e*13},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(e){let t=0;for(;t<this.data.length;t++){let n=r.toSJIS(this.data[t]);if(n>=33088&&n<=40956)n-=33088;else if(n>=57408&&n<=60351)n-=49472;else throw Error(`Invalid SJIS character: `+this.data[t]+`
Make sure your charset is UTF-8`);n=(n>>>8&255)*192+(n&255),e.put(n,13)}},t.exports=i})),P=o(((e,t)=>{var n={single_source_shortest_paths:function(e,t,r){var i={},a={};a[t]=0;var o=n.PriorityQueue.make();o.push(t,0);for(var s,c,l,u,d,f,p,m,h;!o.empty();)for(l in s=o.pop(),c=s.value,u=s.cost,d=e[c]||{},d)d.hasOwnProperty(l)&&(f=d[l],p=u+f,m=a[l],h=a[l]===void 0,(h||m>p)&&(a[l]=p,o.push(l,p),i[l]=c));if(r!==void 0&&a[r]===void 0){var g=[`Could not find a path from `,t,` to `,r,`.`].join(``);throw Error(g)}return i},extract_shortest_path_from_predecessor_list:function(e,t){for(var n=[],r=t;r;)n.push(r),e[r],r=e[r];return n.reverse(),n},find_path:function(e,t,r){var i=n.single_source_shortest_paths(e,t,r);return n.extract_shortest_path_from_predecessor_list(i,r)},PriorityQueue:{make:function(e){var t=n.PriorityQueue,r={},i;for(i in e||={},t)t.hasOwnProperty(i)&&(r[i]=t[i]);return r.queue=[],r.sorter=e.sorter||t.default_sorter,r},default_sorter:function(e,t){return e.cost-t.cost},push:function(e,t){var n={value:e,cost:t};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};t!==void 0&&(t.exports=n)})),ee=o((e=>{var t=D(),n=A(),r=j(),i=M(),a=N(),o=E(),s=m(),c=P();function l(e){return unescape(encodeURIComponent(e)).length}function u(e,t,n){let r=[],i;for(;(i=e.exec(n))!==null;)r.push({data:i[0],index:i.index,mode:t,length:i[0].length});return r}function d(e){let n=u(o.NUMERIC,t.NUMERIC,e),r=u(o.ALPHANUMERIC,t.ALPHANUMERIC,e),i,a;return s.isKanjiModeEnabled()?(i=u(o.BYTE,t.BYTE,e),a=u(o.KANJI,t.KANJI,e)):(i=u(o.BYTE_KANJI,t.BYTE,e),a=[]),n.concat(r,i,a).sort(function(e,t){return e.index-t.index}).map(function(e){return{data:e.data,mode:e.mode,length:e.length}})}function f(e,o){switch(o){case t.NUMERIC:return n.getBitsLength(e);case t.ALPHANUMERIC:return r.getBitsLength(e);case t.KANJI:return a.getBitsLength(e);case t.BYTE:return i.getBitsLength(e)}}function p(e){return e.reduce(function(e,t){let n=e.length-1>=0?e[e.length-1]:null;return n&&n.mode===t.mode?(e[e.length-1].data+=t.data,e):(e.push(t),e)},[])}function h(e){let n=[];for(let r=0;r<e.length;r++){let i=e[r];switch(i.mode){case t.NUMERIC:n.push([i,{data:i.data,mode:t.ALPHANUMERIC,length:i.length},{data:i.data,mode:t.BYTE,length:i.length}]);break;case t.ALPHANUMERIC:n.push([i,{data:i.data,mode:t.BYTE,length:i.length}]);break;case t.KANJI:n.push([i,{data:i.data,mode:t.BYTE,length:l(i.data)}]);break;case t.BYTE:n.push([{data:i.data,mode:t.BYTE,length:l(i.data)}])}}return n}function g(e,n){let r={},i={start:{}},a=[`start`];for(let o=0;o<e.length;o++){let s=e[o],c=[];for(let e=0;e<s.length;e++){let l=s[e],u=``+o+e;c.push(u),r[u]={node:l,lastCount:0},i[u]={};for(let e=0;e<a.length;e++){let o=a[e];r[o]&&r[o].node.mode===l.mode?(i[o][u]=f(r[o].lastCount+l.length,l.mode)-f(r[o].lastCount,l.mode),r[o].lastCount+=l.length):(r[o]&&(r[o].lastCount=l.length),i[o][u]=f(l.length,l.mode)+4+t.getCharCountIndicator(l.mode,n))}}a=c}for(let e=0;e<a.length;e++)i[a[e]].end=0;return{map:i,table:r}}function _(e,o){let c,l=t.getBestModeForData(e);if(c=t.from(o,l),c!==t.BYTE&&c.bit<l.bit)throw Error(`"`+e+`" cannot be encoded with mode `+t.toString(c)+`.
 Suggested mode is: `+t.toString(l));switch(c===t.KANJI&&!s.isKanjiModeEnabled()&&(c=t.BYTE),c){case t.NUMERIC:return new n(e);case t.ALPHANUMERIC:return new r(e);case t.KANJI:return new a(e);case t.BYTE:return new i(e)}}e.fromArray=function(e){return e.reduce(function(e,t){return typeof t==`string`?e.push(_(t,null)):t.data&&e.push(_(t.data,t.mode)),e},[])},e.fromString=function(t,n){let r=g(h(d(t,s.isKanjiModeEnabled())),n),i=c.find_path(r.map,`start`,`end`),a=[];for(let e=1;e<i.length-1;e++)a.push(r.table[i[e]].node);return e.fromArray(p(a))},e.rawSplit=function(t){return e.fromArray(d(t,s.isKanjiModeEnabled()))}})),F=o((e=>{var t=m(),n=h(),r=g(),i=_(),a=v(),o=y(),s=b(),c=x(),l=w(),u=O(),d=k(),f=D(),p=ee();function S(e,t){let n=e.size,r=o.getPositions(t);for(let t=0;t<r.length;t++){let i=r[t][0],a=r[t][1];for(let t=-1;t<=7;t++)if(!(i+t<=-1||n<=i+t))for(let r=-1;r<=7;r++)a+r<=-1||n<=a+r||(t>=0&&t<=6&&(r===0||r===6)||r>=0&&r<=6&&(t===0||t===6)||t>=2&&t<=4&&r>=2&&r<=4?e.set(i+t,a+r,!0,!0):e.set(i+t,a+r,!1,!0))}}function C(e){let t=e.size;for(let n=8;n<t-8;n++){let t=n%2==0;e.set(n,6,t,!0),e.set(6,n,t,!0)}}function T(e,t){let n=a.getPositions(t);for(let t=0;t<n.length;t++){let r=n[t][0],i=n[t][1];for(let t=-2;t<=2;t++)for(let n=-2;n<=2;n++)t===-2||t===2||n===-2||n===2||t===0&&n===0?e.set(r+t,i+n,!0,!0):e.set(r+t,i+n,!1,!0)}}function E(e,t){let n=e.size,r=u.getEncodedBits(t),i,a,o;for(let t=0;t<18;t++)i=Math.floor(t/3),a=t%3+n-8-3,o=(r>>t&1)==1,e.set(i,a,o,!0),e.set(a,i,o,!0)}function A(e,t,n){let r=e.size,i=d.getEncodedBits(t,n),a,o;for(a=0;a<15;a++)o=(i>>a&1)==1,a<6?e.set(a,8,o,!0):a<8?e.set(a+1,8,o,!0):e.set(r-15+a,8,o,!0),a<8?e.set(8,r-a-1,o,!0):a<9?e.set(8,15-a-1+1,o,!0):e.set(8,15-a-1,o,!0);e.set(r-8,8,1,!0)}function j(e,t){let n=e.size,r=-1,i=n-1,a=7,o=0;for(let s=n-1;s>0;s-=2)for(s===6&&s--;;){for(let n=0;n<2;n++)if(!e.isReserved(i,s-n)){let r=!1;o<t.length&&(r=(t[o]>>>a&1)==1),e.set(i,s-n,r),a--,a===-1&&(o++,a=7)}if(i+=r,i<0||n<=i){i-=r,r=-r;break}}}function M(e,n,i){let a=new r;i.forEach(function(t){a.put(t.mode.bit,4),a.put(t.getLength(),f.getCharCountIndicator(t.mode,e)),t.write(a)});let o=(t.getSymbolTotalCodewords(e)-c.getTotalCodewordsCount(e,n))*8;for(a.getLengthInBits()+4<=o&&a.put(0,4);a.getLengthInBits()%8!=0;)a.putBit(0);let s=(o-a.getLengthInBits())/8;for(let e=0;e<s;e++)a.put(e%2?17:236,8);return N(a,e,n)}function N(e,n,r){let i=t.getSymbolTotalCodewords(n),a=i-c.getTotalCodewordsCount(n,r),o=c.getBlocksCount(n,r),s=o-i%o,u=Math.floor(i/o),d=Math.floor(a/o),f=d+1,p=u-d,m=new l(p),h=0,g=Array(o),_=Array(o),v=0,y=new Uint8Array(e.buffer);for(let e=0;e<o;e++){let t=e<s?d:f;g[e]=y.slice(h,h+t),_[e]=m.encode(g[e]),h+=t,v=Math.max(v,t)}let b=new Uint8Array(i),x=0,S,C;for(S=0;S<v;S++)for(C=0;C<o;C++)S<g[C].length&&(b[x++]=g[C][S]);for(S=0;S<p;S++)for(C=0;C<o;C++)b[x++]=_[C][S];return b}function P(e,n,r,a){let o;if(Array.isArray(e))o=p.fromArray(e);else if(typeof e==`string`){let t=n;if(!t){let n=p.rawSplit(e);t=u.getBestVersionForData(n,r)}o=p.fromString(e,t||40)}else throw Error(`Invalid data`);let c=u.getBestVersionForData(o,r);if(!c)throw Error(`The amount of data is too big to be stored in a QR Code`);if(!n)n=c;else if(n<c)throw Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+c+`.
`);let l=M(n,r,o),d=new i(t.getSymbolSize(n));return S(d,n),C(d),T(d,n),A(d,r,0),n>=7&&E(d,n),j(d,l),isNaN(a)&&(a=s.getBestMask(d,A.bind(null,d,r))),s.applyMask(a,d),A(d,r,a),{modules:d,version:n,errorCorrectionLevel:r,maskPattern:a,segments:o}}e.create=function(e,r){if(e===void 0||e===``)throw Error(`No input text`);let i=n.M,a,o;return r!==void 0&&(i=n.from(r.errorCorrectionLevel,n.M),a=u.from(r.version),o=s.from(r.maskPattern),r.toSJISFunc&&t.setToSJISFunction(r.toSJISFunc)),P(e,a,i,o)}})),te=o((e=>{function t(e){if(typeof e==`number`&&(e=e.toString()),typeof e!=`string`)throw Error(`Color should be defined as hex string`);let t=e.slice().replace(`#`,``).split(``);if(t.length<3||t.length===5||t.length>8)throw Error(`Invalid hex color: `+e);(t.length===3||t.length===4)&&(t=Array.prototype.concat.apply([],t.map(function(e){return[e,e]}))),t.length===6&&t.push(`F`,`F`);let n=parseInt(t.join(``),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:`#`+t.slice(0,6).join(``)}}e.getOptions=function(e){e||={},e.color||(e.color={});let n=e.margin===void 0||e.margin===null||e.margin<0?4:e.margin,r=e.width&&e.width>=21?e.width:void 0,i=e.scale||4;return{width:r,scale:r?4:i,margin:n,color:{dark:t(e.color.dark||`#000000ff`),light:t(e.color.light||`#ffffffff`)},type:e.type,rendererOpts:e.rendererOpts||{}}},e.getScale=function(e,t){return t.width&&t.width>=e+t.margin*2?t.width/(e+t.margin*2):t.scale},e.getImageWidth=function(t,n){let r=e.getScale(t,n);return Math.floor((t+n.margin*2)*r)},e.qrToImageData=function(t,n,r){let i=n.modules.size,a=n.modules.data,o=e.getScale(i,r),s=Math.floor((i+r.margin*2)*o),c=r.margin*o,l=[r.color.light,r.color.dark];for(let e=0;e<s;e++)for(let n=0;n<s;n++){let u=(e*s+n)*4,d=r.color.light;if(e>=c&&n>=c&&e<s-c&&n<s-c){let t=Math.floor((e-c)/o),r=Math.floor((n-c)/o);d=l[+!!a[t*i+r]]}t[u++]=d.r,t[u++]=d.g,t[u++]=d.b,t[u]=d.a}}})),ne=o((e=>{var t=te();function n(e,t,n){e.clearRect(0,0,t.width,t.height),t.style||={},t.height=n,t.width=n,t.style.height=n+`px`,t.style.width=n+`px`}function r(){try{return document.createElement(`canvas`)}catch{throw Error(`You need to specify a canvas element`)}}e.render=function(e,i,a){let o=a,s=i;o!==void 0||i&&i.getContext||(o=i,i=void 0),i||(s=r()),o=t.getOptions(o);let c=t.getImageWidth(e.modules.size,o),l=s.getContext(`2d`),u=l.createImageData(c,c);return t.qrToImageData(u.data,e,o),n(l,s,c),l.putImageData(u,0,0),s},e.renderToDataURL=function(t,n,r){let i=r;i!==void 0||n&&n.getContext||(i=n,n=void 0),i||={};let a=e.render(t,n,i),o=i.type||`image/png`,s=i.rendererOpts||{};return a.toDataURL(o,s.quality)}})),re=o((e=>{var t=te();function n(e,t){let n=e.a/255,r=t+`="`+e.hex+`"`;return n<1?r+` `+t+`-opacity="`+n.toFixed(2).slice(1)+`"`:r}function r(e,t,n){let r=e+t;return n!==void 0&&(r+=` `+n),r}function i(e,t,n){let i=``,a=0,o=!1,s=0;for(let c=0;c<e.length;c++){let l=Math.floor(c%t),u=Math.floor(c/t);!l&&!o&&(o=!0),e[c]?(s++,c>0&&l>0&&e[c-1]||(i+=o?r(`M`,l+n,.5+u+n):r(`m`,a,0),a=0,o=!1),l+1<t&&e[c+1]||(i+=r(`h`,s),s=0)):a++}return i}e.render=function(e,r,a){let o=t.getOptions(r),s=e.modules.size,c=e.modules.data,l=s+o.margin*2,u=o.color.light.a?`<path `+n(o.color.light,`fill`)+` d="M0 0h`+l+`v`+l+`H0z"/>`:``,d=`<path `+n(o.color.dark,`stroke`)+` d="`+i(c,s,o.margin)+`"/>`,f=`viewBox="0 0 `+l+` `+l+`"`,p=`<svg xmlns="http://www.w3.org/2000/svg" `+(o.width?`width="`+o.width+`" height="`+o.width+`" `:``)+f+` shape-rendering="crispEdges">`+u+d+`</svg>
`;return typeof a==`function`&&a(null,p),p}})),ie=o((e=>{var t=p(),n=F(),r=ne(),i=re();function a(e,r,i,a,o){let s=[].slice.call(arguments,1),c=s.length,l=typeof s[c-1]==`function`;if(!l&&!t())throw Error(`Callback required as last argument`);if(l){if(c<2)throw Error(`Too few arguments provided`);c===2?(o=i,i=r,r=a=void 0):c===3&&(r.getContext&&o===void 0?(o=a,a=void 0):(o=a,a=i,i=r,r=void 0))}else{if(c<1)throw Error(`Too few arguments provided`);return c===1?(i=r,r=a=void 0):c===2&&!r.getContext&&(a=i,i=r,r=void 0),new Promise(function(t,o){try{t(e(n.create(i,a),r,a))}catch(e){o(e)}})}try{let t=n.create(i,a);o(null,e(t,r,a))}catch(e){o(e)}}e.create=n.create,e.toCanvas=a.bind(null,r.render),e.toDataURL=a.bind(null,r.renderToDataURL),e.toString=a.bind(null,function(e,t,n){return i.render(e,n)})})),ae=o(((e,t)=>{var n=(function(){var e=String.fromCharCode,t=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=`,n=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$`,r={};function i(e,t){if(!r[e]){r[e]={};for(var n=0;n<e.length;n++)r[e][e.charAt(n)]=n}return r[e][t]}var a={compressToBase64:function(e){if(e==null)return``;var n=a._compress(e,6,function(e){return t.charAt(e)});switch(n.length%4){default:case 0:return n;case 1:return n+`===`;case 2:return n+`==`;case 3:return n+`=`}},decompressFromBase64:function(e){return e==null?``:e==``?null:a._decompress(e.length,32,function(n){return i(t,e.charAt(n))})},compressToUTF16:function(t){return t==null?``:a._compress(t,15,function(t){return e(t+32)})+` `},decompressFromUTF16:function(e){return e==null?``:e==``?null:a._decompress(e.length,16384,function(t){return e.charCodeAt(t)-32})},compressToUint8Array:function(e){for(var t=a.compress(e),n=new Uint8Array(t.length*2),r=0,i=t.length;r<i;r++){var o=t.charCodeAt(r);n[r*2]=o>>>8,n[r*2+1]=o%256}return n},decompressFromUint8Array:function(t){if(t==null)return a.decompress(t);for(var n=Array(t.length/2),r=0,i=n.length;r<i;r++)n[r]=t[r*2]*256+t[r*2+1];var o=[];return n.forEach(function(t){o.push(e(t))}),a.decompress(o.join(``))},compressToEncodedURIComponent:function(e){return e==null?``:a._compress(e,6,function(e){return n.charAt(e)})},decompressFromEncodedURIComponent:function(e){return e==null?``:e==``?null:(e=e.replace(/ /g,`+`),a._decompress(e.length,32,function(t){return i(n,e.charAt(t))}))},compress:function(t){return a._compress(t,16,function(t){return e(t)})},_compress:function(e,t,n){if(e==null)return``;for(var r,i,a={},o={},s=``,c=``,l=``,u=2,d=3,f=2,p=[],m=0,h=0,g=0;g<e.length;g+=1)if(s=e.charAt(g),Object.prototype.hasOwnProperty.call(a,s)||(a[s]=d++,o[s]=!0),c=l+s,Object.prototype.hasOwnProperty.call(a,c))l=c;else{if(Object.prototype.hasOwnProperty.call(o,l)){if(l.charCodeAt(0)<256){for(r=0;r<f;r++)m<<=1,h==t-1?(h=0,p.push(n(m)),m=0):h++;for(i=l.charCodeAt(0),r=0;r<8;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1}else{for(i=1,r=0;r<f;r++)m=m<<1|i,h==t-1?(h=0,p.push(n(m)),m=0):h++,i=0;for(i=l.charCodeAt(0),r=0;r<16;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1}u--,u==0&&(u=2**f,f++),delete o[l]}else for(i=a[l],r=0;r<f;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1;u--,u==0&&(u=2**f,f++),a[c]=d++,l=String(s)}if(l!==``){if(Object.prototype.hasOwnProperty.call(o,l)){if(l.charCodeAt(0)<256){for(r=0;r<f;r++)m<<=1,h==t-1?(h=0,p.push(n(m)),m=0):h++;for(i=l.charCodeAt(0),r=0;r<8;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1}else{for(i=1,r=0;r<f;r++)m=m<<1|i,h==t-1?(h=0,p.push(n(m)),m=0):h++,i=0;for(i=l.charCodeAt(0),r=0;r<16;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1}u--,u==0&&(u=2**f,f++),delete o[l]}else for(i=a[l],r=0;r<f;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1;u--,u==0&&(u=2**f,f++)}for(i=2,r=0;r<f;r++)m=m<<1|i&1,h==t-1?(h=0,p.push(n(m)),m=0):h++,i>>=1;for(;;){if(m<<=1,h==t-1){p.push(n(m));break}h++}return p.join(``)},decompress:function(e){return e==null?``:e==``?null:a._decompress(e.length,32768,function(t){return e.charCodeAt(t)})},_decompress:function(t,n,r){var i=[],a=4,o=4,s=3,c=``,l=[],u,d,f,p,m,h,g,_={val:r(0),position:n,index:1};for(u=0;u<3;u+=1)i[u]=u;for(f=0,m=4,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;switch(f){case 0:for(f=0,m=256,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;g=e(f);break;case 1:for(f=0,m=2**16,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;g=e(f);break;case 2:return``}for(i[3]=g,d=g,l.push(g);;){if(_.index>t)return``;for(f=0,m=2**s,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;switch(g=f){case 0:for(f=0,m=256,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;i[o++]=e(f),g=o-1,a--;break;case 1:for(f=0,m=2**16,h=1;h!=m;)p=_.val&_.position,_.position>>=1,_.position==0&&(_.position=n,_.val=r(_.index++)),f|=+(p>0)*h,h<<=1;i[o++]=e(f),g=o-1,a--;break;case 2:return l.join(``)}if(a==0&&(a=2**s,s++),i[g])c=i[g];else if(g===o)c=d+d.charAt(0);else return null;l.push(c),i[o++]=d+c.charAt(0),a--,d=c,a==0&&(a=2**s,s++)}}};return a})();typeof define==`function`&&define.amd?define(function(){return n}):t!==void 0&&t!=null?t.exports=n:typeof angular<`u`&&angular!=null&&angular.module(`LZString`,[]).factory(`LZString`,function(){return n})})),oe=c(ie(),1),se=c(ae(),1);function ce(){let e=document.getElementById(`modal-container`);if(!e)return;let t=0,n=!1;window.addEventListener(`open-modal`,r=>{let i=r.detail&&r.detail.modal;i&&(t=Date.now(),n=!1,le(e,i))}),window.addEventListener(`close-modal`,()=>{e.innerHTML=``,e.classList.remove(`active`)}),e.addEventListener(`mousedown`,t=>{n=t.target===e}),e.addEventListener(`click`,r=>{r.target===e&&n&&Date.now()-t>350&&window.dispatchEvent(new CustomEvent(`close-modal`))})}function le(e,t){e.classList.add(`active`),t===`add-habit`?de(e):t===`settings`?fe(e):t===`share-streak`?pe(e):t===`phone-sync`&&he(e);let n=e.querySelector(`.modal-card`);n&&(n.addEventListener(`mousedown`,e=>e.stopPropagation()),n.addEventListener(`click`,e=>e.stopPropagation()))}var ue=[{emoji:`⏰`,name:`alarm wake up morning early`,cat:`popular`},{emoji:`💪`,name:`gym workout muscle bicep strength`,cat:`popular`},{emoji:`💧`,name:`water hydrate hydration drink`,cat:`popular`},{emoji:`📖`,name:`read book reading learning pages`,cat:`popular`},{emoji:`💻`,name:`code deep work laptop programming work`,cat:`popular`},{emoji:`🥗`,name:`clean diet salad food nutrition healthy`,cat:`popular`},{emoji:`🧘`,name:`meditation meditate yoga mindfulness zen`,cat:`popular`},{emoji:`🌙`,name:`sleep bedtime night recovery rest`,cat:`popular`},{emoji:`🏃`,name:`run running cardio marathon jog`,cat:`popular`},{emoji:`🎯`,name:`focus goal target discipline habits`,cat:`popular`},{emoji:`⚡`,name:`energy sprint deep work productivity power`,cat:`popular`},{emoji:`💰`,name:`save money finance cash budget wealth`,cat:`popular`},{emoji:`🚫`,name:`no quit break habit discipline stop`,cat:`popular`},{emoji:`🧊`,name:`cold plunge shower ice bath recovery`,cat:`popular`},{emoji:`✍️`,name:`journal journaling writing reflect diary`,cat:`popular`},{emoji:`🏋️`,name:`weightlifting heavy lift bench squat deadlift barbell`,cat:`fitness`},{emoji:`🚴`,name:`cycle cycling bike biking cardio ride`,cat:`fitness`},{emoji:`🏊`,name:`swim swimming pool laps cardio`,cat:`fitness`},{emoji:`🥊`,name:`boxing punch fight sparring bag combat`,cat:`fitness`},{emoji:`🧗`,name:`climbing bouldering rock climb grip`,cat:`fitness`},{emoji:`🤸`,name:`calisthenics gymnastics stretch flexible`,cat:`fitness`},{emoji:`👟`,name:`walk 10k steps walking daily steps cardio`,cat:`fitness`},{emoji:`🥋`,name:`martial arts bjj karate judo grappling`,cat:`fitness`},{emoji:`🎾`,name:`tennis racket court sport game match`,cat:`fitness`},{emoji:`⚽`,name:`football soccer ball training drills match`,cat:`fitness`},{emoji:`🏀`,name:`basketball hoops court sport training`,cat:`fitness`},{emoji:`🏸`,name:`badminton shuttlecock racket sport`,cat:`fitness`},{emoji:`🛹`,name:`skate skateboard skateboarding skatepark`,cat:`fitness`},{emoji:`⏱️`,name:`hiit timer interval sprints circuit`,cat:`fitness`},{emoji:`🏆`,name:`pr trophy personal record win milestone champion`,cat:`fitness`},{emoji:`🍎`,name:`apple fruit vitamin clean snack healthy`,cat:`nutrition`},{emoji:`🥑`,name:`avocado healthy fats keto clean food`,cat:`nutrition`},{emoji:`🥦`,name:`broccoli greens veggies vegetable micronutrients`,cat:`nutrition`},{emoji:`🥩`,name:`steak beef meat high protein carnivore`,cat:`nutrition`},{emoji:`🍳`,name:`eggs breakfast cooking protein cook`,cat:`nutrition`},{emoji:`🍌`,name:`banana preworkout carbs potassium energy`,cat:`nutrition`},{emoji:`🍵`,name:`green tea matcha herbal tea detox antioxidant`,cat:`nutrition`},{emoji:`☕`,name:`coffee black coffee espresso morning caffeine`,cat:`nutrition`},{emoji:`🥛`,name:`milk protein shake whey casein shake`,cat:`nutrition`},{emoji:`💊`,name:`supplements creatine vitamins medicine fish oil zinc`,cat:`nutrition`},{emoji:`🥕`,name:`carrot raw veggies carrots salad`,cat:`nutrition`},{emoji:`🫐`,name:`blueberries berries antioxidant superfood fruit`,cat:`nutrition`},{emoji:`🧂`,name:`electrolytes salt hydration minerals sodium`,cat:`nutrition`},{emoji:`🍱`,name:`meal prep lunch box cooking meal prep Sunday`,cat:`nutrition`},{emoji:`🥣`,name:`oats oatmeal porridge fiber breakfast`,cat:`nutrition`},{emoji:`🥜`,name:`nuts almonds peanut butter healthy snack`,cat:`nutrition`},{emoji:`📚`,name:`study books learning reading education exam`,cat:`productivity`},{emoji:`🧠`,name:`brain memory thinking neuro cognitive learning`,cat:`productivity`},{emoji:`💡`,name:`idea brainstorm innovation insight creative`,cat:`productivity`},{emoji:`📅`,name:`calendar plan schedule daily agenda timeblock`,cat:`productivity`},{emoji:`📝`,name:`todo list notes tasks check off planning`,cat:`productivity`},{emoji:`📈`,name:`growth metric analytics kpi business sales`,cat:`productivity`},{emoji:`💼`,name:`work career office job professional client`,cat:`productivity`},{emoji:`🎧`,name:`focus music podcast audio binaural beats deep`,cat:`productivity`},{emoji:`🚀`,name:`launch startup project ship momentum scale`,cat:`productivity`},{emoji:`⏳`,name:`pomodoro timer 25 min time management sprints`,cat:`productivity`},{emoji:`🛠️`,name:`build tool project repair create crafting`,cat:`productivity`},{emoji:`🔬`,name:`research science experiment lab analyze study`,cat:`productivity`},{emoji:`🗣️`,name:`language speech practice duolingo speaking public`,cat:`productivity`},{emoji:`🎨`,name:`design art draw painting creative UI UX`,cat:`productivity`},{emoji:`🎹`,name:`piano keyboard instrument practice play music`,cat:`productivity`},{emoji:`🎸`,name:`guitar chords practice instrument music play`,cat:`productivity`},{emoji:`🕊️`,name:`peace gratitude calm prayer stillness soul`,cat:`mindset`},{emoji:`☀️`,name:`morning sun sunlight outdoor circadian light`,cat:`mindset`},{emoji:`🌅`,name:`sunrise early wake dawn 5am routine`,cat:`mindset`},{emoji:`🛌`,name:`bed sleep early 8 hours rest recharge`,cat:`mindset`},{emoji:`🌳`,name:`nature walk park green trees grounding forest`,cat:`mindset`},{emoji:`🌿`,name:`herbal fresh air breath nature calm`,cat:`mindset`},{emoji:`🕯️`,name:`evening candle relax wind down calm night`,cat:`mindset`},{emoji:`💖`,name:`self care love mental health empathy kindness`,cat:`mindset`},{emoji:`🫁`,name:`breath breathwork pranayama box breathing wim hof`,cat:`mindset`},{emoji:`📵`,name:`screen detox no phone offline digital detox`,cat:`mindset`},{emoji:`🚶`,name:`evening walk stroll stretch unwind step`,cat:`mindset`},{emoji:`🐾`,name:`pet dog walk puppy cat companion care`,cat:`mindset`},{emoji:`🫂`,name:`family call friends connection social relationship`,cat:`mindset`},{emoji:`🛁`,name:`bath soak hot epsom salts relaxation`,cat:`mindset`},{emoji:`🚿`,name:`shower hygiene cold rinse fresh clean`,cat:`mindset`},{emoji:`📿`,name:`rosary mantra meditation prayer spiritual bead`,cat:`mindset`},{emoji:`💳`,name:`credit card no spend budget limit check`,cat:`wealth`},{emoji:`🏦`,name:`bank deposit emergency fund savings interest`,cat:`wealth`},{emoji:`💎`,name:`diamond net worth investments asset value`,cat:`wealth`},{emoji:`🪙`,name:`coins gold crypto bitcoin dollar cent`,cat:`wealth`},{emoji:`📊`,name:`chart financial review balance sheet cashflow`,cat:`wealth`},{emoji:`🧾`,name:`receipts invoices taxes expense log accounting`,cat:`wealth`},{emoji:`💵`,name:`cash income dollar money paid earnings`,cat:`wealth`},{emoji:`🏷️`,name:`coupon discounts save bargain sale frugal`,cat:`wealth`},{emoji:`🐖`,name:`piggy bank savings reserve wealth stash`,cat:`wealth`},{emoji:`🚭`,name:`no smoking vape cigarette smoke nicotine quit`,cat:`breakHabits`},{emoji:`🍺`,name:`no alcohol sober beer wine drink partying quit`,cat:`breakHabits`},{emoji:`🍰`,name:`no sugar cake sweets dessert craving keto zero`,cat:`breakHabits`},{emoji:`🍫`,name:`no chocolate candy sweets sugar junk cravings`,cat:`breakHabits`},{emoji:`🍔`,name:`no junk food fast food mcdonalds clean eating`,cat:`breakHabits`},{emoji:`🍟`,name:`no fries fried food grease clean diet`,cat:`breakHabits`},{emoji:`🎮`,name:`no gaming video games screen limit discipline`,cat:`breakHabits`},{emoji:`📱`,name:`no doomscroll instagram tiktok social media limits`,cat:`breakHabits`},{emoji:`📺`,name:`no tv netflix binging screen time entertainment`,cat:`breakHabits`},{emoji:`🛋️`,name:`no lazy couch potato procrastination movement`,cat:`breakHabits`},{emoji:`💤`,name:`no snooze snooze button wake immediately alarm`,cat:`breakHabits`},{emoji:`🍿`,name:`no late night snacking snacks junk eating`,cat:`breakHabits`},{emoji:`🧹`,name:`clean room tidy desk sweep chore vacuum`,cat:`lifestyle`},{emoji:`🪥`,name:`teeth brushing floss oral hygiene teeth`,cat:`lifestyle`},{emoji:`🧼`,name:`skincare wash face cleanse soap hygiene`,cat:`lifestyle`},{emoji:`🧺`,name:`laundry wash clothes clean wardrobe chore`,cat:`lifestyle`},{emoji:`🌱`,name:`plants water gardening flora care green`,cat:`lifestyle`},{emoji:`🛏️`,name:`make bed morning routine tidy bedroom discipline`,cat:`lifestyle`},{emoji:`🧴`,name:`sunscreen lotion skin moisturize care`,cat:`lifestyle`}];function de(e){let t=[`#38bdf8`,`#10b981`,`#14b8a6`,`#6366f1`,`#a855f7`,`#ec4899`,`#f43f5e`,`#f59e0b`,`#f97316`,`#84cc16`],n=`⏰`,r=t[0],i=`all`,a=``;e.innerHTML=`
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
          <div class="emoji-live-preview-box" id="modal-emoji-preview" style="background: ${r}22; border-color: ${r}60;">
            <span class="preview-emoji-symbol">${n}</span>
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
            ${t.map((e,t)=>`
              <button type="button" class="color-opt-btn ${t===0?`selected`:``}" data-color="${e}" style="background: ${e};" title="Select color"></button>
            `).join(``)}
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="nexus-btn btn-secondary modal-cancel-btn">Cancel</button>
          <button type="submit" class="nexus-btn btn-primary">Save & Add Habit</button>
        </div>
      </form>
    </div>
  `;let o=e.querySelector(`#emoji-grid-container`),s=e.querySelector(`#modal-emoji-preview`),c=e.querySelector(`.preview-emoji-symbol`),d=e.querySelector(`#custom-emoji-input`),p=e.querySelector(`#emoji-search-input`),m=e.querySelector(`#habit-time-input`);function h(){let e=ue;if(i!==`all`&&(e=e.filter(e=>e.cat===i)),a.trim()!==``){let t=a.toLowerCase().trim();e=e.filter(e=>e.name.includes(t)||e.emoji.includes(t))}e.length===0?o.innerHTML=`<div class="empty-emoji-msg">No emoji found. Type any custom emoji in the field above!</div>`:(o.innerHTML=e.map(e=>`
      <button type="button" class="emoji-opt-btn ${e.emoji===n?`selected`:``}" data-emoji="${e.emoji}" title="${e.name}">
        ${e.emoji}
      </button>
    `).join(``),o.querySelectorAll(`.emoji-opt-btn`).forEach(e=>{e.addEventListener(`click`,()=>{o.querySelectorAll(`.emoji-opt-btn`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),n=e.dataset.emoji,d&&(d.value=``),g(),u.playPop()})}))}function g(){c&&(c.textContent=n),s&&(s.style.background=`${r}22`,s.style.borderColor=`${r}60`)}h(),e.querySelectorAll(`.emoji-cat-btn`).forEach(t=>{t.addEventListener(`click`,()=>{e.querySelectorAll(`.emoji-cat-btn`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),i=t.dataset.cat,h(),u.playPop()})}),p&&p.addEventListener(`input`,e=>{a=e.target.value,h()}),d&&d.addEventListener(`input`,e=>{let t=e.target.value.trim();t&&(n=t,g(),o.querySelectorAll(`.emoji-opt-btn`).forEach(e=>e.classList.remove(`selected`)))}),e.querySelectorAll(`.time-chip`).forEach(e=>{e.addEventListener(`click`,()=>{m&&(m.value=e.dataset.time),u.playPop()})}),e.querySelectorAll(`.color-opt-btn`).forEach(t=>{t.addEventListener(`click`,()=>{e.querySelectorAll(`.color-opt-btn`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),r=t.dataset.color,g(),u.playPop()})}),e.querySelector(`#add-habit-form`).addEventListener(`submit`,t=>{t.preventDefault();let i=e.querySelector(`#habit-name-input`),a=i?i.value.trim():``;if(!a)return;let o=e.querySelector(`#habit-cat-select`).value,s=e.querySelector(`#habit-time-input`),c=s&&s.value.trim()||`Anytime`;l.addHabit({name:a,emoji:n,category:o,color:r,timeOfDay:c}),u.playLevelUp(),f({particleCount:70,spread:70,origin:{y:.6}}),window.dispatchEvent(new CustomEvent(`close-modal`))}),I(e)}function I(e){e.querySelectorAll(`.modal-close-btn`).forEach(e=>{e.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`close-modal`)),u.playPop()})}),e.querySelectorAll(`.modal-cancel-btn`).forEach(e=>{e.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`close-modal`)),u.playPop()})})}function fe(e){let t=l.data.settings||{},n=l.getStorageStats();e.innerHTML=`
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
                <button class="segmented-btn ${t.weekStart===`Mo`?`active`:``}" data-val="Mo">Monday</button>
                <button class="segmented-btn ${t.weekStart===`Su`?`active`:``}" data-val="Su">Sunday</button>
              </div>
            </div>

            <!-- Clock Format -->
            <div class="settings-row">
              <div class="settings-label-wrap">
                <span class="settings-label-title">Digital Clock Time</span>
                <span class="settings-label-desc">12-Hour AM/PM standard vs 24-Hour Military standard</span>
              </div>
              <div class="segmented-control" id="setting-clock-segment">
                <button class="segmented-btn ${t.clockFormat===`12h`?`active`:``}" data-val="12h">12-Hour (AM/PM)</button>
                <button class="segmented-btn ${t.clockFormat===`24h`?`active`:``}" data-val="24h">24-Hour (23:59)</button>
              </div>
            </div>

          </div>

          <!-- Aesthetic Theme -->
          <div class="settings-card-section">
            <div class="settings-section-title">🎨 Aesthetic Theme Presets</div>
            <div class="theme-options-grid">
              
              <div class="theme-option-btn ${t.theme===`cyberpunk`||!t.theme?`active`:``}" data-theme="cyberpunk">
                <div class="theme-swatch-circle" style="background: linear-gradient(135deg, #070a12 0%, #06b6d4 100%);"></div>
                <span style="font-size: 12px; font-weight: 700;">Cyberpunk Obsidian</span>
                <span style="font-size: 10px; color: var(--text-muted);">Neon Cyan & Emerald</span>
              </div>

              <div class="theme-option-btn ${t.theme===`oled`?`active`:``}" data-theme="oled">
                <div class="theme-swatch-circle" style="background: #000000; border-color: #333;"></div>
                <span style="font-size: 12px; font-weight: 700;">Pure OLED Black</span>
                <span style="font-size: 10px; color: var(--text-muted);">0-Lumen Pitch Black</span>
              </div>

              <div class="theme-option-btn ${t.theme===`midnight`?`active`:``}" data-theme="midnight">
                <div class="theme-swatch-circle" style="background: linear-gradient(135deg, #090714 0%, #a855f7 100%);"></div>
                <span style="font-size: 12px; font-weight: 700;">Tokyo Midnight</span>
                <span style="font-size: 10px; color: var(--text-muted);">Violet & Indigo Glow</span>
              </div>

              <div class="theme-option-btn ${t.theme===`titanium`?`active`:``}" data-theme="titanium">
                <div class="theme-swatch-circle" style="background: linear-gradient(135deg, #0c0e12 0%, #cbd5e1 100%);"></div>
                <span style="font-size: 12px; font-weight: 700;">Titanium Minimalist</span>
                <span style="font-size: 10px; color: var(--text-muted);">Frosted Monochrome</span>
              </div>

              <div class="theme-option-btn ${t.theme===`copper`?`active`:``}" data-theme="copper">
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
                <span class="settings-label-desc">${n.kb} KB of ${n.maxKB} KB quota used (${n.pct}%) • 25+ years capacity</span>
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

          <!-- Verified VIP License & Official Support -->
          <div class="settings-card-section" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
            <div class="settings-section-title">🔒 Verified VIP License & Official Support</div>
            
            <div class="settings-row">
              <div class="settings-label-wrap">
                <span class="settings-label-title">Lifetime License Status</span>
                <span class="settings-label-desc" style="font-family: 'JetBrains Mono', monospace; color: #fbbf24;">
                  ${localStorage.getItem(`axio_activated_license`)||localStorage.getItem(`axio_customer_license`)||`AXIO-VIP-2026-LIFETIME`}
                </span>
              </div>
              <span class="badge font-mono" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
                ✓ LIFETIME ACTIVE
              </span>
            </div>

            <div class="settings-row" style="flex-wrap: wrap; gap: 10px;">
              <a href="./landing.html" target="_blank" class="btn btn-secondary" style="font-size: 12px; text-decoration: none;">
                <span>🌐 Official Website Page →</span>
              </a>
              <a href="mailto:axio.os.ltd@gmail.com" class="btn btn-secondary" style="font-size: 12px; text-decoration: none; color: #38bdf8; border-color: rgba(56, 189, 248, 0.3);">
                <span>✉️ Email Support (axio.os.ltd@gmail.com)</span>
              </a>
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
  `;let r=e.querySelector(`#setting-week-segment`);r&&r.addEventListener(`click`,e=>{let t=e.target.closest(`.segmented-btn`);t&&(r.querySelectorAll(`.segmented-btn`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),l.updateSettings({weekStart:t.dataset.val}),u.playPop())});let i=e.querySelector(`#setting-clock-segment`);i&&i.addEventListener(`click`,e=>{let t=e.target.closest(`.segmented-btn`);t&&(i.querySelectorAll(`.segmented-btn`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),l.updateSettings({clockFormat:t.dataset.val}),u.playPop())});let a=e.querySelectorAll(`.theme-option-btn`);a.forEach(e=>{e.addEventListener(`click`,()=>{a.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`);let t=e.dataset.theme;l.updateSettings({theme:t}),document.body.setAttribute(`data-theme`,t),u.playPop()})});let o=e.querySelector(`#btn-export-json`);o&&o.addEventListener(`click`,()=>{let e=l.exportJSON(),t=new Blob([e],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`axio-os-backup-${new Date().toISOString().split(`T`)[0]}.json`,r.click(),URL.revokeObjectURL(n),u.playStreak()});let s=e.querySelector(`#file-import-json`);s&&s.addEventListener(`change`,e=>{let t=e.target.files[0];if(!t)return;let n=new FileReader;n.onload=e=>{l.importJSON(e.target.result)?(f({particleCount:70,spread:60}),u.playStreak(),window.dispatchEvent(new CustomEvent(`close-modal`))):alert(`Invalid backup JSON file.`)},n.readAsText(t)});let c=e.querySelector(`#btn-reset-app`);c&&c.addEventListener(`click`,()=>{confirm(`Are you sure you want to reset all habits to factory defaults?`)&&(l.resetToDefault(),u.playPop(),window.dispatchEvent(new CustomEvent(`close-modal`)))});let d=e.querySelector(`#btn-save-settings`);d&&d.addEventListener(`click`,()=>{u.playCheck(),window.dispatchEvent(new CustomEvent(`close-modal`))}),I(e)}function pe(e){let t=l.data,n=0,r=t.habits||[],i=r.length,a=0,o=new Date().getDate(),s=l.getMonthKey();r.forEach(e=>{let t=l.getHabitStreak(e.id),r=typeof t==`object`?t.current||0:parseInt(t)||0;r>n&&(n=r),e.checks&&e.checks[s]&&e.checks[s][o]&&a++});let c=i>0?Math.round(a/i*100):100,d=Math.max(n,1);e.innerHTML=`
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
  `;let p=e.querySelector(`#streak-brag-canvas`);p&&me(p,{userName:t.user.name||`Soham`,streakDays:d,todayRate:c,habits:r.slice(0,6)});let m=e.querySelector(`#btn-download-streak-card`);m&&p&&m.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation();try{p.toBlob(e=>{if(e){let t=URL.createObjectURL(e),n=document.createElement(`a`);n.download=`axio-streak-${d}-days.png`,n.href=t,n.style.display=`none`,document.body.appendChild(n),n.click(),setTimeout(()=>{document.body.contains(n)&&document.body.removeChild(n),URL.revokeObjectURL(t)},1200)}else{let e=document.createElement(`a`);e.download=`axio-streak-${d}-days.png`,e.href=p.toDataURL(`image/png`),document.body.appendChild(e),e.click(),document.body.removeChild(e)}u&&typeof u.playStreak==`function`?u.playStreak():u&&typeof u.playPop==`function`&&u.playPop(),f({particleCount:70,spread:70,origin:{y:.6}})},`image/png`)}catch(e){console.warn(`Canvas export notice`,e)}});let h=e.querySelector(`#btn-copy-streak-card`),g=e.querySelector(`#share-copy-toast`);h&&p&&h.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation();try{p.toBlob(async e=>{if(e)try{await navigator.clipboard.write([new ClipboardItem({"image/png":e})]),u.playCheck(),g&&(g.style.display=`inline-block`,setTimeout(()=>{g.style.display=`none`},3500))}catch(e){console.warn(`Clipboard write API blocked, fallback to download`,e),m&&m.click()}},`image/png`)}catch(e){console.warn(`Clipboard notice`,e),m&&m.click()}}),I(e)}function me(e,t){let n=e.getContext(`2d`),r=1200;n.fillStyle=`#06080f`,n.fillRect(0,0,r,675);let i=n.createRadialGradient(150,100,10,150,100,450);i.addColorStop(0,`rgba(6, 182, 212, 0.22)`),i.addColorStop(1,`transparent`),n.fillStyle=i,n.fillRect(0,0,r,675);let a=n.createRadialGradient(1050,550,10,1050,550,450);a.addColorStop(0,`rgba(168, 85, 247, 0.22)`),a.addColorStop(1,`transparent`),n.fillStyle=a,n.fillRect(0,0,r,675),n.strokeStyle=`rgba(255, 255, 255, 0.12)`,n.lineWidth=2,n.strokeRect(30,30,1140,615),n.fillStyle=`#38bdf8`,n.font=`bold 26px "Plus Jakarta Sans", sans-serif`,n.fillText(`⚡ AXIO OS`,70,95),n.fillStyle=`#64748b`,n.font=`600 15px "JetBrains Mono", monospace`,n.fillText(`DAILY HABITS & RHYTHM`,70,122),n.fillStyle=`rgba(16, 185, 129, 0.15)`,n.fillRect(880,75,240,38),n.strokeStyle=`rgba(16, 185, 129, 0.4)`,n.strokeRect(880,75,240,38),n.fillStyle=`#10b981`,n.font=`bold 14px "JetBrains Mono", monospace`,n.fillText(`✓ 100% DISCIPLINE VERIFIED`,900,100),n.fillStyle=`#f59e0b`,n.font=`bold 74px "Plus Jakarta Sans", sans-serif`,n.fillText(`🔥 ${t.streakDays}-DAY UNBROKEN CHAIN`,70,240),n.fillStyle=`#94a3b8`,n.font=`500 22px "Plus Jakarta Sans", sans-serif`,n.fillText(`Today's Completion: ${t.todayRate}% • Daily Consistency Protocol Active`,75,280),(t.habits||[]).forEach((e,t)=>{let r=t%2,i=Math.floor(t/2),a=70+r*550,o=330+i*65;n.fillStyle=`rgba(255, 255, 255, 0.04)`,n.fillRect(a,o,510,52),n.strokeStyle=`rgba(255, 255, 255, 0.08)`,n.strokeRect(a,o,510,52),n.fillStyle=e.color||`#38bdf8`,n.fillRect(a,o,5,52);let s=(e.name||`Daily Routine`).replace(/gym\s*\/\s*iron\s*workout/i,`Morning Movement & Exercise`).replace(/iron\s*workout/i,`Morning Movement`).replace(/\bgym\b/i,`Movement`),c=s.includes(`Morning Movement`)||s.includes(`Movement`)||e.emoji===`💪`?`🏃`:e.emoji||`⭐`;n.fillStyle=`#f8fafc`,n.font=`bold 18px "Plus Jakarta Sans", sans-serif`,n.fillText(`${c}  ${s}`,a+20,o+33),n.fillStyle=`#10b981`,n.font=`bold 16px "JetBrains Mono", monospace`,n.fillText(`✓ ACTIVE`,a+510-95,o+32)}),n.fillStyle=`rgba(255, 255, 255, 0.06)`,n.fillRect(70,575,1060,52),n.fillStyle=`#10b981`,n.font=`bold 16px "Plus Jakarta Sans", sans-serif`,n.fillText(`✓ ${t.userName} • Consistency Score: ${t.todayRate}% • Daily Habits Tracked`,95,607),n.fillStyle=`#64748b`,n.font=`500 14px "JetBrains Mono", monospace`,n.fillText(`AXIO OS • 100% Free & Private • Stored Locally on PC`,670,607)}function he(e){let t=l.exportJSON(),n=se.default.compressToEncodedURIComponent(t),r=localStorage.getItem(`axio_activated_license`)||localStorage.getItem(`axio_customer_license`)||`AXIO-VIP-2026-LIFETIME`,i=`${window.location.origin}${window.location.pathname}?key=${encodeURIComponent(r)}#sync=${n}`;e.innerHTML=`
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

              <a class="nexus-btn btn-secondary" id="btn-share-whatsapp" target="_blank" rel="noopener noreferrer" style="font-size: 12.5px; text-decoration: none; justify-content: center;"
                href="https://api.whatsapp.com/send?text=${encodeURIComponent(`Open your AXIO OS sync link: `+i)}">
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
  `;let a=e.querySelector(`#phone-sync-qr-canvas`);a&&oe.toCanvas(a,i,{width:200,margin:1,color:{dark:`#000000`,light:`#ffffff`}},e=>{e&&console.warn(`QR code generation notice`,e)});let o=e.querySelector(`#btn-copy-sync-link`),s=e.querySelector(`#sync-copy-toast`);o&&o.addEventListener(`click`,()=>{navigator.clipboard.writeText(i).then(()=>{u.playCheck(),s&&(s.style.display=`block`,setTimeout(()=>{s.style.display=`none`},3500))})}),I(e)}var L=null,R=null,z=`all`;function ge(e){let t=e.querySelector(`#matrix-scroll-container`);t&&t.scrollLeft>0&&(L=t.scrollLeft);let n=l.data,r=n.selectedYear,i=n.selectedMonth,a=l.getMonthKey(r,i);R!==null&&R!==a&&(L=null),R=a;let o=new Date,s=o.getFullYear()===r&&o.getMonth()===i,c=o.getDate(),u=new Date(r,i+1,0).getDate(),d=[`January`,`February`,`March`,`April`,`May`,`June`,`July`,`August`,`September`,`October`,`November`,`December`],f=[`Su`,`Mo`,`Tu`,`We`,`Th`,`Fr`,`Sa`],p=[];for(let e=1;e<=u;e++){let t=new Date(r,i,e);p.push({day:e,dayOfWeek:f[t.getDay()],isToday:s&&e===c})}let m=(n.settings&&n.settings.weekStart||`Mo`)===`Mo`?`Su`:`Sa`,h=[],g=[];p.forEach((e,t)=>{g.push(e),(e.dayOfWeek===m||t===p.length-1)&&(h.push([...g]),g=[])});let _=n.habits.length*u,v=0,y=0,b={};for(let e=1;e<=u;e++)b[e]=0;n.habits.forEach(e=>{let t=e.checks&&e.checks[a]||{};for(let e=1;e<=u;e++)t[e]&&(v++,b[e]++,s&&e===c&&y++)});let x=_>0?Math.round(v/_*100):0,S=h.map((e,t)=>{let l=e[0].day,u=e[e.length-1].day,d=e.length,f=n.habits.length*d,p=0;n.habits.forEach(t=>{let n=t.checks&&t.checks[a]||{};e.forEach(e=>{n[e.day]&&p++})});let m=f>0?Math.round(p/f*100):0,h=e.some(e=>e.isToday),g=s?u<c:o.getFullYear()>r||o.getFullYear()===r&&o.getMonth()>i,_=`var(--cyan)`;return _=m>=80?`var(--emerald)`:m>=50?`#f59e0b`:m>0?`#f97316`:`rgba(255, 255, 255, 0.18)`,{weekIndex:t+1,startDay:l,endDay:u,daysCount:d,targetChecks:f,completedChecks:p,completionRate:m,containsToday:h,isPastWeek:g,ringColor:_}}),C=n.habits.length>0&&n.habits.every(e=>!!(e.checks&&e.checks[a]||{})[c]);e.innerHTML=`
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
              ${Array.from({length:17},(e,t)=>2024+t).map(e=>`
                <option value="${e}" ${r===e?`selected`:``}>${e}</option>
              `).join(``)}
            </select>
          </div>

          <!-- Month Selector -->
          <div class="selector-box">
            <label>Month</label>
            <select id="matrix-month-select" class="nexus-select">
              ${d.map((e,t)=>`
                <option value="${t}" ${i===t?`selected`:``}>${e}</option>
              `).join(``)}
            </select>
          </div>

          <!-- Quick Jump Today Button -->
          <button id="jump-today-btn" class="nexus-btn btn-secondary" title="Jump to today's date column">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Today
          </button>

          <!-- Power Action: Check / Undo All Today -->
          <button id="mark-all-today-btn" class="nexus-btn ${C?`btn-primary`:`btn-secondary`}" title="${C?`All routines completed today! Click to undo all for today`:`Mark all routines complete for today`}">
            ${C?`✓ Done (Undo All)`:`⚡ Check All Today`}
          </button>

          <!-- Overall Completion Score -->
          <div class="matrix-score-card">
            <div class="score-label">Monthly Score</div>
            <div class="score-value ${x>=80?`text-emerald`:`text-cyan`}">
              ${x}%
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
          ${S.map(e=>{let t=(125.66*(1-e.completionRate/100)).toFixed(1);return`
              <div class="weekly-rhythm-card ${e.containsToday?`is-current-week`:``}" 
                   data-week-start="${e.startDay}"
                   role="button"
                   tabindex="0"
                   title="Week ${e.weekIndex} (${d[i].slice(0,3)} ${e.startDay} - ${e.endDay}): ${e.completedChecks}/${e.targetChecks} checks completed (${e.completionRate}%)">
                <div class="week-card-head">
                  <span class="week-title-text">Week ${e.weekIndex}</span>
                  ${e.containsToday?`<span class="week-badge-current">ACTIVE</span>`:`<span class="week-dates-span">${e.startDay}–${e.endDay}</span>`}
                </div>

                <div class="week-card-content">
                  <div class="week-ring-box">
                    <svg class="week-ring-svg" viewBox="0 0 50 50">
                      <circle class="ring-track" cx="25" cy="25" r="20" stroke-width="4.5" fill="none" />
                      <circle class="ring-bar" cx="25" cy="25" r="20" stroke-width="4.5" fill="none"
                        stroke-dasharray="125.66"
                        stroke-dashoffset="${t}"
                        stroke-linecap="round"
                        transform="rotate(-90 25 25)"
                        style="stroke: ${e.ringColor};"
                      />
                      <text x="25" y="29" class="ring-val-text">${e.completionRate}%</text>
                    </svg>
                  </div>

                  <div class="week-stat-details">
                    <div class="week-count-row">
                      <span class="week-count-done">${e.completedChecks}</span>
                      <span class="week-count-sep">/</span>
                      <span class="week-count-target">${e.targetChecks}</span>
                    </div>
                    <span class="week-stat-sub">completed</span>
                  </div>
                </div>
              </div>
            `}).join(``)}
        </div>
      </div>

      <!-- Quick Category Filter Pills -->
      <div class="habit-filter-bar">
        <span class="filter-label">Filter:</span>
        <button class="filter-pill ${z===`all`?`active`:``}" data-filter="all">All Habits (${n.habits.length})</button>
        <button class="filter-pill ${z===`Morning`?`active`:``}" data-filter="Morning">🌅 Morning</button>
        <button class="filter-pill ${z===`Fitness`?`active`:``}" data-filter="Fitness">🏃 Movement</button>
        <button class="filter-pill ${z===`Health`?`active`:``}" data-filter="Health">🥗 Health</button>
        <button class="filter-pill ${z===`Productivity`?`active`:``}" data-filter="Productivity">⚡ Deep Work</button>
        <button class="filter-pill ${z===`Mindset`?`active`:``}" data-filter="Mindset">🧘 Mindset</button>
        <button class="filter-pill ${z===`Evening`?`active`:``}" data-filter="Evening">🌙 Evening</button>
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
                  <span class="habit-count-badge">${n.habits.length} Active</span>
                </div>
              </th>
              ${h.map((e,t)=>{let n=S[t],r=n?n.completionRate:0,i=n?n.startDay:e[0]?e[0].day:1;return`
                  <th colspan="${e.length}" class="week-group-header" data-week-start="${i}" title="Click to scroll to Week ${t+1} (${n?n.startDay+`–`+n.endDay:``})">
                    <span class="wgh-title">Week ${t+1}</span>
                    <span class="wgh-pct ${r>=80?`text-emerald`:r>=50?`text-cyan`:`text-muted`}">${r}%</span>
                  </th>
                `}).join(``)}
              <th rowspan="3" class="stats-col-header">Streak</th>
              <th rowspan="3" class="stats-col-header">Rate</th>
            </tr>

            <!-- Row 2: Day of Week (Su, Mo, Tu, We, Th, Fr, Sa) -->
            <tr class="dayname-header-row">
              ${p.map(e=>`
                <th class="dayname-cell ${e.isToday?`today-header`:``}">
                  ${e.dayOfWeek}
                </th>
              `).join(``)}
            </tr>

            <!-- Row 3: Day Number (1, 2, 3 ... 31) -->
            <tr class="daynum-header-row">
              ${p.map(e=>`
                <th class="daynum-cell ${e.isToday?`today-header today-daynum`:``}" data-day="${e.day}">
                  <span class="num-wrap">${e.day}</span>
                  ${e.isToday?`<span class="today-pill">NOW</span>`:``}
                </th>
              `).join(``)}
            </tr>
          </thead>

          <tbody>
            ${n.habits.map(e=>{let t=e.checks&&e.checks[a]||{},n=Object.keys(t).length,o=u>0?Math.round(n/u*100):0,f=l.getHabitStreak(e.id,r,i),m=s&&!!t[c],h=e.color||`#38bdf8`,g=o>=85?`Master`:o>=70?`Strong`:o>=45?`Building`:`Starting`,_=o>=70?`text-emerald`:o>=45?`text-cyan`:`text-muted`;return`
                <tr class="habit-row" data-category="${e.category}" data-habit-id="${e.id}" style="${z!==`all`&&e.category.toLowerCase()!==z.toLowerCase()?`display: none;`:``}">
                  <!-- Sticky Habit Title Column with 1-Click Today Action -->
                  <td class="sticky-col habit-name-cell">
                    <div class="habit-cell-wrapper">
                      <div class="habit-emoji-box" style="background: ${h}22; border-color: ${h}60;">
                        <span>${e.emoji}</span>
                      </div>
                      <div class="habit-meta">
                        <div class="habit-title-row">
                          <span class="habit-name-text" title="${e.name}">${e.name}</span>
                          <!-- 1-Click Today Fast Check Button -->
                          ${s?`
                            <button class="habit-quick-today-btn ${m?`today-done`:`today-pending`}" 
                                    data-habit-id="${e.id}" 
                                    data-day="${c}"
                                    title="${m?`Today completed! Click to undo`:`Quick check for today`}">
                              ${m?`✓ Done`:`+ Today`}
                            </button>
                          `:``}
                        </div>
                        <div class="habit-tags">
                          <span class="habit-cat-tag" style="color: ${h}; border-color: ${h}40;">
                            ${e.category}
                          </span>
                          <span class="habit-time-tag">${e.timeOfDay}</span>
                          <span class="habit-strength-tag ${_}">${g}</span>
                        </div>
                      </div>
                      <button class="delete-habit-btn" data-habit-id="${e.id}" title="Delete Habit">
                        &times;
                      </button>
                    </div>
                  </td>

                  <!-- Day Checkbox Matrix Cells with "Don't Break The Chain" Effect -->
                  ${p.map(n=>{let r=!!t[n.day],a=n.day>1&&!!t[n.day-1],o=n.day<u&&!!t[n.day+1],s=``;return r&&(s=a&&o?`chain-middle`:!a&&o?`chain-start`:a&&!o?`chain-end`:`chain-single`),`
                      <td class="checkbox-cell ${n.isToday?`today-col`:``} ${s}" style="--habit-color: ${h};">
                        <div class="chain-bridge ${s}" style="--habit-color: ${h};"></div>
                        <div class="custom-tick-box ${r?`checked`:``}" 
                             role="button"
                             tabindex="0"
                             data-habit-id="${e.id}" 
                             data-day="${n.day}"
                             style="${r?`background: ${h}; border-color: ${h}; box-shadow: 0 0 12px ${h}55;`:``}"
                             title="${e.name} • ${d[i]} ${n.day} (${n.dayOfWeek}) • ${r?`Completed`:`Click to complete`}">
                          <div class="tick-mark">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                            </svg>
                          </div>
                        </div>
                      </td>
                    `}).join(``)}

                  <!-- Habit Streak Column -->
                  <td class="stat-cell streak-cell">
                    <span class="streak-badge ${f>0?`active`:``}"><span class="streak-fire">🔥</span><span class="streak-val">${f}d</span></span>
                  </td>

                  <!-- Habit Monthly Rate Column -->
                  <td class="stat-cell rate-cell">
                    <div class="mini-rate-wrap">
                      <span class="rate-num">${o}%</span>
                      <div class="mini-rate-bar">
                        <div class="mini-rate-fill" style="width: ${o}%; background: ${h};"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              `}).join(``)}
          </tbody>

          <!-- Daily Completion Summary Row (Bottom of grid, as shown in reference) -->
          <tfoot>
            <tr class="summary-score-row">
              <td class="sticky-col summary-label-cell">
                <div class="summary-label-content">
                  <span class="summary-title">Daily Score</span>
                  <span class="summary-sub">${v} checks logged</span>
                </div>
              </td>
              ${p.map(e=>{let t=b[e.day]||0,r=n.habits.length,a=r>0?Math.round(t/r*100):0,o=a===100;return`
                  <td class="summary-day-cell ${e.isToday?`today-col`:``} ${o?`full-day`:``}">
                    <div class="day-progress-wrap" title="${d[i]} ${e.day}: ${t}/${r} (${a}%)">
                      <span class="day-pct-text ${a===100?`text-emerald font-bold`:a>=50?`text-cyan`:`text-muted`}">
                        ${a}%
                      </span>
                      <div class="day-vbar">
                        <div class="day-vbar-fill ${a===100?`bg-gold`:a>=50?`bg-emerald`:`bg-cyan`}" style="height: ${a}%;"></div>
                      </div>
                    </div>
                  </td>
                `}).join(``)}
              <td colspan="2" class="summary-end-cell">
                <span class="total-checks-badge">✓ ${v} Done</span>
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
            <div class="insight-value">${_e(n.habits)===1?`1 Day Streak`:_e(n.habits)+` Days Streak`}</div>
            <div class="insight-sub">Consecutive momentum chain active</div>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">
            🎯
          </div>
          <div class="insight-info">
            <div class="insight-title">Today's Remaining</div>
            <div class="insight-value">${ve(n.habits,c,a)} Left</div>
            <div class="insight-sub">${y} of ${n.habits.length} habits done today</div>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
            👑
          </div>
          <div class="insight-info">
            <div class="insight-title">Flawless Days</div>
            <div class="insight-value">${ye(b,n.habits.length,u)} Days</div>
            <div class="insight-sub">100% completion logged for all routines</div>
          </div>
        </div>

        <div class="insight-card">
          <div class="insight-icon" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">
            ⚡
          </div>
          <div class="insight-info">
            <div class="insight-title">Total Monthly Check-Ins</div>
            <div class="insight-value">${v} Done</div>
            <div class="insight-sub">${x}% overall monthly consistency</div>
          </div>
        </div>
      </div>
    </div>
  `;let w=e.querySelector(`#matrix-scroll-container`);if(w){if(L!==null)w.scrollLeft=L;else if(s){let t=e.querySelector(`.today-daynum`);if(t){let e=t.offsetLeft-w.offsetWidth/2+100;w.scrollLeft=Math.max(0,e),L=w.scrollLeft}}}be(e,s,c)}function _e(e){let t=0;return e.forEach(e=>{let n=l.getHabitStreak(e.id);n>t&&(t=n)}),t}function ve(e,t,n){let r=0;return e.forEach(e=>{(e.checks&&e.checks[n]||{})[t]||r++}),r}function ye(e,t,n){if(t===0)return 0;let r=0;for(let i=1;i<=n;i++)e[i]===t&&r++;return r}function be(e,t,n){let r=e.querySelector(`#matrix-year-select`);r&&r.addEventListener(`change`,e=>{L=null,l.setSelectedMonthYear(parseInt(e.target.value),l.data.selectedMonth)});let i=e.querySelector(`#matrix-month-select`);i&&i.addEventListener(`change`,e=>{L=null,l.setSelectedMonthYear(l.data.selectedYear,parseInt(e.target.value))});let a=e.querySelector(`#jump-today-btn`);a&&a.addEventListener(`click`,()=>{let n=new Date;L=null,t||l.setSelectedMonthYear(n.getFullYear(),n.getMonth()),setTimeout(()=>{let t=e.querySelector(`.today-daynum`),n=e.querySelector(`#matrix-scroll-container`);if(t&&n){let e=n.querySelector(`.sticky-col`),r=e?e.offsetWidth:280,i=Math.max(0,t.offsetLeft-r-10);n.scrollTo({left:i,behavior:`smooth`}),L=i,t.classList.add(`week-jump-glow`),setTimeout(()=>t.classList.remove(`week-jump-glow`),1200),u.playPop()}},t?20:120)});let o=e.querySelector(`#mark-all-today-btn`);o&&o.addEventListener(`click`,()=>{let e=new Date,n=l.getMonthKey(e.getFullYear(),e.getMonth()),r=e.getDate();t||l.setSelectedMonthYear(e.getFullYear(),e.getMonth()),l.data.habits.every(e=>e.checks&&e.checks[n]&&e.checks[n][r])?(l.data.habits.forEach(e=>{e.checks&&e.checks[n]&&delete e.checks[n][r]}),l.addXP(-100,`Undo all habits for today`),u.playUncheck()):(l.data.habits.forEach(e=>{e.checks||={},e.checks[n]||(e.checks[n]={}),e.checks[n][r]=!0}),l.addXP(100,`Completed all habits today!`),u.playLevelUp(),f({particleCount:100,spread:80,origin:{y:.6}})),l.saveData(),l.notify(`habits_bulk_checked`)}),e.querySelectorAll(`.habit-quick-today-btn`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation();let r=t.dataset.habitId,i=parseInt(t.dataset.day),a=t.classList.contains(`today-done`),o=e.querySelector(`#matrix-scroll-container`);o&&(L=o.scrollLeft),a?u.playUncheck():u.playCheck(),l.toggleHabitDay(r,i)})});let s=e.querySelectorAll(`.filter-pill`);s.forEach(t=>{t.addEventListener(`click`,()=>{s.forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`);let n=t.dataset.filter;z=n,e.querySelectorAll(`.habit-row`).forEach(e=>{n===`all`||e.dataset.category.toLowerCase()===n.toLowerCase()?e.style.display=``:e.style.display=`none`}),u.playPop()})}),e.querySelectorAll(`.custom-tick-box`).forEach(r=>{r.addEventListener(`click`,i=>{i.preventDefault();let a=r.dataset.habitId,o=parseInt(r.dataset.day),s=r.classList.contains(`checked`),c=e.querySelector(`#matrix-scroll-container`);if(c&&(L=c.scrollLeft),s)u.playUncheck(),r.classList.remove(`checked`);else if(u.playCheck(),r.classList.add(`checked`),r.classList.add(`pop-anim`),setTimeout(()=>r.classList.remove(`pop-anim`),400),t&&o===n){let e=new Date,t=l.getMonthKey(e.getFullYear(),e.getMonth());ve(l.data.habits,n,t)<=1&&(f({particleCount:80,spread:70,origin:{y:.6}}),u.playDing())}l.toggleHabitDay(a,o)})}),e.querySelectorAll(`.delete-habit-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.dataset.habitId;confirm(`Delete this habit and all its check history?`)&&(l.deleteHabit(n),u.playPop())})});let c=e.querySelector(`#open-share-streak-btn`);c&&c.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`open-modal`,{detail:{modal:`share-streak`}})),u.playPop()});let d=e.querySelector(`#open-add-habit-btn`);d&&d.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`open-modal`,{detail:{modal:`add-habit`}})),u.playPop()}),e.querySelectorAll(`.stat-cell.streak-cell`).forEach(e=>{e.style.cursor=`pointer`,e.title=`Click to generate shareable streak brag card`,e.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`open-modal`,{detail:{modal:`share-streak`}})),u.playPop()})});function p(t){if(!t)return;let n=e.querySelector(`.daynum-cell[data-day="${t}"]`);if(n&&m){let e=m.querySelector(`.sticky-col`),t=e?e.offsetWidth:280,r=Math.max(0,n.offsetLeft-t-2);m.scrollTo({left:r,behavior:`smooth`}),L=r,u.playPop(),n.classList.add(`week-jump-glow`),setTimeout(()=>n.classList.remove(`week-jump-glow`),1200)}}e.querySelectorAll(`.weekly-rhythm-card`).forEach(e=>{e.addEventListener(`click`,()=>{p(e.dataset.weekStart)})}),e.querySelectorAll(`.week-group-header`).forEach(e=>{e.style.cursor=`pointer`,e.addEventListener(`click`,()=>{p(e.dataset.weekStart)})});let m=e.querySelector(`#matrix-scroll-container`);m&&(m.addEventListener(`scroll`,()=>{L=m.scrollLeft},{passive:!0}),L!==null&&(m.scrollLeft=L))}function xe(e){let t=l.data,n=t.selectedYear,r=t.selectedMonth,i=new Date,a=i.getFullYear()===n&&i.getMonth()===r,o=i.getDate(),s=new Date(n,r+1,0).getDate(),c=l.getMonthKey(n,r),u=[`January`,`February`,`March`,`April`,`May`,`June`,`July`,`August`,`September`,`October`,`November`,`December`],d=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],f=t.habits||[],p=f.length,m=0,h=0,g={};for(let e=1;e<=s;e++){let t=0;f.forEach(n=>{n.checks&&n.checks[c]&&n.checks[c][e]&&(t++,m++)});let i=p>0?Math.round(t/p*100):0;t>0&&h++;let s=new Date(n,r,e);g[e]={day:e,dayName:d[s.getDay()],completed:t,total:p,percent:i,isToday:a&&e===o}}let _=0;f.forEach(e=>{let t=l.getHabitStreak(e.id);t>_&&(_=t)});let v=p*(a?o:s),y=v>0?Math.round(m/v*100):0,b=`A+`;y<60?b=`C`:y<75?b=`B`:y<85&&(b=`A`),e.innerHTML=`
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
              ${Array.from({length:17},(e,t)=>2024+t).map(e=>`
                <option value="${e}" ${n===e?`selected`:``}>${e}</option>
              `).join(``)}
            </select>
          </div>

          <div class="selector-box">
            <label>Month</label>
            <select id="history-month-select" class="nexus-select">
              ${u.map((e,t)=>`
                <option value="${t}" ${r===t?`selected`:``}>${e}</option>
              `).join(``)}
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
          <div class="stat-main-val font-mono text-gold">${_} <span class="stat-unit">Days</span></div>
          <div class="stat-desc">Consecutive days without breaking chain</div>
        </div>

        <div class="streak-stat-box">
          <div class="stat-top">
            <span class="stat-label">Days Active This Month</span>
            <span class="stat-emoji-pill" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">📅</span>
          </div>
          <div class="stat-main-val font-mono text-emerald">${h} <span class="stat-unit">/ ${s} Days</span></div>
          <div class="stat-desc">${s-h} rest or off days</div>
        </div>

        <div class="streak-stat-box">
          <div class="stat-top">
            <span class="stat-label">Monthly Consistency</span>
            <span class="stat-emoji-pill" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">📈</span>
          </div>
          <div class="stat-main-val font-mono text-cyan">${y}% <span class="grade-pill">${b}</span></div>
          <div class="stat-desc">${m} total habit completions recorded</div>
        </div>

        <div class="streak-stat-box">
          <div class="stat-top">
            <span class="stat-label">Active Habits</span>
            <span class="stat-emoji-pill" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">⭐</span>
          </div>
          <div class="stat-main-val font-mono text-white">${p} <span class="stat-unit">Routines</span></div>
          <div class="stat-desc">Daily active habits tracked</div>
        </div>
      </div>

      <!-- Monthly Calendar Heatmap Grid -->
      <div class="streak-calendar-panel">
        <div class="card-header-compact">
          <h3 class="section-title">📅 ${u[r]} ${n} Consistency Map</h3>
          <span class="badge-pill font-mono">${h} Active Days</span>
        </div>

        <div class="calendar-heat-grid">
          ${Object.values(g).map(e=>{let t=e.percent===100,n=e.percent>=60,i=e.completed===0;return`
              <div class="cal-day-cell ${e.isToday?`cal-today`:``} ${t?`status-full`:n?`status-good`:i?`status-empty`:`status-partial`}"
                   title="${u[r]} ${e.day} (${e.dayName}): ${e.completed}/${e.total} habits (${e.percent}%)">
                <div class="cal-day-header">
                  <span class="cal-day-num font-mono">${e.day}</span>
                  <span class="cal-day-name">${e.dayName}</span>
                </div>
                <div class="cal-day-body">
                  <div class="cal-pct-text font-mono">${e.percent}%</div>
                  <div class="cal-mini-bar">
                    <div class="cal-mini-fill" style="width: ${e.percent}%;"></div>
                  </div>
                </div>
                ${e.isToday?`<span class="cal-today-badge">TODAY</span>`:``}
              </div>
            `}).join(``)}
        </div>
      </div>

      <!-- Habit-by-Habit Streak History Table -->
      <div class="habit-streaks-panel">
        <div class="card-header-compact">
          <h3 class="section-title">🔥 Habit Streak Leaderboard</h3>
          <span class="badge-pill">${f.length} Tracked</span>
        </div>

        <div class="habit-streaks-list">
          ${f.map(e=>{let t=e.checks&&e.checks[c]||{},n=Object.keys(t).length,r=l.getHabitStreak(e.id),i=s>0?Math.round(n/s*100):0;return`
              <div class="habit-streak-card" data-habit-id="${e.id}" title="Click to view and share streak brag card" style="cursor: pointer;">
                <div class="habit-streak-left">
                  <div class="habit-streak-icon" style="background: ${e.color}18; border: 1px solid ${e.color}40;">
                    ${e.emoji}
                  </div>
                  <div class="habit-streak-info">
                    <span class="habit-streak-title">${e.name}</span>
                    <span class="habit-streak-cat" style="color: ${e.color};">${e.category} • ${e.timeOfDay}</span>
                  </div>
                </div>

                <div class="habit-streak-middle">
                  <div class="streak-dot-row" title="Monthly completion timeline (Days 1 to ${s})">
                    ${Array.from({length:s},(e,t)=>t+1).map(n=>{let r=!!t[n];return`
                        <span class="timeline-dot ${r?`dot-done`:`dot-miss`} ${a&&n===o?`dot-today`:``}" 
                              style="${r?`background: ${e.color};`:``}"
                              title="Day ${n}: ${r?`Completed`:`Missed`}"></span>
                      `}).join(``)}
                  </div>
                </div>

                <div class="habit-streak-right">
                  <div class="streak-pill-box">
                    <span class="streak-pill-label">Streak</span>
                    <span class="streak-pill-val font-mono">🔥 ${r}d</span>
                  </div>

                  <div class="streak-pill-box">
                    <span class="streak-pill-label">Month</span>
                    <span class="streak-pill-val font-mono text-emerald">${n}/${s}d</span>
                  </div>

                  <div class="streak-pill-box">
                    <span class="streak-pill-label">Rate</span>
                    <span class="streak-pill-val font-mono text-cyan">${i}%</span>
                  </div>
                </div>
              </div>
            `}).join(``)}
        </div>
      </div>
    </div>
  `,Se(e)}function Se(e){let t=e.querySelector(`#history-year-select`);t&&t.addEventListener(`change`,e=>{l.setSelectedMonthYear(parseInt(e.target.value),l.data.selectedMonth),u.playPop()});let n=e.querySelector(`#history-month-select`);n&&n.addEventListener(`change`,e=>{l.setSelectedMonthYear(l.data.selectedYear,parseInt(e.target.value)),u.playPop()});let r=e.querySelector(`#history-today-btn`);r&&r.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault();let t=new Date;l.setSelectedMonthYear(t.getFullYear(),t.getMonth()),u.playPop()});let i=e.querySelector(`#history-share-streak-btn`);i&&i.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`open-modal`,{detail:{modal:`share-streak`}})),u.playPop()}),e.querySelectorAll(`.habit-streak-card`).forEach(e=>{e.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`open-modal`,{detail:{modal:`share-streak`}})),u.playPop()})})}var B=`month`,V=`pct`;function Ce(e){let t=l.data,n=t.selectedYear,r=t.selectedMonth,i=new Date,a=i.getFullYear()===n&&i.getMonth()===r,o=i.getDate(),s=new Date(n,r+1,0).getDate(),c=l.getMonthKey(n,r),u=[`January`,`February`,`March`,`April`,`May`,`June`,`July`,`August`,`September`,`October`,`November`,`December`],d=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],f=[`Sunday`,`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`],p=t.habits||[],m=p.length,h=[],g=0,_=0;for(let e=1;e<=s;e++){let t=0,i=[];p.forEach(n=>{n.checks&&n.checks[c]&&n.checks[c][e]&&(t++,g++,i.push(n.name))});let s=m>0?Math.round(t/m*100):0;m>0&&t===m&&_++;let l=new Date(n,r,e);h.push({day:e,dateObj:l,dayOfWeekShort:d[l.getDay()],dayOfWeekFull:f[l.getDay()],dayOfWeekIndex:l.getDay(),completed:t,total:m,percent:s,isToday:a&&e===o,habits:i})}let v=[...h];if(B===`7d`){let e=a?o:s,t=Math.max(1,e-6);v=h.filter(n=>n.day>=t&&n.day<=e)}else if(B===`14d`){let e=a?o:s,t=Math.max(1,e-13);v=h.filter(n=>n.day>=t&&n.day<=e)}let y=v.length*m,b=v.reduce((e,t)=>e+t.completed,0),x=y>0?Math.round(b/y*100):0,S=[1,2,3,4,5,6,0].map(e=>{let t=h.filter(t=>t.dayOfWeekIndex===e),n=t.length,r=t.reduce((e,t)=>e+t.completed,0),i=n*m,a=i>0?Math.round(r/i*100):0;return{nameShort:d[e],nameFull:f[e],avgPct:a,totalDone:r,occurrences:n}}),C=S[0];S.forEach(e=>{e.avgPct>C.avgPct&&(C=e)});let w=S.slice(0,5),T=S.slice(5,7),E=Math.round(w.reduce((e,t)=>e+t.avgPct,0)/5),D=Math.round(T.reduce((e,t)=>e+t.avgPct,0)/2),O={},k={Health:`#10b981`,Productivity:`#38bdf8`,Mindset:`#a855f7`,Evening:`#f59e0b`,Morning:`#f97316`,Fitness:`#06b6d4`,General:`#6366f1`};p.forEach(e=>{let t=e.category||`General`;O[t]||(O[t]={name:t,habitsCount:0,checksCount:0,color:k[t]||e.color||`#38bdf8`}),O[t].habitsCount++;let n=e.checks&&e.checks[c]||{};O[t].checksCount+=Object.keys(n).length});let A=Object.values(O).sort((e,t)=>t.checksCount-e.checksCount),j=A.reduce((e,t)=>e+t.checksCount,0);A.forEach(e=>{e.percent=j>0?Math.round(e.checksCount/j*100):0});let M=p.map(e=>{let t=e.checks&&e.checks[c]||{},n=Object.keys(t).length,r=s>0?Math.round(n/s*100):0,i=l.getHabitStreak(e.id),a=`Elite`,o=`#10b981`;return r<50?(a=`Needs Focus`,o=`#f43f5e`):r<75?(a=`Building`,o=`#f59e0b`):r<90&&(a=`Strong`,o=`#06b6d4`),{...e,done:n,rate:r,streak:i,tier:a,tierColor:o}}).sort((e,t)=>t.rate-e.rate),N=v.length,P=v.map((e,t)=>{let n=55+(N>1?t/(N-1)*815:815/2),r=V===`pct`?e.percent:m>0?e.completed/m*100:0;return{x:n,y:270-r/100*240,val:r,day:e.day,dayName:e.dayOfWeekShort,completed:e.completed,total:e.total,pct:e.percent,isToday:e.isToday}});function ee(e){if(e.length===0)return``;if(e.length===1)return`M ${e[0].x} ${e[0].y}`;let t=`M ${e[0].x} ${e[0].y}`;for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1],a=(r.x+i.x)/2;t+=` C ${a} ${r.y}, ${a} ${i.y}, ${i.x} ${i.y}`}return t}let F=ee(P),te=P.length>0?P[0].x:55,ne=P.length>0?P[P.length-1].x:870,re=P.length>0?`${F} L ${ne} 270 L ${te} 270 Z`:``,ie=2*Math.PI*95,ae=0,oe=A.map(e=>{let t=j>0?e.checksCount/j:1/Math.max(1,A.length),n=t*ie,r=ie-n,i=ae;return ae+=n,{...e,fraction:t,dashLength:n,gapLength:r,offset:i}});e.innerHTML=`
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
            <button class="seg-btn ${B===`7d`?`active`:``}" data-range="7d">Last 7 Days</button>
            <button class="seg-btn ${B===`14d`?`active`:``}" data-range="14d">Last 14 Days</button>
            <button class="seg-btn ${B===`month`?`active`:``}" data-range="month">This Month</button>
          </div>

          <!-- Metric Picker Buttons -->
          <div class="analytics-segmented-control" id="metric-toggle-group">
            <button class="seg-btn ${V===`pct`?`active`:``}" data-metric="pct">% Consistency</button>
            <button class="seg-btn ${V===`count`?`active`:``}" data-metric="count">Habits Done</button>
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
          <div class="kpi-val text-cyan font-mono">${x}%</div>
          <div class="kpi-subtext">Average completion over ${v.length} days</div>
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill bg-cyan" style="width: ${x}%;"></div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Peak Discipline Day</span>
            <span class="kpi-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">🏆</span>
          </div>
          <div class="kpi-val text-emerald font-mono">${C.nameShort} <span class="kpi-val-sub">(${C.avgPct}%)</span></div>
          <div class="kpi-subtext">Highest habit adherence weekday</div>
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill bg-emerald" style="width: ${C.avgPct}%;"></div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Flawless 100% Days</span>
            <span class="kpi-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">✨</span>
          </div>
          <div class="kpi-val text-gold font-mono">${_} <span class="kpi-val-sub">/ ${s} Days</span></div>
          <div class="kpi-subtext">Every single habit ticked off</div>
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill bg-gold" style="width: ${s>0?_/s*100:0}%;"></div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Total Check-Ins</span>
            <span class="kpi-icon" style="background: rgba(168, 85, 247, 0.15); color: #a855f7;">⚡</span>
          </div>
          <div class="kpi-val text-violet font-mono">${g}</div>
          <div class="kpi-subtext">Logged in ${u[r]} ${n}</div>
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill bg-violet" style="width: ${Math.min(100,Math.max(15,g/(m*s||1)*100))}%;"></div>
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
              Interactive trend line of daily habit execution for ${u[r]} ${n}
            </p>
          </div>
          <div class="chart-legend-wrap">
            <span class="legend-item"><span class="legend-dot bg-cyan"></span> Actual Completion</span>
            <span class="legend-item"><span class="legend-dot bg-gold dashed"></span> 80% Target Goal</span>
          </div>
        </div>

        <!-- SVG Line Graph Viewport -->
        <div class="chart-svg-container" id="line-chart-container">
          <svg viewBox="0 0 900 320" class="analytics-line-svg" preserveAspectRatio="none">
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
            <line x1="55" y1="30" x2="870" y2="30" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <text x="45" y="34" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">100%</text>

            <line x1="55" y1="90" x2="870" y2="90" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <text x="45" y="94" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">75%</text>

            <line x1="55" y1="150" x2="870" y2="150" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <text x="45" y="154" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">50%</text>

            <line x1="55" y1="210" x2="870" y2="210" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <text x="45" y="214" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">25%</text>

            <line x1="55" y1="270" x2="870" y2="270" stroke="rgba(255,255,255,0.12)" />
            <text x="45" y="274" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono', monospace">0%</text>

            <!-- 80% Target Benchmark Line -->
            <line x1="55" y1="78" x2="870" y2="78" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.65" />

            <!-- Shaded Area Fill -->
            ${re?`<path d="${re}" fill="url(#areaGradient)" />`:``}

            <!-- Spline Line Curve -->
            ${F?`<path d="${F}" fill="none" stroke="url(#strokeGradient)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />`:``}

            <!-- X-Axis Day Labels & Interactive Points -->
            ${P.map(e=>`
              <g class="chart-point-group" data-day="${e.day}" data-name="${e.dayName}" data-pct="${e.pct}" data-done="${e.completed}" data-total="${e.total}">
                <!-- Hover Guide Line (Hidden by default, shown via CSS on hover) -->
                <line x1="${e.x}" y1="30" x2="${e.x}" y2="270" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" stroke-dasharray="2,2" class="point-guide-line" />
                
                <!-- Data Point Circle -->
                <circle cx="${e.x}" cy="${e.y}" r="${e.isToday?6.5:4.5}" fill="${e.isToday?`#10b981`:`#38bdf8`}" stroke="#070a12" stroke-width="2.5" class="chart-data-circle" filter="url(#pointGlow)"/>
                
                <!-- X Label -->
                <text x="${e.x}" y="292" fill="${e.isToday?`#10b981`:`#94a3b8`}" font-size="11" font-weight="${e.isToday?`800`:`600`}" text-anchor="middle" font-family="'JetBrains Mono', monospace">
                  ${e.day}
                </text>
              </g>
            `).join(``)}
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
            <span class="badge-pill font-mono">${A.length} Categories</span>
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
                <circle cx="150" cy="150" r="95" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="28" />

                <!-- Donut Slices -->
                <g transform="rotate(-90 150 150)">
                  ${oe.map(e=>`
                    <circle cx="150" cy="150" r="95"
                            fill="none"
                            stroke="${e.color}"
                            stroke-width="28"
                            stroke-dasharray="${e.dashLength} ${e.gapLength}"
                            stroke-dashoffset="-${e.offset}"
                            class="donut-segment"
                            data-cat="${e.name}"
                            data-pct="${e.percent}"
                            data-checks="${e.checksCount}">
                    </circle>
                  `).join(``)}
                </g>

                <!-- Donut Center Text -->
                <text x="150" y="140" fill="#fff" font-size="28" font-weight="800" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif">
                  ${j}
                </text>
                <text x="150" y="165" fill="#64748b" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1" font-family="'JetBrains Mono', monospace">
                  TOTAL CHECKS
                </text>
              </svg>
            </div>

            <!-- Category Legend Table & Progress Bars -->
            <div class="donut-legend-list">
              ${A.map(e=>`
                <div class="category-legend-card" style="border-left: 3px solid ${e.color};">
                  <div class="cat-legend-top">
                    <div class="cat-name-group">
                      <span class="cat-dot" style="background: ${e.color}; box-shadow: 0 0 8px ${e.color};"></span>
                      <span class="cat-title">${e.name}</span>
                    </div>
                    <span class="cat-pct font-mono" style="color: ${e.color};">${e.percent}%</span>
                  </div>
                  <div class="cat-legend-sub font-mono">
                    <span>${e.checksCount} check-ins</span> • <span>${e.habitsCount} habits</span>
                  </div>
                  <div class="cat-bar-track">
                    <div class="cat-bar-fill" style="width: ${e.percent}%; background: ${e.color};"></div>
                  </div>
                </div>
              `).join(``)}
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
              <span class="badge-pill font-mono text-cyan">W-Days: ${E}%</span>
              <span class="badge-pill font-mono text-gold">Weekend: ${D}%</span>
            </div>
          </div>

          <div class="weekday-bars-container">
            ${S.map(e=>{let t=e.nameShort===C.nameShort;return`
                <div class="weekday-bar-col ${t?`is-best`:``}">
                  <span class="bar-val-label font-mono">${e.avgPct}%</span>
                  <div class="bar-pill-track">
                    <div class="bar-pill-fill ${t?`bg-gold`:`bg-cyan`}" style="height: ${Math.max(12,e.avgPct)}%;">
                      ${t?`<span class="crown-icon">👑</span>`:``}
                    </div>
                  </div>
                  <span class="bar-day-name font-mono ${t?`text-gold`:``}">${e.nameShort}</span>
                  <span class="bar-occ-label font-mono">${e.totalDone} checks</span>
                </div>
              `}).join(``)}
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
          <span class="badge-pill">${M.length} Habits Tracked</span>
        </div>

        <div class="ranking-matrix-list">
          ${M.map((e,t)=>`
              <div class="ranking-row">
                <!-- Rank Medal -->
                <div class="rank-pos-badge ${t===0?`gold`:t===1?`silver`:t===2?`bronze`:``} font-mono">
                  #${t+1}
                </div>

                <!-- Habit Identity -->
                <div class="rank-habit-identity">
                  <div class="rank-emoji-box" style="background: ${e.color}22; border-color: ${e.color}60;">
                    ${e.emoji}
                  </div>
                  <div class="rank-name-info">
                    <span class="rank-habit-title">${e.name}</span>
                    <span class="rank-habit-meta font-mono" style="color: ${e.color};">${e.category} • ${e.timeOfDay}</span>
                  </div>
                </div>

                <!-- Progress Bar & Completion Ratio -->
                <div class="rank-bar-wrap">
                  <div class="rank-bar-info">
                    <span class="rank-stat font-mono text-white">${e.done}/${s} Days Logged</span>
                    <span class="rank-pct font-mono" style="color: ${e.color};">${e.rate}%</span>
                  </div>
                  <div class="rank-track">
                    <div class="rank-fill" style="width: ${e.rate}%; background: ${e.color}; box-shadow: 0 0 10px ${e.color}55;"></div>
                  </div>
                </div>

                <!-- Streak Flame Badge -->
                <div class="rank-streak-pill font-mono">
                  🔥 ${e.streak}d
                </div>

                <!-- Performance Tier Badge -->
                <div class="rank-tier-pill font-mono" style="color: ${e.tierColor}; border-color: ${e.tierColor}40; background: ${e.tierColor}18;">
                  ${e.tier}
                </div>
              </div>
            `).join(``)}
        </div>
      </div>

    </div>
  `,we(e)}function we(e){e.querySelectorAll(`#range-toggle-group .seg-btn`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation(),n.preventDefault(),B=t.dataset.range,u.playPop(),Ce(e)})}),e.querySelectorAll(`#metric-toggle-group .seg-btn`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation(),n.preventDefault(),V=t.dataset.metric,u.playPop(),Ce(e)})});let t=e.querySelector(`#charts-share-card-btn`);t&&t.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`open-modal`,{detail:{modal:`share-streak`}})),u.playPop()});let n=e.querySelectorAll(`.chart-point-group`),r=e.querySelector(`#chart-floating-tooltip`),i=e.querySelector(`#line-chart-container`),a=e.querySelector(`#tt-date`),o=e.querySelector(`#tt-score`),s=e.querySelector(`#tt-count`);n.forEach(e=>{e.addEventListener(`mouseenter`,t=>{let n=e.dataset.day,c=e.dataset.name,l=e.dataset.pct,d=e.dataset.done,f=e.dataset.total;if(r&&a&&o&&s){a.textContent=`Day ${n} (${c})`,o.textContent=`${l}% Discipline Score`,s.textContent=`${d} of ${f} Habits Completed`,r.style.display=`block`;let t=i.getBoundingClientRect(),u=e.querySelector(`.chart-data-circle`).getBoundingClientRect(),p=u.left-t.left-70,m=u.top-t.top-80;r.style.left=`${Math.max(10,Math.min(t.width-160,p))}px`,r.style.top=`${Math.max(10,m)}px`}u.playPop()}),e.addEventListener(`mouseleave`,()=>{r&&(r.style.display=`none`)})})}function Te(e){let t=l.data,n=new Date,r=n.getDate(),i=n.getFullYear(),a=n.getMonth(),o=l.getMonthKey(i,a),s=t.selectedYear||i,c=t.selectedMonth===void 0?a:t.selectedMonth,u=l.getMonthKey(s,c),d=new Date(s,c+1,0).getDate(),f=0,p=t.habits||[];p.forEach(e=>{e.checks&&e.checks[o]&&e.checks[o][r]&&f++});let m=p.length>0?Math.round(f/p.length*100):0,h=0;p.forEach(e=>{let t=l.getHabitStreak(e.id);t>h&&(h=t)});let g=p.length*d,_=0,v={};for(let e=1;e<=d;e++)v[e]=0;p.forEach(e=>{let t=e.checks&&e.checks[u]||{};for(let e=1;e<=d;e++)t[e]&&(_++,v[e]++)});let y=g>0?Math.round(_/g*100):0,b=0;for(let e=1;e<=d;e++)p.length>0&&v[e]===p.length&&b++;e.innerHTML=`
    <div class="overview-view">
      <!-- Welcome Hero Banner -->
      <div class="overview-hero-banner">
        <div class="hero-left">
          <div class="hero-badge">
            <span class="live-dot pulse"></span> DAILY DISCIPLINE COMMAND HUB
          </div>
          <h2 class="hero-greeting">Welcome Back, <span class="text-gradient">${t.user.name}</span></h2>
          <p class="hero-subtext">You have completed <strong class="text-emerald">${f} of ${p.length} habits</strong> today. Keep the momentum unbroken.</p>
        </div>

        <!-- Sensible Today's Focus Widget -->
        <div class="focus-summary-widget">
          <div class="focus-metric-item">
            <span class="focus-metric-val text-emerald font-mono">${f}/${p.length}</span>
            <span class="focus-metric-label">Habits Today</span>
          </div>
          <div class="focus-metric-divider"></div>
          <div class="focus-metric-item">
            <span class="focus-metric-val text-cyan font-mono">${m}%</span>
            <span class="focus-metric-label">Today Done</span>
          </div>
          <div class="focus-metric-divider"></div>
          <div class="focus-metric-item">
            <span class="focus-metric-val text-gold font-mono">🔥 ${h}d</span>
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
              <span class="pillar-status font-mono">${f} of ${p.length} Done</span>
            </div>
            <span class="pillar-pct font-mono text-emerald">${m}%</span>
          </div>

          <div class="pillar-bar-track">
            <div class="pillar-bar-fill bg-emerald" style="width: ${m}%;"></div>
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
              <span class="pillar-status font-mono">${h} Days Chain Active</span>
            </div>
            <span class="pillar-pct font-mono text-gold">
              🔥 ${h}d
            </span>
          </div>

          <div class="pillar-bar-track">
            <div class="pillar-bar-fill bg-gold" style="width: ${Math.min(100,Math.max(12,h*4))}%;"></div>
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
              <span class="pillar-status font-mono">${_} Checks Logged</span>
            </div>
            <span class="pillar-pct font-mono text-cyan">${y}%</span>
          </div>

          <div class="pillar-bar-track">
            <div class="pillar-bar-fill bg-cyan" style="width: ${y}%;"></div>
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
            <span class="badge-pill font-mono">${new Date().toLocaleDateString(`en-US`,{weekday:`short`,month:`short`,day:`numeric`})}</span>
          </div>

          <div class="fast-habit-list">
            ${p.map(e=>{let t=!!(e.checks&&e.checks[o]&&e.checks[o][r]);return`
                <div class="fast-habit-item ${t?`completed`:``}">
                  <button class="fast-check-btn ${t?`checked`:``}" 
                          data-habit-id="${e.id}" 
                          data-day="${r}"
                          data-month-key="${o}"
                          title="${t?`Click to undo`:`Mark complete`}">
                    <span class="check-icon">✓</span>
                  </button>
                  <span class="fast-emoji">${e.emoji}</span>
                  <div class="fast-habit-info">
                    <span class="fast-name">${e.name}</span>
                    <span class="fast-sub">${e.timeOfDay} • ${e.category}</span>
                  </div>
                  <span class="fast-xp-badge font-mono" style="color: var(--cyan); background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.25);">${e.category}</span>
                </div>
              `}).join(``)}
          </div>
        </div>

        <!-- Quick Log & Highlights Column -->
        <div class="quick-log-side">
          <!-- Monthly Scorecard Widget -->
          <div class="quick-card score-summary-card">
            <div class="card-header-compact">
              <span class="section-title">📊 Discipline Scorecard</span>
              <span class="badge-pill font-mono text-emerald">${y}%</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Total Done</div>
                <div style="font-size: 20px; font-weight: 800; color: #fff;" class="font-mono">${_}</div>
              </div>
              <div style="width: 1px; height: 30px; background: rgba(255,255,255,0.1);"></div>
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Flawless Days</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--gold);" class="font-mono">${b}</div>
              </div>
              <div style="width: 1px; height: 30px; background: rgba(255,255,255,0.1);"></div>
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Best Streak</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--cyan);" class="font-mono">🔥 ${h}d</div>
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
            ${(()=>{let e=0;p.forEach(t=>{t.checks&&Object.values(t.checks).forEach(t=>{e+=Object.keys(t).length})});let n=t.focus&&t.focus.lifetimeSessions||0;return`${[e>=1,h>=7,h>=14,h>=30,n>=1,e>=100].filter(Boolean).length} / 6 Unlocked`})()}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          ${(()=>{let e=0;p.forEach(t=>{t.checks&&Object.values(t.checks).forEach(t=>{e+=Object.keys(t).length})});let n=t.focus&&t.focus.lifetimeSessions||0;return[{icon:`🥉`,name:`First Spark`,desc:`Completed first habit`,unlocked:e>=1},{icon:`🛡️`,name:`Iron Will`,desc:`7-day streak reached`,unlocked:h>=7},{icon:`🧘`,name:`Monk Mode`,desc:`14-day streak reached`,unlocked:h>=14},{icon:`👑`,name:`Titan`,desc:`30-day streak reached`,unlocked:h>=30},{icon:`⏱️`,name:`Deep Worker`,desc:`Completed focus session`,unlocked:n>=1},{icon:`💎`,name:`Centurion`,desc:`100 total habit check-ins`,unlocked:e>=100}].map(e=>`
              <div style="background: ${e.unlocked?`rgba(255,255,255,0.04)`:`rgba(0,0,0,0.35)`}; border: 1px solid ${e.unlocked?`rgba(56, 189, 248, 0.35)`:`rgba(255,255,255,0.06)`}; border-radius: 12px; padding: 14px; display: flex; align-items: center; gap: 12px; opacity: ${e.unlocked?`1`:`0.45`}; transition: all 0.2s;">
                <span style="font-size: 26px; filter: ${e.unlocked?`none`:`grayscale(1)`};">${e.icon}</span>
                <div>
                  <div style="font-size: 13px; font-weight: 800; color: ${e.unlocked?`#fff`:`#94a3b8`};">${e.name}</div>
                  <div style="font-size: 11px; color: ${e.unlocked?`var(--cyan)`:`#64748b`};">${e.desc}</div>
                </div>
              </div>
            `).join(``)})()}
        </div>
      </div>
    </div>
  `,Ee(e)}function Ee(e){e.querySelectorAll(`.nav-shortcut-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.targetTab;window.dispatchEvent(new CustomEvent(`switch-tab`,{detail:{tab:t}})),u.playPop()})});let t=e.querySelector(`#quick-view-charts-btn`);t&&t.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`switch-tab`,{detail:{tab:`charts`}})),u.playPop()});let n=e.querySelector(`#quick-start-focus-btn`);n&&n.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`switch-tab`,{detail:{tab:`focus`}})),u.playPop()}),e.querySelectorAll(`.fast-check-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.habitId,n=parseInt(e.dataset.day),r=e.dataset.monthKey;if(e.classList.contains(`checked`)){u.playUncheck(),e.classList.remove(`checked`);let t=e.closest(`.fast-habit-item`);t&&t.classList.remove(`completed`)}else{u.playCheck(),e.classList.add(`checked`);let t=e.closest(`.fast-habit-item`);t&&t.classList.add(`completed`)}l.toggleHabitDay(t,n,r)})});let r=e.querySelector(`#quick-add-habit-btn`);r&&r.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`open-modal`,{detail:{modal:`add-habit`}})),u.playPop()});let i=e.querySelector(`#quick-view-streaks-btn`);i&&i.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`switch-tab`,{detail:{tab:`streaks`}})),u.playPop()});let a=e.querySelector(`#quick-confetti-btn`);a&&a.addEventListener(`click`,()=>{u.playLevelUp(),f({particleCount:100,spread:80,origin:{y:.6}})})}var H=null,U=`deep_work`,W=1500,G=1500,K=!1,De=``,q={deep_work:{name:`Deep Work`,minutes:25,isBreak:!1,icon:`⚡`},ultra:{name:`Ultra Focus`,minutes:50,isBreak:!1,icon:`🧠`},sprint:{name:`Quick Sprint`,minutes:15,isBreak:!1,icon:`🚀`},short_break:{name:`Short Break`,minutes:5,isBreak:!0,icon:`☕`},long_break:{name:`Long Break`,minutes:15,isBreak:!0,icon:`🌴`}},J=`brown`,Y=.5;function Oe(e){let t=l.data,n=t.focus||{sessionsToday:0,totalMinutesToday:0,lifetimeSessions:0},r=t.habits||[],i=Math.floor(G/60).toString().padStart(2,`0`),a=(G%60).toString().padStart(2,`0`),o=2*Math.PI*110,s=o*(1-(W>0?(W-G)/W:0)),c=q[U]||q.deep_work,d=u.isAmbientPlaying();e.innerHTML=`
    <div class="focus-chamber-view">
      <!-- Focus Chamber Header -->
      <div class="focus-header-bar">
        <div class="focus-title-wrap">
          <div class="focus-badge">
            <span class="live-dot ${K?`pulse`:``}"></span> DEEP WORK FOCUS CHAMBER
          </div>
          <h2 class="focus-main-heading">Zero-Distraction <span class="text-gradient">Flow State</span></h2>
          <p class="focus-subheading">Sync your focus sessions with habits and listen to generative offline soundscapes.</p>
        </div>

        <!-- Focus Metric Pills -->
        <div class="focus-stats-row">
          <div class="focus-stat-pill">
            <span class="stat-pill-label">Sessions Today</span>
            <strong class="stat-pill-value font-mono text-cyan" id="focus-stat-sessions">${n.sessionsToday||0}</strong>
          </div>
          <div class="focus-stat-pill">
            <span class="stat-pill-label">Focus Time</span>
            <strong class="stat-pill-value font-mono text-emerald" id="focus-stat-minutes">${n.totalMinutesToday||0}m</strong>
          </div>
          <div class="focus-stat-pill">
            <span class="stat-pill-label">Total Completed</span>
            <strong class="stat-pill-value font-mono text-gold">${n.lifetimeSessions||0}</strong>
          </div>
        </div>
      </div>

      <!-- Main Dual Chamber: Left = Timer, Right = Soundscapes & Habit Sync -->
      <div class="focus-chamber-grid">
        
        <!-- Timer Card -->
        <div class="focus-timer-card">
          <!-- Preset Selector Row -->
          <div class="focus-presets-pills">
            <button class="preset-pill ${U===`deep_work`?`active`:``}" data-preset="deep_work">⚡ 25m Deep Work</button>
            <button class="preset-pill ${U===`ultra`?`active`:``}" data-preset="ultra">🧠 50m Ultra</button>
            <button class="preset-pill ${U===`sprint`?`active`:``}" data-preset="sprint">🚀 15m Sprint</button>
            <button class="preset-pill ${U===`short_break`?`active`:``}" data-preset="short_break">☕ 5m Rest</button>
            <button class="preset-pill ${U===`long_break`?`active`:``}" data-preset="long_break">🌴 15m Break</button>
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
              <circle cx="140" cy="140" r="110" class="timer-ring-bg" />
              <!-- Progress Ring -->
              <circle cx="140" cy="140" r="110" 
                      id="timer-ring-progress" 
                      class="timer-ring-bar ${K?`glowing`:``}" 
                      stroke-dasharray="${o}" 
                      stroke-dashoffset="${s}" />
            </svg>

            <!-- Digital Display Inside Circle -->
            <div class="timer-center-content">
              <span class="timer-mode-badge">${c.icon} ${c.name.toUpperCase()}</span>
              <div class="timer-digits font-mono" id="focus-timer-digits">${i}:${a}</div>
              <span class="timer-status-hint">${K?`FLOW ACTIVE • KEEP FOCUS`:`PRESS START TO ENTER FLOW`}</span>
            </div>
          </div>

          <!-- Timer Action Controls -->
          <div class="timer-buttons-row">
            <button type="button" class="timer-btn-primary ${K?`running`:``}" id="btn-toggle-timer">
              <span>${K?`⏸️ Pause Session`:`▶ Start Focus Session`}</span>
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
                ${r.map(e=>`
                  <option value="${e.id}" ${De===e.id?`selected`:``}>
                    ${e.emoji} ${e.name} (${e.category})
                  </option>
                `).join(``)}
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
              <div class="ambient-eq ${d?`active`:``}" id="ambient-equalizer">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>

            <!-- Sound Selector Grid -->
            <div class="ambient-modes-grid">
              <button type="button" class="ambient-pill ${J===`brown`?`selected`:``}" data-ambient="brown">
                <span class="ambient-emoji">🌊</span>
                <span class="ambient-label">Brown Noise<br><small style="color: #94a3b8; font-size: 10px;">ADHD & Deep Rumble</small></span>
              </button>

              <button type="button" class="ambient-pill ${J===`rain`?`selected`:``}" data-ambient="rain">
                <span class="ambient-emoji">🌧️</span>
                <span class="ambient-label">Heavy Rain<br><small style="color: #94a3b8; font-size: 10px;">Pink Noise & Raindrops</small></span>
              </button>

              <button type="button" class="ambient-pill ${J===`binaural`?`selected`:``}" data-ambient="binaural">
                <span class="ambient-emoji">⚡</span>
                <span class="ambient-label">Alpha Waves<br><small style="color: #94a3b8; font-size: 10px;">432Hz Binaural Focus</small></span>
              </button>

              <button type="button" class="ambient-pill ${J===`keyboard`?`selected`:``}" data-ambient="keyboard">
                <span class="ambient-emoji">⌨️</span>
                <span class="ambient-label">Tactile Typing<br><small style="color: #94a3b8; font-size: 10px;">Mechanical Ambience</small></span>
              </button>
            </div>

            <!-- Ambient Playback & Volume Control -->
            <div class="ambient-controls-bar">
              <button type="button" class="btn-toggle-ambient ${d?`playing`:``}" id="btn-toggle-ambient">
                <span>${d?`⏹ Stop Sound`:`▶ Play Ambient Audio`}</span>
              </button>

              <div class="ambient-volume-wrap">
                <span style="font-size: 13px;">🔊</span>
                <input type="range" id="ambient-volume-slider" min="0" max="1" step="0.05" value="${Y}" class="ambient-slider">
                <span class="volume-val font-mono" id="ambient-volume-label">${Math.round(Y*100)}%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `,ke(e)}function ke(e){let t=e.querySelector(`#btn-toggle-timer`),n=e.querySelector(`#btn-reset-timer`),r=e.querySelector(`#focus-timer-digits`),i=e.querySelector(`#timer-ring-progress`),a=e.querySelector(`#select-linked-habit`),o=e.querySelectorAll(`.preset-pill`),s=e.querySelectorAll(`.ambient-pill`),c=e.querySelector(`#btn-toggle-ambient`),d=e.querySelector(`#ambient-volume-slider`),p=e.querySelector(`#ambient-volume-label`),m=e.querySelector(`#ambient-equalizer`);o.forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.preset;q[n]&&(U=n,W=q[n].minutes*60,G=W,K&&=(clearInterval(H),!1),u.playPop(),Oe(e))})}),t&&t.addEventListener(`click`,()=>{u.playCheck(),K?g():h(),_()}),n&&n.addEventListener(`click`,()=>{u.playPop(),g(),W=(q[U]||q.deep_work).minutes*60,G=W,_()}),a&&a.addEventListener(`change`,e=>{De=e.target.value,u.playPop()}),s.forEach(e=>{e.addEventListener(`click`,()=>{J=e.dataset.ambient,s.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),u.playPop(),u.isAmbientPlaying()&&u.startAmbient(J,Y)})}),c&&c.addEventListener(`click`,()=>{u.playPop(),u.isAmbientPlaying()?(u.stopAmbient(),c.classList.remove(`playing`),c.innerHTML=`<span>▶ Play Ambient Audio</span>`,m&&m.classList.remove(`active`)):(u.startAmbient(J,Y),c.classList.add(`playing`),c.innerHTML=`<span>⏹ Stop Sound</span>`,m&&m.classList.add(`active`))}),d&&d.addEventListener(`input`,e=>{Y=parseFloat(e.target.value),p&&(p.textContent=`${Math.round(Y*100)}%`),u.setAmbientVolume(Y)});function h(){K=!0,H=setInterval(()=>{G<=1?(clearInterval(H),K=!1,G=0,_(),v()):(G--,_())},1e3)}function g(){K=!1,H&&=(clearInterval(H),null)}function _(){let e=Math.floor(G/60).toString().padStart(2,`0`),n=(G%60).toString().padStart(2,`0`);r&&(r.textContent=`${e}:${n}`);let a=2*Math.PI*110*(1-(W>0?(W-G)/W:0));i&&(i.style.strokeDashoffset=a,K?i.classList.add(`glowing`):i.classList.remove(`glowing`)),t&&(K?(t.classList.add(`running`),t.innerHTML=`<span>⏸️ Pause Session</span>`):(t.classList.remove(`running`),t.innerHTML=`<span>▶ Start Focus Session</span>`))}function v(){let t=q[U]||q.deep_work;u.playBell(),typeof f==`function`&&f({particleCount:120,spread:90,origin:{y:.6}}),t.isBreak||l.recordFocusSession(t.minutes,De||null),W=t.minutes*60,G=W,Oe(e)}}var X=`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`;function Ae(e){let t=90;for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);t=(t<<5)-t+r*(n+7),t&=65535}return`${X.charAt(Math.abs(t)%32)}${X.charAt(Math.abs(t>>3)%32)}${X.charAt(Math.abs(t>>7)%32)}${X.charAt(Math.abs(t>>11)%32)}`}function je(e){if(!e||typeof e!=`string`)return!1;let t=e.trim().toUpperCase();if(t===`AXIO-VIP-SOHAM-2026-LIFETIME`||t===`AXIO-MASTER-KEY-2026`||t===`AXIO-VIP-2026-LIFETIME`||t===`AXIO-VIP-LIFETIME`)return!0;let n=t.match(/^AXIO-VIP-([A-Z0-9]{4})-([A-Z0-9]{4})-LIFETIME$/);if(!n)return!1;let r=n[1],i=n[2];return Ae(r)===i}function Me(){let e=window.location.hostname===`localhost`||window.location.hostname===`127.0.0.1`,t=new URLSearchParams(window.location.search),n=t.get(`key`)||t.get(`license`);if(n&&je(n))return localStorage.setItem(`axio_activated_license`,n.trim().toUpperCase()),localStorage.setItem(`axio_customer_license`,n.trim().toUpperCase()),localStorage.setItem(`axio_customer_unlocked`,`true`),!0;let r=localStorage.getItem(`axio_activated_license`)||localStorage.getItem(`axio_customer_license`),i=localStorage.getItem(`axio_customer_unlocked`)===`true`;return r&&je(r)||i&&r||e&&window.location.search.includes(`dev=true`)?!0:(Ne(),!1)}function Ne(){if(document.getElementById(`license-gate-modal`))return;let e=document.createElement(`div`);e.id=`license-gate-modal`,e.style.cssText=`
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
  `,e.innerHTML=`
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
  `,document.body.appendChild(e);let t=document.getElementById(`license-input-field`),n=document.getElementById(`license-submit-btn`),r=document.getElementById(`license-input-error`),i=()=>{let i=t.value.trim().toUpperCase();i?je(i)?(localStorage.setItem(`axio_activated_license`,i),localStorage.setItem(`axio_customer_unlocked`,`true`),r.style.display=`none`,n.innerHTML=`✓ License Activated! Unlocking...`,n.style.background=`#10b981`,u.playDing?u.playDing():u.playBell(),f({particleCount:120,spread:90,origin:{y:.6},colors:[`#10b981`,`#f97316`,`#fbbf24`,`#06b6d4`,`#ffffff`]}),setTimeout(()=>{e.style.transition=`opacity 0.4s ease`,e.style.opacity=`0`,setTimeout(()=>e.remove(),400)},700)):(r.textContent=`❌ Invalid License Key. Please enter the official key from your purchase.`,r.style.display=`block`,t.style.borderColor=`#ef4444`,u.playPop&&u.playPop(),t.animate([{transform:`translateX(0)`},{transform:`translateX(-8px)`},{transform:`translateX(8px)`},{transform:`translateX(-4px)`},{transform:`translateX(0)`}],{duration:300})):(r.textContent=`⚠️ Please enter your VIP License Key.`,r.style.display=`block`)};n.addEventListener(`click`,i),t.addEventListener(`keydown`,e=>{e.key===`Enter`&&i()}),t.focus()}var Z=`matrix`;function Pe(){document.getElementById(`main-content`);let e=document.getElementById(`main-nav-tabs`);Me(),l.checkDailyReset(),ce(),Ie(),Fe(),document.body.setAttribute(`data-theme`,l.data.settings.theme||`cyberpunk`),Be(),Le(),Re(),ze(),Ve(),e.addEventListener(`click`,e=>{let t=e.target.closest(`.nav-tab-btn`);if(!t)return;let n=t.dataset.tab;Q(n),u.playPop()}),window.addEventListener(`switch-tab`,e=>{let t=e.detail&&e.detail.tab;t&&t!==Z&&(Q(t),u.playPop())}),l.subscribe((e,t,n)=>{document.body.setAttribute(`data-theme`,l.data.settings.theme||`cyberpunk`),Fe(),$()}),He(),$()}function Q(e){Z=e,document.querySelectorAll(`.nav-tab-btn`).forEach(t=>{t.dataset.tab===e?t.classList.add(`active`):t.classList.remove(`active`)}),$()}function $(){let e=document.getElementById(`main-content`);e&&(Z===`matrix`?ge(e):Z===`streaks`?xe(e):Z===`charts`?Ce(e):Z===`focus`?Oe(e):Z===`overview`&&Te(e))}function Fe(){let e=l.data,t=new Date,n=t.getDate(),r=l.getMonthKey(t.getFullYear(),t.getMonth()),i=e.habits||[],a=i.length,o=0;i.forEach(e=>{e.checks&&e.checks[r]&&e.checks[r][n]&&o++});let s=a>0?Math.round(o/a*100):0,c=document.getElementById(`header-today-summary`),u=document.getElementById(`header-today-fill`);c&&(c.textContent=`${o}/${a} Done Today (${s}%)`),u&&(u.style.width=`${s}%`)}function Ie(){let e=document.getElementById(`live-clock-time`),t=document.getElementById(`live-clock-date`),n=new Date().getDate();function r(){let r=new Date,i=l.data.settings&&l.data.settings.clockFormat===`24h`;e&&(e.textContent=r.toLocaleTimeString(`en-US`,{hour:`2-digit`,minute:`2-digit`,second:`2-digit`,hour12:!i})),t&&(t.textContent=r.toLocaleDateString(`en-US`,{weekday:`short`,month:`short`,day:`numeric`,year:`numeric`}));let a=r.getDate();a!==n&&(n=a,l.checkDailyReset(),$(),Fe())}r(),setInterval(r,1e3)}function Le(){let e=document.getElementById(`sound-toggle-btn`),t=document.getElementById(`sound-icon`);function n(){t&&(t.textContent=u.enabled?`🔊`:`🔇`)}n(),e&&e.addEventListener(`click`,()=>{u.toggleSound(),n()})}function Re(){let e=document.getElementById(`open-settings-btn`);e&&e.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`open-modal`,{detail:{modal:`settings`}})),u.playPop()})}function ze(){let e=document.getElementById(`open-phone-sync-btn`);e&&e.addEventListener(`click`,e=>{e.stopPropagation(),e.preventDefault(),window.dispatchEvent(new CustomEvent(`open-modal`,{detail:{modal:`phone-sync`}})),u.playPop()})}function Be(){let e=window.location.hash;if(e&&e.includes(`sync=`))try{let t=e.split(`sync=`)[1];if(!t)return;let n=se.default.decompressFromEncodedURIComponent(t);if(n&&l.importJSON(n)){localStorage.setItem(`axio_customer_unlocked`,`true`);let e=localStorage.getItem(`axio_activated_license`)||`AXIO-VIP-2026-LIFETIME`;localStorage.setItem(`axio_activated_license`,e),window.history.replaceState(null,``,window.location.pathname),f({particleCount:100,spread:80,origin:{y:.5}}),u.playDing(),alert(`✓ Synchronized! All habits, streaks, and progress are now live on this device.`)}}catch(e){console.warn(`Sync decode error`,e)}}function Ve(){let e=null;window.addEventListener(`beforeinstallprompt`,t=>{t.preventDefault(),e=t;let n=document.getElementById(`pwa-install-btn`);n&&(n.style.display=`inline-flex`,n.addEventListener(`click`,async()=>{if(e){e.prompt();let{outcome:t}=await e.userChoice;t===`accepted`&&(n.style.display=`none`),e=null}}))})}function He(){window.addEventListener(`keydown`,e=>{[`INPUT`,`SELECT`,`TEXTAREA`].includes(document.activeElement.tagName)?e.key===`Escape`&&window.dispatchEvent(new CustomEvent(`close-modal`)):e.key===`1`?Q(`matrix`):e.key===`2`?Q(`streaks`):e.key===`3`?Q(`charts`):e.key===`4`?Q(`overview`):e.key===`Escape`&&window.dispatchEvent(new CustomEvent(`close-modal`))})}Pe();