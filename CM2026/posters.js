/* ============================================================
   Poster renderers — return HTML for a 1080×1080 .poster
   v3 — design nou + render mode pentru automatizare (htmlcsstoimage)
   ============================================================ */
window.Posters = (function () {
  const WC = window.WC;
  const M = window.Motifs;
  const tn = (c) => (WC.teams[c] || {}).n || c;
  const ballImg = (px) => `<img class="ball-img" src="assets/ball2.png" alt="" width="${px}" height="${px}">`;
  const trophyImg = (cls) => `<img class="${cls}" src="assets/trophy-a.png" alt="">`;
  const kAccent = () => `<span class="ln"></span>`;

  // render mode: activ când există ?poster= în URL (htmlcsstoimage).
  // În acest mod imaginile se iau AUTOMAT din assets după codul FIFA,
  // în loc de sloturile interactive <image-slot> (drag & drop) din galerie.
  const isRender = !!(WC && WC.posterType);

  // tiny inline icons (Lucide-style, 2px)
  const ic = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>'
  };

  let _k = 0;
  const key = (skin, name) => `${skin}-${name}`;

  // editable text span
  function ed(skin, name, text, cls) {
    return `<span class="edit${cls ? ' ' + cls : ''}" contenteditable="true" data-k="${key(skin, name)}" spellcheck="false">${text}</span>`;
  }

  // circular flag slot — render mode: drapel local din assets/flags;
  // galerie: <image-slot> interactiv (drag & drop)
  function flag(skin, name, code, size, ring) {
    if (isRender) {
      return `<div class="flagdisc${ring ? ' ring' : ''}" style="width:${size}px;height:${size}px;overflow:hidden;">
        <img src="assets/flags/${code}.jpg" alt="${code}" style="width:100%;height:100%;object-fit:cover;">
      </div>`;
    }
    return `<div class="flagdisc${ring ? ' ring' : ''}" style="width:${size}px;height:${size}px">
      <span class="code" style="font-size:${Math.max(11, Math.round(size * 0.34))}px">${code}</span>
      <image-slot id="${key(skin, name)}" shape="circle" placeholder="${code}"></image-slot>
    </div>`;
  }

  function tnLogo() {
    return `<div class="tn-logo">
      <div class="tn-banner red l1"><span>TRANSILVANIA</span></div>
      <div class="tn-banner white l2"><span>NEWS</span></div>
    </div>`;
  }
  function header(skin) {
    return `<div class="p-head">
      ${tnLogo()}
      <div class="wc">
        <div class="kick">Cupa Mondială</div>
        <div class="cup">2026</div>
        <div class="host">${ed(skin, 'host', WC.host)}</div>
      </div>
    </div>`;
  }
  function footer(skin, note) {
    return `<div class="p-foot">
      <div class="handle"><span class="dot"></span><span>${ed(skin, 'handle', 'Transilvania News')}</span></div>
      <div class="note">${ed(skin, 'note', note || 'Ora României · EET')}</div>
    </div>`;
  }

  function shell(skin, tplId, label, inner, cls) {
    return `<div class="poster skin-${skin}${cls ? ' ' + cls : ''}" data-screen-label="${label}">
      <div class="poster-stadium"><div class="ps-img"></div><div class="ps-veil"></div></div>
      <div class="tn-dots tl"></div><div class="tn-dots br"></div>
      <div class="poster-pad">${inner}</div>
      <div class="tn-wm">${ed(skin, 'wm', 'www.transilvanianews.ro')}</div>
    </div>`;
  }
  const heroTrophy = () => `<div class="hero-glow"></div>${trophyImg('hero-trophy')}`;

  /* ---------------------------------------------------------- SCHEDULE */
  function schedule(skin) {
    const d = WC.schedule;
    const rows = d.matches.map((m, i) => `
      <div class="mrow">
        <div class="m-time tnum">${ed(skin, 'sch-t' + i, m.t)}</div>
        <div class="m-mid">
          <div class="m-teams">
            ${flag(skin, 'sch-fa' + i, m.a, 48)}
            <span class="nm">${ed(skin, 'sch-a' + i, tn(m.a))}</span>
            <span class="vs">–</span>
            <span class="nm">${ed(skin, 'sch-b' + i, tn(m.b))}</span>
            ${flag(skin, 'sch-fb' + i, m.b, 48)}
          </div>
          <div class="m-meta">${ic.pin}<span><b>Gr. ${ed(skin, 'sch-g' + i, m.grp)}</b> · ${ed(skin, 'sch-st' + i, m.stad)} · ${ed(skin, 'sch-ci' + i, m.city)}</span></div>
        </div>
      </div>`).join('');
    const inner = `
      ${header(skin)}
      <div class="head-block">
        <div class="p-kicker">${kAccent()}${ed(skin, 'sch-kick', d.kicker)}</div>
        <div class="p-title lg">${ed(skin, 'sch-date', d.date)}</div>
      </div>
      <div class="match-list">${rows}</div>
      ${heroTrophy()}
      ${footer(skin)}`;
    return shell(skin, 'sch', 'Program', inner, 'has-hero');
  }

  /* ---------------------------------------------------------- DUEL */
  function duel(skin) {
    const d = WC.duel;
    const playing = [d.a.code, d.b.code];
    const grows = d.group.map((r, i) => `
      <div class="grp-row${playing.includes(r.code) ? ' play' : ''}">
        <div class="g-pos"><span class="tnum">${i + 1}</span></div>
        <div class="g-name"><span>${ed(skin, 'duel-gn' + i, tn(r.code))}</span></div>
        <div class="g-pts"><span class="tnum">${ed(skin, 'duel-gp' + i, r.p)}</span></div>
      </div>`).join('');
    // render mode: ph-frame = drapel landscape (assets/flags),
    //              cap-flag (cerc mic) = foto căpitan (assets/players)
    const col = (side, t) => `
      <div class="cap-col">
        <div class="cap-photo">
          <div class="ph-frame">${isRender
            ? `<img src="assets/flags/${t.code}.jpg" alt="${t.code}" style="display:block;width:100%;height:100%;object-fit:cover;">`
            : `<image-slot id="${key(skin, 'duel-ph-' + side)}" shape="rounded" radius="24" placeholder="Steag ${t.code} (landscape)"></image-slot>`
          }</div>
          <div class="cap-flag">${isRender
            ? `<div class="flagdisc ring" style="width:88px;height:88px;overflow:hidden;"><img src="assets/players/${t.code}.jpg" alt="${t.code}" style="width:100%;height:100%;object-fit:cover;object-position:top center;"></div>`
            : flag(skin, 'duel-fl-' + side, t.code, 88, true)
          }</div>
        </div>
        <div class="cap-name">${ed(skin, 'duel-nm-' + side, tn(t.code))}</div>
      </div>`;
    const inner = `
      ${header(skin)}
      <div class="duel-top">
        <span class="pill solid stage">${ed(skin, 'duel-stage', d.stage)}</span>
      </div>
      <div class="duel-grid">
        ${col('a', d.a)}
        <div class="vs-col">
          <div class="vs-cup">${trophyImg('vs-trophy')}</div>
        <div class="duel-score">
          <span class="n tnum">${ed(skin, 'duel-sa', d.sa)}</span>
          <span class="dash">–</span>
          <span class="n tnum">${ed(skin, 'duel-sb', d.sb)}</span>
        </div>
        <span class="pill solid finpill">${ed(skin, 'duel-fin', 'Final')}</span>
        </div>
        ${col('b', d.b)}
      </div>
      <div class="grp-table">
        <div class="p-kicker grp-k">${kAccent()}${ed(skin, 'duel-grp', 'Grupa ' + d.grp)} · Clasament${kAccent()}</div>
        ${grows}
      </div>
      ${footer(skin, ed(skin, 'duel-date', d.date))}`;
    return shell(skin, 'duel', 'Meci', inner, 'is-duel');
  }

  /* ---------------------------------------------------------- RESULTS */
  function results(skin) {
    const d = WC.results;
    const rows = d.matches.map((m, i) => {
      const aw = m.sa > m.sb, bw = m.sb > m.sa;
      return `
      <div class="mrow rrow">
        <div class="r-side a">
          <span class="nm">${ed(skin, 'res-a' + i, tn(m.a))}</span>
          ${flag(skin, 'res-fa' + i, m.a, 58)}
        </div>
        <div class="r-score">
          <div class="sc tnum">
            <span class="n${aw ? ' win' : ''}">${ed(skin, 'res-sa' + i, m.sa)}</span>
            <span class="dash">–</span>
            <span class="n${bw ? ' win' : ''}">${ed(skin, 'res-sb' + i, m.sb)}</span>
          </div>
        </div>
        <div class="r-side b">
          ${flag(skin, 'res-fb' + i, m.b, 58)}
          <span class="nm">${ed(skin, 'res-b' + i, tn(m.b))}</span>
        </div>
        <div class="r-meta-wrap">
          <div class="r-note">${ed(skin, 'res-nt' + i, m.note)}</div>
          <div class="r-grp">Grupa ${ed(skin, 'res-g' + i, m.grp)}</div>
        </div>
      </div>`;
    }).join('');
    const inner = `
      ${header(skin)}
      <div class="head-block">
        <div class="p-kicker">${kAccent()}${ed(skin, 'res-kick', d.kicker)} · ${ed(skin, 'res-sub', d.sub)}</div>
        <div class="p-title lg">${ed(skin, 'res-date', d.date)}</div>
      </div>
      <div class="match-list">${rows}</div>
      ${heroTrophy()}
      ${footer(skin)}`;
    return shell(skin, 'res', 'Rezultate', inner, 'has-hero');
  }

  /* ---------------------------------------------------------- STANDINGS */
  function standings(skin) {
    const d = WC.standings;
    const rows = d.rows.map((r, i) => `
      <div class="stand-row${i < d.qual ? ' qual' : ''}">
        <div class="pos tnum">${i + 1}</div>
        <div class="team">${flag(skin, 'st-f' + i, r.code, 54)}<span class="nm">${ed(skin, 'st-n' + i, tn(r.code))}</span></div>
        <div class="st tnum">${ed(skin, 'st-j' + i, r.j)}</div>
        <div class="st tnum">${ed(skin, 'st-v' + i, r.v)}</div>
        <div class="st tnum">${ed(skin, 'st-e' + i, r.e)}</div>
        <div class="st tnum">${ed(skin, 'st-i' + i, r.i)}</div>
        <div class="gd tnum">${ed(skin, 'st-gd' + i, r.gd)}</div>
        <div class="pts tnum">${ed(skin, 'st-p' + i, r.p)}</div>
      </div>`).join('');
    const inner = `
      ${header(skin)}
      <div class="head-block">
        <div class="p-kicker">${kAccent()}${ed(skin, 'st-kick', d.kicker)}</div>
        <div class="p-title lg">${ed(skin, 'st-grp', d.group)}</div>
      </div>
      <div class="stand-wrap">
        <div class="stand-head">
          <div class="c">#</div><div class="l">Echipă</div>
          <div class="c">M</div><div class="c">V</div><div class="c">E</div><div class="c">Î</div>
          <div class="c">GD</div><div class="c">Pct</div>
        </div>
        ${rows}
      </div>
      <div class="stand-legend"><span class="sw"></span><span>Primele ${d.qual} echipe se califică în faza următoare</span></div>
      ${footer(skin)}`;
    return shell(skin, 'st', 'Clasament', inner);
  }

  /* ---------------------------------------------------------- TOP STAT */
  function topstat(skin) {
    const d = WC.topstat;
    const max = Math.max(...d.rows.map(r => r.v));
    const rows = d.rows.map((r, i) => {
      const w = 24 + (r.v / max) * 76;
      return `
      <div class="statrow${i === 0 ? ' top' : ''}">
        <div class="s-rank tnum">${i + 1}</div>
        ${flag(skin, 'ts-f' + i, r.code, 58)}
        <div class="s-bar">
          <div class="s-fill" style="width:${w}%"></div>
          <div class="s-name">${ed(skin, 'ts-n' + i, r.name)}</div>
          <div class="s-val tnum">${ed(skin, 'ts-v' + i, r.v)}</div>
        </div>
      </div>`;
    }).join('');
    const topCode = d.rows[0] ? d.rows[0].code : 'ARG';
    const inner = `
      ${header(skin)}
      <div class="head-block">
        <div class="p-kicker">${kAccent()}${ed(skin, 'ts-kick', d.kicker)}</div>
        <div class="p-title xl">${ed(skin, 'ts-title', d.title)}</div>
      </div>
      <div class="stat-body">
        <div class="stat-list">${rows}</div>
        <div class="stat-photo">
          <div class="glow"></div>
          ${isRender
            ? `<img src="assets/players/${topCode}.jpg" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:18px;">`
            : `<image-slot id="${key(skin, 'ts-photo')}" shape="rounded" radius="18" placeholder="Foto jucător (decupat / fundal transparent)"></image-slot>`
          }
        </div>
      </div>
      ${footer(skin, 'goluri marcate · faza grupelor')}`;
    return shell(skin, 'ts', 'Top', inner);
  }

  return { schedule, duel, results, standings, topstat };
})();
