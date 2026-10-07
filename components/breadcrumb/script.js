
const { haptic } = window.Haptics;
const PATH = ['Главная', 'Команда', 'Проекты', 'Атлас', 'Дизайн', 'Экраны', 'Онбординг'];
const frame = document.getElementById('frame'), bc = document.getElementById('bc'), w = document.getElementById('w'), pop = document.getElementById('pop');
const sepHTML = '<span class="sep">/</span>';
const dots = document.createElement('span'); dots.className = 'dots'; dots.innerHTML = '<span>…</span>' + sepHTML;
const crumbs = PATH.map((p, i) => {
  const c = document.createElement('span'); c.className = 'crumb';
  c.innerHTML = `<a>${p}</a>${i < PATH.length - 1 ? sepHTML : ''}`;
  return c;
});
bc.appendChild(crumbs[0]); bc.appendChild(dots); crumbs.slice(1).forEach(c => bc.appendChild(c));
const natural = crumbs.map(c => c.scrollWidth);

/* 1) tighten tracking, 2) fold middle crumbs from the left, keep first + last two */
function fit(){
  const avail = frame.clientWidth - 36;
  const n = PATH.length;
  let ls = -0.2, folded = 0;
  const total = (k, l) => {
    let s = 0; crumbs.forEach((c, i) => { if (i >= 1 && i < 1 + k) return; const chars = PATH[i].length; s += natural[i] + chars * (l + .2); });
    return s + (k ? 44 : 0);
  };
  while (total(folded, ls) > avail && ls > -1.2) ls -= .1;
  while (total(folded, ls) > avail && folded < n - 2) folded++;
  crumbs.forEach((c, i) => {
    c.style.setProperty('--ls', ls.toFixed(2) + 'px');
    c.classList.toggle('fold', i >= 1 && i < 1 + folded);
  });
  dots.classList.toggle('on', folded > 0);
  dots._hidden = PATH.slice(1, 1 + folded);
  if (folded !== fit._last){ if (fit._last !== undefined) haptic([6]); fit._last = folded; }
}
w.addEventListener('input', () => { frame.style.setProperty('--fw', w.value + 'px'); pop.classList.remove('on'); fit(); });
dots.addEventListener('click', e => {
  e.stopPropagation();
  const r = dots.getBoundingClientRect();
  pop.innerHTML = dots._hidden.map(p => `<a>${p}</a>`).join('');
  pop.style.left = r.left + 'px'; pop.style.top = r.bottom + 10 + 'px';
  pop.classList.toggle('on');
});
document.addEventListener('click', () => pop.classList.remove('on'));
document.fonts.ready.then(() => { crumbs.forEach((c, i) => natural[i] = c.scrollWidth); fit(); });
fit();
