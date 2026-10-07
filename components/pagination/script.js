
const { haptic } = window.Haptics;
const TOTAL = 24, SLOTS = 7;
const nums = document.getElementById('nums'), pill = document.getElementById('pill');
const d1 = document.getElementById('d1'), d2 = document.getElementById('d2');
[d1, d2].forEach(d => d.innerHTML = Array.from({ length:10 }, (_, i) => `<b>${i}</b>`).join(''));
let page = 1;
const els = new Map();   // key → element (numbers are keyed, so they slide instead of re-rendering)

function slots(p){
  if (TOTAL <= SLOTS) return Array.from({ length:TOTAL }, (_, i) => i + 1);
  if (p <= 4) return [1,2,3,4,5,'…r',TOTAL];
  if (p >= TOTAL - 3) return [1,'…l',TOTAL-4,TOTAL-3,TOTAL-2,TOTAL-1,TOTAL];
  return [1,'…l',p-1,p,p+1,'…r',TOTAL];
}
function el(key){
  if (els.has(key)) return els.get(key);
  const b = document.createElement('button'); b.className = 'n gone';
  if (typeof key === 'string'){ b.textContent = '…'; b.classList.add('dots'); }
  else { b.textContent = key; b.addEventListener('click', () => go(key)); }
  nums.appendChild(b); els.set(key, b); return b;
}
function render(){
  const cw = nums.clientWidth / SLOTS; nums.style.setProperty('--cw', cw + 'px');
  const list = slots(page);
  els.forEach((b, k) => { if (!list.includes(k)) b.classList.add('gone'); });
  list.forEach((k, i) => {
    const b = el(k), fresh = b.classList.contains('gone') && !b.style.transform;
    if (fresh){ b.style.transition = 'none'; b.style.transform = `translateX(${i * cw}px)`; void b.offsetWidth; b.style.transition = ''; }
    b.style.transform = `translateX(${i * cw}px)`;
    b.classList.remove('gone'); b.classList.toggle('on', k === page);
    if (k === page) pill.style.transform = `translateX(${i * cw}px)`;
  });
  const s = String(page).padStart(2, '0');
  d1.querySelectorAll('b').forEach(b => b.style.setProperty('--n', s[0]));
  d2.querySelectorAll('b').forEach(b => b.style.setProperty('--n', s[1]));
  document.getElementById('prev').disabled = page === 1;
  document.getElementById('next').disabled = page === TOTAL;
}
function go(p){ p = Math.max(1, Math.min(TOTAL, p)); if (p === page) return; page = p; haptic([8]); render(); }
document.getElementById('prev').addEventListener('click', () => go(page - 1));
document.getElementById('next').addEventListener('click', () => go(page + 1));
addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(page + 1); if (e.key === 'ArrowLeft') go(page - 1); });
addEventListener('resize', render);
render();
