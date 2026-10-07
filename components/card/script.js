
const { haptic } = window.Haptics;
const tk = document.getElementById('tk');
const hoverable = matchMedia('(hover:hover)').matches;
const set = v => { if (tk.classList.contains('lift') !== v){ tk.classList.toggle('lift', v); haptic([8]); } };
if (hoverable){ tk.addEventListener('mouseenter', () => set(true)); tk.addEventListener('mouseleave', () => set(false)); }
if (!hoverable) tk.addEventListener('click', () => set(!tk.classList.contains('lift')));
tk.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); set(!tk.classList.contains('lift')); } });
