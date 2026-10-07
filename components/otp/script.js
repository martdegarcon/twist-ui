const { haptic } = window.Haptics;
const CODE = '428193';
const otp = document.getElementById('otp');
const input = document.getElementById('code');
const cells = [...document.querySelectorAll('.cell')];
const status = document.getElementById('status');
let shown = '';          // digits currently rendered
let locked = false;
const wait = ms => new Promise(r => setTimeout(r, ms));

cells.forEach((c, i) => c.querySelector('.strip').style.setProperty('--i', i));

function setDigit(i, d){
  const c = cells[i], strip = c.querySelector('.strip');
  if (d == null){
    c.classList.remove('filled');
    strip.style.setProperty('--d', 0);
    return;
  }
  // appear at 0, then roll down the drum to the digit
  if (!c.classList.contains('filled')){
    strip.style.transition = 'none';
    strip.style.setProperty('--d', 0);
    void strip.offsetWidth;
    strip.style.transition = '';
    c.classList.add('filled');
  }
  c.classList.add('rolling');
  requestAnimationFrame(() => strip.style.setProperty('--d', d));
  clearTimeout(c._t); c._t = setTimeout(() => c.classList.remove('rolling'), 450);
}

function render(){
  const v = input.value;
  for (let i = 0; i < 6; i++){
    if (v[i] !== shown[i]) setDigit(i, v[i] == null ? null : +v[i]);
  }
  shown = v;
  cells.forEach((c, i) => c.classList.toggle('active', i === Math.min(v.length, 5) && !locked));
}

input.addEventListener('input', () => {
  if (locked){ input.value = shown; return; }
  input.value = input.value.replace(/\D/g, '').slice(0, 6);
  if (otp.classList.contains('wrong')){ otp.classList.remove('wrong'); swapTo(status, 'hint'); }
  render();
  if (input.value.length === 6) verify();
});
input.addEventListener('focus', () => otp.classList.add('focus'));
input.addEventListener('blur',  () => otp.classList.remove('focus'));

async function verify(){
  locked = true; render();
  swapTo(status, 'checking');
  await wait(900);
  if (input.value === CODE){
    swapTo(status, 'ok');
    otp.classList.add('fuse');               // 1: cells close the gaps into one plate
    await wait(450);
    otp.classList.add('done');               // 2: digits lift away, check + «Почта подтверждена»
    haptic([30, 100, 30, 100, 60]);
    input.blur();
  } else {
    otp.classList.add('wrong');
    swapTo(status, 'wrong');
    haptic([30, 70, 30]);
    await wait(500);
    // roll every drum back to zero, right to left, then clear
    for (let i = 5; i >= 0; i--){ cells[i].querySelector('.strip').style.setProperty('--d', 0); await wait(45); }
    await wait(500);
    input.value = ''; shown = '';
    cells.forEach(c => c.classList.remove('filled'));
    locked = false; render();
  }
}

document.getElementById('reset').addEventListener('click', () => {
  otp.classList.remove('fuse', 'done', 'wrong');
  input.value = ''; shown = ''; locked = false;
  cells.forEach((c, i) => setDigit(i, null));
  swapTo(status, 'hint'); render();
  input.focus();
});

render();
if (window.top === window) input.focus({ preventScroll: true });   // don't steal focus inside gallery previews
