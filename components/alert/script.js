
const { haptic } = window.Haptics;
const L = {
  info:{ c:'#9FC2FF', bg:'rgba(159,194,255,.08)', bd:'rgba(159,194,255,.2)', w:400, i:'i', t:'Вышла новая версия', d:'Перезагрузите страницу, чтобы получить свежие токены и исправления.' },
  warn:{ c:'#FFD27A', bg:'rgba(255,210,122,.08)', bd:'rgba(255,210,122,.25)', w:600, i:'!', t:'Хранилище почти заполнено', d:'Занято 92% места в рабочем пространстве.' },
  err: { c:'#FF9B8F', bg:'rgba(255,155,143,.1)', bd:'rgba(255,155,143,.35)', w:800, i:'×', t:'Платёж не прошёл', d:'Обновите карту, чтобы не потерять командный тариф.' },
};
const slot = document.getElementById('slot'), alert = document.getElementById('alert'), dot = document.getElementById('dot');
function set(k){
  const l = L[k];
  slot.style.setProperty('--c', l.c); alert.style.setProperty('--bg', l.bg); alert.style.setProperty('--bd', l.bd); alert.style.setProperty('--w', l.w);
  document.getElementById('ic').textContent = l.i;
  const at = document.getElementById('at'), ad = document.getElementById('ad');
  [at, ad].forEach(e => e.animate([{ opacity:0, filter:'blur(3px)' }, { opacity:1, filter:'blur(0)' }], { duration:300 }));
  at.textContent = l.t; ad.textContent = l.d;
  document.querySelectorAll('.seg button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  unfold();
  haptic(k === 'err' ? [30, 70, 30] : k === 'warn' ? [20] : [8]);
}
function fold(){ alert.classList.add('folded'); dot.classList.add('on'); haptic([8]); }
function unfold(){ alert.classList.remove('folded'); dot.classList.remove('on'); }
document.getElementById('x').addEventListener('click', fold);
dot.addEventListener('click', () => { unfold(); haptic([8]); });
document.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => set(b.dataset.k)));
set('info');
