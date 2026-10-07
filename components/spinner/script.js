
const { haptic } = window.Haptics;
const word = document.getElementById('word'), stage = document.getElementById('stage');
let raf = 0, letters = [], t0 = 0, settle = 0;
function setWord(w){
  word.innerHTML = [...w].map(c => `<span>${c}</span>`).join('') + '<span>.</span><span>.</span><span>.</span>';
  letters = [...word.children];
}
/* a gaussian bump of weight travels across the letters */
function frame(now){
  const t = (now - t0) / 1000, n = letters.length;
  const center = ((t * 1.1) % 1) * (n + 4) - 2;
  letters.forEach((l, i) => {
    const d = i - center, bump = Math.exp(-d * d / 2.2);
    l.style.fontWeight = Math.round(250 + bump * 650);
    l.style.transform = `translateY(${-bump * 3}px)`;
  });
  raf = requestAnimationFrame(frame);
}
function run(w, done){
  cancelAnimationFrame(raf); clearTimeout(settle);
  stage.classList.remove('fin'); word.classList.remove('done');
  setWord(w); t0 = performance.now(); raf = requestAnimationFrame(frame);
  settle = setTimeout(() => {
    // work finished: the wave stops and every letter settles at the same weight
    cancelAnimationFrame(raf); word.classList.add('done');
    letters.forEach((l, i) => { l.style.fontWeight = 600; l.style.transform = 'none'; if (i >= letters.length - 3) l.style.opacity = 0; });
    setTimeout(() => { word.innerHTML = [...done].map(c => `<span style="font-weight:600">${c}</span>`).join(''); stage.classList.add('fin'); haptic([15, 50, 30]); }, 450);
  }, 2600);
}
const DONE = { 'Загрузка':'Загружено', 'Отправка':'Отправлено', 'Сохранение':'Сохранено' };
document.querySelectorAll('.ctl .btn').forEach(b => b.addEventListener('click', () => { haptic([8]); run(b.dataset.w, DONE[b.dataset.w]); }));
run('Загрузка', 'Загружено');
