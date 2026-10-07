/* Twist UI — haptics + embed helpers
   Android (Chrome, Firefox): Vibration API with patterns, works for any event.
   iPhone: Safari has no Vibration API. Since iOS 26.5 the system haptic tick only plays when a
   finger directly taps a real native <input type="checkbox" switch>, so addTapHaptics() lays an
   invisible one over a tappable control. Typing and timers can't vibrate on iPhone.
   Desktop: nothing happens. */
(() => {
  const HAS_VIBRATE = typeof navigator.vibrate === 'function';
  const IOS_TAP_HAPTICS = !HAS_VIBRATE && matchMedia('(pointer: coarse)').matches;

  const haptic = pattern => { try { if (HAS_VIBRATE) navigator.vibrate(pattern); } catch (e) {} };

  function addTapHaptics(container){
    if (!IOS_TAP_HAPTICS) return null;
    const sw = document.createElement('input');
    sw.type = 'checkbox';
    sw.setAttribute('switch', '');
    sw.className = 'haptic-switch';
    sw.tabIndex = -1;
    sw.setAttribute('aria-hidden', 'true');
    container.appendChild(sw);
    return sw;
  }

  window.Haptics = { haptic, addTapHaptics, HAS_VIBRATE, IOS_TAP_HAPTICS };
})();

/* crossfade helper for .swap-stack: show the child with data-k = key */
window.swapTo = (stack, key) => {
  [...stack.children].forEach(c => {
    const was = c.classList.contains('on'), now = c.dataset.k === key;
    c.classList.toggle('on', now);
    c.classList.toggle('out', was && !now);
    if (now) c.classList.remove('out');
  });
};

/* reduced motion: JS-driven (Web Animations) motion is shortened too, not just CSS */
if (matchMedia('(prefers-reduced-motion: reduce)').matches){
  const orig = Element.prototype.animate;
  Element.prototype.animate = function(k, o){
    if (typeof o === 'number') o = Math.min(o, 180);
    else if (o){ o = { ...o, duration: Math.min(o.duration ?? 0, 180), delay: Math.min(o.delay ?? 0, 60) }; }
    return orig.call(this, k, o);
  };
}

/* embedded in the docs site: tag the page and route sibling links through the site */
if (window.top !== window){
  document.documentElement.classList.add('embedded');
  if (window.name === 'showcase') document.documentElement.classList.add('showcase');
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const m = a.getAttribute('href').match(/^\.\.\/([a-z0-9-]+)\/?$/);
    if (m){ e.preventDefault(); parent.postMessage({ twistGo: m[1] }, '*'); }
  }, true);
}
