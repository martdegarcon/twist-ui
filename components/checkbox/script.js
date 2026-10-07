
const { haptic } = window.Haptics;
const items = [...document.querySelectorAll('.t')], drum = document.getElementById('drum');
items.forEach(t => t.querySelector('.native').addEventListener('change', e => {
  t.classList.toggle('on', e.target.checked);
  haptic(e.target.checked ? [12] : [6]);
  const n = items.filter(x => x.classList.contains('on')).length;
  drum.querySelectorAll('b').forEach(b => b.style.setProperty('--n', n));
  if (n === items.length) haptic([15, 50, 30]);
}));
