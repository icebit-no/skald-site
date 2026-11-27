// Draws the hero's linocut print, concept A «Skalden i stamnen», sketch 7: a longship on a dark fjord, the skald in
// the bow, his voice rising into the northern lights and ending as a row of runes. The print is drawn for the
// size of .scene and drawn again when that changes, as layers of SVG: each moving layer is its own element, so the
// browser moves it without drawing its filters again. The page's content security policy refuses style attributes,
// so every style a layer needs is set through its style object, never written into the markup.
//
// Runs right after the hero's markup, before the rest of the page is parsed, so the print is in place when the page
// is first drawn. The runes follow the page's language (<html lang>).
(function () {
  'use strict';
  const hero = document.querySelector('.hero');
  const scene = hero && hero.querySelector('.scene');
  if (!scene) return;

  const R = n => Math.round(n * 10) / 10;
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const P = (cls, d, extra) => `<path class="${cls}" d="${d}"${extra ? ' ' + extra : ''}/>`;

  // Catmull-Rom through the given points, sampled to a polyline.
  function cr(p, seg) {
    seg = seg || 14; const o = [];
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p[i + 1];
      for (let j = 0; j < seg; j++) {
        const t = j / seg, t2 = t * t, t3 = t2 * t, c = k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
        o.push([c(0), c(1)]);
      }
    }
    o.push(p[p.length - 1].slice(0, 2)); return o;
  }
  function arc(pl) { const L = [0]; for (let i = 1; i < pl.length; i++) L.push(L[i - 1] + Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1])); return L; }
  function at(pl, L, s) {
    s = Math.max(0, Math.min(L[L.length - 1], s)); let i = 1; while (i < L.length - 1 && L[i] < s) i++;
    const a = pl[i - 1], b = pl[i], d = (L[i] - L[i - 1]) || 1, t = (s - L[i - 1]) / d;
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, tx: (b[0] - a[0]) / d, ty: (b[1] - a[1]) / d };
  }
  const line = pl => 'M' + pl.map(p => R(p[0]) + ' ' + R(p[1])).join('L');
  function taper(pts, w0, w1, seg) {
    const pl = cr(pts, seg || 10), L = arc(pl), T = L[L.length - 1], a = [], b = [];
    for (let i = 0; i < pl.length; i++) { const q = at(pl, L, L[i]), w = (w0 + (w1 - w0) * (L[i] / T)) / 2; a.push([q.x - q.ty * w, q.y + q.tx * w]); b.push([q.x + q.ty * w, q.y - q.tx * w]); }
    return line(a.concat(b.reverse())) + 'Z';
  }
  function yAtX(pl, x) { for (let i = 1; i < pl.length; i++) { const a = pl[i - 1], b = pl[i]; if (a[0] <= x && x <= b[0]) return a[1] + (b[1] - a[1]) * ((x - a[0]) / ((b[0] - a[0]) || 1)); } return null; }
  const bz = (p, t) => { const m = 1 - t; return [m * m * m * p[0][0] + 3 * m * m * t * p[1][0] + 3 * m * t * t * p[2][0] + t * t * t * p[3][0], m * m * m * p[0][1] + 3 * m * m * t * p[1][1] + 3 * m * t * t * p[2][1] + t * t * t * p[3][1]]; };
  const diamond = (x, y, d, cls) => P(cls, `M${R(x)} ${R(y - d)}L${R(x + d * .65)} ${R(y)}L${R(x)} ${R(y + d)}L${R(x - d * .65)} ${R(y)}Z`);

  // Younger Futhark, long-branch, cut as staves and diagonals in a unit box. Each stroke names its two ends:
  // f is a free end, cut square; m meets another stroke and stops flat on that stroke's centre line.
  const RUNE = {
    'ᛏ': [['fm', .5, 1, .5, 0], ['ff', .14, .36, .5, 0, .86, .36]], 'ᚢ': [['ff', .2, 1, .2, 0], ['mf', .2, .03, .8, .45, .8, 1]], 'ᛋ': [['ff', .25, 0, .25, .56], ['ff', .75, .3, .75, 1], ['mm', .25, .56, .75, .3]],
    'ᚾ': [['ff', .5, 0, .5, 1], ['ff', .2, .34, .8, .62]], 'ᛅ': [['ff', .5, 0, .5, 1], ['ff', .2, .62, .8, .34]], 'ᚴ': [['ff', .3, 1, .3, 0], ['mf', .3, .56, .8, .12]],
    'ᚱ': [['ff', .22, 1, .22, 0], ['mm', .22, .03, .76, .25, .22, .5], ['mf', .22, .5, .8, 1]], 'ᛚ': [['ff', .3, 1, .3, 0], ['mf', .3, .03, .78, .36]], 'ᛁ': [['ff', .5, 0, .5, 1]]
  };
  function rune(ch, x, y, h, cls, sw, rot) {
    if (ch === '᛫') return diamond(x, y - h / 2, h * .11, cls.replace('s-', 'f-'));
    const w = h * .52;
    const past = (a, b) => { const l = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1; return [a[0] + (a[0] - b[0]) / l * sw / 2, a[1] + (a[1] - b[1]) / l * sw / 2]; };
    let d = '';
    RUNE[ch].forEach(st => {
      const p = []; for (let i = 1; i < st.length; i += 2) p.push([(st[i] - .5) * w, (st[i + 1] - 1) * h]);
      if (st[0][0] === 'f') p[0] = past(p[0], p[1]);
      if (st[0][1] === 'f') p[p.length - 1] = past(p[p.length - 1], p[p.length - 2]);
      d += line(p);
    });
    return `<path class="${cls} bt" stroke-width="${R(sw)}" transform="translate(${R(x)} ${R(y)}) rotate(${R(rot || 0)})" d="${d}"/>`;
  }

  // A tooth on a lip curve: base on the curve, point along the normal that faces into the mouth.
  function fang(p, t, len, half, down) {
    const a = bz(p, t - .012), b = bz(p, t + .012), q = bz(p, t), d = Math.hypot(b[0] - a[0], b[1] - a[1]), tx = (b[0] - a[0]) / d, ty = (b[1] - a[1]) / d;
    let nx = -ty, ny = tx; if ((ny > 0) !== down) { nx = -nx; ny = -ny; }
    return P('f-bone', `M${R(q[0] - tx * half - nx * 3)} ${R(q[1] - ty * half - ny * 3)}L${R(q[0] + nx * len)} ${R(q[1] + ny * len)}L${R(q[0] + tx * half - nx * 3)} ${R(q[1] + ty * half - ny * 3)}Z`);
  }

  // The tagline in runes, letter by letter after the app's transliteration table: whole for the wide print,
  // its last two words for the narrow one.
  const RUNES = {
    nn: ['ᛏᚢ᛫ᛋᚾᛅᚴᚴᛅᚱ᛫ᛋᚴᛅᛚᛏᛁᚾ᛫ᛋᚴᚱᛁᚢ', 'ᛋᚴᛅᛚᛏᛁᚾ᛫ᛋᚴᚱᛁᚢ'],
    nb: ['ᛏᚢ᛫ᛋᚾᛅᚴᚴᛁᚱ᛫ᛋᚴᛅᛚᛏᛁᚾ᛫ᛋᚴᚱᛁᚢᛁᚱ', 'ᛋᚴᛅᛚᛏᛁᚾ᛫ᛋᚴᚱᛁᚢᛁᚱ']
  };

  /* ───────── Skalden i stamnen ───────── */
  // Returns the print's layers, back to front. Each layer has a class, its markup, the band of the print it covers
  // (box, for the water) and the style properties it moves with (vars).
  function sceneA(W, H, wide, lang) {
    const r = rng(41), u = wide ? W / 1280 : W / 520;
    const hor = H * (wide ? .675 : .64);
    const s = (wide ? Math.min(W * .5, H * .9) : Math.min(W * .78, H * .92)) / 100;
    const cx = wide ? W * .7 : W * .52, wl = wide ? H * .815 : H * .84;
    // Where the skald stands in the bow and how large he is cut, in the ship's units. His mouth is where the voice starts.
    const fx = -39.4, fy = -7.4, fk = wide ? .15 : .165;
    const mx = cx + (fx - 10.2 * fk) * s, my = wl + (fy - 89.4 * fk) * s;

    let sky = '';
    for (let i = 0, n = wide ? 90 : 36; i < n; i++) {
      const x = r() * W, y = r() * hor * .9, d = (1.1 + r() * r() * 3) * Math.max(.8, u);
      if (wide && x < W * .5 && y > H * .3) continue;
      sky += diamond(x, y, d, 'f-bone');
    }

    // The ribbon runs from its aurora end to its rune end; the voice climbs from the mouth and joins it.
    const glyphs = [...RUNES[lang][wide ? 0 : 1]];
    const ry = Math.max(H * .235, 82);
    const rbC = wide
      ? [[W + 40, H * .2], [W * .90, H * .24], [W * .78, H * .215], [W * .66, H * .23], [W * .55, H * .262], [W * .45, H * .245], [W * .37, H * .225], [W * .25, H * .236], [W * .12, H * .215], [W * .025, H * .226]]
      : [[W * .2, ry + H * .01], [W * .3, ry - H * .005], [W * .4, ry + H * .01], [W * .55, ry - H * .005], [W * .72, ry + H * .007], [W * .88, ry - H * .007], [W * .985, ry]];
    const dir = wide ? -1 : 1, Jx = wide ? Math.max(W * .37, W * .025 + (10 + glyphs.length * 17.5) * u) : Math.max(W * .36, W * .985 - 8 - glyphs.length * 14.5);
    // The line starts a little in front of the mouth and never touches the face, also while the ship rocks.
    const lip = [[mx - 1.25 * s, my - .2 * s], [mx - 1.9 * s, my - 2.8 * s]];
    const vC = lip.concat(wide
      ? [[mx - .4 * s, my - H * .1], [mx, H * .44], [W * .488, H * .32]].concat(rbC.slice(5))
      : [[mx - .2 * s, my - (my - ry) * .3], [mx, my - (my - ry) * .52], [mx - W * .03, my - (my - ry) * .8]].concat(rbC));
    const Rb = cr(rbC, 16), RbL = arc(Rb), V = cr(vC, 16), VL = arc(V);
    const cross = (pl, L) => { for (let i = 0; i < pl.length; i++) if (dir < 0 ? pl[i][0] <= Jx : pl[i][0] >= Jx) return L[i]; return L[L.length - 1]; };
    const sJ = cross(Rb, RbL), sJv = cross(V, VL);
    const room = VL[VL.length - 1] - sJv - 6;
    const adv = Math.min(wide ? 17.5 * u : 14.5, room / glyphs.length), hR = adv * 1.72;

    // Each aurora bar that moves carries its own timing as data-t and data-d; render() hands them to its style.
    let aur = '';
    const step = wide ? 9.6 * u : 7, peak = H * (wide ? .095 : .085), farH = H * (wide ? .075 : .06);
    for (let sx = step * .5; sx < sJ - step * .5; sx += step) {
      const q = at(Rb, RbL, sx), v = sx / sJ, f = 1 / u;
      const n1 = .5 + .5 * Math.sin(sx * .045 * f + 1.3) * Math.sin(sx * .0173 * f + .4), n2 = Math.abs(Math.sin(sx * .11 * f + Math.sin(sx * .031 * f) * 2));
      let h = ((1 - v) * farH + v * hR + peak * Math.pow(Math.sin(Math.PI * Math.min(1, v)), 1.3)) * (.30 + .45 * n1 + .25 * n2) * (.85 + .3 * r());
      const k = Math.max(0, Math.min(1, (v - .84) / .16)); h = h + (hR - h) * k * k;
      const bw = (wide ? 4.8 * u : 3.4) * (.8 + .4 * r()), yb = q.y - (16 - 11 * k * k) * u, hi = n1 > .6 && k < .5;
      let g = `<rect class="${hi ? 'f-gold2' : 'f-gold'}" x="${R(q.x - bw / 2)}" y="${R(yb - h)}" width="${R(bw)}" height="${R(h)}"/>`;
      if (k < .3 && r() < .8) { const fl = h * (.15 + .45 * r()); g += `<rect class="f-ochre" x="${R(q.x - bw * .3)}" y="${R(yb - h - 5 * u - fl)}" width="${R(bw * .6)}" height="${R(fl)}"/>`; }
      aur += k > .5 ? g : `<g class="bar" data-t="${R(2.2 + r() * 3)}s" data-d="-${R(r() * 5)}s">${g}</g>`;
    }

    let voice = '';
    { // sound wave: swells out of the mouth, settles into the ruled line under the runes
      const pts = [], T = VL[VL.length - 1], lam = (wide ? 34 : 24) * u, A = (wide ? 13 : 9) * u;
      for (let sx = 0; sx <= T; sx += 2) { const q = at(V, VL, sx), v = Math.min(1, sx / sJv), o = A * Math.sin(Math.PI * Math.pow(v, .75)) * Math.sin(2 * Math.PI * sx / lam); pts.push([q.x - q.ty * o, q.y + q.tx * o]); }
      voice += P('s-gold2', line(pts), `stroke-width="${R((wide ? 3.4 : 2.8) * u)}" stroke-linejoin="round"`);
      glyphs.forEach((_, k) => {
        const q = at(V, VL, sJv + adv * (k + .7)), ch = dir < 0 ? glyphs[glyphs.length - 1 - k] : glyphs[k];
        voice += rune(ch, q.x, q.y - 5 * u, hR, 's-gold', hR * .115);
      });
    }

    // Fjord walls
    const mk = (c, rough) => { const o = []; for (let i = 0; i < c.length - 1; i++) { const a = c[i], b = c[i + 1], n = Math.max(2, Math.round(Math.abs(b[0] - a[0]) / (20 * u))); for (let j = 0; j < n; j++) { const t = j / n; o.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + (j ? (r() - .5) * rough : 0)]); } } o.push(c[c.length - 1]); return o; };
    const poly = pl => line(pl) + `L${R(pl[pl.length - 1][0])} ${R(hor + 2)}L${R(pl[0][0])} ${R(hor + 2)}Z`;
    const leftW = mk(wide ? [[-10, H * .36], [W * .05, H * .33], [W * .10, H * .38], [W * .15, H * .36], [W * .22, H * .45], [W * .28, H * .47], [W * .35, H * .56], [W * .43, hor - 6], [W * .47, hor]]
      : [[-10, H * .40], [W * .10, H * .36], [W * .22, H * .47], [W * .34, hor - H * .06], [W * .44, hor]], 16 * u);
    const rightW = mk(wide ? [[W * .60, hor], [W * .66, hor - H * .05], [W * .72, H * .52], [W * .78, H * .44], [W * .83, H * .40], [W * .88, H * .30], [W * .93, H * .31], [W * .97, H * .22], [W + 10, H * .20]]
      : [[W * .50, hor], [W * .62, hor - H * .07], [W * .74, H * .47], [W * .86, H * .38], [W * .95, H * .41], [W + 10, H * .33]], 16 * u);
    const far = mk(wide ? [[W * .36, hor], [W * .42, hor - H * .06], [W * .47, hor - H * .035], [W * .53, hor - H * .085], [W * .58, hor - H * .05], [W * .64, hor - H * .07], [W * .70, hor]]
      : [[W * .30, hor], [W * .42, hor - H * .06], [W * .52, hor - H * .03], [W * .62, hor - H * .07], [W * .72, hor]], 10 * u);
    // Hatching on a slope; none is cut where it would run behind the skald.
    const calm = x => x > cx + (fx - 9) * s && x < cx + (fx + 8) * s + 30 * u;
    const slopes = (pl, d, p, keep) => { let o = ''; for (let i = 1; i < pl.length - 1; i++) { if (r() > p) continue; const n = 1 + (r() * 3 | 0); for (let j = 0; j < n; j++) { const len = (10 + r() * 40) * u, dx = d * (.35 + r() * .4), x0 = pl[i][0] + d * j * 7 * u; if (keep && !keep(x0)) continue; o += `M${R(x0)} ${R(pl[i][1] + (4 + j * 6) * u)}l${R(dx * len)} ${R(len)}`; } } return o; };
    let mt = P('f-seam', poly(far)) + `<clipPath id="a-cf"><path d="${poly(far)}"/></clipPath>` + P('s-bone', slopes(far, -1, .5, x => !calm(x)), `stroke-width="${R(1.8 * u)}" clip-path="url(#a-cf)"`);
    mt += P('f-iron', poly(leftW)) + `<clipPath id="a-cl"><path d="${poly(leftW)}"/></clipPath>` + P('s-seam', slopes(leftW, 1, .7), `stroke-width="${R(2.4 * u)}" clip-path="url(#a-cl)"`);
    mt += P('f-iron', poly(rightW)) + `<clipPath id="a-cr"><path d="${poly(rightW)}"/></clipPath>` + P('s-seam', slopes(rightW, -1, .5), `stroke-width="${R(2.4 * u)}" clip-path="url(#a-cr)"`) + P('s-bone', slopes(rightW, -1, .6), `stroke-width="${R(2.4 * u)}" clip-path="url(#a-cr)"`);

    // Water: long quiet strokes in four bands from the horizon to the near edge, two sets of rows in each that sway
    // against each other. The sway grows towards the viewer. The ship mirrors at 0.4 of its height.
    const BAND = [.22, .48, .74];
    const sets = Array.from({ length: 8 }, () => ({ body: '', y0: Infinity, y1: -Infinity }));
    const rows = [0, 0, 0, 0];
    const dash = (cls, x, y, len, th) => `<rect class="${cls}" x="${R(x)}" y="${R(y)}" width="${R(len)}" height="${R(th)}"/>`;
    for (let y = hor + 6 * u; y < H + 4;) {
      const d = (y - hor) / (H - hor), th = (1.5 + d * 1.5) * Math.max(.8, u), dy = y - wl, hu = dy / (.4 * s); let x = -30 + r() * 40, o = '';
      const beyond = dy <= 2 * u; // this row lies on the far side of the ship
      while (x < W + 30) {
        const len = (16 + d * 58) * (.6 + .8 * r()) * u, xm = x + len / 2, pr = r(), ux = (xm - cx) / s; let cls = null;
        const mL = yAtX(leftW, xm), mR = yAtX(rightW, xm), inCopy = wide && x < W * .48;
        const refl = m => m !== null && (y - hor) < (hor - m) * .5;
        // Seen between the sail and the rail: kept dark, so nothing glints behind the crew and the skald.
        const through = beyond && x + len > cx - 53 * s && x < cx + 56 * s;
        if (!beyond && hu < 9 && Math.abs(ux) < 45 - hu) cls = pr < .7 ? 'f-bone' : null;
        else if (dy > 0 && hu >= 9 && hu < 60 && ux > -27 && ux < 31) cls = null;
        else if (refl(mL) || refl(mR)) cls = pr < .72 ? 'f-iron' : null;
        else if (inCopy || through) cls = pr < .14 ? 'f-seam' : null;
        else { const col = Math.pow(.5 + .5 * Math.sin(xm * .011 / u + 1.2), 2); cls = pr < .3 * col ? 'f-gold' : pr > .94 ? 'f-bone' : null; }
        if (cls) o += dash(cls, x, y, len, th);
        x += len + 10 * u + r() * len;
      }
      if (dy > 0 && ((hu >= 9 && hu < 19) || (hu >= 52 && hu < 57)) && r() < .75) o += dash('f-bone', cx + (1.4 + (r() - .5) * hu * .05) * s, y, 1.9 * s, th);
      if (dy > 0 && hu >= 19 && hu < 52) for (let k = 0; k < 11; k++) { if (r() > .8 - (hu - 19) * .012) continue; const w = 4 * s * (.75 + .3 * r()); o += dash(k % 2 ? 'f-bone' : 'f-ochre', cx + (-20 + k * 4 + (r() - .5) * hu * .05) * s, y, w, th); }
      const b = d < BAND[0] ? 0 : d < BAND[1] ? 1 : d < BAND[2] ? 2 : 3, set = sets[b * 2 + rows[b]++ % 2];
      set.body += o; set.y0 = Math.min(set.y0, y - 1); set.y1 = Math.max(set.y1, y + th + 1);
      y += (6 + d * 8) * Math.max(.8, u);
    }
    const water = sets.map((w, i) => {
      const b = i >> 1, odd = i & 1, amp = [2.5, 5, 8.5, 13][b] * Math.max(.75, u), t = [5, 6.2, 7.6, 9.2][b] * (odd ? 1.23 : 1);
      return { cls: 'wt' + (odd ? ' rev' : ''), box: [w.y0, w.y1], vars: { '--amp': `${R(amp)}px`, '--t': `${R(t)}s`, '--d': `-${R(b * 1.7 + odd * 2.9)}s` }, body: w.body };
    }).filter(l => l.body);

    // Longship, in units of a hundredth of its length (about 24 cm), waterline at y = 0. The shields are to that
    // scale. The people are cut larger, as they are on the picture stones, and the skald largest.
    const sheer = x => { const t = (x + 38) / 76; return (1 - t) * (1 - t) * -8.8 + 2 * t * (1 - t) * -2.4 + t * t * -8.8; };
    let sh = P('s-bone bt', 'M2.3 -57L-50.6 -28.5M2.3 -57L52.9 -27.4M2.3 -57L-7 -7.5M2.3 -57L11.5 -7.5M27 -52L41 -10M24 -18L33 -9M-20.6 -18L-28 -9', 'stroke-width=".24"');
    { // The skald, in profile and facing forward: tunic and belt, a cloak pinned at the shoulder, one hand lifted
      // with the verse. Drawn a hundred units tall with his feet at the origin, then set in the bow.
      let k = P('f-bone', 'M1 -42L10 -42L9 -6L10 0L-3 0L-2 -3L2 -6Z') + P('f-bone cas', 'M-9 -42L0 -42L-1 -6L0 0L-14 0L-13 -3L-8 -6Z', 'stroke-width="1.6"');
      k += P('f-ochre cas', 'M-6 -85C2 -88 9 -86 12 -80C20 -62 25 -40 30 -19L11 -15C11 -38 9 -58 3 -74C0 -78 -4 -80 -6 -85Z', 'stroke-width="1.6"');
      k += P('f-bone cas', 'M-10 -81C-13 -70 -12 -61 -10 -57L-14 -36L13 -34L9 -57C10 -66 9 -76 6 -83Z', 'stroke-width="1.4"');
      k += P('s-soot bt', 'M-10 -57L9 -56.6', 'stroke-width="1.7"') + P('s-ochre bt', 'M-13.3 -38.6L12.4 -36.6', 'stroke-width="2.2"') + P('s-soot', 'M-4 -54L-6 -41M2 -54L3 -40M-3 -78L-4 -60', 'stroke-width=".9"');
      k += `<circle class="f-gold" cx="-6" cy="-56.8" r="1.7"/>`;
      k += P('f-ochre cas', 'M-2 -84L6 -85.5L12 -80C17 -68 20 -56 22 -44L8 -38C8 -52 5 -68 -2 -84Z', 'stroke-width="1.4"') + P('s-soot', 'M11 -74C15 -62 17.5 -52 18.5 -44M14 -40C18 -34 22.5 -28 26 -21M19 -46C22 -38 24.5 -30 27.5 -22', 'stroke-width=".9"');
      k += `<rect class="f-bone" x="-5.4" y="-87" width="6.4" height="7"/>`;
      k += P('f-bone', 'M-4 -100.6C3 -102 7.6 -97 6.6 -90C6 -86 4 -83.5 2 -82.5L-1 -86Z') + `<circle class="f-bone" cx="-2.5" cy="-92.5" r="7.6"/>` + P('f-bone', 'M-9.6 -95L-12.6 -92.8L-9.4 -91.6Z') + P('f-bone', 'M-9.2 -91L-13.8 -80L-1 -85.4Z');
      k += P('f-soot', 'M-10.2 -90.3L-6.2 -89.4L-9.8 -87.9Z') + `<circle class="f-soot" cx="-6.3" cy="-94.3" r=".9"/>` + P('s-soot', 'M-1 -99.6C3 -97 5 -92 4.2 -86', 'stroke-width=".8"');
      k += `<circle class="f-gold cas" stroke-width="1.6" cx="0" cy="-82" r="2.4"/>`;
      { // Lifted arm: the sleeve ends in a trimmed cuff, then a bare wrist and an open hand, thumb up and four
        // fingers fanned. The hand is laid out along the forearm (t) and across it (w), then turned into place.
        const ax = -.966, ay = -.259, w0 = [-26.5, -78.5], hs = 1.55;
        const hand = [[-.4, -1.15], [2.2, -1.9], [5.4, -2.4], [9, -4], [9.5, -2.95], [5.9, -1.35], [10.7, -1.9], [10.9, -.7], [6, -.3], [11.4, -.35], [11.4, .85], [6, .75], [10.6, 1.5], [10.3, 2.65], [5.5, 1.9], [4.6, 2.2], [5.6, 5.6], [4.5, 6], [2.6, 2.6], [1.8, 1.9], [-.4, 1.15]]
          .map(([t, w]) => [w0[0] + (ax * t - ay * w) * hs, w0[1] + (ay * t + ax * w) * hs]);
        k += P('f-bone cas', taper([[-4, -80], [-15, -76], [-26.5, -78.5]], 6.8, 5.6, 6), 'stroke-width="1.6"');
        k += P('f-bone cas', line(hand) + 'Z', 'stroke-width="1.3"') + P('s-ochre bt', 'M-24.6 -81L-26.1 -75.4', 'stroke-width="1.7"');
      }
      sh += `<g transform="translate(${fx} ${fy}) scale(${fk})">${k}</g>`;
    }
    // A man in profile, facing +x, drawn from the waist: tunic, beard, eye and mouth, and on his head a helmet with a
    // nose guard, a cap or only his hair. Seated, the origin is where he meets the rail. Standing, he gets a skirt
    // and legs below it and readies a spear, an axe or a sword.
    const INK = ['f-ochre', 'f-bone', 'f-gold'];
    // ink picks his tunic and hair from the three colours; head is 0 for a helmet, 1 for bare hair, 2 for a cap.
    const man = (ink, head, pose) => {
      const tun = INK[ink], hair = INK[(ink + 2) % 3];
      const limb = (pts, w0, w1) => P(tun + ' cas', taper(pts, w0, w1, 5), 'stroke-width=".3"');
      const fist = (x, y) => `<circle class="f-bone cas" stroke-width=".24" cx="${x}" cy="${y}" r=".44"/>`;
      let o = '';
      if (pose !== 'sit') {
        o += P('f-bone cas', 'M-1.05 3.6L-.1 3.6L-.2 7L.5 7.4L-1.2 7.4Z', 'stroke-width=".26"') + P('f-bone cas', 'M.1 3.6L1.05 3.6L1 7L1.7 7.4L0 7.4Z', 'stroke-width=".26"');
        o += P(tun + ' cas', 'M-1.25 1.2L-1.6 3.9L1.55 3.9L1.2 1.2Z', 'stroke-width=".3"') + P('s-soot bt', 'M-1.52 3.3L1.48 3.3', 'stroke-width=".14"');
      }
      o += P(tun + ' cas', 'M-1.25 2L-1.35 -1.9Q-1.3 -3.25 -.25 -3.4L.55 -3.4Q1.3 -3.2 1.3 -2.1L1.2 2Z', 'stroke-width=".3"');
      o += P('s-soot', 'M-.2 -1.4L-.1 1', 'stroke-width=".13"');
      if (pose !== 'sit') o += P('s-soot bt', 'M-1.28 1.35L1.22 1.35', 'stroke-width=".22"') + `<circle class="f-gold" cx=".9" cy="1.35" r=".2"/>`;
      o += `<rect class="f-bone" x="-.25" y="-4.1" width=".95" height="1"/>`;
      o += P(hair, 'M-.75 -4.9L-.9 -3.55L-.2 -3.45L-.1 -4.6Z');
      o += `<circle class="f-bone cas" stroke-width=".3" cx=".35" cy="-4.75" r="1"/>` + P('f-bone', 'M1.2 -5.1L1.78 -4.52L1.2 -4.35Z');
      o += P(hair, 'M-.25 -4.5L1.3 -4.32L1.4 -3.7L.9 -2.95L.15 -3.2L-.35 -3.85Z');
      o += P('s-soot bt', 'M.72 -4.1L1.32 -4.05', 'stroke-width=".17"') + `<circle class="f-soot" cx=".86" cy="-4.98" r=".16"/>`;
      if (head === 0) o += P('f-gold cas', 'M-.78 -5L-.78 -5.2C-.7 -6.05 0 -6.3 .4 -6.3C1 -6.25 1.42 -5.8 1.46 -5.1Z', 'stroke-width=".26"') + P('f-gold', 'M1.16 -5.15L1.5 -5.15L1.52 -4.4L1.28 -4.4Z') + P('s-soot bt', 'M-.78 -5.2L1.44 -5.32M.36 -6.25L.36 -5.3', 'stroke-width=".13"');
      else if (head === 1) o += P(hair, 'M1.1 -5.62C.5 -6 -.78 -5.85 -.78 -4.75L-.2 -4.6C.1 -5.2 .6 -5.42 1.1 -5.62Z');
      else o += P(tun === 'f-bone' ? 'f-ochre cas' : 'f-bone cas', 'M-.8 -4.95C-.85 -5.9 -.2 -6.45 .7 -6.2L1.4 -5.25Z', 'stroke-width=".26"');
      if (pose === 'sit') o += limb([[.15, -2.75], [.8, -1.45], [1.6, -.75]], 1, .78) + fist(1.8, -.6);
      if (pose === 'spear') {
        o += P('f-bone cas', taper([[2.1, 6.5], [2.45, -9.3]], .32, .26, 2), 'stroke-width=".22"') + P('f-bone cas', 'M2.45 -9L1.9 -10.2L2.5 -12.4L3.02 -10.2Z', 'stroke-width=".22"');
        o += limb([[.15, -2.75], [1.3, -2.3], [2.15, -1.75]], 1, .78) + fist(2.3, -1.65);
      }
      if (pose === 'axe') {
        o += limb([[.5, -1.7], [1.3, -1.1], [1.85, -.75]], .9, .72);
        o += P('f-bone cas', taper([[1.75, 2.6], [2.35, -5.3]], .32, .28, 2), 'stroke-width=".22"') + P('f-bone cas', 'M2.2 -5.5L2.45 -4.25L3.2 -4.1L3.95 -3.2L4.2 -6L3.2 -5.4Z', 'stroke-width=".22"');
        o += fist(1.95, -.6) + limb([[.15, -2.75], [1.2, -2.55], [2.05, -2.25]], 1, .78) + fist(2.2, -2.15);
      }
      if (pose === 'sword') {
        o += P('f-bone cas', taper([[2.34, -5.28], [4.07, -10.4]], .86, .2, 2), 'stroke-width=".22"');
        o += P('s-gold bt', 'M1.58 -5.54L3.1 -5.02', 'stroke-width=".4"') + `<circle class="f-gold" cx="1.98" cy="-4.18" r=".34"/>`;
        o += limb([[.15, -2.9], [1.3, -3.6], [2.1, -4.65]], 1, .78) + fist(2.2, -4.82);
      }
      return o;
    };
    // The oars are in and she sails. Most of the crew sit behind the shields; three are on their feet with weapons.
    // dir -1 looks the way she sails, towards the bow.
    const CREW = [[-28, 'spear', -1, 0, 0], [-21.6, 'sit', -1, 1, 2], [-15.8, 'sit', 1, 2, 1], [-10, 'sit', -1, 0, 0], [-4.2, 'sit', -1, 1, 2], [7, 'sit', -1, 2, 1], [12.8, 'axe', -1, 1, 1], [18.6, 'sit', 1, 0, 0], [24.6, 'sit', -1, 2, 2], [32, 'sword', -1, 0, 0]];
    CREW.forEach(([x, pose, dir, ink, head]) => { sh += `<g transform="translate(${x} ${R(sheer(x) - (pose === 'sit' ? 1 : 5.9))}) scale(${dir} 1)">${man(ink, head, pose)}</g>`; });
    sh += `<g transform="translate(42 -11.1) scale(-1 1)">${man(1, 1, 'sit')}</g>`;
    sh += P('f-bone', 'M1.5 -6L1.8 -57L2.9 -57L3.2 -6Z');
    const sail = 'M-20 -51.4L24.4 -51.4C27 -40 27 -29 24 -18Q2 -23.5 -20.6 -18C-23.8 -29 -23.4 -40 -20 -51.4Z';
    sh += `<clipPath id="a-sail"><path d="${sail}"/></clipPath>` + P('f-bone', sail) + '<g clip-path="url(#a-sail)">';
    for (let x = -24; x < 28; x += 8) { const b = (x - 2) * .07; sh += P('f-ochre', `M${x} -53Q${R(x + b)} -35 ${x} -16L${x + 4} -16Q${R(x + 4 + b)} -35 ${x + 4} -53Z`); }
    sh += P('s-soot', 'M-23 -40Q2 -43.5 27 -40M-23.4 -29Q2 -33 26.6 -29', 'stroke-width=".28"') + '</g>';
    sh += P('f-bone', 'M-22.5 -52.7L27 -52.7L27 -51.2L-22.5 -51.2Z') + P('f-gold', 'M2.4 -57L2.4 -60L-3.2 -58.7Z');
    const hullD = 'M-41 0C-47 -5 -51.8 -14 -52.3 -27L-49.1 -27.6C-48.8 -18 -45 -11.2 -38 -8.8Q0 -2.4 38 -8.8C44.5 -9.9 50 -15.5 51.5 -27.6L54.6 -27C53.6 -13.5 48 -4.5 41 0Z';
    sh += P('f-bone', hullD) + `<clipPath id="a-hull"><path d="${hullD}"/></clipPath><g clip-path="url(#a-hull)">`;
    for (let i = 1; i <= 4; i++) { const yE = -8.8 + i * 1.75, xE = 38 + i * .8, c = 2 * (-5.6 + i * 1.12) - yE; sh += P('s-soot', `M${R(-51.2 + i * .5)} ${R(-26 + i * 4.4)}C${R(-50 + i * .5)} ${R(-17 + i * 3)} ${R(-45.5 + i * .6)} ${R(yE - 2.4)} ${-xE} ${R(yE)}Q0 ${R(c)} ${xE} ${R(yE)}C${R(45.8 - i * .6)} ${R(yE - 1.3)} ${R(51.4 - i * .5)} ${R(-15 + i * 3)} ${R(53.2 - i * .5)} ${R(-26 + i * 4.4)}`, 'stroke-width=".3"'); }
    sh += '</g>';
    { let w = 'M-46 3L-46 .5q1.5 -1.4 3 0'; for (let i = 0; i < 29; i++) w += 't3 0'; sh += P('f-soot', w + 'L44 3Z'); }
    let i = 0; for (let x = 35; x >= -33.5; x -= 3.7, i++) { const y = sheer(x) + 1.2; sh += `<circle class="${i % 2 ? 'f-gold' : 'f-ochre'} cas" stroke-width=".6" cx="${R(x)}" cy="${R(y)}" r="2"/><circle class="s-soot" stroke-width=".18" cx="${R(x)}" cy="${R(y)}" r="1.25"/><circle class="f-bone" cx="${R(x)}" cy="${R(y)}" r=".45"/>`; }
    { // Dragon head on the stem: long jaws, teeth, eye, lappets. Drawn large and set on the stem facing forward.
      let h = '';
      const lap = [
        taper([[285, 134], [246, 106], [200, 92], [160, 106], [148, 138], [166, 160], [188, 150], [184, 134]], 30, 6),
        taper([[222, 196], [184, 190], [152, 208], [144, 240], [160, 260], [182, 252], [182, 236]], 22, 5),
        taper([[332, 114], [324, 86], [302, 66], [276, 64], [264, 80], [276, 92]], 26, 5),
        taper([[536, 128], [558, 112], [560, 88], [542, 74], [524, 84], [530, 98]], 20, 5),
        taper([[497, 262], [516, 278], [514, 300], [496, 308], [484, 296], [491, 286]], 17, 5)];
      lap.forEach(d => h += P('f-bone', d));
      h += P('f-bone', 'M170 348L170 330C173 275 195 215 240 165C268 134 305 108 350 100C385 94 415 100 440 112C470 120 505 126 540 122C552 122 558 132 552 142C520 150 450 168 372 196C420 205 465 222 500 246C515 256 512 268 500 270C455 262 400 258 345 268C315 272 294 292 286 330L286 348Z');
      const up = [[552, 142], [520, 150], [450, 168], [372, 196]], lo = [[372, 196], [420, 205], [465, 222], [500, 246]];
      [[.12, 34], [.3, 27], [.48, 21], [.66, 15]].forEach(([t, l]) => h += fang(up, t, l, 11, true));
      [[.5, 15], [.7, 21], [.9, 29]].forEach(([t, l]) => h += fang(lo, t, l, 10, false));
      h += P('f-soot', 'M362 142C378 114 416 114 438 146C414 162 382 164 362 142Z') + `<circle class="f-gold" cx="398" cy="139" r="12"/>`;
      h += P('s-soot', 'M344 122C376 98 426 98 456 130M176 300Q232 332 289 318', 'stroke-width="8"');
      sh += `<g transform="translate(-50.7 -27.3) scale(-.028 .028) translate(-228 -330)">${h}</g>`;
    }
    sh += P('f-bone', taper([[53, -26.5], [54.2, -31], [52.6, -34.8], [49.4, -35.4], [47.7, -33], [49.3, -31.4]], 2.9, .7, 8));
    sh += P('s-bone', 'M-47 1.4h-5M-45 2.9h-8M47 1.5h5', 'stroke-width=".32"');

    return [
      { cls: 'sky', body: `<g filter="url(#lino-s)">${sky}</g>` },
      { cls: 'aur', body: aur },
      { cls: 'mt', body: `<g filter="url(#lino)">${mt}</g>` }
    ].concat(water, [
      { cls: 'voice', body: `<g filter="url(#lino-s)">${voice}</g>` },
      { cls: 'ship', vars: { 'transform-origin': `${R(cx)}px ${R(wl)}px` }, body: `<g filter="url(#lino-s)"><g transform="translate(${R(cx)} ${R(wl)}) scale(${R(s * 100) / 100})">${sh}</g></g>` }
    ]);
  }

  const SVG = 'http://www.w3.org/2000/svg';
  const lang = document.documentElement.lang === 'nb' ? 'nb' : 'nn';
  let drawnW = 0, drawnH = 0;

  function render() {
    const W = scene.clientWidth, H = scene.clientHeight; if (!W || !H) return;
    if (drawnW === W && drawnH === H) return; drawnW = W; drawnH = H;
    const wide = hero.parentNode.clientWidth >= 760;
    const layers = document.createDocumentFragment();
    sceneA(W, H, wide, lang).forEach(l => {
      const y0 = l.box ? R(l.box[0]) : 0, h = l.box ? R(l.box[1] - l.box[0]) : H;
      const svg = document.createElementNS(SVG, 'svg');
      svg.setAttribute('class', 'lyr ' + l.cls);
      svg.setAttribute('viewBox', `0 ${y0} ${W} ${h}`);
      svg.setAttribute('aria-hidden', 'true');
      svg.style.top = `${y0}px`;
      svg.style.height = `${h}px`;
      Object.entries(l.vars || {}).forEach(([name, value]) => svg.style.setProperty(name, value));
      svg.innerHTML = l.body;
      svg.querySelectorAll('.bar').forEach(g => {
        g.style.setProperty('--t', g.dataset.t);
        g.style.setProperty('--d', g.dataset.d);
      });
      layers.appendChild(svg);
    });
    scene.replaceChildren(layers);
  }

  render();
  if ('ResizeObserver' in window) {
    let raf = 0; new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); }).observe(scene);
  }
})();
