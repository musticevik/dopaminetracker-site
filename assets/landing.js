(() => {
const C = window.DT_CONFIG, S = C.stats;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t, seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
const eo = t => 1 - Math.pow(1 - t, 3), eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => innerWidth <= 900;
/* The page language is baked into <html lang> at build time (one page per language for SEO);
   the switch in the nav is a plain link to the other page. */
const lang = (document.documentElement.lang || C.defaultLang).slice(0, 2);
const T = k => C.copy[lang][k] ?? C.copy.en[k] ?? '';

/* The impact scenes only make sense with real, measured numbers. */
if (!S.showImpact) { $$('[data-scene="impact"],[data-scene="currency"]').forEach(el => el.remove()); $$('a[href="#impact"]').forEach(a => a.remove()); }

/* ---------- formatting ---------- */
const nf = () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US');
const fmtN = n => nf().format(Math.round(n));
const fmtT = min => { const h = Math.floor(min / 60), m = Math.floor(min % 60); return lang === 'tr' ? (h ? `${h} sa ${m} dk` : `${m} dk`) : (h ? `${h}h ${m}m` : `${m}m`); };
const fmtCur = v => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: C.pricing.currency }).format(v);
const setText = (el, s) => { if (el && el.textContent !== s) el.textContent = s; };

/* Derived stats */
const D = {
  perUser: S.usersHelped ? Math.round(S.hoursReclaimed / S.usersHelped) : 0,
  days: Math.floor(S.hoursReclaimed / 24),
  months: Math.round(S.hoursReclaimed / 730 * 10) / 10,
  weeklyMin: S.avgDailyMinutes * 7,
  yearlyH: Math.floor(S.avgDailyMinutes * 365 / 60 / 10) * 10,
  weekTotal: C.week.minutes.reduce((a, b) => a + b, 0)
};
D.weekAvg = D.weekTotal / 7;
D.delta = C.week.todayMinutes - D.weekAvg;

/* ---------- static render ---------- */
function applyLang() {
  $$('[data-i]').forEach(el => { const v = C.copy[lang][el.dataset.i]; if (v != null) el.innerHTML = v; });
  setText($('#priceM'), fmtCur(C.pricing.monthly)); setText($('#priceY'), fmtCur(C.pricing.yearly)); setText($('#priceFree'), fmtCur(0).replace(/[\d.,]+/, '0'));
  setText($('#dTotal'), fmtT(D.weekTotal)); setText($('#dAvg'), fmtT(D.weekAvg)); setText($('#dToday'), fmtT(C.week.todayMinutes));
  setText($('#dDelta'), `−${fmtT(-D.delta)} · −${Math.round(-D.delta / D.weekAvg * 100)}%`);
  setText($('#dAvgTag'), `${T('data_avg')} ${fmtT(D.weekAvg)}`);
  buildWeekChart(); buildQuotes();
  scenes.forEach(s => s.last = null); render();
}
$$('[data-dl]').forEach(a => a.href = C.downloadUrl);

