/* Twist UI — documentation site (hash router, no build step) */
(() => {
const R = window.REGISTRY;
const FLOWS = R.flows, COMPS = R.components;
const ALL = [...FLOWS, ...COMPS];
const BY = Object.fromEntries(ALL.map(x => [x.slug, x]));
const EMBED = typeof window.TWIST_PAGES !== 'undefined';          // single-file preview build
const E = 'cubic-bezier(.25,1,.5,1)';
const $ = s => document.querySelector(s);
const main = $('#main'), side = $('#side'), toc = $('#toc'), shell = $('#shell');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));

/* ---------- component sources: fetched from the repo, or embedded in the preview build ---------- */
const compUrl = s => `components/${s}/`;
function loadFrame(f, slug){ if (EMBED) f.srcdoc = window.TWIST_PAGES[slug]; else f.src = compUrl(slug); }
async function source(slug, file){
  if (EMBED) return window.TWIST_SOURCES[slug][file];
  const r = await fetch(compUrl(slug) + file); return r.text();
}

/* ---------- icons ---------- */
const I = {
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="4" y="4" width="11" height="11" rx="3"/><rect x="9" y="9" width="11" height="11" rx="3"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  reload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/></svg>',
  ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>',
  desk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M9 20h6M12 17v3"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/></svg>',
};

/* ---------- sidebar ---------- */
function buildSide(){
  let h = `<h4>Сценарии <small>аккаунт</small></h4>` + FLOWS.map((x, i) => `<a href="#/components/${x.slug}" data-r="components/${x.slug}">${x.name}<span class="n">0${i + 1}</span></a>`).join('');
  R.groups.forEach(g => {
    const list = COMPS.filter(c => c.group === g);
    h += `<h4>${g} <small>${list.length}</small></h4>` + list.map(x => `<a href="#/components/${x.slug}" data-r="components/${x.slug}">${x.name}</a>`).join('');
  });
  side.innerHTML = h;
}
function markSide(route){
  side.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.r === route));
  const on = side.querySelector('a.on');
  if (on){ const r = on.getBoundingClientRect(), s = side.getBoundingClientRect(); if (r.top < s.top + 40 || r.bottom > s.bottom - 40) side.scrollTop += r.top - s.top - s.height / 3; }
}

/* ---------- helpers ---------- */
function copyBtn(getText){
  const b = document.createElement('button'); b.className = 'cp'; b.type = 'button';
  b.innerHTML = `${I.copy}<span class="t1">Копировать</span><span class="t2">Скопировано</span>`;
  b.addEventListener('click', async () => {
    const t = typeof getText === 'function' ? await getText() : getText;
    try { await navigator.clipboard.writeText(t); } catch (e) { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
    b.classList.add('done'); setTimeout(() => b.classList.remove('done'), 1600);
  });
  return b;
}
function snippet(code, lang){
  const d = document.createElement('div'); d.className = 'snippet';
  d.innerHTML = `<pre><code class="language-${lang}">${esc(code)}</code></pre>`;
  d.appendChild(copyBtn(code));
  if (window.hljs) hljs.highlightElement(d.querySelector('code'));
  return d;
}
function seg(el, onChange){
  const pill = el.querySelector('.pill'), btns = [...el.querySelectorAll('button')];
  const place = b => { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = `translateX(${b.offsetLeft}px)`; };
  btns.forEach(b => b.addEventListener('click', () => { btns.forEach(x => x.classList.toggle('on', x === b)); place(b); onChange(b.dataset.v); }));
  requestAnimationFrame(() => place(el.querySelector('button.on')));
}

/* lazy thumbnails: live previews load near the viewport and unload far away */
let io;
function thumbs(root){
  io && io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    const f = e.target.querySelector('iframe'); if (!f) return;
    if (e.isIntersecting && !f.dataset.on){ f.dataset.on = 1; loadFrame(f, f.dataset.slug); }
    else if (!e.isIntersecting && f.dataset.on){ delete f.dataset.on; f.removeAttribute('srcdoc'); f.src = 'about:blank'; }
  }), { rootMargin:'300px 0px' });
  root.querySelectorAll('.thumb').forEach(t => io.observe(t));
  const ro = new ResizeObserver(es => es.forEach(e => { const f = e.target.querySelector('iframe'); if (f) f.style.transform = `scale(${e.contentRect.width / 1024})`; }));
  root.querySelectorAll('.thumb').forEach(t => ro.observe(t));
}
const card = x => `<a class="card" href="#/components/${x.slug}" data-g="${esc(x.group)}" data-q="${esc((x.name + ' ' + x.desc + ' ' + x.step).toLowerCase())}">
  <div class="thumb"><iframe data-slug="${x.slug}" tabindex="-1" aria-hidden="true" title="${esc(x.name)} preview" allow="clipboard-write"></iframe></div>
  <div class="cm"><b>${esc(x.name)}</b><span>${esc(x.desc)}</span></div></a>`;

