const card = document.getElementById('card');
const btn  = document.getElementById('btn');
const repeatWrap = document.getElementById('repeatWrap');

const { haptic, addTapHaptics } = window.Haptics;

const HAPTIC = {
  light:   [25],                   // tap
  step:    [35],                   // strength → Medium
  stepUp:  [35, 90, 35],           // strength → Strong
  match:   [45],                   // passwords match
  error:   [30, 70, 30],           // passwords stopped matching
  success: [30, 100, 30, 100, 60],
};

/* split titles into letters */
document.querySelectorAll('.title .word').forEach(w => {
  [...w.dataset.text].forEach((c, i) => {
    const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i); s.textContent = c; w.appendChild(s);
  });
});

function F(id){
  const root = document.getElementById(id);
  const layers = [...root.querySelectorAll('.layer')].map(l => ({
    el:l, pre:l.querySelector('.pre'), post:l.querySelector('.post'),
    acc:l.querySelector('.acc'), ghost:l.querySelector('.ghost'), mask:l.classList.contains('mask') }));
  return { root, base:root.dataset.base, input:root.querySelector('input'), vals:root.querySelector('.vals'),
           layers, labels:[...root.querySelectorAll('.lbl > span')], eye:root.querySelector('.eye'),
           key:root.dataset.base, accLen:0, badFrom:Infinity };
}
const E = F('email'), P = F('pass'), R = F('repeat');
const FIELDS = [E,P,R];
const focused = f => document.activeElement === f.input;
const isSignup = () => card.classList.contains('signup');

/* ---- label / layout state ---- */
function setLabel(f, key){
  const filled = !!f.input.value;
  let float, nolbl, mid;
  if (key){ float = true; nolbl = false; mid = false; }
  else if (!filled){ key = f.base; float = false; nolbl = false; mid = true; }
  else { key = f.key; float = true; nolbl = true; mid = true; }
  if (key !== f.key){
    f.labels.forEach(s => {
      const was = s.classList.contains('on');
      s.classList.toggle('on', s.dataset.k === key);
      s.classList.toggle('out', was && s.dataset.k !== key);
      if (s.dataset.k === key) s.classList.remove('out');
    });
    f.key = key;
  }
  f.root.classList.toggle('float', float);
  f.root.classList.toggle('nolbl', nolbl);
  f.root.classList.toggle('mid', mid);
  f.root.classList.toggle('filled', filled);
}

/* ---- text + caret ---- */
const esc = s => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function caretPos(f){ const v = f.input.value; return focused(f) ? (f.input.selectionStart ?? v.length) : v.length; }
function scrollSync(f){ requestAnimationFrame(() => { f.vals.style.transform = `translateX(${-f.input.scrollLeft}px)`; }); }

// email: persistent spans (ghost fades, accepted text recolors)
function paintEmail(ghost){
  const f = E, v = f.input.value, pos = caretPos(f);
  const acc = pos === v.length ? Math.min(f.accLen, v.length) : 0;
  const L = f.layers[0];
  L.pre.textContent = v.slice(0, pos - acc);
  L.acc.textContent = v.slice(pos - acc, pos);
  L.post.textContent = v.slice(pos);
  const on = !!ghost && pos === v.length && focused(f);
  if (on) L.ghost.textContent = ghost;
  L.ghost.classList.toggle('show', on);
  f.root.classList.toggle('focus', focused(f));
  scrollSync(f);
}
// passwords: rebuilt per keystroke; chars from badFrom are tinted red
function paintPw(f){
  const v = f.input.value, pos = caretPos(f), bad = f.badFrom;
  f.layers.forEach(L => {
    let html = '';
    for (let i = 0; i <= v.length; i++){
      if (i === pos) html += '<i class="caret"></i>';
      if (i === v.length) break;
      const c = L.mask ? '*' : esc(v[i]);
      html += i >= bad ? `<span class="x">${c}</span>` : c;
    }
    L.el.innerHTML = html;
  });
  f.root.classList.toggle('focus', focused(f));
  scrollSync(f);
}
document.addEventListener('selectionchange', () => {
  const f = FIELDS.find(focused); if (!f) return;
  f === E ? paintEmail(emailState === 'typing' ? ghostFor(E.input.value) : '') : paintPw(f);
});
FIELDS.forEach(f => f.input.addEventListener('scroll', () => scrollSync(f)));

