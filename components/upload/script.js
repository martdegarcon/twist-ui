const { haptic } = window.Haptics;
const drop = document.getElementById('drop');
const fileIn = document.getElementById('file');
const nameEl = document.getElementById('name');
const sizeEl = document.getElementById('size');
const meta = document.getElementById('meta');
const thumb = document.getElementById('thumb');
let raf = 0, failNext = false, current = null;

const fmtSize = b => b > 1e6 ? (b / 1e6).toFixed(1).replace('.', ',') + ' МБ' : Math.max(1, Math.round(b / 1e3)) + ' КБ';

/* a sample image drawn on a canvas, so the demo works without a file */
function sampleFile(){
  const c = document.createElement('canvas'); c.width = c.height = 240;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 240, 240);
  grad.addColorStop(0, '#2C3853'); grad.addColorStop(1, '#DCE4ED');
  g.fillStyle = grad; g.fillRect(0, 0, 240, 240);
  g.fillStyle = 'rgba(244,244,244,.9)'; g.beginPath(); g.arc(120, 100, 44, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(120, 230, 86, 70, 0, Math.PI, 0); g.fill();
  return new Promise(r => c.toBlob(b => r(new File([b], 'portrait_2026.jpg', { type:'image/jpeg' })), 'image/jpeg', .9));
}

function show(file){
  current = file;
  cancelAnimationFrame(raf);
  drop.classList.remove('done', 'failed');
  drop.classList.add('has', 'busy');
  nameEl.textContent = file.name;
  nameEl.style.setProperty('--p', 0);
  sizeEl.textContent = fmtSize(file.size || 2.4e6);
  swapTo(meta, 'size');
  thumb.classList.remove('on');
  thumb.onload = () => thumb.classList.add('on');
  thumb.src = URL.createObjectURL(file);
  upload();
}

/* simulated network: uneven speed, slows near the end */
function upload(){
  const willFail = failNext; failNext = false;
  let p = 0, last = performance.now();
  drop.classList.remove('failed');
  const step = now => {
    const dt = now - last; last = now;
    const speed = (p < 70 ? 34 : 16) * (0.6 + Math.random() * 0.8);    // % per second
    p = Math.min(100, p + speed * dt / 1000);
    nameEl.style.setProperty('--p', p.toFixed(2));
    if (willFail && p >= 62){ return fail(); }
    if (p < 100) raf = requestAnimationFrame(step);
    else done();
  };
  raf = requestAnimationFrame(step);
}

function done(){
  drop.classList.remove('busy');
  drop.classList.add('done');
  swapTo(meta, 'done');
  haptic([30, 100, 30, 100, 60]);
}
function fail(){
  drop.classList.remove('busy');
  drop.classList.add('failed');
  swapTo(meta, 'fail');
  haptic([30, 70, 30]);
}

fileIn.addEventListener('change', () => { if (fileIn.files[0]) show(fileIn.files[0]); fileIn.value = ''; });
drop.addEventListener('click', e => {
  if (drop.classList.contains('failed')){ e.preventDefault(); drop.classList.add('busy'); swapTo(meta, 'size'); haptic([25]); upload(); }
});
['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('dragover'); }));
['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
drop.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) show(f); });

document.getElementById('sample').addEventListener('click', async () => show(await sampleFile()));
document.getElementById('fail').addEventListener('click', async () => { failNext = true; show(current || await sampleFile()); });
document.getElementById('reset').addEventListener('click', () => {
  cancelAnimationFrame(raf); current = null;
  drop.classList.remove('has', 'busy', 'done', 'failed');
  nameEl.style.setProperty('--p', 0);
});
