/* ===================================================================
   SWARANAVEDA JEWELS — CINEMATIC CANVAS & MOTION SIMULATIONS
   1. Opening Studio Atmosphere & Light Expansion
   2. Chapter 01: Light Beam Sweep Across Luxury Textures
   3. Chapter 04: Molten Champagne Gold Liquid Silk Simulation
   4. Chapter 06: Macro Gemstone Prism & Caustic Dispersion
   =================================================================== */

window.SwaranavedaCinematics = (function () {
  'use strict';

  // Keep decorative canvas work off the main thread budget when its chapter is
  // out of view. Several of these canvases belong to hidden editorial sections.
  function animateOnlyWhenVisible(canvas, paint) {
    let visible = false;
    let frameId = 0;
    const tick = () => {
      frameId = 0;
      if (!visible || document.hidden) return;
      paint();
      frameId = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (visible && !document.hidden && !frameId) frameId = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else if (frameId) { cancelAnimationFrame(frameId); frameId = 0; }
    }, { rootMargin: '80px' });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && frameId) { cancelAnimationFrame(frameId); frameId = 0; }
      else schedule();
    });
  }

  // --- 1. OPENING ATMOSPHERE CANVAS ---
  function initOpeningCanvas() {
    const canvas = document.getElementById('opening-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Illuminated studio dust particles
    const particles = [];
    const particleCount = 110;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.45 - 0.1, // gently rising
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    function renderOpening() {
      ctx.clearRect(0, 0, width, height);

      // Central soft champagne volumetric cone
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.65
      );
      grad.addColorStop(0, 'rgba(238, 223, 198, 0.12)');
      grad.addColorStop(0.3, 'rgba(200, 169, 107, 0.05)');
      grad.addColorStop(0.8, 'rgba(44, 10, 19, 0.06)');
      grad.addColorStop(1, 'rgba(20, 4, 7, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Abstract golden architectural ribbon perspective
      ctx.strokeStyle = 'rgba(200, 169, 107, 0.07)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 5; r++) {
        ctx.beginPath();
        const yOffset = Math.sin(time * 0.001 + r) * 30;
        ctx.ellipse(width / 2, height / 2 + yOffset, (width * 0.18) * r, (height * 0.12) * r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw and update dust particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));

        ctx.fillStyle = `rgba(231, 216, 189, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 16;
    }
    animateOnlyWhenVisible(canvas, renderOpening);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  // --- 2. CHAPTER 01: LIGHT BEAM SWEEP ---
  function initLightBeamCanvas() {
    const canvas = document.getElementById('light-beam-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || window.innerHeight);

    let beamX = -200;
    const beamSpeed = 3.2;

    const textureItems = document.querySelectorAll('.texture-item');

    function renderLightBeam() {
      ctx.clearRect(0, 0, width, height);

      beamX += beamSpeed;
      if (beamX > width + 300) {
        beamX = -200;
      }

      // Draw sweeping champagne beam
      const beamGrad = ctx.createLinearGradient(beamX - 160, 0, beamX + 160, 0);
      beamGrad.addColorStop(0, 'rgba(200, 169, 107, 0)');
      beamGrad.addColorStop(0.4, 'rgba(200, 169, 107, 0.08)');
      beamGrad.addColorStop(0.5, 'rgba(231, 216, 189, 0.45)');
      beamGrad.addColorStop(0.6, 'rgba(200, 169, 107, 0.08)');
      beamGrad.addColorStop(1, 'rgba(200, 169, 107, 0)');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      // Angled light slice
      ctx.moveTo(beamX - 80, 0);
      ctx.lineTo(beamX + 80, 0);
      ctx.lineTo(beamX + 20, height);
      ctx.lineTo(beamX - 140, height);
      ctx.closePath();
      ctx.fill();

      // Check collision with texture items to light them up
      textureItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const itemCenterX = rect.left - canvasRect.left + rect.width / 2;

        if (Math.abs(beamX - itemCenterX) < 140) {
          item.classList.add('lit');
        } else {
          item.classList.remove('lit');
        }
      });

    }
    animateOnlyWhenVisible(canvas, renderLightBeam);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    });
  }

  // --- 3. CHAPTER 04: MOLTEN CHAMPAGNE GOLD LIQUID SILK SIMULATION ---
  function initMoltenCanvas() {
    const canvas = document.getElementById('molten-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        targetMouseX = e.touches[0].clientX - rect.left;
        targetMouseY = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    // Gold silk ribbon control points
    const ribbons = [];
    const ribbonCount = 5;

    for (let r = 0; r < ribbonCount; r++) {
      const points = [];
      const numPoints = 18;
      for (let p = 0; p < numPoints; p++) {
        points.push({
          x: (p / (numPoints - 1)) * width,
          y: height / 2 + (r - ribbonCount / 2) * 40,
          vy: 0,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.015
        });
      }
      ribbons.push({
        points: points,
        width: 14 + r * 6,
        colorGold: `rgba(${200 + r * 6}, ${169 + r * 8}, ${107 + r * 10}, 0.65)`,
        highlight: `rgba(231, 216, 189, ${0.4 - r * 0.05})`
      });
    }

    // Swaranaveda Stardust Particles that coalesce
    const stardust = [];
    const stardustCount = 140;
    for (let s = 0; s < stardustCount; s++) {
      stardust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: width / 2 + (Math.random() - 0.5) * 400,
        originY: height / 2 + (Math.random() - 0.5) * 120,
        size: Math.random() * 2.2 + 0.8,
        speed: Math.random() * 0.04 + 0.01,
        t: Math.random()
      });
    }

    let time = 0;

    function renderMolten() {
      // Gentle trailing fade for liquid fluidity over royal wine velvet
      ctx.fillStyle = 'rgba(20, 4, 7, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Render each liquid silk ribbon
      ribbons.forEach((ribbon, rIndex) => {
        const pts = ribbon.points;

        for (let i = 0; i < pts.length; i++) {
          const pt = pts[i];
          pt.phase += pt.speed;

          // Organic harmonic wave
          const baseOffset = Math.sin(pt.phase + time * 0.002) * 80 + Math.cos(pt.phase * 0.7) * 45;

          // Mouse attraction / disturbance
          const distToMouse = Math.hypot(pt.x - mouseX, pt.y - mouseY);
          let mouseInfluence = 0;
          if (distToMouse < 260) {
            mouseInfluence = (1 - distToMouse / 260) * (mouseY - height / 2) * 0.85;
          }

          pt.y = height / 2 + (rIndex - ribbonCount / 2) * 35 + baseOffset + mouseInfluence;
        }

        // Draw smooth bezier curve through points
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);

        for (let i = 1; i < pts.length - 2; i++) {
          const xc = (pts[i].x + pts[i + 1].x) / 2;
          const yc = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        ctx.quadraticCurveTo(
          pts[pts.length - 2].x,
          pts[pts.length - 2].y,
          pts[pts.length - 1].x,
          pts[pts.length - 1].y
        );

        ctx.strokeStyle = ribbon.colorGold;
        ctx.lineWidth = ribbon.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // High gloss champagne specular highlight
        ctx.strokeStyle = ribbon.highlight;
        ctx.lineWidth = ribbon.width * 0.35;
        ctx.stroke();
      });

      // Render stardust particles coalescing
      for (let s = 0; s < stardustCount; s++) {
        const star = stardust[s];
        star.t += star.speed;
        if (star.t > 1) {
          star.t = 0;
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }

        // Lerp toward center formation
        const curX = star.x + (star.originX - star.x) * (star.t * 0.7);
        const curY = star.y + (star.originY - star.y) * (star.t * 0.7);

        ctx.fillStyle = `rgba(231, 216, 189, ${0.8 - star.t * 0.4})`;
        ctx.beginPath();
        ctx.arc(curX, curY, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 16;
    }
    animateOnlyWhenVisible(canvas, renderMolten);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    });
  }

  // --- 4. CHAPTER 06: GEMSTONE CAUSTIC DISPERSION & PRISM CANVAS ---
  function initMacroPrismCanvas() {
    const canvas = document.getElementById('macro-prism-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement.clientHeight || 500);

    let lightAngle = 0;
    let targetAngle = 0;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = e.clientX - rect.left - cx;
      const dy = e.clientY - rect.top - cy;
      targetAngle = Math.atan2(dy, dx);
    });

    const facetLines = [
      { x1: 0.2, y1: 0.2, x2: 0.8, y2: 0.2 },
      { x1: 0.8, y1: 0.2, x2: 0.9, y2: 0.8 },
      { x1: 0.9, y1: 0.8, x2: 0.1, y2: 0.8 },
      { x1: 0.1, y1: 0.8, x2: 0.2, y2: 0.2 },
      { x1: 0.35, y1: 0.35, x2: 0.65, y2: 0.35 },
      { x1: 0.65, y1: 0.35, x2: 0.72, y2: 0.65 },
      { x1: 0.72, y1: 0.65, x2: 0.28, y2: 0.65 },
      { x1: 0.28, y1: 0.65, x2: 0.35, y2: 0.35 },
    ];

    function renderPrism() {
      ctx.clearRect(0, 0, width, height);

      lightAngle += (targetAngle - lightAngle) * 0.08;

      // Draw rainbow chromatic dispersion rays
      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      const rayCount = 12;
      for (let r = 0; r < rayCount; r++) {
        const angle = lightAngle + (r / rayCount) * Math.PI * 0.8 - 0.4;
        const rayLen = width * 0.6;
        const rx = Math.cos(angle) * rayLen;
        const ry = Math.sin(angle) * rayLen;

        const rayGrad = ctx.createLinearGradient(0, 0, rx, ry);
        const hue = (r * 30 + 35) % 360; // Champagne to subtle spectrum
        rayGrad.addColorStop(0, `hsla(${hue}, 80%, 75%, 0.4)`);
        rayGrad.addColorStop(0.5, `hsla(${hue + 20}, 70%, 65%, 0.15)`);
        rayGrad.addColorStop(1, 'transparent');

        ctx.strokeStyle = rayGrad;
        ctx.lineWidth = 3 + (r % 3) * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(rx, ry);
        ctx.stroke();
      }

      ctx.restore();

      // Dynamic facet flash lines
      ctx.lineWidth = 1.5;
      facetLines.forEach((f, idx) => {
        const x1 = f.x1 * width;
        const y1 = f.y1 * height;
        const x2 = f.x2 * width;
        const y2 = f.y2 * height;

        const flashIntensity = 0.3 + 0.7 * Math.abs(Math.sin(lightAngle * 2 + idx));
        ctx.strokeStyle = `rgba(231, 216, 189, ${flashIntensity * 0.75})`;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

    }
    animateOnlyWhenVisible(canvas, renderPrism);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.clientWidth || 500;
      height = canvas.height = canvas.parentElement.clientHeight || 500;
    });
  }

  return {
    init: function () {
      initOpeningCanvas();
      initLightBeamCanvas();
      initMoltenCanvas();
      initMacroPrismCanvas();
    }
  };
})();
