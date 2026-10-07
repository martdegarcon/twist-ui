
const { haptic } = window.Haptics;
const LINES = ['Хороший шрифт', 'делает почти всё.', 'Анимация лишь', 'поясняет перемены.', 'Всё остальное —', 'украшение.'];
const txt = document.getElementById('txt'), pill = document.getElementById('pill');
const ls = LINES.map((t, i) => { const s = document.createElement('span'); s.className = 'ln'; s.textContent = t; s.style.top = 22 + i * 26 + 'px'; txt.appendChild(s); return s; });
txt.style.height = 44 + LINES.length * 26 + 8 + 'px';
let al = 'left';
function apply(a, anim = true){
  const W = txt.clientWidth - 44;
  ls.forEach((s, i) => {
    const w = s.offsetWidth, x = a === 'left' ? 0 : a === 'center' ? (W - w) / 2 : W - w;
    s.style.transitionDelay = anim ? i * 35 + 'ms' : '0ms';
    s.style.transform = `translateX(${x}px)`;
  });
  const idx = ['left','center','right'].indexOf(a);
  pill.style.transform = `translateX(${idx * 100}%)`;
  document.querySelectorAll('.tg button').forEach(b => b.classList.toggle('on', b.dataset.a === a));
  al = a;
}
document.querySelectorAll('.tg button').forEach(b => b.addEventListener('click', () => { if (b.dataset.a !== al){ haptic([8]); apply(b.dataset.a); } }));
addEventListener('resize', () => apply(al, false));
document.fonts.ready.then(() => apply(al, false)); apply('left', false);
