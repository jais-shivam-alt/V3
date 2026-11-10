/**
 * i18n.js — English & Hindi Translation Dictionary
 * =========================================================================
 * Provides culturally authentic bilingual support.
 * Devanagari conjuncts, matras and honorifics are strictly preserved.
 * =========================================================================
 */
(function (global) {
  'use strict';

  var translations = {
    en: {
      // Top Navigation
      'nav.brand': 'Aarav & Ria',
      'nav.musicPlay': 'Play music',
      'nav.musicPause': 'Pause',
      'nav.musicMute': 'Mute',
      'nav.themeDark': 'Switch to Twilight Mode',
      'nav.themeLight': 'Switch to Day Palace Mode',
      'gate.themeToggle': 'Toggle Twilight Mode',

      // Gate
      'gate.om': 'ॐ श्री गणेशाय नमः',
      'gate.groomName': 'Aarav',
      'gate.brideName': 'Ria',
      'gate.names': 'Aarav & Ria',
      'gate.date': '5–8 December 2026',
      'gate.city': 'Kashi',
      'gate.cta': 'Open Invitation',
      'gate.handleHint': 'Palace Doors',

      // Section 1: Hero
      'hero.eyebrow': 'Shubh Vivah',
      'hero.ampersand': '&',
      'hero.date': '5–8 December 2026',
      'hero.city': 'Kashi, Uttar Pradesh',
      'hero.scrollHint': 'Scroll to explore',

      // Section 2: Blessings
      'blessings.om': 'ॐ श्री गणेशाय नमः',
      'blessings.title': 'Divine Blessings',
      'blessings.shloka': 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः।<br>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      'blessings.shlokaMeaning': 'O Lord of the curved trunk and immense aura, whose brilliance equals ten million suns — shower your divine grace and remove all obstacles from our journey forever.',
      'blessings.eldersTitle': 'Blessings of Elders',
      'blessings.family': 'With the heartfelt blessings of our revered ancestors, beloved elders, and the grace of the Almighty, our families warmly invite you to celebrate this sacred union.',

      // Section 3: Formal Invitation
      'invitation.title': 'Formal Invitation',
      'invitation.cardHeading': 'Royal Vivah Patrika',
      'invitation.groomPerspective': 'Groom’s Side',
      'invitation.bridePerspective': 'Bride’s Side',

      // Section 4: Live Countdown
      'countdown.title': 'Countdown to Shubh Muhurat Pheras',
      'countdown.subtitle': '7 December 2026 · 7:00 PM IST',
      'countdown.days': 'Days',
      'countdown.hours': 'Hours',
      'countdown.mins': 'Minutes',
      'countdown.secs': 'Seconds',
      'countdown.complete': 'The Shubh Muhurat has arrived — Shubh Vivah!',

      // Section 5: Functions
      'functions.title': 'Wedding Functions',
      'functions.subtitle': 'Four days of auspicious celebrations in holy Kashi',
      'functions.directions': 'Get Directions',
      'functions.calendar': 'Add to Calendar',
      'functions.gcal': 'Google Calendar',
      'functions.ics': 'Download .ics',
      'functions.watchFilm': 'Watch the Invitation Film',
      'functions.dinnerNote': 'Followed by Dinner & Ashirwad',

      // Section 6: Gallery
      'gallery.title': 'Moments of Grace',
      'gallery.subtitle': 'Traditional Rajasthani palace artistry & ceremonial visual glimpses',
      'gallery.openHint': 'Tap any frame to view in royal Jharokha lightbox',
      'gallery.close': 'Close Lightbox',
      'gallery.prev': 'Previous Artwork',
      'gallery.next': 'Next Artwork',

      // Section 7: Closing
      'closing.title': 'With Warm Gratitude',
      'closing.message': 'Your presence and heartfelt blessings are the greatest gifts to our families. We eagerly await welcoming you into this joyful celebration of love, culture and heritage.',
      'closing.rsvpTitle': 'R. S. V. P.',
      'closing.rsvpNote': 'Kindly grace the occasion with your presence and blessings.',
      'closing.share': 'Share Invitation',
      'closing.copy': 'Copy Link',
      'closing.linkCopied': 'Link Copied to Clipboard!',
      'closing.savePdf': 'Save as PDF',
      'closing.backToTop': 'Back to Palace Gate',
      'closing.footerHeritage': 'Royal Shubh Vivah · Udaipur & Kashi Heritage Edition'
    },

    hi: {
      // Top Navigation
      'nav.brand': 'आरव एवं रिया',
      'nav.musicPlay': 'संगीत चलाएं',
      'nav.musicPause': 'संगीत रोकें',
      'nav.musicMute': 'मूक करें',
      'nav.themeDark': 'रात्रि दर्शन (डार्क मोड)',
      'nav.themeLight': 'दिवस दर्शन (लाइट मोड)',
      'gate.themeToggle': 'रात्रि दर्शन',

      // Gate
      'gate.om': 'ॐ श्री गणेशाय नमः',
      'gate.groomName': 'आरव',
      'gate.brideName': 'रिया',
      'gate.names': 'आरव संग रिया',
      'gate.date': '५–८ दिसंबर २०२६',
      'gate.city': 'काशी',
      'gate.cta': 'निमंत्रण खोलें',
      'gate.handleHint': 'राजसी कपाट',

      // Section 1: Hero
      'hero.eyebrow': 'शुभ विवाह',
      'hero.ampersand': 'संग',
      'hero.date': '५–८ दिसंबर २०२६',
      'hero.city': 'काशी, उत्तर प्रदेश',
      'hero.scrollHint': 'दर्शन हेतु नीचे स्क्रॉल करें',

      // Section 2: Blessings
      'blessings.om': 'ॐ श्री गणेशाय नमः',
      'blessings.title': 'ईश्वर एवं गुरु कृपा',
      'blessings.shloka': 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः।<br>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      'blessings.shlokaMeaning': 'हे वक्रतुण्ड, विशाल देह वाले, करोड़ों सूर्यों के समान दिव्य तेज से प्रकाशित प्रभु श्री गणेश — आप कृपा कर हमारे समस्त कार्यों को सदा निर्विघ्न संपन्न करें।',
      'blessings.eldersTitle': 'पूज्य पितृजन एवं बड़ों का आशीर्वाद',
      'blessings.family': 'पूज्य पूर्वजों, सम्मानीय बड़े-बुजुर्गों के मंगल आशीर्वाद तथा ईश्वर की असीम अनुकंपा से, हमारे परिवार आपका इस पावन विवाहोत्सव में हृदय से स्वागत करते हैं।',

      // Section 3: Formal Invitation
      'invitation.title': 'सादर आमंत्रण',
      'invitation.cardHeading': 'राजसी विवाह पत्रिका',
      'invitation.groomPerspective': 'वर पक्ष',
      'invitation.bridePerspective': 'वधू पक्ष',

      // Section 4: Live Countdown
      'countdown.title': 'शुभ मुहूर्त फेरों की पावन उल्टी गिनती',
      'countdown.subtitle': '७ दिसंबर २०२६ · सायं ७:०० बजे (भारतीय समयानुसार)',
      'countdown.days': 'दिन',
      'countdown.hours': 'घंटे',
      'countdown.mins': 'मिनट',
      'countdown.secs': 'सेकंड',
      'countdown.complete': 'शुभ मुहूर्त आ गया है — शुभ विवाह!',

      // Section 5: Functions
      'functions.title': 'विवाह उत्सव कार्यक्रम',
      'functions.subtitle': 'पवित्र काशी नगरी में चार दिवसीय पावन मंगल उत्सव',
      'functions.directions': 'दिशा-निर्देश देखें (Google Maps)',
      'functions.calendar': 'कैलेंडर में जोड़ें',
      'functions.gcal': 'गूगल कैलेंडर',
      'functions.ics': '.ics डाउनलोड करें',
      'functions.watchFilm': 'निमंत्रण चलचित्र देखें',
      'functions.dinnerNote': 'तत्पश्चात प्रीतिभोज एवं आशीर्वाद',

      // Section 6: Gallery
      'gallery.title': 'मंगल स्मृतियां',
      'gallery.subtitle': 'पारंपरिक राजस्थानी झरोखा शैली व मांगलिक अनुष्ठान की कलात्मक झलकियां',
      'gallery.openHint': 'झरोखा चित्र को बड़े रूप में देखने हेतु स्पर्श करें',
      'gallery.close': 'बंद करें',
      'gallery.prev': 'पिछला चित्र',
      'gallery.next': 'अगला चित्र',

      // Section 7: Closing
      'closing.title': 'सादर कृतज्ञता एवं आभार',
      'closing.message': 'आपकी आत्मीय उपस्थिति एवं स्नेहिल आशीर्वाद हमारे नवदम्पति एवं दोनों परिवारों के लिए सर्वोपरि उपहार है। हम काशी की पावन धरा पर आपका स्वागत करने हेतु सस्नेह प्रतीक्षारत हैं।',
      'closing.rsvpTitle': 'आर. एस. वी. पी. (स्वागताकांक्षी)',
      'closing.rsvpNote': 'कृपया अपनी गरिमामयी उपस्थिति से समारोह की शोभा बढ़ाएं।',
      'closing.share': 'निमंत्रण साझा करें',
      'closing.copy': 'लिंक कॉपी करें',
      'closing.linkCopied': 'लिंक सफलतापूर्वक कॉपी हो गया!',
      'closing.savePdf': 'PDF के रूप में सहेजें',
      'closing.backToTop': 'शीर्ष पर जाएं',
      'closing.footerHeritage': 'शाही शुभ विवाह · उदयपुर व काशी सांस्कृतिक संस्करण'
    }
  };

  function syncWithConfig() {
    var cfg = (typeof window !== 'undefined' && window.WEDDING_CONFIG) ? window.WEDDING_CONFIG : null;
    if (!cfg) return;

    var c = cfg.couple || {};
    var m = cfg.meta || {};

    var grEn = (c.groom && c.groom.en) || 'Groom';
    var grHi = (c.groom && c.groom.hi) || grEn;
    var brEn = (c.bride && c.bride.en) || 'Bride';
    var brHi = (c.bride && c.bride.hi) || brEn;
    var ctEn = (c.city && c.city.en) || 'Kashi';
    var ctHi = (c.city && c.city.hi) || ctEn;
    var ctfEn = (c.cityFull && c.cityFull.en) || ctEn;
    var ctfHi = (c.cityFull && c.cityFull.hi) || ctHi;
    var dtEn = m.weddingDates || '';
    var dtHi = m.weddingDatesHi || dtEn;

    // Dynamically update English dictionary from config
    translations.en['nav.brand'] = grEn + ' & ' + brEn;
    translations.en['gate.groomName'] = grEn;
    translations.en['gate.brideName'] = brEn;
    translations.en['gate.names'] = grEn + ' & ' + brEn;
    translations.en['gate.date'] = dtEn;
    translations.en['gate.city'] = ctEn;
    translations.en['hero.date'] = dtEn;
    translations.en['hero.city'] = ctfEn;

    // Dynamically update Hindi dictionary from config
    translations.hi['nav.brand'] = grHi + ' एवं ' + brHi;
    translations.hi['gate.groomName'] = grHi;
    translations.hi['gate.brideName'] = brHi;
    translations.hi['gate.names'] = grHi + ' संग ' + brHi;
    translations.hi['gate.date'] = dtHi;
    translations.hi['gate.city'] = ctHi;
    translations.hi['hero.date'] = dtHi;
    translations.hi['hero.city'] = ctfHi;
  }

  var I18N = {
    getLang: function () {
      return document.documentElement.getAttribute('data-lang') || 'en';
    },

    setLang: function (lang) {
      if (lang !== 'en' && lang !== 'hi') { lang = 'en'; }
      document.documentElement.setAttribute('data-lang', lang);
      try {
        localStorage.setItem('shubh_vivah_lang', lang);
      } catch (e) {}
      syncWithConfig();
      this.applyTranslations();
      document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
    },

    t: function (key, lang) {
      syncWithConfig();
      lang = lang || this.getLang();
      var table = translations[lang] || translations.en;
      if (table[key] !== undefined) {
        return table[key];
      }
      return translations.en[key] !== undefined ? translations.en[key] : key;
    },

    applyTranslations: function (root) {
      syncWithConfig();
      root = root || document;
      var lang = this.getLang();
      var nodes = root.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var key = node.getAttribute('data-i18n');
        node.innerHTML = this.t(key, lang);
      }

      // Update aria-labels if data-i18n-aria exists
      var ariaNodes = root.querySelectorAll('[data-i18n-aria]');
      for (var j = 0; j < ariaNodes.length; j++) {
        var aNode = ariaNodes[j];
        var aKey = aNode.getAttribute('data-i18n-aria');
        aNode.setAttribute('aria-label', this.t(aKey, lang));
      }
    },

    initLang: function () {
      syncWithConfig();
      var saved = null;
      try {
        saved = localStorage.getItem('shubh_vivah_lang');
      } catch (e) {}
      var lang = saved || 'en';
      document.documentElement.setAttribute('data-lang', lang);
      this.applyTranslations();
    }
  };

  global.I18N = I18N;
})(typeof window !== 'undefined' ? window : this);

