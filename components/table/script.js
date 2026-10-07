
const { haptic } = window.Haptics;
const tbl = document.getElementById('tbl'), amts = [...tbl.querySelectorAll('.amt')];
let pivot = null;
/* weight by ratio to the pivot on a log scale: 2× bigger → much heavier, 2× smaller → much lighter */
function weigh(p){
  pivot = p;
  tbl.classList.toggle('live', !!p);
  amts.forEach(a => {
    a.classList.toggle('pivot', a === p);
    if (!p){ a.style.removeProperty('--w'); a.style.removeProperty('--c'); return; }
    const r = Math.log2(+a.dataset.v / +p.dataset.v);             // -∞..+∞, 0 = same
    const w = Math.round(Math.max(150, Math.min(900, 500 + r * 170)));
    a.style.setProperty('--w', w);
    a.style.setProperty('--c', r < 0 ? `rgba(244,244,244,${Math.max(.45, 1 + r * .2)})` : 'var(--text)');
  });
}
amts.forEach(a => {
  a.addEventListener('mouseenter', () => weigh(a));
  a.addEventListener('focus', () => weigh(a));
  a.addEventListener('click', () => { haptic([8]); weigh(pivot === a ? null : a); });
});
tbl.addEventListener('mouseleave', () => weigh(null));
