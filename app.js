/**
 * app.js — Core Application Controller
 * =========================================================================
 * Aarav & Ria — Royal Shubh Vivah Digital Invitation
 *
 * Orchestrates:
 * - 3D Palace Gate Opening & Petal Burst
 * - Audio Controller with Ambient Synthesizer Fallback
 * - Letter-by-letter (EN) / Word-by-word (HI) Hero Reveal
 * - Live Timezone-aware 4-unit Countdown (Asia/Kolkata)
 * - Vertical Gold-Thread Timeline with Dynamic Scroll Fill
 * - Calendar Exports (.ics) & Google Maps
 * - Masonry Gallery & Touch-Swipe Lightbox
 * - Sharing (Web Share API + WhatsApp Fallback) & Copy Link Toast
 * - Save as PDF
 * - Language Switching & URL Hash (#bride) Support
 * - 3-Layer Parallax Floral Canvas System with Reduced-Motion Support
 * =========================================================================
 */
(function () {
  'use strict';

  var cfg = window.WEDDING_CONFIG;
  var i18n = window.I18N;

  // Track state
  var state = {
    isGateOpen: false,
    audioPlaying: false,
    audioMuted: false,
    audioContext: null,
    audioSynthGain: null,
    currentSide: 'groom',
    currentLightboxIndex: 0,
    scrollSpeed: 0,
    lastScrollY: 0,
    lastScrollTime: Date.now()
  };

  /* -------------------------------------------------------------------------
     HELPER FUNCTIONS
     ------------------------------------------------------------------------- */
  function getLang() {
    return i18n ? i18n.getLang() : (document.documentElement.getAttribute('data-lang') || 'en');
  }

  function getSide() {
    var hash = window.location.hash.toLowerCase();
    if (hash === '#bride' || state.currentSide === 'bride') {
      return 'bride';
    }
    return 'groom';
  }

  function formatTimeIST(dateISO, lang) {
    var date = new Date(dateISO);
    var locale = lang === 'hi' ? 'hi-IN' : 'en-IN';
    var options = { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: true };
    return date.toLocaleTimeString(locale, options);
  }

  /* -------------------------------------------------------------------------
     DYNAMIC BRANDING & MONOGRAM ADAPTABILITY FOR ANY COUPLE
     ------------------------------------------------------------------------- */
  function renderDynamicMonograms() {
    if (!cfg || !cfg.couple) return;

    var groomName = (cfg.couple.groom && cfg.couple.groom.en) || 'Aarav';
    var brideName = (cfg.couple.bride && cfg.couple.bride.en) || 'Ria';
    var groomInitial = (cfg.couple.monogramInitials && cfg.couple.monogramInitials.groom) || groomName.charAt(0).toUpperCase();
    var brideInitial = (cfg.couple.monogramInitials && cfg.couple.monogramInitials.bride) || brideName.charAt(0).toUpperCase();
    var cityText = (cfg.couple.city && cfg.couple.city.en ? cfg.couple.city.en.toUpperCase() : 'KASHI');
    var yearText = cfg.couple.weddingYear || (cfg.meta && cfg.meta.weddingDates ? (cfg.meta.weddingDates.match(/\d{4}/) || ['2026'])[0] : '2026');
    var subText = cityText + ' · ' + yearText;

    var svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="' + groomInitial + ' &amp; ' + brideInitial + ' Royal Monogram">' +
      '<defs>' +
        '<linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#E5C788"/>' +
          '<stop offset="35%" stop-color="#C29B58"/>' +
          '<stop offset="70%" stop-color="#A57C36"/>' +
          '<stop offset="100%" stop-color="#E5C788"/>' +
        '</linearGradient>' +
        '<linearGradient id="goldGlow" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#FAF5EE"/>' +
          '<stop offset="100%" stop-color="#F1E6D6"/>' +
        '</linearGradient>' +
        '<filter id="royalShadow" x="-10%" y="-10%" width="120%" height="120%">' +
          '<feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#2E241F" flood-opacity="0.18"/>' +
        '</filter>' +
      '</defs>' +
      '<circle cx="120" cy="120" r="112" fill="url(#goldGlow)" stroke="url(#goldGrad)" stroke-width="2.5" filter="url(#royalShadow)"/>' +
      '<circle cx="120" cy="120" r="102" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="2.5 3.5"/>' +
      '<circle cx="120" cy="120" r="95" fill="none" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.85"/>' +
      '<circle cx="120" cy="120" r="82" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.65"/>' +
      '<g transform="translate(120, 36) scale(0.65)" stroke="url(#goldGrad)" fill="none" stroke-width="1.8" stroke-linecap="round">' +
        '<path d="M-30 20 C-30 0, -15 -16, 0 -24 C15 -16, 30 0, 30 20"/>' +
        '<path d="M-18 20 C-18 6, -10 -4, 0 -10 C10 -4, 18 6, 18 20"/>' +
        '<circle cx="0" cy="-28" r="3" fill="url(#goldGrad)"/>' +
        '<circle cx="-12" cy="10" r="1.5" fill="url(#goldGrad)"/>' +
        '<circle cx="12" cy="10" r="1.5" fill="url(#goldGrad)"/>' +
      '</g>' +
      '<g transform="translate(120, 196) scale(0.7)" stroke="url(#goldGrad)" fill="none" stroke-width="1.6" stroke-linecap="round">' +
        '<path d="M0 8 C-12 -2, -24 -4, -32 6 C-24 16, -12 18, 0 20 C12 18, 24 16, 32 6 C24 -4, 12 -2, 0 8 Z" fill="url(#goldGrad)" fill-opacity="0.12"/>' +
        '<path d="M0 8 C-6 0, -14 -12, 0 -20 C14 -12, 6 0, 0 8 Z" fill="url(#goldGrad)" fill-opacity="0.2"/>' +
        '<path d="M0 20 L0 26"/>' +
        '<circle cx="0" cy="28" r="2" fill="url(#goldGrad)"/>' +
      '</g>' +
      '<g fill="url(#goldGrad)" opacity="0.75">' +
        '<polygon points="26,120 31,115 36,120 31,125"/>' +
        '<polygon points="204,120 209,115 214,120 209,125"/>' +
      '</g>' +
      '<g id="letters">' +
        '<text x="96" y="138" text-anchor="middle" font-family="\'Cormorant Garamond\', \'Noto Serif Devanagari\', Georgia, serif" font-size="76" font-weight="600" fill="url(#goldGrad)" letter-spacing="-2">' + groomInitial + '</text>' +
        '<text x="120" y="132" text-anchor="middle" font-family="\'Cormorant Garamond\', Georgia, serif" font-size="34" font-style="italic" font-weight="400" fill="#B85D4B" opacity="0.9">&amp;</text>' +
        '<text x="146" y="138" text-anchor="middle" font-family="\'Cormorant Garamond\', \'Noto Serif Devanagari\', Georgia, serif" font-size="76" font-weight="600" fill="url(#goldGrad)" letter-spacing="-2">' + brideInitial + '</text>' +
      '</g>' +
      '<text x="120" y="162" text-anchor="middle" font-family="\'Jost\', sans-serif" font-size="10" font-weight="500" letter-spacing="4" fill="#C29B58" opacity="0.9">' + subText + '</text>' +
    '</svg>';

    var dataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgContent);

    var gateMono = document.querySelector('.gate__monogram');
    if (gateMono) {
      gateMono.src = dataUri;
      gateMono.alt = groomName + ' & ' + brideName + ' Royal Monogram';
    }

    var archMono = document.querySelector('.arch-frame__monogram');
    if (archMono) {
      archMono.src = dataUri;
      archMono.alt = groomName + ' & ' + brideName + ' Royal Monogram';
    }
  }

  function syncDynamicBranding() {
    if (!cfg) return;

    var lang = getLang();
    var side = getSide();

    // 1. Update Document Title
    if (cfg.meta && cfg.meta.siteTitle) {
      document.title = cfg.meta.siteTitle;
    }

    // 2. Dynamic Couple Brand in Persistent Topbar
    var brandSpan = document.querySelector('.topbar__brand span');
    if (brandSpan) {
      var topbarNames = (side === 'bride')
        ? (cfg.couple.bride[lang] || cfg.couple.bride.en) + (lang === 'hi' ? ' संग ' : ' & ') + (cfg.couple.groom[lang] || cfg.couple.groom.en)
        : (cfg.couple.groom[lang] || cfg.couple.groom.en) + (lang === 'hi' ? ' संग ' : ' & ') + (cfg.couple.bride[lang] || cfg.couple.bride.en);
      brandSpan.textContent = topbarNames;
    }

    // 3. Dynamic Gate Names & Date-City
    var gateNames = document.querySelector('.gate__names');
    if (gateNames) {
      var gateText = (side === 'bride')
        ? (cfg.couple.bride[lang] || cfg.couple.bride.en) + (lang === 'hi' ? ' संग ' : ' & ') + (cfg.couple.groom[lang] || cfg.couple.groom.en)
        : (cfg.couple.groom[lang] || cfg.couple.groom.en) + (lang === 'hi' ? ' संग ' : ' & ') + (cfg.couple.bride[lang] || cfg.couple.bride.en);
      gateNames.textContent = gateText;
    }

    var gateDateCity = document.querySelector('.gate__date-city');
    if (gateDateCity) {
      var dText = lang === 'hi' ? (cfg.meta.weddingDatesHi || cfg.meta.weddingDates) : cfg.meta.weddingDates;
      var cText = cfg.couple.city[lang] || cfg.couple.city.en;
      gateDateCity.innerHTML = '<span>' + dText + '</span> · <span>' + cText + '</span>';
    }

    // 4. Dynamic Hero City & Date
    var heroDate = document.querySelector('.hero__date');
    if (heroDate) {
      heroDate.textContent = lang === 'hi' ? (cfg.meta.weddingDatesHi || cfg.meta.weddingDates) : cfg.meta.weddingDates;
    }
    var heroCity = document.querySelector('.hero__city');
    if (heroCity) {
      heroCity.textContent = cfg.couple.cityFull[lang] || cfg.couple.cityFull.en;
    }

    // 5. Update Monograms dynamically
    renderDynamicMonograms();
  }

  /* -------------------------------------------------------------------------
     AUDIO SYSTEM (Instrumental Audio with Web Audio API Fallback)
     ------------------------------------------------------------------------- */
  var audioEl = document.getElementById('bg-audio');
  var audioBtn = document.getElementById('audio-toggle');
  var userInteracted = false;
  var wasPlayingBeforeHide = false;

  function initAudioSynthesizer() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      state.audioContext = new AudioCtx();

      var masterGain = state.audioContext.createGain();
      masterGain.gain.setValueAtTime(0.001, state.audioContext.currentTime);
      masterGain.connect(state.audioContext.destination);
      state.audioSynthGain = masterGain;

      // Tanpura C# Drone Frequencies (Sa: 138.59Hz, Pa: 207.65Hz, Sa': 277.18Hz)
      var freqs = [138.59, 207.65, 277.18, 415.30];
      freqs.forEach(function (f, idx) {
        var osc = state.audioContext.createOscillator();
        var gain = state.audioContext.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, state.audioContext.currentTime);

        // Subtle detuning and slow vibrato for realistic acoustic shimmer
        var lfo = state.audioContext.createOscillator();
        var lfoGain = state.audioContext.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.08, state.audioContext.currentTime);
        lfoGain.gain.setValueAtTime(1.5, state.audioContext.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.08 / (idx + 1), state.audioContext.currentTime);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
      });
    } catch (e) {
      console.warn('Web Audio not initialized:', e);
    }
  }

  function startAudio() {
    userInteracted = true;
    if (state.audioMuted) return;

    if (audioEl) {
      audioEl.volume = 0.5;
      var playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            state.audioPlaying = true;
            updateAudioUI(true);
          })
          .catch(function () {
            // If HTML5 audio fails, smoothly fade in Web Audio synth
            if (!state.audioContext) initAudioSynthesizer();
            if (state.audioContext && state.audioContext.state === 'suspended') {
              state.audioContext.resume();
            }
            if (state.audioSynthGain) {
              state.audioSynthGain.gain.setTargetAtTime(0.18, state.audioContext.currentTime, 1.2);
              state.audioPlaying = true;
              updateAudioUI(true);
            }
          });
      }
    } else {
      if (!state.audioContext) initAudioSynthesizer();
      if (state.audioSynthGain) {
        state.audioSynthGain.gain.setTargetAtTime(0.18, state.audioContext.currentTime, 1.2);
        state.audioPlaying = true;
        updateAudioUI(true);
      }
    }
  }

  function pauseAudio() {
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
    }
    if (state.audioSynthGain && state.audioContext) {
      state.audioSynthGain.gain.setTargetAtTime(0.001, state.audioContext.currentTime, 0.4);
    }
    state.audioPlaying = false;
    updateAudioUI(false);
  }

  function toggleAudio() {
    if (!userInteracted) {
      startAudio();
      return;
    }
    if (state.audioPlaying) {
      state.audioMuted = true;
      pauseAudio();
    } else {
      state.audioMuted = false;
      startAudio();
    }
  }

  function updateAudioUI(isPlaying) {
    if (!audioBtn) return;
    audioBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    var labelKey = isPlaying ? 'nav.musicPause' : 'nav.musicPlay';
    audioBtn.setAttribute('aria-label', i18n ? i18n.t(labelKey) : (isPlaying ? 'Pause music' : 'Play music'));
    var icon = audioBtn.querySelector('.audio-btn__icon');
    if (icon) {
      icon.innerHTML = isPlaying ? '&#9835;' : '&#10074;&#10074;';
    }
  }

  // Handle tab visibility change (pause on hide, resume on active)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (state.audioPlaying) {
        wasPlayingBeforeHide = true;
        pauseAudio();
      }
    } else {
      if (wasPlayingBeforeHide && !state.audioMuted) {
        wasPlayingBeforeHide = false;
        startAudio();
      }
    }
  });

  /* -------------------------------------------------------------------------
     GATE OPENING ANIMATION & PETAL BURST
     ------------------------------------------------------------------------- */
  function spawnPetalBurst(container, count) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !container) return;

    var symbols = ['#fl-rose', '#fl-marigold-gold', '#fl-rose', '#fl-marigold'];
    for (var i = 0; i < count; i++) {
      (function (idx) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        var symbolId = symbols[idx % symbols.length];
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.innerHTML = '<use href="' + symbolId + '"></use>';
        svg.style.position = 'absolute';
        var size = 12 + Math.random() * 16;
        svg.style.width = size + 'px';
        svg.style.height = size + 'px';
        svg.style.left = (15 + Math.random() * 70) + '%';
        svg.style.top = (30 + Math.random() * 20) + '%';
        svg.style.opacity = '0';
        svg.style.pointerEvents = 'none';

        var driftX = (Math.random() - 0.5) * 320;
        var fallY = 250 + Math.random() * 500;
        var rot = 180 + Math.random() * 540;
        var duration = 2.4 + Math.random() * 1.8;
        var delay = Math.random() * 0.8;

        svg.style.transition = 'transform ' + duration + 's cubic-bezier(0.2, 0.8, 0.4, 1) ' + delay + 's, opacity ' + duration + 's ease ' + delay + 's';
        container.appendChild(svg);

        requestAnimationFrame(function () {
          svg.style.opacity = '0.9';
          svg.style.transform = 'translate(' + driftX + 'px, ' + fallY + 'px) rotate(' + rot + 'deg) scale(' + (0.7 + Math.random() * 0.6) + ')';
        });

        setTimeout(function () {
          svg.remove();
        }, (duration + delay + 0.5) * 1000);
      })(i);
    }
  }

  function initGate() {
    var gate = document.getElementById('gate');
    var openBtn = document.getElementById('open-invitation');
    var petalLayer = gate ? gate.querySelector('.gate__petals') : null;
    var topbar = document.getElementById('topbar');

    if (!gate || !openBtn) return;

    openBtn.addEventListener('click', function () {
      if (state.isGateOpen) return;
      state.isGateOpen = true;

      // 1. Start audio at 50% volume
      startAudio();

      // 2. Add opening class to trigger 3D rotateY and golden glow
      gate.classList.add('gate--opening');

      // 3. Burst flower petals
      spawnPetalBurst(petalLayer, 28);
      var interval = setInterval(function () {
        if (!state.isGateOpen) { clearInterval(interval); return; }
        spawnPetalBurst(petalLayer, 10);
      }, 700);

      // 4. Reveal topbar smoothly
      setTimeout(function () {
        if (topbar) topbar.hidden = false;
      }, 700);

      // 5. Trigger Hero section SVG arch draw and typography animation
      setTimeout(function () {
        triggerHeroAnimations();
      }, 1000);

      // 6. Fade gate overlay out
      setTimeout(function () {
        clearInterval(interval);
        gate.classList.add('gate--hidden');
      }, 2300);
    });
  }

  /* -------------------------------------------------------------------------
     HERO SECTION ANIMATION (Letter by Letter EN / Word by Word HI)
     ------------------------------------------------------------------------- */
  function triggerHeroAnimations() {
    var arch = document.querySelector('.arch-frame');
    if (arch) arch.classList.add('drawn');
    renderHeroNames();
  }

  function renderHeroNames() {
    var host = document.getElementById('hero-names');
    var hindiHost = document.getElementById('hero-names-hindi');
    if (!host || !cfg) return;

    var lang = getLang();
    var side = getSide();

    var first = side === 'bride' ? cfg.couple.bride : cfg.couple.groom;
    var second = side === 'bride' ? cfg.couple.groom : cfg.couple.bride;

    var enFirstName = first.en;
    var enSecondName = second.en;
    var hiFirstName = first.hi;
    var hiSecondName = second.hi;

    // Render English Names letter-by-letter
    host.innerHTML = '';
    host.setAttribute('aria-label', enFirstName + ' & ' + enSecondName);

    var delay = 0;
    var delayStep = 0.055;

    enFirstName.split('').forEach(function (char) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = delay.toFixed(2) + 's';
      host.appendChild(span);
      delay += delayStep;
    });

    var amp = document.createElement('span');
    amp.className = 'amp';
    amp.textContent = ' & ';
    amp.style.animationDelay = delay.toFixed(2) + 's';
    host.appendChild(amp);
    delay += delayStep;

    enSecondName.split('').forEach(function (char) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = delay.toFixed(2) + 's';
      host.appendChild(span);
      delay += delayStep;
    });

    // Render Hindi Names separately (word by word to preserve matras and conjuncts)
    if (hindiHost) {
      var hiAmp = ' संग ';
      hindiHost.textContent = hiFirstName + hiAmp + hiSecondName;
    }
  }

  /* -------------------------------------------------------------------------
     FORMAL INVITATION CARD (Exact Family Lineage & Wording)
     ------------------------------------------------------------------------- */
  function renderInvitationCard() {
    var host = document.getElementById('invitation-card-content');
    if (!host || !cfg) return;

    var lang = getLang();
    var side = getSide();
    var fam = cfg.family;
    var sideData = side === 'bride' ? fam.brideSide : fam.groomSide;

    var childName = side === 'bride' ? (cfg.couple.bride[lang] || cfg.couple.bride.en) : (cfg.couple.groom[lang] || cfg.couple.groom.en);
    var spouseName = side === 'bride' ? (cfg.couple.groom[lang] || cfg.couple.groom.en) : (cfg.couple.bride[lang] || cfg.couple.bride.en);

    var eyebrowText = i18n ? i18n.t('invitation.cardHeading', lang) : 'Royal Vivah Patrika';
    var lineageText = sideData.lineageBlessing[lang] || sideData.lineageBlessing.en;
    var invitationText = sideData.invitationText[lang] || sideData.invitationText.en;
    var conjunction = sideData.conjunction[lang] || sideData.conjunction.en;
    var spouseLineage = sideData.spouseLineage[lang] || sideData.spouseLineage.en;
    var venueText = (cfg.venue.name[lang] || cfg.venue.name.en) + ', ' + (cfg.couple.cityFull[lang] || cfg.couple.cityFull.en);
    var dateText = lang === 'hi' ? cfg.meta.weddingDatesHi : cfg.meta.weddingDates;
    var closingText = fam.closingLine[lang] || fam.closingLine.en;
    var complimentsText = fam.complimentsLine[lang] || fam.complimentsLine.en;

    var perspectiveLabel = side === 'bride' 
      ? (i18n ? i18n.t('invitation.bridePerspective', lang) : 'Bride’s Side')
      : (i18n ? i18n.t('invitation.groomPerspective', lang) : 'Groom’s Side');

    var altPerspective = side === 'bride' ? 'groom' : 'bride';
    var altPerspectiveLabel = altPerspective === 'bride' 
      ? (i18n ? i18n.t('invitation.bridePerspective', lang) : 'Bride’s Side')
      : (i18n ? i18n.t('invitation.groomPerspective', lang) : 'Groom’s Side');

    var html = '';
    html += '<div class="inv-eyebrow">' + eyebrowText + '</div>';
    html += '<p class="inv-lineage">' + lineageText + '</p>';
    html += '<p class="inv-hosts">' + invitationText + '</p>';
    html += '<h3 class="inv-names">' + childName + ' <span class="amp" style="font-family:var(--f-display); font-style:italic;">' + conjunction + '</span> ' + spouseName + '</h3>';
    html += '<p class="inv-spouse-lineage">' + spouseLineage + '</p>';
    html += '<div class="divider" style="margin:1rem auto;"><svg viewBox="0 0 40 16" width="36" height="14"><use href="#ic-diamond"></use></svg></div>';
    html += '<p class="inv-venue-date"><strong>' + dateText + '</strong><br>' + venueText + '</p>';
    html += '<p class="inv-closing">' + closingText + '</p>';
    html += '<p class="inv-compliments">' + complimentsText + '</p>';

    // Interactive Perspective Switcher Pill
    html += '<div style="margin-top:1.8rem;">';
    html += '<button type="button" class="inv-perspective-switch" id="toggle-perspective-btn">';
    html += '<span>&#10043; ' + perspectiveLabel + ' (Tap to view ' + altPerspectiveLabel + ')</span>';
    html += '</button>';
    html += '</div>';

    host.innerHTML = html;

    var toggleBtn = document.getElementById('toggle-perspective-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        state.currentSide = (getSide() === 'bride') ? 'groom' : 'bride';
        if (state.currentSide === 'bride') {
          window.location.hash = 'bride';
        } else {
          history.pushState('', document.title, window.location.pathname + window.location.search);
        }
        renderHeroNames();
        renderInvitationCard();
      });
    }
  }

  /* -------------------------------------------------------------------------
     LIVE TIMEZONE-AWARE COUNTDOWN (Asia/Kolkata)
     ------------------------------------------------------------------------- */
  function initCountdown() {
    if (!cfg) return;
    var targetDate = new Date(cfg.muhurat.dateTimeISO).getTime();

    var dEl = document.getElementById('cd-days');
    var hEl = document.getElementById('cd-hours');
    var mEl = document.getElementById('cd-mins');
    var sEl = document.getElementById('cd-secs');
    var gridEl = document.getElementById('countdown-grid');
    var compEl = document.getElementById('countdown-complete');

    function pad(n) {
      return n < 10 ? '0' + n : '' + n;
    }

    function update() {
      var now = Date.now();
      var diff = targetDate - now;

      if (diff <= 0) {
        if (gridEl) gridEl.hidden = true;
        if (compEl) compEl.hidden = false;
        clearInterval(timer);
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var minutes = Math.floor((diff / (1000 * 60)) % 60);
      var seconds = Math.floor((diff / 1000) % 60);

      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(minutes);
      if (sEl) sEl.textContent = pad(seconds);
    }

    update();
    var timer = setInterval(update, 1000);
  }

  /* -------------------------------------------------------------------------
     WEDDING FUNCTIONS & GOLD THREAD TIMELINE
     ------------------------------------------------------------------------- */
  function toICSFormat(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  function downloadICS(fn, lang) {
    var start = new Date(fn.dateISO);
    // End time 3 hours after start for calendar event
    var end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    var coupleNames = (cfg.couple.groom[lang] || cfg.couple.groom.en) + (lang === 'hi' ? ' संग ' : ' & ') + (cfg.couple.bride[lang] || cfg.couple.bride.en);
    var eventVivah = lang === 'hi' ? 'शुभ विवाह' : 'Shubh Vivah';
    var title = (fn.title[lang] || fn.title.en) + ' — ' + coupleNames + ' ' + eventVivah;
    var location = (fn.venue[lang] || fn.venue.en) + ', ' + (cfg.couple.cityFull[lang] || cfg.couple.cityFull.en);
    var desc = (lang === 'hi' ? 'शुभ विवाह समारोह: ' : 'Shubh Vivah celebration of ') + coupleNames + ', ' + (cfg.couple.city[lang] || cfg.couple.city.en) + '.';
    if (fn.note && (fn.note[lang] || fn.note.en)) {
      desc += ' Note: ' + (fn.note[lang] || fn.note.en);
    }

    var groomSlug = cfg.couple.groom.en.toLowerCase().replace(/[^a-z0-9]/g, '');
    var brideSlug = cfg.couple.bride.en.toLowerCase().replace(/[^a-z0-9]/g, '');

    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//' + cfg.couple.groom.en + ' & ' + cfg.couple.bride.en + '//Shubh Vivah//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + fn.id + '-' + groomSlug + '-' + brideSlug + '@wedding-invitation',
      'DTSTAMP:' + toICSFormat(new Date()),
      'DTSTART:' + toICSFormat(start),
      'DTEND:' + toICSFormat(end),
      'SUMMARY:' + title,
      'DESCRIPTION:' + desc,
      'LOCATION:' + location,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fn.id + '-' + groomSlug + '-' + brideSlug + '.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function renderFunctions() {
    var container = document.getElementById('timeline-items');
    if (!container || !cfg) return;

    var lang = getLang();
    container.innerHTML = '';

    cfg.functions.forEach(function (fn, index) {
      var item = document.createElement('div');
      item.className = 'timeline__item';
      item.setAttribute('data-index', index);

      var dot = document.createElement('span');
      dot.className = 'timeline__dot';
      item.appendChild(dot);

      var card = document.createElement('div');
      card.className = 'fn-card' + (fn.isMuhurat ? ' fn-card--muhurat' : '');

      var title = fn.title[lang] || fn.title.en;
      var day = fn.dayLabel[lang] || fn.dayLabel.en;
      var date = fn.dateLabel[lang] || fn.dateLabel.en;
      var dayOfWeek = fn.dayOfWeek[lang] || fn.dayOfWeek.en;
      var time = fn.timeLabel[lang] || fn.timeLabel.en;
      var venue = fn.venue[lang] || fn.venue.en;
      var note = fn.note ? (fn.note[lang] || fn.note.en) : '';

      var iconSvg = '<svg class="fn-card__icon" viewBox="0 0 100 60"><use href="#ic-lotus"></use></svg>';
      if (fn.iconType === 'music') {
        iconSvg = '<svg class="fn-card__icon" viewBox="0 0 60 90"><use href="#ic-bell"></use></svg>';
      } else if (fn.iconType === 'mandap') {
        iconSvg = '<svg class="fn-card__icon" viewBox="0 0 120 120"><use href="#ic-ganesha"></use></svg>';
      } else if (fn.iconType === 'palace') {
        iconSvg = '<svg class="fn-card__icon" viewBox="0 0 200 200"><use href="#ic-surya"></use></svg>';
      }

      var html = '';
      html += '<div class="fn-card__header">';
      if (day) html += '<span class="fn-card__day">' + day + '</span>';
      html += iconSvg;
      html += '</div>';

      html += '<h3 class="fn-card__title">' + title + '</h3>';
      html += '<div class="fn-card__meta">';
      html += '<div><strong>' + date + ' (' + dayOfWeek + ')</strong> · ' + time + '</div>';
      html += '<div class="fn-card__venue">' + venue + '</div>';
      html += '</div>';

      // Prominently display note (e.g. Followed by Dinner & Ashirwad)
      if (note) {
        html += '<div class="fn-card__note">&#10043; ' + note + '</div>';
      }

      // Actions
      html += '<div class="fn-card__actions">';
      var mapsQuery = encodeURIComponent(cfg.venue.mapQuery + ' ' + (cfg.couple.city[lang] || 'Kashi'));
      html += '<a href="https://www.google.com/maps/search/?api=1&query=' + mapsQuery + '" target="_blank" rel="noopener noreferrer" class="fn-card__btn">';
      html += '<span>&#9906;</span> ' + (i18n ? i18n.t('functions.directions', lang) : 'Get Directions');
      html += '</a>';

      html += '<button type="button" class="fn-card__btn add-cal-btn" data-fn-id="' + fn.id + '">';
      html += '<span>&#128197;</span> ' + (i18n ? i18n.t('functions.ics', lang) : 'Add to Calendar');
      html += '</button>';

      if (cfg.media.showInvitationFilm && fn.isMuhurat) {
        html += '<button type="button" class="fn-card__btn watch-film-btn" style="border-color:var(--c-terracotta); color:var(--c-terracotta);">';
        html += '<span>&#9658;</span> ' + (i18n ? i18n.t('functions.watchFilm', lang) : 'Watch Film');
        html += '</button>';
      }

      html += '</div>';

      card.innerHTML = html;
      item.appendChild(card);
      container.appendChild(item);
    });

    // Wire calendar download clicks
    container.querySelectorAll('.add-cal-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-fn-id');
        var fnObj = cfg.functions.find(function (f) { return f.id === id; });
        if (fnObj) downloadICS(fnObj, getLang());
      });
    });

    // Wire invitation film modal trigger
    var filmBtn = container.querySelector('.watch-film-btn');
    if (filmBtn) {
      filmBtn.addEventListener('click', openVideoModal);
    }
  }

  // Scroll tracker for vertical gold thread fill and active milestones
  function initTimelineScrollTracker() {
    var threadFill = document.getElementById('timeline-fill');
    var timeline = document.getElementById('timeline');
    if (!threadFill || !timeline) return;

    function onScroll() {
      var rect = timeline.getBoundingClientRect();
      var windowH = window.innerHeight;

      if (rect.top <= windowH * 0.75 && rect.bottom >= windowH * 0.25) {
        var totalH = rect.height;
        var scrolled = (windowH * 0.75) - rect.top;
        var pct = Math.max(0, Math.min(100, (scrolled / totalH) * 100));
        threadFill.style.height = pct + '%';

        // Check each milestone dot
        var items = timeline.querySelectorAll('.timeline__item');
        items.forEach(function (item) {
          var itemRect = item.getBoundingClientRect();
          var dot = item.querySelector('.timeline__dot');
          if (dot) {
            if (itemRect.top <= windowH * 0.65) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          }
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------------------------
     GALLERY & TOUCH-SWIPE LIGHTBOX
     ------------------------------------------------------------------------- */
  function renderGallery() {
    var grid = document.getElementById('gallery-grid');
    if (!grid || !cfg) return;

    var lang = getLang();
    grid.innerHTML = '';

    cfg.gallery.forEach(function (item, idx) {
      var card = document.createElement('div');
      card.className = 'gallery-card';
      card.setAttribute('data-index', idx);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', item.alt[lang] || item.alt.en);

      var frame = document.createElement('div');
      frame.className = 'gallery-card__frame';

      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt[lang] || item.alt.en;
      img.loading = 'lazy';
      img.className = 'gallery-card__img';

      frame.appendChild(img);
      card.appendChild(frame);

      var caption = document.createElement('div');
      caption.className = 'gallery-card__caption';
      caption.textContent = item.caption ? (item.caption[lang] || item.caption.en) : (item.alt[lang] || item.alt.en);
      card.appendChild(caption);

      card.addEventListener('click', function () {
        openLightbox(idx);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });

      grid.appendChild(card);
    });
  }

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var touchStartX = 0;
  var touchEndX = 0;

  function openLightbox(idx) {
    if (!lightbox || !cfg || !cfg.gallery[idx]) return;
    state.currentLightboxIndex = idx;
    var lang = getLang();
    var item = cfg.gallery[idx];

    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt[lang] || item.alt.en;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption ? (item.caption[lang] || item.caption.en) : (item.alt[lang] || item.alt.en);
    }

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function nextLightbox() {
    if (!cfg || !cfg.gallery.length) return;
    var nextIdx = (state.currentLightboxIndex + 1) % cfg.gallery.length;
    openLightbox(nextIdx);
  }

  function prevLightbox() {
    if (!cfg || !cfg.gallery.length) return;
    var prevIdx = (state.currentLightboxIndex - 1 + cfg.gallery.length) % cfg.gallery.length;
    openLightbox(prevIdx);
  }

  function initLightboxListeners() {
    if (!lightbox) return;

    var closeBtn = document.getElementById('lightbox-close');
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');
    var backdrop = lightbox.querySelector('.lightbox__backdrop');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevLightbox);
    if (nextBtn) nextBtn.addEventListener('click', nextLightbox);

    // Keyboard controls
    document.addEventListener('keydown', function (e) {
      if (lightbox && !lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
      }
    });

    // Touch swipe gestures on mobile
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff < 0) nextLightbox(); // swipe left -> next
        else prevLightbox();         // swipe right -> prev
      }
    }, { passive: true });
  }

  /* -------------------------------------------------------------------------
     CLOSING SECTION: RSVP, SHARE, COPY LINK & PDF
     ------------------------------------------------------------------------- */
  function renderRSVP() {
    var host = document.getElementById('rsvp-grid');
    if (!host || !cfg) return;

    var lang = getLang();
    host.innerHTML = '';

    cfg.rsvp.forEach(function (c) {
      var card = document.createElement('div');
      card.className = 'rsvp__contact';

      var name = c.name[lang] || c.name.en;
      var cleanPhone = c.phone.replace(/[\s-]/g, '');

      card.innerHTML = 
        '<span class="rsvp__name">' + name + '</span>' +
        '<a href="tel:' + cleanPhone + '" class="rsvp__phone">&#9742; ' + c.phone + '</a>';

      host.appendChild(card);
    });
  }

  function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  }

  function initClosingActions() {
    var shareBtn = document.getElementById('share-btn');
    var copyBtn = document.getElementById('copy-link-btn');
    var pdfBtn = document.getElementById('pdf-btn');

    var getShareUrl = function () {
      return (cfg && cfg.meta && cfg.meta.canonicalUrl) ? cfg.meta.canonicalUrl : window.location.href;
    };

    var getShareTitle = function () {
      var lang = getLang();
      if (cfg && cfg.meta && cfg.meta.siteTitle) return cfg.meta.siteTitle;
      var gr = (cfg.couple.groom[lang] || cfg.couple.groom.en);
      var br = (cfg.couple.bride[lang] || cfg.couple.bride.en);
      return gr + (lang === 'hi' ? ' संग ' : ' & ') + br + ' — ' + (lang === 'hi' ? 'शुभ विवाह' : 'Royal Shubh Vivah');
    };

    var getShareText = function () {
      var lang = getLang();
      if (cfg && cfg.meta && cfg.meta.description) return cfg.meta.description;
      var gr = (cfg.couple.groom[lang] || cfg.couple.groom.en);
      var br = (cfg.couple.bride[lang] || cfg.couple.bride.en);
      var ct = (cfg.couple.city[lang] || cfg.couple.city.en);
      var dt = (lang === 'hi' ? cfg.meta.weddingDatesHi : cfg.meta.weddingDates);
      return 'ॐ श्री गणेशाय नमः — ' + (lang === 'hi' ? 'आप ' : 'You are cordially invited to the Royal Shubh Vivah of ') + gr + (lang === 'hi' ? ' संग ' : ' & ') + br + (lang === 'hi' ? ' के शुभ विवाह में सादर आमंत्रित हैं। (' : ' in ') + ct + ', ' + dt + (lang === 'hi' ? ')' : '.');
    };

    // Native Web Share API with WhatsApp fallback
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var url = getShareUrl();
        var text = getShareText();
        var title = getShareTitle();

        if (navigator.share) {
          navigator.share({ title: title, text: text, url: url }).catch(function () {});
        } else {
          var waUrl = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text + '\n' + url);
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        }
      });
    }

    // Copy Link with fallback and toast
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var url = getShareUrl();
        var lang = getLang();
        var copiedMsg = i18n ? i18n.t('closing.linkCopied', lang) : 'Link Copied to Clipboard!';

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            showToast(copiedMsg);
          }).catch(function () {
            fallbackCopy(url, copiedMsg);
          });
        } else {
          fallbackCopy(url, copiedMsg);
        }
      });
    }

    function fallbackCopy(text, msg) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast(msg);
      } catch (err) {}
      textarea.remove();
    }

    // Save as PDF (triggers print dialog)
    if (pdfBtn) {
      pdfBtn.addEventListener('click', function () {
        window.print();
      });
    }
  }

  /* -------------------------------------------------------------------------
     VIDEO MODAL (Invitation Film)
     ------------------------------------------------------------------------- */
  var videoModal = document.getElementById('video-modal');
  var videoEl = document.getElementById('invitation-video');

  function openVideoModal() {
    if (!videoModal) return;
    videoModal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Pause background audio while film is playing
    if (state.audioPlaying) {
      wasPlayingBeforeHide = true;
      pauseAudio();
    }

    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch(function () {});
    }
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.hidden = true;
    document.body.style.overflow = '';

    if (videoEl) {
      videoEl.pause();
    }

    // Resume background music if it was playing
    if (wasPlayingBeforeHide && !state.audioMuted) {
      wasPlayingBeforeHide = false;
      startAudio();
    }
  }

  function initVideoModal() {
    if (!videoModal) return;
    var closeBtn = document.getElementById('video-close');
    var backdrop = videoModal.querySelector('.video-modal__backdrop');

    if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
    if (backdrop) backdrop.addEventListener('click', closeVideoModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !videoModal.hidden) {
        closeVideoModal();
      }
    });
  }

  /* -------------------------------------------------------------------------
     3-LAYER LIGHTWEIGHT FLORAL PARALLAX SYSTEM
     ------------------------------------------------------------------------- */
  // Section floral mapping as strictly required:
  // - Hero: Red roses & white mogra
  // - Blessings: Yellow & orange genda (marigold)
  // - Invitation: Lotus & rose
  // - Countdown: Pink lotus
  // - Functions: Ashoka leaves & marigold
  // - Gallery: Bougainvillea
  // - Closing: Rose petals & gold sparkles
  var SECTION_FLOWERS = {
    'hero': ['fl-rose', 'fl-mogra'],
    'blessings': ['fl-marigold-gold', 'fl-marigold-orange'],
    'invitation': ['fl-lotus', 'fl-rose'],
    'countdown': ['fl-lotus-pink'],
    'functions': ['fl-ashoka', 'fl-marigold-gold'],
    'gallery': ['fl-bougain'],
    'closing': ['fl-rose', 'fl-glitter']
  };

  var FLOWER_COLORS = {
    'fl-rose': '#B85D4B',
    'fl-mogra': '#FBF8F1',
    'fl-marigold-gold': '#D98E2B',
    'fl-marigold-orange': '#C4641E',
    'fl-lotus': '#D88275',
    'fl-lotus-pink': '#DF7888',
    'fl-ashoka': '#6A874F',
    'fl-bougain': '#C0386C',
    'fl-glitter': '#C29B58'
  };

  function initSectionParallax() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canvases = document.querySelectorAll('.parallax-canvas');

    // Track scroll velocity for wind boost
    window.addEventListener('scroll', function () {
      var now = Date.now();
      var dt = Math.max(1, now - state.lastScrollTime);
      var dy = Math.abs(window.scrollY - state.lastScrollY);
      state.scrollSpeed = dy / dt;
      state.lastScrollY = window.scrollY;
      state.lastScrollTime = now;
    }, { passive: true });

    canvases.forEach(function (canvas) {
      var section = canvas.closest('.section');
      if (!section) return;

      var secKey = canvas.getAttribute('data-section') || section.id;
      var flowerTypes = SECTION_FLOWERS[secKey] || ['fl-rose', 'fl-glitter'];
      var ctx = canvas.getContext('2d');
      var particles = [];
      var isVisible = false;
      var mandalaRot = 0;

      var w = 0, h = 0;
      function resize() {
        w = section.offsetWidth;
        h = section.offsetHeight;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      // Create 3 layers of particles:
      // Layer 0: Background (faint, small, slow)
      // Layer 1: Midground (medium)
      // Layer 2: Foreground (larger, faster drift)
      var totalCount = Math.min(22, Math.max(12, Math.floor(w / 35)));
      for (var i = 0; i < totalCount; i++) {
        var layer = i % 3; // 0, 1, or 2
        var type = flowerTypes[i % flowerTypes.length];
        particles.push({
          type: type,
          layer: layer,
          x: Math.random() * w,
          y: Math.random() * h,
          size: (layer === 0 ? 5 : (layer === 1 ? 9 : 14)) * (0.8 + Math.random() * 0.4),
          speedY: (layer === 0 ? 0.25 : (layer === 1 ? 0.55 : 0.95)) * (0.8 + Math.random() * 0.4),
          speedX: (Math.random() - 0.5) * 0.4,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02
        });
      }

      function drawStaticAccent() {
        ctx.clearRect(0, 0, w, h);
        // Draw elegant stationary subtle accents if reduced motion is requested
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = '#C29B58';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      function loop() {
        if (!isVisible) return;

        ctx.clearRect(0, 0, w, h);

        // Rotating Suryamandala in subtle background
        mandalaRot += 0.0015;
        ctx.save();
        ctx.globalAlpha = 0.045;
        ctx.translate(w / 2, h / 2);
        ctx.rotate(mandalaRot);
        ctx.strokeStyle = '#C29B58';
        ctx.lineWidth = 1;
        var r = Math.min(w, h) * 0.38;
        ctx.beginPath();
        for (var k = 0; k < 12; k++) {
          var a = (k / 12) * Math.PI * 2;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Wind boost from scrolling
        var windBoost = Math.min(2.5, state.scrollSpeed * 0.8);

        particles.forEach(function (p) {
          p.y += p.speedY + windBoost * (0.5 + p.layer * 0.4);
          p.x += p.speedX + (windBoost * 0.3);
          p.rot += p.rotSpeed;

          if (p.y > h + 25) { p.y = -20; p.x = Math.random() * w; }
          if (p.x > w + 25) p.x = -20;
          if (p.x < -25) p.x = w + 25;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = p.layer === 0 ? 0.35 : (p.layer === 1 ? 0.6 : 0.85);

          var col = FLOWER_COLORS[p.type] || '#C29B58';
          ctx.fillStyle = col;
          ctx.strokeStyle = col;

          // Render distinct petal shapes
          if (p.type === 'fl-glitter') {
            // Star particle
            ctx.beginPath();
            var s = p.size;
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.3, -s * 0.3);
            ctx.lineTo(s, 0);
            ctx.lineTo(s * 0.3, s * 0.3);
            ctx.lineTo(0, s);
            ctx.lineTo(-s * 0.3, s * 0.3);
            ctx.lineTo(-s, 0);
            ctx.lineTo(-s * 0.3, -s * 0.3);
            ctx.closePath();
            ctx.fill();
          } else if (p.type === 'fl-ashoka') {
            // Elongated sacred leaf
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.4, p.size * 1.1, p.rot, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'fl-mogra') {
            // Delicate small white bead flower
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#C29B58';
            ctx.stroke();
          } else {
            // Rounded curved flower petal
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 0.8);
            ctx.quadraticCurveTo(p.size * 0.8, 0, 0, p.size * 0.9);
            ctx.quadraticCurveTo(-p.size * 0.8, 0, 0, -p.size * 0.8);
            ctx.fill();
          }

          ctx.restore();
        });

        requestAnimationFrame(loop);
      }

      if (reduced) {
        drawStaticAccent();
        return;
      }

      // Observer to pause animation loop when canvas is off-screen
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (!isVisible) {
                isVisible = true;
                requestAnimationFrame(loop);
              }
            } else {
              isVisible = false;
            }
          });
        }, { threshold: 0.05 });
        observer.observe(section);
      } else {
        isVisible = true;
        requestAnimationFrame(loop);
      }
    });
  }

  /* -------------------------------------------------------------------------
     LANGUAGE SWITCHER & URL HASH INITIALIZATION
     ------------------------------------------------------------------------- */
  function syncLangButtons() {
    var lang = getLang();
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      var isCurrent = btn.getAttribute('data-lang-btn') === lang;
      btn.setAttribute('aria-current', isCurrent ? 'true' : 'false');
    });
  }

  function initLangToggle() {
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetLang = btn.getAttribute('data-lang-btn');
        if (i18n) i18n.setLang(targetLang);
      });
    });

    document.addEventListener('langchange', function () {
      syncLangButtons();
      syncDynamicBranding();
      renderHeroNames();
      renderInvitationCard();
      renderFunctions();
      renderGallery();
      renderRSVP();
    });
  }

  function initSideFromHash() {
    var hash = window.location.hash.toLowerCase();
    state.currentSide = (hash === '#bride') ? 'bride' : 'groom';
  }

  window.addEventListener('hashchange', function () {
    initSideFromHash();
    syncDynamicBranding();
    renderHeroNames();
    renderInvitationCard();
  });

  /* -------------------------------------------------------------------------
     DOM READY BOOTSTRAP
     ------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (i18n) i18n.initLang();
    initSideFromHash();
    syncDynamicBranding();

    initGate();
    if (audioBtn) audioBtn.addEventListener('click', toggleAudio);

    renderHeroNames();
    renderInvitationCard();
    initCountdown();
    renderFunctions();
    initTimelineScrollTracker();
    renderGallery();
    initLightboxListeners();
    renderRSVP();
    initClosingActions();
    initVideoModal();
    initLangToggle();
    syncLangButtons();

    // Init Parallax florals
    initSectionParallax();
  });
})();

