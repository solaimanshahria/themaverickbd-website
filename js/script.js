const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
const hasGSAP = typeof window.gsap !== 'undefined';
const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
const hasLenis = typeof window.Lenis !== 'undefined';
const desktopAnimations = !reduceMotion && !coarsePointer && window.matchMedia('(min-width: 901px)').matches;

if (hasGSAP && hasScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

if (desktopAnimations && hasGSAP && hasScrollTrigger && hasLenis) {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

const nav = document.querySelector('.navbar');
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

if (!desktopAnimations && hasGSAP) {
  gsap.set('.navbar, .eyebrow, .hero-line, .hero-copy, .hero-buttons .btn, .scroll-indicator, .reveal-left, .reveal-right, .reveal-up, .social-card', {
    clearProps: 'transform,opacity,visibility'
  });
}

if (desktopAnimations && hasGSAP && hasScrollTrigger) {
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });

  intro
    .from('.navbar', { y: -80, opacity: 0, duration: 1 })
    .from('.eyebrow', { y: 30, opacity: 0, duration: .8 }, '-=.35')
    .from('.hero-line', { yPercent: 120, opacity: 0, rotateX: -35, stagger: .12, duration: 1.15 }, '-=.45')
    .from('.hero-copy', { y: 28, opacity: 0, duration: .7 }, '-=.5')
    .from('.hero-buttons .btn', { y: 24, opacity: 0, stagger: .12, duration: .65 }, '-=.4')
    .from('.scroll-indicator', { opacity: 0, duration: .6 }, '-=.2');

  gsap.to('.outline-word:first-child', {
    xPercent: -8,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  gsap.to('.outline-word.second', {
    xPercent: 8,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  gsap.to('.hero-content', {
    yPercent: 20,
    opacity: .25,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.from(el, {
      x: -70,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%' }
    });
  });

  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.from(el, {
      x: 70,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%' }
    });
  });

  gsap.from('.social-card', {
    y: 70,
    opacity: 0,
    stagger: .08,
    duration: .8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.social-grid', start: 'top 80%' }
  });

  gsap.utils.toArray('.section-number').forEach((el) => {
    gsap.to(el, {
      y: 80,
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  gsap.to('.orb-one', { xPercent: 30, yPercent: 20, rotation: 25, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.orb-two', { xPercent: -25, yPercent: 30, rotation: -20, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.orb-three', { xPercent: 20, yPercent: -25, duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut' });
}

if (!coarsePointer && !reduceMotion && hasGSAP) {
  const glow = document.querySelector('.cursor-glow');

  if (glow) {
    window.addEventListener('pointermove', (event) => {
      gsap.to(glow, {
        x: event.clientX,
        y: event.clientY,
        duration: .9,
        ease: 'power3.out'
      });
    }, { passive: true });
  }

  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(element, { x: x * .12, y: y * .12, duration: .25, ease: 'power2.out' });
    });

    element.addEventListener('pointerleave', () => {
      gsap.to(element, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.45)' });
    });
  });
}

const sections = document.querySelectorAll('header[id], section[id]');
const menuAnchors = document.querySelectorAll('.nav-links a');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      menuAnchors.forEach((anchor) => {
        anchor.classList.toggle('active', anchor.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}
