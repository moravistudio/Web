(function () {
  var STORAGE_KEY = 'moravi-site-lang';
  var DEFAULT_LANG = 'es';

  var dict = {
    es: {
      nav: {
        inicio: 'Inicio',
        proyectos: 'Proyectos',
        servicios: 'Servicios',
        productos: 'Productos',
        contacto: 'Contacto'
      },
      hero: {
        title: {
          lead: 'Diseño Web que',
          accent: 'convierte',
          mid: 'visitantes',
          end: 'en clientes.'
        },
        subtitle: 'Landing Pages, sitios web y tiendas online diseñadas para ayudarte a destacar y vender más.',
        btnPrimary: 'Ver proyectos',
        btnSecondary: 'Hablemos'
      },
      methodology: {
        title: {
          lead: 'Diseñamos sitios web',
          mid: 'pensados para',
          accent: 'hacer crecer',
          end: 'tu negocio.'
        },
        subtitle: 'Cada proyecto combina diseño, estrategia y tecnología para ayudarte a destacar y convertir más visitantes en clientes.'
      },
      projects: {
        title: { lead: 'Proyectos', accent: 'destacados' },
        subtitle: 'Algunas muestras de sitios web diseñados para diferentes tipos de negocios.',
        badge: {
          landing: 'Landing Page',
          tienda: 'Tienda Online',
          sitio: 'Sitio Web'
        },
        card: {
          lashAtelier: 'Landing page moderna para negocio de pestañas y laminado de cejas.',
          paginaUno: 'Tienda online de libros seleccionados para cada tipo de lector.',
          libraica: 'Sitio web de libros con recomendaciones literarias'
        },
        verProyecto: 'Ver proyecto',
        verTodos: 'Ver todos los proyectos'
      },
      services: {
        eyebrow: '• Servicios •',
        title: {
          lead: 'Soluciones para potenciar',
          mid: 'tu',
          accent: 'presencia digital'
        },
        subtitle: 'Más que una página web, te ayudamos a construir una presencia digital coherente, profesional y preparada para crecer.'
      },
      contact: {
        eyebrow: '• Contacto •',
        title: {
          lead: 'Hagamos que',
          mid: 'tu negocio',
          accent: 'destaque.'
        },
        text: 'Diseñamos sitios web modernos y experiencias digitales que transmiten confianza, destacan tu marca y ayudan a hacer crecer tu negocio.',
        form: {
          title: 'Cuéntame sobre tu proyecto',
          name: 'Nombre',
          email: 'Correo electrónico',
          submit: 'Enviar mensaje'
        }
      },
      footer: {
        tagline: 'Diseño web y landing pages pensadas para ayudarte a destacar y vender más.',
        privacy: 'Política de privacidad',
        copyright: '© 2026 Moravi Studio. Todos los derechos reservados.'
      },
      productos: {
        hero: {
          lead: 'Productos digitales que',
          accent: 'simplifican',
          tail: 'tu trabajo',
          subtitle: 'Herramientas, aplicaciones y soluciones creadas por Moravi Studio — desde recursos gratuitos hasta productos Premium.'
        },
        badge: {
          gratis: 'Herramienta gratuita',
          negocios: 'Herramienta para negocios'
        },
        qr: {
          title: 'Generador de Códigos QR',
          text: 'Crea códigos QR personalizados para URLs, WhatsApp, WiFi y más, gratis y sin registro.'
        },
        catalogo: {
          title: 'Catálogo Online',
          text: 'Publica tu catálogo de productos y recibe pedidos directo por WhatsApp, sin comisiones.'
        },
        calcPrecio: {
          title: 'Calculadora de Precio y Rentabilidad',
          text: 'Calcula cuánto debes cobrar para cubrir tus costos y alcanzar la ganancia que buscas.'
        },
        calcEquilibrio: {
          title: 'Calculadora de Punto de Equilibrio',
          text: 'Calcula cuántas unidades necesitas vender para cubrir tus costos y alcanzar tu meta de ganancia.'
        },
        usarHerramienta: 'Usar herramienta →',
        usarCalculadora: 'Usar calculadora →',
        proximamente: 'Próximamente',
        volverInicio: 'Volver al inicio'
      }
    },
    en: {
      nav: {
        inicio: 'Home',
        proyectos: 'Projects',
        servicios: 'Services',
        productos: 'Products',
        contacto: 'Contact'
      },
      hero: {
        title: {
          lead: 'Web Design that',
          accent: 'converts',
          mid: 'visitors',
          end: 'into customers.'
        },
        subtitle: 'Landing pages, websites, and online stores designed to help you stand out and sell more.',
        btnPrimary: 'View projects',
        btnSecondary: "Let's talk"
      },
      methodology: {
        title: {
          lead: 'We design websites',
          mid: 'built to',
          accent: 'grow',
          end: 'your business.'
        },
        subtitle: 'Every project combines design, strategy, and technology to help you stand out and turn more visitors into customers.'
      },
      projects: {
        title: { lead: 'Featured', accent: 'projects' },
        subtitle: 'Some examples of websites designed for different types of businesses.',
        badge: {
          landing: 'Landing Page',
          tienda: 'Online Store',
          sitio: 'Website'
        },
        card: {
          lashAtelier: 'Modern landing page for a lash and brow lamination business.',
          paginaUno: 'Online bookstore with curated titles for every type of reader.',
          libraica: 'Book website with literary recommendations'
        },
        verProyecto: 'View project',
        verTodos: 'View all projects'
      },
      services: {
        eyebrow: '• Services •',
        title: {
          lead: 'Solutions to boost',
          mid: 'your',
          accent: 'digital presence'
        },
        subtitle: 'More than just a website — we help you build a cohesive, professional digital presence ready to grow.'
      },
      contact: {
        eyebrow: '• Contact •',
        title: {
          lead: "Let's make",
          mid: 'your business',
          accent: 'stand out.'
        },
        text: 'We design modern websites and digital experiences that build trust, showcase your brand, and help grow your business.',
        form: {
          title: 'Tell me about your project',
          name: 'Name',
          email: 'Email',
          submit: 'Send message'
        }
      },
      footer: {
        tagline: 'Web design and landing pages built to help you stand out and sell more.',
        privacy: 'Privacy policy',
        copyright: '© 2026 Moravi Studio. All rights reserved.'
      },
      productos: {
        hero: {
          lead: 'Digital products that',
          accent: 'simplify',
          tail: 'your work',
          subtitle: 'Tools, applications, and solutions created by Moravi Studio — from free resources to Premium products.'
        },
        badge: {
          gratis: 'Free tool',
          negocios: 'Business tool'
        },
        qr: {
          title: 'QR Code Generator',
          text: 'Create custom QR codes for URLs, WhatsApp, WiFi, and more — free, no sign-up required.'
        },
        catalogo: {
          title: 'Online Catalog',
          text: 'Publish your product catalog and receive orders directly via WhatsApp, with no commissions.'
        },
        calcPrecio: {
          title: 'Pricing & Profitability Calculator',
          text: "Calculate how much you should charge to cover your costs and reach the profit you're aiming for."
        },
        calcEquilibrio: {
          title: 'Break-Even Calculator',
          text: 'Calculate how many units you need to sell to cover your costs and reach your profit goal.'
        },
        usarHerramienta: 'Use tool →',
        usarCalculadora: 'Use calculator →',
        proximamente: 'Coming soon',
        volverInicio: 'Back to home'
      }
    }
  };

  function getPath(obj, path) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return null;
      cur = cur[parts[i]];
    }
    return typeof cur === 'string' ? cur : null;
  }

  function getStoredLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'en' ? 'en' : (stored === 'es' ? 'es' : null);
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage unavailable */ }
  }

  function applyLang(lang) {
    var table = dict[lang] || dict[DEFAULT_LANG];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = getPath(table, el.getAttribute('data-i18n'));
      if (value !== null) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var value = getPath(table, el.getAttribute('data-i18n-placeholder'));
      if (value !== null) el.setAttribute('placeholder', value);
    });

    document.querySelectorAll('[data-img-es][data-img-en]').forEach(function (el) {
      var src = lang === 'en' ? el.getAttribute('data-img-en') : el.getAttribute('data-img-es');
      if (src) el.setAttribute('src', src);
    });

    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-btn--active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setLang(lang) {
    storeLang(lang);
    applyLang(lang);
  }

  var initialLang = getStoredLang() || DEFAULT_LANG;
  applyLang(initialLang);

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'));
    });
  });
})();
