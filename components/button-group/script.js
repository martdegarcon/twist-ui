
const { haptic } = window.Haptics;
const bg = document.getElementById('bg'), blob = document.getElementById('blob'), sw = document.getElementById('sw');
const btns = [...bg.querySelectorAll('button')];
const VAL = ['4,2 ч', '27,5 ч', '118 ч', '1 340 ч'];
let cur = 0, anim = null;
const span = (b) => ({ l: b.offsetLeft, r: b.offsetLeft + b.offsetWidth });
function setBlob(l, r){ blob.style.left = l + 'px'; blob.style.width = (r - l) + 'px'; }
/* two phases: the leading edge reaches the new button first, then the trailing edge catches up */
function go(i){
  if (i === cur) return;
  const a = span(btns[cur]), b = span(btns[i]), right = i > cur;
  anim && anim.cancel();
  const k1 = { left:a.l+'px', width:(a.r - a.l)+'px' };
  const k2 = right ? { left:a.l+'px', width:(b.r - a.l)+'px' } : { left:b.l+'px', width:(a.r - b.l)+'px' };
  const k3 = { left:b.l+'px', width:(b.r - b.l)+'px' };
  anim = blob.animate([{ ...k1, offset:0 }, { ...k2, offset:.42 }, { ...k3, offset:1 }], { duration:560, easing:'cubic-bezier(.45,0,.2,1)', fill:'forwards' });
  btns.forEach((x, k) => x.classList.toggle('on', k === i));
  const dir = right ? 1 : -1;
  sw.animate([{ transform:'none', opacity:1, filter:'blur(0)' }, { transform:`translateX(${-dir * 30}px)`, opacity:0, filter:'blur(4px)' }], { duration:200, fill:'forwards' })
    .finished.then(() => { sw.textContent = VAL[i]; sw.animate([{ transform:`translateX(${dir * 30}px)`, opacity:0, filter:'blur(4px)' }, { transform:'none', opacity:1, filter:'blur(0)' }], { duration:380, easing:'cubic-bezier(.25,1,.5,1)', fill:'forwards' }); });
  cur = i; haptic([8]);
}
btns.forEach((b, i) => b.addEventListener('click', () => go(i)));
function init(){ const a = span(btns[cur]); setBlob(a.l, a.r); }
addEventListener('resize', () => { anim && anim.cancel(); init(); });
document.fonts.ready.then(init); init(); sw.textContent = VAL[0];
