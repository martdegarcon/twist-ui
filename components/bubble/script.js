
const { haptic } = window.Haptics;
const log = document.getElementById('log'), comp = document.getElementById('comp'), msg = document.getElementById('msg');
const E = 'cubic-bezier(.25,1,.5,1)';
const wait = ms => new Promise(r => setTimeout(r, ms));
const REPLIES = ['Отлично, до встречи', 'Захвати и кофе', 'Уже еду'];
let busy = false, k = 0;
comp.addEventListener('submit', async e => {
  e.preventDefault(); const text = msg.value.trim(); if (!text || busy) return; busy = true;
  haptic([10]);
  log.querySelectorAll('.st').forEach(s => s.remove());
  const b = document.createElement('div'); b.className = 'b me ghost'; b.textContent = text; log.appendChild(b);
  const st = document.createElement('div'); st.className = 'st';
  st.innerHTML = `<span class="sw"><span data-k="sending" class="on">Отправка</span><span data-k="sent">Отправлено</span><span data-k="del">Доставлено</span><span data-k="read">Прочитано</span></span>
    <svg class="ticks" viewBox="0 0 22 14"><path class="t1" d="M1.5 7.5l3.5 3.5L12 3.5"/><path class="t2" d="M8.5 11l7.5-7.5"/></svg>`;
  log.appendChild(st);
  // the input text itself travels into the bubble's place and the bubble forms around it
  const from = msg.getBoundingClientRect(), to = b.getBoundingClientRect();
  const f = document.createElement('div'); f.className = 'flyer'; f.textContent = text; document.body.appendChild(f);
  msg.value = '';
  await f.animate([
    { left:from.left+'px', top:from.top+'px', width:from.width+'px', height:from.height+'px', padding:'13px 14px', borderRadius:'14px', background:'rgba(244,244,244,0)', color:'#F4F4F4' },
    { left:to.left+'px', top:to.top+'px', width:to.width+'px', height:to.height+'px', padding:'10px 14px', borderRadius:'18px 18px 6px 18px', background:'#F4F4F4', color:'#121212' },
  ], { duration:520, easing:E, fill:'forwards' }).finished;
  b.classList.remove('ghost'); f.remove();
  const sw = k => { st.querySelectorAll('.sw span').forEach(s => { const was = s.classList.contains('on'); s.classList.toggle('on', s.dataset.k === k); s.classList.toggle('out', was && s.dataset.k !== k); }); st.className = 'st ' + k; };
  await wait(300); sw('sent'); haptic([6]);
  await wait(800); sw('del');
  await wait(1100); sw('read'); haptic([12]);
  await wait(700);
  const r = document.createElement('div'); r.className = 'b them'; r.textContent = REPLIES[k++ % REPLIES.length]; log.appendChild(r);
  r.animate([{ opacity:0, transform:'translateY(10px) scale(.96)' }, { opacity:1, transform:'none' }], { duration:400, easing:E });
  while (log.children.length > 9) log.firstChild.remove();
  msg.value = ['Супер!', 'Токены уже в макете', 'До встречи'][k % 3];
  busy = false;
});
