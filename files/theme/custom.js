(function () {
  var externalStyles = [
    'https://cdn11.editmysite.com/css/sites.css?buildtime=1234',
    'https://cdn11.editmysite.com/css/old/fancybox.css?buildtime=1234',
    'https://cdn11.editmysite.com/css/social-icons.css?buildtime=1234',
    'https://cdn2.editmysite.com/fonts/Roboto/font.css?2',
    'https://cdn2.editmysite.com/fonts/Playfair_Display/font.css?2'
  ];

  externalStyles.forEach(function (href) {
    if (!document.querySelector('link[href="' + href + '"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  });

  var localTheme = document.createElement('link');
  localTheme.rel = 'stylesheet';
  localTheme.href = 'files/main_style.css?restore=3';
  document.head.appendChild(localTheme);

  function restoreGameMenus() {
    document.querySelectorAll('.wsite-menu-item-wrap > a[href="games.html"]').forEach(function (gamesLink) {
      var item = gamesLink.closest('.wsite-menu-item-wrap');
      if (!item) return;

      var wrap = item.querySelector('.wsite-menu-wrap');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'wsite-menu-wrap';
        wrap.style.display = 'none';
        wrap.innerHTML = '<ul class="wsite-menu"></ul>';
        item.appendChild(wrap);
      }

      var list = wrap.querySelector('.wsite-menu');
      if (!list) return;

      if (!list.querySelector('a[href="games.html#demon-archive"]')) {
        var demon = document.createElement('li');
        demon.className = 'wsite-menu-subitem-wrap';
        demon.innerHTML = '<a href="games.html#demon-archive" class="wsite-menu-subitem"><span class="wsite-menu-title">Demon Archive</span></a>';
        list.insertBefore(demon, list.firstChild);
      }

      if (!list.querySelector('a[href="slots.html"]')) {
        var slots = document.createElement('li');
        slots.className = 'wsite-menu-subitem-wrap';
        slots.innerHTML = '<a href="slots.html" class="wsite-menu-subitem"><span class="wsite-menu-title">Slots</span></a>';
        list.appendChild(slots);
      }

      item.addEventListener('mouseenter', function () {
        wrap.style.display = 'block';
      });
      item.addEventListener('mouseleave', function () {
        wrap.style.display = 'none';
      });
    });

    document.querySelectorAll('h2.wsite-content-title').forEach(function (heading) {
      if ((heading.textContent || '').indexOf('Demon Archive') !== -1) {
        heading.id = 'demon-archive';
      }
    });
  }

  function restoreArchivedSite() {
    document.querySelectorAll('iframe[src^="http://www.youtube.com"], iframe[src^="http://youtube.com"]').forEach(function (iframe) {
      iframe.src = iframe.src.replace(/^http:\/\//i, 'https://');
    });

    document.querySelectorAll('img[src^="http://cdn"], source[src^="http://cdn"]').forEach(function (el) {
      el.src = el.src.replace(/^http:\/\//i, 'https://');
    });

    document.querySelectorAll('.wsite-logo img').forEach(function (img) {
      function replaceBrokenLogo() {
        if (!img.complete || img.naturalWidth === 0) {
          var link = img.closest('a');
          if (link) {
            link.textContent = 'LA CALADE GAMES';
            link.href = 'index.html';
          }
        }
      }
      img.addEventListener('error', replaceBrokenLogo, { once: true });
      replaceBrokenLogo();
    });

    document.querySelectorAll('a.wsite-button').forEach(function (button) {
      var label = (button.textContent || '').trim().toLowerCase();
      if (label !== 'learn more') return;

      if (document.body.classList.contains('wsite-page-about')) {
        button.href = 'https://www.facebook.com/lacaladegames';
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
      } else if (document.body.classList.contains('wsite-page-games') && (!button.getAttribute('href') || button.getAttribute('href') === 'javascript:;')) {
        button.href = 'slots.html';
        button.removeAttribute('target');
      }
    });

    restoreGameMenus();
  }

  function restoreSlideshows() {
    if (!document.getElementById('810703760554426299-slideshow') && !document.getElementById('538190031859534373-slideshow')) return;

    if (!document.querySelector('link[href*="slideshow/slideshow.css"]')) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://cdn11.editmysite.com/css/old/slideshow/slideshow.css?buildtime=1234';
      document.head.appendChild(css);
    }

    function replayArchiveSlideshowScripts() {
      document.querySelectorAll('script:not([src])').forEach(function (script) {
        var code = script.textContent || '';
        if (code.indexOf('wSlideshow.render') === -1 || script.dataset.replayed === '1') return;
        script.dataset.replayed = '1';
        try {
          new Function(code)();
        } catch (e) {
          console.warn('Archived slideshow restore failed:', e);
        }
      });
    }

    if (window.wSlideshow) {
      replayArchiveSlideshowScripts();
      return;
    }

    var js = document.createElement('script');
    js.src = 'https://cdn11.editmysite.com/js/old/slideshow-jq.js?buildtime=1234';
    js.onload = replayArchiveSlideshowScripts;
    document.head.appendChild(js);
  }

  function boot() {
    restoreArchivedSite();
    restoreSlideshows();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

jQuery(function($) {
  $.fn.checkElementPositioning = function($el, $offsetHeightEl, scrollClass) {
    if (!this.length) return;
    if (((this.offset().top - $(window).scrollTop()) <= $offsetHeightEl.outerHeight()) && !$el.hasClass(scrollClass)) {
      $el.addClass(scrollClass);
    } else if (((this.offset().top - $(window).scrollTop()) >= $offsetHeightEl.outerHeight()) && $el.hasClass(scrollClass)) {
      $el.removeClass(scrollClass);
    }
  };

  $.fn.expandableSidebar = function(expandedClass) {
    var $me = this;
    $me.on('click', function() {
      $me.toggleClass(expandedClass);
    });
  };

  var impactController = {
    init: function() {
      this._addClasses();
      this._attachEvents();
      var base = this;
      setTimeout(function() { base._checkCartItems(); }, 1000);
    },

    _addClasses: function() {
      $('.wsite-form-sublabel').each(function() {
        var sublabel = $(this).text();
        $(this).prev('.wsite-form-input').attr('placeholder', sublabel);
      });
      $('.imageGallery').each(function() {
        if ($(this).children('div').length <= 6) {
          $(this).children('div').addClass('fullwidth-mobile');
        }
      });
    },

    _stickyFooter: function() {
      var stickyFooterMargin = $('#footer-wrap').height();
      $('.wrapper').css('margin-bottom', -stickyFooterMargin);
      $('#footer-wrap, .sticky-footer-push').css('height', stickyFooterMargin);
    },

    _checkCartItems: function() {
      $('body').toggleClass('cart-full', $('#wsite-mini-cart').find('li.wsite-product-item').length > 0);
    },

    _attachEvents: function() {
      var base = this;
      $('.hamburger').on('click', function(e) {
        e.preventDefault();
        $('body').toggleClass('nav-open');
      });

      $(window).on('scroll', function() {
        if ($('body.page-has-banner').length > 0) {
          $('.banner-wrap').checkElementPositioning($('body'), $('.menu-controls-wrap'), 'affix');
        } else {
          $('.main-wrap').checkElementPositioning($('body'), $('.menu-controls-wrap'), 'affix');
        }
      });

      $('.wsite-com-sidebar').expandableSidebar('sidebar-expanded');
      $('#wsite-search-sidebar').expandableSidebar('sidebar-expanded');
      if ($(window).width() > 767) base._stickyFooter();

      var login = $('#member-login').clone(true);
      $('#navmobile .wsite-menu-default').append(login);
    }
  };

  $(document).ready(function() {
    impactController.init();
  });
});
