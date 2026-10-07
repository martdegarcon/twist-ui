
const { haptic } = window.Haptics;
const deck = document.getElementById('deck');
const slides = [...deck.querySelectorAll('.slide')];
const drum = document.getElementById('drum');
let order = slides.map((_, i) => i);         // order[0] is on top
let busy = false;

function place(){
  order.forEach((idx, k) => {
    const s = slides[idx];
    s.style.zIndex = slides.length - k;
    const vis = Math.min(k, 3);
    s.style.transform = `translateY(${vis * 12}px) scale(${1 - vis * .05})`;
    s.style.opacity = k > 3 ? 0 : 1;
    s.style.filter = `brightness(${1 - vis * .18})`;
  });
  drum.querySelectorAll('b').forEach(b => b.style.setProperty('--n', order[0]));
}

/* top card leaves to the side, then slides back in UNDER the deck */
async function next(dirX = -1){
  if (busy) return; busy = true;
  const top = slides[order[0]];
  top.style.transform = `translateX(${dirX * 120}%) rotate(${dirX * 10}deg)`;
  haptic([12]);
  await new Promise(r => setTimeout(r, 260));
  order.push(order.shift());
  place();
  setTimeout(() => busy = false, 350);
}
/* previous: the bottom card comes out from behind and lands on top */
async function prev(){
  if (busy) return; busy = true;
  const last = order[order.length - 1], s = slides[last];
  s.style.transition = 'none'; s.style.zIndex = slides.length + 1;
  s.style.transform = 'translateX(120%) rotate(10deg)'; s.style.opacity = 1; s.style.filter = 'none';
  void s.offsetWidth; s.style.transition = '';
  order.unshift(order.pop());
  haptic([12]);
  place();
  setTimeout(() => busy = false, 450);
}

let x0 = null, dx = 0;
deck.addEventListener('pointerdown', e => {
  const top = slides[order[0]];
  if (busy || !top.contains(e.target)) return;
  x0 = e.clientX; dx = 0; top.classList.add('drag'); top.setPointerCapture(e.pointerId);
});
deck.addEventListener('pointermove', e => {
  if (x0 == null) return;
  dx = e.clientX - x0;
  slides[order[0]].style.transform = `translateX(${dx}px) rotate(${dx * .05}deg)`;
});
const end = () => {
  if (x0 == null) return;
  const top = slides[order[0]]; top.classList.remove('drag'); x0 = null;
  if (Math.abs(dx) > 90) next(Math.sign(dx)); else place();
};
deck.addEventListener('pointerup', end); deck.addEventListener('pointercancel', end);
document.getElementById('next').addEventListener('click', () => next(-1));
document.getElementById('prev').addEventListener('click', prev);
addEventListener('keydown', e => { if (e.key === 'ArrowRight') next(-1); if (e.key === 'ArrowLeft') prev(); });
place();
