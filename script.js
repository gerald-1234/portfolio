(() => {
  document.documentElement.classList.add('has-js');

  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.scroll-progress span');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const renderIcons = () => window.lucide?.createIcons();

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
    menuToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
    renderIcons();
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      renderIcons();
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

  const canvas = document.querySelector('.signal-field');
  const context = canvas.getContext('2d');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: -1000, y: -1000 };
  let width = 0;
  let height = 0;
  let particles = [];

  const setCanvasSize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
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
  };

  const draw = (time = 0) => {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(106, 154, 166, 0.08)';
    const gridSize = 64;
    const drift = (time * 0.008) % gridSize;

    for (let x = -gridSize; x < width + gridSize; x += gridSize) {
      context.beginPath();
      context.moveTo(x + drift, 0);
      context.lineTo(x + drift, height);
      context.stroke();
    }
    for (let y = -gridSize; y < height + gridSize; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y + drift);
      context.lineTo(width, y + drift);
      context.stroke();
    }

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

    if (!motionReduced) requestAnimationFrame(draw);
  };

  window.addEventListener('resize', setCanvasSize, { passive: true });
  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });

  setCanvasSize();
  draw();
  renderIcons();
})();
