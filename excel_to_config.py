#!/usr/bin/env python3
"""
excel_to_config.py — Automatic Compiler from Excel Workbook to config.js
=========================================================================
Reads 'Wedding_Invitation_Data_Collection.xlsx' and generates/updates
'config.js' with 100% precision.

Usage:
    python3 excel_to_config.py
    # or with custom file:
    python3 excel_to_config.py path/to/my_data.xlsx
=========================================================================
"""

import sys
import os
import json
import re

try:
    import openpyxl
except ImportError:
    # Check if our virtualenv python exists
    venv_py = '/tmp/excel_venv/bin/python'
    if os.path.exists(venv_py) and sys.executable != venv_py:
        os.execv(venv_py, [venv_py] + sys.argv)
    else:
        print("Error: 'openpyxl' module is required. Install it using: pip install openpyxl")
        sys.exit(1)


def read_excel_data(excel_path):
    wb = openpyxl.load_workbook(excel_path, data_only=True)

    # 1. Couple & Basic Info
    ws_couple = wb['Couple & Basic Info']
    couple_info = {}
    for row in ws_couple.iter_rows(min_row=5, values_only=True):
        if row and row[1]:
            key = str(row[1]).strip()
            en_val = str(row[3] or '').strip()
            hi_val = str(row[4] or en_val).strip()
            couple_info[key] = {'en': en_val, 'hi': hi_val}

    # 2. Family & Hosts
    ws_fam = wb['Family & Hosts']
    fam_info = {}
    for row in ws_fam.iter_rows(min_row=5, values_only=True):
        if row and row[1]:
            key = str(row[1]).strip()
            en_val = str(row[3] or '').strip()
            hi_val = str(row[4] or en_val).strip()
            fam_info[key] = {'en': en_val, 'hi': hi_val}

    # 3. Functions & Timeline
    ws_fn = wb['Functions & Timeline']
    functions = []
    muhurat_iso = '2026-12-07T19:00:00+05:30'
    for row in ws_fn.iter_rows(min_row=5, values_only=True):
        if row and row[1] is not None and row[2]:
            fn_id = str(row[2]).strip()
            title_en = str(row[3] or '').strip()
            title_hi = str(row[4] or title_en).strip()
            day_en = str(row[5] or '').strip()
            day_hi = str(row[6] or day_en).strip()
            date_ymd = str(row[7] or '').strip()
            date_lbl_en = str(row[8] or '').strip()
            date_lbl_hi = str(row[9] or date_lbl_en).strip()
            dow_en = str(row[10] or '').strip()
            dow_hi = str(row[11] or dow_en).strip()
            time_en = str(row[12] or '').strip()
            time_hi = str(row[13] or time_en).strip()
            iso_date = str(row[14] or f"{date_ymd}T19:00:00+05:30").strip()
            venue_en = str(row[15] or 'Ramada, Kashi').strip()
            venue_hi = str(row[16] or venue_en).strip()
            note_en = str(row[17] or '').strip()
            note_hi = 'तत्पश्चात प्रीतिभोज एवं आशीर्वाद' if 'Dinner' in note_en else ''
            is_muhurat = str(row[18] or 'NO').strip().upper() == 'YES'
            icon_type = str(row[19] or 'lotus').strip().lower()

            if is_muhurat:
                muhurat_iso = iso_date

            functions.append({
                'id': fn_id,
                'title': {'en': title_en, 'hi': title_hi},
                'dayLabel': {'en': day_en, 'hi': day_hi},
                'dateLabel': {'en': date_lbl_en, 'hi': date_lbl_hi},
                'dayOfWeek': {'en': dow_en, 'hi': dow_hi},
                'timeLabel': {'en': time_en, 'hi': time_hi},
                'dateISO': iso_date,
                'venue': {'en': venue_en, 'hi': venue_hi},
                'note': {'en': note_en, 'hi': note_hi},
                'isMuhurat': is_muhurat,
                'iconType': icon_type
            })

    # 4. RSVP Contacts
    ws_rsvp = wb['RSVP Contacts']
    rsvp_contacts = []
    for row in ws_rsvp.iter_rows(min_row=5, values_only=True):
        if row and row[1] is not None and row[2]:
            name_en = str(row[2]).strip()
            if name_en.startswith('[Add Contact'):
                continue
            name_hi = str(row[3] or name_en).strip()
            phone = str(row[4] or '').strip()
            rsvp_contacts.append({
                'name': {'en': name_en, 'hi': name_hi},
                'phone': phone
            })

    # 5. Media & Gallery
    ws_media = wb['Gallery & Media']
    media_paths = {
        'monogram': 'assets/images/monogram.svg',
        'favicon': 'assets/images/favicon.svg',
        'ogImage': 'assets/images/og-image.png',
        'audioMP3': 'assets/audio/bg-music.mp3',
        'audioM4A': 'assets/audio/bg-music.m4a',
        'invitationVideo': 'assets/video/invitation.mp4',
        'showInvitationFilm': False
    }
    gallery_items = []
    for row in ws_media.iter_rows(min_row=5, values_only=True):
        if row and row[1] is not None and row[2]:
            asset_type = str(row[2]).strip()
            file_path = str(row[3] or '').strip()
            title_en = str(row[4] or '').strip()
            title_hi = str(row[5] or title_en).strip()
            cap_en = str(row[6] or title_en).strip()
            cap_hi = str(row[7] or title_hi).strip()

            if asset_type.startswith('Gallery'):
                gallery_items.append({
                    'src': file_path,
                    'alt': {'en': title_en, 'hi': title_hi},
                    'caption': {'en': cap_en, 'hi': cap_hi}
                })
            elif 'Monogram' in asset_type:
                media_paths['monogram'] = file_path
            elif 'Favicon' in asset_type:
                media_paths['favicon'] = file_path
            elif 'Social' in asset_type:
                media_paths['ogImage'] = file_path
            elif 'MP3' in asset_type:
                media_paths['audioMP3'] = file_path
            elif 'M4A' in asset_type:
                media_paths['audioM4A'] = file_path
            elif 'Video' in asset_type:
                media_paths['invitationVideo'] = file_path

    return {
        'couple_info': couple_info,
        'fam_info': fam_info,
        'functions': functions,
        'rsvp_contacts': rsvp_contacts,
        'media_paths': media_paths,
        'gallery_items': gallery_items,
        'muhurat_iso': muhurat_iso
    }