/* ---------- pages ---------- */
const P = {};

/* ---------- the reel: components play themselves, one after another, like a video ---------- */
const REEL = ['slider','data-table','otp','carousel','combobox','alert-dialog','message','dialog','switch','toggle','questionnaire','password-weight'];
class Stop extends Error {}
/* each demo drives the real component with real events, inside its own frame — about two seconds each */
const DEMOS = {
  async slider(h){
    const r = h.$('#range');
    const glide = async (to, ms) => { const from = +r.value, t0 = performance.now();
      while (true){ const p = Math.min(1, (performance.now() - t0) / ms), e = 1 - Math.pow(1 - p, 3);
        r.value = Math.round(from + (to - from) * e); h.fire(r, 'input'); if (p >= 1) break; await h.wait(16); } };
    await h.wait(150); await glide(900, 800); await h.wait(150); await glide(250, 650); await h.wait(100);
  },
  async 'data-table'(h){ await h.wait(200); for (const k of ['mrr','name','seats']){ h.click(`[data-k=${k}]`); await h.wait(540); } },
  async otp(h){ await h.wait(150); await h.type('#code', '428193', 65); await h.wait(1150); },
  async carousel(h){ await h.wait(200); for (let i = 0; i < 3; i++){ h.click('#next'); await h.wait(520); } },
  async combobox(h){ await h.wait(150); await h.type('#q', 'брл', 140); await h.wait(650); h.key('#q', 'Enter'); await h.wait(450); },
  async 'alert-dialog'(h){ h.click('#del'); await h.wait(350); h.fire(h.$('#hold'), 'pointerdown', 'PointerEvent'); await h.wait(1450); },
  async message(h){ await h.wait(150); h.click('.asks button'); await h.wait(1650); },
  async dialog(h){
    await h.wait(150); h.click('#open'); await h.wait(650);
    const i = h.$('#iName'); i.value = ''; await h.type('#iName', 'Марат', 45); await h.wait(150);
    h.click('#save'); await h.wait(650);
  },
  async switch(h){ await h.wait(150); for (const i of [0,1,2]){ h.$$('.row .native')[i].click(); await h.wait(520); } },
  async toggle(h){ await h.wait(150); for (const i of [0,1,2,3]){ h.$$('.tg')[i].click(); await h.wait(400); } },
  async questionnaire(h){ await h.wait(600); for (const i of [0,1]){ const o = h.$$('.opt')[i]; o && o.click(); await h.wait(620); } },
  /* the finale: strength climbs Medium → Bold → ExtraBold */
  async 'password-weight'(h){
    h.focus('#pass input'); await h.wait(150);
    await h.type('#pass input', 'qwerty', 35); await h.wait(300);
    await h.type('#pass input', '123', 40); await h.wait(300);
    await h.type('#pass input', 'Qwerty@', 35); await h.wait(550);
  },
};
function helpers(w, token){
  const d = w.document;
  const wait = ms => new Promise((res, rej) => { const go = () => token.stop ? rej(new Stop()) : reelPaused ? setTimeout(go, 120) : res(); setTimeout(go, ms); });
  const $ = s => typeof s === 'string' ? d.querySelector(s) : s;
  const fire = (el, type, Ctor = 'Event') => { el = $(el); el && el.dispatchEvent(new w[Ctor](type, { bubbles:true, cancelable:true, pointerId:1, isPrimary:true })); };
  return {
    $, $$: s => [...d.querySelectorAll(s)], wait, fire,
    click: s => { const el = $(s); el && el.click(); },
    key: (s, key) => { const el = $(s); el && el.dispatchEvent(new w.KeyboardEvent('keydown', { key, bubbles:true, cancelable:true })); },
    focus: s => { const el = $(s); el && el.focus({ preventScroll:true }); },
    async type(s, text, ms = 80){ const el = $(s); if (!el) return; el.focus({ preventScroll:true });
      for (const ch of text){ el.value += ch; fire(el, 'input'); await wait(ms + Math.random() * ms * .4); } },
    async erase(s, n, ms = 80){ const el = $(s); for (let i = 0; i < n; i++){ el.value = el.value.slice(0, -1); fire(el, 'input'); await wait(ms); } },
  };
}

