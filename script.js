const hero = document.getElementById('hero');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const progressBar = document.getElementById('progressBar');
let current = 0;
let autoTimer = null;

function goTo(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  resetProgress();
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

function resetProgress() {
  progressBar.style.animation = 'none';
  progressBar.offsetHeight; // reflow
  progressBar.style.animation = 'progress 5s linear forwards';
}

function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(next, 5000);
}

// Init progress
resetProgress();
startAuto();

// Progress bar end → advance
progressBar.addEventListener('animationend', () => {
  next();
  startAuto();
});

// Buttons
document.getElementById('prevBtn').addEventListener('click', () => { prev(); startAuto(); });
document.getElementById('nextBtn').addEventListener('click', () => { next(); startAuto(); });

// Dots
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goTo(parseInt(dot.dataset.index));
    startAuto();
  });
});

// Keyboard — focus hero or anywhere on page
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { next(); startAuto(); e.preventDefault(); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { prev(); startAuto(); e.preventDefault(); }
});

// Focus hero on click so keyboard works immediately
hero.addEventListener('click', () => hero.focus());

// Pause on hover
hero.addEventListener('mouseenter', () => clearInterval(autoTimer));
hero.addEventListener('mouseleave', () => startAuto());

// Touch swipe
let touchStartX = 0;
hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
hero.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
});

const canvas=document.getElementById('bgc'),ctx=canvas.getContext('2d'),wrap=document.getElementById('scroller');
let W,H;
function resize(){W=canvas.width=wrap.offsetWidth;H=canvas.height=wrap.offsetHeight;}
resize();window.addEventListener('resize',resize);
function rand(a,b){return a+Math.random()*(b-a);}
function drawBat(x,y,s,a,al){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=al;ctx.strokeStyle='#fff';ctx.lineWidth=1.8;const bw=s*0.38,bh=s*0.72;ctx.beginPath();ctx.roundRect(-bw/2,-bh*0.1,bw,bh,s*0.08);ctx.stroke();const hw=s*0.1,hh=s*0.34;ctx.beginPath();ctx.rect(-hw/2,-bh*0.1-hh,hw,hh);ctx.stroke();for(let i=0;i<4;i++){const gy=-bh*0.1-hh+(hh/5)*(i+1);ctx.beginPath();ctx.moveTo(-hw/2,gy);ctx.lineTo(hw/2,gy);ctx.stroke();}ctx.restore();}
function drawBall(x,y,r,a,al){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=al;ctx.strokeStyle='#fff';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-r,0);ctx.bezierCurveTo(-r*0.3,-r*0.5,r*0.3,-r*0.5,r,0);ctx.stroke();ctx.beginPath();ctx.moveTo(-r,0);ctx.bezierCurveTo(-r*0.3,r*0.5,r*0.3,r*0.5,r,0);ctx.stroke();ctx.restore();}
function drawWickets(x,y,s,a,al){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=al;ctx.strokeStyle='#fff';ctx.lineWidth=1.8;const sh=s,gap=s*0.275;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*gap,0);ctx.lineTo(i*gap,-sh);ctx.stroke();ctx.beginPath();ctx.arc(i*gap,-sh,s*0.055,0,Math.PI*2);ctx.stroke();}ctx.beginPath();ctx.moveTo(-gap-s*0.04,-sh+s*0.04);ctx.lineTo(s*0.04,-sh+s*0.04);ctx.stroke();ctx.beginPath();ctx.moveTo(-s*0.04,-sh+s*0.04);ctx.lineTo(gap+s*0.04,-sh+s*0.04);ctx.stroke();ctx.restore();}
const TYPES=['bat','ball','wicket'],symbols=[];
function initSymbols(){symbols.length=0;for(let i=0;i<22;i++){const type=TYPES[i%3];symbols.push({type,x:rand(-60,W+60),y:rand(-60,H+60),size:type==='ball'?rand(16,32):rand(44,72),angle:rand(0,Math.PI*2),spinSpeed:rand(-0.003,0.003),vx:rand(-0.15,0.15),vy:rand(0.08,0.22),alpha:rand(0.25,0.55)});}}
initSymbols();
function wrapSymbol(s){if(s.y>H+80){s.y=-80;s.x=rand(-60,W+60);}if(s.x>W+80)s.x=-80;if(s.x<-80)s.x=W+80;}
function animate(){ctx.clearRect(0,0,W,H);symbols.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.angle+=s.spinSpeed;wrapSymbol(s);if(s.type==='bat')drawBat(s.x,s.y,s.size,s.angle,s.alpha);else if(s.type==='ball')drawBall(s.x,s.y,s.size,s.angle,s.alpha);else drawWickets(s.x,s.y,s.size,s.angle,s.alpha);});requestAnimationFrame(animate);}
animate();

