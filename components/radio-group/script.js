
const { haptic } = window.Haptics;
const rg = document.getElementById('rg'), drop = document.getElementById('drop'), os = [...rg.querySelectorAll('.o')];
let cur = -1;
function place(i, anim){
  const ring = os[i].querySelector('.ring');
  const y = os[i].offsetTop + ring.offsetTop + 7;
  if (!anim){ drop.style.transition = 'none'; drop.style.transform = `translateY(${y}px)`; void drop.offsetWidth; drop.style.transition = ''; }
  else {
    // the stretched drop should lead in the travel direction
    drop.style.transformOrigin = i > cur ? 'center top' : 'center bottom';
    drop.classList.remove('go'); void drop.offsetWidth; drop.classList.add('go');
    drop.style.transform = `translateY(${y}px)`;
  }
  os.forEach((o, k) => o.classList.toggle('on', k === i));
  cur = i;
}
os.forEach((o, i) => o.querySelector('input').addEventListener('change', () => { haptic([10]); place(i, true); }));
const start = os.findIndex(o => o.querySelector('input').checked);
document.fonts.ready.then(() => place(cur < 0 ? start : cur, false));
place(start, false);
