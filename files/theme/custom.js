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

  // Re-apply the local theme after Weebly's shared CSS so the original
  // theme button, navigation and spacing rules win in the cascade.
  var localTheme = document.createElement('link');
  localTheme.rel = 'stylesheet';
  localTheme.href = 'files/main_style.css?restore=2';
  document.head.appendChild(localTheme);

  function restoreArchivedSite() {
    document.querySelectorAll('iframe[src^="http://www.youtube.com"], iframe[src^="http://youtube.com"]').forEach(function (iframe) {
      iframe.src = iframe.src.replace(/^http:\/\//i, 'https://');
    });

    document.querySelectorAll('img[src^="http://cdn"], source[src^="http://cdn"]').forEach(function (el) {
      el.src = el.src.replace(/^http:\/\//i, 'https://');
    });

    // The exported Weebly archive references a logo image that was not
    // included in the export. Replace the broken image with the original
    // textual brand treatment instead of showing a broken-image icon.
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

    // Normalize archived call-to-action links.
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreArchivedSite);
  } else {
    restoreArchivedSite();
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