// ── Smooth momentum scroll for history section ──
const scroller=document.getElementById('scroller'),track=document.getElementById('track');
let isDown=false, startX=0, curX=0, targetX=0, velX=0, lastX=0, lastT=0, rafId=null;

function clamp(v){ return Math.max(-(track.scrollWidth - scroller.clientWidth), Math.min(0, v)); }

function smoothLoop(){
  // friction-based momentum
  velX *= 0.92;
  targetX = clamp(targetX + velX);
  curX += (targetX - curX) * 0.18; // lerp toward target
  track.style.transform = `translateX(${curX}px)`;
  if(Math.abs(velX) > 0.3 || Math.abs(targetX - curX) > 0.3){
    rafId = requestAnimationFrame(smoothLoop);
  } else {
    curX = targetX;
    track.style.transform = `translateX(${curX}px)`;
    rafId = null;
  }
}

function startMomentum(){
  if(rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(smoothLoop);
}

scroller.addEventListener('mousedown', e => {
  isDown = true;
  startX = e.pageX;
  lastX = e.pageX;
  lastT = Date.now();
  velX = 0;
  if(rafId){ cancelAnimationFrame(rafId); rafId=null; }
  curX = parseFloat(track.style.transform?.match(/-?\d+(\.\d+)?/)?.[0] || 0);
  targetX = curX;
  scroller.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', () => {
  if(!isDown) return;
  isDown = false;
  scroller.style.cursor = 'grab';
  startMomentum();
});

document.addEventListener('mousemove', e => {
  if(!isDown) return;
  e.preventDefault();
  const now = Date.now();
  const dt = Math.max(1, now - lastT);
  velX = (e.pageX - lastX) / dt * 16; // scale to per-frame
  lastX = e.pageX;
  lastT = now;
  const delta = e.pageX - startX;
  startX = e.pageX;
  targetX = clamp(targetX + delta);
  curX = targetX;
  track.style.transform = `translateX(${curX}px)`;
});

scroller.addEventListener('touchstart', e => {
  isDown = true;
  startX = e.touches[0].pageX;
  lastX = e.touches[0].pageX;
  lastT = Date.now();
  velX = 0;
  if(rafId){ cancelAnimationFrame(rafId); rafId=null; }
  curX = parseFloat(track.style.transform?.match(/-?\d+(\.\d+)?/)?.[0] || 0);
  targetX = curX;
}, {passive:true});

document.addEventListener('touchend', () => {
  if(!isDown) return;
  isDown = false;
  startMomentum();
});

document.addEventListener('touchmove', e => {
  if(!isDown) return;
  const now = Date.now();
  const dt = Math.max(1, now - lastT);
  velX = (e.touches[0].pageX - lastX) / dt * 16;
  lastX = e.touches[0].pageX;
  lastT = now;
  const delta = e.touches[0].pageX - startX;
  startX = e.touches[0].pageX;
  targetX = clamp(targetX + delta);
  curX = targetX;
  track.style.transform = `translateX(${curX}px)`;
}, {passive:true});

scroller.addEventListener('wheel', e => {
  const maxScroll = -(track.scrollWidth - scroller.clientWidth);
  const atLeft = targetX >= 0;
  const atRight = targetX <= maxScroll;
  // If scrolling right but already at right edge, or left at left edge — let page scroll
  if ((e.deltaY > 0 && atRight) || (e.deltaY < 0 && atLeft)) return;
  e.preventDefault();
  velX = 0;
  targetX = clamp(targetX - e.deltaY * 1.4);
  startMomentum();
}, {passive:false});