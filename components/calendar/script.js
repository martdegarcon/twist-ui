
const { haptic } = window.Haptics;
const grid = document.getElementById('grid'), monthEl = document.getElementById('month'), rangeEl = document.getElementById('range');
const E = 'cubic-bezier(.25,1,.5,1)';
const today = new Date(); today.setHours(0,0,0,0);
let view = new Date(today.getFullYear(), today.getMonth(), 1);
let start = null, end = null, hover = null;
const SHORT = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
const fmt = d => `${d.getDate()} ${SHORT[d.getMonth()]}`;
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const plural = (n, one, few, many) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many; };

function build(dir = 0){
  const y = view.getFullYear(), m = view.getMonth();
  // month title rolls in the travel direction
  const t = document.createElement('span'); t.textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
  const old = monthEl.querySelector('span');
  monthEl.appendChild(t);
  if (dir && old){
    old.animate([{ transform:'translateY(0)', opacity:1 }, { transform:`translateY(${-dir * 100}%)`, opacity:0 }], { duration:400, easing:E, fill:'forwards' }).finished.then(() => old.remove());
    t.animate([{ transform:`translateY(${dir * 100}%)`, opacity:0 }, { transform:'none', opacity:1 }], { duration:500, easing:E });
  } else if (old) old.remove();

  const first = (new Date(y, m, 1).getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < 42; i++){
    const date = new Date(y, m, 1 - first + i);
    cells.push(date);
  }
  grid.innerHTML = '';
  cells.forEach((date, i) => {
    const b = document.createElement('button'); b.className = 'd';
    if (date.getMonth() !== m) b.classList.add('muted');
    if (+date === +today) b.classList.add('today');
    b.innerHTML = `<span class="t">${date.getDate()}</span>`;
    b._date = date;
    b.addEventListener('click', () => pick(date));
    b.addEventListener('mouseenter', () => { hover = date; paint(); });
    grid.appendChild(b);
    // days roll in diagonally: delay grows with row + column
    if (dir) b.querySelector('.t').animate(
      [{ transform:`translateY(${dir * 14}px)`, opacity:0, filter:'blur(3px)' }, { transform:'none', opacity:1, filter:'blur(0)' }],
      { duration:450, delay:((i % 7) + Math.floor(i / 7)) * 18, easing:E, fill:'backwards' });
  });
  paint();
}
function paint(){
  const s = start, e = end || (start && hover && hover > start ? hover : null);
  grid.querySelectorAll('.d').forEach(b => {
    const d = +b._date;
    b.classList.toggle('start', !!s && d === +s);
    b.classList.toggle('end', !!e && d === +e || (!!s && !e && d === +s));
    b.classList.toggle('in', !!s && !!e && d > +s && d < +e);
  });
}
function pick(date){
  haptic([8]);
  if (!start || end || date < start){ start = date; end = null; rangeEl.textContent = `${fmt(date)} → выберите дату выезда`; }
  else { end = date; const n = Math.round((end - start) / 864e5); rangeEl.textContent = `${fmt(start)} – ${fmt(end)} · ${n} ${plural(n, 'ночь', 'ночи', 'ночей')}`; haptic([15, 50, 30]); }
  paint();
}
grid.addEventListener('mouseleave', () => { hover = null; paint(); });
document.getElementById('prev').addEventListener('click', () => { view.setMonth(view.getMonth() - 1); build(-1); });
document.getElementById('next').addEventListener('click', () => { view.setMonth(view.getMonth() + 1); build(1); });
build();
