/* ============================================================
   Football motifs — drawn vector (no copyrighted marks)
   Ball, pitch lines, trophy.  All use currentColor where mono.
   ============================================================ */
window.Motifs = (function () {

  function pent(cx, cy, r, rotDeg) {
    let p = [];
    for (let i = 0; i < 5; i++) {
      const a = (rotDeg + i * 72 - 90) * Math.PI / 180;
      p.push((cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2));
    }
    return p.join(' ');
  }

  // Classic flat soccer ball.  variant: 'mono' | 'solid' | 'ghost'
  function ball(px, variant) {
    variant = variant || 'mono';
    const cx = 32, cy = 32, R = 30;
    const cR = 8.6;                 // central pentagon radius
    const oDist = 19.5, oR = 7.2;   // outer pentagons
    const centerPts = pent(cx, cy, cR, 0);
    let outer = '', seams = '';
    // central pentagon vertices (for seams)
    const cv = [];
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * Math.PI / 180;
      cv.push([cx + cR * Math.cos(a), cy + cR * Math.sin(a)]);
    }
    for (let k = 0; k < 5; k++) {
      const a = (k * 72 - 90) * Math.PI / 180;          // toward each central vertex
      const ox = cx + oDist * Math.cos(a), oy = cy + oDist * Math.sin(a);
      outer += `<polygon points="${pent(ox, oy, oR, k * 72 + 180)}"/>`;
      // seam from central vertex outward
      seams += `<line x1="${cv[k][0].toFixed(2)}" y1="${cv[k][1].toFixed(2)}" x2="${ox.toFixed(2)}" y2="${oy.toFixed(2)}"/>`;
    }
    const id = 'bclip' + (px) + variant + Math.round(Math.random() * 1e6);
    let circleFill, patchFill, stroke, sw, outline;
    if (variant === 'solid') {
      circleFill = '#fff'; patchFill = '#16181F'; stroke = '#16181F'; sw = 1.4; outline = '#16181F';
    } else if (variant === 'ghost') {
      circleFill = 'none'; patchFill = 'currentColor'; stroke = 'currentColor'; sw = 1.6; outline = 'currentColor';
    } else { // mono
      circleFill = 'none'; patchFill = 'currentColor'; stroke = 'currentColor'; sw = 2.0; outline = 'currentColor';
    }
    return `<svg class="m-ball" width="${px}" height="${px}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="${circleFill}" stroke="${outline}" stroke-width="${sw}"/>
      <g clip-path="url(#${id})" stroke="${stroke}" stroke-width="${sw * 0.9}" stroke-linejoin="round">
        <g fill="${patchFill}" stroke="none">
          <polygon points="${centerPts}"/>${outer}
        </g>
        <g stroke="${stroke}">${seams}</g>
      </g>
    </svg>`;
  }

  // Horizontal pitch markings, meant as a faint full-bleed watermark.
  function pitch() {
    return `<svg class="m-pitch" viewBox="0 0 1080 700" fill="none" stroke="currentColor"
      stroke-width="3" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect x="40" y="40" width="1000" height="620" rx="6"/>
      <line x1="540" y1="40" x2="540" y2="660"/>
      <circle cx="540" cy="350" r="118"/>
      <circle cx="540" cy="350" r="6" fill="currentColor" stroke="none"/>
      <!-- left box -->
      <rect x="40" y="190" width="150" height="320"/>
      <rect x="40" y="270" width="62" height="160"/>
      <path d="M190 268 A118 118 0 0 1 190 432"/>
      <circle cx="140" cy="350" r="5" fill="currentColor" stroke="none"/>
      <!-- right box -->
      <rect x="890" y="190" width="150" height="320"/>
      <rect x="978" y="270" width="62" height="160"/>
      <path d="M890 268 A118 118 0 0 0 890 432"/>
      <circle cx="940" cy="350" r="5" fill="currentColor" stroke="none"/>
    </svg>`;
  }

  // Generic trophy line icon (a cup — not a replica of any branded trophy).
  function trophy(px, cls) {
    return `<svg class="${cls || 'm-trophy'}" width="${px}" height="${px}" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/>
      <path d="M17 5h2.5a2 2 0 0 1 0 4H17M7 5H4.5a2 2 0 0 0 0 4H7"/>
      <path d="M12 14v3"/><path d="M8.5 20.5h7"/><path d="M9.5 17.5h5l.6 3h-6.2l.6-3Z"/>
    </svg>`;
  }

  return { ball, pitch, trophy };
})();
