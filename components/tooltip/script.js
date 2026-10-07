
const { haptic } = window.Haptics;
const bar = document.getElementById('bar'), tip = document.getElementById('tip'), tt = document.getElementById('tt');
const meas = document.createElement('span'); meas.style.cssText = 'position:absolute;visibility:hidden;font:600 14px Onest,system-ui;white-space:nowrap'; document.body.appendChild(meas);
let shown = false, hideT, warmT, warm = false;
function show(b){
  clearTimeout(hideT);
  const text = b.dataset.t;
  meas.textContent = text; const w = meas.offsetWidth + 24;
  const cx = b.offsetLeft + b.offsetWidth / 2;
  let left = Math.max(0, Math.min(bar.clientWidth - w, cx - w / 2));
  tip.classList.toggle('instant', !shown);      // first appearance: no slide from nowhere
  tip.style.left = left + 'px'; tip.style.width = w + 'px'; tip.style.setProperty('--ax', (cx - left) + 'px');
  tt.innerHTML = [...text].map(c => `<span class="l">${c}</span>`).join('');
  [...tt.children].forEach((l, i) => setTimeout(() => l.classList.add('on'), (shown ? 60 : 0) + i * 14));
  const delay = warm ? 0 : 350;                   // after the first one, no waiting
  clearTimeout(warmT);
  warmT = setTimeout(() => { tip.classList.add('on'); shown = true; warm = true; }, delay);
}
function hide(){ clearTimeout(warmT); hideT = setTimeout(() => { tip.classList.remove('on'); shown = false; setTimeout(() => { if (!shown) warm = false; }, 600); }, 120); }
bar.querySelectorAll('.tb').forEach(b => {
  b.addEventListener('mouseenter', () => show(b)); b.addEventListener('focus', () => show(b));
  b.addEventListener('mouseleave', hide); b.addEventListener('blur', hide);
  b.addEventListener('click', () => haptic([6]));
  b.addEventListener('pointerdown', e => { if (e.pointerType === 'touch'){ warm = true; show(b); clearTimeout(b._t); b._t = setTimeout(hide, 1400); } });
});
