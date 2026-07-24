/* ============================================================
   RAHMAD REZEKI PRODUCTION — Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state + scroll progress ---------- */
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('progressBar');
  const toTopBtn = document.getElementById('toTop');

  const onScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    navbar.classList.toggle('scrolled', scrollY > 40);
    toTopBtn.classList.toggle('visible', scrollY > 480);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Active nav link highlight on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statNums.forEach(el => statObserver.observe(el));

  /* ---------- Testimonial slider ---------- */
  const testiCards = Array.from(document.querySelectorAll('.testi-card'));
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  let testiIndex = 0;
  let testiTimer = null;

  if (testiCards.length) {
    testiCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToTesti(i));
      dotsWrap.appendChild(dot);
    });

    function goToTesti(index) {
      testiCards[testiIndex].classList.remove('active');
      dotsWrap.children[testiIndex].classList.remove('active');
      testiIndex = (index + testiCards.length) % testiCards.length;
      testiCards[testiIndex].classList.add('active');
      dotsWrap.children[testiIndex].classList.add('active');
    }

    const restartAutoplay = () => {
      clearInterval(testiTimer);
      testiTimer = setInterval(() => goToTesti(testiIndex + 1), 6000);
    };

    prevBtn.addEventListener('click', () => { goToTesti(testiIndex - 1); restartAutoplay(); });
    nextBtn.addEventListener('click', () => { goToTesti(testiIndex + 1); restartAutoplay(); });

    restartAutoplay();
  }

  /* ---------- Contact form (front-end only) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name');
      formNote.textContent = `Terima kasih, ${nameInput.value || 'Kak'}! Pesan Anda sudah kami terima, tim kami akan segera menghubungi.`;
      contactForm.reset();
    });
  }

});
