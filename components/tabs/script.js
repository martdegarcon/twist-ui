
const { haptic } = window.Haptics;
const tabs = [...document.querySelectorAll('.tab')], panels = [...document.querySelectorAll('.panel')];
const pill = document.getElementById('pill');
let cur = 0;
const E = 'cubic-bezier(.25,1,.5,1)';

function placePill(i, animate){
  const t = tabs[i];
  pill.classList.toggle('anim', animate);
  pill.style.width = t.offsetWidth + 'px';
  pill.style.transform = `translateX(${t.offsetLeft}px)`;
}

function go(i){
  if (i === cur) return;
  const dir = i > cur ? 1 : -1;
  const from = panels[cur], to = panels[i];
  tabs[cur].classList.remove('on'); tabs[i].classList.add('on');
  placePill(i, true);
  haptic([8]);
  // old content leaves opposite to travel, new one arrives from the travel side, line by line
  from.classList.remove('on');
  [...from.children].forEach((l, k) => l.animate(
    [{ transform:'translateX(0)', opacity:1, filter:'blur(0)' }, { transform:`translateX(${-dir * 40}px)`, opacity:0, filter:'blur(4px)' }],
    { duration:280, delay:k * 25, easing:E, fill:'both' }));
  from.animate([{ opacity:1 }, { opacity:1 }], { duration:360 }).finished.then(() => [...from.children].forEach(l => l.getAnimations().forEach(a => a.cancel())));
  to.classList.add('on');
  [...to.children].forEach((l, k) => l.animate(
    [{ transform:`translateX(${dir * 60}px)`, opacity:0, filter:'blur(4px)' }, { transform:'translateX(0)', opacity:1, filter:'blur(0)' }],
    { duration:520, delay:80 + k * 45, easing:E, fill:'backwards' }));
  cur = i;
}
tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
document.getElementById('tabs').addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') go(Math.min(cur + 1, tabs.length - 1));
  if (e.key === 'ArrowLeft') go(Math.max(cur - 1, 0));
});
addEventListener('resize', () => placePill(cur, false));
document.fonts.ready.then(() => placePill(cur, false)); placePill(cur, false);
