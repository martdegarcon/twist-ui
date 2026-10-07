
const { haptic } = window.Haptics;
const NAV = {"Продукты": [["Дизайн", "Холст, компоненты, прототипы"], ["Анимация", "Кривые, таймлайны, экспорт"], ["Передача", "Спеки, которые не устаревают"]], "Решения": [["Стартапам", "Выпустить первую версию"], ["Агентствам", "Много клиентов — одна система"]], "Ресурсы": [["Документация", "Гайды и API"], ["Блог", "Заметки о ремесле"], ["Обновления", "Что вышло"], ["Сообщество", "Спросить и поделиться"]]};
const nav = document.getElementById('nav'), pill = document.getElementById('pill'), panel = document.getElementById('panel'), track = document.getElementById('track'), arrow = document.getElementById('arrow');
const E = 'cubic-bezier(.25,1,.5,1)';
const keys = Object.keys(NAV);
let cur = -1, closeT;
const pages = keys.map(k => {
  const d = document.createElement('div'); d.className = 'pg';
  d.style.gridTemplateColumns = NAV[k].length > 3 ? '1fr 1fr' : '1fr';
  if (NAV[k].length > 3) d.classList.add('two');
  d.innerHTML = NAV[k].map(([t, s]) => `<a><b>${t}</b><span>${s}</span></a>`).join('');
  d.style.visibility = 'hidden'; track.appendChild(d); return d;
});
const btns = keys.concat(['Цены']).map((k, i) => {
  const b = document.createElement('button'); b.textContent = k; nav.appendChild(b);
  b.addEventListener('mouseenter', () => i < keys.length ? open(i) : close());
  b.addEventListener('click', () => i < keys.length && (cur === i ? close() : open(i)));
  return b;
});
function open(i){
  clearTimeout(closeT);
  const b = btns[i], pg = pages[i], prev = cur;
  btns.forEach((x, k) => x.classList.toggle('on', k === i));
  pill.style.width = b.offsetWidth + 'px'; pill.style.transform = `translateX(${b.offsetLeft}px)`; nav.classList.add('open');
  // size + place the panel for this page, centered under its button
  pg.style.visibility = 'visible';
  const W = pg.offsetWidth, H = pg.offsetHeight, site = panel.parentElement.clientWidth;
  const left = Math.max(10, Math.min(site - W - 10, b.offsetLeft + 10 + b.offsetWidth / 2 - W / 2));
  if (prev < 0){ panel.style.transition = 'none'; panel.style.left = left + 'px'; panel.style.width = W + 'px'; panel.style.height = H + 'px'; void panel.offsetWidth; panel.style.transition = ''; }
  else { panel.style.left = left + 'px'; panel.style.width = W + 'px'; panel.style.height = H + 'px'; }
  arrow.style.left = (b.offsetLeft + 10 + b.offsetWidth / 2 - left - 6) + 'px';
  panel.classList.add('on');
  if (prev >= 0 && prev !== i){
    // content slides in from the side you came from, old content leaves the other way
    const dir = i > prev ? 1 : -1;
    pages[prev].animate([{ transform:'none', opacity:1 }, { transform:`translateX(${-dir * 60}px)`, opacity:0 }], { duration:300, easing:E, fill:'forwards' })
      .finished.then(() => { if (cur !== prev) pages[prev].style.visibility = 'hidden'; pages[prev].getAnimations().forEach(a => a.cancel()); });
    pg.animate([{ transform:`translateX(${dir * 60}px)`, opacity:0 }, { transform:'none', opacity:1 }], { duration:450, easing:E });
  }
  if (prev !== i) haptic([6]);
  cur = i;
}
function close(){
  cur = -1; panel.classList.remove('on'); nav.classList.remove('open'); btns.forEach(x => x.classList.remove('on'));
  setTimeout(() => { if (cur < 0) pages.forEach(p => p.style.visibility = 'hidden'); }, 350);
}
document.querySelector('.site').addEventListener('mouseleave', () => { closeT = setTimeout(close, 200); });
panel.addEventListener('mouseenter', () => clearTimeout(closeT));
