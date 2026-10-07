
const { haptic } = window.Haptics;
const MAP = { Meta:'⌘', Control:'⌘', Shift:'⇧', Escape:'Esc', ArrowLeft:'←', ArrowRight:'→' };
const held = new Set();
const sym = e => MAP[e.key] || (e.key.length === 1 ? e.key.toUpperCase() : null);
function paint(){
  document.querySelectorAll('kbd').forEach(k => k.classList.toggle('down', held.has(k.dataset.k)));
  document.querySelectorAll('.sc').forEach(sc => {
    const ks = [...sc.querySelectorAll('kbd')].map(k => k.dataset.k);
    const hit = ks.every(k => held.has(k));
    if (hit && !sc.classList.contains('hit')) haptic([12]);
    sc.classList.toggle('hit', hit);
  });
}
addEventListener('keydown', e => { const s = sym(e); if (!s) return; if (['K','P','N'].includes(s) && (e.metaKey || e.ctrlKey)) e.preventDefault(); held.add(s); paint(); });
addEventListener('keyup', e => {
  const s = sym(e); if (!s) return;
  held.delete(s);
  if (s === '⌘') held.clear();            // macOS swallows keyup of other keys while ⌘ is held
  paint();
});
addEventListener('blur', () => { held.clear(); paint(); });
/* touch: tapping a cap presses it; tapping a modifier latches it */
document.querySelectorAll('kbd').forEach(k => k.addEventListener('pointerdown', e => {
  e.preventDefault(); const s = k.dataset.k;
  if (['⌘','⇧'].includes(s)){ held.has(s) ? held.delete(s) : held.add(s); paint(); return; }
  held.add(s); paint(); setTimeout(() => { held.delete(s); [...held].forEach(m => held.delete(m)); paint(); }, 450);
}));
