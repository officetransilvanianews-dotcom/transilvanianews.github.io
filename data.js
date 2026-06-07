/* ============================================================
   Tournament data — Cupa Mondială 2026 (USA · Canada · Mexico)
   v2 — URL-param driven pentru automatizare Make + htmlcsstoimage

   Parametri URL acceptați:

   RESULTS (poster rezultate):
     ?poster=results
     &res_date=Miercuri%2C+17+iunie
     &r0a=BRA&r0sa=3&r0b=MAR&r0sb=1&r0note=Vinícius+x2+·+Rodrygo&r0grp=C
     &r1a=ESP&r1sa=2&r1b=KSA&r1sb=0&r1note=Yamal+·+Pedri&r1grp=H
     (până la 4 meciuri: r0..r3)

   DUEL (poster meci zilei):
     ?poster=duel
     &da=ARG&da_cap=L.+Messi
     &db=FRA&db_cap=K.+Mbappé
     &d_date=Duminică%2C+21+iunie
     &d_time=22%3A00
     &d_stad=MetLife+Stadium
     &d_city=New+York+%2F+New+Jersey
     &d_stage=Optimi+de+finală

   SCHEDULE (program ziua):
     ?poster=schedule
     &sch_date=Joi%2C+18+iunie
     &s0a=ESP&s0b=URU&s0t=19%3A00&s0stad=Estadio+Azteca&s0city=Ciudad+de+México&s0grp=H
     (până la 4 meciuri: s0..s3)
   ============================================================ */

