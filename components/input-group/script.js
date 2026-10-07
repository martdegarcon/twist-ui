
const { haptic } = window.Haptics;
const grp = document.getElementById('grp'), pre = document.getElementById('pre'), url = document.getElementById('url'), mirror = document.getElementById('mirror'), suf = document.getElementById('suf');
const E = 'cubic-bezier(.25,1,.5,1)';
let tld = '';
const esc = s => s.replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]));

function render(){
  const v = url.value;
  const hasDot = v.includes('.');
  const ghost = v && !hasDot && !tld ? '.com' : '';
  mirror.innerHTML = esc(v) + (ghost ? `<span class="ghost">${ghost}</span>` : '');
  grp.classList.toggle('compact', v.length + (tld ? tld.length : 0) > 14);
  suf.textContent = tld; suf.classList.toggle('on', !!tld);
}
/* a pasted/typed scheme is lifted out of the text and dropped into the prefix */
function absorbScheme(){
  const m = url.value.match(/^(https?:\/\/)(.*)$/i);
  if (!m) return false;
  const r = url.getBoundingClientRect(), p = pre.querySelector('.pt').getBoundingClientRect();
  const f = document.createElement('span'); f.className = 'flytxt'; f.textContent = m[1]; document.body.appendChild(f);
  f.animate([{ left:r.left+'px', top:(r.top + r.height/2 - 12)+'px', opacity:1 }, { left:p.left+'px', top:(p.top + p.height/2 - 12)+'px', opacity:0, transform:'scale(.85)' }],
    { duration:520, easing:E, fill:'forwards' }).finished.then(() => f.remove());
  url.value = m[2];
  setTimeout(() => { pre.classList.remove('bump'); void pre.offsetWidth; pre.classList.add('bump'); haptic([12]); }, 380);
  return true;
}
/* a typed TLD becomes a suffix chip */
function splitTld(){
  const m = url.value.match(/^([^.]+)(\.[a-z]{2,10})$/i);
  if (m && !tld && document.activeElement !== url){ tld = m[2]; url.value = m[1]; }
}
url.addEventListener('input', () => { absorbScheme(); if (tld && url.value.includes('.')) tld = ''; render(); });
url.addEventListener('keydown', e => {
  if (e.key === 'Tab' && url.value && !url.value.includes('.') && !tld){ e.preventDefault(); tld = '.com'; haptic([8]); render(); }
  if (e.key === 'Backspace' && !url.value && tld){ url.value = ''; tld = ''; render(); }
});
url.addEventListener('blur', () => { splitTld(); render(); });
document.getElementById('paste').addEventListener('click', () => {
  url.value = 'https://marat.design'; url.focus(); absorbScheme(); render();
  setTimeout(() => { url.blur(); splitTld(); render(); haptic([8]); }, 700);
});
render();
