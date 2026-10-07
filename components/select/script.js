
const { haptic } = window.Haptics;
const OPTS = ["Тонкий", "Светлый", "Обычный", "Средний", "Жирный", "Сверхжирный"], W = [100, 300, 400, 500, 700, 900];
const trig = document.getElementById('trig'), list = document.getElementById('list'), val = document.getElementById('val');
const E = 'cubic-bezier(.25,1,.5,1)';
let cur = 3, open = false;
const lis = OPTS.map((o, i) => {
  const li = document.createElement('li'); li.setAttribute('role', 'option');
  li.innerHTML = `<span style="font-weight:${W[i]}">${o}</span><svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
  li.addEventListener('click', () => choose(i));
  list.appendChild(li); return li;
});
function setVal(){ val.textContent = OPTS[cur]; val.style.fontWeight = W[cur]; lis.forEach((l, i) => l.classList.toggle('cur', i === cur)); }
/* the list is positioned so the current option sits exactly over the field, then unfolds up and down from it */
function show(){
  open = true; trig.setAttribute('aria-expanded', 'true');
  const li = lis[cur], off = 6 + cur * 52 - 6;        // top of current row inside the list
  list.style.top = (-off) + 'px';
  const H = 12 + OPTS.length * 52;
  list.style.setProperty('--ct', off + 'px'); list.style.setProperty('--cb', (H - off - 64) + 'px');
  list.style.transition = 'none'; list.classList.remove('on'); void list.offsetWidth; list.style.transition = '';
  requestAnimationFrame(() => list.classList.add('on'));
  haptic([8]);
}
function hide(){
  open = false; trig.setAttribute('aria-expanded', 'false');
  const off = 6 + cur * 52 - 6, H = 12 + OPTS.length * 52;
  list.style.setProperty('--ct', off + 'px'); list.style.setProperty('--cb', (H - off - 64) + 'px');
  list.classList.remove('on');
}
function choose(i){
  const from = lis[i].querySelector('span').getBoundingClientRect();
  const prev = cur; cur = i;
  hide();
  if (i !== prev){
    // the chosen label drops from its row into the field
    const to = val.getBoundingClientRect();
    const f = document.createElement('span'); f.className = 'fly'; f.textContent = OPTS[i]; f.style.fontWeight = W[i];
    document.body.appendChild(f); val.classList.add('hide');
    f.animate([{ left:from.left+'px', top:from.top+'px' }, { left:to.left+'px', top:to.top+'px' }], { duration:420, easing:E, fill:'forwards' })
      .finished.then(() => { setVal(); val.classList.remove('hide'); f.remove(); });
    haptic([12]);
  }
}
trig.addEventListener('click', e => { e.stopPropagation(); open ? hide() : show(); });
document.addEventListener('click', e => { if (open && !list.contains(e.target)) hide(); });
addEventListener('keydown', e => {
  if (!open) return;
  if (e.key === 'Escape') hide();
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); const a = lis.findIndex(l => l.classList.contains('act')); const n = Math.max(0, Math.min(lis.length - 1, (a < 0 ? cur : a) + (e.key === 'ArrowDown' ? 1 : -1))); lis.forEach((l, k) => l.classList.toggle('act', k === n)); }
  if (e.key === 'Enter'){ const a = lis.findIndex(l => l.classList.contains('act')); choose(a < 0 ? cur : a); }
});
setVal();
