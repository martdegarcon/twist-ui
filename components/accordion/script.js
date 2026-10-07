
const { haptic } = window.Haptics;
const acc = document.getElementById('acc'), its = [...acc.querySelectorAll('.it')];
its.forEach(it => it.querySelector('.q').addEventListener('click', () => {
  const was = it.classList.contains('on');
  its.forEach(x => { x.classList.remove('on'); x.querySelector('.q').setAttribute('aria-expanded', 'false'); });
  if (!was){ it.classList.add('on'); it.querySelector('.q').setAttribute('aria-expanded', 'true'); }
  acc.classList.toggle('has', !was);
  haptic([8]);
}));
