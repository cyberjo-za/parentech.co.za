/* =========================================================
   PARENTECH - Cookie Consent Banner
   Include this file on every page, just before the closing
   </body> tag, after script.js:
   <script src="cookie-consent.js"></script>
   ========================================================= */

(function () {
  var STORAGE_KEY = 'parentechCookieConsent';
  var PRIVACY_POLICY_URL = 'privacy.html';
  var COOKIE_POLICY_URL = 'privacy.html#cookies';

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    var existingChoice = getStoredConsent();

    if (!existingChoice) {
      renderBanner();
    } else {
      applyConsent(existingChoice);
    }

    renderFooterCookieLink();
  });

  /* ---------- Storage helpers ---------- */
  function getStoredConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      localStorage.setItem(STORAGE_KEY + 'Date', new Date().toISOString());
    } catch (e) {
      /* localStorage unavailable, consent will be asked again next visit */
    }
  }

  /* ---------- Consent application ---------- */
  function applyConsent(choice) {
    /* This is where you would conditionally load analytics or other
       non-essential scripts once a user has accepted cookies.
       Example:
       if (choice === 'accepted') {
         loadAnalyticsScript();
       }
    */
    document.documentElement.setAttribute('data-cookie-consent', choice);
  }

  /* ---------- Banner markup ---------- */
  function renderBanner() {
    var wrapper = document.createElement('div');
    wrapper.id = 'ptCookieBanner';
    wrapper.className = 'pt-cookie-banner';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-live', 'polite');
    wrapper.setAttribute('aria-label', 'Cookie consent');

    wrapper.innerHTML =
      '<div class="pt-cookie-inner">' +
        '<div class="pt-cookie-text">' +
          '<p>We value your privacy. Parentech uses cookies to help our website work properly and to understand how it is used. ' +
          'Read our <a href="' + PRIVACY_POLICY_URL + '" target="_blank" rel="noopener">Privacy Policy</a> and ' +
          '<a href="' + COOKIE_POLICY_URL + '" target="_blank" rel="noopener">Cookie Policy</a> to learn more.</p>' +
        '</div>' +
        '<div class="pt-cookie-actions">' +
          '<button type="button" class="pt-cookie-btn pt-cookie-decline" id="ptCookieDecline">Decline</button>' +
          '<button type="button" class="pt-cookie-btn pt-cookie-accept" id="ptCookieAccept">Accept All Cookies</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(wrapper);

    requestAnimationFrame(function () {
      wrapper.classList.add('pt-cookie-visible');
    });

    document.getElementById('ptCookieAccept').addEventListener('click', function () {
      handleChoice('accepted', wrapper);
    });
    document.getElementById('ptCookieDecline').addEventListener('click', function () {
      handleChoice('declined', wrapper);
    });
  }

  function handleChoice(choice, wrapper) {
    storeConsent(choice);
    applyConsent(choice);
    wrapper.classList.remove('pt-cookie-visible');
    setTimeout(function () {
      wrapper.remove();
    }, 300);
  }

  /* ---------- Optional: small persistent "Cookie Settings" link in the footer ---------- */
  function renderFooterCookieLink() {
    var footer = document.querySelector('.footer-bottom');
    if (!footer || document.getElementById('ptCookieSettingsLink')) return;

    var link = document.createElement('button');
    link.id = 'ptCookieSettingsLink';
    link.type = 'button';
    link.className = 'pt-cookie-settings-link';
    link.textContent = 'Cookie Settings';
    link.addEventListener('click', function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      var existingBanner = document.getElementById('ptCookieBanner');
      if (existingBanner) existingBanner.remove();
      renderBanner();
    });

    footer.appendChild(link);
  }

  /* ---------- Injected styles ---------- */
  function injectStyles() {
    if (document.getElementById('ptCookieStyles')) return;

    var style = document.createElement('style');
    style.id = 'ptCookieStyles';
    style.textContent = [
      '.pt-cookie-banner {',
      '  position: fixed;',
      '  left: 0; right: 0; bottom: 0;',
      '  z-index: 3000;',
      '  background: #101B33;',
      '  color: #fff;',
      '  padding: 20px 24px;',
      '  box-shadow: 0 -10px 30px rgba(16,27,51,0.25);',
      '  transform: translateY(100%);',
      '  transition: transform 0.35s ease;',
      '  font-family: "Inter", sans-serif;',
      '}',
      '.pt-cookie-banner.pt-cookie-visible { transform: translateY(0); }',
      '.pt-cookie-inner {',
      '  max-width: 1200px;',
      '  margin: 0 auto;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  flex-wrap: wrap;',
      '  gap: 20px;',
      '}',
      '.pt-cookie-text { flex: 1 1 420px; }',
      '.pt-cookie-text p { margin: 0; font-size: 0.92rem; line-height: 1.6; color: rgba(255,255,255,0.88); }',
      '.pt-cookie-text a { color: #7FE3DE; font-weight: 700; text-decoration: underline; }',
      '.pt-cookie-actions { display: flex; gap: 12px; flex-shrink: 0; flex-wrap: wrap; }',
      '.pt-cookie-btn {',
      '  padding: 12px 22px;',
      '  border-radius: 999px;',
      '  font-weight: 700;',
      '  font-size: 0.88rem;',
      '  cursor: pointer;',
      '  border: none;',
      '  font-family: "Inter", sans-serif;',
      '  transition: transform 0.2s ease, opacity 0.2s ease;',
      '}',
      '.pt-cookie-btn:hover { transform: translateY(-2px); }',
      '.pt-cookie-accept {',
      '  background: linear-gradient(135deg, #6C4AB6 0%, #2F6FBD 55%, #2FB6B0 100%);',
      '  color: #fff;',
      '}',
      '.pt-cookie-decline {',
      '  background: transparent;',
      '  color: #fff;',
      '  border: 1.5px solid rgba(255,255,255,0.4);',
      '}',
      '.pt-cookie-settings-link {',
      '  background: none;',
      '  border: none;',
      '  color: rgba(255,255,255,0.45);',
      '  font-size: 0.8rem;',
      '  cursor: pointer;',
      '  text-decoration: underline;',
      '  font-family: "Inter", sans-serif;',
      '  padding: 0;',
      '}',
      '.pt-cookie-settings-link:hover { color: #7FE3DE; }',
      '@media (max-width: 640px) {',
      '  .pt-cookie-inner { flex-direction: column; align-items: flex-start; }',
      '  .pt-cookie-actions { width: 100%; }',
      '  .pt-cookie-btn { flex: 1; }',
      '}'
    ].join('\n');

    document.head.appendChild(style);
  }
})();s