const slideIds = ['intro', 'about', 'experience', 'projects', 'off', 'education', 'publications'];
const slides = slideIds.map((id) => document.getElementById(id)).filter(Boolean);
const navLinks = Array.from(document.querySelectorAll('.topnav ul a'));
const counterEl = document.querySelector('.slide-counter-current');
const mainEl = document.querySelector('main.content');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentIndex = 0;

function setCurrentSlide(index) {
  currentIndex = index;
  if (counterEl) {
    counterEl.textContent = String(index + 1).padStart(2, '0');
  }
  navLinks.forEach((link, linkIndex) => {
    if (linkIndex === index) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// 1. Reveal-on-scroll fade-up.
const revealEls = document.querySelectorAll('.reveal');
if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => fadeObserver.observe(el));
}

// 2. Deck tracking: slide counter + active nav link.
// A fixed threshold on the target's own intersection ratio breaks for any
// slide taller than one viewport, so watch a thin band at the vertical
// center of the viewport instead.
const slideObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const index = slides.indexOf(entry.target);
      if (index !== -1) setCurrentSlide(index);
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
slides.forEach((slide) => slideObserver.observe(slide));

// 3. Nav clicks page the deck. Anchored links (href="#id") scroll to that
// slide and mark it active; the footer link has no href (scrolls to bottom),
// which falls through to the footer.
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    if (!targetId) {
      if (mainEl) {
        mainEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'end' });
      }
      return;
    }
    const target = document.getElementById(targetId);
    if (!target) return;
    const idx = slides.indexOf(target);
    if (idx !== -1) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      setCurrentSlide(idx);
    } else {
      if (mainEl) {
        mainEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'end' });
      }
    }
  });
});

// 4. Arrow-key paging, one slide at a time. Down at the last slide drops to
// the footer; a current slide taller than one viewport is scrolled through
// first on up/down so the nav never hands the reviewer half a slide.
window.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  if (document.activeElement?.tagName === 'INPUT') return;
  const direction = event.key === 'ArrowDown' ? 1 : -1;
  const lastSlide = slides.length - 1;
  if (direction > 0 && currentIndex === lastSlide) {
    event.preventDefault();
    if (mainEl) {
      mainEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'end' });
    }
    return;
  }
  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= slides.length) return;
  const current = slides[currentIndex];
  const viewportHeight = window.innerHeight;
  if (current && current.getBoundingClientRect().height > viewportHeight) {
    mainEl.scrollTo({
      top: current.getBoundingClientRect().height - viewportHeight,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }
  slides[nextIndex].scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
});
