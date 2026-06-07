/* ============================================================
   Gallery builder + scaling + lightbox + editable persistence
   v2 — render mode pentru automatizare (htmlcsstoimage)
   ============================================================ */
(function () {
  const SECTIONS = [
    { id: 'sch',  title: 'Programul de mâine',          tag: 'Seară',
      desc: 'Postarea de seară — meciurile de a doua zi: echipe, oră, stadion, grupă.', fn: 'schedule' },
    { id: 'duel', title: 'Meciul zilei',                tag: 'Anunț',
      desc: 'Anunț pentru un meci-vedetă, cu fotografiile căpitanilor.', fn: 'duel' },
    { id: 'res',  title: 'Rezultate — ziua precedentă', tag: 'Dimineață',
      desc: 'Scorurile finale + marcatorii din ziua precedentă.', fn: 'results' },
    { id: 'st',   title: 'Clasament grupă',             tag: 'Update',
      desc: 'Clasamentul live al unei grupe, cu echipele calificate evidențiate.', fn: 'standings' },
    { id: 'ts',   title: 'Top statistic',               tag: 'Recurent',
      desc: 'Topuri (golgheteri, viteză…) cu fotografia jucătorului.', fn: 'topstat' }
  ];
  const SKINS = [
    { id: 'rosu',    name: 'Roșu Transilvania' },
    { id: 'dark',    name: 'Dark elegant' },
    { id: 'stadion', name: 'Stadion foto' }
  ];

  /* ============================================================
     RENDER MODE — activ când există ?poster= în URL
     Afișează DOAR posterul cerut la 1080×1080, fără UI.
     Folosit de htmlcsstoimage pentru screenshot automat.
     ============================================================ */
  const posterType = (window.WC && window.WC.posterType) || null;

  // mapare poster param → fn din Posters
  const POSTER_MAP = {
    results:  'results',
    duel:     'duel',
    schedule: 'schedule',
    standings:'standings',
    topstat:  'topstat'
  };

  if (posterType && POSTER_MAP[posterType]) {
    // ascunde tot UI-ul
    document.querySelector('.topbar') && (document.querySelector('.topbar').style.display = 'none');
    document.querySelector('.wrap')   && (document.querySelector('.wrap').style.display   = 'none');

    // skin din URL (?skin=rosu|dark|stadion), default rosu
    const p    = new URLSearchParams(window.location.search);
    const skin = p.get('skin') || 'rosu';

    // generează HTML-ul posterului
    const fn   = POSTER_MAP[posterType];
    const html = window.Posters[fn](skin);

    // injectează direct în body la 1080×1080
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:1080px;height:1080px;overflow:hidden;position:relative;';
    wrapper.innerHTML = html.trim();

    // asigură că posterul nu e scalat
    const poster = wrapper.firstElementChild;
    if (poster) {
      poster.style.transform = 'none';
      poster.style.position  = 'relative';
    }

    document.body.style.cssText = 'margin:0;padding:0;background:#141519;';
    document.body.appendChild(wrapper);

    // gata — htmlcsstoimage face screenshot la 1080×1080
    return;
  }

  /* ============================================================
     GALLERY MODE — modul normal, vizualizare kit complet
     ============================================================ */
  const STAGE_W = 452;
  const SCALE   = STAGE_W / 1080;
  const root    = document.getElementById('gallery');

  function makeStage(posterHTML, scale) {
    const stage = document.createElement('div');
    stage.className = 'stage';
    stage.style.width  = (1080 * scale) + 'px';
    stage.style.height = (1080 * scale) + 'px';
    const tmp = document.createElement('div');
    tmp.innerHTML = posterHTML.trim();
    const poster = tmp.firstElementChild;
    poster.style.transformOrigin = 'top left';
    poster.style.transform = 'scale(' + scale + ')';
    stage.appendChild(poster);
    stage._poster = poster;
    stage._scale  = scale;
    return stage;
  }

  SECTIONS.forEach((sec) => {
    const block = document.createElement('section');
    block.className = 'sec';
    block.innerHTML = `
      <div class="sec-head">
        <div class="sec-tag">${sec.tag}</div>
        <h2>${sec.title}</h2>
        <p>${sec.desc}</p>
      </div>
      <div class="cards"></div>`;
    const cards = block.querySelector('.cards');

    SKINS.forEach((sk) => {
      const card  = document.createElement('div');
      card.className = 'card';
      const html  = window.Posters[sec.fn](sk.id);
      const stage = makeStage(html, SCALE);

      const head  = document.createElement('div');
      head.className = 'card-head';
      head.innerHTML = `<span class="card-name">${sk.name}</span>
        <button class="card-open" type="button">Editează / mărește</button>`;

      const frame = document.createElement('div');
      frame.className = 'card-frame';
      frame.appendChild(stage);

      head.querySelector('.card-open').addEventListener('click', () => openLightbox(stage, sec, sk));
      frame.addEventListener('click', (e) => {
        if (e.target.closest('image-slot') || e.target.closest('.edit')) return;
        openLightbox(stage, sec, sk);
      });

      card.appendChild(head);
      card.appendChild(frame);
      cards.appendChild(card);
    });

    root.appendChild(block);
  });

  /* ---------------- Lightbox ---------------- */
  const lb      = document.getElementById('lightbox');
  const lbStage = document.getElementById('lb-stage');
  const lbTitle = document.getElementById('lb-title');
  let current   = null;

  function fitScale() {
    const w = window.innerWidth  - 80;
    const h = window.innerHeight - 150;
    return Math.min(w / 1080, h / 1080, 1);
  }

  function openLightbox(stage, sec, sk) {
    const poster = stage._poster;
    current = { stage, parent: stage };
    const s = fitScale();
    lbStage.style.width  = (1080 * s) + 'px';
    lbStage.style.height = (1080 * s) + 'px';
    poster.style.transform = 'scale(' + s + ')';
    lbStage.appendChild(poster);
    lbTitle.textContent = sec.title + '  ·  ' + sk.name;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!current) return;
    const poster = lbStage.firstElementChild;
    poster.style.transform = 'scale(' + current.stage._scale + ')';
    current.stage.appendChild(poster);
    lb.classList.remove('open');
    document.body.style.overflow = '';
    current = null;
  }

  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  window.addEventListener('resize', () => {
    if (!current) return;
    const poster = lbStage.firstElementChild;
    const s = fitScale();
    lbStage.style.width  = (1080 * s) + 'px';
    lbStage.style.height = (1080 * s) + 'px';
    poster.style.transform = 'scale(' + s + ')';
  });

  /* ---------------- Editable text persistence ---------------- */
  const LS = 'tn26:';
  document.querySelectorAll('[data-k]').forEach((el) => {
    const v = localStorage.getItem(LS + el.dataset.k);
    if (v !== null) el.textContent = v;
  });
  document.addEventListener('input', (e) => {
    const el = e.target.closest && e.target.closest('[data-k]');
    if (!el) return;
    localStorage.setItem(LS + el.dataset.k, el.textContent);
  });
  document.addEventListener('keydown', (e) => {
    const el = e.target.closest && e.target.closest('[data-k]');
    if (el && e.key === 'Enter') { e.preventDefault(); el.blur(); }
  });
})();
