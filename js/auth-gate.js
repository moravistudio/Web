(function () {
  // ── URL de moravi-auth ─────────────────────────────────────────────────────
  // Cambiar a 'https://auth.moravistudio.com' al completar el despliegue B2.
  var MORAVI_AUTH_URL = 'https://auth.moravistudio.com';

  // ── Estado de sesión ──────────────────────────────────────────────────────
  var sessionChecked = false;
  var sessionUser    = null;

  // ── Elementos del modal ───────────────────────────────────────────────────
  var dialog    = document.getElementById('moravi-auth-modal');
  var btnGoogle = document.getElementById('moravi-auth-btn-google');
  var btnClose  = document.getElementById('moravi-auth-btn-close');

  // ── Verificación de sesión ────────────────────────────────────────────────
  function checkSession() {
    return fetch(MORAVI_AUTH_URL + '/auth/session', {
      credentials: 'include',
      mode: 'cors'
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        sessionUser    = data.user || null;
        sessionChecked = true;
        return sessionUser;
      })
      .catch(function () {
        // moravi-auth no disponible — falla silenciosamente
        sessionChecked = true;
        sessionUser    = null;
        return null;
      });
  }

  // ── Abrir modal ───────────────────────────────────────────────────────────
  function openModal(productUrl) {
    if (!dialog) return;
    var returnTo  = productUrl || window.location.href;
    var googleUrl = MORAVI_AUTH_URL + '/auth/google?returnTo=' + encodeURIComponent(returnTo);
    if (btnGoogle) btnGoogle.setAttribute('href', googleUrl);
    dialog.showModal();
  }

  // ── Cerrar modal ──────────────────────────────────────────────────────────
  function closeModal() {
    if (dialog) dialog.close();
  }

  // ── Interceptar clic en CTA de producto de pago ───────────────────────────
  function handleProductClick(e) {
    var link       = e.currentTarget;
    var productUrl = link.getAttribute('data-product-url');
    if (!productUrl) return;

    e.preventDefault();

    function navigate() { window.location.href = productUrl; }
    function gate()     { openModal(productUrl); }

    if (!sessionChecked) {
      checkSession().then(function (user) { user ? navigate() : gate(); });
    } else {
      sessionUser ? navigate() : gate();
    }
  }

  // ── Registrar handlers en todos los CTAs con data-product-url ────────────
  document.querySelectorAll('[data-product-url]').forEach(function (el) {
    el.addEventListener('click', handleProductClick);
  });

  // ── Cerrar modal ──────────────────────────────────────────────────────────
  if (btnClose) {
    btnClose.addEventListener('click', closeModal);
  }

  if (dialog) {
    // Clic en el backdrop (fuera de la tarjeta del modal) → cerrar
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeModal();
    });
  }

  // ── Botones [data-moravi-logout] — revelar si hay sesión activa ────────────
  // Páginas que necesiten un botón «Salir» solo deben añadir un elemento con
  // el atributo data-moravi-logout (oculto por defecto) y opcionalmente
  // data-return-to para indicar a dónde redirigir tras el logout.
  function updateLogoutButtons() {
    document.querySelectorAll('[data-moravi-logout]').forEach(function (btn) {
      if (sessionUser) {
        btn.style.display = '';
        if (!btn.dataset.logoutBound) {
          btn.dataset.logoutBound = '1';
          btn.addEventListener('click', function () {
            var returnTo = btn.getAttribute('data-return-to') || '';
            var logoutUrl = 'https://catalogonline.moravistudio.com/api/auth/moravi-logout';
            if (returnTo) logoutUrl += '?returnTo=' + encodeURIComponent(returnTo);
            window.location.href = logoutUrl;
          });
        }
      }
    });
  }

  // ── Precheck en background (no bloquea el render) ─────────────────────────
  checkSession().then(updateLogoutButtons);

  // ── API para pruebas en DevTools ──────────────────────────────────────────
  // Uso: moraviAuthGate.testModal('http://localhost:3010/health')
  window.moraviAuthGate = {
    testModal:    function (url) { openModal(url || MORAVI_AUTH_URL + '/health'); },
    checkSession: checkSession,
    getUser:      function ()    { return sessionUser; },
    isChecked:    function ()    { return sessionChecked; }
  };
})();
