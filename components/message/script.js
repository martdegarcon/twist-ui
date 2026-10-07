
const { haptic } = window.Haptics;
const A = {
  'Чем анимация кажется дорогой?':'Сдержанностью. Одна кривая сглаживания везде, короткие длительности, и элементы мягко тормозят на месте, а не пружинят. Дорогая анимация объясняет, что изменилось, и сразу уходит с дороги.',
  'Сколько длится плавное появление?':'Около трети секунды. Смена позиции может занимать полсекунды, потому что глаз следит за движением, а прозрачность и размытие должны проходить быстрее, чтобы интерфейс не казался мутным.',
};
const thread = document.getElementById('thread'), asks = document.getElementById('asks');
const wait = ms => new Promise(r => setTimeout(r, ms));
asks.querySelectorAll('button').forEach(b => b.addEventListener('click', () => ask(b.textContent)));
async function ask(q){
  asks.classList.add('busy'); haptic([10]);
  const me = document.createElement('div'); me.className = 'm me'; me.textContent = q; thread.appendChild(me);
  me.animate([{ opacity:0, transform:'translateY(10px)' }, { opacity:1, transform:'none' }], { duration:350, easing:'cubic-bezier(.25,1,.5,1)' });
  await wait(450);
  const ai = document.createElement('div'); ai.className = 'm ai'; thread.appendChild(ai);
  const cur = document.createElement('span'); cur.className = 'cur'; ai.appendChild(cur);
  thread.scrollTop = thread.scrollHeight;
  await wait(500);
  // stream words with an uneven rhythm; each word dries ~600ms after it lands
  for (const word of A[q].split(' ')){
    const w = document.createElement('span'); w.className = 'w'; w.textContent = word + ' ';
    ai.insertBefore(w, cur);
    requestAnimationFrame(() => w.classList.add('in'));
    setTimeout(() => w.classList.add('dry'), 600);
    thread.scrollTop = thread.scrollHeight;
    await wait(40 + Math.random() * 90 + (/[.,]$/.test(word) ? 180 : 0));
  }
  await wait(500); cur.remove(); asks.classList.remove('busy');
}
