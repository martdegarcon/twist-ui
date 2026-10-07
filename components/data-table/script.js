
const { haptic } = window.Haptics;
const DATA = [
  { name:'Northwind',   plan:'Team',       mrr:1240, seats:18 },
  { name:'Acme Studio', plan:'Pro',        mrr:480,  seats:6 },
  { name:'Bluebird',    plan:'Enterprise', mrr:5200, seats:64 },
  { name:'Kite & Co',   plan:'Pro',        mrr:320,  seats:4 },
  { name:'Lumen',       plan:'Team',       mrr:960,  seats:12 },
  { name:'Orbit Labs',  plan:'Enterprise', mrr:3800, seats:41 },
];
const ROW = 56;
const body = document.getElementById('body'), head = [...document.querySelectorAll('.head button')];
const PLAN = { Pro:1, Team:2, Enterprise:3 };
let key = null, dir = 1;

const rows = DATA.map(d => {
  const r = document.createElement('div'); r.className = 'r';
  r.innerHTML = `<i class="sep"></i><span data-k="name">${d.name}</span><span class="plan" data-k="plan">${d.plan}</span>
    <span class="num" data-k="mrr">$${d.mrr.toLocaleString('en-US')}</span><span class="num" data-k="seats">${d.seats}</span>`;
  r._d = d; body.appendChild(r); return r;
});
body.style.height = rows.length * ROW + 'px';

function layout(){
  const order = [...rows];
  if (key) order.sort((a, b) => {
    const x = a._d[key], y = b._d[key];
    const v = key === 'plan' ? PLAN[x] - PLAN[y] : typeof x === 'string' ? x.localeCompare(y) : x - y;
    return v * dir;
  });
  // each row travels to its new slot; a little stagger by distance keeps it calm
  order.forEach((r, i) => {
    const from = r._i ?? i;
    r.style.transitionDelay = Math.abs(from - i) * 18 + 'ms';
    r.style.transform = `translateY(${i * ROW}px)`;
    r.querySelector('.sep').style.opacity = i ? 1 : 0;
    r._i = i;
    r.querySelectorAll('span').forEach(s => s.classList.toggle('sorted', s.dataset.k === key));
  });
  head.forEach(b => { b.classList.toggle('on', b.dataset.k === key); b.classList.toggle('desc', b.dataset.k === key && dir < 0); });
}
head.forEach(b => b.addEventListener('click', () => {
  if (key === b.dataset.k) dir = -dir; else { key = b.dataset.k; dir = (key === 'name' || key === 'plan') ? 1 : -1; }
  haptic([8]); layout();
}));
layout();
