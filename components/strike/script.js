const { haptic, addTapHaptics } = window.Haptics;
const DEVICES = [
  { name:'MacBook Pro',       meta:'Москва · Активно сейчас',           current:true },
  { name:'iPhone 15',         meta:'Москва · 2 часа назад' },
  { name:'iPad Air',          meta:'Санкт-Петербург · Вчера' },
  { name:'Chrome на Windows', meta:'Казань · 3 дня назад' },
];
const ARM = .75;     // how far the strike must go to commit

const list = document.getElementById('list');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toastText');
let lastRemoved = null, toastTimer;

function build(){
  list.innerHTML = '';
  DEVICES.forEach(d => {
    const row = document.createElement('div');
    row.className = 'row' + (d.current ? ' current' : '');
    row.tabIndex = d.current ? -1 : 0;
    row.setAttribute('aria-label', d.current ? `${d.name}, это устройство` : `${d.name}. Нажмите Delete, чтобы выйти`);
    row.innerHTML = `<div class="txt"><span class="name">${d.name}<i class="strike"></i></span><span class="meta">${d.meta}</span></div>
      ${d.current ? '<span class="tag">Это устройство</span>' : ''}`;
    row._d = d;
    if (!d.current) wire(row);
    list.appendChild(row);
  });
}

function wire(row){
  const txt = row.querySelector('.txt');
  let x0 = null, armed = false, id = null;
  const set = s => row.style.setProperty('--s', s.toFixed(3));

  row.addEventListener('pointerdown', e => {
    if (row.classList.contains('gone')) return;
    x0 = e.clientX; id = e.pointerId; armed = false;
    row.setPointerCapture(id);
    row.classList.add('dragging');
  });
  row.addEventListener('pointermove', e => {
    if (x0 == null) return;
    const dx = Math.max(0, e.clientX - x0);
    // the line runs across the text; the finger has ~70% of the row to draw it
    const s = Math.min(dx / (row.clientWidth * .7), 1);
    set(s);
    const nowArmed = s >= ARM;
    if (nowArmed !== armed){ armed = nowArmed; row.classList.toggle('armed', armed); if (armed) haptic([12]); }
  });
  const end = () => {
    if (x0 == null) return;
    x0 = null; row.classList.remove('dragging');
    if (armed) commit(row); else { set(0); row.classList.remove('armed'); }
  };
  row.addEventListener('pointerup', end);
  row.addEventListener('pointercancel', end);
  row.addEventListener('keydown', e => {
    if (e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); row.classList.add('armed'); set(1); setTimeout(() => commit(row), 350); }
  });
}

function commit(row){
  row.style.setProperty('--s', 1);
  haptic([30]);
  // finish the line, then fold the row away
  setTimeout(() => {
    row.style.height = row.offsetHeight + 'px';
    void row.offsetHeight;
    row.classList.add('gone');
    row.style.height = '';
  }, 220);
  lastRemoved = row;
  toastText.textContent = `${row._d.name} отключён`;
  toast.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('on'), 5000);
}

function undo(){
  if (!lastRemoved) return;
  const row = lastRemoved; lastRemoved = null;
  haptic([20]);
  row.classList.remove('gone');                 // unfold…
  setTimeout(() => { row.classList.remove('armed'); row.style.setProperty('--s', 0); }, 300);   // …then pull the line back
  toast.classList.remove('on');
}

document.getElementById('undo').addEventListener('click', undo);
const sw = addTapHaptics(document.getElementById('undoWrap'));
if (sw) sw.addEventListener('click', undo);
document.getElementById('restore').addEventListener('click', () => {
  document.querySelectorAll('.row.gone').forEach(r => { r.classList.remove('gone', 'armed'); setTimeout(() => r.style.setProperty('--s', 0), 300); });
  toast.classList.remove('on'); lastRemoved = null;
});

build();