def generate_config_js(data, output_path='config.js'):
    c = data['couple_info']
    f = data['fam_info']
    fns = data['functions']
    rsvp = data['rsvp_contacts']
    media = data['media_paths']
    gallery = data['gallery_items']
    muhurat = data['muhurat_iso']

    groom_en = c.get('couple.groom', {}).get('en', 'Aarav')
    groom_hi = c.get('couple.groom', {}).get('hi', 'आरव')
    bride_en = c.get('couple.bride', {}).get('en', 'Ria')
    bride_hi = c.get('couple.bride', {}).get('hi', 'रिया')
    city_en = c.get('couple.city', {}).get('en', 'Kashi')
    city_hi = c.get('couple.city', {}).get('hi', 'काशी')
    city_full_en = c.get('couple.cityFull', {}).get('en', 'Kashi, Uttar Pradesh')
    city_full_hi = c.get('couple.cityFull', {}).get('hi', 'काशी, उत्तर प्रदेश')
    dates_en = c.get('meta.weddingDates', {}).get('en', '5–8 December 2026')
    dates_hi = c.get('meta.weddingDates', {}).get('hi', '५–८ दिसंबर २०२६')
    default_side = c.get('defaultSide', {}).get('en', 'groom')
    site_title = c.get('meta.siteTitle', {}).get('en', f"{groom_en} & {bride_en} — Royal Shubh Vivah | {city_en}")
    canonical_url = c.get('meta.canonicalUrl', {}).get('en', 'https://aarav-ria-vivah.com/')

    groom_init = groom_en[0].upper() if groom_en else 'A'
    bride_init = bride_en[0].upper() if bride_en else 'R'
    year_match = re.search(r'\d{4}', dates_en)
    wedding_year = year_match.group(0) if year_match else '2026'
    monogram_text = f"{groom_init}&{bride_init}"

    js_template = f"""/**
 * config.js — Single Source of Truth
 * =========================================================================
 * Compiled automatically from 'Wedding_Invitation_Data_Collection.xlsx'
 * Couple: {groom_en} & {bride_en} | City: {city_en} | Dates: {dates_en}
 * =========================================================================
 */
(function (global) {{
  'use strict';

  var WEDDING_CONFIG = {{
    meta: {{
      siteTitle: {json.dumps(site_title, ensure_ascii=False)},
      description: {json.dumps(f"ॐ श्री गणेशाय नमः — You are cordially invited to the Royal Shubh Vivah of {groom_en} & {bride_en} in {city_en}, {dates_en}.", ensure_ascii=False)},
      canonicalUrl: {json.dumps(canonical_url, ensure_ascii=False)},
      timezone: 'Asia/Kolkata',
      weddingDates: {json.dumps(dates_en, ensure_ascii=False)},
      weddingDatesHi: {json.dumps(dates_en if dates_hi == dates_en else dates_hi, ensure_ascii=False)}
    }},

    couple: {{
      groom: {{ en: {json.dumps(groom_en, ensure_ascii=False)}, hi: {json.dumps(groom_hi, ensure_ascii=False)} }},
      bride: {{ en: {json.dumps(bride_en, ensure_ascii=False)}, hi: {json.dumps(bride_hi, ensure_ascii=False)} }},
      monogramInitials: {{ groom: {json.dumps(groom_init)}, bride: {json.dumps(bride_init)} }},
      monogramText: {json.dumps(monogram_text)},
      city: {{ en: {json.dumps(city_en, ensure_ascii=False)}, hi: {json.dumps(city_hi, ensure_ascii=False)} }},
      cityFull: {{ en: {json.dumps(city_full_en, ensure_ascii=False)}, hi: {json.dumps(city_full_hi, ensure_ascii=False)} }},
      weddingYear: {json.dumps(wedding_year)}
    }},

    defaultSide: {json.dumps(default_side)},

    muhurat: {{
      dateTimeISO: {json.dumps(muhurat)},
      title: {{
        en: 'Countdown to the Shubh Muhurat Pheras',
        hi: 'शुभ मुहूर्त फेरों की उल्टी गिनती'
      }},
      completedMessage: {{
        en: 'The Shubh Muhurat has arrived — Shubh Vivah!',
        hi: 'शुभ मुहूर्त आ गया है — शुभ विवाह!'
      }}
    }},

    venue: {{
      name: {{ en: 'Ramada, Kashi', hi: 'रमाडा, काशी' }},
      address: {{ en: 'Ramada, Kashi, Uttar Pradesh', hi: 'रमाडा, काशी, उत्तर प्रदेश' }},
      mapQuery: 'Ramada Kashi'
    }},

    family: {{
      lateGrandfather: {{ en: {json.dumps(f.get('family.lateGrandfather', {}).get('en', 'Late Shri Sanjay Ji'), ensure_ascii=False)}, hi: {json.dumps(f.get('family.lateGrandfather', {}).get('hi', 'स्वर्गीय श्री संजय जी'), ensure_ascii=False)} }},
      grandmother: {{ en: {json.dumps(f.get('family.grandmother', {}).get('en', 'Smt. Mira Ji'), ensure_ascii=False)}, hi: {json.dumps(f.get('family.grandmother', {}).get('hi', 'श्रीमती मीरा जी'), ensure_ascii=False)} }},
      groomFather: {{ en: {json.dumps(f.get('family.groomFather', {}).get('en', 'Shri Shiv Ji'), ensure_ascii=False)}, hi: {json.dumps(f.get('family.groomFather', {}).get('hi', 'श्री शिव जी'), ensure_ascii=False)} }},
      groomMother: {{ en: {json.dumps(f.get('family.groomMother', {}).get('en', 'Smt. Parvati Ji'), ensure_ascii=False)}, hi: {json.dumps(f.get('family.groomMother', {}).get('hi', 'श्रीमती पार्वती जी'), ensure_ascii=False)} }},
      brideFather: {{ en: {json.dumps(f.get('family.brideFather', {}).get('en', 'Shri Devendra Ji'), ensure_ascii=False)}, hi: {json.dumps(f.get('family.brideFather', {}).get('hi', 'श्री देवेन्द्र जी'), ensure_ascii=False)} }},
      brideMother: {{ en: {json.dumps(f.get('family.brideMother', {}).get('en', 'Smt. Sunanda Ji'), ensure_ascii=False)}, hi: {json.dumps(f.get('family.brideMother', {}).get('hi', 'श्रीमती सुनंदा जी'), ensure_ascii=False)} }},

      groomSide: {{
        lineageBlessing: {{
          en: {json.dumps(f.get('family.groomSide.lineageBlessing', {}).get('en', ''), ensure_ascii=False)},
          hi: {json.dumps(f.get('family.groomSide.lineageBlessing', {}).get('hi', ''), ensure_ascii=False)}
        }},
        invitationText: {{
          en: {json.dumps(f.get('family.groomSide.invitationText', {}).get('en', ''), ensure_ascii=False)},
          hi: {json.dumps(f.get('family.groomSide.invitationText', {}).get('hi', ''), ensure_ascii=False)}
        }},
        conjunction: {{ en: {json.dumps(f.get('family.groomSide.conjunction', {}).get('en', 'with'), ensure_ascii=False)}, hi: {json.dumps(f.get('family.groomSide.conjunction', {}).get('hi', 'संग'), ensure_ascii=False)} }},
        spouseLineage: {{
          en: {json.dumps(f.get('family.groomSide.spouseLineage', {}).get('en', ''), ensure_ascii=False)},
          hi: {json.dumps(f.get('family.groomSide.spouseLineage', {}).get('hi', ''), ensure_ascii=False)}
        }}
      }},

      brideSide: {{
        lineageBlessing: {{
          en: {json.dumps(f.get('family.brideSide.lineageBlessing', {}).get('en', ''), ensure_ascii=False)},
          hi: {json.dumps(f.get('family.brideSide.lineageBlessing', {}).get('hi', ''), ensure_ascii=False)}
        }},
        invitationText: {{
          en: {json.dumps(f.get('family.brideSide.invitationText', {}).get('en', ''), ensure_ascii=False)},
          hi: {json.dumps(f.get('family.brideSide.invitationText', {}).get('hi', ''), ensure_ascii=False)}
        }},
        conjunction: {{ en: {json.dumps(f.get('family.brideSide.conjunction', {}).get('en', 'with'), ensure_ascii=False)}, hi: {json.dumps(f.get('family.brideSide.conjunction', {}).get('hi', 'संग'), ensure_ascii=False)} }},
        spouseLineage: {{
          en: {json.dumps(f.get('family.brideSide.spouseLineage', {}).get('en', ''), ensure_ascii=False)},
          hi: {json.dumps(f.get('family.brideSide.spouseLineage', {}).get('hi', ''), ensure_ascii=False)}
        }}
      }},

      closingLine: {{
        en: {json.dumps(f.get('family.closingLine', {}).get('en', 'Awaiting your gracious presence.'), ensure_ascii=False)},
        hi: {json.dumps(f.get('family.closingLine', {}).get('hi', 'आपकी गरिमामयी उपस्थिति की सस्नेह प्रतीक्षा में।'), ensure_ascii=False)}
      }},
      complimentsLine: {{
        en: {json.dumps(f.get('family.complimentsLine', {}).get('en', 'With best compliments from both families.'), ensure_ascii=False)},
        hi: {json.dumps(f.get('family.complimentsLine', {}).get('hi', 'समस्त परिजनों एवं दोनों परिवारों की ओर से सादर।'), ensure_ascii=False)}
      }}
    }},

    rsvp: {json.dumps(rsvp, indent=6, ensure_ascii=False)},

    functions: {json.dumps(fns, indent=6, ensure_ascii=False)},

    gallery: {json.dumps(gallery, indent=6, ensure_ascii=False)},

    media: {json.dumps(media, indent=6, ensure_ascii=False)}
  }};

  global.WEDDING_CONFIG = WEDDING_CONFIG;
}})(typeof window !== 'undefined' ? window : this);
"""

    with open(output_path, 'w', encoding='utf-8') as f_out:
        f_out.write(js_template)
    print(f"Successfully generated '{output_path}' from Excel workbook!")

    # Synchronize monogram and favicon SVG assets on disk
    update_monogram_and_favicon(groom_init, bride_init, city_en, wedding_year)


