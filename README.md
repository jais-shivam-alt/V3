# Aarav & Ria — Royal Shubh Vivah Digital Invitation
### *Heritage Rajasthani Palace Experience · Udaipur & Kashi Edition*

A production-ready, mobile-first digital wedding invitation designed and developed for a traditional North Indian / Rajasthani Hindu wedding. Inspired by the architectural majesty of Udaipur palaces, Jodhpur sandstone tones, traditional Rajasthani miniature paintings, cusped Jharokhas, and bespoke luxury Indian wedding stationery.

---

## Table of Contents
1. [Creative Direction & Design System](#creative-direction--design-system)
2. [Source of Truth & Wedding Data](#source-of-truth--wedding-data)
3. [Architecture & File Structure](#architecture--file-structure)
4. [Features & User Experience](#features--user-experience)
5. [Local Setup Instructions](#local-setup-instructions)
6. [Deployment to GitHub Pages](#deployment-to-github-pages)
7. [Deployment to Netlify](#deployment-to-netlify)
8. [Quality Control & Verification Checklist](#quality-control--verification-checklist)

---

## 1. Creative Direction & Design System

The experience is crafted to evoke entering a royal palace in Rajasthan:
- **Jodhpur Sandstone Ivory**: `#FAF5EE` (Handmade paper warmth)
- **Warm Champagne**: `#F1E6D6` (Subtle architectural depth)
- **Terracotta Rose**: `#B85D4B` (Sacred wedding vermilion & rose tones)
- **Antique Brass Gold**: `#C29B58` (Burnished gold leaf foil stamping & borders)
- **Soft Marigold**: `#F7E8D0` (Auspicious Genda festive accents)
- **Espresso Text**: `#2E241F` (High contrast, readable luxury typography)

### Typography
- **English Headings**: `Cormorant Garamond` (Editorial serif)
- **English Body**: `Jost` (Modern humanist sans-serif)
- **Devanagari Headings**: `Noto Serif Devanagari` (Sacred calligraphy)
- **Devanagari Body**: `Hind` (Legible Hindi typography preserving conjuncts, matras, and ligatures)

---

## 2. Source of Truth & Wedding Data

All wedding-specific data is centrally managed in **`config.js`** without hardcoding in HTML/CSS templates:
- **Couple**: Aarav & Ria
- **City**: Kashi (Uttar Pradesh)
- **Timezone**: `Asia/Kolkata` (IST)
- **Wedding Dates**: 5–8 December 2026
- **Venue**: Ramada, Kashi

### Functions
1. **Haldi / Mehendi** — Day 1 · 5 December 2026 · 7:00 PM · Ramada, Kashi
2. **Sangeet / Ring Ceremony** — Day 2 · 6 December 2026 · 7:00 PM · Ramada, Kashi
3. **Baraat Swagat & Pheras (Shubh Muhurat)** — 7 December 2026 · 7:00 PM · Ramada, Kashi
   - *Note*: Followed by Dinner & Ashirwad
4. **Reception** — 8 December 2026 · 7:00 PM · Ramada, Kashi

### Family Lineage & Preserved Wording
- Late grandfather **Sanjay** reference (`Late Shri Sanjay Ji` / `स्वर्गीय श्री संजय जी`)
- Grandmother **Mira** reference (`Smt. Mira Ji` / `श्रीमती मीरा जी`)
- Father **Shiv** and mother **Parvati**'s blessings and hosting
- Traditional opening and family introduction
- *"Awaiting your gracious presence."*
- *"With best compliments from both families."*
- RSVP coordinators with direct one-tap calling (`tel:`)

---

## 3. Architecture & File Structure

```
/V3
  ├── Wedding_Invitation_Data_Collection.xlsx  # Master Excel Workbook for client data collection
  ├── excel_to_config.py                       # Automatic compiler from Excel workbook to config.js & SVG assets
  ├── config_to_excel.py                       # Bi-directional sync: exports config.js data back to Excel
  ├── validate_project.py                      # Automated 37-point QA verification test suite
  ├── aarav-ria-shubh-vivah.zip                # Production-ready deployment bundle
  ├── data_templates/                          # CSV exports of all sheets for Google Sheets / Excel
  │   ├── Couple_and_Basic_Info.csv
  │   ├── Family_and_Hosts.csv
  │   ├── Functions_and_Timeline.csv
  │   ├── RSVP_Contacts.csv
  │   └── Gallery_and_Media.csv
  ├── index.html                               # Semantic HTML5, accessible structure, preloaded fonts
  ├── styles.css                               # Mobile-first CSS, 3D palace door transforms, print layout
  ├── config.js                                # Central Source of Truth for all wedding details & media paths
  ├── i18n.js                                  # English / Hindi translation dictionary & reactive engine
  ├── app.js                                   # Vanilla JS controller (gate, audio, countdown, timeline, lightbox, etc.)
  ├── README.md                                # Comprehensive documentation and deployment guides
  └── assets/
      ├── audio/
      │   ├── bg-music.mp3       # Classical Indian instrumental background music
      │   └── bg-music.m4a       # Apple AAC high-fidelity audio stream
      ├── images/
      │   ├── monogram.svg       # Royal Jharokha monogram with gold foil filigree
      │   ├── favicon.svg        # Crisp antique-gold browser tab icon
      │   ├── og-image.png       # WhatsApp / Open Graph social preview banner (no human faces)
      │   └── gallery/           # 6 Royal Rajasthani Jharokha ritual artworks (strictly no human faces)
      │       ├── gallery-1.svg  # Auspicious Vivah Mandap
      │       ├── gallery-2.svg  # Haldi & Mehendi Courtyard
      │       ├── gallery-3.svg  # Sangeet Sitar Celebration
      │       ├── gallery-4.svg  # Royal Baraat Swagat
      │       ├── gallery-5.svg  # Sacred Pheras & Saptapadi
      │       └── gallery-6.svg  # Grand Palace Reception
      └── video/
          └── README.md          # Guide for optional invitation film integration
```

---

## 4. Features & User Experience

### 1. Opening Experience — Royal Palace Gate
- Two full-height carved rosewood and sandstone palace doors with brass geometric jali latticework and antique brass peacock ring knockers.
- Central round ivory wax seal displaying the couple's monogram.
- Auspicious invocation `ॐ श्री गणेशाय नमः`, couple names, dates and city.
- Pulsing glowing **Open Invitation** button.
- Tap triggers sequential animation:
  1. Seal fades gracefully.
  2. Doors unlock from center and swing outward with 3D `rotateY` transforms.
  3. Golden radial light and red rose / marigold petals burst outward.
  4. Smooth transition into hero section.

### 2. Background Music & Ambient Synthesizer Fallback
- Plays **only** upon user interaction (respecting modern browser autoplay restrictions).
- Initial volume is set to 50% and loops continuously.
- Persistent topbar controller with play/pause/mute state.
- Automatically pauses when the browser tab is hidden or minimized (`visibilitychange`).
- Automatically pauses if the invitation film modal is opened.
- Built-in **Web Audio API Tanpura Synthesizer**: If an audio file is blocked or unsupported, a meditative C# tanpura drone chord plays seamlessly so the guest never experiences silence.

### 3. Seven Complete Sections
- **Section 1: Hero**: Large gold Jharokha arch that draws its outline via SVG animation, letter-by-letter English names, separate authentic Devanagari Hindi typography, date and Kashi venue.
- **Section 2: Blessings**: Ornate Ganesha line art, sacred Shloka (`वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः।`), translation, and elders' blessings.
- **Section 3: Formal Invitation**: Traditional stationery card with deckle ivory paper texture, double gold border, and lotus corner filigree.
- **Section 4: Live Countdown**: 4-unit timer (Days, Hours, Minutes, Seconds) targeting `7 December 2026, 7:00 PM IST` (`Asia/Kolkata`). Shows graceful completed banner post-target.
- **Section 5: Functions Timeline**: Vertical gold thread that progressively illuminates as visitors scroll down. Includes Google Maps directions and `.ics` iCalendar download with accurate timestamps. Prominently highlights *"Followed by Dinner & Ashirwad"*.
- **Section 6: Gallery**: Responsive masonry layout framed in Rajasthani Jharokha arches. Lightbox modal with touch-swipe gestures, next/prev, and keyboard controls.
- **Section 7: Closing**: Warm gratitude message, RSVP contact cards, native Web Share API with WhatsApp fallback, clipboard Copy Link with toast notification, and print-optimized PDF generation.

### 4. 3-Layer Floral Parallax
Each section features its distinct floral identity:
- **Hero**: Red roses and white mogra
- **Blessings**: Yellow and orange genda (marigold)
- **Invitation**: Lotus and rose
- **Countdown**: Pink lotus
- **Functions**: Ashoka leaves and marigold
- **Gallery**: Bougainvillea
- **Closing**: Rose petals and gold particles
Optimized with `IntersectionObserver` to run only when in view and strictly respects `prefers-reduced-motion`.

### 5. URL Hash `#bride`
Append `#bride` to the URL (or tap the perspective chip) to instantly swap into the bride-side perspective:
- Bride-first name order (*Ria & Aarav* / *रिया संग आरव*)
- Bride-side host wording and lineage
- All event details and venue remain consistent

### 6. Turnkey Reusability for Any Couple
This invitation is engineered to serve as a reusable luxury template for **any** wedding couple:
1. **Faceless Imagery**: All 6 gallery artworks (`gallery-1` to `gallery-6`) and `og-image.png` feature ceremonial architecture, ritual sacred fire, royal palace gates, and musical instruments with **strictly no human faces** of bride or groom. Any couple can use them without portrait clash.
2. **Excel Data Collection**: Open `Wedding_Invitation_Data_Collection.xlsx`, fill in the new couple's names, dates, city, family lineage, and functions.
3. **One-Command Build**:
   ```bash
   python3 excel_to_config.py
   ```
   This automatically compiles `config.js` and generates personalized `monogram.svg` and `favicon.svg` matching the new couple's initials and year.
4. **Dynamic Frontend Binding**: `app.js` and `i18n.js` automatically adapt browser title, topbar brand, palace gate names, dates, calendar `.ics` files, and share messages dynamically.
5. **Reverse Sync**:
   ```bash
   python3 config_to_excel.py
   ```
   Exports any direct code modifications in `config.js` back into the Excel spreadsheet.

---

## 5. Local Setup Instructions

No build tools (Node, Webpack, Vite) are required. Pure static HTML/CSS/JS.

### Option A: Python Built-in Server (Recommended)
Open your terminal in this directory (`V3`):
```bash
python3 -m http.server 8000
```
Open your browser and navigate to:
```
http://localhost:8000
```

### Option B: Node.js `npx serve`
```bash
npx serve .
```

### Option C: VS Code Live Server
1. Open the folder in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

---

## 6. Deployment to GitHub Pages

1. Initialize a git repository and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Aarav & Ria Royal Shubh Vivah invitation"
   ```
2. Create a new repository on GitHub (e.g. `aarav-ria-wedding-invitation`).
3. Link the remote and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/aarav-ria-wedding-invitation.git
   git push -u origin main
   ```
4. Go to **Settings** > **Pages** in your GitHub repository.
5. Under **Branch**, select `main` and root folder `/`, then click **Save**.
6. Your royal invitation will be live at `https://<your-username>.github.io/aarav-ria-wedding-invitation/`.

---

## 7. Deployment to Netlify

### Method 1: Netlify Drop (Instant Drag-and-Drop)
1. Log in to [Netlify](https://app.netlify.com/).
2. Navigate to **Sites** and drag the entire project folder (`V3`) into the upload drop area.
3. Your site is deployed instantly with a live HTTPS URL.

### Method 2: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

---

## 8. Quality Control & Verification Checklist

- [x] **Palace Doors Animation**: Doors swing outward in 3D perspective with realistic shadows and golden illumination.
- [x] **Audio Playback**: Starts exclusively upon user interaction; volume initializes at 50%; loops smoothly.
- [x] **Audio Controls**: Persistent music button in header allows immediate pause/play/mute.
- [x] **Visibility Change**: Audio pauses when the user switches tabs and resumes on return.
- [x] **Countdown Accuracy**: Evaluates strictly against `2026-12-07T19:00:00+05:30` (Asia/Kolkata).
- [x] **Chronological Functions**: Haldi/Mehendi (5 Dec) -> Sangeet (6 Dec) -> Pheras (7 Dec) -> Reception (8 Dec).
- [x] **Pheras Prominent Note**: Displays *"Followed by Dinner & Ashirwad"* prominently.
- [x] **Google Maps Integration**: Direct navigation links to Ramada, Kashi.
- [x] **Calendar Export**: Downloadable `.ics` files generated with accurate Asia/Kolkata timestamps.
- [x] **Bilingual Support**: Instant toggle between English and authentic Devanagari Hindi.
- [x] **Bride Mode (`#bride`)**: Adapts hosts and name order without reloading or fabricating data.
- [x] **Masonry Lightbox**: Fullscreen display with touch-swipe gesture support on mobile devices.
- [x] **Native Sharing & WhatsApp**: Mobile Web Share API with instant WhatsApp share fallback.
- [x] **PDF Print Formatting**: `@media print` generates a high-resolution, keepsake physical card.
- [x] **Mobile Responsiveness**: Thoroughly tested across 320px, 375px, 390px, 430px, 768px, 1024px, and 1440px displays.

