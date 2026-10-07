
const { haptic } = window.Haptics;
const u = document.getElementById('u'), hint = document.getElementById('hint'), field = document.getElementById('field');
const MSG = {
  hint:  'От 3 до 20 знаков: латиница, цифры, _',
  short: n => `От 3 до 20 знаков — пока ${n}`,
  bad:   c => `Только латиница, цифры, _ — без «${c}»`,
  long:  'От 3 до 20 знаков — уже больше',
  ok:    v => `Отлично — @${v} свободно`,
};
let words = [];          // current word spans

/* word-level morph: keep the longest common prefix of words, swap the rest */
function morph(text){
  const next = text.split(/(?<= )/);
  let keep = 0; while (keep < words.length && keep < next.length && words[keep].textContent === next[keep]) keep++;
  words.slice(keep).forEach((w, i) => {
    const r = w.getBoundingClientRect(), pr = hint.getBoundingClientRect();
    w.style.left = r.left - pr.left + 'px'; w.style.top = r.top - pr.top + 'px';
    w.classList.add('leave'); setTimeout(() => w.remove(), 450);
  });
  words = words.slice(0, keep);
  next.slice(keep).forEach((t, i) => {
    const s = document.createElement('span'); s.className = 'w enter'; s.textContent = t;
    hint.appendChild(s); words.push(s);
    setTimeout(() => s.classList.remove('enter'), 30 + i * 40);
  });
}
hint.style.position = 'relative';

let lastState = 'hint';
function check(){
  const v = u.value;
  let state = 'hint', text = MSG.hint;
  const badChar = v.match(/[^a-z0-9_]/i);
  if (badChar){ state = 'bad'; text = MSG.bad(badChar[0]); }
  else if (v.length > 20){ state = 'bad'; text = MSG.long; }
  else if (v.length && v.length < 3){ state = 'bad'; text = MSG.short(v.length); }
  else if (v.length >= 3){ state = 'good'; text = MSG.ok(v); }
  hint.classList.toggle('bad', state === 'bad'); hint.classList.toggle('good', state === 'good');
  field.classList.toggle('bad', state === 'bad'); field.classList.toggle('good', state === 'good');
  if (state !== lastState) haptic(state === 'bad' ? [30, 70, 30] : state === 'good' ? [15] : [6]);
  lastState = state;
  morph(text);
}
u.addEventListener('input', check);
document.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => { u.value = a.dataset.v; check(); u.focus(); }));
morph(MSG.hint);
