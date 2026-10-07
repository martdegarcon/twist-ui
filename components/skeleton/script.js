
const { haptic } = window.Haptics;
const post = document.getElementById('post');
const lines = [...post.querySelectorAll('.ln')].map(ln => {
  const tx = ln.querySelector('.tx'), text = tx.textContent;
  tx.innerHTML = [...text].map(c => `<span class="l">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  return { ln, sk: ln.querySelector('.sk'), letters: [...tx.querySelectorAll('.l')] };
});
const wait = ms => new Promise(r => setTimeout(r, ms));
let run = 0;

function skeleton(){
  post.classList.remove('loaded');
  lines.forEach(({ sk, letters }) => {
    letters.forEach(l => l.classList.remove('on'));
    const end = letters.at(-1); const total = end.offsetLeft + end.offsetWidth;
    sk.style.transition = 'none';
    sk.style.setProperty('--from', '0px'); sk.style.setProperty('--len', total + 'px'); sk.style.opacity = 1;
  });
}

async function reveal(id){
  await wait(1200);                                    // pretend the network is thinking
  if (id !== run) return;
  post.classList.add('loaded');
  haptic([10]);
  lines.forEach(({ sk, letters }, k) => {
    letters.forEach((l, i) => setTimeout(() => {
      if (id !== run) return;
      l.classList.add('on');
      // the bar is eaten from the left as letters arrive
      const left = l.offsetLeft + l.offsetWidth;
      const end = letters.at(-1); const total = end.offsetLeft + end.offsetWidth;
      sk.style.transition = 'left .12s linear, width .12s linear, opacity .3s';
      sk.style.setProperty('--from', left + 'px');
      sk.style.setProperty('--len', Math.max(0, total - left) + 'px');
      if (i === letters.length - 1) sk.style.opacity = 0;
    }, k * 110 + i * 14));
  });
}
document.getElementById('reload').addEventListener('click', () => { run++; skeleton(); reveal(run); });
document.fonts.ready.then(() => { run++; skeleton(); reveal(run); });
