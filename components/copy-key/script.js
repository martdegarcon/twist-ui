const field = document.getElementById('field');
const val   = document.getElementById('val');
const btn   = document.getElementById('btn');
const ico   = document.getElementById('ico');
const btnWrap = document.getElementById('btnWrap');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const { haptic, addTapHaptics } = window.Haptics;

/* =============== measure =============== */
function measure(){
  // widths for the Скопировать → Скопировано morph and the selection sweep
  document.querySelectorAll('.tail').forEach(t => {
    const prev = t.style.maxWidth; t.style.maxWidth = 'none';
    btn.style.setProperty(t.classList.contains('t-copy') ? '--w-copy' : '--w-copied', t.scrollWidth + 'px');
    t.style.maxWidth = prev;
  });
  field.style.setProperty('--vw', val.offsetWidth + 'px');
}
document.fonts.ready.then(measure); measure();
addEventListener('resize', measure);

/* =============== clipboard =============== */
async function writeClipboard(text){
  try { await navigator.clipboard.writeText(text); return true; }
  catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
    ta.remove(); return ok;
  }
}

/* =============== the interaction =============== */
const wait = ms => new Promise(r => setTimeout(r, ms));
let busy = false, revertTimer;

async function copy(){
  if (busy) return;
  busy = true;
  clearTimeout(revertTimer);
  haptic([25]);
  writeClipboard(val.textContent);

  if (!REDUCED){
    // 1 — select: a highlight sweeps across the key
    field.classList.add('selecting');
    await wait(230);

    // 2 — lift & fly: a copy of the text detaches and arcs into the icon
    const from = val.getBoundingClientRect();
    const to = ico.getBoundingClientRect();
    const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    const dy = (to.top + to.height / 2) - (from.top + from.height / 2);

    const fly = document.createElement('span');
    fly.className = 'fly';
    fly.textContent = val.textContent;
    fly.style.left = from.left + 'px';
    fly.style.top = from.top + 'px';
    document.body.appendChild(fly);

    field.classList.add('lifted');
    btn.classList.add('catching');

    const anim = fly.animate([
      { transform:'translate(0,0) scale(1)',                                  opacity:1, filter:'blur(0px)', offset:0 },
      { transform:'translate(0,-6px) scale(1.04)',                            opacity:1, filter:'blur(0px)', offset:.18 },
      { transform:`translate(${dx * .45}px, ${dy * .35 - 18}px) scale(.6)`,   opacity:1, filter:'blur(0px)', offset:.6 },
      { transform:`translate(${dx}px, ${dy}px) scale(.06)`,                   opacity:0, filter:'blur(2px)', offset:1 },
    ], { duration:820, easing:'cubic-bezier(.45,0,.25,1)', fill:'forwards' });
    await anim.finished;
    fly.remove();

    // 3 — catch: the icon swallows it
    btn.classList.remove('catching');
    ico.classList.remove('bump'); void ico.offsetWidth; ico.classList.add('bump');
    field.classList.remove('selecting', 'lifted');   // original text fills back in
  }

  // 4 — copied: icon → check, Copy → Copied
  btn.classList.add('copied');
  btn.querySelector('.word').setAttribute('aria-label', 'Скопировано');
  haptic([15, 50, 30]);
  busy = false;

  revertTimer = setTimeout(() => {
    btn.classList.remove('copied');
    btn.querySelector('.word').setAttribute('aria-label', 'Скопировать');
  }, 2400);
}

btn.addEventListener('click', copy);
const sw = addTapHaptics(btnWrap);
if (sw) sw.addEventListener('click', copy);
