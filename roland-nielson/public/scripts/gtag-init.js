// Google Analytics (GA4) setup. Kept in a file (not inline) so the site's CSP can
// leave 'unsafe-inline' out of script-src. The measurement ID comes from data-ga.
(function () {
  var ga = document.currentScript && document.currentScript.dataset.ga;
  if (!ga) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  var c = null; try { c = localStorage.getItem('rn-consent'); } catch (e) {}
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: c === 'granted' ? 'granted' : 'denied' });
  gtag('js', new Date());
  gtag('config', ga, { anonymize_ip: true });
})();
