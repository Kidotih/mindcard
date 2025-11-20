/* MindCard main app */
const STORAGE_KEY = 'mindcard:v2';
const moods = MOOD_MAP; // from cards.js
const paths = PATHS;

const defaultState = {
  lastOpenedDate: null,
  streak: 0,
  longestStreak: 0,
  totalUnlocked: 0,
  favorites: [],
  reflections: {}, // date -> text
  moodHistory: [], // [{date, moodId}]
  pathProgress: { // moodId -> index (0-based)
    tired:0,angry:0,overthinking:0,lost:0,motivated:0,neutral:0
  },
  darkMode:true
};

let state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  return JSON.parse(JSON.stringify(defaultState));
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function todayISO(){ return new Date().toISOString().slice(0,10); }

function showToast(msg, ms=1600){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(()=>t.classList.add('hidden'), ms);
}

/* UI refs */
const moodRow = document.getElementById('moodRow');
const cardEl = document.getElementById('card');
const truthEl = document.getElementById('truth');
const interpEl = document.getElementById('interpretation');
const challengeEl = document.getElementById('challenge');
const pathLabel = document.getElementById('pathLabel');
const dayLabel = document.getElementById('dayLabel');
const streakCount = document.getElementById('streakCount');
const totalUnlocked = document.getElementById('totalUnlocked');
const longestStreakEl = document.getElementById('longestStreak');
const modeBadge = document.getElementById('modeBadge');

const reflectModal = document.getElementById('reflectModal');
const reflectionInput = document.getElementById('reflectionInput');
const saveReflection = document.getElementById('saveReflection');
const closeReflect = document.getElementById('closeReflect');
const reflectBtn = document.getElementById('reflectBtn');

const shareBtn = document.getElementById('shareBtn');
const favBtn = document.getElementById('favBtn');

const timerModal = document.getElementById('timerModal');
const startTimerBtn = document.getElementById('startTimer');
const closeTimerBtn = document.getElementById('closeTimer');
const timerDisplay = document.getElementById('timerDisplay');
const timerBtn = document.getElementById('timerBtn');

let selectedMood = 'neutral';
let revealed = false;
let timerInterval = null;
let timerSeconds = 30;

/* build mood row */
function renderMoodRow(){
  moodRow.innerHTML = '';
  moods.forEach(m=>{
    const b = document.createElement('button');
    b.className = 'moodBtn' + (m.id===selectedMood ? ' active' : '');
    b.dataset.mood = m.id;
    b.innerHTML = `<div class="mEmoji">${m.emoji}</div><div class="mLabel">${m.label}</div>`;
    b.addEventListener('click', ()=>{ selectMood(m.id); });
    moodRow.appendChild(b);
  });
}

/* select mood */
function selectMood(moodId){
  selectedMood = moodId;
  // record mood for today (if not already)
  const today = todayISO();
  const last = state.moodHistory.length ? state.moodHistory[state.moodHistory.length-1] : null;
  if(!last || last.date !== today || last.mood !== moodId){
    state.moodHistory.push({date: today, mood: moodId});
    // keep small history
    if(state.moodHistory.length > 60) state.moodHistory.shift();
    saveState();
  }
  renderMoodRow();
  loadCardForMood(moodId);
}

/* determine current card for mood based on pathProgress */
function loadCardForMood(moodId){
  const idx = state.pathProgress[moodId] || 0;
  const path = paths[moodId];
  const card = path[idx % path.length];
  // populate UI (back)
  truthEl.textContent = card.truth;
  interpEl.textContent = card.interpretation;
  challengeEl.textContent = card.challenge;
  pathLabel.textContent = `${moodId.charAt(0).toUpperCase()+moodId.slice(1)} Path`;
  dayLabel.textContent = `Day ${ (idx % path.length) + 1 }`;
  // reset reveal state
  hideCard();
  updateUI();
}

/* reveal logic: when reveal, update streaks, progress, totals */
function revealCard(){
  if(revealed) return;
  revealed = true;
  cardEl.classList.add('revealed');

  const today = todayISO();
  if(state.lastOpenedDate === today){
    // already opened today: do nothing besides reveal
  } else {
    // update streak
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yISO = yesterday.toISOString().slice(0,10);
    if(state.lastOpenedDate === yISO){
      state.streak += 1;
    } else {
      state.streak = 1;
    }
    if(state.streak > state.longestStreak) state.longestStreak = state.streak;
    state.lastOpenedDate = today;
    state.totalUnlocked = (state.totalUnlocked || 0) + 1;

    // advance path progress for selected mood
    state.pathProgress[selectedMood] = ((state.pathProgress[selectedMood] || 0) + 1) % paths[selectedMood].length;

    saveState();
    showToast("Unlocked — small shift.");
  }
  updateUI();
}

function hideCard(){
  revealed = false;
  cardEl.classList.remove('revealed');
}

/* reflection modal */
function openReflect(){
  const today = todayISO();
  reflectionInput.value = state.reflections[today] || '';
  reflectModal.classList.remove('hidden');
  reflectionInput.focus();
}
function saveReflectionHandler(){
  const txt = reflectionInput.value.trim();
  const today = todayISO();
  if(txt.length) state.reflections[today] = txt;
  else delete state.reflections[today];
  saveState();
  reflectModal.classList.add('hidden');
  showToast('Reflection saved.');
}

