
const { haptic } = window.Haptics;
const shell = document.getElementById('shell'), grid = document.getElementById('grid');
const E = 'cubic-bezier(.25,1,.5,1)';
/* FLIP: remember where each tile was, change the layout, then animate from old to new */
function toggle(open){
  const tiles = [...grid.children], first = tiles.map(t => t.getBoundingClientRect());
  shell.classList.toggle('open', open);
  haptic([10]);
  // follow the layout while the sheet width animates
  const start = performance.now();
  const step = () => {
    const last = tiles.map(t => t.getBoundingClientRect());
    if (performance.now() - start < 40) requestAnimationFrame(step);
    else tiles.forEach((t, i) => {
      const a = first[i], b = last[i];
      t.animate([{ transform:`translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`, transformOrigin:'0 0' },
                 { transform:'none', transformOrigin:'0 0' }], { duration:520, easing:E });
    });
  };
  requestAnimationFrame(step);
}
document.getElementById('open').addEventListener('click', () => toggle(!shell.classList.contains('open')));
document.getElementById('close').addEventListener('click', () => toggle(false));
addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