P.home = () => `<div class="page">
  <section class="hero">
    <a class="eyebrow" href="#/components">Концепты интеракций →</a>
    <h1 id="heroTitle">${[...'Twist UI'].map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</h1>
    <p>Знакомые компоненты, каждый переосмыслен через одну идею. Состояние — в шрифте и движении, а не в лишних элементах.</p>
    <div class="ctas"><a class="cta primary" href="#/components">Смотреть компоненты</a><a class="cta" href="#/flows">Сценарии аккаунта</a></div>
  </section>

  <section class="reel" id="reel" aria-label="Компоненты в действии">
    <div class="reel-stage" id="reelStage"><iframe id="reelFrame" name="reel" title="Живой компонент" tabindex="-1" allow="clipboard-write"></iframe></div>
    <div class="reel-cap" id="reelCap" aria-live="polite"></div>
    <div class="reel-ctl">
      <button class="reel-pp" id="reelPP" aria-label="Пауза"><svg class="pz" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg><svg class="pl" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg></button>
      <div class="reel-segs" id="reelSegs">${REEL.map((s, i) => `<button data-i="${i}" title="${esc(BY[s].name)}"><i></i></button>`).join('')}</div>
    </div>
  </section>

  <div class="stats"><div><b>${COMPS.length}</b><span>компонента</span></div><div><b>${FLOWS.length}</b><span>сценариев аккаунта</span></div><div><b>1</b><span>кривая анимации</span></div><div><b>0</b><span>зависимостей</span></div></div>
  <footer class="foot"><span>Twist UI · Дизайн и код — Марат Мурзагалиев</span><span>Набор компонентов по мотивам <a href="https://ui.shadcn.com" target="_blank" rel="noopener">shadcn/ui</a> · MIT</span></footer>
  </div>`;

