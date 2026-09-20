/* ELiDE gallery carousel.
   HOW TO ADD PHOTOS:
   1. Drop the photo into the /gallery/ folder (jpg or webp, portrait works best).
   2. Add one line below: { src: "gallery/your-photo.jpg", label: "Artsy", caption: "Manga wispy" },
      label must be one of: The Lift, Classic, Volume, Artsy, Lash Recovery and Lift.
   3. The carousel and filters pick it up automatically. To remove a sample,
      delete its line here (and the file if you like). */
var ELIDE_GALLERY = [
  { src: "gallery/sample-artsy-01.svg", label: "Artsy", caption: "Manga wispy — sample" },
  { src: "gallery/sample-artsy-02.svg", label: "Artsy", caption: "Thai lashes — sample" },
  { src: "gallery/sample-volume-01.svg", label: "Volume", caption: "Soft volume — sample" },
  { src: "gallery/sample-classic-01.svg", label: "Classic", caption: "Natural classic — sample" },
  { src: "gallery/sample-lift-01.svg", label: "The Lift", caption: "Korean lift — sample" },
  { src: "gallery/sample-recovery-01.svg", label: "Lash Recovery and Lift", caption: "Recovery + lift — sample" },
];

var ELIDE_FILTERS = [
  { key: "All", chip: "All" },
  { key: "The Lift", chip: "The Lift" },
  { key: "Classic", chip: "Classic" },
  { key: "Volume", chip: "Volume" },
  { key: "Artsy", chip: "Artsy" },
  { key: "Lash Recovery and Lift", chip: "Recovery" },
];

(function () {
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function slideHtml(g, i, n) {
    return '<figure class="eg-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + n + '">' +
      '<div class="eg-frame"><img src="' + esc(g.src) + '" alt="' + esc(g.label) + ' lash design' + (g.caption ? ' — ' + esc(g.caption) : '') + '" loading="lazy">' +
      '<span class="eg-chip">' + esc(g.label) + '</span></div>' +
      (g.caption ? '<figcaption class="eg-caption">' + esc(g.caption) + '</figcaption>' : '') +
      '</figure>';
  }

  function build(menuSection) {
    var section = document.createElement('section');
    section.id = 'gallery';
    section.className = 'eg';
    section.setAttribute('aria-label', 'Gallery');

    var head = '<div class="container"><header class="eg-head">' +
      '<p class="eg-eyebrow">Gallery</p>' +
      '<h2 class="display eg-title">Fresh sets.<br><em>Made here.</em></h2>' +
      '</header>';

    if (!ELIDE_GALLERY.length) {
      section.innerHTML = head +
        '<div class="eg-empty"><p class="display">New designs are on the way.</p>' +
        '<p>The gallery opens with the first fresh sets. Check back soon.</p></div></div>';
      menuSection.insertAdjacentElement('afterend', section);
      return;
    }

    var filterHtml = ELIDE_FILTERS.map(function (f, i) {
      return '<button class="eg-chipbtn" data-filter="' + esc(f.key) + '" aria-pressed="' + (i === 0) + '">' + esc(f.chip) + '</button>';
    }).join('');

    section.innerHTML = head +
      '<div class="eg-filters" role="group" aria-label="Filter by service">' + filterHtml + '</div>' +
      '<div class="eg-carousel"><div class="eg-viewport"><div class="eg-track"></div></div></div>' +
      '<div class="eg-controls"><button class="eg-arrow eg-prev" aria-label="Previous photo">&#8592;</button>' +
      '<div class="eg-dots" role="tablist"></div>' +
      '<button class="eg-arrow eg-next" aria-label="Next photo">&#8594;</button>' +
      '<button class="eg-browsebtn" aria-expanded="false"><span class="eg-gridicon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>Browse all</button></div>' +
      '<div class="eg-panel" hidden><div class="eg-grid"></div></div></div>';

    menuSection.insertAdjacentElement('afterend', section);

    var track = section.querySelector('.eg-track');
    var dotsBox = section.querySelector('.eg-dots');
    var prev = section.querySelector('.eg-prev');
    var next = section.querySelector('.eg-next');
    var browseBtn = section.querySelector('.eg-browsebtn');
    var panel = section.querySelector('.eg-panel');
    var grid = section.querySelector('.eg-grid');
    var chips = section.querySelectorAll('.eg-chipbtn');

    var filter = 'All', idx = 0;

    function visible() {
      return filter === 'All' ? ELIDE_GALLERY : ELIDE_GALLERY.filter(function (g) { return g.label === filter; });
    }

    function go(i) {
      var items = visible(), n = items.length;
      idx = n ? (i + n) % n : 0;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      var dots = dotsBox.querySelectorAll('.eg-dot');
      dots.forEach(function (dt, k) { dt.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
      var few = n < 2;
      prev.disabled = few; next.disabled = few;
    }

    function render() {
      var items = visible(), n = items.length;
      track.innerHTML = items.map(function (g, i) { return slideHtml(g, i, n); }).join('');
      dotsBox.innerHTML = '';
      for (var d = 0; d < n; d++) {
        var b = document.createElement('button');
        b.className = 'eg-dot';
        b.setAttribute('aria-label', 'Go to photo ' + (d + 1));
        b.dataset.i = d;
        (function (k) { b.addEventListener('click', function () { go(k); }); })(d);
        dotsBox.appendChild(b);
      }
      grid.innerHTML = items.map(function (g, i) {
        return '<button class="eg-thumb" data-i="' + i + '" aria-label="View ' + esc(g.label) + (g.caption ? ' — ' + esc(g.caption) : '') + '">' +
          '<img src="' + esc(g.src) + '" alt="" loading="lazy"><span class="eg-chip">' + esc(g.label) + '</span></button>';
      }).join('');
      grid.querySelectorAll('.eg-thumb').forEach(function (t) {
        t.addEventListener('click', function () {
          go(+t.dataset.i);
          setPanel(false);
          section.querySelector('.eg-carousel').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      });
      if (idx >= n) idx = 0;
      go(idx);
    }

    function setPanel(open) {
      panel.hidden = !open;
      browseBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      browseBtn.classList.toggle('is-open', open);
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        filter = c.dataset.filter; idx = 0;
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        setPanel(false);
        render();
      });
    });
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });
    browseBtn.addEventListener('click', function () { setPanel(panel.hidden); });

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

    render();
  }

  function mount() {
    var m = document.getElementById('menu');
    if (m && !document.getElementById('gallery')) build(m);
    else if (!m) setTimeout(mount, 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
