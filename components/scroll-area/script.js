
const { haptic } = window.Haptics;
const area = document.getElementById('area'), vp = document.getElementById('vp'), rail = document.getElementById('rail');
const thumb = document.getElementById('thumb'), tag = document.getElementById('tag');
const sections = [...vp.querySelectorAll('section')];
const meas = document.createElement('span'); meas.style.cssText = 'position:absolute;visibility:hidden;font:600 14px Onest,system-ui;white-space:nowrap';
document.body.appendChild(meas);
let idle, current = '';

function update(){
  const max = vp.scrollHeight - vp.clientHeight, H = rail.clientHeight;
  const th = Math.max(36, H * vp.clientHeight / vp.scrollHeight);
  thumb.style.height = th + 'px';
  thumb.style.top = (max ? vp.scrollTop / max : 0) * (H - th) + 'px';
  // which section owns the line at 30% of the viewport
  const y = vp.scrollTop + vp.clientHeight * .3;
  const s = sections.filter(s => s.offsetTop <= y).at(-1) || sections[0];
  const t = s.dataset.t;
  if (t !== current){
    current = t;
    meas.textContent = t; area.style.setProperty('--tw', meas.offsetWidth + 26 + 'px');
    tag.animate([{ opacity:0, transform:'translateY(6px)', filter:'blur(3px)' }, { opacity:1, transform:'none', filter:'blur(0)' }], { duration:280, easing:'cubic-bezier(.25,1,.5,1)' });
    tag.textContent = t;
    if (area.classList.contains('live')) haptic([6]);
  }
}
function live(){ area.classList.add('live'); clearTimeout(idle); idle = setTimeout(() => { if (!drag) area.classList.remove('live'); }, 900); }
vp.addEventListener('scroll', () => { update(); live(); });

let drag = false, y0 = 0, s0 = 0;
thumb.addEventListener('pointerdown', e => { drag = true; y0 = e.clientY; s0 = vp.scrollTop; thumb.classList.add('drag'); thumb.setPointerCapture(e.pointerId); live(); });
thumb.addEventListener('pointermove', e => {
  if (!drag) return;
  const max = vp.scrollHeight - vp.clientHeight, H = rail.clientHeight - thumb.offsetHeight;
  vp.scrollTop = s0 + (e.clientY - y0) / H * max;
});
['pointerup','pointercancel'].forEach(t => thumb.addEventListener(t, () => { drag = false; thumb.classList.remove('drag'); live(); }));
addEventListener('resize', update);
document.fonts.ready.then(update); update();
