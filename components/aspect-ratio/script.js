
const { haptic } = window.Haptics;
const stage = document.getElementById('stage'), frame = document.getElementById('frame'), tag = document.getElementById('tag');
let cur = null;
function set(b, anim = true){
  const w = +b.dataset.w, h = +b.dataset.h;
  const W = stage.clientWidth - 48, H = stage.clientHeight - 48;
  const s = Math.min(W / w, H / h);
  frame.style.width = w * s + 'px'; frame.style.height = h * s + 'px';
  document.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b));
  const t = b.textContent;
  if (anim && cur !== null){
    tag.animate([{ transform:'translateY(0)', opacity:1 }, { transform:'translateY(-100%)', opacity:0 }], { duration:180, fill:'forwards' })
      .finished.then(() => { tag.textContent = t; tag.animate([{ transform:'translateY(100%)', opacity:0 }, { transform:'none', opacity:1 }], { duration:320, easing:'cubic-bezier(.25,1,.5,1)', fill:'forwards' }); });
    haptic([8]);
  } else tag.textContent = t;
  cur = b;
}
document.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => set(b)));
addEventListener('resize', () => set(cur, false));
set(document.querySelector('.seg button.on'), false);