/* =============== EMAIL =============== */
let emailState = 'idle';   // idle | typing | checking | noacc | done
let timers = [];
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const clearAll = () => { timers.forEach(clearTimeout); timers = []; };
const DOMAIN = '@gmail.com';

function ghostFor(v){
  if (!v || v.includes(' ')) return '';
  const at = v.indexOf('@');
  if (at < 0) return v.length >= 2 ? DOMAIN : '';
  const typed = v.slice(at);
  return DOMAIN.startsWith(typed) && typed.length < DOMAIN.length ? DOMAIN.slice(typed.length) : '';
}
const isEmail = v => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
const renderEmail = () => paintEmail(emailState === 'typing' ? ghostFor(E.input.value) : '');

let checkTimer;
E.input.addEventListener('focus', () => {
  if (emailState === 'idle'){ emailState = 'typing'; setLabel(E, 'email'); }
  renderEmail();
});
E.input.addEventListener('input', () => {
  clearTimeout(checkTimer); clearAll();
  emailState = 'typing'; setLabel(E, 'email');
  renderEmail();
  if (isEmail(E.input.value)) checkTimer = setTimeout(runCheck, 800);
});
E.input.addEventListener('keydown', e => {
  const g = ghostFor(E.input.value);
  if (g && emailState === 'typing' && (e.key === 'Tab' || e.key === 'ArrowRight' || e.key === 'Enter')){
    e.preventDefault();
    E.input.value += g;
    E.accLen = g.length;
    const a = E.layers[0].acc; a.classList.remove('acc'); void a.offsetWidth; a.classList.add('acc');
    E.input.setSelectionRange(E.input.value.length, E.input.value.length);
    renderEmail();
    setTimeout(() => { E.accLen = 0; renderEmail(); }, 520);
    clearTimeout(checkTimer); checkTimer = setTimeout(runCheck, 450);
  } else if (e.key === 'Enter' && isEmail(E.input.value)){ e.preventDefault(); clearTimeout(checkTimer); runCheck(); }
});
E.input.addEventListener('blur', () => {
  if (!E.input.value){ emailState = 'idle'; setLabel(E, null); }
  else if (isEmail(E.input.value) && emailState === 'typing'){ clearTimeout(checkTimer); runCheck(); }
  renderEmail();
});

/* Checking → "New account" → whole screen turns into Sign up */
function runCheck(){
  emailState = 'checking'; setLabel(E, 'checking'); renderEmail();
  later(() => {
    emailState = 'noacc'; setLabel(E, 'noacc'); haptic(HAPTIC.light);
    later(() => { card.classList.add('signup'); updateBtn(); }, 350);
    later(() => {
      emailState = 'done'; setLabel(E, null); renderEmail();
      later(() => P.input.focus(), 300);
    }, 1500);
  }, 1100);
}

/* =============== PASSWORD =============== */
let hidden = false;
function strength(p){
  if (!p) return null;
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(p)).length;
  if (p.length >= 12 && classes >= 3) return 'strong';
  if (p.length >= 8 && classes >= 2)  return 'medium';
  return 'weak';
}
const WEIGHT = { weak:500, medium:700, strong:800 };   // Medium / Bold / ExtraBold

let prevStrength = null;
const RANK = { weak:1, medium:2, strong:3 };
function renderPass(){
  const v = P.input.value, s = strength(v);
  if (s && (RANK[s] || 0) > (RANK[prevStrength] || 0)){
    if (s === 'medium') haptic(HAPTIC.step);
    if (s === 'strong') haptic(HAPTIC.stepUp);
  }
  prevStrength = s;
  const w = s ? WEIGHT[s] : 400;
  P.layers.forEach(L => L.el.style.fontWeight = w);
  P.input.style.fontWeight = w;
  P.labels.forEach(l => l.style.fontWeight = (s && l.dataset.k === s) ? w : 400);
  setLabel(P, s || (focused(P) ? 'password' : null));
  paintPw(P);
  renderRepeat();
}
P.input.addEventListener('focus', () => { repeatWrap.classList.add('on'); renderPass(); });
P.input.addEventListener('blur', renderPass);
P.input.addEventListener('input', renderPass);
function toggleEye(){
  hidden = !hidden; haptic(HAPTIC.light);
  P.eye.classList.toggle('hidden', hidden);
  [P,R].forEach(f => f.root.classList.toggle('masked', hidden));
}
addTapHaptics(P.eye);
P.eye.addEventListener('click', e => {
  if (!e.target.classList.contains('haptic-switch')) e.preventDefault();   // stop the <label> from focusing the input
  toggleEye();
});
P.eye.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleEye(); }
});

