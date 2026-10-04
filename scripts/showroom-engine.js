/* ===================================================================
   SWARNAVEDA JEWELS — SANCTUARY SHOWROOM & CONSTANT 3D LEVITATION ENGINE
   1. Volumetric Temple Sanctuary Stage with Wet Volcanic Rock Pedestal
   2. Constant Organic 3D Floating Levitation Physics (Sine Bob, Tilt & Breathe)
   3. 3D Celestial Orbital Gyro Rings with Stardust Particle Drift
   4. Interactive Drag-to-Rotate with Realistic Inertia Damping
   5. Masterpiece Switcher (Torc, Kada, Ornament) with 3D Turnaround Flip
   6. 500vh Cinematic Scroll Scrub & Settled Atelier Showcase
   =================================================================== */

window.SwarnaVedaShowroom = (function () {
  'use strict';

  const config = window.SWARNAVEDA_CONFIG || {};

  // Sanctuary Stage Themes (Silver, Diamond, Gold matching expectedvideo.mov expanding circular background wave)
  const sanctuaryThemes = {
    silver: {
      id: "silver",
      name: "Moonlit Silver Sanctuary",
      cssClass: "env-silver",
      accentColor: "#A2C8EC",
      haloCenter: "rgba(175, 205, 240, 0.28)",
      haloMid: "rgba(35, 65, 105, 0.22)",
      ambientOuter: "rgba(8, 15, 28, 0.65)",
      deepVignette: "rgba(4, 8, 16, 0.82)",
      beamCore: "rgba(225, 242, 255, ",
      beamMid: "rgba(160, 205, 245, ",
      ringCore: "#E2F0FD",
      ringGlow: "rgba(155, 210, 255, 0.85)",
      sheen: "rgba(185, 220, 250, 0.22)",
      kicker: "ATELIER · 01 / 03 · STERLING SILVER"
    },
    diamond: {
      id: "diamond",
      name: "Celestial Diamond Sanctum",
      cssClass: "env-diamond",
      accentColor: "#7FE2D1",
      haloCenter: "rgba(140, 235, 215, 0.28)",
      haloMid: "rgba(20, 75, 70, 0.22)",
      ambientOuter: "rgba(5, 20, 19, 0.65)",
      deepVignette: "rgba(3, 12, 12, 0.82)",
      beamCore: "rgba(215, 255, 248, ",
      beamMid: "rgba(125, 230, 215, ",
      ringCore: "#C8FAF0",
      ringGlow: "rgba(115, 245, 225, 0.85)",
      sheen: "rgba(145, 245, 225, 0.22)",
      kicker: "ATELIER · 02 / 03 · CELESTIAL DIAMOND"
    },
    gold: {
      id: "gold",
      name: "Imperial 22K Gold Sanctuary",
      cssClass: "env-gold",
      accentColor: "#E6B860",
      haloCenter: "rgba(245, 200, 115, 0.32)",
      haloMid: "rgba(105, 28, 42, 0.24)",
      ambientOuter: "rgba(24, 7, 11, 0.65)",
      deepVignette: "rgba(14, 4, 7, 0.82)",
      beamCore: "rgba(255, 238, 195, ",
      beamMid: "rgba(225, 185, 110, ",
      ringCore: "#FFE7A8",
      ringGlow: "rgba(245, 195, 90, 0.85)",
      sheen: "rgba(245, 200, 110, 0.24)",
      kicker: "ATELIER · 03 / 03 · 22K TEMPLE GOLD"
    }
  };

  // Sanctuary Stage Masterpieces (Matching Image 1 Reference)
  const sanctuaryPieces = [
    {
      id: "silver-necklace",
      category: "silver",
      type: "TORC",
      title: "The Royal Moonstone Torc",
      subtitle: "Antique Sterling Silver with Moonstone Cabochons & Fine Filigree",
      description: "An Assamese imperial collar crafted in antique sterling silver, articulated with hand-set iridescent moonstone cabochons and delicate openwork filigree.",
      specs: [
        "Antique Sterling Silver with Hand-applied Patina",
        "Natural Untreated Moonstone Solitaires (7 Cabochons)",
        "Kinetic Articulated Collar Segments",
        "Over 320 Artisan Atelier Fabrication Hours"
      ],
      heroImage: "assets/jewellery/silver/necklace/hero_transparent.png",
      scale: 0.82,
      targetBottomYRatio: 0.584,
      hoverGap: 20,
      centerToBottomRatio: 0.235,
      shadowWidthRatio: 0.38,
      kicker: "ATELIER · 01 / 03 · STERLING SILVER"
    },
    {
      id: "silver-bangle",
      category: "diamond",
      type: "KADA",
      title: "The Royal Surya Kada",
      subtitle: "Hand-chiseled Repoussé Silver Bangle with Sacred Lotus Motifs",
      description: "A monumental cuff forged in sovereign silver, chased and repoussé worked with Brahmaputra lotus blossoms and imperial floral jaali carvings.",
      specs: [
        "Sovereign Solid Sterling Silver (210 grams)",
        "Ancient Repoussé Punch Mastery",
        "Concealed Spring Locking Mechanism",
        "180 Atelier Fabrication Hours"
      ],
      heroImage: "assets/jewellery/silver/bangle/hero_transparent.png",
      scale: 0.74,
      targetBottomYRatio: 0.588,
      hoverGap: 20,
      centerToBottomRatio: 0.390,
      shadowWidthRatio: 0.26,
      kicker: "ATELIER · 02 / 03 · CELESTIAL DIAMOND"
    },
    {
      id: "gold-hasli",
      category: "gold",
      type: "HASLI",
      title: "The Sovereign Temple Hasli",
      subtitle: "22K Antique Yellow Gold with Burmese Rubies & Uncut Polki Diamonds",
      description: "A monumental ceremonial neck torc forged in sovereign 22K gold, hand-set with glowing pigeon-blood ruby cabochons and ancestral polki jaali filigree.",
      specs: [
        "22K Sovereign Hallmark Gold (188 grams)",
        "Untreated Natural Burmese Ruby Cabochons",
        "Hand-set Polki Uncut Diamonds in 24K Kunda Setting",
        "Over 360 Hours of Ancestral Repoussé & Jaali Carving"
      ],
      heroImage: "assets/jewellery/gold/necklace/royal_gold_hasli_transparent.png",
      scale: 0.80,
      targetBottomYRatio: 0.584,
      hoverGap: 20,
      centerToBottomRatio: 0.286,
      shadowWidthRatio: 0.36,
      kicker: "ATELIER · 03 / 03 · 22K TEMPLE GOLD"
    }
  ];

  // State Management
  const state = {
    currentCategory: 'silver',
    currentPieceIndex: 0,
    currentTheme: sanctuaryThemes.silver,
    prevTheme: null,
    targetTheme: null,
    isWaveTransitioning: false,
    waveProgress: 1.0,
    waveOriginX: 0,
    waveOriginY: 0,
    isSettled: false,
    scrollProgress: 0,
    targetScrollProgress: 0,
    currentFrameIndex: 1,
    isTransitioning: false,
    transitionProgress: 1.0,
    transitionDir: 1, // 1 for next, -1 for prev
    outgoingPiece: null,
    incomingPiece: null
  };

  // Image Frame Caches
  const frameCache = {};
  const pieceHeroCache = {};
  const TOTAL_FRAMES = 60;

  // Drag-to-Rotate Physics
  let isDragging = false;
  let dragStartX = 0;
  let lastDragX = 0;
  let lastDragTime = 0;
  let dragRotation = 0;
  let dragVelocity = 0;

  // Stardust Particles (35 celestial sparks)
  const stardust = [];
  for (let i = 0; i < 35; i++) {
    stardust.push({
      angle: Math.random() * Math.PI * 2,
      dist: 110 + Math.random() * 200,
      yOffset: (Math.random() - 0.5) * 180,
      speed: (0.0003 + Math.random() * 0.0005) * (Math.random() > 0.5 ? 1 : -1),
      size: 1.0 + Math.random() * 2.2,
      opacity: 0.25 + Math.random() * 0.65,
      pulseSpeed: 0.0018 + Math.random() * 0.002
    });
  }

  // DOM Elements
  let canvas, ctx;
  let scrollTrack, stickyViewport;
  let interactiveUI, pieceTypeBadge, pieceTitle, pieceSubtitle, pieceDesc, pieceSpecs;
  let counterCurrent, counterTotal, btnPrev, btnNext, categoryPills;
  let sanctuaryLeftUI, sanctuaryRightUI, sanctuaryBottomUI;

  // --- 1. PRELOAD ASSETS INTELLIGENTLY ---
  function preloadSanctuaryAssets() {
    // Preload 3 sanctuary pieces
    sanctuaryPieces.forEach((piece) => {
      const img = new Image();
      img.src = piece.heroImage;
      img.onload = () => {
        pieceHeroCache[piece.id] = img;
      };
    });

    // Also preload config collection items if available
    if (config.collections) {
      Object.keys(config.collections).forEach((catKey) => {
        const col = config.collections[catKey];
        if (col && col.items) {
          col.items.forEach((item) => {
            if (item.heroImage && !pieceHeroCache[item.id]) {
              const img = new Image();
              img.src = item.heroImage;
              img.onload = () => {
                pieceHeroCache[item.id] = img;
              };
            }
          });
        }
      });
    }

    // Preload initial frames for scroll sequence
    const basePath = "assets/jewellery/gold/hero-necklace/hero-necklace-{index}.webp";
    for (let i = 1; i <= 10; i++) {
      const img = new Image();
      const frameNumStr = String(i).padStart(4, '0');
      img.src = basePath.replace('{index}', frameNumStr);
      img.onload = () => {
        frameCache[i] = img;
      };
    }

    // Progressively load remaining frames
    setTimeout(() => {
      for (let i = 11; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNumStr = String(i).padStart(4, '0');
        img.src = basePath.replace('{index}', frameNumStr);
        img.onload = () => {
          frameCache[i] = img;
        };
      }
    }, 600);
  }

  // --- 2. INITIALIZE CANVAS & SIZING ---
  function initCanvas() {
    canvas = document.getElementById('hero-scroll-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d', { alpha: true });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    }

    window.addEventListener('resize', resize);
    resize();
  }

  // --- 3. DRAG-TO-ROTATE CONTROLLER ---
  function initDragController() {
    if (!canvas) return;

    function handleStart(clientX) {
      isDragging = true;
      dragStartX = clientX;
      lastDragX = clientX;
      lastDragTime = performance.now();
      dragVelocity = 0;
    }

    function handleMove(clientX) {
      if (!isDragging) return;
      const now = performance.now();
      const dx = clientX - lastDragX;
      const dt = Math.max(1, now - lastDragTime);
      dragRotation += dx * 0.005;
      dragVelocity = (dx / dt) * 0.12;
      lastDragX = clientX;
      lastDragTime = now;
    }

    function handleEnd() {
      isDragging = false;
    }

    canvas.addEventListener('mousedown', (e) => handleStart(e.clientX));
    window.addEventListener('mousemove', (e) => handleMove(e.clientX));
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) handleStart(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', handleEnd);
  }

  // --- 4. SCROLL HANDLING & TIMELINE ---
  function initScrollController() {
    scrollTrack = document.getElementById('hero-scroll-experience');
    stickyViewport = document.querySelector('.hero-sticky-viewport');
    interactiveUI = document.getElementById('showcase-interactive-ui');
    sanctuaryLeftUI = document.querySelector('.sanctuary-left-ui');
    sanctuaryRightUI = document.querySelector('.sanctuary-right-ui');
    sanctuaryBottomUI = document.querySelector('.sanctuary-bottom-ui');

    if (!scrollTrack) return;

    function onScroll() {
      const rect = scrollTrack.getBoundingClientRect();
      const totalScrollable = scrollTrack.clientHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const rawProgress = -rect.top / totalScrollable;
      state.targetScrollProgress = Math.max(0, Math.min(1, rawProgress));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- 5. INTERACTIVE SWITCHER LOGIC ---
  function initInteractiveSwitcher() {
    pieceTypeBadge = document.getElementById('showcase-piece-type');
    pieceTitle = document.getElementById('showcase-piece-title');
    pieceSubtitle = document.getElementById('showcase-piece-subtitle');
    pieceDesc = document.getElementById('showcase-piece-desc');
    pieceSpecs = document.getElementById('showcase-piece-specs');
    counterCurrent = document.getElementById('counter-current');
    counterTotal = document.getElementById('counter-total');
    btnPrev = document.getElementById('btn-prev-piece');
    btnNext = document.getElementById('btn-next-piece');
    categoryPills = document.querySelectorAll('.cat-pill');

    // Previous / Next buttons for settled showcase HUD
    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        const total = sanctuaryPieces.length;
        const newIdx = (state.currentPieceIndex - 1 + total) % total;
        switchPieceByIndex(newIdx);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        const total = sanctuaryPieces.length;
        const newIdx = (state.currentPieceIndex + 1) % total;
        switchPieceByIndex(newIdx);
      });
    }

    // Right-side circular thumbnail pills (Matching Image 1)
    const thumbPills = document.querySelectorAll('.sanctuary-thumb-pill');
    thumbPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(pill.getAttribute('data-index') || '0', 10);
        switchPieceByIndex(idx);
      });
    });

    // Left-side chapter buttons (01, 02, 03)
    const chapterBtns = document.querySelectorAll('.chapter-btn');
    chapterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-chapter') || '0', 10);
        switchPieceByIndex(idx);
      });
    });

    // Category Selector (GOLD | DIAMOND | SILVER)
    categoryPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const cat = pill.getAttribute('data-cat');
        if (cat) {
          categoryPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const catLower = cat.toLowerCase();
          const matchIdx = sanctuaryPieces.findIndex(p => p.category === catLower);
          if (matchIdx !== -1) {
            switchPieceByIndex(matchIdx);
          } else {
            state.currentCategory = catLower;
            updateUI();
          }
        }
      });
    });

    // Check if ?piece= is specified in URL query for instant testing
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('piece')) {
      const pieceIdx = parseInt(urlParams.get('piece'), 10);
      if (!isNaN(pieceIdx) && pieceIdx >= 0 && pieceIdx < sanctuaryPieces.length) {
        switchPieceByIndex(pieceIdx, true);
      }
    } else {
      // Set initial theme environment on viewport
      const initialPiece = sanctuaryPieces[0];
      const initialTheme = sanctuaryThemes[initialPiece.category] || sanctuaryThemes.silver;
      state.currentTheme = initialTheme;
      if (stickyViewport) {
        stickyViewport.classList.remove('env-silver', 'env-diamond', 'env-gold');
        stickyViewport.classList.add(initialTheme.cssClass);
        stickyViewport.style.setProperty('--theme-accent', initialTheme.accentColor);
      }
    }

    updateUI();
  }

  function switchPieceByIndex(idx, immediate = false) {
    if (idx < 0 || idx >= sanctuaryPieces.length) return;
    if (state.currentPieceIndex === idx && !immediate) return;

    const oldPiece = sanctuaryPieces[state.currentPieceIndex] || sanctuaryPieces[0];
    const newPiece = sanctuaryPieces[idx];

    const prevTheme = sanctuaryThemes[oldPiece.category] || sanctuaryThemes.silver;
    const targetTheme = sanctuaryThemes[newPiece.category] || sanctuaryThemes.gold;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const currentMetrics = getPieceMetrics(oldPiece, w, h);

    if (immediate) {
      state.currentPieceIndex = idx;
      state.currentCategory = newPiece.category;
      state.currentTheme = targetTheme;
      state.prevTheme = null;
      state.targetTheme = null;
      state.isTransitioning = false;
      state.transitionProgress = 1.0;
      state.isWaveTransitioning = false;
      state.waveProgress = 1.0;
      state.outgoingPiece = null;
      state.incomingPiece = null;
    } else {
      state.outgoingPiece = oldPiece;
      state.incomingPiece = newPiece;
      state.transitionDir = idx > state.currentPieceIndex ? 1 : -1;
      state.isTransitioning = true;
      state.transitionProgress = 0.0;

      // Start expanding circular wave from center of jewellery
      state.prevTheme = state.currentTheme || prevTheme;
      state.targetTheme = targetTheme;
      state.waveOriginX = currentMetrics.cx;
      state.waveOriginY = currentMetrics.cy;
      state.isWaveTransitioning = true;
      state.waveProgress = 0.0;

      state.currentPieceIndex = idx;
      state.currentCategory = newPiece.category;
    }

    // Synchronize CSS class and theme accent variable on viewport container
    if (stickyViewport && targetTheme) {
      stickyViewport.classList.remove('env-silver', 'env-diamond', 'env-gold');
      stickyViewport.classList.add(targetTheme.cssClass);
      stickyViewport.style.setProperty('--theme-accent', targetTheme.accentColor);
    }

    // Update active thumb pill with halo ring
    const thumbPills = document.querySelectorAll('.sanctuary-thumb-pill');
    thumbPills.forEach((p, i) => {
      p.classList.toggle('active', i === idx);
    });

    // Update chapter buttons
    const chapterBtns = document.querySelectorAll('.chapter-btn');
    chapterBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });

    updateUI();

    if (!immediate && window.SwaranavedaAudio) {
      window.SwaranavedaAudio.triggerChime();
    }
  }

  function updateUI() {
    const currentItem = sanctuaryPieces[state.currentPieceIndex] || sanctuaryPieces[0];
    const total = sanctuaryPieces.length;

    // Sanctuary Kicker Atelier Tag
    const kickerEl = document.querySelector('.sanctuary-kicker span');
    if (kickerEl) {
      kickerEl.textContent = currentItem.kicker || `ATELIER · 0${state.currentPieceIndex + 1} / 0${total}`;
    }

    if (pieceTypeBadge) pieceTypeBadge.textContent = currentItem.type;
    if (pieceTitle) pieceTitle.textContent = currentItem.title;
    if (pieceSubtitle) pieceSubtitle.textContent = currentItem.subtitle;
    if (pieceDesc && currentItem.description) pieceDesc.textContent = currentItem.description;
    if (pieceSpecs && currentItem.specs) {
      pieceSpecs.innerHTML = currentItem.specs.map(s => `<span>✦ ${s}</span>`).join('');
    }

    if (counterCurrent) counterCurrent.textContent = String(state.currentPieceIndex + 1).padStart(2, '0');
    if (counterTotal) counterTotal.textContent = String(total).padStart(2, '0');
  }

  // --- 6. RENDER LOOP (requestAnimationFrame) ---
  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Silky frame-rate independent exponential damping
    const damp = 1.0 - Math.exp(-dt * 9.0);
    state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * damp;

    // Drag velocity inertia damping
    if (!isDragging) {
      dragRotation += dragVelocity;
      dragVelocity *= 0.92;
    }

    // Scrubbing Phase
    const scrubProgress = Math.min(1.0, state.scrollProgress / 0.55);
    const rawFrame = Math.round(scrubProgress * (TOTAL_FRAMES - 1)) + 1;
    state.currentFrameIndex = Math.max(1, Math.min(TOTAL_FRAMES, rawFrame));

    // Parallax fade for Sanctuary Left UI (NEVER translateX(-50%))
    if (sanctuaryLeftUI) {
      const alpha = Math.max(0, 1 - state.scrollProgress * 2.8);
      sanctuaryLeftUI.style.opacity = alpha;
      sanctuaryLeftUI.style.transform = `translateY(calc(-50% - ${state.scrollProgress * 120}px))`;
      sanctuaryLeftUI.style.pointerEvents = alpha < 0.1 ? 'none' : 'auto';
    }

    // Parallax fade for Sanctuary Right UI
    if (sanctuaryRightUI) {
      const alpha = Math.max(0, 1 - state.scrollProgress * 2.8);
      sanctuaryRightUI.style.opacity = alpha;
      sanctuaryRightUI.style.transform = `translateY(calc(-50% - ${state.scrollProgress * 120}px))`;
      sanctuaryRightUI.style.pointerEvents = alpha < 0.1 ? 'none' : 'auto';
    }

    // Parallax fade for Sanctuary Bottom UI
    if (sanctuaryBottomUI) {
      const alpha = Math.max(0, 1 - state.scrollProgress * 3.2);
      sanctuaryBottomUI.style.opacity = alpha;
      sanctuaryBottomUI.style.visibility = alpha < 0.05 ? 'hidden' : 'visible';
    }

    // Settled threshold: once scroll >= 55% and <= 95%, activate interactive HUD
    const isNowSettled = state.scrollProgress >= 0.55 && state.scrollProgress <= 0.95;
    if (isNowSettled !== state.isSettled) {
      state.isSettled = isNowSettled;
      if (interactiveUI) {
        if (state.isSettled) {
          interactiveUI.classList.add('active');
        } else {
          interactiveUI.classList.remove('active');
        }
      }
    }

    // Expanding circular wave transition from center of jewellery
    if (state.isWaveTransitioning) {
      state.waveProgress += dt * 1.25;
      if (state.waveProgress >= 1.0) {
        state.waveProgress = 1.0;
        state.isWaveTransitioning = false;
        state.currentTheme = state.targetTheme;
        state.prevTheme = null;
      }
    }

    // Transition interpolation for previous/next switcher (3D Turnaround Flip)
    if (state.isTransitioning) {
      state.transitionProgress += dt * 1.25;
      if (state.transitionProgress >= 1.0) {
        state.transitionProgress = 1.0;
        state.isTransitioning = false;
        state.outgoingPiece = null;
        state.incomingPiece = null;
      }
    }

    render();
  }

  // --- 7. CANVAS RENDERER ---
  function getPieceMetrics(piece, w, h, scaleMultiplier = 1.0, floatBob = 0) {
    const maxW = Math.min(w * 0.72, 460);
    const maxH = Math.min(h * 0.44, 420);
    const pieceScale = (piece.scale || 0.8) * scaleMultiplier;
    const drawDim = Math.min(maxW, maxH) * pieceScale;
    const stoneSurfaceY = h * (piece.targetBottomYRatio || 0.584);
    const hoverGap = piece.hoverGap || 20;
    const centerToBottomPx = drawDim * (piece.centerToBottomRatio || 0.3);
    const cy = stoneSurfaceY - hoverGap + floatBob - centerToBottomPx;
    return {
      drawDim,
      drawW: drawDim,
      drawH: drawDim,
      stoneSurfaceY,
      hoverGap,
      cy,
      cx: w * 0.5
    };
  }

  // --- EXPANDING CIRCLE BACKGROUND WAVE & THEME ATMOSPHERE ---
  function drawThemeAtmosphere(theme, w, h, cx, cy, now) {
    if (!theme) return;

    // Full-screen radial ambient gradient focused on jewellery center (cx, cy)
    const maxDim = Math.hypot(w, h);
    const grad = ctx.createRadialGradient(
      cx, cy, 25,
      cx, cy, maxDim * 0.75
    );
    grad.addColorStop(0, theme.haloCenter);
    grad.addColorStop(0.32, theme.haloMid);
    grad.addColorStop(0.72, theme.ambientOuter);
    grad.addColorStop(1.0, theme.deepVignette);

    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function renderThemeAtmosphereAndWave(w, h, metrics, now) {
    const activeTheme = state.currentTheme || sanctuaryThemes.silver;

    if (!state.isWaveTransitioning) {
      drawThemeAtmosphere(activeTheme, w, h, metrics.cx, metrics.cy, now);
      return;
    }

    const t = state.waveProgress;
    // Cubic ease out for luxurious deceleration (matching expectedvideo.mov)
    const ease = 1 - Math.pow(1 - t, 3);
    const originX = state.waveOriginX || metrics.cx;
    const originY = state.waveOriginY || metrics.cy;
    const maxR = Math.hypot(Math.max(originX, w - originX), Math.max(originY, h - originY)) + 50;
    const currentR = ease * maxR;

    const prevTheme = state.prevTheme || activeTheme;
    const targetTheme = state.targetTheme || activeTheme;

    // 1. Draw PREVIOUS theme atmosphere across the full viewport
    drawThemeAtmosphere(prevTheme, w, h, originX, originY, now);

    // 2. Draw TARGET theme atmosphere clipped inside the expanding circle
    if (currentR > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(originX, originY, currentR, 0, Math.PI * 2);
      ctx.clip();
      drawThemeAtmosphere(targetTheme, w, h, originX, originY, now);
      ctx.restore();
    }

    // 3. Draw luminous glowing wavefront ring at currentR
    let ringAlpha = 1.0;
    if (t > 0.72) {
      ringAlpha = Math.max(0, (1.0 - t) / 0.28);
    }

    if (currentR > 2 && ringAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = ringAlpha;

      // Soft wide diffused glow ring
      ctx.beginPath();
      ctx.arc(originX, originY, currentR, 0, Math.PI * 2);
      ctx.lineWidth = 16;
      ctx.strokeStyle = targetTheme.ringGlow;
      ctx.filter = 'blur(10px)';
      ctx.stroke();

      // Secondary medium glow ring
      ctx.beginPath();
      ctx.arc(originX, originY, currentR, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.strokeStyle = targetTheme.ringGlow;
      ctx.filter = 'blur(4px)';
      ctx.stroke();

      // Sharp luminous core wavefront line
      ctx.beginPath();
      ctx.arc(originX, originY, currentR, 0, Math.PI * 2);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = targetTheme.ringCore;
      ctx.filter = 'none';
      ctx.stroke();

      // Concentric inner ring harmonic (like expectedvideo.mov concentric rings)
      if (currentR > 80) {
        ctx.beginPath();
        ctx.arc(originX, originY, currentR * 0.74, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = targetTheme.ringGlow;
        ctx.globalAlpha = ringAlpha * 0.35;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function render() {
    if (!ctx || !canvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const now = performance.now();

    // 1. Clear transparent canvas
    ctx.clearRect(0, 0, w, h);

    const currentItem = sanctuaryPieces[state.currentPieceIndex] || sanctuaryPieces[0];

    // Smooth, gentle levitation float (~7.5s serene cycle, 5px hovering bob)
    const floatBob = Math.sin(now * 0.0008) * 5.0;
    const floatTilt = Math.sin(now * 0.0005) * 0.5;
    const floatScale = 1.0 + Math.sin(now * 0.0006) * 0.005;

    const metrics = getPieceMetrics(currentItem, w, h, floatScale, floatBob);

    // 2. Render expanding circle background wave and theme atmosphere
    renderThemeAtmosphereAndWave(w, h, metrics, now);

    // 3. Volumetric celestial light shaft accent focused on jewellery and stone pedestal
    renderSanctuaryVolumetricBeam(w, h, metrics.cx, metrics.cy, now, state.currentTheme);

    // 4. Contact Shadow & Wet Stone Specular Sheen (Anchored firmly on the stone pedestal)
    renderStonePedestalGrounding(metrics, currentItem, floatBob, now);

    // 5. Draw 3D jewellery gently levitating above stone with 360 drag rotation
    renderSanctuaryFloatingJewellery(w, h, metrics, currentItem, floatScale, floatTilt, floatBob, now);
  }

  // Soft Volumetric Celestial Light Shaft
  function renderSanctuaryVolumetricBeam(w, h, cx, cy, now, theme) {
    const activeTheme = theme || state.currentTheme || sanctuaryThemes.silver;
    const pulse = 0.14 + Math.sin(now * 0.0006) * 0.02;
    const grad = ctx.createRadialGradient(
      cx, cy, 30,
      cx, cy, Math.max(w * 0.38, 420)
    );
    grad.addColorStop(0, (activeTheme.beamCore || 'rgba(255, 238, 195, ') + pulse + ')');
    grad.addColorStop(0.35, (activeTheme.beamMid || 'rgba(220, 185, 120, ') + (pulse * 0.45) + ')');
    grad.addColorStop(0.85, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // Contact shadow, ambient occlusion, and wet rock specular reflection on stone pedestal
  function renderStonePedestalGrounding(metrics, piece, floatBob, now) {
    const { cx, stoneSurfaceY, drawDim } = metrics;
    const shadowRx = drawDim * (piece.shadowWidthRatio || 0.36);

    // Shadow responds dynamically to levitation bob
    const bobFactor = floatBob / 5.0; // -1 to +1
    const shadowScale = 1.0 - bobFactor * 0.07;
    const shadowAlpha = 0.56 - bobFactor * 0.05;

    // 1. Ambient contact shadow on stone surface directly below piece
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, stoneSurfaceY - 3, shadowRx * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.2, shadowAlpha)})`;
    ctx.filter = 'blur(6px)';
    ctx.fill();
    ctx.restore();

    // 2. Volumetric contact shadow spreading over the wet stone facets
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, stoneSurfaceY + 5, shadowRx * 1.35 * shadowScale, 17 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.12, shadowAlpha * 0.65)})`;
    ctx.filter = 'blur(14px)';
    ctx.fill();
    ctx.restore();

    // 3. Wet stone specular metallic reflection (sheen on rock moisture matching active theme)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, stoneSurfaceY + 10, shadowRx * 0.75, 12, 0, 0, Math.PI * 2);
    const activeTheme = state.currentTheme || sanctuaryThemes.silver;
    ctx.fillStyle = activeTheme.sheen || 'rgba(215, 230, 245, 0.18)';
    ctx.filter = 'blur(10px)';
    ctx.fill();
    ctx.restore();
  }

  // Draw 3D jewellery placed above the stone pedestal with continuous levitation & interactive drag rotation
  function renderSanctuaryFloatingJewellery(w, h, metrics, currentItem, floatScale, floatTilt, floatBob, now) {
    const img = pieceHeroCache[currentItem.id];

    if (!img || !img.complete) return;

    // 3D turnaround scale on X-axis from drag rotation:
    // cos(dragRotation) creates true 3D horizontal spin foreshortening!
    let spinScaleX = Math.cos(dragRotation);
    if (Math.abs(spinScaleX) < 0.08) spinScaleX = 0.08 * Math.sign(spinScaleX || 1);

    const totalTilt = floatTilt + dragVelocity * 8;

    if (!state.isTransitioning) {
      drawFittedImage(
        img,
        w,
        h,
        (currentItem.scale || 1.0) * floatScale,
        totalTilt,
        1.0,
        spinScaleX,
        0,
        1.0,
        metrics.cy
      );
    } else {
      // 3D Turnaround Flip transition between pieces right above stone
      const p = state.transitionProgress;
      const outPiece = state.outgoingPiece || currentItem;
      const inPiece = state.incomingPiece || currentItem;
      const outImg = pieceHeroCache[outPiece.id] || img;
      const inImg = pieceHeroCache[inPiece.id] || img;
      const outMetrics = getPieceMetrics(outPiece, w, h, floatScale, floatBob);
      const inMetrics = getPieceMetrics(inPiece, w, h, floatScale, floatBob);
      const liftY = -Math.sin(p * Math.PI) * 20;

      if (p < 0.5) {
        const outP = p / 0.5;
        const flipX = Math.cos(outP * (Math.PI / 2)) * spinScaleX;
        const outScale = (outPiece.scale || 1.0) * floatScale * (1.0 + Math.sin(outP * Math.PI) * 0.06);
        const rotDeg = totalTilt + 14 * outP * state.transitionDir;
        drawFittedImage(outImg, w, h, outScale, rotDeg, 1.0 - outP * 0.25, flipX, liftY, 1.0, outMetrics.cy);
      } else {
        const inP = (p - 0.5) / 0.5;
        const flipX = Math.sin(inP * (Math.PI / 2)) * spinScaleX;
        const inScale = (inPiece.scale || 1.0) * floatScale * (1.0 + Math.sin((1 - inP) * Math.PI) * 0.06);
        const rotDeg = totalTilt - 14 * (1.0 - inP) * state.transitionDir;
        drawFittedImage(inImg, w, h, inScale, rotDeg, 0.75 + inP * 0.25, flipX, liftY, 1.0, inMetrics.cy);
      }
    }
  }

  // Draw image centered preserving aspect ratio with scale, rotation, alpha, horizontal squeeze, and explicit center
  function drawFittedImage(
    img,
    w,
    h,
    scaleMultiplier = 1.0,
    rotDeg = 0,
    alpha = 1.0,
    scaleXMultiplier = 1.0,
    yOffset = 0,
    scaleYMultiplier = 1.0,
    explicitCy = null
  ) {
    if (!img) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Center point: explicit or default settled center
    const cy = (explicitCy !== null ? explicitCy : h * 0.43) + yOffset;
    const cx = w * 0.5;

    ctx.translate(cx, cy);
    if (rotDeg !== 0) {
      ctx.rotate((rotDeg * Math.PI) / 180);
    }
    if (scaleXMultiplier !== 1.0 || scaleYMultiplier !== 1.0) {
      ctx.scale(Math.abs(scaleXMultiplier), Math.abs(scaleYMultiplier));
    }

    // Determine target size so piece breathes with luxury proportion
    const maxW = Math.min(w * 0.76, 520);
    const maxH = Math.min(h * 0.48, 500);

    const aspect = img.width / img.height;
    let drawW = maxW;
    let drawH = drawW / aspect;

    if (drawH > maxH) {
      drawH = maxH;
      drawW = drawH * aspect;
    }

    drawW *= scaleMultiplier;
    drawH *= scaleMultiplier;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();
  }

  // --- 8. PUBLIC INITIALIZER ---
  return {
    init: function () {
      initCanvas();
      initDragController();
      initScrollController();
      initInteractiveSwitcher();
      preloadSanctuaryAssets();
      requestAnimationFrame(animate);
    }
  };
})();
