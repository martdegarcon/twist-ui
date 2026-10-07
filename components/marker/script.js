
const { haptic } = window.Haptics;
const doc = document.getElementById('doc');
const layer = document.createElement('div'); layer.className = 'marks'; doc.prepend(layer);

/* draws one stroke per line rect, each starting after the previous one */
function mark(range){
  const dr = doc.getBoundingClientRect();
  const rects = [...range.getClientRects()].filter(r => r.width > 2);
  // merge rects on the same line
  const lines = [];
  rects.forEach(r => { const l = lines.find(x => Math.abs(x.top - r.top) < 4); if (l){ l.left = Math.min(l.left, r.left); l.right = Math.max(l.right, r.right); } else lines.push({ top:r.top, bottom:r.bottom, left:r.left, right:r.right }); });
  lines.sort((a, b) => a.top - b.top);
  const group = [];
  lines.forEach((l, i) => {
    const m = document.createElement('span'); m.className = 'mk';
    const pad = 3;
    m.style.left = l.left - dr.left - pad + 'px'; m.style.width = l.right - l.left + pad * 2 + 'px';
    m.style.top = l.top - dr.top + 3 + 'px'; m.style.height = l.bottom - l.top - 4 + 'px';
    m.style.transitionDuration = Math.min(.7, .2 + (l.right - l.left) / 900) + 's';
    layer.appendChild(m); group.push(m);
    setTimeout(() => m.classList.add('on'), i * 260);
  });
  group.forEach(m => m.addEventListener('click', () => wipe(group)));
  haptic([10]);
}
function wipe(group){ group.slice().reverse().forEach((m, i) => setTimeout(() => { m.classList.add('wipe'); setTimeout(() => m.remove(), 400); }, i * 120)); haptic([6]); }

doc.addEventListener('mouseup', () => setTimeout(take, 10));
doc.addEventListener('touchend', () => setTimeout(take, 300));
function take(){
  const sel = getSelection(); if (!sel.rangeCount || sel.isCollapsed) return;
  const r = sel.getRangeAt(0); if (!doc.contains(r.commonAncestorContainer)) return;
  mark(r); sel.removeAllRanges();
}
document.getElementById('demo').addEventListener('click', () => {
  const p = doc.querySelectorAll('p')[0].firstChild, t = p.textContent;
  const a = t.indexOf('интерфейс начинает'), b = t.indexOf('единым материалом') + 'единым материалом'.length;
  const r = document.createRange(); r.setStart(p, a); r.setEnd(p, b); mark(r);
});
document.getElementById('clear').addEventListener('click', () => wipe([...layer.children]));
addEventListener('resize', () => layer.innerHTML = '');
