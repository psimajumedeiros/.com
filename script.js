const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const faqItems = document.querySelectorAll('.faq-item');
const revealElements = document.querySelectorAll('.reveal');
const yearElement = document.getElementById('current-year');
const menuOverlay = document.querySelector('.menu-overlay');

// Ano automático no rodapé
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Cabeçalho compacto ao rolar
const updateHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Menu mobile
const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  navMenu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  if (menuOverlay) menuOverlay.classList.remove('is-open');
};

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  navMenu.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);

  if (menuOverlay) {
    menuOverlay.classList.toggle('is-open', !isOpen);
  }
});

if (menuOverlay) {
  menuOverlay.addEventListener('click', closeMenu);
}

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu();
});

// FAQ / accordion
faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');

  button.addEventListener('click', () => {
    const willOpen = !item.classList.contains('is-open');

    faqItems.forEach((otherItem) => {
      otherItem.classList.remove('is-open');
      otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (willOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

// Animações de entrada com Intersection Observer
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// Destaque do link referente à seção visível
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    },
    { threshold: [0.25, 0.45, 0.7], rootMargin: '-20% 0px -55% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// Fecha o menu com ESC
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
