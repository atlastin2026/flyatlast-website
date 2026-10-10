/* FlyAtlast header: highlight the current section (home) or current page (other pages) */
(function () {
  var links = [].slice.call(document.querySelectorAll('.fa-hd-links a, .nav-links a'));
  if (!links.length) return;
  var p = location.pathname;
  var home = p === '/' || p === '' || /^\/index(-v2)?\.html$/.test(p) || /\/index-v2\.html$/.test(p);
  function mark(a) { links.forEach(function (l) { l.classList.remove('active'); l.removeAttribute('aria-current'); }); if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'location'); } }
  if (!home) {
    links.forEach(function (a) {
      var ap = a.pathname || '';
      if (a.classList.contains('btn') || a.classList.contains('fa-hd-cta') || (a.hash && !/\/price-watch\.html$/.test(p))) return;
      if ((ap === '/why.html' && /\/why\.html$/.test(p)) || (ap === '/blog/' && p.indexOf('/blog/') === 0) || (/\/price-watch\.html$/.test(p) && a.getAttribute('href') === '/#watch')) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
    });
    return;
  }
  var ids = ['how', 'watch', 'pricing', 'faq'], byId = {};
  links.forEach(function (a) { var h = a.getAttribute('href') || ''; var i = h.indexOf('#'); if (i > -1) byId[h.slice(i + 1)] = a; });
  var tick = false;
  function spy() {
    tick = false;
    var cur = null, y = 140;
    ids.forEach(function (id) { var e = document.getElementById(id); if (e && e.getBoundingClientRect().top <= y) cur = id; });
    var f = document.getElementById('faq');
    if (f && f.getBoundingClientRect().bottom < y) cur = null;
    mark(cur ? byId[cur] : null);
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(spy); } }, { passive: true });
  window.addEventListener('resize', spy);
  spy();
})();
