/* ELıDE — hero entrance, scroll reveals, mobile nav, before/after compare,
   and an honest booking form that composes a real email instead of faking success. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  document.documentElement.classList.add('js');

  /* ---------- Hero entrance ---------- */
  var hero = $('#hero');
  function ready() { if (hero) hero.classList.add('is-ready'); }
  if (reduced) ready();
  else if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { requestAnimationFrame(ready); });
    setTimeout(ready, 900);
  } else requestAnimationFrame(ready);

  /* ---------- Scroll reveals ---------- */
  var revealItems = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (n) { n.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealItems.forEach(function (n) { io.observe(n); });
    /* Backstop: never leave content hidden if the observer misbehaves. */
    setTimeout(function () {
      revealItems.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) n.classList.add('is-in');
      });
    }, 1500);
  }

  /* ---------- Sticky topbar ---------- */
  var topbar = $('#topbar');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      topbar.classList.toggle('is-stuck', window.scrollY > 8);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = $('#navToggle');
  var links = $('#navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Before / after comparison ---------- */
  var stage = $('#compare');
  var before = $('#compareBefore');
  var handle = $('#compareHandle');
  var range = $('#compareRange');
  if (stage && before && handle && range) {
    var setSplit = function (pct) {
      var v = Math.max(0, Math.min(100, pct));
      before.style.width = v + '%';
      before.style.setProperty('--split', v);
      handle.style.left = v + '%';
      range.value = String(Math.round(v));
      range.setAttribute('aria-valuenow', String(Math.round(v)));
    };
    range.addEventListener('input', function () { setSplit(+range.value); });
    var drag = function (clientX) {
      var r = stage.getBoundingClientRect();
      setSplit(((clientX - r.left) / r.width) * 100);
    };
    stage.addEventListener('pointerdown', function (e) {
      if (e.target === range) return; /* keyboard users keep the range control */
      stage.setPointerCapture(e.pointerId);
      drag(e.clientX);
      var move = function (ev) { drag(ev.clientX); };
      var up = function () {
        stage.removeEventListener('pointermove', move);
        stage.removeEventListener('pointerup', up);
        stage.removeEventListener('pointercancel', up);
      };
      stage.addEventListener('pointermove', move);
      stage.addEventListener('pointerup', up);
      stage.addEventListener('pointercancel', up);
    });
    setSplit(50);
  }

  /* ---------- Service cards pre-select the booking form ---------- */
  var serviceSelect = $('#service');
  $$('.card__cta[data-service]').forEach(function (cta) {
    cta.addEventListener('click', function () {
      if (!serviceSelect) return;
      var wanted = cta.getAttribute('data-service');
      $$('option', serviceSelect).forEach(function (opt) {
        if (opt.textContent.trim() === wanted) serviceSelect.value = opt.value || opt.textContent;
      });
    });
  });

  /* ---------- Honest booking form ----------
     No fake success state: the form composes a real email through the visitor's
     mail client, and the status line says exactly what happened. Swap the
     BOOKING_EMAIL constant for the studio's real address, or point the form at
     a booking backend when one exists. */
  var BOOKING_EMAIL = 'bookings@example.com';
  var form = $('#bookForm');
  var note = $('#bookNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('#email');
      var service = $('#service');
      if (!email.value || !email.checkValidity()) {
        note.textContent = 'Enter a valid email address so times can be sent back to you.';
        email.focus();
        return;
      }
      var subject = 'Booking request — ' + service.value;
      var body = [
        'Service: ' + service.value,
        'Reply to: ' + email.value,
        '',
        'Please send available times, the unit number, and the patch-test slot.'
      ].join('\n');
      window.location.href = 'mailto:' + BOOKING_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      note.textContent = 'Your mail app should now open with the request pre-filled — press send there to finish.';
    });
  }

  /* ---------- Footer year ---------- */
  var yr = $('#yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
