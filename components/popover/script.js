
const { haptic } = window.Haptics;
const NAMES = { '#97A6BE':'Туман', '#B097BE':'Сирень', '#97BEB5':'Шалфей', '#BEA997':'Песок', '#FF9B8F':'Коралл', '#F4F4F4':'Бумага' };
const pop = document.getElementById('pop');
let openBtn = null;
document.querySelectorAll('.sw button').forEach(b => b.addEventListener('click', e => {
  e.stopPropagation();
  if (openBtn === b){ close(); return; }
  const c = b.style.getPropertyValue('--c').trim();
  pop.style.setProperty('--c', c);
  document.getElementById('hex').textContent = c; document.getElementById('name').textContent = NAMES[c];
  // place below the swatch, but grow from the exact click point
  const r = b.getBoundingClientRect();
  const W = 240, H = pop.offsetHeight;
  let left = Math.min(Math.max(12, r.left + r.width / 2 - W / 2), innerWidth - W - 12);
  let top = r.bottom + 10; if (top + H > innerHeight - 12) top = r.top - H - 10;
  const ox = (e.clientX || r.left + r.width / 2) - left, oy = (e.clientY || r.top + r.height / 2) - top;
  if (openBtn){ pop.style.transition = 'none'; pop.classList.remove('on'); void pop.offsetWidth; pop.style.transition = ''; }
  pop.style.left = left + 'px'; pop.style.top = top + 'px';
  pop.style.transformOrigin = `${ox}px ${oy}px`;
  requestAnimationFrame(() => pop.classList.add('on'));
  openBtn = b; haptic([8]);
}));
function close(){ pop.classList.remove('on'); openBtn = null; }
document.addEventListener('click', e => { if (!pop.contains(e.target)) close(); });
addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
