// GA4 bootstrap, kept as a file (not inline) so the site's CSP can block inline scripts.
(function () {
  var id = document.currentScript && document.currentScript.dataset.gaId;
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);
})();
