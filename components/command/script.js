
const { haptic } = window.Haptics;
const CMDS = [["Предложения", "Новый проект", "⌘N"], ["Предложения", "Поиск файлов", "⌘P"], ["Предложения", "Пригласить коллегу", ""], ["Переходы", "Перейти в Atlas", ""], ["Переходы", "Перейти в Dealflow", ""], ["Переходы", "Открыть настройки", "⌘,"], ["Оформление", "Тёмная тема", "⇧⌘D"], ["Оформление", "Крупнее шрифт", "⌘+"], ["Помощь", "Горячие клавиши", "⌘/"]];
const k = document.getElementById('k'), scrim = document.getElementById('scrim'), kq = document.getElementById('kq'), kl = document.getElementById('kl'), hl = document.getElementById('hl');
const ROW = 44, GRP = 30;
const groups = [...new Set(CMDS.map(c => c[0]))];
const gEls = Object.fromEntries(groups.map(g => { const d = document.createElement('div'); d.className = 'row grp'; d.textContent = g; kl.appendChild(d); return [g, d]; }));
const rows = CMDS.map(([g, t, s]) => {
  const d = document.createElement('div'); d.className = 'row'; d.innerHTML = `<span>${t}</span><kbd>${s}</kbd>`;
  d._g = g; d._t = t; d.addEventListener('mousemove', () => { if (act !== d){ act = d; paintAct(); } });
  d.addEventListener('click', () => run(d));
  kl.appendChild(d); return d;
});
const none = document.createElement('div'); none.className = 'none'; none.textContent = 'Ничего не найдено'; kl.appendChild(none);
let visible = [], act = null;

const score = (t, q) => { if (!q) return 1; t = t.toLowerCase().replace(/ё/g, 'е'); q = q.toLowerCase().replace(/ё/g, 'е'); if (t.startsWith(q)) return 3; if (t.split(' ').some(w => w.startsWith(q))) return 2; return t.includes(q) ? 1 : 0; };
function render(){
  const q = kq.value.trim();
  const hits = rows.map(r => ({ r, s: score(r._t, q) })).filter(x => x.s);
  if (q) hits.sort((a, b) => b.s - a.s);
  // layout: grouped when empty query, flat ranked list while searching
  let y = 6; visible = [];
  Object.values(gEls).forEach(g => g.classList.add('hide'));
  rows.forEach(r => r.classList.add('hide'));
  if (!q){
    groups.forEach(g => {
      const inG = hits.filter(x => x.r._g === g); if (!inG.length) return;
      gEls[g].classList.remove('hide'); gEls[g].style.transform = `translateY(${y}px)`; y += GRP;
      inG.forEach(({ r }) => { r.classList.remove('hide'); r.style.transform = `translateY(${y}px)`; r._y = y; y += ROW; visible.push(r); });
    });
  } else hits.forEach(({ r }) => { r.classList.remove('hide'); r.style.transform = `translateY(${y}px)`; r._y = y; y += ROW; visible.push(r); });
  kl.style.height = Math.max(y + 6, 64) + 'px';
  kl.classList.toggle('empty', !visible.length);
  if (!visible.includes(act)) act = visible[0] || null;
  paintAct();
}
function paintAct(){
  rows.forEach(r => r.classList.toggle('act', r === act));
  hl.classList.toggle('on', !!act);
  if (act) hl.style.transform = `translateY(${act._y}px)`;
}
function run(r){ haptic([15, 50, 30]); kq.value = ''; close(); }
function open(){ k.classList.add('on'); scrim.classList.add('on'); kq.value = ''; render(); setTimeout(() => kq.focus(), 50); haptic([8]); }
function close(){ k.classList.remove('on'); scrim.classList.remove('on'); }
kq.addEventListener('input', render);
kq.addEventListener('keydown', e => {
  const i = visible.indexOf(act);
  if (e.key === 'ArrowDown'){ e.preventDefault(); act = visible[Math.min(i + 1, visible.length - 1)]; paintAct(); }
  if (e.key === 'ArrowUp'){ e.preventDefault(); act = visible[Math.max(i - 1, 0)]; paintAct(); }
  if (e.key === 'Enter' && act) run(act);
});
addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); k.classList.contains('on') ? close() : open(); }
  if (e.key === 'Escape') close();
});
document.getElementById('openK').addEventListener('click', open);
scrim.addEventListener('click', close);