let reelToken = null, reelPaused = false;
P.home.after = () => {
  const stage = $('#reelStage'), frame = $('#reelFrame'), cap = $('#reelCap'), segs = [...main.querySelectorAll('#reelSegs button')];
  const reel = $('#reel');
  let i = 0, startT = 0, dur = 1, raf = 0, lastT = performance.now();
  // the frame renders at a fixed virtual size and is scaled to the stage
  const fit = () => {
    // fill the whole stage: keep a sensible virtual height, stretch the width to the stage
    const W = stage.clientWidth, H = stage.clientHeight, portrait = W < 600;
    let s = H / (portrait ? 760 : 640);
    const minW = portrait ? 380 : 960; if (W / s < minW) s = W / minW;
    frame.style.width = W / s + 'px'; frame.style.height = H / s + 'px';
    frame.style.transform = `scale(${s})`;
  };
  fit(); new ResizeObserver(fit).observe(stage);

  // progress of the current segment follows real time
  const tick = () => {
    const now = performance.now(); if (reelPaused) startT += now - lastT; lastT = now;
    const p = Math.min(1, (now - startT) / dur);
    segs.forEach((b, k) => b.querySelector('i').style.transform = `scaleX(${k < i ? 1 : k === i ? p : 0})`);
    raf = requestAnimationFrame(tick);
  };

  async function play(n){
    if (reelToken) reelToken.stop = true;
    const token = reelToken = { stop:false };
    i = (n + REEL.length) % REEL.length;
    const slug = REEL[i], x = BY[slug];
    segs.forEach((b, k) => b.classList.toggle('on', k === i));
    cap.innerHTML = `<span class="n">${String(i + 1).padStart(2, '0')} / ${REEL.length}</span><b>${esc(x.name)}</b><span class="d">${esc(x.desc)}</span><a href="#/components/${slug}">Открыть<span class="w"> компонент</span> →</a>`;
    cap.animate([{ opacity:0, transform:'translateY(8px)', filter:'blur(4px)' }, { opacity:1, transform:'none', filter:'blur(0)' }], { duration:500, easing:E });
    stage.classList.add('swap');
    await new Promise(r => setTimeout(r, 180));
    if (token.stop) return;
    await new Promise(r => { frame.onload = r; loadFrame(frame, slug); });
    if (token.stop) return;
    const w = frame.contentWindow;
    // never let the demo steal focus or scroll the page
    try { const of = w.HTMLElement.prototype.focus; w.HTMLElement.prototype.focus = function(){ of.call(this, { preventScroll:true }); }; } catch (e) {}
    try { const st = w.document.createElement('style'); st.textContent = '.reset{display:none!important}html,body{background:transparent!important}body::before{display:none!important}'; w.document.head.appendChild(st); } catch (e) {}
    stage.classList.remove('swap');
    const t0 = performance.now();
    startT = t0; dur = EST[slug] || 8000;
    try { await DEMOS[slug](helpers(w, token)); } catch (e) { if (!(e instanceof Stop)) console.warn(slug, e); return; }
    if (token.stop) return;
    await waitWhilePaused(token);
    if (!token.stop) play(i + 1);
  }
  const waitWhilePaused = token => new Promise(r => { const c = () => (!reelPaused || token.stop) ? r() : setTimeout(c, 200); c(); });
  segs.forEach(b => b.addEventListener('click', () => { reelPaused = false; reel.classList.remove('paused'); play(+b.dataset.i); }));
  reelPaused = false;
  $('#reelPP').addEventListener('click', () => { reelPaused = !reelPaused; reel.classList.toggle('paused', reelPaused); $('#reelPP').setAttribute('aria-label', reelPaused ? 'Воспроизвести' : 'Пауза'); });
  // only run while the reel is on screen
  let started = false;
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !started){ started = true; play(0); } }), { threshold:.2 }).observe(reel);
  tick();
  addEventListener('hashchange', () => { if (reelToken) reelToken.stop = true; cancelAnimationFrame(raf); }, { once:true });

  const ls = [...document.querySelectorAll('#heroTitle span')], h = $('#heroTitle');
  ls.forEach((l, k) => l.animate([{ fontWeight:300 }, { fontWeight:850 }, { fontWeight:300 }], { duration:1100, delay:200 + k * 70, easing:E }));
  h.addEventListener('pointermove', e => ls.forEach(l => { const r = l.getBoundingClientRect(); const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)); l.style.setProperty('--w', Math.round(300 + 550 * Math.max(0, 1 - d / 220))); }));
  h.addEventListener('pointerleave', () => ls.forEach(l => l.style.setProperty('--w', 300)));
};
/* rough demo lengths, for the progress bars */
const EST = { slider:1850, 'data-table':1850, otp:1750, carousel:1800, combobox:1800, 'alert-dialog':1800, message:1800, dialog:1800, switch:1750, toggle:1800, questionnaire:1850, 'password-weight':1950 };

function indexPage(list, title, lede, groups){
  return `<div class="page"><div class="crumbs"><a href="#/">Twist UI</a><span>/</span><span>${title}</span></div>
  <h1 class="h1">${title}</h1><p class="lede">${lede}</p>
  ${groups ? `<input class="filter-q" id="fq" placeholder="Поиск по названию или идее…" autocomplete="off">
  <div class="filters" id="filters"><button class="on" data-g="">Все <span>${list.length}</span></button>${groups.map(g => `<button data-g="${esc(g)}">${g}</button>`).join('')}</div>` : '<div style="height:28px"></div>'}
  <div class="cards" id="cards">${list.map(card).join('')}</div></div>`;
}
P.components = () => indexPage(COMPS, 'Компоненты', `${COMPS.length} компонента из shadcn/ui, каждый переосмыслен через одну идею. Откройте карточку — увидите компонент вживую, его твист и код.`, R.groups);
P.components.after = () => {
  thumbs(main);
  let g = '', q = '';
  const apply = () => main.querySelectorAll('.card').forEach(c => c.classList.toggle('hide', (g && c.dataset.g !== g) || (q && !c.dataset.q.includes(q))));
  main.querySelectorAll('#filters button').forEach(b => b.addEventListener('click', () => { g = b.dataset.g; main.querySelectorAll('#filters button').forEach(x => x.classList.toggle('on', x === b)); apply(); }));
  $('#fq').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); apply(); });
};
P.flows = () => indexPage(FLOWS, 'Сценарии аккаунта', 'Семь микроинтеракций из жизни аккаунта: регистрация, подтверждение, восстановление, профиль, устройства. Связаны друг с другом, как в настоящем продукте.');
P.flows.after = () => thumbs(main);

