(function () {
  var UPLOAD_BASE = 'uploads/4/3/4/8/43480965/';

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
  localTheme.href = 'files/main_style.css?restore=6';
  document.head.appendChild(localTheme);

  var repairStyle = document.createElement('style');
  repairStyle.textContent = [
    '.desktop-nav .wsite-menu-item-wrap{position:relative;}',
    '.desktop-nav .wsite-menu-item-wrap>.wsite-menu-wrap{position:absolute!important;left:0!important;top:calc(100% + 6px)!important;transform:none!important;width:200px!important;min-width:200px!important;z-index:50!important;margin:0!important;padding:0!important;}',
    '.desktop-nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu{display:block!important;width:200px!important;margin:0!important;padding:0!important;background:#fff!important;border:0!important;box-shadow:none!important;white-space:nowrap!important;}',
    '.desktop-nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu>li{display:block!important;margin:0!important;padding:0!important;width:200px!important;}',
    '.desktop-nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu>li>a{display:block!important;margin:0!important;padding:14px 15px!important;color:#111!important;background:#fff!important;border:0!important;text-align:left!important;text-transform:uppercase!important;letter-spacing:.06em!important;font-size:13px!important;font-weight:600!important;line-height:1.3!important;}',
    '.desktop-nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu>li>a:hover{color:#35A89A!important;background:#fff!important;}',
    '.archive-gallery{max-width:760px;margin:0 auto 18px;}',
    '.archive-gallery-main{position:relative;display:flex;align-items:center;justify-content:center;min-height:280px;background:transparent;}',
    '.archive-gallery-main img{display:block;max-width:100%;max-height:520px;width:auto;height:auto;margin:auto;}',
    '.archive-gallery-arrow{position:absolute;top:50%;transform:translateY(-50%);border:0;background:rgba(0,0,0,.48);color:#fff;width:38px;height:38px;font-size:25px;line-height:38px;text-align:center;cursor:pointer;z-index:2;}',
    '.archive-gallery-arrow.prev{left:8px;}.archive-gallery-arrow.next{right:8px;}',
    '.archive-gallery-thumbs{display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;margin:10px 0 4px;}',
    '.archive-gallery-thumbs button{border:1px solid #ddd;background:#fff;padding:2px;cursor:pointer;opacity:.72;}',
    '.archive-gallery-thumbs button.active{opacity:1;border-color:#35A89A;}',
    '.archive-gallery-thumbs img{display:block;width:72px;height:48px;object-fit:cover;}',
    '@media(max-width:767px){.desktop-nav .wsite-menu-item-wrap>.wsite-menu-wrap{position:static!important;transform:none!important;width:auto!important;min-width:0!important;}.desktop-nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu,.desktop-nav .wsite-menu-item-wrap>.wsite-menu-wrap>.wsite-menu>li{width:auto!important;}.archive-gallery-main{min-height:180px}.archive-gallery-thumbs img{width:54px;height:38px}}'
  ].join('');
  document.head.appendChild(repairStyle);

  function normalizeUrl(value) {
    if (!value) return value;
    value = value.replace(/^http:\/\//i, 'https://');
    value = value.replace(/^https:\/\/yuczhen\.github\.io\/Lacalade-site\/4\/3\/4\/8\/43480965\//i, UPLOAD_BASE);
    value = value.replace(/^\/Lacalade-site\/4\/3\/4\/8\/43480965\//i, UPLOAD_BASE);
    value = value.replace(/^\/4\/3\/4\/8\/43480965\//i, UPLOAD_BASE);
    value = value.replace(/^4\/3\/4\/8\/43480965\//i, UPLOAD_BASE);
    return value;
  }

  function repairNode(root) {
    if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
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
    document.querySelectorAll('.desktop-nav .wsite-menu-item-wrap > a[href="games.html"]').forEach(function (gamesLink) {
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
      list.innerHTML = '<li class="wsite-menu-subitem-wrap"><a href="slots.html" class="wsite-menu-subitem"><span class="wsite-menu-title">Slots</span></a></li>';
      item.onmouseenter = function () { wrap.style.display = 'block'; };
      item.onmouseleave = function () { wrap.style.display = 'none'; };
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

  function makeGallery(container, files, autoplay) {
    if (!container) return;
    var index = 0;
    container.innerHTML = '<div class="archive-gallery"><div class="archive-gallery-main"><button class="archive-gallery-arrow prev" type="button" aria-label="Previous">‹</button><img alt="Game screenshot"><button class="archive-gallery-arrow next" type="button" aria-label="Next">›</button></div><div class="archive-gallery-thumbs"></div></div>';
    var gallery = container.querySelector('.archive-gallery');
    var main = gallery.querySelector('.archive-gallery-main img');
    var thumbs = gallery.querySelector('.archive-gallery-thumbs');

    files.forEach(function (file, i) {
      var button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = '<img src="' + UPLOAD_BASE + file + '" alt="Game screenshot ' + (i + 1) + '">';
      button.onclick = function () { show(i); };
      thumbs.appendChild(button);
    });

    function show(i) {
      index = (i + files.length) % files.length;
      main.src = UPLOAD_BASE + files[index];
      Array.prototype.forEach.call(thumbs.children, function (button, n) {
        button.classList.toggle('active', n === index);
      });
    }

    gallery.querySelector('.prev').onclick = function () { show(index - 1); };
    gallery.querySelector('.next').onclick = function () { show(index + 1); };
    show(0);
    if (autoplay) setInterval(function () { show(index + 1); }, 5000);
  }

  function restoreSlotsGalleries() {
    if (!document.body.classList.contains('wsite-page-slots')) return;
    makeGallery(document.getElementById('810703760554426299-slideshow'), [
      'page-2-inner-left-rgb-web-800.png',
      'cover-1-4-spread-updated.png',
      'inner-page-2-3.png'
    ], true);
    makeGallery(document.getElementById('538190031859534373-slideshow'), [
      'pirate-base00_1.png',
      'pirate-free00_1.png',
      'roman-bs.png',
      'roman-fs.png',
      'roman-bigwin.png',
      'roman-superbigwin.png',
      'transitions-03.png'
    ], false);
  }

  function boot() {
    repairNode(document);
    restoreGameMenus();
    repairLogo();
    repairButtons();
    restoreSlotsGalleries();

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
