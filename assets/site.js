/* neurodiversleben – Cookie-Einwilligung (Meta Pixel nur nach Zustimmung) und Themenfilter */
(function () {
  var PIXEL_ID = '1850603119282068';
  var KEY = 'nl_pixel_consent'; // gleicher Schlüssel wie auf den Landingpages

  function loadPixel() {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function banner() { return document.getElementById('nl-consent'); }
  function show() { var b = banner(); if (b) b.classList.add('show'); }
  function hide() { var b = banner(); if (b) b.classList.remove('show'); }

  var saved = read();
  if (saved === 'granted') loadPixel();

  window.nlShowConsent = show;

  function initConsent() {
    var a = document.getElementById('nl-accept');
    var d = document.getElementById('nl-decline');
    if (a) a.addEventListener('click', function () { write('granted'); hide(); loadPixel(); });
    if (d) d.addEventListener('click', function () {
      var wasGranted = read() === 'granted';
      write('denied'); hide();
      if (wasGranted) location.reload(); // entfernt einen bereits geladenen Pixel
    });
    var s = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < s.length; i++) s[i].addEventListener('click', function (e) { e.preventDefault(); show(); });
    if (saved !== 'granted' && saved !== 'denied') show();
  }

  function initFilter() {
    var group = document.querySelector('[data-filter]');
    if (!group) return;
    var buttons = group.querySelectorAll('button');
    var cards = document.querySelectorAll('[data-tags]');
    var emptyFree = document.querySelector('[data-leer-gratis]');
    var emptyPaid = document.querySelector('[data-leer-kauf]');
    function apply(topic) {
      var freeCount = 0, paidCount = 0;
      for (var i = 0; i < cards.length; i++) {
        var tags = cards[i].getAttribute('data-tags').split('|');
        var on = topic === 'Alle' || tags.indexOf(topic) > -1;
        cards[i].hidden = !on;
        if (on && cards[i].classList.contains('card-gratis')) freeCount++;
        if (on && cards[i].classList.contains('card-kauf')) paidCount++;
      }
      if (emptyFree) emptyFree.hidden = freeCount > 0;
      if (emptyPaid) emptyPaid.hidden = paidCount > 0;
      for (var j = 0; j < buttons.length; j++) buttons[j].setAttribute('aria-pressed', buttons[j].textContent === topic ? 'true' : 'false');
    }
    for (var k = 0; k < buttons.length; k++) buttons[k].addEventListener('click', function () { apply(this.textContent); });
  }

  function init() { initConsent(); initFilter(); }
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
