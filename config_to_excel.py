#!/usr/bin/env python3
"""
config_to_excel.py — Bi-directional Sync: Export config.js back to Excel
=========================================================================
Reads 'config.js' and updates 'Wedding_Invitation_Data_Collection.xlsx'
so changes made directly in the JavaScript config are mirrored back to Excel.

Usage:
    python3 config_to_excel.py
=========================================================================
"""

import sys
import os
import re
import json

try:
    import openpyxl
except ImportError:
    venv_py = '/tmp/excel_venv/bin/python'
    if os.path.exists(venv_py) and sys.executable != venv_py:
        os.execv(venv_py, [venv_py] + sys.argv)
    else:
        print("Error: 'openpyxl' module is required. Install it using: pip install openpyxl")
        sys.exit(1)


def parse_js_object(js_path='config.js'):
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON-like block
    match = re.search(r'var WEDDING_CONFIG\s*=\s*(\{[\s\S]*?\n\s*\});', content)
    if not match:
        raise ValueError("Could not find WEDDING_CONFIG in config.js")

    js_str = match.group(1)
    # Use node to reliably parse the JS object into JSON
    import subprocess
    cmd = ['node', '-e', f'console.log(JSON.stringify({js_str}))']
    proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return json.loads(proc.stdout)


def update_excel_from_config(config, excel_path='Wedding_Invitation_Data_Collection.xlsx'):
    if not os.path.exists(excel_path):
        print(f"Error: '{excel_path}' does not exist.")
        sys.exit(1)

    wb = openpyxl.load_workbook(excel_path)

    # 1. Update Couple & Basic Info
    if 'Couple & Basic Info' in wb.sheetnames:
        ws = wb['Couple & Basic Info']
        couple = config.get('couple', {})
        meta = config.get('meta', {})
        mapping = {
            'couple.groom': couple.get('groom', {}),
            'couple.bride': couple.get('bride', {}),
            'couple.city': couple.get('city', {}),
            'couple.cityFull': couple.get('cityFull', {}),
            'meta.weddingDates': {'en': meta.get('weddingDates', ''), 'hi': meta.get('weddingDatesHi', '')},
            'meta.timezone': {'en': meta.get('timezone', 'Asia/Kolkata'), 'hi': meta.get('timezone', 'Asia/Kolkata')},
            'defaultSide': {'en': config.get('defaultSide', 'groom'), 'hi': config.get('defaultSide', 'groom')},
            'meta.siteTitle': {'en': meta.get('siteTitle', ''), 'hi': meta.get('siteTitle', '')},
            'meta.canonicalUrl': {'en': meta.get('canonicalUrl', ''), 'hi': meta.get('canonicalUrl', '')}
        }
        for row in ws.iter_rows(min_row=5):
            key = str(row[1].value or '').strip()
            if key in mapping:
                vals = mapping[key]
                row[3].value = vals.get('en', '')
                row[4].value = vals.get('hi', '')

    # 2. Update Family & Hosts
    if 'Family & Hosts' in wb.sheetnames:
        ws = wb['Family & Hosts']
        fam = config.get('family', {})
        groom_side = fam.get('groomSide', {})
        bride_side = fam.get('brideSide', {})
        mapping = {
            'family.lateGrandfather': fam.get('lateGrandfather', {}),
            'family.grandmother': fam.get('grandmother', {}),
            'family.groomFather': fam.get('groomFather', {}),
            'family.groomMother': fam.get('groomMother', {}),
            'family.brideFather': fam.get('brideFather', {}),
            'family.brideMother': fam.get('brideMother', {}),
            'family.groomSide.lineageBlessing': groom_side.get('lineageBlessing', {}),
            'family.groomSide.invitationText': groom_side.get('invitationText', {}),
            'family.groomSide.conjunction': groom_side.get('conjunction', {}),
            'family.groomSide.spouseLineage': groom_side.get('spouseLineage', {}),
            'family.brideSide.lineageBlessing': bride_side.get('lineageBlessing', {}),
            'family.brideSide.invitationText': bride_side.get('invitationText', {}),
            'family.brideSide.spouseLineage': bride_side.get('spouseLineage', {}),
            'family.closingLine': fam.get('closingLine', {}),
            'family.complimentsLine': fam.get('complimentsLine', {})
        }
        for row in ws.iter_rows(min_row=5):
            key = str(row[1].value or '').strip()
            if key in mapping:
                vals = mapping[key]
                row[3].value = vals.get('en', '')
                row[4].value = vals.get('hi', '')

    # 3. Update Functions & Timeline
    if 'Functions & Timeline' in wb.sheetnames:
        ws = wb['Functions & Timeline']
        fns = config.get('functions', [])
        for idx, fn in enumerate(fns):
            row_idx = 5 + idx
            ws.cell(row=row_idx, column=2, value=idx + 1)
            ws.cell(row=row_idx, column=3, value=fn.get('id', ''))
            ws.cell(row=row_idx, column=4, value=fn.get('title', {}).get('en', ''))
            ws.cell(row=row_idx, column=5, value=fn.get('title', {}).get('hi', ''))
            ws.cell(row=row_idx, column=6, value=fn.get('dayLabel', {}).get('en', ''))
            ws.cell(row=row_idx, column=7, value=fn.get('dayLabel', {}).get('hi', ''))
            date_iso = fn.get('dateISO', '')
            ymd = date_iso.split('T')[0] if 'T' in date_iso else ''
            ws.cell(row=row_idx, column=8, value=ymd)
            ws.cell(row=row_idx, column=9, value=fn.get('dateLabel', {}).get('en', ''))
            ws.cell(row=row_idx, column=10, value=fn.get('dateLabel', {}).get('hi', ''))
            ws.cell(row=row_idx, column=11, value=fn.get('dayOfWeek', {}).get('en', ''))
            ws.cell(row=row_idx, column=12, value=fn.get('dayOfWeek', {}).get('hi', ''))
            ws.cell(row=row_idx, column=13, value=fn.get('timeLabel', {}).get('en', ''))
            ws.cell(row=row_idx, column=14, value=fn.get('timeLabel', {}).get('hi', ''))
            ws.cell(row=row_idx, column=15, value=date_iso)
            ws.cell(row=row_idx, column=16, value=fn.get('venue', {}).get('en', ''))
            ws.cell(row=row_idx, column=17, value=fn.get('venue', {}).get('hi', ''))
            ws.cell(row=row_idx, column=18, value=fn.get('note', {}).get('en', ''))
            ws.cell(row=row_idx, column=19, value='YES' if fn.get('isMuhurat') else 'NO')
            ws.cell(row=row_idx, column=20, value=fn.get('iconType', 'lotus'))

    # 4. Update RSVP Contacts
    if 'RSVP Contacts' in wb.sheetnames:
        ws = wb['RSVP Contacts']
        rsvp = config.get('rsvp', [])
        for idx, c in enumerate(rsvp):
            row_idx = 5 + idx
            ws.cell(row=row_idx, column=2, value=idx + 1)
            ws.cell(row=row_idx, column=3, value=c.get('name', {}).get('en', ''))
            ws.cell(row=row_idx, column=4, value=c.get('name', {}).get('hi', ''))
            ws.cell(row=row_idx, column=5, value=c.get('phone', ''))

    wb.save(excel_path)
    print(f"Successfully synced config.js data back into '{excel_path}'!")


if __name__ == '__main__':
    print("Reading config.js...")
    cfg_data = parse_js_object('config.js')
    update_excel_from_config(cfg_data, 'Wedding_Invitation_Data_Collection.xlsx')

