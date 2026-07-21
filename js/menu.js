/* ===================================
   Gandul Coffee — Menu Page Behaviour
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var hamburger = document.getElementById('menuHamburger');
  var nav = document.getElementById('menuNav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Row sliders (one per category) ---------- */
  var arrows = document.querySelectorAll('.row-arrow');

  function cardStep(grid) {
    var card = grid.querySelector('.menu-card');
    if (!card) return 300;
    var style = window.getComputedStyle(grid);
    var gap = parseFloat(style.columnGap || style.gap || '24');
    return card.getBoundingClientRect().width + gap;
  }

  function updateArrowState(grid) {
    var prev = document.querySelector('.row-arrow.prev[data-target="' + grid.id + '"]');
    var next = document.querySelector('.row-arrow.next[data-target="' + grid.id + '"]');
    if (!prev || !next) return;
    var maxScroll = grid.scrollWidth - grid.clientWidth - 2;
    prev.disabled = grid.scrollLeft <= 0;
    next.disabled = grid.scrollLeft >= maxScroll;
  }

  arrows.forEach(function (btn) {
    var grid = document.getElementById(btn.dataset.target);
    if (!grid) return;

    btn.addEventListener('click', function () {
      var direction = btn.classList.contains('next') ? 1 : -1;
      grid.scrollBy({ left: direction * cardStep(grid), behavior: 'smooth' });
    });

    grid.addEventListener('scroll', function () { updateArrowState(grid); }, { passive: true });
    window.addEventListener('resize', function () { updateArrowState(grid); });
    updateArrowState(grid);
  });

});