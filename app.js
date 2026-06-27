/* ============================================
   Ahmed ITI Journey — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // =============================================
  // 1. SCROLL PROGRESS BAR
  // =============================================
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = percent + '%';
  }

  // =============================================
  // 2. HEADER SHRINK ON SCROLL
  // =============================================
  const mainHeader = document.getElementById('main-header');

  function updateHeader() {
    if (window.scrollY > 80) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  }

  // =============================================
  // 3. ACTIVE NAV LINK TRACKING
  // =============================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // =============================================
  // 4. UNIFIED SCROLL HANDLER (throttled)
  // =============================================
  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateScrollProgress();
        updateHeader();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial calls
  updateScrollProgress();
  updateHeader();

  // =============================================
  // 5. INTERSECTION OBSERVER FALLBACK
  //    (for browsers without CSS Scroll-Driven Animations)
  // =============================================
  const supportsScrollTimeline =
    CSS.supports &&
    CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

  if (!supportsScrollTimeline) {
    const animatedElements = document.querySelectorAll(
      '.timeline-item, .gallery-item:not(.hidden), .seo-box, .profile-card'
    );

    animatedElements.forEach(function (el) {
      el.classList.add('js-animate');
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // =============================================
  // 6. GALLERY FILTER LOGIC
  // =============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active state
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(function (item) {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          // Re-trigger fallback animation if needed
          if (!supportsScrollTimeline) {
            item.classList.remove('js-animate');
            void item.offsetWidth; // force reflow
            item.classList.add('js-animate', 'visible');
          }
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // =============================================
  // 7. LIGHTBOX MODAL
  // =============================================
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const closeModal = document.querySelector('.close-modal');

  // Clicking on any gallery card image opens the lightbox
  document.querySelectorAll('.gallery-card').forEach(function (card) {
    card.addEventListener('click', function () {
      const img = card.querySelector('img');
      const title = card.querySelector('h4');
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalCaption.textContent = title ? title.textContent : '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modalImg.src = '';
  }

  closeModal.addEventListener('click', closeLightbox);

  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target === document.querySelector('.modal-content-container')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // =============================================
  // 8. SMOOTH SCROLL FOR NAV LINKS
  // =============================================
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const offset = mainHeader.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
