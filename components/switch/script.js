
const { haptic } = window.Haptics;
document.querySelectorAll('.row').forEach(row => {
  const box = row.querySelector('.native');
  box.addEventListener('change', () => {
    row.classList.remove('moving'); void row.offsetWidth; row.classList.add('moving');
    row.classList.toggle('is-on', box.checked);
    haptic(box.checked ? [12] : [8]);
  });
});
