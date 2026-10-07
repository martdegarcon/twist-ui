
const { haptic } = window.Haptics;
const sb = document.getElementById('sb'), tip = document.getElementById('tip');
document.getElementById('tog').addEventListener('click', () => { sb.classList.toggle('mini'); tip.classList.remove('on'); haptic([10]); });
document.querySelectorAll('.si').forEach(si => {
  si.addEventListener('click', () => { document.querySelectorAll('.si').forEach(x => x.classList.toggle('on', x === si)); haptic([6]); });
  // collapsed: the label reappears as a tooltip that slides out of the icon
  si.addEventListener('mouseenter', () => {
    if (!sb.classList.contains('mini')) return;
    tip.textContent = si.dataset.t; tip.style.top = (si.offsetTop + 6) + 'px'; tip.classList.add('on');
  });
  si.addEventListener('mouseleave', () => tip.classList.remove('on'));
});
