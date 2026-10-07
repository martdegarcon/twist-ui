const { haptic, addTapHaptics } = window.Haptics;
const btn = document.getElementById('btn');
const btnWrap = document.getElementById('btnWrap');
const status = document.getElementById('status');
const letters = [...btn.querySelectorAll('.l-write .l')];
letters.forEach((l, i) => l.style.setProperty('--i', i));

const WAIT = 12000;   // demo wait (a real product would use ~30–60 s)
let start = 0, raf = 0;
const wait = ms => new Promise(r => setTimeout(r, ms));
const ease = t => 1 - Math.pow(1 - t, 3);

/* time → letters: each letter owns a slice of the wait and fades/sharpens in during it */
function tick(now){
  const p = Math.min((now - start) / WAIT, 1);
  const n = letters.length;
  letters.forEach((l, i) => {
    const local = Math.min(Math.max(p * n - i, 0), 1);
    l.style.setProperty('--a', ease(local).toFixed(3));
  });
  if (p < 1) raf = requestAnimationFrame(tick);
  else ready();
}

function startWait(){
  btn.classList.remove('ready', 'sending', 'sent');
  btn.disabled = true;
  btnWrap.classList.remove('tappable');
  letters.forEach(l => { l.style.transition = 'none'; l.style.setProperty('--a', 0); });
  void btn.offsetWidth;
  letters.forEach(l => l.style.transition = '');
  swapTo(status, 'wait');
  start = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
}

function ready(){
  btn.disabled = false;
  btn.classList.add('ready');
  btnWrap.classList.add('tappable');
  swapTo(status, 'ready');
  haptic([20]);
}

async function send(){
  if (btn.disabled) return;
  btn.disabled = true;
  btnWrap.classList.remove('tappable');
  haptic([25]);
  btn.classList.add('sending');
  await wait(1400);
  btn.classList.add('sent');
  swapTo(status, 'sent');
  haptic([15, 50, 30]);
  await wait(2200);
  startWait();
}

btn.addEventListener('click', send);
const sw = addTapHaptics(btnWrap);
if (sw) sw.addEventListener('click', send);

startWait();
