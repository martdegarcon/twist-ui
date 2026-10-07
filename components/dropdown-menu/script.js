
const { haptic } = window.Haptics;
const trig = document.getElementById('trig'), menu = document.getElementById('menu'), hl = document.getElementById('hl'), picked = document.getElementById('picked');
const items = [...menu.querySelectorAll('.mi')];
items.forEach((m, i) => m.style.animationDelay = 20 + i * 22 + 'ms');
let act = -1;
function setAct(i){
  act = i;
  items.forEach((m, k) => m.classList.toggle('act', k === i));
  hl.classList.toggle('on', i >= 0);
  if (i >= 0){ hl.style.transform = `translateY(${items[i].offsetTop}px)`; hl.classList.toggle('danger', items[i].classList.contains('danger')); }
}
function open(){ menu.classList.add('on'); trig.setAttribute('aria-expanded', 'true'); setAct(-1); haptic([8]); }
function close(){ menu.classList.remove('on'); trig.setAttribute('aria-expanded', 'false'); }
function choose(i){ haptic([15, 50, 30]); picked.textContent = `Выбрано: «${items[i].firstChild.textContent.trim()}»`; close(); }
trig.addEventListener('click', e => { e.stopPropagation(); menu.classList.contains('on') ? close() : open(); });
items.forEach((m, i) => { m.addEventListener('mouseenter', () => setAct(i)); m.addEventListener('click', () => choose(i)); });
menu.addEventListener('mouseleave', () => setAct(-1));
addEventListener('keydown', e => {
  if (!menu.classList.contains('on')) return;
  if (e.key === 'ArrowDown'){ e.preventDefault(); setAct(Math.min(act + 1, items.length - 1)); }
  if (e.key === 'ArrowUp'){ e.preventDefault(); setAct(Math.max(act - 1, 0)); }
  if (e.key === 'Enter' && act >= 0) choose(act);
  if (e.key === 'Escape') close();
});
document.addEventListener('click', e => { if (!menu.contains(e.target)) close(); });
