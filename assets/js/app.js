/* ==========================================================================
   اعلان‌بان — اینفوگرافیک یک‌صفحه‌ای | تعامل‌های سبک، بدون وابستگی
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------ نوار پیشرفت مطالعه */
  var bar = document.getElementById('bar');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    if (bar) bar.style.width = (p * 100).toFixed(2) + '%';

    var top = document.getElementById('topbar');
    if (top) top.classList.toggle('is-stuck', (h.scrollTop || document.body.scrollTop) > 12);

    var up = document.getElementById('toTop');
    if (up) up.classList.toggle('is-on', (h.scrollTop || document.body.scrollTop) > 700);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------ نمایان‌شدن تدریجی */
  var revealItems = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealItems.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------ تب‌های صندوق ورودی */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  function selectTab(tab) {
    if (!tab) return;
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      var pane = document.getElementById(t.getAttribute('aria-controls'));
      if (pane) pane.hidden = !on;
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (ev) {
      var i = tabs.indexOf(t);
      if (ev.key === 'ArrowLeft' && tabs[i + 1]) { tabs[i + 1].focus(); selectTab(tabs[i + 1]); }
      if (ev.key === 'ArrowRight' && tabs[i - 1]) { tabs[i - 1].focus(); selectTab(tabs[i - 1]); }
    });
  });

  /* ------------------------------------------------ فهرست موبایل */
  var toggle = document.getElementById('navToggle');
  var links = document.querySelector('.navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
    document.addEventListener('click', function (e) {
      if (!links.classList.contains('is-open')) return;
      if (e.target.closest('.topbar')) return;
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  }

  /* ------------------------------------------------ بخش فعال در ناوبری */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.navlinks a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var idx = sections.indexOf(e.target);
        if (idx < 0) return;
        navLinks.forEach(function (a, i) { a.classList.toggle('is-active', i === idx); });
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ------------------------------------------------ بازگشت به بالا */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------ آمار کوچک در نوار بالا */
  var badge = document.querySelector('.nav-badge .chip');
  if (badge) badge.setAttribute('title', 'نصب مستقل روی سرور شرکت');

  /* ------------------------------------------------ پاک‌سازی کلاس دمو */
  document.addEventListener('click', function (e) {
    var seg = e.target.closest('[data-seg]');
    if (!seg) return;
    var group = seg.parentElement.querySelectorAll('[data-seg]');
    Array.prototype.forEach.call(group, function (b) { b.classList.toggle('is-on', b === seg); });
  });
})();