/* component page */
P.component = slug => {
  const x = BY[slug]; if (!x) return P.notFound();
  const idx = ALL.indexOf(x), prev = ALL[idx - 1], next = ALL[idx + 1];
  const isFlow = FLOWS.includes(x);
  const badges = [
    `<span class="badge"><b>${esc(x.group)}</b></span>`,
    `<span class="badge">${esc(x.step)}</span>`,
    x.android ? `<span class="badge"><i></i>Вибрация на Android</span>` : '',
    x.ios ? `<span class="badge"><i></i>Отклик на iPhone</span>` : '',
    x.keys.length ? `<span class="badge">Клавиатура</span>` : '',
  ].join('');
  return `<div class="page">
  <div class="crumbs"><a href="#/">Twist UI</a><span>/</span><a href="#/${isFlow ? 'flows' : 'components'}">${isFlow ? 'Сценарии аккаунта' : 'Компоненты'}</a><span>/</span><span>${esc(x.name)}</span></div>
  <h1 class="h1">${esc(x.name)}</h1>
  <p class="lede">${esc(x.desc)}</p>
  <div class="badges">${badges}</div>

  <div class="block" id="block">
    <div class="bar">
      <div class="seg" id="tabs"><span class="pill"></span><button class="on" data-v="preview">Превью</button><button data-v="code">Код</button></div>
      <span class="sp"></span>
      <button class="ib on" id="vDesk" title="Десктоп" aria-label="Ширина десктопа">${I.desk}</button>
      <button class="ib" id="vPhone" title="Телефон" aria-label="Ширина телефона">${I.phone}</button>
      <button class="ib" id="reload" title="Повторить" aria-label="Повторить">${I.reload}</button>
      <a class="ib" id="openNew" title="Открыть в новой вкладке" aria-label="Открыть в новой вкладке" target="_blank" rel="noopener">${I.ext}</a>
    </div>
    <div class="stage" id="stage"><iframe id="frame" title="${esc(x.name)} — живое превью" allow="clipboard-write; clipboard-read"></iframe><span class="ld">Загружаем превью…</span></div>
    <div class="code" id="code">
      <div class="files" id="files"><button class="on" data-f="index.html">index.html</button><button data-f="styles.css">styles.css</button><button data-f="script.js">script.js</button></div>
      <div class="pre-wrap" id="preWrap"><pre><code id="src">Загрузка…</code></pre></div>
    </div>
  </div>

  ${x.keys.length ? `<h2 id="keyboard">Клавиатура</h2><dl class="kv">${x.keys.map(k => `<dt>${k.split(' ').map(t => `<kbd>${t}</kbd>`).join(' ')}</dt><dd>${KEYDOC[k] || ''}</dd>`).join('')}</dl>` : ''}

  <h2 id="haptics">Тактильный отклик</h2>
  <dl class="kv">
    <dt>Android</dt><dd>${x.android ? 'Вибрирует в ключевые моменты (Vibration API).' : 'Без вибрации — только визуал.'}</dd>
    <dt>iPhone</dt><dd>${x.ios ? 'Щелчок при прямом тапе через нативный свитч (iOS 26.5+ разрешает только тапы).' : 'Без отклика: iOS даёт тактильный отклик только на тап по нативному свитчу.'}</dd>
    <dt>Десктоп</dt><dd>Нет.</dd>
  </dl>

  <div class="pn">${prev ? `<a href="#/components/${prev.slug}"><span>← Назад</span><b>${esc(prev.name)}</b></a>` : '<span></span>'}${next ? `<a class="next" href="#/components/${next.slug}"><span>Далее →</span><b>${esc(next.name)}</b></a>` : ''}</div>
  </div>`;
};
const KEYDOC = { '↑ ↓':'Перемещение по вариантам', '← →':'Переход между элементами / настройка', 'Esc':'Закрыть', 'Enter':'Выбрать / подтвердить', 'Space':'Переключить / удерживать', '⌘K':'Открыть меню команд', 'Tab':'Принять подсказку', 'Delete':'Удалить строку в фокусе', '⌘ ⇧ ⌥':'Зажмите модификаторы для фильтра' };
P.component.after = slug => {
  const frame = $('#frame'), stage = $('#stage'), block = $('#block');
  frame.addEventListener('load', () => stage.classList.add('ready'));
  loadFrame(frame, slug);
  if (EMBED) $('#openNew').addEventListener('click', e => { e.preventDefault(); const u = URL.createObjectURL(new Blob([window.TWIST_PAGES[slug]], { type:'text/html' })); open(u, '_blank'); });
  else $('#openNew').href = compUrl(slug);
  $('#reload').addEventListener('click', () => { stage.classList.remove('ready'); if (EMBED){ frame.srcdoc = ''; requestAnimationFrame(() => loadFrame(frame, slug)); } else frame.src = compUrl(slug) + '?r=' + Date.now(); });
  const setV = m => { stage.classList.toggle('mobile', m); $('#vDesk').classList.toggle('on', !m); $('#vPhone').classList.toggle('on', m); };
  $('#vDesk').addEventListener('click', () => setV(false)); $('#vPhone').addEventListener('click', () => setV(true));

  let file = 'index.html', loaded = {};
  async function show(f){
    file = f;
    main.querySelectorAll('#files button').forEach(b => b.classList.toggle('on', b.dataset.f === f));
    const code = $('#src');
    const text = loaded[f] ??= await source(slug, f);
    if (file !== f) return;
    code.className = 'language-' + (f.endsWith('.css') ? 'css' : f.endsWith('.js') ? 'javascript' : 'xml');
    code.textContent = text; code.removeAttribute('data-highlighted');
    if (window.hljs) hljs.highlightElement(code);
    code.parentElement.animate([{ opacity:0 }, { opacity:1 }], { duration:250 });
  }
  $('#preWrap').appendChild(copyBtn(async () => loaded[file] ??= await source(slug, file)));
  main.querySelectorAll('#files button').forEach(b => b.addEventListener('click', () => show(b.dataset.f)));
  seg($('#tabs'), v => { block.classList.toggle('show-code', v === 'code'); if (v === 'code' && !loaded[file]) show(file); });

};

