(function () {
  // ── URL de moravi-auth ─────────────────────────────────────────────────────
  var MORAVI_AUTH_URL = 'https://auth.moravistudio.com';

  // ── Estado de sesión ──────────────────────────────────────────────────────
  var sessionChecked  = false;
  var sessionUser     = null;

  // ── Estado del modal ──────────────────────────────────────────────────────
  // 'login'    → "Ya tengo cuenta"
  // 'register' → "Soy nuevo / Crear catálogo"
  var selectedMode   = 'login';
  var currentProduct = '';   // URL del producto que abrió el modal

  // ── Elementos del modal ───────────────────────────────────────────────────
  var dialog    = document.getElementById('moravi-auth-modal');
  var btnGoogle = document.getElementById('moravi-auth-btn-google');
  var btnClose  = document.getElementById('moravi-auth-btn-close');
  var btnText   = document.getElementById('moravi-auth-btn-text');

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

  // ── Construir la URL del botón Google con el modo seleccionado ────────────
  function buildGoogleUrl() {
    var returnTo = currentProduct || window.location.href;
    // Añadir ?mode= al returnTo para que el bridge lo reciba y lo propague
    var sep = returnTo.indexOf('?') >= 0 ? '&' : '?';
    if (selectedMode === 'register') {
      returnTo += sep + 'mode=register';
    } else {
      returnTo += sep + 'mode=login';
    }
    return MORAVI_AUTH_URL + '/auth/google?returnTo=' + encodeURIComponent(returnTo);
  }

  // ── Actualizar texto y href del botón Google ──────────────────────────────
  function updateGoogleButton() {
    if (!btnGoogle) return;
    btnGoogle.setAttribute('href', buildGoogleUrl());
    if (btnText) {
      btnText.textContent = selectedMode === 'register'
        ? 'Crear cuenta con Google'
        : 'Iniciar sesión con Google';
    }
  }

  // ── Actualizar visual de las tarjetas de modo ─────────────────────────────
  function updateModeCards() {
    var cards = dialog ? dialog.querySelectorAll('[data-mode]') : [];
    cards.forEach(function (card) {
      var isActive = card.getAttribute('data-mode') === selectedMode;
      card.classList.toggle('auth-modal__mode--active', isActive);
      card.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  // ── Seleccionar modo ──────────────────────────────────────────────────────
  function selectMode(mode) {
    selectedMode = mode;
    updateModeCards();
    updateGoogleButton();
  }

  // ── Abrir modal ───────────────────────────────────────────────────────────
  function openModal(productUrl) {
    if (!dialog) return;
    currentProduct = productUrl || window.location.href;
    // Resetear a modo login al abrir
    selectedMode = 'login';
    updateModeCards();
    updateGoogleButton();
    dialog.showModal();
  }

  // ── Cerrar modal ──────────────────────────────────────────────────────────
  function closeModal() {
    if (dialog) dialog.close();
  }

  // ── Registrar clicks en tarjetas de modo ─────────────────────────────────
  if (dialog) {
    dialog.querySelectorAll('[data-mode]').forEach(function (card) {
      card.addEventListener('click', function () {
        selectMode(card.getAttribute('data-mode'));
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectMode(card.getAttribute('data-mode'));
        }
      });
    });
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

  // ── Cerrar modal con botón X o backdrop ──────────────────────────────────
  if (btnClose) {
    btnClose.addEventListener('click', closeModal);
  }

  if (dialog) {
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeModal();
    });
  }

  // ── Botones [data-moravi-logout] — revelar si hay sesión activa ────────────
  function updateLogoutButtons() {
    document.querySelectorAll('[data-moravi-logout]').forEach(function (btn) {
      if (sessionUser) {
        btn.style.display = 'inline-flex';
        if (!btn.dataset.logoutBound) {
          btn.dataset.logoutBound = '1';
          btn.addEventListener('click', function () {
            var returnTo = btn.getAttribute('data-return-to') || '';
            // /logout es una ruta React que llama a Zustand.logout() antes de
            // navegar al Edge Function — garantiza que localStorage se limpie
            // en el mismo origen (catalogonline.moravistudio.com).
            var logoutUrl = 'https://catalogonline.moravistudio.com/logout';
            if (returnTo) logoutUrl += '?returnTo=' + encodeURIComponent(returnTo);
            window.location.href = logoutUrl;
          });
        }
      } else {
        // Ocultar explícitamente — necesario cuando el DOM se restaura desde
        // bfcache con un inline-style previo de display:inline-flex.
        btn.style.display = 'none';
      }
    });
  }

  // ── Precheck en background (no bloquea el render) ─────────────────────────
  checkSession().then(updateLogoutButtons);

  // ── bfcache: re-verificar sesión al restaurar la página desde historial ───
  // Cuando el navegador restaura una página desde el back/forward cache,
  // el script NO se vuelve a ejecutar — el estado anterior de sessionUser
  // puede ser incorrecto. El evento pageshow con e.persisted detecta esto.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      // La página viene de bfcache: ocultar botones inmediatamente mientras
      // re-verificamos, para evitar mostrar "Salir" con sesión ya cerrada.
      sessionUser    = null;
      sessionChecked = false;
      document.querySelectorAll('[data-moravi-logout]').forEach(function (btn) {
        btn.style.display = 'none';
      });
      checkSession().then(updateLogoutButtons);
    }
  });

  // ── API para pruebas en DevTools ──────────────────────────────────────────
  window.moraviAuthGate = {
    testModal:    function (url) { openModal(url || MORAVI_AUTH_URL + '/health'); },
    checkSession: checkSession,
    getUser:      function ()    { return sessionUser; },
    isChecked:    function ()    { return sessionChecked; },
    selectMode:   function (m)   { selectMode(m); }
  };
})();
