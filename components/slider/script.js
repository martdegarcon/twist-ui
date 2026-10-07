
const { haptic } = window.Haptics;
const range = document.getElementById('range'), slider = document.getElementById('slider');
const num = document.getElementById('num'), wname = document.getElementById('wname');
const ticks = [...document.querySelectorAll('.ticks i')];
const NAMES = ['Thin','ExtraLight','Light','Regular','Medium','SemiBold','Bold','ExtraBold','Black'];
let lastStep = -1;

function render(){
  const v = +range.value;
  // the thumb travels between the first and last tick (20px insets)
  const p = (v - 100) / 800;
  slider.style.setProperty('--p', `calc(20px + ${p} * (100% - 40px))`);
  num.textContent = v;
  num.style.fontWeight = v;                       // the whole point: value = weight
  const step = Math.round((v - 100) / 100);
  swapTo(wname, NAMES[step]);
  ticks.forEach((t, i) => t.classList.toggle('on', i <= step));
  if (step !== lastStep){ if (lastStep !== -1) haptic([8]); lastStep = step; }
}
range.addEventListener('input', render);
range.addEventListener('pointerdown', () => slider.classList.add('active'));
addEventListener('pointerup', () => slider.classList.remove('active'));
// tap anywhere: glide there instead of jumping
num.style.transition = 'font-weight .5s cubic-bezier(.25,1,.5,1)';
range.addEventListener('pointerdown', () => num.style.transition = 'none');
addEventListener('pointerup', () => num.style.transition = 'font-weight .5s cubic-bezier(.25,1,.5,1)');
render();
