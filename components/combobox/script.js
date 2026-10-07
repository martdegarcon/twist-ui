
const { haptic } = window.Haptics;
const CITIES = [['Амстердам','Нидерланды'],['Барселона','Испания'],['Берлин','Германия'],['Ереван','Армения'],['Казань','Россия'],
  ['Лиссабон','Португалия'],['Москва','Россия'],['Санкт-Петербург','Россия'],['Стамбул','Турция'],['Тбилиси','Грузия'],['Токио','Япония']];
const ROW = 52, MAX = 6;
const q = document.getElementById('q'), list = document.getElementById('list');
let active = 0, visible = [];

const opts = CITIES.map(([name, country]) => {
  const li = document.createElement('li');
  li.className = 'opt'; li.setAttribute('role', 'option');
  li.innerHTML = `<span class="nm">${[...name].map(c => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</span><span class="c">${country}</span>`;
  li._name = name; li._chars = [...li.querySelectorAll('.ch')];
  li.addEventListener('mousedown', e => { e.preventDefault(); pick(li); });
  list.appendChild(li); return li;
});
const empty = document.createElement('li'); empty.className = 'empty'; empty.textContent = 'Ничего не найдено'; list.appendChild(empty);

/* fuzzy subsequence match: returns matched indexes + a score (consecutive & early matches win) */
function match(name, query){
  const n = name.toLowerCase(), s = query.toLowerCase().replace(/\s+/g, '');
  if (!s) return { idx:[], score:0 };
  const idx = []; let j = 0, score = 0, prev = -2;
  for (let i = 0; i < n.length && j < s.length; i++){
    if (n[i] === s[j]){ idx.push(i); score += (i === prev + 1 ? 3 : 1) + (i === 0 ? 4 : 0); prev = i; j++; }
  }
  return j === s.length ? { idx, score: score - n.length * .05 } : null;
}

function render(){
  const query = q.value;
  const scored = opts.map(o => ({ o, m: match(o._name, query) }));
  visible = scored.filter(x => x.m).sort((a, b) => b.m.score - a.m.score || a.o._name.localeCompare(b.o._name)).slice(0, MAX);
  // weight the matched letters
  scored.forEach(({ o, m }) => o._chars.forEach((c, i) => c.classList.toggle('m', !!m && m.idx.includes(i))));
  // FLIP-free: options sit absolutely and glide to their new slot
  opts.forEach(o => o.classList.add('hide'));
  visible.forEach(({ o }, k) => { o.classList.remove('hide'); o.style.transform = `translateY(${k * ROW}px)`; });
  opts.filter(o => o.classList.contains('hide')).forEach(o => { if (!o.style.transform) o.style.transform = `translateY(${MAX * ROW}px)`; });
  active = Math.min(active, Math.max(visible.length - 1, 0));
  opts.forEach(o => o.classList.remove('act'));
  if (visible[active]) visible[active].o.classList.add('act');
  list.style.height = Math.max(visible.length, 1) * ROW + 'px';
  list.classList.toggle('none', !visible.length);
}
function pick(o){ q.value = o._name; haptic([12]); render(); q.blur(); }

q.addEventListener('input', () => { active = 0; render(); });
q.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown'){ e.preventDefault(); active = Math.min(active + 1, visible.length - 1); render(); }
  if (e.key === 'ArrowUp'){ e.preventDefault(); active = Math.max(active - 1, 0); render(); }
  if (e.key === 'Enter' && visible[active]){ e.preventDefault(); pick(visible[active].o); }
});
render();
