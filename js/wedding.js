/* ===================================
   Gandul Coffee — Wedding Page Behaviour
   Header scroll / hamburger already handled by landing_page.js
   (this file only powers wedding-specific sections)
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Scroll to packages from hero CTA ---------- */
  var btnLihatPaket = document.getElementById('btnLihatPaket');
  var paketSection = document.getElementById('paket');
  if (btnLihatPaket && paketSection) {
    btnLihatPaket.addEventListener('click', function () {
      paketSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- Guest estimator slider ---------- */
  var slider = document.getElementById('guestSlider');
  var guestCountEl = document.getElementById('guestCount');
  var recommendNameEl = document.getElementById('recommendName');
  var packageCards = document.querySelectorAll('.package-card');

  var packageNames = {
    intimate: 'Intimate Brew',
    classic: 'Classic Gathering',
    grand: 'Grand Celebration'
  };

  function updateSliderFill(input) {
    var min = parseFloat(input.min);
    var max = parseFloat(input.max);
    var pct = ((input.value - min) / (max - min)) * 100;
    input.style.background =
      'linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) ' +
      pct + '%, #e6e1d9 ' + pct + '%, #e6e1d9 100%)';
  }

  function recommendedPackage(guests) {
    var match = null;
    packageCards.forEach(function (card) {
      var min = parseInt(card.dataset.min, 10);
      var max = parseInt(card.dataset.max, 10);
      if (guests >= min && guests <= max) match = card;
    });
    // guests above every range (e.g. slider maxed at 300) -> fall back to grand
    if (!match) {
      packageCards.forEach(function (card) {
        if (card.dataset.package === 'grand') match = card;
      });
    }
    return match;
  }

  function applyGuestEstimate(guests, opts) {
    var silent = opts && opts.silent;

    if (guestCountEl) {
      guestCountEl.textContent = guests >= 300 ? '300+' : guests;
    }

    var recCard = recommendedPackage(guests);
    packageCards.forEach(function (card) {
      card.classList.toggle('is-recommended', card === recCard);
    });

    if (recCard && recommendNameEl) {
      recommendNameEl.textContent = packageNames[recCard.dataset.package] || recCard.dataset.package;
    }

    if (recCard && !silent) {
      switchDetailTab(recCard.dataset.package);
    }
  }

  if (slider) {
    updateSliderFill(slider);
    applyGuestEstimate(parseInt(slider.value, 10), { silent: true });

    slider.addEventListener('input', function () {
      updateSliderFill(slider);
      applyGuestEstimate(parseInt(slider.value, 10));
    });
  }

  /* ---------- Package detail tabs ---------- */
  var tabButtons = document.querySelectorAll('.tab-btn');
  var detailPanels = document.querySelectorAll('.package-detail-panel');
  var detailSection = document.getElementById('packageDetail');

  function switchDetailTab(key) {
    tabButtons.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.tab === key);
    });
    detailPanels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.dataset.panel === key);
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchDetailTab(btn.dataset.tab);
    });
  });

  /* ---------- "Lihat Detail Lengkap" buttons on each card ---------- */
  document.querySelectorAll('.btn-detail').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      switchDetailTab(btn.dataset.target);
      if (detailSection) {
        detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Clicking a whole card also selects its detail tab ---------- */
  packageCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      // Jangan pindah tab kalau yang diklik adalah salah satu tombol di dalam card
      if (e.target.closest('button')) return;
      switchDetailTab(card.dataset.package);
    });
  });

  /* ---------- Modal Pemesanan Paket ---------- */
  var orderModal = document.getElementById('orderModal');
  var orderModalBackdrop = document.getElementById('orderModalBackdrop');
  var orderModalClose = document.getElementById('orderModalClose');
  var orderForm = document.getElementById('orderForm');
  var orderPackageInput = document.getElementById('orderPackageInput');
  var orderModalPackageName = document.getElementById('orderModalPackageName');
  var orderSummaryPackage = document.getElementById('orderSummaryPackage');
  var orderSummaryGuests = document.getElementById('orderSummaryGuests');
  var orderSummaryPrice = document.getElementById('orderSummaryPrice');
  var orderJumlahTamu = document.getElementById('orderJumlahTamu');

  function openOrderModal(packageKey) {
    var data = (typeof WEDDING_PACKAGES !== 'undefined') ? WEDDING_PACKAGES[packageKey] : null;
    if (!data) return;

    orderPackageInput.value = packageKey;
    orderModalPackageName.textContent = data.name;
    orderSummaryPackage.textContent = data.name;
    orderSummaryGuests.textContent = data.guests;
    orderSummaryPrice.textContent = data.price;

    // Prefill jumlah tamu dari slider estimator, biar user tidak perlu ketik ulang
    if (slider) {
      orderJumlahTamu.value = slider.value >= 300 ? 300 : slider.value;
    }

    document.body.classList.add('order-modal-open');
    orderModalBackdrop.classList.add('is-visible');
    orderModal.classList.add('is-visible');
  }

  function closeOrderModal() {
    document.body.classList.remove('order-modal-open');
    orderModalBackdrop.classList.remove('is-visible');
    orderModal.classList.remove('is-visible');
  }

  document.querySelectorAll('.btn-order').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openOrderModal(btn.dataset.order);
    });
  });

  if (orderModalClose) orderModalClose.addEventListener('click', closeOrderModal);
  if (orderModalBackdrop) orderModalBackdrop.addEventListener('click', closeOrderModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOrderModal();
  });

  // Kalau server menandai paket tidak valid, buka modal otomatis
  if (orderModal && orderModal.querySelector('.order-modal-alert')) {
    document.body.classList.add('order-modal-open');
    orderModalBackdrop.classList.add('is-visible');
    orderModal.classList.add('is-visible');
  }

  /* ---------- Submit form pemesanan -> lanjut ke WhatsApp ---------- */
  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nama = document.getElementById('orderNama').value.trim();
      var whatsapp = document.getElementById('orderWhatsapp').value.trim();
      var tanggal = document.getElementById('orderTanggal').value;
      var jumlahTamu = orderJumlahTamu.value;
      var catatan = document.getElementById('orderCatatan').value.trim();
      var namaPaket = orderModalPackageName.textContent;

      var lines = [
        'Halo Gandul Coffee, saya ingin memesan coffee bar untuk pernikahan.',
        '',
        'Paket: ' + namaPaket,
        'Nama: ' + nama,
        'No. WhatsApp: ' + whatsapp,
        'Tanggal Acara: ' + (tanggal || '-'),
        'Estimasi Tamu: ' + jumlahTamu + ' orang'
      ];
      if (catatan) lines.push('Catatan: ' + catatan);

      var pesan = encodeURIComponent(lines.join('\n'));
      window.open('https://wa.me/6283824158887?text=' + pesan, '_blank');

      closeOrderModal();
      orderForm.reset();
    });
  }

  /* ---------- FAQ accordion (custom, animasi halus, satu terbuka) ---------- */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var galleryLightbox = document.getElementById('galleryLightbox');
  var galleryLightboxBackdrop = document.getElementById('galleryLightboxBackdrop');
  var galleryLightboxImg = document.getElementById('galleryLightboxImg');
  var galleryLightboxCaption = document.getElementById('galleryLightboxCaption');
  var galleryLightboxClose = document.getElementById('galleryLightboxClose');
  var galleryPrev = document.getElementById('galleryPrev');
  var galleryNext = document.getElementById('galleryNext');
  var galleryIndex = 0;

  function openGalleryLightbox(index) {
    if (!galleryItems.length) return;
    galleryIndex = index;
    var item = galleryItems[galleryIndex];
    var caption = item.dataset.caption || '';

    galleryLightboxImg.src = item.dataset.full;
    galleryLightboxImg.alt = caption;
    galleryLightboxCaption.textContent = caption;

    document.body.classList.add('gallery-lightbox-open');
    galleryLightboxBackdrop.classList.add('is-visible');
    galleryLightbox.classList.add('is-visible');
  }

  function closeGalleryLightbox() {
    document.body.classList.remove('gallery-lightbox-open');
    galleryLightboxBackdrop.classList.remove('is-visible');
    galleryLightbox.classList.remove('is-visible');
  }

  function stepGalleryLightbox(dir) {
    var next = (galleryIndex + dir + galleryItems.length) % galleryItems.length;
    openGalleryLightbox(next);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      openGalleryLightbox(index);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGalleryLightbox(index);
      }
    });
  });

  if (galleryLightboxClose) galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
  if (galleryLightboxBackdrop) galleryLightboxBackdrop.addEventListener('click', closeGalleryLightbox);
  if (galleryPrev) galleryPrev.addEventListener('click', function () { stepGalleryLightbox(-1); });
  if (galleryNext) galleryNext.addEventListener('click', function () { stepGalleryLightbox(1); });

  document.addEventListener('keydown', function (e) {
    if (!galleryLightbox || !galleryLightbox.classList.contains('is-visible')) return;
    if (e.key === 'Escape') closeGalleryLightbox();
    if (e.key === 'ArrowLeft') stepGalleryLightbox(-1);
    if (e.key === 'ArrowRight') stepGalleryLightbox(1);
  });

});