P.notFound = () => `<div class="page"><h1 class="h1">Не найдено</h1><p class="lede">Такой страницы нет. <a href="#/components">К компонентам →</a></p></div>`;

/* ---------- router ---------- */
let lastRoute = '';
function route(){
  const h = location.hash.replace(/^#\/?/, '');
  const [a, b] = h.split('/');
  let html, after, key = h || '', wide = false, home = false;
  if (!a){ html = P.home(); after = P.home.after; home = true; }
  else if (a === 'components' && !b){ html = P.components(); after = P.components.after; wide = true; }
  else if (a === 'flows'){ html = P.flows(); after = P.flows.after; wide = true; }
  else if (a === 'components'){ html = P.component(b); after = () => P.component.after(b); }
  else html = P.notFound();
  shell.classList.toggle('home', home); shell.classList.toggle('wide', wide);
  main.innerHTML = html;
  after && after();
  buildToc();
  markSide(key);
  const sec = a === 'components' && b && FLOWS.some(f => f.slug === b) ? 'flows' : a;
  document.querySelectorAll('.topnav a').forEach(x => x.classList.toggle('on', !!a && x.dataset.sec === sec));
  const t = main.querySelector('.h1, .hero h1');
  document.title = (a ? (t ? t.textContent + ' — ' : '') : '') + 'Twist UI';
  if (key !== lastRoute) window.scrollTo({ top:0 });
  lastRoute = key;
  closeSide();
}
function buildToc(){
  const hs = [...main.querySelectorAll('h2[id]')];
  toc.innerHTML = hs.length ? '<p>На странице</p>' + hs.map(h => `<a href="#${h.id}" data-id="${h.id}">${h.textContent}</a>`).join('') : '';
  toc.querySelectorAll('a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); document.getElementById(a.dataset.id).scrollIntoView({ behavior:'smooth' }); }));
  spy(hs);
}
let spyObs;
function spy(hs){
  spyObs && spyObs.disconnect();
  spyObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) toc.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.id === e.target.id)); }), { rootMargin:'-80px 0px -70% 0px' });
  hs.forEach(h => spyObs.observe(h));
}

