
const { haptic } = window.Haptics;
const page = document.getElementById('page'), sheet = document.getElementById('sheet'), scrim = document.getElementById('scrim');
const root = document.documentElement;
let p = 0;
/* one number drives everything: sheet position, page scale, corner radius, dim */
function set(v, anim){
  p = Math.max(0, Math.min(1, v));
  [page, sheet].forEach(el => el.classList.toggle('anim', !!anim));
  root.style.setProperty('--p', p.toFixed(4));
  scrim.classList.toggle('on', p > 0);
}
function open(){ set(1, true); haptic([10]); }
function close(){ set(0, true); }
document.getElementById('open').addEventListener('click', open);
document.getElementById('done').addEventListener('click', close);
scrim.addEventListener('click', close);
addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

let y0 = null, p0 = 1, lastY = 0, lastT = 0, vel = 0;
sheet.addEventListener('pointerdown', e => {
  if (e.target.closest('button')) return;
  y0 = e.clientY; p0 = p; lastY = e.clientY; lastT = performance.now(); vel = 0;
  sheet.setPointerCapture(e.pointerId);
});
sheet.addEventListener('pointermove', e => {
  if (y0 == null) return;
  const h = sheet.offsetHeight, dy = e.clientY - y0;
  // rubber band when pulled up past fully open
  let v = p0 - dy / h; if (v > 1) v = 1 + (v - 1) * .15;
  set(v, false);
  const now = performance.now(); vel = (e.clientY - lastY) / Math.max(1, now - lastT); lastY = e.clientY; lastT = now;
});
const end = () => {
  if (y0 == null) return; y0 = null;
  if (vel > .6 || p < .6){ close(); haptic([8]); } else set(1, true);
};
sheet.addEventListener('pointerup', end); sheet.addEventListener('pointercancel', end);