/* ---------- builders ---------- */
const dots = $('#dots'); if (dots) { for (let i = 0; i < S.usersHelped; i++) { const d = document.createElement('i'); d.className = 'dot'; dots.appendChild(d); } }
const dotEls = dots ? $$('.dot', dots) : []; dotEls[Math.floor(S.usersHelped / 2) + 12]?.classList.add('pick');
const cal = $('#cal'); const cols = 24, cells = Math.ceil(D.days / cols) * cols;
if (cal) { for (let i = 0; i < cells; i++) { const c = document.createElement('i'); c.className = 'cell' + (i >= D.days ? ' hide' : ''); c.dataset.m = Math.floor(i / 30.4); cal.appendChild(c); } }
const cellEls = cal ? $$('.cell', cal) : [];
const months = $('#months'); if (months) { for (let i = 1; i <= 6; i++) { const s = document.createElement('span'); s.textContent = String(i).padStart(2, '0'); months.appendChild(s); } }
const bars = $('#bars'); const maxApp = Math.max(...C.topApps.map(a => a.minutes));
C.topApps.forEach(a => { bars.insertAdjacentHTML('beforeend', `<div class="bar-row"><span>${a.name}</span><span class="v">0m</span><span class="tr"><span class="fl"></span></span></div>`); });
const barRows = $$('.bar-row', bars);
const sd = $('#streakDots'); for (let i = 0; i < 7; i++) sd.appendChild(document.createElement('i')); const streakEls = $$('i', sd);
/* trend path */
(() => { const m = C.trend.minutes, mx = Math.max(...m), mn = Math.min(...m); const pts = m.map((v, i) => [i / (m.length - 1) * 260, 100 - (v - mn) / (mx - mn) * 80]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  $('#trendLine').setAttribute('d', d); $('#trendArea').setAttribute('d', d + ' L260 110 L0 110 Z'); })();
const trendLine = $('#trendLine'); let trendLen = 400; try { trendLen = trendLine.getTotalLength(); } catch (e) {}
trendLine.style.strokeDasharray = trendLen; trendLine.style.strokeDashoffset = trendLen;
const ringFg = $('#ringFg'), ringC = 2 * Math.PI * 76; ringFg.style.strokeDasharray = ringC; ringFg.style.strokeDashoffset = ringC;

function buildWeekChart() {
  const W = 700, H = 300, pad = 36, bw = 54, m = C.week.minutes, mx = Math.max(...m) * 1.08, labels = lang === 'tr' ? C.week.labelsTr : C.week.labels;
  const x = i => pad + i * ((W - pad * 2) / m.length) + ((W - pad * 2) / m.length - bw) / 2, y = v => H - 34 - v / mx * (H - 70);
  let s = '<g class="gl">'; [0.25, .5, .75, 1].forEach(f => { s += `<line x1="0" x2="${W}" y1="${y(mx * f)}" y2="${y(mx * f)}"></line>`; }); s += '</g>';
  m.forEach((v, i) => { const isT = i === m.length - 1; s += `<rect class="b${isT ? ' hi' : ''}" x="${x(i)}" y="${y(v)}" width="${bw}" height="${H - 34 - y(v)}" rx="10" style="transition-delay:${i * 90}ms"></rect><text x="${x(i) + bw / 2}" y="${H - 10}" text-anchor="middle">${labels[i]}</text>`; });
  s += `<line class="avg" x1="${pad}" x2="${W - pad}" y1="${y(D.weekAvg)}" y2="${y(D.weekAvg)}"></line><text x="${W - pad}" y="${y(D.weekAvg) - 8}" text-anchor="end">${T('data_avg').toLocaleUpperCase(lang === 'tr' ? 'tr-TR' : 'en-US')} ${fmtT(D.weekAvg)}</text>`;
  $('#weekSvg').innerHTML = s;
  const sc = [0, 4, 9, 14, 20, 35, 56], px = i => 10 + i * (680 / 6), py = v => 80 - v / 60 * 70;
  let d = `M${px(0)} ${py(sc[0])}`; for (let i = 1; i < sc.length; i++) { const cx = (px(i - 1) + px(i)) / 2; d += ` C${cx} ${py(sc[i - 1])} ${cx} ${py(sc[i])} ${px(i)} ${py(sc[i])}`; }
  $('#scoreSvg').innerHTML = `<path class="curve" d="${d}"></path><circle class="dotp" cx="${px(6)}" cy="${py(56)}" r="6"></circle><text x="${px(6)}" y="${py(56) - 14}" text-anchor="end">${C.week.scoreTo}</text><text x="${px(0)}" y="${py(0) - 10}">${C.week.scoreFrom}</text>`;
}
function buildQuotes() {
  const list = C.testimonials[lang] || C.testimonials.en || [];
  $('#quotes').innerHTML = list.map(t =>
    `<figure class="quote"><span class="bar"></span><span class="stars" aria-label="${t.stars} / 5">${'★'.repeat(t.stars)}</span><p>“${t.text}”</p><figcaption class="who"><span class="av">${t.name.charAt(0)}</span>${t.name} · ${t.source}</figcaption></figure>`).join('');
}

/* ---------- scroll scenes ---------- */
const scenes = $$('.scene').map(el => ({ el, name: el.dataset.scene, top: 0, len: 1, last: null }));
function measure() { scenes.forEach(s => { s.top = s.el.getBoundingClientRect().top + scrollY; s.len = Math.max(1, s.el.offsetHeight - innerHeight); }); }
const tf = (x, y, sc, ry, unitX = 'vw', unitY = 'vh') => reduce ? 'translate(-50%,-50%)' : `translate(-50%,-50%) translate(${x}${unitX},${y}${unitY}) scale(${sc}) rotateY(${ry}deg)`;
const faceOf = (phone, k) => $$('img', phone).forEach((im, i) => im.classList.toggle('is-front', i === k));

const H = {
  hero(p) {
    const m = mobile();
    const short = innerHeight < 760, K = m ? { x0: 0, y0: 66, x1: 30, y1: 30, s1: .5, r1: -14 } : { x0: 0, y0: short ? 78 : 62, x1: 27, y1: 1, s1: .86, r1: -14 };
    const t = eio(seg(p, .1, .42));
    $('#heroPhone').style.transform = tf(lerp(K.x0, K.x1, t), lerp(K.y0, K.y1, t), lerp(1, K.s1, t), lerp(0, K.r1, t));
    const c = $('#heroCopy'), co = 1 - seg(p, .06, .24); c.style.opacity = co; c.style.transform = `translateY(${-seg(p, .06, .24) * 70}px)`; c.style.pointerEvents = co < .1 ? 'none' : '';
    $('#hint').style.opacity = 1 - seg(p, 0, .08);
    const pr = $('#problem'); pr.style.opacity = eo(seg(p, .3, .42));
    const rows = [[.4, .56, v => fmtT(S.avgDailyMinutes * v)], [.56, .7, v => fmtT(D.weeklyMin * v)], [.7, .84, v => fmtN(Math.floor(D.yearlyH * v / 10) * 10) + '+']];
    rows.forEach(([a, b, f], i) => { const r = $$('.row', pr)[i], tt = eo(seg(p, a, b)); r.style.opacity = tt; r.style.transform = `translateY(${(1 - tt) * 30}px)`; setText($('.num', r), f(tt)); });
    $('#pNote').style.opacity = seg(p, .84, .94);
    faceOf($('#heroPhone'), p > .52 ? 1 : 0);
  },
  impact(p) {
    const ph = [[0, .36], [.36, .68], [.68, 1]], k = p < .36 ? 0 : p < .68 ? 1 : 2, t = seg(p, ...ph[k]);
    const targets = [S.usersHelped, S.hoursReclaimed, D.perUser], labels = ['imp_l0', 'imp_l1', 'imp_l2'];
    const inn = eo(seg(t, 0, .14)), out = k < 2 ? seg(t, .88, 1) : 0, o = inn * (1 - out), cnt = eo(seg(t, .04, .6));
    const n = $('#impN'), l = $('#impL');
    n.style.opacity = l.style.opacity = o; n.style.transform = `translateY(${(1 - inn) * 40 - out * 40}px)`; l.style.transform = n.style.transform;
    setText(n, fmtN(targets[k] * cnt) + (cnt >= 1 ? '+' : '')); setText(l, T(labels[k]));
    n.classList.toggle('green', k === 1);
    const lit = k === 0 ? Math.round(S.usersHelped * cnt) : S.usersHelped;
    if (dots.dataset.lit != lit) { dots.dataset.lit = lit; dotEls.forEach((d, i) => d.classList.toggle('on', i < lit)); }
    dots.dataset.phase = k;
  },
  features(p, s) {
    const stage = $('.stage', s.el), phone = $('#featPhone'), chapters = $$('.chapter', s.el), vizs = [$('#viz1'), $('#viz2'), $('#viz3')];
    const n = 3, f = p * (n - 1), i = Math.min(Math.floor(f), n - 2), t = f - i, tt = eio(seg(t, .3, .7)), ang = tt * 180;
    const face = ang <= 90 ? i : i + 1; let rot = ang <= 90 ? ang : ang - 180;
    const idle = (t < .3 ? t / .3 : t > .7 ? (t - 1) / .3 : 0) * 5;
    phone.style.transform = reduce ? '' : `rotateY(${rot + (tt === 0 || tt === 1 ? idle : 0)}deg)`;
    $$('img', phone).forEach((im, k) => im.classList.toggle('is-front', k === face));
    const active = Math.round(f); stage.dataset.chapter = active;
    chapters.forEach((c, k) => { const d = f - k, o = clamp(1 - (Math.abs(d) - .18) / .3, 0, 1); c.style.opacity = o; c.style.transform = reduce ? '' : `translateY(${-d * 40}px)`; c.classList.toggle('is-active', k === active); });
    vizs.forEach((v, k) => { const d = f - k, o = clamp(1 - (Math.abs(d) - .22) / .28, 0, 1); v.style.opacity = o; v.style.transform = reduce ? '' : `translate(${d * -30}px, ${Math.abs(d) * 20}px)`; v.style.pointerEvents = o ? '' : 'none';
      const prog = d >= 0 ? 1 : eo(clamp(1 + d / .6, 0, 1)); v._prog = prog; });
    /* viz 1: bars */
    barRows.forEach((r, k) => { const a = C.topApps[k], w = a.minutes / maxApp * 100 * vizs[0]._prog; $('.fl', r).style.width = w + '%'; setText($('.v', r), fmtT(a.minutes * vizs[0]._prog)); });
    /* viz 2: ring */
    const rp = vizs[1]._prog, used = C.limit.limitMinutes * eo(seg(rp, 0, .85)); ringFg.style.strokeDashoffset = ringC * (1 - used / C.limit.limitMinutes); setText($('#ringV'), fmtT(used)); vizs[1].classList.toggle('blocked', rp > .97);
    /* viz 3: trend */
    const tp = vizs[2]._prog; trendLine.style.strokeDashoffset = trendLen * (1 - tp); $('#trendArea').style.opacity = tp; const sN = Math.round(C.trend.streak * seg(tp, .45, 1)); streakEls.forEach((e, k) => e.classList.toggle('on', k < sN)); setText($('#streakN'), sN);
  },
  currency(p) {
    const ph = [[0, .36], [.36, .68], [.68, 1]], k = p < .36 ? 0 : p < .68 ? 1 : 2, t = seg(p, ...ph[k]);
    const inn = eo(seg(t, 0, .14)), out = k < 2 ? seg(t, .88, 1) : 0, o = inn * (1 - out), cnt = eo(seg(t, .04, .6));
    const n = $('#curN'), l = $('#curL');
    n.style.opacity = l.style.opacity = o; n.style.transform = `translateY(${(1 - inn) * 40 - out * 40}px)`; l.style.transform = n.style.transform;
    const val = k === 0 ? fmtN(S.hoursReclaimed * cnt) : k === 1 ? fmtN(D.days * cnt) : nf().format(Math.round(D.months * cnt * 10) / 10);
    setText(n, val); setText(l, T(['cur_l0', 'cur_l1', 'cur_l2'][k]));
    const lit = k === 0 ? Math.floor(D.days * cnt) : D.days;
    if (cal.dataset.lit != lit) { cal.dataset.lit = lit; cellEls.forEach((c, i) => c.classList.toggle('on', i < lit)); }
    cal.dataset.phase = k; $('#curScene').dataset.phase = k;
  },
  showcase(p) {
    const m = mobile(), main = $('#mainPhone'), sats = $$('.sat'), caps = $$('.cap');
    const start = m ? [[-30, -12, 18], [-16, 14, 8], [16, 14, -8], [30, -12, -18]] : [[-38, -4, 22], [-19, 8, 12], [19, 8, -12], [38, -4, -22]];
    const scaleTo = m ? 52 / 36 : 62 / 45; let face = 0;
    sats.forEach((s, k) => { const a = k * .19 + .04, t = eio(seg(p, a, a + .27)), [x, y, r] = start[k];
      const o = 1 - seg(t, .82, 1); s.style.opacity = o; s.style.transform = tf(x * (1 - t), y * (1 - t), lerp(1, scaleTo, t), r * (1 - t));
      caps[k].style.opacity = o * seg(p, 0, .05); caps[k].style.transform = `translateX(-50%) translate(${x * (1 - t)}vw, ${y * (1 - t)}vh)`; if (t >= .9) face = k + 1; });
    faceOf(main, face); main.style.transform = tf(0, 0, lerp(1, 1.04, seg(p, .82, 1)), (p - .5) * -6);
  },
  final(p) {
    const c = $('#finalCopy'), t = eo(seg(p, .05, .35)); c.style.opacity = t; c.style.transform = `translateY(${(1 - t) * 40}px)`;
    const m = mobile(), pt = eio(seg(p, .08, .8)); const fy = m ? 62 : innerHeight < 760 ? 72 : 52; $('#finalPhone').style.transform = tf(0, lerp(100, fy, pt), lerp(.92, 1, pt), 0);
    $('#finalGlow').style.opacity = seg(p, .15, .8);
  }
};

let ticking = false;
function render() {
  const y = scrollY;
  scenes.forEach(s => { const vis = y + innerHeight > s.top - 300 && y < s.top + s.el.offsetHeight + 300; if (!vis && s.last !== null) return; const p = clamp((y - s.top) / s.len, 0, 1); if (s.last === p && vis) return; s.last = p; H[s.name] && H[s.name](p, s); });
  $('#top').classList.toggle('scrolled', y > 24);
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { render(); ticking = false; }); } }, { passive: true });
addEventListener('resize', () => { measure(); scenes.forEach(s => s.last = null); render(); });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2 });
$$('.reveal, .data').forEach(el => io.observe(el));

applyLang(); measure(); render();
addEventListener('load', () => { measure(); scenes.forEach(s => s.last = null); render(); });
})();
