(function () {
  var SITE_UPLOAD_PREFIX = 'uploads/';

  function addStylesheet(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  [
    'https://cdn11.editmysite.com/css/sites.css?buildtime=1234',
    'https://cdn11.editmysite.com/css/old/fancybox.css?buildtime=1234',
    'https://cdn11.editmysite.com/css/social-icons.css?buildtime=1234',
    'https://cdn2.editmysite.com/fonts/Roboto/font.css?2',
    'https://cdn2.editmysite.com/fonts/Playfair_Display/font.css?2'
  ].forEach(addStylesheet);

  var localTheme = document.createElement('link');
  localTheme.rel = 'stylesheet';
  localTheme.href = 'files/main_style.css?restore=4';
  document.head.appendChild(localTheme);

  var repairStyle = document.createElement('style');
  repairStyle.textContent = [
    '.nav-wrap .nav .wsite-menu-item-wrap{position:relative;}',
    '.nav-wrap .nav .wsite-menu-item-wrap>.wsite-menu-wrap{position:absolute!important;left:50%!important;top:100%!important;transform:translateX(-50%)!important;width:auto!important;min-width:155px!important;z-index:30!important;margin-top:4px!important;}',
    '.nav-wrap .nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu{display:block!important;min-width:155px!important;background:#fff!important;box-shadow:0 2px 8px rgba(0,0,0,.18)!important;white-space:nowrap!important;}',
    '.nav-wrap .nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu>li{display:block!important;margin:0!important;width:auto!important;}',
    '.nav-wrap .nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu>li>a{display:block!important;padding:10px 14px!important;color:#555!important;background:#fff!important;border:0!important;text-align:left!important;font-size:12px!important;}',
    '.nav-wrap .nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu>li>a:hover{color:#35A89A!important;background:#f7f7f7!important;}',
    '@media(max-width:767px){.nav-wrap .nav .wsite-menu-item-wrap>.wsite-menu-wrap{position:static!important;transform:none!important;min-width:0!important;margin:0!important;}.nav-wrap .nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu{box-shadow:none!important;}}'
  ].join('');
  document.head.appendChild(repairStyle);

  function normalizeUrl(value) {
    if (!value) return value;
    value = value.replace(/^http:\/\//i, 'https://');
    value = value.replace(/^https:\/\/yuczhen\.github\.io\/Lacalade-site\/4\/3\/4\/8\/43480965\//i, 'uploads/4/3/4/8/43480965/');
    value = value.replace(/^\/Lacalade-site\/4\/3\/4\/8\/43480965\//i, 'uploads/4/3/4/8/43480965/');
    value = value.replace(/^\/4\/3\/4\/8\/43480965\//i, 'uploads/4/3/4/8/43480965/');
    value = value.replace(/^4\/3\/4\/8\/43480965\//i, 'uploads/4/3/4/8/43480965/');
    return value;
  }

  function repairNode(root) {
    if (!root || root.nodeType !== 1 && root.nodeType !== 9) return;
    var nodes = root.matches && root.matches('[src],[href]') ? [root] : [];
    if (root.querySelectorAll) nodes = nodes.concat(Array.prototype.slice.call(root.querySelectorAll('[src],[href]')));

    nodes.forEach(function (el) {
      ['src', 'href'].forEach(function (attr) {
        if (!el.hasAttribute || !el.hasAttribute(attr)) return;
        var current = el.getAttribute(attr);
        var fixed = normalizeUrl(current);
        if (fixed !== current) el.setAttribute(attr, fixed);
      });
    });
  }

  function restoreGameMenus() {
    document.querySelectorAll('.wsite-menu-item-wrap > a[href="games.html"]').forEach(function (gamesLink) {
      var item = gamesLink.closest('.wsite-menu-item-wrap');
      if (!item) return;

      var wrap = item.querySelector(':scope > .wsite-menu-wrap');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'wsite-menu-wrap';
        item.appendChild(wrap);
      }
      wrap.style.display = 'none';

      var list = wrap.querySelector('.wsite-menu');
      if (!list) {
        list = document.createElement('ul');
        list.className = 'wsite-menu';
        wrap.appendChild(list);
      }
      list.innerHTML = '<li class="wsite-menu-subitem-wrap"><a href="games.html#demon-archive" class="wsite-menu-subitem"><span class="wsite-menu-title">Demon Archive</span></a></li><li class="wsite-menu-subitem-wrap"><a href="slots.html" class="wsite-menu-subitem"><span class="wsite-menu-title">Slots</span></a></li>';

      item.onmouseenter = function () { wrap.style.display = 'block'; };
      item.onmouseleave = function () { wrap.style.display = 'none'; };
    });

    document.querySelectorAll('h2.wsite-content-title').forEach(function (heading) {
      if ((heading.textContent || '').indexOf('Demon Archive') !== -1) heading.id = 'demon-archive';
    });
  }

  function repairLogo() {
    document.querySelectorAll('.wsite-logo img').forEach(function (img) {
      function fallback() {
        if (img.naturalWidth !== 0) return;
        var link = img.closest('a');
        if (!link) return;
        link.textContent = 'LA CALADE GAMES';
        link.href = 'index.html';
      }
      img.addEventListener('error', fallback, { once: true });
      if (img.complete) fallback();
    });
  }

  function repairButtons() {
    document.querySelectorAll('a.wsite-button').forEach(function (button) {
      var label = (button.textContent || '').trim().toLowerCase();
      if (label !== 'learn more') return;
      if (document.body.classList.contains('wsite-page-about')) {
        button.href = 'https://www.facebook.com/lacaladegames';
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
      } else if (document.body.classList.contains('wsite-page-games') && (!button.getAttribute('href') || button.getAttribute('href') === 'javascript:;')) {
        button.href = 'slots.html';
      }
    });
  }

  function restoreSlideshows() {
    if (!document.getElementById('810703760554426299-slideshow') && !document.getElementById('538190031859534373-slideshow')) return;

    addStylesheet('https://cdn11.editmysite.com/css/old/slideshow/slideshow.css?buildtime=1234');

    function replay() {
      document.querySelectorAll('script:not([src])').forEach(function (script) {
        var code = script.textContent || '';
        if (code.indexOf('wSlideshow.render') === -1 || script.dataset.replayed === '1') return;
        script.dataset.replayed = '1';
        try { new Function(code)(); } catch (e) { console.warn('Slideshow restore failed', e); }
      });
      setTimeout(function () { repairNode(document); }, 50);
      setTimeout(function () { repairNode(document); }, 500);
    }

    if (window.wSlideshow) return replay();
    var js = document.createElement('script');
    js.src = 'https://cdn11.editmysite.com/js/old/slideshow-jq.js?buildtime=1234';
    js.onload = replay;
    document.head.appendChild(js);
  }

  function restoreThemeInteractions() {
    if (!window.jQuery) return;
    var $ = window.jQuery;
    $('.hamburger').off('click.archiveFix').on('click.archiveFix', function (e) {
      e.preventDefault();
      $('body').toggleClass('nav-open');
    });
    $('.imageGallery').each(function () {
      if ($(this).children('div').length <= 6) $(this).children('div').addClass('fullwidth-mobile');
    });
  }

  function boot() {
    repairNode(document);
    restoreGameMenus();
    repairLogo();
    repairButtons();
    restoreSlideshows();
    restoreThemeInteractions();

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) repairNode(node);
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
