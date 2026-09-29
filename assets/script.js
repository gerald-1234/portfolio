"use strict";

(() => {
  document.documentElement.classList.add('has-js');

  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.scroll-progress span');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const updateScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${percentage}%`;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuToggle.innerHTML = `<img class="icon" src="/assets/icons/${isOpen ? 'x' : 'menu'}.svg" alt="" aria-hidden="true" />`;
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.innerHTML = '<img class="icon" src="/assets/icons/menu.svg" alt="" aria-hidden="true" />';
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealItems.forEach((element) => revealObserver.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const tickerTrack = document.querySelector('[data-ticker]');
  if (tickerTrack) {
    const tickerRun = tickerTrack.querySelector('.ticker-run');
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pxPerSecond = 50;
    let frame = 0;

    const buildTicker = () => {
      tickerTrack.querySelectorAll('.ticker-run[data-clone]').forEach((clone) => clone.remove());

      if (reduceQuery.matches) {
        tickerTrack.classList.remove('is-animated');
        tickerTrack.style.removeProperty('--ticker-shift');
        tickerTrack.style.removeProperty('--ticker-duration');
        tickerRun.style.removeProperty('width');
        return;
      }

      tickerRun.style.removeProperty('width');
      const unit = Math.ceil(tickerRun.getBoundingClientRect().width);
      if (!unit) return;

      tickerRun.style.width = `${unit}px`;
      const copies = Math.max(2, Math.ceil((window.innerWidth * 2) / unit) + 1);
      for (let index = 1; index < copies; index += 1) {
        const clone = tickerRun.cloneNode(true);
        clone.dataset.clone = '';
        clone.setAttribute('aria-hidden', 'true');
        tickerTrack.appendChild(clone);
      }

      tickerTrack.style.setProperty('--ticker-shift', `${-unit}px`);
      tickerTrack.style.setProperty('--ticker-duration', `${(unit / pxPerSecond).toFixed(2)}s`);
      tickerTrack.classList.remove('is-animated');
      void tickerTrack.offsetWidth;
      tickerTrack.classList.add('is-animated');
    };

    const scheduleTicker = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(buildTicker);
    };

    window.addEventListener('resize', scheduleTicker, { passive: true });
    reduceQuery.addEventListener('change', scheduleTicker);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleTicker, () => {});
    }
    buildTicker();
  }

  const canvas = document.querySelector('.signal-field');
  const context = canvas.getContext('2d');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: -1000, y: -1000 };
  const gridSize = 64;
  const frameInterval = 1000 / 30;
  const gridCanvas = document.createElement('canvas');
  const gridContext = gridCanvas.getContext('2d');
  let width = 0;
  let height = 0;
  let scale = 1;
  let particles = [];
  let lastFrame = 0;
  let frameHandle = 0;

  const paintGrid = () => {
    gridCanvas.width = (width + gridSize) * scale;
    gridCanvas.height = (height + gridSize) * scale;
    const grid = gridContext;
    grid.setTransform(scale, 0, 0, scale, 0, 0);
    grid.clearRect(0, 0, width + gridSize, height + gridSize);
    grid.lineWidth = 1;
    grid.strokeStyle = 'rgba(106, 154, 166, 0.08)';
    for (let x = 0; x <= width + gridSize; x += gridSize) {
      grid.beginPath();
      grid.moveTo(x, 0);
      grid.lineTo(x, height + gridSize);
      grid.stroke();
    }
    for (let y = 0; y <= height + gridSize; y += gridSize) {
      grid.beginPath();
      grid.moveTo(0, y);
      grid.lineTo(width + gridSize, y);
      grid.stroke();
    }
  };

  const setCanvasSize = () => {
    scale = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.max(14, Math.floor((width * height) / 54000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.08 + Math.random() * 0.22,
      size: 1 + Math.random() * 1.4,
      offset: Math.random() * Math.PI * 2
    }));
    paintGrid();
  };

  const draw = (time = 0) => {
    frameHandle = 0;
    if (document.hidden) return;

    if (motionReduced || time - lastFrame >= frameInterval) {
      lastFrame = time;
      const drift = (time * 0.008) % gridSize;

      context.clearRect(0, 0, width, height);
      context.drawImage(gridCanvas, -drift, -drift, width + gridSize, height + gridSize);

      particles.forEach((particle, index) => {
        particle.y -= particle.speed;
        particle.x += Math.sin(time * 0.0004 + particle.offset) * 0.12;
        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }
        const distance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y);
        const highlighted = distance < 150;
        context.fillStyle = highlighted
          ? 'rgba(197, 238, 116, 0.92)'
          : index % 4 === 0
            ? 'rgba(103, 219, 228, 0.6)'
            : 'rgba(151, 175, 177, 0.32)';
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
        if (highlighted) {
          context.strokeStyle = `rgba(103, 219, 228, ${0.3 - distance / 620})`;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      });
    }

    if (!motionReduced) frameHandle = requestAnimationFrame(draw);
  };

  const resume = () => {
    if (motionReduced || frameHandle || document.hidden) return;
    lastFrame = 0;
    frameHandle = requestAnimationFrame(draw);
  };

  window.addEventListener('resize', setCanvasSize, { passive: true });
  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frameHandle) {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    } else {
      resume();
    }
  });

  setCanvasSize();
  draw();
})();