/* favorites */
function toggleFavorite(){
  const moodId = selectedMood;
  const idx = state.favorites.indexOf(moodId);
  if(idx === -1){
    state.favorites.push(moodId);
    favBtn.textContent = '✓ Favorited';
    showToast('Favorited this path.');
  } else {
    state.favorites.splice(idx,1);
    favBtn.textContent = '❤ Favorite';
    showToast('Removed favorite.');
  }
  saveState();
}

/* share image generation (canvas) */
function generateShareImage(){
  const today = todayISO();
  const mood = moods.find(m=>m.id===selectedMood) || moods[0];
  const title = truthEl.textContent;
  const interp = interpEl.textContent;
  const challenge = challengeEl.textContent;

  const w = 1200, h = 630;
  const c = document.createElement('canvas'); c.width=w; c.height=h;
  const ctx = c.getContext('2d');

  // background
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0, '#0f1724'); g.addColorStop(1, '#081226');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

  // white card
  const pad = 70;
  roundRect(ctx, pad, pad, w - pad*2, h - pad*2, 20, true, false);
  ctx.fillStyle = '#081127';

  // mood
  ctx.font = 'bold 36px system-ui';
  ctx.fillStyle = '#0b1220';
  ctx.fillText(`${mood.emoji}  ${mood.label}`, pad+20, pad+55);

  // title
  ctx.font = 'bold 46px system-ui';
  wrapText(ctx, title, pad+20, pad+110, w - pad*4, 52);

  // interpretation
  ctx.font = '16px system-ui';
  ctx.fillStyle = '#3b4956';
  wrapText(ctx, interp, pad+20, pad+260, w - pad*4, 28);

  // challenge
  ctx.font = 'bold 15px system-ui';
  ctx.fillStyle = '#0b6b51';
  ctx.fillText('Try (10s):', pad+20, h - pad - 60);
  ctx.font = 'italic 15px system-ui';
  ctx.fillText(challenge, pad+150, h - pad - 60);

  // credit
  ctx.fillStyle = '#8896a6';
  ctx.font = '14px system-ui';
  ctx.fillText('Shared from MindCard', w - pad - 240, h - pad + 10);

  const dataUrl = c.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `mindcard-${today}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  showToast('Image ready to share.');
}

/* canvas helpers */
function roundRect(ctx, x, y, w, h, r, fill, stroke){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' ');
  let line = '', testLine;
  for(let n=0;n<words.length;n++){
    testLine = line + words[n] + ' ';
    if(ctx.measureText(testLine).width > maxWidth && n>0){
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else { line = testLine; }
  }
  ctx.fillText(line, x, y);
}

/* clarity timer */
function openTimer(){
  timerSeconds = 30;
  timerDisplay.textContent = timerSeconds;
  timerModal.classList.remove('hidden');
}
function startTimer(){
  startTimerBtn.disabled = true;
  timerInterval = setInterval(()=>{
    timerSeconds--;
    timerDisplay.textContent = timerSeconds;
    if(timerSeconds <= 0){
      clearInterval(timerInterval);
      startTimerBtn.disabled = false;
      showToast('Clarity complete.');
      timerModal.classList.add('hidden');
    }
  }, 1000);
}
function closeTimer(){
  clearInterval(timerInterval);
  startTimerBtn.disabled = false;
  timerModal.classList.add('hidden');
}

/* update UI values */
function updateUI(){
  streakCount.textContent = state.streak || 0;
  totalUnlocked.textContent = state.totalUnlocked || 0;
  longestStreakEl.textContent = state.longestStreak || 0;
  modeBadge.textContent = state.darkMode ? 'Dark' : 'Light';
  favBtn.textContent = state.favorites.includes(selectedMood) ? '✓ Favorited' : '❤ Favorite';
}

/* touch / click interactions for reveal */
function wireCardInteractions(){
  cardEl.addEventListener('click', ()=>{ if(!revealed) revealCard(); else hideCard(); });
  let yStart = null;
  cardEl.addEventListener('touchstart', e=>{ yStart = e.changedTouches[0].clientY; });
  cardEl.addEventListener('touchend', e=>{
    const yEnd = e.changedTouches[0].clientY;
    if(yStart && (yStart - yEnd) > 40) revealCard();
    yStart = null;
  });
}

/* PWA: register service worker */
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(()=>{/*ignore*/});
}

/* notification helper (local only scheduling using setTimeout while page open) */
/* for demo we request permission and send a notification immediately */
function requestNotifPermission(){
  if(!('Notification' in window)) return;
  Notification.requestPermission().then(perm=>{
    if(perm === 'granted'){
      try{ new Notification('MindCard ready', {body:'Your daily insight is available.'}); }catch(e){}
    }
  });
}

/* init */
function init(){
  renderMoodRow();
  selectMood(selectedMood);
  wireCardInteractions();

  reflectBtn.addEventListener('click', openReflect);
  saveReflection.addEventListener('click', saveReflectionHandler);
  closeReflect.addEventListener('click', ()=>reflectModal.classList.add('hidden'));

  shareBtn.addEventListener('click', generateShareImage);
  favBtn.addEventListener('click', toggleFavorite);

  timerBtn.addEventListener('click', openTimer);
  startTimerBtn.addEventListener('click', startTimer);
  closeTimerBtn.addEventListener('click', closeTimer);

  // quick permission prompt for notifications (optional)
  // requestNotifPermission();

  updateUI();
}

init();

