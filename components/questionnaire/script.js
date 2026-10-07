
const { haptic } = window.Haptics;
const Q = [
  { q:'Привет! Для чего нужно пространство?', a:['Для клиентов','Свои проекты','Для команды'] },
  { q:'Сколько человек в команде?', a:['Только я','2–10','10+'] },
  { q:'И последнее: светлая или тёмная тема?', a:['Светлая','Тёмная','Как в системе'] },
];
const log = document.getElementById('log'), opts = document.getElementById('opts'), steps = [...document.querySelectorAll('.steps i')];
const E = 'cubic-bezier(.25,1,.5,1)';
const wait = ms => new Promise(r => setTimeout(r, ms));
let step = 0, answers = [], busy = false;

async function botSay(text){
  const m = document.createElement('div'); m.className = 'msg bot';
  m.innerHTML = '<span class="typing"><b></b><b></b><b></b></span>';
  log.appendChild(m);
  m.animate([{ opacity:0, transform:'translateY(8px)' }, { opacity:1, transform:'none' }], { duration:300, easing:E });
  await wait(700);
  m.innerHTML = text.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
  const ws = [...m.querySelectorAll('.w')];
  for (const w of ws){ w.classList.add('on'); await wait(45); }
}
function showOptions(list){
  opts.innerHTML = '';
  list.forEach((a, i) => {
    const b = document.createElement('button'); b.className = 'opt'; b.textContent = a;
    b.addEventListener('click', () => pick(b, a));
    opts.appendChild(b);
    setTimeout(() => b.classList.add('in'), 60 + i * 60);
  });
}
async function pick(btn, text){
  if (busy) return; busy = true;
  haptic([12]);
  // the reply bubble takes its final place invisibly; the chip flies there and becomes it
  const me = document.createElement('div'); me.className = 'msg me ghost'; me.textContent = text;
  log.appendChild(me);
  const from = btn.getBoundingClientRect(), to = me.getBoundingClientRect();
  const fly = document.createElement('div'); fly.className = 'flyer'; fly.textContent = text;
  document.body.appendChild(fly);
  btn.classList.add('picked');
  [...opts.children].filter(b => b !== btn).forEach(b => b.classList.add('leave'));
  const a = fly.animate([
    { left:from.left+'px', top:from.top+'px', width:from.width+'px', height:from.height+'px', borderRadius:'14px', background:'rgba(244,244,244,.1)', color:'#F4F4F4', padding:'0 16px', fontWeight:400 },
    { left:to.left+'px', top:to.top+'px', width:to.width+'px', height:to.height+'px', borderRadius:'16px 16px 6px 16px', background:'#F4F4F4', color:'#121212', padding:'0 14px', fontWeight:500 },
  ], { duration:560, easing:E, fill:'forwards' });
  await a.finished;
  me.classList.remove('ghost'); fly.remove(); opts.innerHTML = '';
  steps[step].classList.add('on');
  answers.push(text); step++;
  await wait(250);
  if (step < Q.length){ await botSay(Q[step].q); showOptions(Q[step].a); }
  else {
    const theme = answers[2] === 'Как в системе' ? 'тема как в системе' : `${answers[2].toLowerCase()} тема`;
    await botSay(`Готово — ${answers[0].toLowerCase()}, ${answers[1].toLowerCase()}, ${theme}.`);
    haptic([15, 50, 30]);
    const r = document.createElement('button'); r.className = 'restart'; r.textContent = 'Начать заново';
    r.onclick = start; opts.appendChild(r);
  }
  busy = false;
}
async function start(){
  step = 0; answers = []; log.innerHTML = ''; opts.innerHTML = '';
  steps.forEach(s => s.classList.remove('on'));
  await botSay(Q[0].q); showOptions(Q[0].a);
}
start();
