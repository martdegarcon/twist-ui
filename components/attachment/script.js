
const { haptic } = window.Haptics;
const chips = document.getElementById('chips'), pp = document.getElementById('pp'), composer = document.getElementById('composer');
const E = 'cubic-bezier(.25,1,.5,1)';
const SAMPLES = [['Итоги Q1 — финал.pdf', 25.7e3], ['Заметки с дизайн-ревью.docx', 812e3], ['Онбординг v3.fig', 4.2e6]];
let n = 0;
const fmt = b => b > 1e6 ? (b / 1e6).toFixed(1).replace('.', ',') + ' МБ' : Math.round(b / 1e3) + ' КБ';
async function attach(name, size){
  const ext = (name.split('.').pop() || 'file').slice(0, 4).toUpperCase();
  // 1) a page preview drops in at the center…
  document.getElementById('ppExt').textContent = ext;
  pp.style.visibility = 'visible';
  const cx = innerWidth / 2 - 75, cy = innerHeight / 2 - 160;
  await pp.animate([{ left:cx+'px', top:(cy-40)+'px', opacity:0, transform:'rotate(-6deg) scale(.9)' }, { left:cx+'px', top:cy+'px', opacity:1, transform:'rotate(-2deg)' }],
    { duration:380, easing:E, fill:'forwards' }).finished;
  // 2) …and shrinks into the chip's file badge
  const chip = document.createElement('div'); chip.className = 'chip';
  const nb = s => s.replace(/ /g, '\u00a0');
  const head = nb(name.slice(0, 6)), mid = nb(name.slice(6, -8)), tail = nb(name.slice(-8));
  chip.innerHTML = `<span class="ext">${ext}</span><span class="meta"><span class="nm">${head}<span class="dots">…</span><span class="cut">${mid}</span>${tail}</span><span class="sz">${fmt(size)}</span></span><button class="x" aria-label="Удалить">×</button>`;
  chip.style.opacity = 0; chips.appendChild(chip);
  const cut = chip.querySelector('.cut'); cut.style.maxWidth = 'none'; chip.style.setProperty('--cw', cut.offsetWidth + 'px'); cut.style.maxWidth = '';
  const badge = chip.querySelector('.ext').getBoundingClientRect();
  await pp.animate([{ left:cx+'px', top:cy+'px', width:'150px', height:'200px', transform:'rotate(-2deg)', opacity:1 },
                    { left:badge.left+'px', top:badge.top+'px', width:'36px', height:'36px', transform:'none', opacity:1 }],
    { duration:520, easing:E, fill:'forwards' }).finished;
  pp.style.visibility = 'hidden'; pp.getAnimations().forEach(a => a.cancel());
  chip.style.transition = 'opacity .2s'; chip.style.opacity = 1; setTimeout(() => chip.style.transition = '', 250);
  chip.style.maxWidth = chip.offsetWidth + 40 + 'px';
  chip.querySelector('.x').addEventListener('click', () => { chip.classList.add('gone'); haptic([8]); setTimeout(() => chip.remove(), 500); });
  haptic([12]);
}
document.getElementById('attach').addEventListener('click', () => { const s = SAMPLES[n++ % SAMPLES.length]; attach(s[0], s[1]); });
['dragenter','dragover'].forEach(t => composer.addEventListener(t, e => { e.preventDefault(); composer.classList.add('over'); }));
['dragleave','drop'].forEach(t => composer.addEventListener(t, e => { e.preventDefault(); composer.classList.remove('over'); }));
composer.addEventListener('drop', e => { [...e.dataTransfer.files].slice(0, 3).forEach(f => attach(f.name, f.size)); });
