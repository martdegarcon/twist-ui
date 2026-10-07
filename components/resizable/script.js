
const { haptic } = window.Haptics;
const panes = document.getElementById('panes'), left = document.getElementById('left'), handle = document.getElementById('handle');
let pct = 50, drag = false, hitMin = false;

/* Roboto Flex has a width axis (25–151). For each heading we solve for the wdth that fills its pane;
   only when even the narrowest width can't fit do we shrink the size. */
const fits = [...document.querySelectorAll('.fit')];
const BASE = () => innerWidth < 680 ? 34 : 44;
function widthAt(h, wdth, fs){ h.style.setProperty('--wdth', wdth); h.style.setProperty('--fs', fs + 'px'); return h.getBoundingClientRect().width; }
function fit(){
  const base = BASE();
  // every pane solves for one wdth/size shared by its lines, so they read as one block
  document.querySelectorAll('.pane').forEach(pane => {
    const hs = [...pane.querySelectorAll('.fit')];
    const avail = pane.clientWidth - 40;
    let wdth = 100;
    for (let k = 0; k < 2; k++){
      const w = Math.max(...hs.map(h => widthAt(h, wdth, base)));
      wdth = Math.max(25, Math.min(151, wdth * avail / w));
    }
    const w = Math.max(...hs.map(h => widthAt(h, wdth, base)));
    const fs = w > avail ? base * avail / w : base;     // narrowest cut reached: scale down instead
    hs.forEach(h => widthAt(h, wdth.toFixed(1), fs.toFixed(2)));
  });
}
function set(p){
  pct = Math.max(20, Math.min(80, p));
  left.style.setProperty('--w', pct + '%');
  handle.setAttribute('aria-valuenow', Math.round(pct));
  fit();
  const atEdge = pct === 20 || pct === 80;
  if (atEdge && !hitMin) haptic([20]);
  hitMin = atEdge;
}
handle.addEventListener('pointerdown', e => { drag = true; handle.classList.add('drag'); handle.setPointerCapture(e.pointerId); });
handle.addEventListener('pointermove', e => {
  if (!drag) return;
  const r = panes.getBoundingClientRect();
  set((e.clientX - r.left) / r.width * 100);
});
['pointerup','pointercancel'].forEach(t => handle.addEventListener(t, () => { drag = false; handle.classList.remove('drag'); }));
handle.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') set(pct - 4);
  if (e.key === 'ArrowRight') set(pct + 4);
});
addEventListener('resize', fit);
document.fonts.ready.then(fit); fit();