def update_monogram_and_favicon(groom_init, bride_init, city_en, wedding_year):
    mono_path = 'assets/images/monogram.svg'
    fav_path = 'assets/images/favicon.svg'
    sub_text = f"{city_en.upper()} · {wedding_year}"

    # Update monogram.svg
    if os.path.exists(mono_path):
        mono_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="{groom_init} and {bride_init} Royal Monogram">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C788"/>
      <stop offset="35%" stop-color="#C29B58"/>
      <stop offset="70%" stop-color="#A57C36"/>
      <stop offset="100%" stop-color="#E5C788"/>
    </linearGradient>
    <linearGradient id="goldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FAF5EE"/>
      <stop offset="100%" stop-color="#F1E6D6"/>
    </linearGradient>
    <filter id="royalShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#2E241F" flood-opacity="0.18"/>
    </filter>
  </defs>

  <!-- Background Medallion -->
  <circle cx="120" cy="120" r="112" fill="url(#goldGlow)" stroke="url(#goldGrad)" stroke-width="2.5" filter="url(#royalShadow)"/>
  
  <!-- Outer Beaded / Filigree Ring -->
  <circle cx="120" cy="120" r="102" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="2.5 3.5"/>
  <circle cx="120" cy="120" r="95" fill="none" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.85"/>
  
  <!-- Inner Fine Ring -->
  <circle cx="120" cy="120" r="82" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.65"/>

  <!-- Rajasthani Jharokha Arch Crest (Top) -->
  <g transform="translate(120, 36) scale(0.65)" stroke="url(#goldGrad)" fill="none" stroke-width="1.8" stroke-linecap="round">
    <path d="M-30 20 C-30 0, -15 -16, 0 -24 C15 -16, 30 0, 30 20"/>
    <path d="M-18 20 C-18 6, -10 -4, 0 -10 C10 -4, 18 6, 18 20"/>
    <circle cx="0" cy="-28" r="3" fill="url(#goldGrad)"/>
    <circle cx="-12" cy="10" r="1.5" fill="url(#goldGrad)"/>
    <circle cx="12" cy="10" r="1.5" fill="url(#goldGrad)"/>
  </g>

  <!-- Ornamental Lotus Base (Bottom) -->
  <g transform="translate(120, 196) scale(0.7)" stroke="url(#goldGrad)" fill="none" stroke-width="1.6" stroke-linecap="round">
    <path d="M0 8 C-12 -2, -24 -4, -32 6 C-24 16, -12 18, 0 20 C12 18, 24 16, 32 6 C24 -4, 12 -2, 0 8 Z" fill="url(#goldGrad)" fill-opacity="0.12"/>
    <path d="M0 8 C-6 0, -14 -12, 0 -20 C14 -12, 6 0, 0 8 Z" fill="url(#goldGrad)" fill-opacity="0.2"/>
    <path d="M0 20 L0 26"/>
    <circle cx="0" cy="28" r="2" fill="url(#goldGrad)"/>
  </g>

  <!-- Side Flank Diamonds -->
  <g fill="url(#goldGrad)" opacity="0.75">
    <polygon points="26,120 31,115 36,120 31,125"/>
    <polygon points="204,120 209,115 214,120 209,125"/>
  </g>

  <!-- Central Editorial Monogram Text -->
  <g id="letters">
    <text x="96" y="138" text-anchor="middle" font-family="'Cormorant Garamond', 'Noto Serif Devanagari', Georgia, serif" font-size="76" font-weight="600" fill="url(#goldGrad)" letter-spacing="-2">{groom_init}</text>
    <text x="120" y="132" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="34" font-style="italic" font-weight="400" fill="#B85D4B" opacity="0.9">&amp;</text>
    <text x="146" y="138" text-anchor="middle" font-family="'Cormorant Garamond', 'Noto Serif Devanagari', Georgia, serif" font-size="76" font-weight="600" fill="url(#goldGrad)" letter-spacing="-2">{bride_init}</text>
  </g>

  <!-- Subtitle Text under letters -->
  <text x="120" y="162" text-anchor="middle" font-family="'Jost', sans-serif" font-size="10" font-weight="500" letter-spacing="4" fill="#C29B58" opacity="0.9">{sub_text}</text>
