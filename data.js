/* ============================================================
   Tournament data — Cupa Mondială 2026 (USA · Canada · Mexico)
   Sample content using the real group-stage draw.
   ============================================================ */
window.WC = (function () {
  // code3 used as the flag-disc placeholder; name in Romanian
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

  return {
    teams:T, stad:STAD,
    host:"S.U.A. · CANADA · MEXIC",

    // ---- Programul de mâine (schedule list) ----
    schedule:{
      kicker:"Programul de mâine",
      date:"Joi, 18 iunie",
      matches:[
        {t:"19:00", a:"ESP", b:"URU", stad:"Estadio Azteca", city:"Ciudad de México", grp:"H"},
        {t:"22:00", a:"FRA", b:"NOR", stad:"MetLife Stadium", city:"New York", grp:"I"},
        {t:"01:00", a:"ARG", b:"AUT", stad:"SoFi Stadium",    city:"Los Angeles", grp:"J"},
        {t:"04:00", a:"BRA", b:"SCO", stad:"Hard Rock Stadium", city:"Miami",     grp:"C"}
      ]
    },

    // ---- Meciul zilei (duel) ----
    duel:{
      kicker:"Meciul zilei",
      a:{code:"ARG", cap:"L. Messi"},
      b:{code:"FRA", cap:"K. Mbappé"},
      date:"Duminică, 21 iunie",
      time:"22:00",
      stad:"MetLife Stadium",
      city:"New York / New Jersey",
      grp:"—",
      stage:"Optimi de finală"
    },

    // ---- Rezultate (previous day) ----
    results:{
      kicker:"Rezultate",
      sub:"Ziua precedentă",
      date:"Miercuri, 17 iunie",
      matches:[
        {a:"BRA", sa:3, b:"MAR", sb:1, grp:"C", note:"Vinícius x2 · Rodrygo"},
        {a:"ESP", sa:2, b:"KSA", sb:0, grp:"H", note:"Yamal · Pedri"},
        {a:"GER", sa:1, b:"ECU", sb:1, grp:"E", note:"Wirtz · Valencia"},
        {a:"POR", sa:4, b:"UZB", sb:0, grp:"K", note:"Ronaldo x2 · B. Fernandes · Leão"}
      ]
    },

    // ---- Clasament grupă ----
    standings:{
      kicker:"Clasament",
      group:"Grupa C",
      rows:[
        {code:"BRA", j:3, v:3, e:0, i:0, gd:"+6", p:9},
        {code:"SCO", j:3, v:1, e:1, i:1, gd:"0",  p:4},
        {code:"MAR", j:3, v:1, e:0, i:2, gd:"-2", p:3},
        {code:"HAI", j:3, v:0, e:1, i:2, gd:"-4", p:1}
      ],
      qual:2 // top N highlighted
    },

    // ---- Top statistic (golgheteri) ----
    topstat:{
      kicker:"Clasament marcatori",
      title:"GOLGHETERI",
      unit:"goluri",
      rows:[
        {code:"FRA", name:"Mbappé",  v:6},
        {code:"ARG", name:"L. Martínez", v:5},
        {code:"POR", name:"Ronaldo", v:5},
        {code:"BRA", name:"Vinícius", v:4},
        {code:"ESP", name:"Yamal",   v:4},
        {code:"ENG", name:"Kane",    v:3},
        {code:"NED", name:"Gakpo",   v:3}
      ]
    }
  };
})();
