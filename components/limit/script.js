const { haptic, addTapHaptics } = window.Haptics;
const LIMIT = 80;
const TIGHT_FROM = .7;              // start tightening at 70% of the limit
const LS_NORMAL = -0.36, LS_TIGHT = -1.3;   // px

const area = document.getElementById('area');
const ta = document.getElementById('bio');
const mirror = document.getElementById('mirror');
const lbl = document.getElementById('lbl');
const overText = document.getElementById('overText');
const save = document.getElementById('save');
let wasOver = false;

const plural = (k, one, few, many) => { const a = k % 10, b = k % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many; };
const overLabel = k => `${plural(k, 'Лишний', 'Лишние', 'Лишних')} ${k} ${plural(k, 'символ', 'символа', 'символов')}`;
const esc = s => s.replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]));

function render(){
  const v = ta.value, n = [...v].length;
  const r = n / LIMIT;

  // tracking tightens smoothly from 70% → 100% of the limit
  const t = Math.min(Math.max((r - TIGHT_FROM) / (1 - TIGHT_FROM), 0), 1);
  const ls = LS_NORMAL + (LS_TIGHT - LS_NORMAL) * t * t;
  area.style.setProperty('--ls', ls.toFixed(3) + 'px');

  // overflow: characters past the limit fade out under a blur
  const chars = [...v];
  const ok = chars.slice(0, LIMIT).join(''), extra = chars.slice(LIMIT).join('');
  mirror.innerHTML = v ? esc(ok) + (extra ? `<span class="x">${esc(extra)}</span>` : '') + '​'
                       : '<span class="ph">Дизайнер, который любит детали</span>';

  const over = n > LIMIT;
  area.classList.toggle('over', over);
  if (over) overText.textContent = overLabel(n - LIMIT);
  swapTo(lbl, over ? 'over' : t > .4 ? 'tight' : 'bio');
  save.disabled = over || !n;
  document.getElementById('saveWrap').classList.toggle('tappable', !save.disabled);
  if (over && !wasOver) haptic([30, 70, 30]);
  wasOver = over;
  mirror.scrollTop = ta.scrollTop;
}

ta.addEventListener('input', render);
ta.addEventListener('scroll', () => { mirror.scrollTop = ta.scrollTop; });

const SAMPLE = 'Продуктовый дизайнер из Москвы. Люблю тихие интерфейсы, вариативные шрифты и анимацию, которая объясняет себя.';
let filling = false;
document.getElementById('fill').addEventListener('click', async () => {
  if (filling) return; filling = true;
  ta.value = ''; render(); ta.focus();
  for (const ch of SAMPLE){ ta.value += ch; render(); await new Promise(r => setTimeout(r, 38)); }
  filling = false;
});

function onSave(){
  if (save.disabled) return;
  haptic([25]);
  save.classList.add('saved');
  setTimeout(() => save.classList.remove('saved'), 1600);
}
save.addEventListener('click', onSave);
const sw = addTapHaptics(document.getElementById('saveWrap'));
if (sw) sw.addEventListener('click', onSave);
render();
