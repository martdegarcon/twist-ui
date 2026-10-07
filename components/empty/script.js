
const { haptic } = window.Haptics;
const NAMES = [['Атлас','#2C3853','#97A6BE'],['Dealflow','#3B2C53','#B097BE'],['Care Label','#2C4A53','#97BEB5'],['Вывоз мусора','#53412C','#BEA997'],['Песочница','#2C3353','#9AA0C4']];
const list = document.getElementById('list'), note = document.getElementById('note');
let made = 0;
const ghostHTML = '<span class="ic"></span><span class="tx"><i class="bar"></i><i class="bar s"></i></span>';
function ghost(){ const d = document.createElement('div'); d.className = 'it ghost'; d.innerHTML = ghostHTML; return d; }
function build(){ list.innerHTML = ''; made = 0; for (let i = 0; i < 3; i++) list.appendChild(ghost()); note.classList.remove('gone'); }

function lettersOf(s){ return [...s].map(c => `<span class="l">${c === ' ' ? '&nbsp;' : c}</span>`).join(''); }
function create(){
  const target = list.querySelector('.it.ghost');
  if (!target || made >= NAMES.length) return;
  const [name, a, b] = NAMES[made++];
  haptic([15, 50, 30]);
  note.classList.add('gone');
  // the outline becomes the real thing
  target.style.setProperty('--a', a); target.style.setProperty('--b', b);
  target.classList.remove('ghost'); target.classList.add('real');
  target.style.opacity = '';
  const tt = document.createElement('div'); tt.className = 'tt';
  tt.innerHTML = `<b>${lettersOf(name)}</b><span>${lettersOf('Только что · 0 файлов')}</span>`;
  target.appendChild(tt);
  [...tt.querySelectorAll('.l')].forEach((l, i) => setTimeout(() => l.classList.add('on'), 200 + i * 18));
  // keep promising: a new outline slides in at the end
  const g = ghost(); g.classList.add('new'); list.appendChild(g);
  requestAnimationFrame(() => requestAnimationFrame(() => g.classList.remove('new')));
  const ghosts = [...list.querySelectorAll('.it.ghost')];
  ghosts.forEach((gh, k) => gh.style.opacity = [1, .6, .3][k] ?? 0);
  if (ghosts.length > 3) ghosts.slice(3).forEach(x => x.remove());
}
document.getElementById('create').addEventListener('click', create);
document.getElementById('reset').addEventListener('click', build);
build();
