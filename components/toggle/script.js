
const { haptic } = window.Haptics;
const sample = document.getElementById('sample');
document.querySelectorAll('.tg').forEach(b => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', on);
  sample.classList.toggle(b.dataset.f, on);
  haptic(on ? [12] : [6]);
}));
