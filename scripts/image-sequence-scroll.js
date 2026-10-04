/* Scroll-derived entrance into a fixed atelier vitrine. One featured piece is shown at a time. */
(() => {
  'use strict';
  const config = window.SWARNAVEDA_SEQUENCE;
  const showroom = window.SWARNAVEDA_CONFIG;
  const track = document.getElementById('hero-scroll-experience');
  const canvas = document.getElementById('hero-scroll-canvas');
  if (!config || !track || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  const heroCache = new Map();
  const contentBoundsCache = new WeakMap();
  const knownContentBounds = {
    'gold-necklace': { x: 644, y: 328, width: 644, height: 557 },
    'diamond-necklace': { x: 59, y: 231, width: 906, height: 599 },
    'silver-necklace': { x: 65, y: 273, width: 893, height: 480 }
  };
  const categories = ['gold', 'diamond', 'silver'];
  let currentCategory = 'gold';
  let currentPieceIndex = 0;
  let selectedItem = showroom?.collections?.gold?.items?.find((item) => item.type === 'NECKLACE') || showroom?.collections?.gold?.items?.[0] || null;
  let currentProgress = 0;
  let targetProgress = 0;
  let dpr = 1;
  let mobile = matchMedia(`(max-width: ${config.mobileMaxWidth}px)`).matches;
  let drawnKey = '';
  let transition = null;
  let rafPending = false;
  let progressFrame = 0;
  let lastProgressFrame = 0;
  const showcaseUI = document.getElementById('showcase-interactive-ui');

  function featuredItem(category, index = 0) {
    const items = showroom?.collections?.[category]?.items || [];
    return items.find((item) => item.type === 'NECKLACE') || items[index] || null;
  }
  function imageFor(item) {
    if (!item) return null;
    if (heroCache.has(item.id)) return heroCache.get(item.id);
    const image = new Image();
    heroCache.set(item.id, image);
    image.onload = () => {
      contentBoundsCache.set(image, knownContentBounds[item.id] || findVisibleBounds(image));
      drawnKey = ''; draw();
    };
    image.src = item.id === 'gold-necklace'
      ? `${config.desktopFolder}gold-necklace-hero.png`
      : item.heroImage;
    return image;
  }
  function imageReady(image) {
    if (!image) return false;
    if (typeof image.naturalWidth === 'number') return image.complete && image.naturalWidth > 0;
    return image.width > 0 && image.height > 0;
  }
  function findVisibleBounds(image) {
    const width = image?.naturalWidth || image?.width;
    const height = image?.naturalHeight || image?.height;
    if (!width || !height) return null;
    try {
      const probe = document.createElement('canvas');
      probe.width = width; probe.height = height;
      const probeCtx = probe.getContext('2d', { willReadFrequently: true });
      probeCtx.drawImage(image, 0, 0);
      const pixels = probeCtx.getImageData(0, 0, width, height).data;
      let minX = width, minY = height, maxX = -1, maxY = -1;
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          if (pixels[(y * width + x) * 4 + 3] > 24) {
            minX = Math.min(minX, x); minY = Math.min(minY, y);
            maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
          }
        }
      }
      return maxX >= minX ? { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 } : { x: 0, y: 0, width, height };
    } catch (_) {
      return { x: 0, y: 0, width, height };
    }
  }
  function smooth(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
  function updateDetails() {
    if (!selectedItem) return;
    const put = (id, value) => { const el = document.getElementById(id); if (el && value) el.textContent = value; };
    const openingNotes = {
      gold: ['THE GOLD ATELIER · 01 / 03', 'Made to be kept.', 'An Assamese heirloom, shaped in luminous 22K gold.'],
      diamond: ['THE DIAMOND ATELIER · 02 / 03', 'Light, held in form.', 'A river of brilliant diamonds, set in sculptural platinum.'],
      silver: ['THE SILVER ATELIER · 03 / 03', 'Quietly enduring.', 'Hand-worked sterling silver, revealed in moonlit contrast.']
    }[currentCategory];
    if (openingNotes) {
      put('opening-note-index', openingNotes[0]);
      put('opening-note-title', openingNotes[1]);
      put('opening-note-copy', openingNotes[2]);
    }
    put('showcase-piece-type', selectedItem.type);
    put('showcase-piece-title', selectedItem.title);
    put('showcase-piece-subtitle', selectedItem.subtitle);
    put('showcase-piece-desc', selectedItem.description);
    const specs = document.getElementById('showcase-piece-specs');
    if (specs && selectedItem.specs) specs.innerHTML = selectedItem.specs.slice(0, 2).map((item) => `<span>✦ ${item}</span>`).join('');
    put('counter-current', String(categories.indexOf(currentCategory) + 1).padStart(2, '0'));
    put('counter-total', '03');
    document.querySelectorAll('.cat-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.cat === currentCategory));
    canvas.setAttribute('aria-label', `${currentCategory} material story. ${selectedItem.title}. Scroll to reveal, then select another featured story.`);
  }
  function setTheme(category) {
    const env = showroom?.environments?.[category];
    if (!env) return;
    const root = document.documentElement;
    root.dataset.collectionTheme = category;
    root.style.setProperty('--color-obsidian', env.bgPrimary);
    root.style.setProperty('--color-obsidian-subtle', category === 'gold' ? '#1b1008' : '#101922');
    root.style.setProperty('--color-obsidian-surface', category === 'gold' ? '#21160f' : '#151e28');
    root.style.setProperty('--color-champagne-gold', env.accent);
    root.style.setProperty('--color-champagne-pearl', env.accentSecondary);
    const viewport = document.querySelector('.hero-sticky-viewport');
    if (viewport) {
      viewport.classList.remove('env-gold', 'env-diamond', 'env-silver');
      viewport.classList.add(`env-${category}`);
    }
    canvas.style.setProperty('--jewel-accent', env.accent);
  }
  function selectCategory(category, direction = 1) {
    if (!showroom?.collections?.[category]?.items?.length || category === currentCategory) return;
    const nextItem = featuredItem(category);
    if (!nextItem) return;
    const oldImage = imageFor(selectedItem);
    const nextImage = imageFor(nextItem);
    transition = { oldCategory: currentCategory, oldImage, oldItem: selectedItem, nextImage, nextItem, direction, started: null, duration: 1320 };
    currentCategory = category;
    currentPieceIndex = 0;
    selectedItem = nextItem;
    setTheme(category);
    const titleRail = document.querySelector('.showcase-meta-content');
    if (titleRail?.animate) titleRail.animate(
      [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 720, easing: 'cubic-bezier(.16,1,.3,1)' }
    );
    // Let the new metal tone bloom out from the centre of the piece and wash
    // across the page while the two centred product images crossfade.
    const wash = document.getElementById('collection-color-wash');
    const accent = showroom?.environments?.[category]?.accent;
    if (wash && accent) {
      wash.style.setProperty('--wash-color', accent);
      wash.classList.remove('is-active');
      requestAnimationFrame(() => wash.classList.add('is-active'));
      setTimeout(() => wash.classList.remove('is-active'), 1300);
    }
    updateDetails();
    drawnKey = '';
    requestAnimationFrame(draw);
  }
  function sizeCanvas() {
    dpr = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5);
    const w = innerWidth, h = innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); drawnKey = ''; draw();
  }
  function hexRgb(hex) {
    const value = (hex || '#21160f').replace('#', '');
    return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
  }
  function entrance(progress) {
    // The necklace keeps travelling down as scroll advances, glides through a
    // short settle, then follows the rising chapter out. This is derived only
    // from scroll progress, so reversing scroll retraces the same path.
    const arrive = smooth(progress / 0.80);
    const settle = smooth((progress - 0.60) / 0.22);
    const depart = smooth((progress - 0.82) / 0.18);
    return {
      // Fixed right-hand stage on wide screens. This is a layout anchor, not
      // scroll motion, so the piece still travels only on the vertical axis.
      x: !mobile && innerWidth >= 1200 ? 0.14 : 0,
      // Start above the vitrine, travel down into it over most of the scroll,
      // drift a few pixels while settling, then follow the page into the handoff.
      y: (innerWidth >= 1200 ? 0.06 : 0) - 0.025 + 0.055 * arrive + 0.01 * settle + 0.18 * depart,
      // Compensate for generous negative space in the Blender render without
      // changing the horizontal anchor or distorting the jewellery.
      // One steady product scale from the opening into the vitrine. The visible
      // image bounds below provide the same fit for Blender and category renders.
      scale: mobile ? 0.92 : 1,
      rotation: 0,
      alpha: 1 - smooth((progress - 0.97) / 0.03)
    };
  }
  function drawImage(image, item, x, y, scale, rotation, alpha, blend = 'source-over') {
    const imageWidth = image?.naturalWidth || image?.width;
    const imageHeight = image?.naturalHeight || image?.height;
    if (!imageWidth || !imageHeight || image.complete === false || alpha <= 0) return;
    const w = innerWidth, h = innerHeight;
    const bounds = contentBoundsCache.get(image) || findVisibleBounds(image) || { x: 0, y: 0, width: imageWidth, height: imageHeight };
    contentBoundsCache.set(image, bounds);
    const fitW = mobile ? w * 0.60 : Math.min(w * (w >= 1200 ? 0.34 : 0.27), w >= 1200 ? 620 : 560);
    const fitH = mobile ? h * 0.28 : h * (w >= 1200 ? 0.38 : 0.28);
    // Fit the visible silhouette, not the file canvas. The source cut-outs have
    // different transparent margins; using their alpha bounds keeps all metals
    // optically centered and consistently sized without scaling the model.
    const fit = Math.min(fitW / bounds.width, fitH / bounds.height);
    const drawScale = scale;
    const dw = imageWidth * fit * drawScale;
    const dh = imageHeight * fit * drawScale;
    ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = blend;
    ctx.translate(w * (0.5 + x), h * (0.5 + y)); ctx.rotate(rotation * Math.PI / 180);
    ctx.drawImage(image, -(bounds.x + bounds.width / 2) * fit * drawScale, -(bounds.y + bounds.height / 2) * fit * drawScale, dw, dh); ctx.restore();
  }
  function draw() {
    const w = innerWidth, h = innerHeight, p = currentProgress;
    const itemImage = imageFor(selectedItem);
    const trans = transition;
    const nextReady = trans ? imageReady(trans.nextImage) : imageReady(itemImage);
    const fallbackReady = trans && imageReady(trans.oldImage);
    if (!nextReady && !fallbackReady) return;
    if (trans && nextReady && trans.started === null) trans.started = performance.now();
    const transT = trans ? (trans.started === null ? 0 : Math.min(1, (performance.now() - trans.started) / trans.duration)) : 1;
    const key = `${p.toFixed(4)}:${currentCategory}:${trans ? transT.toFixed(3) : 'idle'}:${w}x${h}`;
    ctx.clearRect(0, 0, w, h);
    const env = showroom?.environments?.[currentCategory];
    const previousEnv = trans ? showroom?.environments?.[trans.oldCategory] : env;
    const colorTarget = hexRgb(env?.bgPrimary);
    const colorStart = hexRgb(previousEnv?.bgPrimary);
    const accentTarget = hexRgb(env?.accent);
    const accentStart = hexRgb(previousEnv?.accent);
    const mixColor = (from, to) => from.map((v, i) => Math.round(v + (to[i] - v) * smooth(trans ? transT : 1)));
    const color = mixColor(colorStart, colorTarget);
    const accent = mixColor(accentStart, accentTarget);
    const themeEase = smooth(Math.min(p / 0.28, 1));
    const heroOpacity = 1 - smooth((p - 0.84) / 0.16);
    const pose = entrance(p);
    ctx.fillStyle = `rgba(${color.join(',')},${(0.78 + themeEase * 0.22) * heroOpacity})`;
    ctx.fillRect(0, 0, w, h);
    const lightX = w * (.5 + pose.x), lightY = h * (.5 + pose.y);
    const glow = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, Math.max(w, h) * .48);
    glow.addColorStop(0, `rgba(${accent.join(',')},${0.095 * (0.75 + themeEase * 0.25) * heroOpacity})`);
    glow.addColorStop(.48, `rgba(${accent.join(',')},${0.032 * (0.75 + themeEase * 0.25) * heroOpacity})`);
    glow.addColorStop(1, `rgba(${accent.join(',')},0)`);
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

    // Draw in with the arrival, keep the full vitrine locked around the
    // stationary necklace, and fade it only during the final handoff.
    const ringT = smooth((p - 0.08) / 0.20) * (1 - smooth((p - 0.82) / 0.18));
    if (ringT > 0.001) {
      const diameter = mobile ? Math.min(w * .68, h * .40, 340) : Math.min(w * (w >= 1200 ? .31 : .32), h * (w >= 1200 ? .54 : .46), w >= 1200 ? 620 : 520);
      const cx = w * (.5 + pose.x), cy = h * (w >= 1200 ? .56 : .50);
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + Math.PI * 2 * ringT;
      ctx.save();
      ctx.globalAlpha = smooth(p / 0.10) * (1 - smooth((p - 0.84) / 0.16));
      ctx.strokeStyle = `rgba(${accent.join(',')},.43)`;
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      ctx.arc(cx, cy, diameter * .5, startAngle, endAngle);
      ctx.stroke();
      ctx.globalAlpha = smooth(p / 0.10) * .38 * (1 - smooth((p - 0.84) / 0.16));
      ctx.strokeStyle = `rgba(${accent.join(',')},.22)`;
      ctx.setLineDash([2, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, diameter * .5 + 8, startAngle, endAngle);
      ctx.stroke();
      ctx.restore();
    }

    if (trans && !nextReady) {
      // Keep the outgoing piece rendered while the next local asset loads.
      // Starting the timed crossfade only after load avoids a blank/frozen beat.
      drawImage(trans.oldImage, trans.oldItem, pose.x, pose.y, pose.scale, 0, pose.alpha,
        trans.oldItem?.id === 'gold-necklace' ? 'lighten' : 'source-over');
    } else if (trans && transT < 1) {
      const t = smooth(transT);
      // Keep the jewellery on the same centre line: the change reads as a
      // luminous material transformation, never as a lateral carousel swipe.
      drawImage(trans.oldImage, trans.oldItem, pose.x, pose.y, pose.scale, 0, 1 - t,
        trans.oldItem?.id === 'gold-necklace' ? 'lighten' : 'source-over');
      drawImage(trans.nextImage, trans.nextItem, pose.x, pose.y, pose.scale, 0, t,
        trans.nextItem?.id === 'gold-necklace' ? 'lighten' : 'source-over');
      requestAnimationFrame(draw);
    } else {
      transition = null;
      drawImage(itemImage, selectedItem, pose.x, pose.y, pose.scale, pose.rotation, pose.alpha, selectedItem?.id === 'gold-necklace' ? 'lighten' : 'source-over');
    }

    drawnKey = key;
  }
  function renderScrollState() {
    draw();
    const arrived = smooth((currentProgress - .16) / .12);
    const leave = 1 - smooth((currentProgress - .84) / .12);
    const reveal = arrived * leave;
    const viewport = document.querySelector('.hero-sticky-viewport');
    if (viewport) {
      const backdrop = 1 - smooth((currentProgress - .84) / .16);
      viewport.style.background = `radial-gradient(circle at 50% 48%, rgba(44,28,16,${.45 * backdrop}) 0%, rgba(24,15,9,${.65 * backdrop}) 50%, rgba(11,10,8,${backdrop}) 100%)`;
    }
    if (showcaseUI) {
      showcaseUI.classList.toggle('active', reveal > .08);
      showcaseUI.style.opacity = String(reveal);
    }
    const intro = document.querySelector('.hero-intro-header');
    if (intro) { const opacity = 1 - smooth((currentProgress - .035) / .125); intro.style.opacity = String(opacity); intro.style.pointerEvents = opacity < .08 ? 'none' : 'auto'; }
    const signature = document.getElementById('hero-product-signature');
    if (signature) signature.style.opacity = String(1 - smooth((currentProgress - .10) / .12));
    const cue = document.getElementById('hero-scroll-indicator');
    if (cue) cue.style.opacity = String(1 - smooth(currentProgress / .18));
    const outletContent = document.querySelector('#section-showroom .showroom-dialogue-content');
    if (outletContent) {
      outletContent.style.opacity = String(smooth((currentProgress - .96) / .04));
      outletContent.style.pointerEvents = currentProgress > .99 ? 'auto' : 'none';
    }
    // The next chapter's surface can rise behind the jewel during its exit;
    // reveal its copy only as the hero has cleared the frame.
    const nextStory = document.getElementById('heritage-story');
    if (nextStory) {
      const storyReveal = smooth((currentProgress - .982) / .018);
      nextStory.style.opacity = String(storyReveal);
      nextStory.style.pointerEvents = storyReveal > .98 ? 'auto' : 'none';
    }
    const fill = document.getElementById('hero-timeline-progress');
    if (fill) fill.style.width = `${currentProgress * 100}%`;
    canvas.dataset.progress = currentProgress.toFixed(4);
  }
  function advanceProgress(now) {
    const dt = Math.min((now - lastProgressFrame) / 1000, 0.05);
    lastProgressFrame = now;
    const difference = targetProgress - currentProgress;
    currentProgress += difference * (1 - Math.exp(-dt * 30));
    if (Math.abs(targetProgress - currentProgress) < 0.00012) currentProgress = targetProgress;
    renderScrollState();
    if (currentProgress !== targetProgress) progressFrame = requestAnimationFrame(advanceProgress);
    else progressFrame = 0;
  }
  function updateFromScroll() {
    rafPending = false;
    const distance = track.offsetHeight - innerHeight;
    targetProgress = distance > 0 ? Math.max(0, Math.min(1, -track.getBoundingClientRect().top / distance)) : 0;
    if (!progressFrame) {
      lastProgressFrame = performance.now();
      progressFrame = requestAnimationFrame(advanceProgress);
    }
  }
  function scheduleUpdate() { if (rafPending) return; rafPending = true; requestAnimationFrame(updateFromScroll); }
  document.querySelectorAll('.cat-pill').forEach((pill) => pill.addEventListener('click', (event) => {
    event.preventDefault(); const direction = categories.indexOf(pill.dataset.cat) >= categories.indexOf(currentCategory) ? 1 : -1;
    selectCategory(pill.dataset.cat, direction);
  }));
  const step = (direction) => selectCategory(categories[(categories.indexOf(currentCategory) + direction + categories.length) % categories.length], direction);
  document.getElementById('btn-prev-piece')?.addEventListener('click', (event) => { event.preventDefault(); step(-1); });
  document.getElementById('btn-next-piece')?.addEventListener('click', (event) => { event.preventDefault(); step(1); });
  track.style.height = `${config.stickyTrackVh}vh`;
  setTheme('gold'); updateDetails();
  sizeCanvas();
  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', () => { mobile = matchMedia(`(max-width: ${config.mobileMaxWidth}px)`).matches; drawnKey = ''; sizeCanvas(); scheduleUpdate(); }, { passive: true });
  scheduleUpdate();
})();
