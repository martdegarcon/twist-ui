
const { haptic } = window.Haptics;
const badge = document.getElementById('badge');
let n = 3;
/* each digit is its own drum; columns are added/removed with a width transition */
function colHTML(){ return Array.from({ length:10 }, (_, d) => `<b>${d}</b>`).join(''); }
function render(){
  badge.classList.toggle('zero', n === 0);
  const digits = String(Math.max(n, 0)).split('').map(Number);
  let cols = [...badge.querySelectorAll('.col:not(.leaving)')];
  while (cols.length < digits.length){
    const c = document.createElement('span'); c.className = 'col new'; c.innerHTML = colHTML(); c.style.setProperty('--d', 0);
    badge.prepend(c); cols.unshift(c);
    requestAnimationFrame(() => requestAnimationFrame(() => c.classList.remove('new')));
  }
  while (cols.length > digits.length){
    const c = cols.shift(); c.classList.add('leaving', 'new'); setTimeout(() => c.remove(), 500);
  }
  cols.forEach((c, i) => requestAnimationFrame(() => c.querySelectorAll('b').forEach(b => b.style.setProperty('--d', digits[i]))));
}
document.getElementById('add').addEventListener('click', () => { n++; haptic([8]); render(); });
document.getElementById('add9').addEventListener('click', () => { n += 9; haptic([8]); render(); });
document.getElementById('read').addEventListener('click', () => { n = 0; haptic([15, 50, 30]); render(); });
render();
