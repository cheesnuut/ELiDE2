/* ELiDE gallery carousel.
   HOW TO ADD PHOTOS:
   1. Drop the photo into the /gallery/ folder (jpg or webp, portrait works best).
   2. Add one line below: { src: "gallery/your-photo.jpg", label: "Artsy", caption: "Manga wispy" },
      label must be one of: The Lift, Classic, Volume, Artsy, Lash Recovery and Lift.
   3. The carousel picks it up automatically. No other changes needed. */
var ELIDE_GALLERY = [
];

(function () {
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function slidesHtml(items) {
    return items.map(function (g, i) {
      return '<figure class="eg-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + items.length + '">' +
        '<div class="eg-frame"><img src="' + esc(g.src) + '" alt="' + esc(g.label) + ' lash design' + (g.caption ? ' — ' + esc(g.caption) : '') + '" loading="lazy">' +
        '<span class="eg-chip">' + esc(g.label) + '</span></div>' +
        (g.caption ? '<figcaption class="eg-caption">' + esc(g.caption) + '</figcaption>' : '') +
        '</figure>';
    }).join('');
  }

  function build(menuSection) {
    var section = document.createElement('section');
    section.id = 'gallery';
    section.className = 'eg';
    section.setAttribute('aria-label', 'Gallery');

    var head = '<div class="container"><header class="eg-head">' +
      '<p class="eg-eyebrow">Gallery</p>' +
      '<h2 class="display eg-title">Fresh sets. <em>Made here.</em></h2>' +
      '</header>';

    if (!ELIDE_GALLERY.length) {
      section.innerHTML = head +
        '<div class="eg-empty"><p class="display">New designs are on the way.</p>' +
        '<p>The gallery opens with the first fresh sets. Check back soon.</p></div></div>';
      menuSection.insertAdjacentElement('afterend', section);
      return;
    }

    section.innerHTML = head +
      '<div class="eg-carousel"><div class="eg-viewport"><div class="eg-track">' +
      slidesHtml(ELIDE_GALLERY) +
      '</div></div></div>' +
      '<div class="eg-controls"><button class="eg-arrow eg-prev" aria-label="Previous photo">&#8592;</button>' +
      '<div class="eg-dots" role="tablist"></div>' +
      '<button class="eg-arrow eg-next" aria-label="Next photo">&#8594;</button></div></div>';

    menuSection.insertAdjacentElement('afterend', section);

    var track = section.querySelector('.eg-track');
    var dotsBox = section.querySelector('.eg-dots');
    var prev = section.querySelector('.eg-prev');
    var next = section.querySelector('.eg-next');
    var n = ELIDE_GALLERY.length, idx = 0;

    for (var d = 0; d < n; d++) {
      var b = document.createElement('button');
      b.className = 'eg-dot';
      b.setAttribute('aria-label', 'Go to photo ' + (d + 1));
      b.dataset.i = d;
      dotsBox.appendChild(b);
    }
    var dots = dotsBox.querySelectorAll('.eg-dot');

    function go(i) {
      idx = (i + n) % n;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dots.forEach(function (dt, k) { dt.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
      prev.disabled = n < 2;
      next.disabled = n < 2;
    }
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });
    dots.forEach(function (dt) { dt.addEventListener('click', function () { go(+dt.dataset.i); }); });

    var sx = null;
    var vp = section.querySelector('.eg-viewport');
    vp.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    vp.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      sx = null;
    }, { passive: true });
    document.addEventListener('keydown', function (e) {
      var r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (e.key === 'ArrowLeft') go(idx - 1);
      if (e.key === 'ArrowRight') go(idx + 1);
    });

    go(0);
  }

  function mount() {
    var m = document.getElementById('menu');
    if (m && !document.getElementById('gallery')) build(m);
    else if (!m) setTimeout(mount, 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
