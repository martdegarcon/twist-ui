
const { haptic } = window.Haptics;
const stack = document.getElementById('stack'), items = [...stack.querySelectorAll('.n')];
const ROW = 64, GAP = 10;
let open = false;
function layout(){
  items.forEach((n, i) => {
    n.style.zIndex = items.length - i;
    if (open){
      n.style.transform = `translateY(${i * (ROW + GAP)}px)`;
      n.style.opacity = 1; n.style.filter = 'none';
      n.style.transitionDelay = i * 45 + 'ms';           // dealt out one by one
    } else {
      const k = Math.min(i, 2);
      n.style.transform = `translateY(${k * 10}px) scale(${1 - k * .05})`;
      n.style.opacity = i > 2 ? 0 : 1; n.style.filter = `brightness(${1 - k * .2})`;
      n.style.transitionDelay = (items.length - 1 - i) * 30 + 'ms';   // gathered back from the bottom
    }
  });
  stack.style.height = open ? items.length * (ROW + GAP) - GAP + 'px' : ROW + 20 + 'px';
  stack.classList.toggle('open', open);
}
function toggle(){ open = !open; haptic([10]); layout(); }
document.getElementById('toggle').addEventListener('click', toggle);
items[0].addEventListener('click', toggle);
layout();
