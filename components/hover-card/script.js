
const { haptic } = window.Haptics;
const PEOPLE = {
  anna:{ name:'Анна Ковалёва', role:'Продуктовый дизайнер', bio:'Пустые состояния, онбординг и иногда иконки. Мыслит состояниями, а не экранами.', a:'АК', s:['48 проектов','1200 подписчиков'] },
  egor:{ name:'Егор Смирнов', role:'Моушн-дизайнер', bio:'Одна кривая на всё. Проверяет каждый переход покадрово.', a:'ЕС', s:['31 проект','860 подписчиков'] },
};
const hc = document.getElementById('hc'), hcIn = document.getElementById('hcIn'), fly = document.getElementById('fly');
const E = 'cubic-bezier(.25,1,.5,1)';
let cur = null, closeT, busy = false;
const box = r => ({ left:r.left+'px', top:r.top+'px', width:r.width+'px', height:r.height+'px' });

async function open(m){
  if (cur === m) return; if (cur) close(true);
  cur = m; clearTimeout(closeT);
  const p = PEOPLE[m.dataset.who];
  hcIn.innerHTML = `<div class="top"><span class="ava">${p.a}</span><span class="nm"><span class="slot">${m.textContent}</span><span>${p.role}</span></span></div>
    <p class="bio">${p.bio}</p><div class="stats"><span><b>${p.s[0].split(' ')[0]}</b> ${p.s[0].split(' ')[1]}</span><span><b>${p.s[1].split(' ')[0]}</b> ${p.s[1].split(' ')[1]}</span></div>`;
  const from = m.getBoundingClientRect();
  const W = 300, H = hcIn.offsetHeight;
  const left = Math.min(Math.max(16, from.left - 18), innerWidth - W - 16), top = from.bottom + 10;
  const to = { left, top, width:W, height:H };
  hc.style.visibility = 'visible';
  setTimeout(() => { if (cur === m) hc.classList.add('on'); }, 480);   // only catch the pointer once it has landed
  // the mention text flies from the paragraph into the card's title slot
  const slot = hcIn.querySelector('.slot');
  fly.textContent = m.textContent; fly.style.fontSize = getComputedStyle(m).fontSize; fly.style.visibility = 'visible';
  m.classList.add('hidden');
  const slotX = left + 18 + 60, slotY = top + 18 + 2;
  fly.animate([{ left:from.left+'px', top:from.top+'px' }, { left:slotX+'px', top:slotY+'px' }], { duration:480, easing:E, fill:'forwards' });
  hc.animate([{ ...box(from), borderRadius:'6px' }, { ...box(to), borderRadius:'18px' }], { duration:480, easing:E, fill:'forwards' });
  setTimeout(() => { if (cur === m) hc.classList.add('show'); }, 160);
  haptic([6]);
}
function close(instant){
  const m = cur; if (!m) return; cur = null;
  hc.classList.remove('show', 'on');
  const from = hc.getBoundingClientRect(), to = m.getBoundingClientRect();
  const fr = fly.getBoundingClientRect();
  const d = instant ? 0 : 380;
  fly.animate([{ left:fr.left+'px', top:fr.top+'px' }, { left:to.left+'px', top:to.top+'px' }], { duration:d, easing:E, fill:'forwards' });
  hc.animate([{ ...box(from), borderRadius:'18px' }, { ...box(to), borderRadius:'6px' }], { duration:d, easing:E, fill:'forwards' }).finished.then(() => {
    if (cur) return;
    hc.style.visibility = 'hidden'; fly.style.visibility = 'hidden'; m.classList.remove('hidden');
  });
  if (instant){ m.classList.remove('hidden'); }
}
document.querySelectorAll('.mention').forEach(m => {
  m.addEventListener('mouseenter', () => open(m));
  m.addEventListener('focus', () => open(m));
  m.addEventListener('click', e => { e.preventDefault(); cur === m ? close() : open(m); });
  m.addEventListener('mouseleave', () => { closeT = setTimeout(() => close(), 220); });
});
hc.addEventListener('mouseenter', () => clearTimeout(closeT));
hc.addEventListener('mouseleave', () => { closeT = setTimeout(() => close(), 220); });
document.addEventListener('click', e => { if (cur && !hc.contains(e.target) && !e.target.closest('.mention')) close(); });
