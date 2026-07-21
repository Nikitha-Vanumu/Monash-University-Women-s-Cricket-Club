
const hero = document.getElementById('home');
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

const canvas=document.getElementById('bgc'),ctx=canvas.getContext('2d'),wrap=document.getElementById('history');
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

// ── Fixtures section background canvas ──
(function(){
  const fc=document.getElementById('fixtures-bgc');
  if(!fc)return;
  const fc2=fc.getContext('2d'),wrap2=fc.parentElement;
  let FW,FH;
  function fresize(){FW=fc.width=wrap2.offsetWidth;FH=fc.height=wrap2.offsetHeight;}
  fresize();window.addEventListener('resize',fresize);
  const fsymbols=[];
  function finitSymbols(){fsymbols.length=0;for(let i=0;i<22;i++){const type=TYPES[i%3];fsymbols.push({type,x:rand(-60,FW+60),y:rand(-60,FH+60),size:type==='ball'?rand(8,16):rand(22,36),angle:rand(0,Math.PI*2),spinSpeed:rand(-0.003,0.003),vx:rand(-0.15,0.15),vy:rand(0.08,0.22),alpha:rand(0.25,0.55)});}}
  finitSymbols();
  function fwrap(s){if(s.y>FH+80){s.y=-80;s.x=rand(-60,FW+60);}if(s.x>FW+80)s.x=-80;if(s.x<-80)s.x=FW+80;}
  function fdrawBat(x,y,s,a,al){fc2.save();fc2.translate(x,y);fc2.rotate(a);fc2.globalAlpha=al;fc2.strokeStyle='#fff';fc2.lineWidth=1.8;const bw=s*0.38,bh=s*0.72;fc2.beginPath();fc2.roundRect(-bw/2,-bh*0.1,bw,bh,s*0.08);fc2.stroke();const hw=s*0.1,hh=s*0.34;fc2.beginPath();fc2.rect(-hw/2,-bh*0.1-hh,hw,hh);fc2.stroke();for(let i=0;i<4;i++){const gy=-bh*0.1-hh+(hh/5)*(i+1);fc2.beginPath();fc2.moveTo(-hw/2,gy);fc2.lineTo(hw/2,gy);fc2.stroke();}fc2.restore();}
  function fdrawBall(x,y,r,a,al){fc2.save();fc2.translate(x,y);fc2.rotate(a);fc2.globalAlpha=al;fc2.strokeStyle='#fff';fc2.lineWidth=1.8;fc2.beginPath();fc2.arc(0,0,r,0,Math.PI*2);fc2.stroke();fc2.beginPath();fc2.moveTo(-r,0);fc2.bezierCurveTo(-r*0.3,-r*0.5,r*0.3,-r*0.5,r,0);fc2.stroke();fc2.beginPath();fc2.moveTo(-r,0);fc2.bezierCurveTo(-r*0.3,r*0.5,r*0.3,r*0.5,r,0);fc2.stroke();fc2.restore();}
  function fdrawWickets(x,y,s,a,al){fc2.save();fc2.translate(x,y);fc2.rotate(a);fc2.globalAlpha=al;fc2.strokeStyle='#fff';fc2.lineWidth=1.8;const sh=s,gap=s*0.275;for(let i=-1;i<=1;i++){fc2.beginPath();fc2.moveTo(i*gap,0);fc2.lineTo(i*gap,-sh);fc2.stroke();fc2.beginPath();fc2.arc(i*gap,-sh,s*0.055,0,Math.PI*2);fc2.stroke();}fc2.beginPath();fc2.moveTo(-gap-s*0.04,-sh+s*0.04);fc2.lineTo(s*0.04,-sh+s*0.04);fc2.stroke();fc2.beginPath();fc2.moveTo(-s*0.04,-sh+s*0.04);fc2.lineTo(gap+s*0.04,-sh+s*0.04);fc2.stroke();fc2.restore();}
  function fanimate(){fc2.clearRect(0,0,FW,FH);fsymbols.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.angle+=s.spinSpeed;fwrap(s);if(s.type==='bat')fdrawBat(s.x,s.y,s.size,s.angle,s.alpha);else if(s.type==='ball')fdrawBall(s.x,s.y,s.size,s.angle,s.alpha);else fdrawWickets(s.x,s.y,s.size,s.angle,s.alpha);});requestAnimationFrame(fanimate);}
  fanimate();
})();

// ── Smooth momentum scroll for history section ──
const scroller=document.getElementById('history'),track=document.getElementById('track');
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

// ── Join modal ──
(function () {
  const modal = document.getElementById('joinModal');
  const closeBtn = document.getElementById('modalClose');
  const form = document.getElementById('join-form');
  const submitBtn = document.getElementById('modal-submit-btn');
  const formContainer = document.getElementById('modal-form-container');
  const successMsg = document.getElementById('modal-success-msg');

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[href="#join"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(() => { formContainer.style.display = 'none'; successMsg.style.display = 'block'; })
      .catch(() => { formContainer.style.display = 'none'; successMsg.style.display = 'block'; });
  });
})();

// ── Mobile hamburger menu ──
const navHamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');

