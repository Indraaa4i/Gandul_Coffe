/* ===================================
   Gandul Coffee — Landing Page Behaviour
   No dependencies, progressively enhances the markup.
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky header on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 30);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile hamburger menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var backdrop = document.querySelector('.nav-backdrop');

  function closeNav() {
    toggle.classList.remove('is-active');
    nav.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openNav() {
    toggle.classList.add('is-active');
    nav.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (toggle && nav && backdrop) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });

    backdrop.addEventListener('click', closeNav);

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------- Hero slide count detection ----------
     If only one hero photo is present, run the gentle Ken Burns
     drift. Add a second .hero-slide (slide-2) in the HTML and this
     automatically switches to a real two-photo crossfade. */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelector('.hero-dots');
  if (slides.length === 1) {
    slides[0].classList.add('is-only-slide');
    if (dots) dots.style.display = 'none';
  } else if (slides.length > 1) {
    slides.forEach(function (s) { s.classList.add('has-sibling'); });
    if (dots) dots.classList.add('has-sibling');
  }

  /* ---------- Best Selling Product tabs ---------- */
  var tabButtons = document.querySelectorAll('.tab-pills button');
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      // Hook point: filter .product-card data-category against btn's
      // label here once real per-category product data exists.
    });
  });

  /* ---------- Product slider arrows ---------- */
  var grid = document.querySelector('.product-grid');
  var prevBtn = document.querySelector('.slider-arrow[aria-label="Previous"]');
  var nextBtn = document.querySelector('.slider-arrow[aria-label="Next"]');

  function cardStep() {
    var card = grid.querySelector('.product-card');
    if (!card) return 300;
    var style = window.getComputedStyle(grid);
    var gap = parseFloat(style.columnGap || style.gap || '20');
    return card.getBoundingClientRect().width + gap;
  }

  function updateArrowState() {
    if (!grid || !prevBtn || !nextBtn) return;
    var maxScroll = grid.scrollWidth - grid.clientWidth - 2;
    prevBtn.disabled = grid.scrollLeft <= 0;
    nextBtn.disabled = grid.scrollLeft >= maxScroll;
  }

  if (grid && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () {
      grid.scrollBy({ left: -cardStep(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      grid.scrollBy({ left: cardStep(), behavior: 'smooth' });
    });
    grid.addEventListener('scroll', updateArrowState, { passive: true });
    window.addEventListener('resize', updateArrowState);
    updateArrowState();
  }

});