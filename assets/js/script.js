(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !isOpen);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (menuButton.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1050) closeMenu();
    }, { passive: true });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((element, index) => element.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`));
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }

  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const updateHeader = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  const backTop = document.querySelector('.back-top');
  if (backTop) {
    const updateBackTop = () => backTop.classList.toggle('is-visible', window.scrollY > 450);
    window.addEventListener('scroll', updateBackTop, { passive: true });
    updateBackTop();
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.querySelectorAll('img[data-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      if (image.src !== image.dataset.fallback) image.src = image.dataset.fallback;
    }, { once: true });
  });

  const lightbox = document.querySelector('#lightbox');
  if (lightbox) {
    const lightboxImage = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');
    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const image = item.querySelector('img');
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        caption.textContent = item.dataset.caption || image.alt;
        lightbox.showModal();
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }

  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = form.querySelector('.form-result');
      if (!form.checkValidity()) {
        result.hidden = false;
        result.className = 'form-result form-result--error';
        result.textContent = 'Please check the highlighted fields and try again.';
        form.reportValidity();
        return;
      }
      result.hidden = false;
      result.className = 'form-result form-result--success';
      result.textContent = form.dataset.successMessage;
      form.reset();
    });
  });

  const preferredDate = document.querySelector('#appt-date');
  if (preferredDate) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    preferredDate.min = localToday;
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();