window.WC = (function () {

  /* ---- utilitare URL params ---- */
  const p = new URLSearchParams(window.location.search);
  const get = (key, fallback) => p.has(key) ? decodeURIComponent(p.get(key)) : fallback;
  const getInt = (key, fallback) => p.has(key) ? parseInt(p.get(key), 10) : fallback;

  /* ---- echipe ---- */
  const T = {
    MEX:{n:"Mexic"},      RSA:{n:"Africa de Sud"}, KOR:{n:"Coreea de Sud"},
    CAN:{n:"Canada"},     QAT:{n:"Qatar"},         SUI:{n:"Elveția"},
    BRA:{n:"Brazilia"},   MAR:{n:"Maroc"},         HAI:{n:"Haiti"},
    SCO:{n:"Scoția"},     USA:{n:"S.U.A."},        PAR:{n:"Paraguay"},
    AUS:{n:"Australia"},  GER:{n:"Germania"},      CUW:{n:"Curaçao"},
    CIV:{n:"Coasta de Fildeș"}, ECU:{n:"Ecuador"}, NED:{n:"Olanda"},
    JPN:{n:"Japonia"},    TUN:{n:"Tunisia"},       BEL:{n:"Belgia"},
    EGY:{n:"Egipt"},      IRN:{n:"Iran"},          NZL:{n:"Noua Zeelandă"},
    ESP:{n:"Spania"},     CPV:{n:"Capul Verde"},   KSA:{n:"Arabia Saudită"},
    URU:{n:"Uruguay"},    FRA:{n:"Franța"},        SEN:{n:"Senegal"},
    NOR:{n:"Norvegia"},   ARG:{n:"Argentina"},     ALG:{n:"Algeria"},
    AUT:{n:"Austria"},    JOR:{n:"Iordania"},      POR:{n:"Portugalia"},
    UZB:{n:"Uzbekistan"}, COL:{n:"Columbia"},      ENG:{n:"Anglia"},
    CRO:{n:"Croația"},    GHA:{n:"Ghana"},         PAN:{n:"Panama"}
  };

  const STAD = {
    NYC:"MetLife Stadium",   DAL:"AT&T Stadium",     LA:"SoFi Stadium",
    ATL:"Mercedes-Benz Stadium", MIA:"Hard Rock Stadium", SEA:"Lumen Field",
    SF:"Levi's Stadium",     HOU:"NRG Stadium",      PHI:"Lincoln Financial Field",
    KC:"Arrowhead Stadium",  BOS:"Gillette Stadium", TOR:"BMO Field",
    VAN:"BC Place",          MEX:"Estadio Azteca",   GDL:"Estadio Akron",
    MTY:"Estadio BBVA"
  };

  /* ---- detectează tipul de poster din URL ---- */
  const posterType = get('poster', null);

  /* ============================================================
     RESULTS — date din URL sau fallback demo
     ============================================================ */
  function buildResults() {
    const defaultMatches = [
      {a:"BRA", sa:3, b:"MAR", sb:1, grp:"C", note:"Vinícius x2 · Rodrygo"},
      {a:"ESP", sa:2, b:"KSA", sb:0, grp:"H", note:"Yamal · Pedri"},
      {a:"GER", sa:1, b:"ECU", sb:1, grp:"E", note:"Wirtz · Valencia"},
      {a:"POR", sa:4, b:"UZB", sb:0, grp:"K", note:"Ronaldo x2 · B. Fernandes · Leão"}
    ];

    // Construiește meciurile din URL params dacă există
    const urlMatches = [];
    for (let i = 0; i <= 3; i++) {
      if (p.has(`r${i}a`)) {
        urlMatches.push({
          a:    get(`r${i}a`,    'TBD'),
          sa:   getInt(`r${i}sa`, 0),
          b:    get(`r${i}b`,    'TBD'),
          sb:   getInt(`r${i}sb`, 0),
          grp:  get(`r${i}grp`,  '—'),
          note: get(`r${i}note`, '')
        });
      }
    }

    return {
      kicker: "Rezultate",
      sub:    "Ziua precedentă",
      date:   get('res_date', 'Miercuri, 17 iunie'),
      matches: urlMatches.length > 0 ? urlMatches : defaultMatches
    };
  }

  /* ============================================================
     DUEL — date din URL sau fallback demo
     ============================================================ */
  function buildDuel() {
    return {
      kicker: "Meciul zilei",
      a: {
        code: get('da',     'ARG'),
        cap:  get('da_cap', 'L. Messi')
      },
      b: {
        code: get('db',     'FRA'),
        cap:  get('db_cap', 'K. Mbappé')
      },
      date:  get('d_date',  'Duminică, 21 iunie'),
      time:  get('d_time',  '22:00'),
      stad:  get('d_stad',  'MetLife Stadium'),
      city:  get('d_city',  'New York / New Jersey'),
      grp:   get('d_grp',   '—'),
      stage: get('d_stage', 'Optimi de finală')
    };
  }

  /* ============================================================
     SCHEDULE — date din URL sau fallback demo
     ============================================================ */
  function buildSchedule() {
    const defaultMatches = [
      {t:"19:00", a:"ESP", b:"URU", stad:"Estadio Azteca",   city:"Ciudad de México", grp:"H"},
      {t:"22:00", a:"FRA", b:"NOR", stad:"MetLife Stadium",  city:"New York",         grp:"I"},
      {t:"01:00", a:"ARG", b:"AUT", stad:"SoFi Stadium",     city:"Los Angeles",      grp:"J"},
      {t:"04:00", a:"BRA", b:"SCO", stad:"Hard Rock Stadium",city:"Miami",            grp:"C"}
    ];

    const urlMatches = [];
    for (let i = 0; i <= 3; i++) {
      if (p.has(`s${i}a`)) {
        urlMatches.push({
          t:    get(`s${i}t`,    '—'),
          a:    get(`s${i}a`,    'TBD'),
          b:    get(`s${i}b`,    'TBD'),
          stad: get(`s${i}stad`, '—'),
          city: get(`s${i}city`, '—'),
          grp:  get(`s${i}grp`,  '—')
        });
      }
    }

    return {
      kicker: "Programul de mâine",
      date:   get('sch_date', 'Joi, 18 iunie'),
      matches: urlMatches.length > 0 ? urlMatches : defaultMatches
    };
  }

  /* ============================================================
     STANDINGS & TOPSTAT — rămân demo (se editează manual)
     ============================================================ */
  const standings = {
    kicker: "Clasament",
    group:  get('st_group', 'Grupa C'),
    rows: [
      {code:"BRA", j:3, v:3, e:0, i:0, gd:"+6", p:9},
      {code:"SCO", j:3, v:1, e:1, i:1, gd:"0",  p:4},
      {code:"MAR", j:3, v:1, e:0, i:2, gd:"-2", p:3},
      {code:"HAI", j:3, v:0, e:1, i:2, gd:"-4", p:1}
    ],
    qual: 2
  };

  const topstat = {
    kicker: "Clasament marcatori",
    title:  "GOLGHETERI",
    unit:   "goluri",
    rows: [
      {code:"FRA", name:"Mbappé",      v:6},
      {code:"ARG", name:"L. Martínez", v:5},
      {code:"POR", name:"Ronaldo",     v:5},
      {code:"BRA", name:"Vinícius",    v:4},
      {code:"ESP", name:"Yamal",       v:4},
      {code:"ENG", name:"Kane",        v:3},
      {code:"NED", name:"Gakpo",       v:3}
    ]
  };

  /* ---- export ---- */
  return {
    teams:     T,
    stad:      STAD,
    host:      "S.U.A. · CANADA · MEXIC",
    posterType: posterType,   // folosit de app.js pentru a deschide automat posterul corect
    schedule:  buildSchedule(),
    duel:      buildDuel(),
    results:   buildResults(),
    standings: standings,
    topstat:   topstat
  };
})();
