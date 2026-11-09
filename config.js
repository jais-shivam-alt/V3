/**
 * config.js — Single Source of Truth
 * =========================================================================
 * Compiled automatically from 'Wedding_Invitation_Data_Collection.xlsx'
 * Couple: Aarav & Ria | City: Kashi | Dates: 5–8 December 2026
 * =========================================================================
 */
(function (global) {
  'use strict';

  var WEDDING_CONFIG = {
    meta: {
      siteTitle: "Aarav & Ria — Royal Shubh Vivah | Kashi",
      description: "ॐ श्री गणेशाय नमः — You are cordially invited to the Royal Shubh Vivah of Aarav & Ria in Kashi, 5–8 December 2026.",
      canonicalUrl: "https://aarav-ria-vivah.com/",
      timezone: 'Asia/Kolkata',
      weddingDates: "5–8 December 2026",
      weddingDatesHi: "५–८ दिसंबर २०२६"
    },

    couple: {
      groom: { en: "Aarav", hi: "आरव" },
      bride: { en: "Ria", hi: "रिया" },
      monogramInitials: { groom: "A", bride: "R" },
      monogramText: "A&R",
      city: { en: "Kashi", hi: "काशी" },
      cityFull: { en: "Kashi, Uttar Pradesh", hi: "काशी, उत्तर प्रदेश" },
      weddingYear: "2026"
    },

    defaultSide: "groom",

    muhurat: {
      dateTimeISO: "2026-12-07T19:00:00+05:30",
      title: {
        en: 'Countdown to the Shubh Muhurat Pheras',
        hi: 'शुभ मुहूर्त फेरों की उल्टी गिनती'
      },
      completedMessage: {
        en: 'The Shubh Muhurat has arrived — Shubh Vivah!',
        hi: 'शुभ मुहूर्त आ गया है — शुभ विवाह!'
      }
    },

    venue: {
      name: { en: 'Ramada, Kashi', hi: 'रमाडा, काशी' },
      address: { en: 'Ramada, Kashi, Uttar Pradesh', hi: 'रमाडा, काशी, उत्तर प्रदेश' },
      mapQuery: 'Ramada Kashi'
    },

    family: {
      lateGrandfather: { en: "Late Shri Sanjay Ji", hi: "स्वर्गीय श्री संजय जी" },
      grandmother: { en: "Smt. Mira Ji", hi: "श्रीमती मीरा जी" },
      groomFather: { en: "Shri Shiv Ji", hi: "श्री शिव जी" },
      groomMother: { en: "Smt. Parvati Ji", hi: "श्रीमती पार्वती जी" },
      brideFather: { en: "Shri Devendra Ji", hi: "श्री देवेन्द्र जी" },
      brideMother: { en: "Smt. Sunanda Ji", hi: "श्रीमती सुनंदा जी" },

      groomSide: {
        lineageBlessing: {
          en: "With the heavenly blessings of our late grandfather Shri Sanjay Ji and grandmother Smt. Mira Ji, and the loving guidance of our father Shri Shiv Ji and mother Smt. Parvati Ji,",
          hi: "स्वर्गीय पूज्य दादाजी श्री संजय जी एवं पूज्या दादीजी श्रीमती मीरा जी के पुण्य आशीर्वाद से, तथा पूज्य पिताश्री श्री शिव जी एवं पूज्या माताश्री श्रीमती पार्वती जी के स्नेहिल मार्गदर्शन में,"
        },
        invitationText: {
          en: "Shri Shiv Ji & Smt. Parvati Ji request the pleasure of your gracious presence and blessings on the auspicious occasion of the wedding ceremony of their beloved son",
          hi: "श्री शिव जी एवं श्रीमती पार्वती जी अपने सुपुत्र के पावन शुभ विवाह समारोह में आपकी सस्नेह एवं गरिमामयी उपस्थिति की सादर प्रार्थना करते हैं"
        },
        conjunction: { en: "with", hi: "संग" },
        spouseLineage: {
          en: "Daughter of Shri Devendra Ji & Smt. Sunanda Ji",
          hi: "सुपुत्री श्री देवेन्द्र जी एवं श्रीमती सुनंदा जी"
        }
      },

      brideSide: {
        lineageBlessing: {
          en: "With the divine blessings of our elders and the grace of the Almighty, and the loving guidance of our father Shri Devendra Ji and mother Smt. Sunanda Ji,",
          hi: "हमारे पूज्य बड़े-बुजुर्गों के आशीर्वाद एवं ईश्वर की असीम कृपा से, तथा पूज्य पिताश्री श्री देवेन्द्र जी एवं पूज्या माताश्री श्रीमती सुनंदा जी के स्नेहिल मार्गदर्शन में,"
        },
        invitationText: {
          en: "Shri Devendra Ji & Smt. Sunanda Ji request the pleasure of your gracious presence and blessings on the auspicious occasion of the wedding ceremony of their beloved daughter",
          hi: "श्री देवेन्द्र जी एवं श्रीमती सुनंदा जी अपनी सुपुत्री के पावन शुभ विवाह समारोह में आपकी सस्नेह एवं गरिमामयी उपस्थिति की सादर प्रार्थना करते हैं"
        },
        conjunction: { en: "with", hi: "संग" },
        spouseLineage: {
          en: "Son of Shri Shiv Ji & Smt. Parvati Ji · Grandson of late Shri Sanjay Ji & Smt. Mira Ji",
          hi: "सुपुत्र श्री शिव जी एवं श्रीमती पार्वती जी · पौत्र स्वर्गीय श्री संजय जी एवं श्रीमती मीरा जी"
        }
      },

      closingLine: {
        en: "Awaiting your gracious presence.",
        hi: "आपकी गरिमामयी उपस्थिति की सस्नेह प्रतीक्षा में।"
      },
      complimentsLine: {
        en: "With best compliments from both families.",
        hi: "समस्त परिजनों एवं दोनों परिवारों की ओर से सादर।"
      }
    },

    rsvp: [
      {
            "name": {
                  "en": "Mr. Rohan (Groom’s Family)",
                  "hi": "श्री रोहन (वर पक्ष)"
            },
            "phone": "+91 98765 43210"
      },
      {
            "name": {
                  "en": "Ms. Anika (Bride’s Family)",
                  "hi": "सुश्री अनिका (वधू पक्ष)"
            },
            "phone": "+91 91234 56789"
      }
],

    functions: [
      {
            "id": "haldi-mehendi",
            "title": {
                  "en": "Haldi / Mehendi",
                  "hi": "हल्दी / मेहंदी"
            },
            "dayLabel": {
                  "en": "Day 1",
                  "hi": "पहला दिन"
            },
            "dateLabel": {
                  "en": "5 December 2026",
                  "hi": "५ दिसंबर २०२६"
            },
            "dayOfWeek": {
                  "en": "Saturday",
                  "hi": "शनिवार"
            },
            "timeLabel": {
                  "en": "7:00 PM",
                  "hi": "सायं ७:०० बजे"
            },
            "dateISO": "2026-12-05T19:00:00+05:30",
            "venue": {
                  "en": "Ramada, Kashi",
                  "hi": "रमाडा, काशी"
            },
            "note": {
                  "en": "",
                  "hi": ""
            },
            "isMuhurat": false,
            "iconType": "lotus"
      },
      {
            "id": "sangeet-ring",
            "title": {
                  "en": "Sangeet / Ring Ceremony",
                  "hi": "संगीत / रिंग सेरेमनी"
            },
            "dayLabel": {
                  "en": "Day 2",
                  "hi": "दूसरा दिन"
            },
            "dateLabel": {
                  "en": "6 December 2026",
                  "hi": "६ दिसंबर २०२६"
            },
            "dayOfWeek": {
                  "en": "Sunday",
                  "hi": "रविवार"
            },
            "timeLabel": {
                  "en": "7:00 PM",
                  "hi": "सायं ७:०० बजे"
            },
            "dateISO": "2026-12-06T19:00:00+05:30",
            "venue": {
                  "en": "Ramada, Kashi",
                  "hi": "रमाडा, काशी"
            },
            "note": {
                  "en": "",
                  "hi": ""
            },
            "isMuhurat": false,
            "iconType": "music"
      },
      {
            "id": "baraat-pheras",
            "title": {
                  "en": "Baraat Swagat & Pheras (Shubh Muhurat)",
                  "hi": "बारात स्वागत एवं फेरे (शुभ मुहूर्त)"
            },
            "dayLabel": {
                  "en": "Shubh Vivah",
                  "hi": "शुभ विवाह"
            },
            "dateLabel": {
                  "en": "7 December 2026",
                  "hi": "७ दिसंबर २०२६"
            },
            "dayOfWeek": {
                  "en": "Monday",
                  "hi": "सोमवार"
            },
            "timeLabel": {
                  "en": "7:00 PM",
                  "hi": "सायं ७:०० बजे"
            },
            "dateISO": "2026-12-07T19:00:00+05:30",
            "venue": {
                  "en": "Ramada, Kashi",
                  "hi": "रमाडा, काशी"
            },
            "note": {
                  "en": "Followed by Dinner & Ashirwad",
                  "hi": "तत्पश्चात प्रीतिभोज एवं आशीर्वाद"
            },
            "isMuhurat": true,
            "iconType": "mandap"
      },
      {
            "id": "reception",
            "title": {
                  "en": "Reception",
                  "hi": "रिसेप्शन (स्वागत समारोह)"
            },
            "dayLabel": {
                  "en": "Reception",
                  "hi": "स्वागत समारोह"
            },
            "dateLabel": {
                  "en": "8 December 2026",
                  "hi": "८ दिसंबर २०२६"
            },
            "dayOfWeek": {
                  "en": "Tuesday",
                  "hi": "मंगलवार"
            },
            "timeLabel": {
                  "en": "7:00 PM",
                  "hi": "सायं ७:०० बजे"
            },
            "dateISO": "2026-12-08T19:00:00+05:30",
            "venue": {
                  "en": "Ramada, Kashi",
                  "hi": "रमाडा, काशी"
            },
            "note": {
                  "en": "",
                  "hi": ""
            },
            "isMuhurat": false,
            "iconType": "palace"
      }
],

    gallery: [
      {
            "src": "assets/images/gallery/gallery-1.svg",
            "alt": {
                  "en": "The Auspicious Vivah Mandap",
                  "hi": "शुभ विवाह मंडप"
            },
            "caption": {
                  "en": "Sacred Mandap in Kashi",
                  "hi": "काशी में पावन विवाह मंडप"
            }
      },
      {
            "src": "assets/images/gallery/gallery-2.svg",
            "alt": {
                  "en": "Haldi & Mehendi Courtyard",
                  "hi": "हल्दी एवं मेहंदी उत्सव"
            },
            "caption": {
                  "en": "Festive Marigold & Henna Courtyard",
                  "hi": "गेंदा व मेहंदी से सुसज्जित प्रांगण"
            }
      },
      {
            "src": "assets/images/gallery/gallery-3.svg",
            "alt": {
                  "en": "Sangeet & Musical Celebration",
                  "hi": "संगीत एवं रिंग सेरेमनी"
            },
            "caption": {
                  "en": "A Melody of Sitar & Shehnai",
                  "hi": "सितार व शहनाई की मंगल ध्वनि"
            }
      },
      {
            "src": "assets/images/gallery/gallery-4.svg",
            "alt": {
                  "en": "Royal Baraat Swagat",
                  "hi": "शाही बारात स्वागत"
            },
            "caption": {
                  "en": "Grand Arrival of the Baraat",
                  "hi": "शाही बारात का भव्य स्वागत"
            }
      },
      {
            "src": "assets/images/gallery/gallery-5.svg",
            "alt": {
                  "en": "Sacred Pheras & Saptapadi",
                  "hi": "सप्तपदी एवं पवित्र फेरे"
            },
            "caption": {
                  "en": "Seven Sacred Vows Around Agni",
                  "hi": "अग्नि साक्षी सात पवित्र वचन"
            }
      },
      {
            "src": "assets/images/gallery/gallery-6.svg",
            "alt": {
                  "en": "Grand Palace Reception",
                  "hi": "राजसी स्वागत समारोह"
            },
            "caption": {
                  "en": "Twilight Royal Palace Celebration",
                  "hi": "संध्याकालीन राजसी उत्सव"
            }
      }
],

    media: {
      "monogram": "assets/images/monogram.svg",
      "favicon": "assets/images/favicon.svg",
      "ogImage": "assets/images/og-image.png",
      "audioMP3": "assets/audio/bg-music.mp3",
      "audioM4A": "assets/audio/bg-music.m4a",
      "invitationVideo": "assets/video/invitation.mp4",
      "showInvitationFilm": false
}
  };

  global.WEDDING_CONFIG = WEDDING_CONFIG;
})(typeof window !== 'undefined' ? window : this);
