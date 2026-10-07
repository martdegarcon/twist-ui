
const { haptic } = window.Haptics;
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const ITEM = 44;
const out = document.getElementById('out');
const segs = {};
let val = { d:12, m:9, y:1999 };
const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
const RANGE = { d: () => [1, daysIn(val.y, val.m)], m: () => [0, 11], y: () => [1940, 2026] };
const label = (k, v) => k === 'm' ? MONTHS[v] : k === 'd' ? String(v).padStart(2, '0') : v;

document.querySelectorAll('.seg').forEach(seg => {
  const k = seg.dataset.k, win = seg.querySelector('.win');
  const mark = document.createElement('div'); mark.className = 'mark'; seg.prepend(mark);
  segs[k] = { seg, win, pos: 0, target: 0, raf: 0 };
  build(k);
  // wheel / drag / keys roll the drum
  seg.addEventListener('wheel', e => { e.preventDefault(); step(k, Math.sign(e.deltaY)); }, { passive:false });
  let y0 = null, v0 = 0;
  seg.addEventListener('pointerdown', e => { y0 = e.clientY; v0 = val[k]; seg.classList.add('drag'); seg.setPointerCapture(e.pointerId); seg.focus({ preventScroll:true }); });
  seg.addEventListener('pointermove', e => { if (y0 == null) return; set(k, v0 + Math.round((y0 - e.clientY) / ITEM)); });
  ['pointerup','pointercancel'].forEach(t => seg.addEventListener(t, () => { y0 = null; seg.classList.remove('drag'); }));
  seg.addEventListener('keydown', e => { if (e.key === 'ArrowUp'){ e.preventDefault(); step(k, -1); } if (e.key === 'ArrowDown'){ e.preventDefault(); step(k, 1); } });
});
function build(k){
  const { win } = segs[k], [a, b] = RANGE[k]();
  win.innerHTML = '';
  for (let v = a; v <= b; v++){ const s = document.createElement('span'); s.textContent = label(k, v); s._v = v; win.appendChild(s); }
  segs[k].pos = segs[k].target = val[k] - a;
  paint(k, true);
}
function step(k, dir){ set(k, val[k] + dir); }
function set(k, v){
  const [a, b] = RANGE[k]();
  v = Math.max(a, Math.min(b, v));
  if (v === val[k]) return;
  val[k] = v; haptic([5]);
  segs[k].target = v - a;
  animate(k);
  if (k !== 'd'){ const [, max] = RANGE.d(); if (val.d > max) val.d = max; build('d'); }
  write();
}
/* critically-damped spring toward the target index: smooth even for fast scrolls */
function animate(k){
  const s = segs[k];
  cancelAnimationFrame(s.raf);
  const tick = () => {
    s.pos += (s.target - s.pos) * .22;
    if (Math.abs(s.target - s.pos) < .002) s.pos = s.target;
    paint(k);
    if (s.pos !== s.target) s.raf = requestAnimationFrame(tick);
  };
  s.raf = requestAnimationFrame(tick);
}
function paint(k){
  const s = segs[k];
  s.win.style.transform = `translateY(${-s.pos * ITEM}px)`;
  const [a] = RANGE[k]();
  [...s.win.children].forEach(sp => sp.classList.toggle('cur', sp._v === val[k]));
}
function write(){
  const d = new Date(val.y, val.m, val.d);
  out.textContent = d.toLocaleDateString('ru-RU', { weekday:'long', day:'numeric', month:'long', year:'numeric' }).replace(/\s*г\.$/, '');
  out.textContent = out.textContent[0].toUpperCase() + out.textContent.slice(1);
}
document.getElementById('today').addEventListener('click', () => {
  const t = new Date();
  set('y', t.getFullYear()); set('m', t.getMonth()); set('d', t.getDate());
  haptic([15, 50, 30]);
});
write();
