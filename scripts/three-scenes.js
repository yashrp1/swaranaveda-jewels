/* ===================================================================
   SWARANAVEDA JEWELS — PHOTOREALISTIC HAUTE JOAILLERIE SCROLL ENGINE
   - 100% Photorealistic Studio Campaign Masterplates
   - 100% Scroll-Driven Choreography (No fake procedural primitives)
   - Multi-Angle Ring Scrubbing with 3D Perspective Tilt
   - Real-Time Diamond Starburst Caustics & Specular Light Sweeps
   - Smooth Pinned Stage Transitions Across 4 Masterpieces
   =================================================================== */

window.Swaranaveda3D = (function () {
  'use strict';

  // --- ASSET PATHS (100% PHOTOREALISTIC HIGH JEWELLERY) ---
  const ASSETS = {
    // Chapter 02 Masterpieces
    aurelia: 'assets/images/necklace_hero.jpg',
    surya: 'assets/images/collection_cuff.jpg',
    veda: 'assets/images/ring_front.jpg',
    prakash: 'assets/images/collection_earrings.jpg',

    // Chapter 09 Solitaire Ring Multi-Angle Scrub Sequence
    ringFront: 'assets/images/ring_front.jpg',
    ringAngle: 'assets/images/ring_angle.jpg',
    ringSide: 'assets/images/ring_side.jpg',
    ringMacro: 'assets/images/ring_macro.jpg'
  };

  // Image preloader cache
  const loadedImages = {};

  function preloadImages(sources, callback) {
    let loaded = 0;
    const keys = Object.keys(sources);
    const total = keys.length;

    keys.forEach((key) => {
      const img = new Image();
      img.src = sources[key];
      img.onload = () => {
        loadedImages[key] = img;
        loaded++;
        if (loaded === total && callback) callback();
      };
      img.onerror = () => {
        loaded++;
        if (loaded === total && callback) callback();
      };
    });
  }

  // --- PROCEDURAL DIAMOND STARBURST FLARE GENERATOR ---
  function drawDiamondSparkle(ctx, x, y, size, intensity, color = '#FFFFFF') {
    if (intensity <= 0.05) return;

    ctx.save();
    ctx.translate(x, y);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, intensity)})`);
    grad.addColorStop(0.3, `rgba(238, 223, 198, ${intensity * 0.7})`);
    grad.addColorStop(0.7, `rgba(200, 169, 107, ${intensity * 0.25})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // 4 Primary Starburst Spikes
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, intensity * 1.1)})`;
    ctx.lineWidth = 1.8 * intensity;
    ctx.beginPath();
    ctx.moveTo(-size * 1.3, 0); ctx.lineTo(size * 1.3, 0);
    ctx.moveTo(0, -size * 1.3); ctx.lineTo(0, size * 1.3);
    ctx.stroke();

    // 4 Diagonal Spikes
    ctx.strokeStyle = `rgba(238, 223, 198, ${intensity * 0.65})`;
    ctx.lineWidth = 1.0 * intensity;
    ctx.beginPath();
    const d = size * 0.75;
    ctx.moveTo(-d, -d); ctx.lineTo(d, d);
    ctx.moveTo(-d, d); ctx.lineTo(d, -d);
    ctx.stroke();

    ctx.restore();
  }

  // ===================================================================
  // 1. CHAPTER 02 — MASTER SHOWCASE (PINNED 450vh SCROLL STAGE)
  // ===================================================================
  function initMasterShowcase() {
    const container = document.getElementById('necklace-canvas-container');
    const section = document.getElementById('chapter-necklace');
    if (!container || !section) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'masterpiece-stage-canvas';
    container.innerHTML = '';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || window.innerHeight);

    // 4 Masterpieces data with facet sparkle coordinates (relative 0.0 - 1.0)
    const pieces = [
      {
        id: 'aurelia',
        title: 'THE AURELIA',
        badge: 'HAUTE JOAILLERIE 01',
        imageKey: 'aurelia',
        sparkles: [
          { x: 0.50, y: 0.35, size: 28, phase: 0 },
          { x: 0.44, y: 0.48, size: 20, phase: 1.2 },
          { x: 0.56, y: 0.48, size: 20, phase: 2.1 },
          { x: 0.38, y: 0.58, size: 18, phase: 3.4 },
          { x: 0.62, y: 0.58, size: 18, phase: 4.2 },
          { x: 0.50, y: 0.72, size: 24, phase: 5.0 }
        ]
      },
      {
        id: 'surya',
        title: 'THE SURYA',
        badge: 'HAUTE JOAILLERIE 02',
        imageKey: 'surya',
        sparkles: [
          { x: 0.48, y: 0.45, size: 24, phase: 0.5 },
          { x: 0.54, y: 0.42, size: 22, phase: 1.8 },
          { x: 0.42, y: 0.52, size: 19, phase: 2.9 },
          { x: 0.58, y: 0.50, size: 25, phase: 4.1 }
        ]
      },
      {
        id: 'veda',
        title: 'THE VEDA',
        badge: 'HAUTE JOAILLERIE 03',
        imageKey: 'veda',
        sparkles: [
          { x: 0.50, y: 0.30, size: 34, phase: 0.2 },
          { x: 0.46, y: 0.25, size: 22, phase: 1.5 },
          { x: 0.54, y: 0.25, size: 22, phase: 2.8 },
          { x: 0.50, y: 0.55, size: 20, phase: 3.9 }
        ]
      },
      {
        id: 'prakash',
        title: 'THE PRAKASH',
        badge: 'HAUTE JOAILLERIE 04',
        imageKey: 'prakash',
        sparkles: [
          { x: 0.38, y: 0.38, size: 22, phase: 0.3 },
          { x: 0.62, y: 0.38, size: 22, phase: 1.4 },
          { x: 0.40, y: 0.55, size: 26, phase: 2.6 },
          { x: 0.60, y: 0.55, size: 26, phase: 3.7 },
          { x: 0.42, y: 0.75, size: 24, phase: 4.8 },
          { x: 0.58, y: 0.75, size: 24, phase: 5.6 }
        ]
      }
    ];

    // UI elements
    const counterEl = document.getElementById('scroll-piece-num');
    const progressBar = document.getElementById('piece-scroll-progress');
    const metaPanels = document.querySelectorAll('.scroll-piece-info');

    let currentScrollProgress = 0;
    let targetScrollProgress = 0;
    let currentPieceIdx = 0;

    // Mouse parallax
    let mouseNormX = 0;
    let mouseNormY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseNormX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseNormY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function onScrollShowcase() {
      const rect = section.getBoundingClientRect();
      const trackDistance = section.clientHeight - window.innerHeight;
      if (trackDistance <= 0) return;

      const progress = -rect.top / trackDistance;
      targetScrollProgress = Math.max(0, Math.min(1, progress));
    }
    window.addEventListener('scroll', onScrollShowcase, { passive: true });
    onScrollShowcase();

    // Stardust background particles
    const stardust = [];
    for (let s = 0; s < 45; s++) {
      stardust.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.001 + 0.0005,
        phase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    function renderStage() {
      // Smooth lerp on scroll progress
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.12;

      // Update progress gauge
      if (progressBar) {
        progressBar.style.width = `${currentScrollProgress * 100}%`;
      }

      // Map progress to piece index (4 pieces, each 0.25 track)
      const exactIndex = currentScrollProgress * 3.999;
      const pieceIdx = Math.min(3, Math.floor(exactIndex));
      const subProgress = exactIndex - pieceIdx; // 0.0 to 1.0 within current piece

      // Update UI panels when piece changes
      if (pieceIdx !== currentPieceIdx) {
        currentPieceIdx = pieceIdx;
        if (counterEl) {
          counterEl.textContent = `0${currentPieceIdx + 1}`;
        }
        metaPanels.forEach((panel, idx) => {
          if (idx === currentPieceIdx) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Royal Wine Maroon Atmospheric Vignette
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.5, 50,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, '#260912'); // Rich wine velvet core
      bgGrad.addColorStop(0.4, '#1A050B');
      bgGrad.addColorStop(0.85, '#140407');
      bgGrad.addColorStop(1, '#0C0204');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Floating Golden Stardust
      stardust.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = 1;
        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 0.002 + p.phase));
        ctx.fillStyle = `rgba(238, 223, 198, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Render Active Piece & Cross-fade Next Piece
      const piece = pieces[currentPieceIdx];
      const img = loadedImages[piece.imageKey];

      if (img && img.complete) {
        ctx.save();

        // 3D Perspective Transformations based on scroll & mouse
        const centerX = width * 0.55; // Slightly offset right to balance editorial text on left
        const centerY = height * 0.5;

        // Dynamic 3D tilt & gentle breathing float
        const tiltX = mouseNormY * 6 + Math.sin(subProgress * Math.PI) * 4;
        const tiltY = mouseNormX * 8 + Math.cos(subProgress * Math.PI * 1.5) * 8;
        const scale = 0.92 + Math.sin(subProgress * Math.PI) * 0.12;

        ctx.translate(centerX, centerY);

        // Subtle 3D perspective skew/scale
        ctx.transform(
          scale,
          (tiltX * Math.PI) / 180 * 0.15,
          (tiltY * Math.PI) / 180 * 0.15,
          scale,
          mouseNormX * 14,
          mouseNormY * 10
        );

        // Aspect fit image
        const imgAspect = img.width / img.height;
        let drawW = Math.min(width * 0.52, 600);
        let drawH = drawW / imgAspect;
        if (drawH > height * 0.72) {
          drawH = height * 0.72;
          drawW = drawH * imgAspect;
        }

        // Draw luxury soft drop shadow on velvet
        ctx.shadowColor = 'rgba(20, 4, 7, 0.95)';
        ctx.shadowBlur = 45;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 25;

        // Rounded high-relief presentation
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.shadowColor = 'transparent';

        // 4. Dynamic Specular Light Sweep over the gold surface
        const sweepAngle = (subProgress * Math.PI * 2) - Math.PI;
        const sweepX = Math.sin(sweepAngle) * (drawW * 0.7);
        const sweepGrad = ctx.createLinearGradient(sweepX - 80, -drawH / 2, sweepX + 80, drawH / 2);
        sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        sweepGrad.addColorStop(0.5, 'rgba(255, 248, 235, 0.28)');
        sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = sweepGrad;
        ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);

        // 5. Real-Time Diamond Starburst Caustics
        piece.sparkles.forEach((sp) => {
          const spX = -drawW / 2 + sp.x * drawW;
          const spY = -drawH / 2 + sp.y * drawH;

          // Intensity peaks with scroll movement and time shimmer
          const timePulse = Math.sin(time * 0.003 + sp.phase);
          const scrollPulse = Math.abs(Math.sin(subProgress * Math.PI * 3 + sp.phase));
          const intensity = Math.max(0, timePulse * 0.5 + scrollPulse * 0.6);

          drawDiamondSparkle(ctx, spX, spY, sp.size, intensity);
        });

        ctx.restore();
      }

      time += 16;
      requestAnimationFrame(renderStage);
    }
    renderStage();

    window.addEventListener('resize', () => {
      width = canvas.width = container.clientWidth || window.innerWidth;
      height = canvas.height = container.clientHeight || window.innerHeight;
    });
  }

  // ===================================================================
  // 2. CHAPTER 09 — THE SOLITAIRE VEDA RING (360° MULTI-ANGLE SCRUB)
  // ===================================================================
  function initRingScrubber() {
    const container = document.getElementById('ring-canvas-wrapper');
    const section = document.getElementById('chapter-ring');
    if (!container || !section) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'ring-scrub-canvas';
    container.innerHTML = '';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || window.innerHeight);

    // 4 Photorealistic Angles
    const angles = [
      { key: 'ringFront', label: 'CATHEDRAL FRONT' },
      { key: 'ringAngle', label: '45° SHANK PERSPECTIVE' },
      { key: 'ringSide', label: 'ARCHITECTURAL ARCH' },
      { key: 'ringMacro', label: 'MACRO DIAMOND PAVILION' }
    ];

    let ringProgress = 0;
    let targetRingProgress = 0;

    function onScrollRing() {
      const rect = section.getBoundingClientRect();
      const totalDist = section.clientHeight + window.innerHeight;
      const progress = (window.innerHeight - rect.top) / totalDist;
      targetRingProgress = Math.max(0, Math.min(1, progress));
    }
    window.addEventListener('scroll', onScrollRing, { passive: true });
    onScrollRing();

    // Mouse tilt
    let mouseX = 0, mouseY = 0;
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    let ringTime = 0;

    function renderRing() {
      ringProgress += (targetRingProgress - ringProgress) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Radial Royal Maroon Spotlight Vignette
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.5, 40,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.7
      );
      bgGrad.addColorStop(0, '#280A12');
      bgGrad.addColorStop(0.5, '#1A060C');
      bgGrad.addColorStop(0.9, '#140407');
      bgGrad.addColorStop(1, '#0C0204');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Determine which 2 angles are cross-dissolving based on ringProgress (0.0 to 1.0)
      const exactAngle = ringProgress * (angles.length - 1);
      const angleIdxA = Math.min(angles.length - 2, Math.floor(exactAngle));
      const angleIdxB = angleIdxA + 1;
      const blend = exactAngle - angleIdxA; // 0.0 to 1.0 between A and B

      const imgA = loadedImages[angles[angleIdxA].key];
      const imgB = loadedImages[angles[angleIdxB].key];

      ctx.save();
      ctx.translate(width * 0.5, height * 0.5);

      // Dynamic zoom-in when reaching the macro diamond phase
      const macroZoom = 1.0 + Math.max(0, ringProgress - 0.6) * 0.6;
      ctx.scale(macroZoom, macroZoom);

      // Subtle mouse perspective
      ctx.rotate(mouseX * 0.04);
      ctx.translate(mouseX * 12, mouseY * 10);

      const ringSize = Math.min(width * 0.65, height * 0.65, 540);

      // Draw shadow
      ctx.shadowColor = 'rgba(20, 4, 7, 0.98)';
      ctx.shadowBlur = 55;
      ctx.shadowOffsetY = 30;

      // Draw Image A
      if (imgA && imgA.complete) {
        ctx.globalAlpha = 1.0 - blend;
        ctx.drawImage(imgA, -ringSize / 2, -ringSize / 2, ringSize, ringSize);
      }

      // Draw Image B
      if (imgB && imgB.complete) {
        ctx.globalAlpha = blend;
        ctx.drawImage(imgB, -ringSize / 2, -ringSize / 2, ringSize, ringSize);
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowColor = 'transparent';

      // Real-time diamond prismatic flares on table facets
      const flareIntensity = Math.abs(Math.sin(ringProgress * Math.PI * 4 + ringTime * 0.003));
      drawDiamondSparkle(ctx, -ringSize * 0.08, -ringSize * 0.22, 32, flareIntensity * 0.85);
      drawDiamondSparkle(ctx, ringSize * 0.12, -ringSize * 0.24, 28, Math.cos(ringTime * 0.003) * 0.7);

      ctx.restore();

      ringTime += 16;
      requestAnimationFrame(renderRing);
    }
    renderRing();

    window.addEventListener('resize', () => {
      width = canvas.width = container.clientWidth || window.innerWidth;
      height = canvas.height = container.clientHeight || window.innerHeight;
    });
  }

  return {
    init: function () {
      preloadImages(ASSETS, () => {
        initMasterShowcase();
        initRingScrubber();
      });
    }
  };
})();
