/* ===================================================================
   SWARNAVEDA JEWELS — MAIN INTERACTION & ORCHESTRATION SCRIPT
   - Showroom Engine Initialization (60-Frame 3D Scroll Scrubbing)
   - Animated Heritage Counter Numbers
   - Interactive Craft Bench Explorer
   - Private Atelier Salon Booking Modal
   - Cinematic Craft Film Modal
   - Custom Cursor with Fluid Lerp & Magnetic Action Physics
   - Procedural Web Audio Chimes
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. INITIALIZE CINEMATIC SHOWROOM ENGINE ---
  if (window.SwarnaVedaShowroom && typeof window.SwarnaVedaShowroom.init === 'function') {
    window.SwarnaVedaShowroom.init();
  }

  // Support scroll query parameter for instant scroll state testing
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('scroll')) {
    const targetScroll = parseInt(urlParams.get('scroll'), 10);
    window.scrollTo(0, targetScroll);
  }


  // --- 2. SIGNATURE LIGHT SWEEP TRANSITION ---
  const lightSweepBeam = document.getElementById('light-sweep-beam');
  function triggerLightSweep(callback) {
    if (!lightSweepBeam) return;
    lightSweepBeam.classList.remove('active');
    void lightSweepBeam.offsetWidth; // force reflow
    lightSweepBeam.classList.add('active');

    if (callback) {
      setTimeout(callback, 700);
    }

    setTimeout(() => {
      lightSweepBeam.classList.remove('active');
    }, 1500);
  }
  window.triggerLightSweep = triggerLightSweep;

  // --- 3. CUSTOM CURSOR WITH FLUID LERP ---
  const cursorRing = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover states on interactive elements
  function refreshHoverTargets() {
    const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .craft-step-tab, .patron-card, .pillar-badge-card, .magnetic-action');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => cursorRing?.classList.add('active'));
      target.addEventListener('mouseleave', () => cursorRing?.classList.remove('active'));
    });
  }
  refreshHoverTargets();

  // --- 4. MAGNETIC BUTTON EFFECT ---
  const magneticButtons = document.querySelectorAll('.magnetic-action');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // --- 5. SCROLL PROGRESS & NAVBAR ADAPTATION ---
  const nav = document.getElementById('site-nav');
  const progressBar = document.getElementById('scroll-progress-bar');
  const lightSections = document.querySelectorAll('.light-section, .pillars-section, .patrons-section');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (nav) {
      if (scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    // Light Section Detection for dark/light nav contrast
    let isOverLightSection = false;
    const navHeight = 80;

    lightSections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= navHeight && rect.bottom >= navHeight) {
        isOverLightSection = true;
      }
    });

    if (isOverLightSection) {
      document.body.classList.add('on-light-section');
    } else {
      document.body.classList.remove('on-light-section');
    }
  }, { passive: true });

  // --- 6. ANIMATED HERITAGE STATS COUNTER ---
  const statValues = document.querySelectorAll('.stat-val');
  let hasAnimatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimatedStats) {
        hasAnimatedStats = true;
        statValues.forEach((el) => {
          const target = parseInt(el.getAttribute('data-target') || '0', 10);
          const duration = 2000;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1.0);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * target);
            el.textContent = String(currentVal).padStart(target < 10 ? 2 : 1, '0');

            if (progress < 1.0) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = String(target).padStart(target < 10 ? 2 : 1, '0');
            }
          }

          requestAnimationFrame(updateCount);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsContainer = document.querySelector('.heritage-stats-counter');
  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }

  // --- 7. CRAFT BENCH INTERACTIVE TABS ---
  const craftTabs = document.querySelectorAll('.craft-step-tab');
  const craftPanels = document.querySelectorAll('.craft-step-panel');

  craftTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetStep = tab.getAttribute('data-step');

      craftTabs.forEach((t) => t.classList.remove('active'));
      craftPanels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`craft-step-${targetStep}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      if (window.SwaranavedaAudio) {
        window.SwaranavedaAudio.triggerChime();
      }
    });
  });

  // --- 8. PRIVATE ATELIER SALON APPOINTMENT MODAL ---
  const appointmentModal = document.getElementById('appointment-modal');
  const openAppointmentBtns = document.querySelectorAll('.open-appointment-modal');
  const closeAppointmentBtn = document.getElementById('close-appointment-modal');
  const appointmentForm = document.getElementById('appointment-form');

  openAppointmentBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      appointmentModal?.classList.add('active');
      if (window.SwaranavedaAudio) {
        window.SwaranavedaAudio.triggerChime();
      }
    });
  });

  if (closeAppointmentBtn) {
    closeAppointmentBtn.addEventListener('click', () => {
      appointmentModal?.classList.remove('active');
    });
  }

  appointmentModal?.addEventListener('click', (e) => {
    if (e.target === appointmentModal) {
      appointmentModal.classList.remove('active');
    }
  });

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for requesting a private salon appointment. Our Senior Atelier Concierge from Guwahati will contact you within 2 business hours.');
      appointmentModal?.classList.remove('active');
      appointmentForm.reset();
    });
  }

  // --- 9. CINEMATIC CRAFT FILM MODAL ---
  const videoModal = document.getElementById('craft-video-modal');
  const openVideoBtns = document.querySelectorAll('.open-craft-video');
  const closeVideoBtn = document.getElementById('close-video-modal');
  const craftVideoElem = document.getElementById('craft-video-player');

  openVideoBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal?.classList.add('active');
      if (craftVideoElem) {
        craftVideoElem.currentTime = 0;
        craftVideoElem.play().catch(() => {});
      }
      if (window.SwaranavedaAudio) {
        window.SwaranavedaAudio.triggerChime();
      }
    });
  });

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', () => {
      videoModal?.classList.remove('active');
      if (craftVideoElem) {
        craftVideoElem.pause();
      }
    });
  }

  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      videoModal.classList.remove('active');
      if (craftVideoElem) {
        craftVideoElem.pause();
      }
    }
  });

  // ESC key closes any open modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      appointmentModal?.classList.remove('active');
      videoModal?.classList.remove('active');
      if (craftVideoElem) craftVideoElem.pause();
    }
  });

  // --- 10. SOUND TOGGLE BUTTON ---
  const soundBtn = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (soundBtn && window.SwaranavedaAudio) {
    soundBtn.addEventListener('click', () => {
      const isPlaying = window.SwaranavedaAudio.toggle();
      if (soundIcon) {
        soundIcon.setAttribute('data-lucide', isPlaying ? 'volume-2' : 'volume-x');
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    });
  }

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
