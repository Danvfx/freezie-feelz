/* ==========================================================================
   FreezieFeelz — script.js
   Vanilla JS, no dependencies. Sections:
   1 CONFIG · 2 FLAVORS (menu data) · 3 Helpers · 4 Navbar · 5 Hero mood picker
   6 Menu cards · 7 Order form helpers · 8 Tabs · 9 Forms (validate + submit)
   10 Scroll reveal · 11 Init
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     1. CONFIG — the only place you need to edit to connect the site
     ====================================================================== */
  var CONFIG = {
    /*
      FORM ENDPOINT (Option 1: free form service)
      TODO: paste your endpoint here.
        Formspree:  "https://formspree.io/f/yourFormId"
        Web3Forms:  "https://api.web3forms.com/submit"  (and set ACCESS_KEY below)
      Leave it as "" and the form falls back to Option 2: it builds a ready-to-send
      message, copies it, and lets the customer send it on Messenger.
    */
    FORM_ENDPOINT: '',

    // TODO: Web3Forms access key (only needed for Web3Forms; leave "" for Formspree).
    ACCESS_KEY: '',

    // TODO: currency symbol shown on prices.
    CURRENCY: '₱',

    // Operating hours, shown in Contact, the footer, the order form and the FAQ.
    // TODO: confirm hours. The study says operations run 8:00 AM to 5:00 PM, but its staff schedule table starts at 9:00 AM.
    HOURS: 'Monday to Friday, 8:00 AM to 5:00 PM',
    HOURS_CLOSED: 'Closed on weekends and public holidays',

    // Where to find the booth, shown in Contact.
    // TODO: confirm exact pickup spot. The study says La Salle College Antipolo in most places, but also calls the office location "Bayan".
    LOCATION: 'Located at La Salle College Antipolo. Meet-up delivery is available within Antipolo.',

    // TODO: promo video. Paste an embed link here (for example a YouTube embed URL) and the "See us in action" box shows it.
    // Leave "" to keep the "coming soon" placeholder.
    PROMO_VIDEO_URL: ''
  };

  var LINKS = {
    // TODO: replace both "#" placeholders with the real links, for example
    //   messenger: "https://m.me/yourpage"
    //   instagram: "https://instagram.com/yourhandle"
    messenger: '#',
    instagram: '#'
  };

  /*
    SIZES: the ONE place prices live. Every price on the site (menu cards, hero tag, order form total,
    FAQ, About facts) is read from here. Prices come from the Final Feasibility Study.
  */
  var SIZES = [
    { id: '16oz', label: '16 oz', price: 55 },
    { id: '22oz', label: '22 oz', price: 65 }
  ];

  /*
    PROMO: "Buy 3 get 1 free". The order form applies it to one order line, so every group of
    BUY + FREE drinks (4) includes FREE (1) at no charge.
    ASSUMPTION: same size and flavour per order line, and it applies automatically.
    TODO: confirm the exact promo rules. "10% off for the last customers" depends on time of day,
    so it is shown as text only and is not calculated in the form.
  */
  var PROMO = { BUY: 3, FREE: 1 };

  /* ======================================================================
     2. FLAVORS — edit this array to change the menu, the hero chips and the
        order dropdown all at once.
        mood: shown as "The <mood>" on cards and as a button in the hero.
        image: path to the product photo. Leave "" to show a placeholder.
        c1 / c2: the two colours of the drink (top / bottom), used behind
                 the photo and for the placeholder.
        face: cartoon-cup expression used while there is no photo (joyful,
              carefree, frustrated, confident, melancholic, affectionate,
              hopeful, curious, motivated).
     ====================================================================== */
  // The nine flavours below are the group's confirmed final list, each with its confirmed mood. Descriptions are placeholders (TODO: rewrite in the team's own words).
  // RESOLVED: the study said "nine distinct flavors" but named only seven. The group has now confirmed the full nine, so Watermelon, Lemon and Orange are live.
  //       Cucumber Lemonade (named in the study, not in the final nine) is kept below as a commented-out line.
  // Moods are confirmed by the group (they were not in the study). The addendum's own guesses (Strawberry = Sweet, Mango = Sunny,
  //       Green Apple = Zesty, Blueberry = Calm, Grapes = Playful, Lychee = Dreamy) are no longer used.
  //       Final moods: Mango Joyful, Watermelon Carefree, Lemon Frustrated, Grapes Confident, Blueberry Melancholic,
  //       Strawberry Affectionate, Lychee Hopeful, Green Apple Curious, Orange Motivated.
  // Photos: every live flavour has one at assets/images/flavor-<id>.webp. The spare Cucumber Lemonade photo is saved there too.
  // TODO: the photo-to-flavour matching was a guess from the cup colours. Confirm it.
  // Prices are NOT set per flavour. They come from SIZES above (16 oz and 22 oz).
  var FLAVORS = [
    { id: 'strawberry', mood: 'Affectionate', name: 'Strawberry', desc: 'Sweet strawberry made for sharing the love.', c1: '#ff9bb5', c2: '#f2456e', face: 'affectionate', image: 'assets/images/flavor-strawberry.webp' },
    { id: 'mango', mood: 'Joyful', name: 'Mango', desc: 'Sunny mango that makes any day feel like a celebration.', c1: '#ffe066', c2: '#ffb400', face: 'joyful', image: 'assets/images/flavor-mango.webp' },
    { id: 'green-apple', mood: 'Curious', name: 'Green Apple', desc: 'Crisp green apple with a tangy twist. Take a sip and find out.', c1: '#d8ff6a', c2: '#5cd13a', face: 'curious', image: 'assets/images/flavor-green-apple.webp' },
    { id: 'blueberry', mood: 'Melancholic', name: 'Blueberry', desc: 'Cool blueberry for quiet, thoughtful moments.', c1: '#7fd0ff', c2: '#1a4fd6', face: 'melancholic', image: 'assets/images/flavor-blueberry.webp' },
    // Cucumber Lemonade: in the study but not in the group's final nine, so it is commented out (its photo is kept):
    // { id: 'cucumber-lemonade', mood: 'Frustrated', name: 'Cucumber Lemonade', desc: 'Cool cucumber and zesty lemonade for when things get annoying.', c1: '#f4ffb8', c2: '#6fd8b0', face: 'frustrated', image: 'assets/images/flavor-cucumber-lemonade.webp' },
    { id: 'grapes', mood: 'Confident', name: 'Grapes', desc: 'Bold grape with a smooth finish. Walk in like you own it.', c1: '#d79bff', c2: '#6c3ad8', face: 'confident', image: 'assets/images/flavor-grapes.webp' },
    { id: 'lychee', mood: 'Hopeful', name: 'Lychee', desc: 'Light, floral lychee for when good things are coming.', c1: '#fff0f3', c2: '#f5b3c6', face: 'hopeful', image: 'assets/images/flavor-lychee.webp' },
    // Watermelon, Lemon and Orange were not named in the study. The group confirmed them, so they are live:
    { id: 'watermelon', mood: 'Carefree', name: 'Watermelon', desc: 'Juicy watermelon for when nothing is bugging you.', c1: '#ff9db0', c2: '#35c27a', face: 'carefree', image: 'assets/images/flavor-watermelon.webp' },
    { id: 'lemon', mood: 'Frustrated', name: 'Lemon', desc: 'Sharp, zingy lemon to shake off a rough day.', c1: '#fff59a', c2: '#f0d000', face: 'frustrated', image: 'assets/images/flavor-lemon.webp' },
    { id: 'orange', mood: 'Motivated', name: 'Orange', desc: 'Bright orange to get you up and going.', c1: '#ffc266', c2: '#ff7a1a', face: 'motivated', image: 'assets/images/flavor-orange.webp' }
  ];

  /* ======================================================================
     3. HELPERS
     ====================================================================== */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function money(n) { return CONFIG.CURRENCY + n; }
  function findFlavor(id) { return FLAVORS.filter(function (f) { return f.id === id; })[0]; }
  function sizeById(id) { return SIZES.filter(function (z) { return z.id === id; })[0]; }
  function minPrice() { return Math.min.apply(null, SIZES.map(function (z) { return z.price; })); }

  /* Price for one order line: size x quantity, with Buy 3 get 1 free applied. */
  function orderPricing(sizeId, n) {
    var size = sizeById(sizeId);
    if (!size || !(n > 0)) { return null; }
    var free = Math.floor(n / (PROMO.BUY + PROMO.FREE)) * PROMO.FREE;
    return { size: size, unit: size.price, free: free, total: (n - free) * size.price };
  }

  function listWords(arr) {
    if (arr.length < 2) { return arr.join(''); }
    return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  }

  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2800);
  }

  function scrollToEl(el) {
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  /* Apply the Messenger / Instagram links from CONFIG to every [data-link] anchor */
  function applyLinks() {
    $$('[data-link]').forEach(function (a) {
      if (a.getAttribute('data-bound')) { return; }
      a.setAttribute('data-bound', '1');
      var url = LINKS[a.getAttribute('data-link')];
      if (url) { a.setAttribute('href', url); }
      if (!url || url === '#') {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          toast('This link is coming soon!');
        });
      }
    });
  }

  /* ======================================================================
     4. NAVBAR (hamburger on mobile)
     ====================================================================== */
  function initNav() {
    var toggle = $('#navToggle');
    var menu = $('#navMenu');

    function setOpen(open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setOpen(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 880) { setOpen(false); }
    });
  }

  /* ======================================================================
     5. HERO MOOD PICKER — the product shot swaps with the mood. Moods with
        no photo yet show a cartoon cup that changes colour and face.
     ====================================================================== */
  // Cartoon cup faces, drawn around (0,0). Each is a small SVG snippet.
  var INK = '#0a1f44';
  var BLUSH = '<ellipse cx="-58" cy="14" rx="13" ry="8" fill="#ff7fa6" opacity=".55"/><ellipse cx="58" cy="14" rx="13" ry="8" fill="#ff7fa6" opacity=".55"/>';
  var STROKE = 'fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"';
  var HEART = 'M0 12 C-24 -6 -18 -26 -7 -26 C-2 -26 0 -21 0 -21 C0 -21 2 -26 7 -26 C18 -26 24 -6 0 12Z';
  var FONT = 'font-family="Fredoka, sans-serif" font-weight="700"';
  var DOT = function (x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/>'; };
  var BROW = function (d) { return '<path d="' + d + '" ' + STROKE + '/>'; };
  var BIGEYE = function (x, y, px, py) {
    return '<circle cx="' + x + '" cy="' + y + '" r="13" fill="#fff" stroke="' + INK + '" stroke-width="6"/>' + DOT(px, py, 6);
  };
  var FACES = {
    joyful: BLUSH +
      BROW('M-46 -4 Q-32 -26 -18 -4') + BROW('M18 -4 Q32 -26 46 -4') +
      '<path d="M-26 12 Q0 56 26 12Z" fill="' + INK + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M-12 32 Q0 24 12 32 Q0 42 -12 32Z" fill="#ff7fa6"/>',
    carefree:
      '<rect x="-52" y="-24" width="44" height="26" rx="10" fill="' + INK + '"/><rect x="8" y="-24" width="44" height="26" rx="10" fill="' + INK + '"/>' +
      '<path d="M-8 -14 H8" ' + STROKE + '/><path d="M-44 -17 L-34 -17 M16 -17 L26 -17" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M-18 20 Q0 40 18 20" ' + STROKE + '/>',
    frustrated: BLUSH +
      BROW('M-50 -28 L-16 -14') + BROW('M50 -28 L16 -14') + DOT(-32, -2, 7) + DOT(32, -2, 7) +
      '<path d="M-20 36 Q0 18 20 36" ' + STROKE + '/>' +
      '<path d="M62 -10 q-8 12 0 18 q8 -6 0 -18z" fill="#91e1ff" stroke="' + INK + '" stroke-width="4"/>',
    confident: BLUSH +
      BROW('M-48 -26 H-16') + BROW('M16 -34 L48 -28') +
      '<path d="M-44 -4 Q-32 -14 -20 -4" ' + STROKE + '/>' + DOT(-32, -2, 6) +
      '<path d="M20 -4 Q32 -14 44 -4" ' + STROKE + '/>' + DOT(32, -2, 6) +
      '<path d="M-20 24 Q6 38 24 14" ' + STROKE + '/>',
    melancholic: BLUSH +
      BROW('M-50 -16 L-18 -28') + BROW('M50 -16 L18 -28') + DOT(-32, 0, 7) + DOT(32, 0, 7) +
      '<path d="M-16 36 Q0 20 16 36" ' + STROKE + '/>' +
      '<path d="M-40 12 q-7 11 0 16 q7 -5 0 -16z" fill="#7fd0ff" stroke="' + INK + '" stroke-width="4"/>',
    affectionate: BLUSH +
      '<g transform="translate(-32 -4) scale(.9)"><path d="' + HEART + '" fill="#fff" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/></g>' +
      '<g transform="translate(32 -4) scale(.9)"><path d="' + HEART + '" fill="#fff" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/></g>' +
      '<path d="M-14 22 Q0 36 14 22" ' + STROKE + '/>',
    hopeful: BLUSH +
      BIGEYE(-32, -10, -28, -16) + BIGEYE(32, -10, 36, -16) +
      '<path d="M-14 24 Q0 38 14 24" ' + STROKE + '/>' +
      '<path d="M62 -38 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="#ffd23f" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>',
    curious: BLUSH +
      DOT(-32, -8, 8) + BIGEYE(32, -10, 34, -8) +
      BROW('M16 -36 Q32 -48 48 -34') +
      '<ellipse cx="8" cy="28" rx="8" ry="10" fill="' + INK + '"/>' +
      '<text x="56" y="-44" ' + FONT + ' font-size="34" fill="' + INK + '">?</text>',
    motivated: BLUSH +
      BROW('M-48 -26 L-18 -20') + BROW('M48 -26 L18 -20') + DOT(-32, -6, 8) + DOT(32, -6, 8) +
      '<path d="M-24 14 H24 Q20 38 0 38 Q-20 38 -24 14Z" fill="#fff" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M-8 14 V36 M8 14 V36" stroke="' + INK + '" stroke-width="4"/>' +
      '<path d="M-74 -46 H74" stroke="' + INK + '" stroke-width="22" stroke-linecap="round"/><path d="M-74 -46 H74" stroke="#ffd23f" stroke-width="12" stroke-linecap="round"/>'
  };

  var currentId = FLAVORS[0].id;
  var heroPhoto = null; // hero photo element, created on first use in setMood

  function setMood(id, animate) {
    var f = findFlavor(id);
    if (!f) { return; }
    currentId = id;

    var cup = $('#heroCup');
    var visual = $('#heroVisual');
    visual.style.setProperty('--c1', f.c1);
    visual.style.setProperty('--c2', f.c2);
    cup.style.setProperty('--c1', f.c1);
    cup.style.setProperty('--c2', f.c2);
    $('#cupFace').innerHTML = FACES[f.face] || FACES.joyful;
    $('#heroMood').textContent = 'The ' + f.mood;
    $('#heroName').textContent = f.name + ' · from ' + money(minPrice());

    // Real photo if there is one, otherwise the cartoon cup
    var hasPhoto = Boolean(f.image);
    if (hasPhoto) {
      if (!heroPhoto) {
        heroPhoto = document.createElement('img');
        heroPhoto.className = 'hero__photo';
        heroPhoto.width = 800;
        heroPhoto.height = 1000;
        visual.appendChild(heroPhoto);
      }
      heroPhoto.src = f.image;
      heroPhoto.alt = f.name + ' drink, ' + f.mood.toLowerCase() + ' mood';
      heroPhoto.hidden = false;
    } else if (heroPhoto) {
      heroPhoto.hidden = true;
    }
    cup.style.display = hasPhoto ? 'none' : '';
    $('#heroBlob').hidden = !hasPhoto;

    $$('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-id') === id));
    });

    if (animate && !reduceMotion) {
      var el = hasPhoto ? heroPhoto : cup;
      if (!el) { return; }
      el.classList.remove('is-popping');
      void el.getBoundingClientRect(); // restart the animation
      el.classList.add('is-popping');
    }
  }

  function initHero() {
    var wrap = $('#moodChips');
    FLAVORS.forEach(function (f) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = f.mood;
      b.setAttribute('data-id', f.id);
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { setMood(f.id, true); });
      wrap.appendChild(b);
    });
    $('#heroOrder').addEventListener('click', function () { chooseFlavor(currentId); });

    setMood(currentId, false);

    // Warm the cache so switching moods does not flash an empty frame
    window.addEventListener('load', function () {
      FLAVORS.forEach(function (f) { if (f.image) { new Image().src = f.image; } });
    });
  }

  /* ======================================================================
     6. MENU CARDS (built from FLAVORS)
     ====================================================================== */
  function initMenu() {
    var grid = $('#menuGrid');
    FLAVORS.forEach(function (f, i) {
      var li = document.createElement('li');
      li.className = 'reveal';
      li.style.transitionDelay = (i % 3) * 80 + 'ms';

      // Photo if the flavour has one, otherwise a placeholder cup. Both sit on the colour blob.
      var media = f.image
        ? '<img class="card__photo" src="' + f.image + '" alt="' + f.name + ' drink in a FreezieFeelz cup" loading="lazy" width="800" height="1000">'
        : '<svg class="card__ph" viewBox="0 0 60 84" role="img" aria-label="Placeholder picture for ' + f.name + '"><use href="#cup-icon"/></svg>';

      li.innerHTML =
        '<article class="card" style="--c1:' + f.c1 + ';--c2:' + f.c2 + '">' +
          '<div class="card__media"><span class="card__blob" aria-hidden="true"></span>' + media + '</div>' +
          '<div class="card__body">' +
            '<span class="card__mood">The ' + f.mood + '</span>' +
            '<h3>' + f.name + '</h3>' +
            '<p class="card__desc">' + f.desc + '</p>' +
            '<div class="card__foot">' +
              '<span class="card__prices">' + SIZES.map(function (z) { return '<span><small>' + z.label + '</small> <b>' + money(z.price) + '</b></span>'; }).join('') + '</span>' +
              '<button class="btn btn--sun btn--sm" type="button" data-order="' + f.id + '">Order this</button>' +
            '</div>' +
          '</div>' +
        '</article>';
      grid.appendChild(li);
    });

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-order]');
      if (btn) { chooseFlavor(btn.getAttribute('data-order')); }
    });

    // "Build Your Own" path button
    $$('[data-build]').forEach(function (b) { b.addEventListener('click', chooseCustom); });
  }

  /* ======================================================================
     7. ORDER FORM HELPERS
     ====================================================================== */
  var qty = $('#o-qty');
  var flavorSel = $('#o-flavor');

  function buildFlavorOptions() {
    var first = document.createElement('option');
    first.value = '';
    first.textContent = 'Choose a flavour';
    flavorSel.appendChild(first);
    FLAVORS.forEach(function (f) {
      var o = document.createElement('option');
      o.value = f.id;
      o.textContent = f.name + ' – The ' + f.mood;
      flavorSel.appendChild(o);
    });
    // Second path: build your own combination
    var own = document.createElement('option');
    own.value = 'custom';
    own.textContent = 'Build Your Own (mix one or two flavours)';
    flavorSel.appendChild(own);
  }

  /* Size options come from SIZES, so prices live in one place. */
  function buildSizeOptions() {
    var sel = $('#o-size');
    var first = document.createElement('option');
    first.value = '';
    first.textContent = 'Choose a size';
    sel.appendChild(first);
    SIZES.forEach(function (z) {
      var o = document.createElement('option');
      o.value = z.id;
      o.textContent = z.label + ' – ' + money(z.price);
      sel.appendChild(o);
    });
  }

  /* Flavour pickers for "Build Your Own" */
  function buildMixOptions() {
    [['#o-mix1', 'Choose a flavour'], ['#o-mix2', 'No second flavour']].forEach(function (cfg) {
      var sel = $(cfg[0]);
      var first = document.createElement('option');
      first.value = '';
      first.textContent = cfg[1];
      sel.appendChild(first);
      FLAVORS.forEach(function (f) {
        var o = document.createElement('option');
        o.value = f.id;
        o.textContent = f.name;
        sel.appendChild(o);
      });
    });
  }

  var THIRD_PARTY = 'Third-party delivery';

  function setRequired(field, on) {
    if (on) { field.setAttribute('required', ''); } else { field.removeAttribute('required'); clearError(field); }
  }

  /* Show the delivery-app picker and the Build Your Own pickers only when they apply. */
  function syncOrderFields() {
    var third = $('#o-method').value === THIRD_PARTY;
    $('#o-provider-field').hidden = !third;
    setRequired($('#o-provider'), third);

    var custom = flavorSel.value === 'custom';
    $('#o-custom').hidden = !custom;
    setRequired($('#o-mix1'), custom);
  }

  function clampQty() {
    var n = parseInt(qty.value, 10);
    if (isNaN(n)) { return NaN; }
    return Math.min(20, Math.max(1, n));
  }

  function updateTotal() {
    var n = parseInt(qty.value, 10);
    var p = orderPricing($('#o-size').value, n > 0 ? Math.min(n, 20) : 0);
    $('#orderTotal').textContent = p ? money(p.total) : '–';
    // Label the promo clearly when it kicks in
    $('#orderPromoNote').textContent = (p && p.free)
      ? '(Buy 3 get 1 free applied: ' + p.free + ' free, you save ' + money(p.free * p.unit) + ')'
      : '';
  }

  /* Called by the hero button and every "Order this" button */
  function chooseFlavor(id) {
    var f = findFlavor(id);
    if (!f) { return; }
    showTab('order');
    resetOrderForm(false);
    flavorSel.value = id;
    clearError(flavorSel);
    syncOrderFields();
    updateTotal();
    toast(f.name + ' added to your order');
    scrollToEl($('#order'));
    setTimeout(function () { $('#o-name').focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
  }

  /* Called by the "Build Your Own" button in the menu section */
  function chooseCustom() {
    showTab('order');
    resetOrderForm(false);
    flavorSel.value = 'custom';
    clearError(flavorSel);
    syncOrderFields();
    updateTotal();
    toast('Build Your Own: pick up to two flavours');
    scrollToEl($('#order'));
    setTimeout(function () { $('#o-name').focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
  }

  /* ======================================================================
     8. TABS (Place an order / Send an inquiry)
     ====================================================================== */
  var tabs = [$('#tab-order'), $('#tab-inquiry')];

  function showTab(which) {
    tabs.forEach(function (t) {
      var on = t.id === 'tab-' + which;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
  }

  function initTabs() {
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { showTab(t.id.replace('tab-', '')); });
      t.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') { next = tabs[(i + 1) % tabs.length]; }
        if (e.key === 'ArrowLeft') { next = tabs[(i - 1 + tabs.length) % tabs.length]; }
        if (e.key === 'Home') { next = tabs[0]; }
        if (e.key === 'End') { next = tabs[tabs.length - 1]; }
        if (next) { e.preventDefault(); next.focus(); showTab(next.id.replace('tab-', '')); }
      });
    });
  }

  /* ======================================================================
     9. FORMS — validation, then send
     ====================================================================== */
  var MESSAGES = {
    'o-name': 'Please tell us your name so we know who the order is for.',
    'o-grade': 'Add your grade and section so we can find you.',
    'o-flavor': 'Pick a flavour, or choose Build Your Own.',
    'o-mix1': 'Pick the first flavour for your Build Your Own drink.',
    'o-size': 'Choose 16 oz or 22 oz.',
    'o-payment': 'Choose how you will pay: GCash, Maya, or cash.',
    'o-provider': 'Choose Grab, Foodpanda, or Lalamove.',
    'o-qty': 'Choose between 1 and 20 drinks.',
    'o-time': 'Tell us when you would like it, like "Recess on Friday".',
    'i-name': 'Please tell us your name.',
    'i-method': 'Choose how we can reach you.',
    'i-details': 'Add the username, email, or grade and section we should use.',
    'i-message': 'Write a short message so we know how to help.'
  };

  function errEl(field) { return document.getElementById(field.id + '-err'); }

  function setError(field, msg) {
    field.setAttribute('aria-invalid', 'true');
    errEl(field).textContent = msg;
  }
  function clearError(field) {
    field.removeAttribute('aria-invalid');
    var e = errEl(field);
    if (e) { e.textContent = ''; }
  }

  function fieldValid(field) {
    if (field === qty) {
      var n = parseInt(qty.value, 10);
      return n >= 1 && n <= 20;
    }
    return field.value.trim() !== '';
  }

  /* Validate every required field; focus the first problem. */
  function validate(form) {
    var firstBad = null;
    $$('[required]', form).forEach(function (field) {
      if (fieldValid(field)) {
        clearError(field);
      } else {
        setError(field, MESSAGES[field.id] || 'This field is needed.');
        if (!firstBad) { firstBad = field; }
      }
    });
    if (firstBad) { firstBad.focus(); }
    return !firstBad;
  }

  /* Re-check a field as soon as the person fixes it */
  function liveValidate(form) {
    form.addEventListener('input', function (e) {
      var f = e.target;
      if (f.getAttribute && f.getAttribute('aria-invalid') === 'true' && fieldValid(f)) { clearError(f); }
    });
    form.addEventListener('change', function (e) {
      var f = e.target;
      if (f.getAttribute && f.getAttribute('aria-invalid') === 'true' && fieldValid(f)) { clearError(f); }
    });
  }

  function orderData() {
    var custom = flavorSel.value === 'custom';
    var f = findFlavor(flavorSel.value);
    var m1 = findFlavor($('#o-mix1').value);
    var m2 = findFlavor($('#o-mix2').value);
    var n = clampQty();
    var p = orderPricing($('#o-size').value, n);
    var third = $('#o-method').value === THIRD_PARTY;
    return {
      type: 'Order',
      name: $('#o-name').value.trim(),
      grade_and_section: $('#o-grade').value.trim(),
      flavour: custom
        ? 'Build Your Own: ' + (m1 ? m1.name : '') + (m2 ? ' + ' + m2.name : '')
        : f.name + ' (The ' + f.mood + ')',
      size: p.size.label,
      quantity: n,
      free_drinks: p.free,
      total: money(p.total),
      fulfillment: $('#o-method').value + (third ? ' (' + $('#o-provider').value + ')' : ''),
      payment: $('#o-payment').value,
      preferred_time: $('#o-time').value.trim(),
      notes: $('#o-notes').value.trim() || 'None'
    };
  }

  function inquiryData() {
    return {
      type: 'Inquiry',
      name: $('#i-name').value.trim(),
      contact_method: $('#i-method').value,
      contact_details: $('#i-details').value.trim(),
      message: $('#i-message').value.trim()
    };
  }

  /* Turn the data into a plain-text message (used for email subjects and the Messenger fallback) */
  function toMessage(d) {
    if (d.type === 'Order') {
      return 'New FreezieFeelz order\n' +
        'Name: ' + d.name + '\n' +
        'Grade and section: ' + d.grade_and_section + '\n' +
        'Flavour: ' + d.flavour + '\n' +
        'Size: ' + d.size + '\n' +
        'Quantity: ' + d.quantity + (d.free_drinks ? ' (' + d.free_drinks + ' free with Buy 3 get 1 free)' : '') + '\n' +
        'Estimated total: ' + d.total + '\n' +
        'Fulfillment: ' + d.fulfillment + '\n' +
        'Payment: ' + d.payment + '\n' +
        'Preferred time: ' + d.preferred_time + '\n' +
        'Notes: ' + d.notes;
    }
    return 'FreezieFeelz inquiry\n' +
      'Name: ' + d.name + '\n' +
      'Reach me by: ' + d.contact_method + ' (' + d.contact_details + ')\n' +
      'Message: ' + d.message;
  }

  /*
    SEND. This is the one place the form talks to the outside world.
    With FORM_ENDPOINT set, it POSTs JSON (works with Formspree and Web3Forms).
    Without it, it resolves with { fallback: true } and the success panel shows
    the copy-and-send-on-Messenger message instead.
  */
  function send(data) {
    if (!CONFIG.FORM_ENDPOINT) {
      return Promise.resolve({ fallback: true });
    }
    var body = Object.assign({}, data, { subject: 'FreezieFeelz ' + data.type.toLowerCase() + ' from ' + data.name });
    if (CONFIG.ACCESS_KEY) { body.access_key = CONFIG.ACCESS_KEY; }
    return fetch(CONFIG.FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) { throw new Error('bad status ' + res.status); }
      return { fallback: false };
    });
  }

  function copyText(text, fallbackEl) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(fallbackEl); });
    }
    return Promise.resolve(legacyCopy(fallbackEl));
  }
  function legacyCopy(el) {
    try {
      el.focus();
      el.select();
      return document.execCommand('copy');
    } catch (err) {
      return false;
    }
  }

  function showSuccess(kind, data, result) {
    var form = $(kind === 'order' ? '#orderForm' : '#inquiryForm');
    var box = $(kind === 'order' ? '#orderSuccess' : '#inquirySuccess');
    var msg = toMessage(data);
    var title = kind === 'order' ? 'Order sent!' : 'Message sent!';
    var html;

    if (result.fallback) {
      // Option 2: no form service connected yet, so hand the message over to Messenger
      html =
        '<div class="success__icon" aria-hidden="true">🧊</div>' +
        '<h3>Almost there!</h3>' +
        '<p>Your message is ready. Send it to us on Messenger and we\'ll get back to you.</p>' +
        '<textarea class="success__summary" readonly aria-label="Your message">' + msg.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</textarea>' +
        '<div class="success__actions">' +
          '<button class="btn btn--sun btn--block" type="button" data-act="copy">Copy my message</button>' +
          '<a class="btn btn--white btn--block" href="' + (LINKS.messenger || '#') + '" data-link="messenger" target="_blank" rel="noopener">Open Messenger</a>' +
          '<button class="btn btn--ghost-dark btn--block" type="button" data-act="again">Start a new ' + (kind === 'order' ? 'order' : 'message') + '</button>' +
        '</div>';
    } else {
      html =
        '<div class="success__icon" aria-hidden="true">🎉</div>' +
        '<h3>' + title + '</h3>' +
        '<p>Thanks, ' + escapeHtml(data.name) + '! ' + (kind === 'order'
          ? 'We got your order for ' + data.quantity + ' &times; ' + escapeHtml(data.size) + ' ' + escapeHtml(data.flavour) + '. We\'ll confirm the details soon.'
          : 'We got your message and will reply soon.') + '</p>' +
        '<div class="success__actions">' +
          '<button class="btn btn--sun btn--block" type="button" data-act="again">' + (kind === 'order' ? 'Order another drink' : 'Send another message') + '</button>' +
        '</div>';
    }

    box.innerHTML = html;
    form.hidden = true;
    box.hidden = false;
    box.focus();
    applyLinks();

    box.onclick = function (e) {
      var act = e.target.closest('[data-act]');
      if (!act) { return; }
      if (act.getAttribute('data-act') === 'again') {
        box.hidden = true;
        box.innerHTML = '';
        form.reset();
        if (kind === 'order') { resetOrderForm(true); }
        form.hidden = false;
        $('input, select', form).focus();
      } else {
        var ta = $('.success__summary', box);
        copyText(msg, ta).then(function (ok) {
          toast(ok ? 'Copied! Paste it into Messenger.' : 'Select the text and copy it by hand.');
        });
      }
    };

    // Try to copy for them straight away so it is one paste away
    if (result.fallback) {
      copyText(msg, $('.success__summary', box)).then(function (ok) {
        if (ok) { toast('Message copied. Paste it into Messenger.'); }
      });
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function resetOrderForm(clearFlavor) {
    qty.value = qty.value || 1;
    if (clearFlavor) {
      $('#orderForm').reset();
      qty.value = 1;
      $$('#orderForm [aria-invalid]').forEach(clearError);
    }
    syncOrderFields();
    updateTotal();
  }

  function handleSubmit(form, kind, collect, statusEl) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';

      // Honeypot: bots fill hidden fields. Pretend it worked and stop.
      if (form.elements.botcheck && form.elements.botcheck.value) { return; }
      if (!validate(form)) { return; }

      var btn = $('button[type="submit"]', form);
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      var data = collect();
      send(data).then(function (result) {
        showSuccess(kind, data, result);
      }).catch(function () {
        statusEl.textContent = 'We couldn\'t send that just now. Check your internet and try again, or message us on Messenger.';
      }).then(function () {
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  }

  function initForms() {
    buildFlavorOptions();
    buildSizeOptions();
    buildMixOptions();

    var orderForm = $('#orderForm');
    var inquiryForm = $('#inquiryForm');
    liveValidate(orderForm);
    liveValidate(inquiryForm);

    $('#qtyMinus').addEventListener('click', function () {
      qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) - 1);
      clearError(qty);
      updateTotal();
    });
    $('#qtyPlus').addEventListener('click', function () {
      qty.value = Math.min(20, (parseInt(qty.value, 10) || 0) + 1);
      clearError(qty);
      updateTotal();
    });
    qty.addEventListener('input', updateTotal);
    qty.addEventListener('blur', function () {
      var n = clampQty();
      if (!isNaN(n)) { qty.value = n; }
      updateTotal();
    });
    flavorSel.addEventListener('change', function () { syncOrderFields(); updateTotal(); });
    $('#o-size').addEventListener('change', updateTotal);
    $('#o-method').addEventListener('change', syncOrderFields);

    handleSubmit(orderForm, 'order', orderData, $('#orderStatus'));
    handleSubmit(inquiryForm, 'inquiry', inquiryData, $('#inquiryStatus'));
    updateTotal();
  }

  /* ======================================================================
     9b. INFO FILLERS: hours, location, prices and flavour list are written once
         (CONFIG, SIZES, FLAVORS) and copied into every spot that shows them.
     ====================================================================== */
  function initInfo() {
    function fill(sel, text) { $$(sel).forEach(function (el) { el.textContent = text; }); }
    fill('[data-hours]', CONFIG.HOURS);
    fill('[data-hours-closed]', CONFIG.HOURS_CLOSED);
    fill('[data-location]', CONFIG.LOCATION);
    fill('[data-price-line]', SIZES.map(function (z) { return money(z.price) + ' for ' + z.label; }).join(' and '));
    fill('[data-flavor-list]', listWords(FLAVORS.map(function (f) { return f.name; })));
    fill('[data-count="flavors"]', String(FLAVORS.length));
    fill('[data-count="from-price"]', money(minPrice()));

    var strip = $('#priceStrip');
    if (strip) {
      strip.innerHTML = SIZES.map(function (z) {
        return '<span class="size"><b>' + z.label + '</b><span>' + money(z.price) + '</span></span>';
      }).join('');
    }
  }

  /* Promo video: drops an iframe into the slot when PROMO_VIDEO_URL is set */
  function initVideo() {
    var slot = $('#promoVideo');
    if (!slot || !CONFIG.PROMO_VIDEO_URL) { return; }
    var frame = document.createElement('iframe');
    frame.src = CONFIG.PROMO_VIDEO_URL;
    frame.title = 'FreezieFeelz promo video';
    frame.loading = 'lazy';
    frame.allowFullscreen = true;
    slot.replaceChildren(frame);
  }

  /* ======================================================================
     9c. VIBE TEST: "What is your FreezieFeelz?" Four questions, one matched flavour.
         Layout idea borrowed from a flavour-match quiz: a ring of flavour tiles, big
         one-question-at-a-time screens, pill answers, then a result.
     ====================================================================== */
  /*
    Each answer gives points to flavours (by id). The flavour with the most points wins; earlier
    questions break ties. A flavour that is not in FLAVORS is ignored, so the quiz keeps working
    when flavours are added or removed. To make a new flavour reachable, add its id to some answers.
    The moods behind this scoring are the group's confirmed ones (see FLAVORS). TODO: the questions and points are placeholders.
  */
  var VIBE_QUESTIONS = [
    { q: 'How do you feel today?', answers: [
      { text: 'Sunny and happy', points: { mango: 3, strawberry: 1 } },
      { text: 'Quiet and thoughtful', points: { blueberry: 3, lychee: 1 } },
      { text: 'Hopeful about what is coming', points: { lychee: 3, strawberry: 1 } },
      { text: 'Curious about everything', points: { 'green-apple': 3, mango: 1 } },
      { text: 'Relaxed, nothing is bugging me', points: { watermelon: 3, mango: 1 } }
    ] },
    { q: 'What is your energy right now?', answers: [
      { text: 'I need to cool down', points: { lemon: 3, blueberry: 1 } },
      { text: 'Confident, watch me', points: { grapes: 3, mango: 1 } },
      { text: 'Warm and caring', points: { strawberry: 3, lychee: 1 } },
      { text: 'Playful and silly', points: { 'green-apple': 2, mango: 2 } },
      { text: 'Ready to get things done', points: { orange: 3, grapes: 1 } }
    ] },
    { q: 'Who are you with?', answers: [
      { text: 'Just myself', points: { blueberry: 1, lemon: 1 } },
      { text: 'My besties', points: { watermelon: 1, 'green-apple': 1 } },
      { text: 'Someone special', points: { strawberry: 1, lychee: 1 } },
      { text: 'A big fun crew', points: { grapes: 1, orange: 1 } }
    ] },
    { q: 'What flavour vibe are you into?', answers: [
      { text: 'Fresh and juicy', points: { watermelon: 2, lychee: 1 } },
      { text: 'Sweet and fruity', points: { strawberry: 2, mango: 1 } },
      { text: 'Tangy and zesty', points: { 'green-apple': 2, lemon: 1, orange: 1 } },
      { text: 'Bold and deep', points: { grapes: 2, blueberry: 1 } }
    ] }
  ];

  // TODO: placeholder result lines, rewrite in the team's own words.
  var VIBE_LINES = {
    'strawberry': 'You wear your heart on your sleeve and you love sharing the good stuff. People feel warm around you.',
    'mango': 'You bring the sunshine. Your joy is catching, and everyone wants a seat at your table.',
    'green-apple': 'You ask "why?" and "what if?" before anyone else. Your curiosity keeps things interesting.',
    'blueberry': 'You are thoughtful and a little dreamy. You like quiet moments and you feel things deeply.',
    'lemon': 'Some days are a lot. You know how to shake it off, cool down, and come back stronger.',
    'watermelon': 'Nothing is bugging you today. You go with the flow and keep things juicy.',
    'orange': 'You woke up ready. Goals set, energy up, and you are not slowing down.',
    'grapes': 'You walk in like you own the room. Bold, steady, and sure of yourself.',
    'lychee': 'You believe good things are coming, and you are usually right. Light, bright, and hopeful.'
  };

  var VIBE_BADGES = ['var(--sky)', 'var(--sun)', '#ffb3cc', '#c9f3d0'];

  function flavorMedia(f, cls) {
    return f.image
      ? '<img class="' + cls + '" src="' + f.image + '" alt="" width="800" height="1000" loading="lazy">'
      : '<svg class="' + cls + ' vt__ph" viewBox="0 0 60 84" aria-hidden="true"><use href="#cup-icon"/></svg>';
  }

  function initVibeTest() {
    var root = $('#vibe');
    if (!root) { return; }
    var intro = $('#vtIntro');
    var quiz = $('#vtQuiz');
    var result = $('#vtResult');
    var step = 0;
    var picks = [];
    var locked = false;

    // Ring of flavour tiles around the intro headline
    var ring = $('#vtRing');
    ring.style.setProperty('--n', FLAVORS.length);
    ring.innerHTML = FLAVORS.map(function (f, i) {
      return '<span class="vt__tile" style="--i:' + i + ';--c1:' + f.c1 + ';--c2:' + f.c2 + '"><span class="vt__tile-in">' + flavorMedia(f, 'vt__tile-img') + '</span></span>';
    }).join('');

    function show(panel) {
      [intro, quiz, result].forEach(function (el) { el.hidden = el !== panel; });
    }

    function renderQuestion(dir) {
      var item = VIBE_QUESTIONS[step];
      var body = $('#vtBody');
      body.innerHTML =
        '<span class="vt__badge" style="--bg:' + VIBE_BADGES[step % VIBE_BADGES.length] + '" aria-hidden="true">Q' + (step + 1) + '</span>' +
        '<h3 class="vt__q-title" id="vtQTitle" tabindex="-1">' + item.q + '</h3>' +
        '<div class="vt__answers" role="group" aria-labelledby="vtQTitle">' +
          item.answers.map(function (a, i) { return '<button class="vt__answer" type="button" data-i="' + i + '">' + a.text + '</button>'; }).join('') +
        '</div>';
      body.classList.remove('is-fwd', 'is-back');
      void body.offsetWidth; // restart the slide-in animation
      body.classList.add(dir === 'back' ? 'is-back' : 'is-fwd');

      $('#vtCount').textContent = 'Question ' + (step + 1) + ' of ' + VIBE_QUESTIONS.length;
      $$('#vtProgress span').forEach(function (seg, i) { seg.classList.toggle('is-done', i <= step); });
      $('#vtBack').hidden = step === 0;
      locked = false;
      $('#vtQTitle').focus({ preventScroll: true });
    }

    function ranking() {
      var score = {};
      picks.forEach(function (answer, qi) {
        var weight = 1 + (VIBE_QUESTIONS.length - qi) * 0.001; // earlier questions break ties
        Object.keys(answer.points).forEach(function (id) {
          if (findFlavor(id)) { score[id] = (score[id] || 0) + answer.points[id] * weight; }
        });
      });
      return FLAVORS.slice().sort(function (a, b) { return (score[b.id] || 0) - (score[a.id] || 0); });
    }

    function renderResult() {
      var ranked = ranking();
      var top = ranked[0];
      var next = ranked[1];
      result.innerHTML =
        '<div class="vt__res-media" style="--c1:' + top.c1 + ';--c2:' + top.c2 + '"><span class="vt__blob" aria-hidden="true"></span>' + flavorMedia(top, 'vt__res-img') + '</div>' +
        '<div class="vt__res-copy">' +
          '<p class="eyebrow">Your FreezieFeelz is</p>' +
          '<h3 class="vt__res-title" id="vtResTitle" tabindex="-1">The ' + top.mood + '</h3>' +
          '<p class="vt__res-flavor">' + top.name + '</p>' +
          '<p class="vt__res-line">' + (VIBE_LINES[top.id] || top.desc) + '</p>' +
          (next ? '<p class="vt__res-next">Close second: The ' + next.mood + ' (' + next.name + ')</p>' : '') +
          '<div class="vt__actions">' +
            '<button class="btn btn--sun" type="button" data-act="order">Order this</button>' +
            '<button class="btn btn--white" type="button" data-act="build">Build Your Own</button>' +
            '<button class="btn btn--ghost" type="button" data-act="share">Share my Feel</button>' +
            '<button class="vt__link" type="button" data-act="retake">Retake the test</button>' +
          '</div>' +
        '</div>';
      show(result);
      result.dataset.flavor = top.id;
      $('#vtResTitle').focus({ preventScroll: true });
    }

    function shareResult(f) {
      var url = location.href.split('#')[0];
      var text = 'My FreezieFeelz is ' + f.name + ', The ' + f.mood + '! Find yours:';
      if (navigator.share) {
        navigator.share({ title: 'FreezieFeelz vibe test', text: text, url: url }).catch(function () {});
      } else if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text + ' ' + url).then(
          function () { toast('Result copied. Paste it to share!'); },
          function () { toast(text); }
        );
      } else {
        toast(text);
      }
    }

    function start() {
      step = 0;
      picks = [];
      show(quiz);
      renderQuestion('fwd');
      scrollToEl(root);
    }

    $('#vtStart').addEventListener('click', start);

    $('#vtBody').addEventListener('click', function (e) {
      var btn = e.target.closest('.vt__answer');
      if (!btn || locked) { return; }
      locked = true;
      btn.classList.add('is-picked');
      picks[step] = VIBE_QUESTIONS[step].answers[parseInt(btn.getAttribute('data-i'), 10)];
      setTimeout(function () {
        if (step < VIBE_QUESTIONS.length - 1) { step += 1; renderQuestion('fwd'); } else { renderResult(); }
      }, reduceMotion ? 0 : 260);
    });

    $('#vtBack').addEventListener('click', function () {
      if (step === 0) { return; }
      step -= 1;
      picks.length = step;
      renderQuestion('back');
    });

    result.addEventListener('click', function (e) {
      var act = e.target.closest('[data-act]');
      if (!act) { return; }
      var f = findFlavor(result.dataset.flavor);
      var what = act.getAttribute('data-act');
      if (what === 'order') { chooseFlavor(f.id); }
      if (what === 'build') { chooseCustom(); }
      if (what === 'share') { shareResult(f); }
      if (what === 'retake') { start(); }
    });
  }

  /* ======================================================================
     10. SCROLL REVEAL (skipped when the visitor prefers reduced motion)
     ====================================================================== */
  function initReveal() {
    var items = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ======================================================================
     11. INIT
     ====================================================================== */
  initInfo();
  initVideo();
  initNav();
  initMenu();
  initHero();
  initTabs();
  initForms();
  initVibeTest();
  initReveal();
  applyLinks();
  $('#year').textContent = new Date().getFullYear();
})();