navHamburger.addEventListener('click', () => {
  navHamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navHamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Fixtures & Results ──
(function () {
  const root = document.getElementById('fixtures-root');
  if (!root) return;

  const TEAM_LABELS = {
    'b5ef3909': "CV Women's",
    'feab48ee': 'Southern Bayside',
  };

  const PLAYHQ_LINKS = [
    {
      href: 'https://www.playhq.com/cricket-australia/org/monash-university-cricket-club/43ca56f3/cv-womens-community-cricket-competition-summer-202526/teams/monash-uni-noble-park-women/b5ef3909',
      comp: "CV Women's Community Cricket",
      season: 'Summer 2025/26',
    },
    {
      href: 'https://www.playhq.com/cricket-australia/org/monash-university-cricket-club/43ca56f3/cricket-southern-bayside-womens-summer-202526/teams/monash-uni-noble-park/feab48ee',
      comp: "Cricket Southern Bayside Women's",
      season: 'Summer 2025/26',
    },
  ];

  function fallback() {
    return `
      <div class="fixtures-playhq-links">
        <p class="fixtures-playhq-label">Results are hosted on PlayHQ — updated in real time.</p>
        <div class="fixtures-playhq-cards">
          ${PLAYHQ_LINKS.map(l => `
            <a class="fixtures-playhq-card" href="${l.href}" target="_blank" rel="noopener">
              <span class="fixtures-playhq-comp">${l.comp}</span>
              <span class="fixtures-playhq-season">${l.season}</span>
              <span class="fixtures-playhq-cta">View Results ↗</span>
            </a>`).join('')}
        </div>
      </div>`;
  }

  function outcome(result, teamId) {
    const isHome = result.homeTeam?.id === teamId;
    switch (result.result) {
      case 'HOME_WIN':  return isHome ? 'win' : 'loss';
      case 'AWAY_WIN':  return isHome ? 'loss' : 'win';
      case 'TIE':       return 'draw';
      default:          return 'nr';
    }
  }

  function outcomeLabel(o) {
    return { win: 'Won', loss: 'Lost', draw: 'Draw', nr: 'N/R' }[o] || o;
  }

  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function score(team) {
    if (!team) return '–';
    return team.score || team.totalScore || team.runs || '–';
  }

  function render(results) {
    if (!results.length) {
      return `<p class="fixtures-empty">No results recorded yet — check back after round one.</p>
              ${fallback()}`;
    }

    // Group by competition
    const groups = {};
    results.forEach(r => {
      const lbl = TEAM_LABELS[r._teamId] || r._label;
      (groups[lbl] = groups[lbl] || []).push(r);
    });
    const comps = Object.keys(groups);

    let html = '';

    if (comps.length > 1) {
      html += `<div class="fixtures-filter-row">
        <button class="filter-btn active" data-filter="all">All</button>
        ${comps.map(c => `<button class="filter-btn" data-filter="${c}">${c}</button>`).join('')}
      </div>`;
    }

    html += `<div class="results-list">`;
    comps.forEach(comp => {
      if (comps.length > 1) {
        html += `<div class="round-header results-comp-header" data-comp="${comp}">${comp}</div>`;
      }
      groups[comp].forEach(r => {
        const o            = outcome(r, r._teamId);
        const roundLbl     = r.round?.name || (r.round?.roundNumber ? `R${r.round.roundNumber}` : '');
        const venue        = r.venue?.name || '';
        const dateStr      = fmtDate(r.startTime);
        const isMonashHome = r.homeTeam?.id === r._teamId;
        html += `
          <div class="fixture-card result-card" data-comp="${comp}">
            <div class="fc-header">
              <span class="fc-round">${roundLbl}</span>
              <span class="outcome-pill outcome-${o}">${outcomeLabel(o)}</span>
            </div>
            <div class="fc-team${isMonashHome ? ' fc-team-ours' : ''}">
              <span class="fc-team-name">${r.homeTeam?.name || '–'}</span>
              <span class="fc-score">${score(r.homeTeam)}</span>
            </div>
            <div class="fc-team${!isMonashHome ? ' fc-team-ours' : ''}">
              <span class="fc-team-name">${r.awayTeam?.name || '–'}</span>
              <span class="fc-score">${score(r.awayTeam)}</span>
            </div>
            <div class="fc-footer">
              ${dateStr ? `<span>${dateStr}</span>` : ''}
              ${venue ? `<span class="fc-venue">${venue}</span>` : ''}
            </div>
          </div>`;
      });
    });
    html += `</div>`;

    html += `<div class="results-playhq-footer">
      ${PLAYHQ_LINKS.map(l => `<a href="${l.href}" target="_blank" rel="noopener" class="results-playhq-link">${l.comp} ↗</a>`).join('')}
    </div>`;

    return html;
  }

  root.innerHTML = `<p class="fixtures-loading">Loading results…</p>`;

  fetch('/.netlify/functions/results')
    .then(r => r.json())
    .then(json => {
      root.innerHTML = render(json.data || []);

      root.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          root.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter;
          root.querySelectorAll('.result-card, .results-comp-header').forEach(el => {
            el.style.display = (filter === 'all' || el.dataset.comp === filter) ? '' : 'none';
          });
        });
      });
    })
    .catch(() => { root.innerHTML = fallback(); });
})();
