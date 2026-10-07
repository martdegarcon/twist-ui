
const { haptic } = window.Haptics;
const openBtn = document.getElementById('open'), shell = document.getElementById('shell');
const dialog = document.getElementById('dialog'), scrim = document.getElementById('scrim');
const E = 'cubic-bezier(.25,1,.5,1)';
let isOpen = false, busy = false;

const rect = el => { const r = el.getBoundingClientRect(); return { left:r.left, top:r.top, width:r.width, height:r.height }; };
function frame(r, radius){ return { left:r.left+'px', top:r.top+'px', width:r.width+'px', height:r.height+'px', borderRadius:radius+'px' }; }

async function open(){
  if (isOpen || busy) return; busy = true; isOpen = true;
  haptic([10]);
  const from = rect(openBtn);
  dialog.style.visibility = 'visible';
  const to = rect(dialog);
  shell.style.visibility = 'visible';
  openBtn.style.opacity = 0;
  scrim.classList.add('on');
  const label = shell.querySelector('.ghost-label');
  label.animate([{ opacity:1, filter:'blur(0)' }, { opacity:0, filter:'blur(4px)' }], { duration:200, fill:'forwards', easing:E });
  await shell.animate([frame(from, 16), frame(to, 24)], { duration:520, easing:E, fill:'forwards' }).finished;
  dialog.classList.add('show');
  busy = false;
  document.getElementById('iName').focus({ preventScroll:true });
}

async function close(save){
  if (!isOpen || busy) return; busy = true;
  if (save){
    document.getElementById('pName').textContent = document.getElementById('iName').value || 'Марат М.';
    document.getElementById('pUser').textContent = document.getElementById('iUser').value || '@marat';
    haptic([15, 50, 30]);
  }
  dialog.classList.remove('show');
  await new Promise(r => setTimeout(r, 160));
  const from = rect(dialog), to = rect(openBtn);
  dialog.style.visibility = 'hidden';
  scrim.classList.remove('on');
  const label = shell.querySelector('.ghost-label');
  label.animate([{ opacity:0, filter:'blur(4px)' }, { opacity:1, filter:'blur(0)' }], { duration:300, delay:260, fill:'forwards', easing:E });
  await shell.animate([frame(from, 24), frame(to, 16)], { duration:480, easing:E, fill:'forwards' }).finished;
  openBtn.style.opacity = 1;
  shell.style.visibility = 'hidden';
  shell.getAnimations().forEach(a => a.cancel()); label.getAnimations().forEach(a => a.cancel());
  isOpen = false; busy = false;
  openBtn.focus({ preventScroll:true });
}

openBtn.addEventListener('click', open);
document.getElementById('cancel').addEventListener('click', () => close(false));
document.getElementById('save').addEventListener('click', () => close(true));
scrim.addEventListener('click', () => close(false));
addEventListener('keydown', e => { if (e.key === 'Escape') close(false); });
