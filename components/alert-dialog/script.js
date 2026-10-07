
const { haptic, addTapHaptics } = window.Haptics;
const HOLD_MS = 1200;
const del = document.getElementById('del'), alertEl = document.getElementById('alert'), scrim = document.getElementById('scrim');
const hold = document.getElementById('hold'), proj = document.getElementById('proj');
let h = 0, raf = 0, holding = false, last = 0, done = false;

const set = v => { h = v; hold.style.setProperty('--h', v.toFixed(4)); };
function open(){ done = false; set(0); hold.classList.remove('done','pressing'); alertEl.classList.add('on'); scrim.classList.add('on'); haptic([10]); }
function close(){ alertEl.classList.remove('on'); scrim.classList.remove('on'); stop(); }

/* fills while held, drains when released early */
function loop(now){
  const dt = now - last; last = now;
  if (holding) set(Math.min(1, h + dt / HOLD_MS));
  else set(Math.max(0, h - dt / 350));
  if (h >= 1 && !done) return complete();
  if (holding || h > 0) raf = requestAnimationFrame(loop);
}
function start(e){
  if (done) return;
  e.preventDefault();
  holding = true; hold.classList.add('pressing');
  haptic([8]);
  last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
}
function stop(){
  holding = false; hold.classList.remove('pressing');
  last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
}
function complete(){
  done = true; holding = false;
  hold.classList.remove('pressing'); hold.classList.add('done');
  haptic([30, 80, 60]);
  setTimeout(() => { close(); proj.classList.add('gone'); }, 650);
}

hold.addEventListener('pointerdown', start);
['pointerup','pointerleave','pointercancel'].forEach(t => hold.addEventListener(t, () => { if (holding) stop(); }));
hold.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start(e); });
hold.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') stop(); });
del.addEventListener('click', open);
document.getElementById('cancel').addEventListener('click', close);
scrim.addEventListener('click', close);
addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
document.getElementById('restore').addEventListener('click', () => proj.classList.remove('gone'));