/* ---------- mobile sidebar ---------- */
const scrim = $('#scrim');
function closeSide(){ side.classList.remove('on'); if (!k.classList.contains('on')) scrim.classList.remove('on'); }
$('#menuBtn').addEventListener('click', () => { side.classList.toggle('on'); scrim.classList.toggle('on', side.classList.contains('on')); });
scrim.addEventListener('click', () => { closeSide(); closeK(); });

/* ---------- ⌘K search ---------- */
const k = $('#k'), kq = $('#kq'), kl = $('#kl'), khl = $('#khl');
const ENTRIES = [...ALL.map(x => ({ name:x.name, sub:x.group, href:`#/components/${x.slug}`, desc:x.desc }))];
let results = [], act = 0;
function score(e, q){
  if (!q) return 1;
  const n = e.name.toLowerCase();
  if (n.startsWith(q)) return 4; if (n.split(' ').some(w => w.startsWith(q))) return 3; if (n.includes(q)) return 2;
  return (e.desc || '').toLowerCase().includes(q) ? 1 : 0;
}
function renderK(){
  const q = kq.value.trim().toLowerCase();
  results = ENTRIES.map(e => ({ e, s:score(e, q) })).filter(x => x.s).sort((a, b) => b.s - a.s).slice(0, 40).map(x => x.e);
  act = Math.min(act, Math.max(0, results.length - 1));
  kl.innerHTML = '<span class="k-hl" id="khl"></span>' + (results.length ? results.map((e, i) => {
    const nm = q && e.name.toLowerCase().includes(q) ? esc(e.name).replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i'), '<span class="m">$1</span>') : esc(e.name);
    return `<div class="k-row" data-i="${i}"><span class="nm">${nm}</span><span class="sub">${esc(e.sub)}</span></div>`; }).join('') : '<div class="k-empty">Ничего не найдено</div>');
  kl.querySelectorAll('.k-row').forEach(r => { r.addEventListener('mousemove', () => { if (act !== +r.dataset.i){ act = +r.dataset.i; paintK(); } }); r.addEventListener('click', () => goK(+r.dataset.i)); });
  paintK(false);
}
function paintK(scroll = true){
  const hl = $('#khl'), rows = kl.querySelectorAll('.k-row');
  rows.forEach((r, i) => r.classList.toggle('act', i === act));
  const r = rows[act]; hl.classList.toggle('on', !!r);
  if (r){ hl.style.transform = `translateY(${r.offsetTop}px)`; if (scroll) r.scrollIntoView({ block:'nearest' }); }
}
function goK(i){ const e = results[i]; if (!e) return; closeK(); location.hash = e.href; }
function openK(){ k.classList.add('on'); scrim.classList.add('on'); kq.value = ''; act = 0; renderK(); setTimeout(() => kq.focus(), 30); }
function closeK(){ k.classList.remove('on'); if (!side.classList.contains('on')) scrim.classList.remove('on'); }
kq.addEventListener('input', () => { act = 0; renderK(); });
kq.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown'){ e.preventDefault(); act = Math.min(act + 1, results.length - 1); paintK(); }
  if (e.key === 'ArrowUp'){ e.preventDefault(); act = Math.max(act - 1, 0); paintK(); }
  if (e.key === 'Enter'){ e.preventDefault(); goK(act); }
});
$('#searchBtn').addEventListener('click', openK);
addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); k.classList.contains('on') ? closeK() : openK(); }
  else if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)){ e.preventDefault(); openK(); }
  if (e.key === 'Escape'){ closeK(); closeSide(); }
});

/* links inside a component preview (e.g. OTP → Resend) navigate the site */
addEventListener('message', e => { if (e.data && e.data.twistGo && BY[e.data.twistGo]) location.hash = '#/components/' + e.data.twistGo; });


buildSide();
addEventListener('hashchange', route);
route();
})();