/* =============== REPEAT =============== */
let prevRepeat = null, prevBad = false;
function renderRepeat(){
  const v = R.input.value, p = P.input.value;
  const s = strength(p), w = s ? WEIGHT[s] : 400;
  let k = 0; while (k < v.length && v[k] === p[k]) k++;      // first mismatching char
  const ok = !!v && v === p;
  R.badFrom = k < v.length ? k : Infinity;
  let key = null;
  if (v) key = ok ? 'match' : 'nomatch';
  else if (focused(R)) key = 'repeat';
  if (key === 'match' && prevRepeat !== 'match') haptic(HAPTIC.match);
  prevRepeat = key;
  const isBad = R.badFrom !== Infinity;               // a wrong character, not just "not finished yet"
  if (isBad && !prevBad) haptic(HAPTIC.error);
  prevBad = isBad;
  R.layers.forEach(L => L.el.style.fontWeight = v ? w : 400);
  R.input.style.fontWeight = v ? w : 400;
  R.root.classList.toggle('bad', !!v && !ok);
  setLabel(R, key);
  paintPw(R);
  updateBtn();
}
R.input.addEventListener('focus', renderRepeat);
R.input.addEventListener('blur', renderRepeat);
R.input.addEventListener('input', renderRepeat);

/* =============== BUTTON =============== */
function updateBtn(){
  if (btn.dataset.s === 'loading' || btn.dataset.s === 'done') return;
  btn.dataset.s = isSignup() ? 'create' : 'continue';
  const p = P.input.value, s = strength(p);
  btn.classList.toggle('ready', isSignup() && emailState === 'done' && !!s && s !== 'weak' && R.input.value === p);
}
const syncTappable = () => document.getElementById('btnWrap')
  .classList.toggle('tappable', btn.classList.contains('ready') && btn.dataset.s === 'create');
new MutationObserver(syncTappable).observe(btn, { attributes: true, attributeFilter: ['class', 'data-s'] });
const btnWrap = document.getElementById('btnWrap');
const btnSwitch = addTapHaptics(btnWrap);
if (btnSwitch) btnSwitch.addEventListener('click', submit);
btn.addEventListener('click', submit);
function submit(){
  if (!btn.classList.contains('ready') || btn.dataset.s !== 'create') return;
  haptic(HAPTIC.light);
  document.activeElement.blur();
  card.classList.add('submitting');
  btn.dataset.s = 'loading';                       // 1: label blurs out, button collapses into a circle loader
  later(() => { btn.dataset.s = 'done'; card.classList.remove('submitting'); haptic(HAPTIC.success); }, 1700);  // 2: expands, inverts, check draws
}

document.getElementById('toSignup').addEventListener('click', () => E.input.focus());
document.getElementById('toLogin').addEventListener('click', reset);
document.getElementById('reset').addEventListener('click', reset);

function reset(){
  clearAll(); clearTimeout(checkTimer);
  emailState = 'idle'; hidden = false; E.accLen = 0; R.badFrom = Infinity; prevStrength = null; prevRepeat = null; prevBad = false;
  document.activeElement.blur();
  P.eye.classList.remove('hidden');
  FIELDS.forEach(f => {
    f.input.value = ''; f.input.style.fontWeight = '';
    f.layers.forEach(L => L.el.style.fontWeight = '');
    f.root.classList.remove('masked', 'bad');
    setLabel(f, null);
  });
  P.labels.forEach(l => l.style.fontWeight = '');
  paintEmail(''); paintPw(P); paintPw(R);
  repeatWrap.classList.remove('on'); card.classList.remove('signup', 'submitting');
  btn.dataset.s = 'continue'; btn.classList.remove('ready');
}

FIELDS.forEach(f => setLabel(f, null));
paintEmail(''); paintPw(P); paintPw(R);