</svg>"""
        with open(mono_path, 'w', encoding='utf-8') as f_mono:
            f_mono.write(mono_svg)
        print(f"Updated '{mono_path}' with monogram '{groom_init}&{bride_init}'")

    # Update favicon.svg
    if os.path.exists(fav_path):
        fav_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="favGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E5C788"/>
      <stop offset="50%" stop-color="#C29B58"/>
      <stop offset="100%" stop-color="#996E2E"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="#FAF5EE" stroke="url(#favGold)" stroke-width="2.5"/>
  <circle cx="32" cy="32" r="25" fill="none" stroke="url(#favGold)" stroke-width="1" stroke-dasharray="2 2" opacity="0.7"/>
  <text x="32" y="39" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="22" font-weight="600" fill="#B85D4B">{groom_init}&amp;{bride_init}</text>
</svg>"""
        with open(fav_path, 'w', encoding='utf-8') as f_fav:
            f_fav.write(fav_svg)
        print(f"Updated '{fav_path}' with monogram '{groom_init}&{bride_init}'")


if __name__ == '__main__':
    excel_file = sys.argv[1] if len(sys.argv) > 1 else 'Wedding_Invitation_Data_Collection.xlsx'
    if not os.path.exists(excel_file):
        print(f"Error: File '{excel_file}' not found.")
        sys.exit(1)

    print(f"Reading '{excel_file}'...")
    data = read_excel_data(excel_file)
    generate_config_js(data, 'config.js')

