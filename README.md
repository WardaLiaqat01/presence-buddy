# ✨ Presence Buddy

> *Your sleepy little screen-keeper — keeps your Microsoft Teams status green while you live your actual life.*

<div align="center">

![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)
![No dependencies](https://img.shields.io/badge/dependencies-zero-blue?style=flat-square)
![Made with](https://img.shields.io/badge/made%20with-vanilla%20JS-yellow?style=flat-square)
![Data collected](https://img.shields.io/badge/data%20collected-none-orange?style=flat-square)

**[Live Demo](#) · [Report a Bug](#) · [Request a Feature](#)**

</div>

---

## 🐱 What is Presence Buddy?

Presence Buddy is a **zero-install, browser-based tool** that prevents your Microsoft Teams status from flipping to Away while you're on a coffee break, in a deep focus session, wrangling the kids, or just staring at the ceiling recovering from your fourth video call of the morning.

It works entirely inside your browser using three native Web APIs — no downloads, no accounts, no tracking, no drama.

```
Open page → set interval → click "Wake Up Buddy" → go live your life
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖥️ **Screen Wake Lock** | Uses the native browser Wake Lock API to prevent your screen from sleeping |
| 🐭 **Mouse Simulation** | Dispatches realistic `mousemove` / `pointermove` events at your chosen interval |
| 🎮 **Live Activity Zone** | Real-time canvas animation confirms Buddy is on duty |
| ⏱️ **Session Tracking** | Uptime clock + ping counter so you always know the score |
| 🎛️ **Custom Intervals** | Fine-tune from 10 seconds to 2 minutes via a live slider |
| 💜 **Zero Setup** | No install, no login, no cookies, no data ever leaves your browser |

---

## 🚀 Quick Start

### Option A — Open directly in a browser

```bash
git clone https://github.com/your-username/presence-buddy.git
cd presence-buddy
open index.html        # macOS
# or just double-click index.html in your file explorer
```

> **Note:** Screen Wake Lock requires HTTPS or `localhost`. Opening via `file://` will work but Wake Lock will silently fail — mouse simulation still runs fine.

### Option B — Serve locally (recommended for full feature support)

```bash
# Using Python (built-in on macOS/Linux)
python3 -m http.server 8080
# then open http://localhost:8080

# Using Node.js (if you have it)
npx serve .
```

### Option C — Deploy to a static host

Presence Buddy is a static site with no build step. Drop the folder onto any host:

- **Netlify** — drag the folder into [netlify.com/drop](https://netlify.com/drop) ✓
- **GitHub Pages** — push to a repo and enable Pages in Settings ✓
- **Vercel** — `vercel --prod` in the project directory ✓
- **Cloudflare Pages** — connect your repo and deploy ✓

---

## 📁 Project Structure

```
presence-buddy/
│
├── index.html              # Single-page website — all sections
│
├── css/
│   ├── style.css           # Variables, reset, nav, hero, app widget
│   ├── sections.css        # How It Works, Features, FAQ, About, Contact, Footer
│   └── animations.css      # All @keyframes + scroll-reveal utilities
│
└── js/
    ├── stars.js            # Animated star field generator
    ├── canvas.js           # Activity zone animation (PBCanvas module)
    ├── buddy.js            # Character state management (PBBuddy module)
    ├── app.js              # Core presence logic (wake lock, ping, timer)
    └── main.js             # Nav, scroll reveal, FAQ accordion, contact form
```

**Stack:** Vanilla HTML · CSS · JavaScript. No frameworks, no bundlers, no node_modules.

---

## 🏗️ Architecture

The JavaScript is split into namespaced modules loaded as plain `<script>` tags — no ES modules or bundlers required.

```
stars.js    →  self-contained IIFE, runs on DOMContentLoaded
canvas.js   →  exposes window.PBCanvas  { start(), stop() }
buddy.js    →  exposes window.PBBuddy   { setAwake(bool) }
app.js      →  core IIFE, consumes PBCanvas + PBBuddy
main.js     →  IIFE, handles nav / scroll / FAQ / contact
```

**Script load order matters** — the HTML loads them in this exact sequence:

```html
<script src="js/stars.js"></script>
<script src="js/canvas.js"></script>
<script src="js/buddy.js"></script>
<script src="js/app.js"></script>
<script src="js/main.js"></script>
```

### CSS Architecture

| File | Responsibility |
|---|---|
| `animations.css` | All `@keyframes` + `.reveal` scroll-reveal classes |
| `style.css` | CSS variables, reset, body, nav, hero section, app widget |
| `sections.css` | Every section below the hero (features, FAQ, about, contact, footer) |

All colours and spacing use CSS custom properties defined in `:root` inside `style.css`.

---

## 🔬 How It Works (Technical)

### 1. Screen Wake Lock
```javascript
wakeLock = await navigator.wakeLock.request('screen');
```
Requests a screen wake lock so the OS doesn't sleep the display. Automatically re-acquired when the tab regains visibility (e.g. after switching back from another window).

### 2. Mouse Event Simulation
```javascript
['mousemove', 'pointermove'].forEach(type =>
  document.dispatchEvent(new MouseEvent(type, {
    clientX: x, clientY: y, bubbles: true,
    movementX: (Math.random() - 0.5) * 12,
    movementY: (Math.random() - 0.5) * 12,
  }))
);
```
Fires synthetic mouse events at randomised coordinates with realistic movement deltas. These are the same events a real mouse produces — indistinguishable from genuine user input at the browser level.

### 3. Canvas Animation
A bouncing star shape with a colour-cycling HSL trail rendered at ~60 fps via `requestAnimationFrame`. Purely visual — serves as a real-time "Buddy is alive" indicator.

### 4. Scroll Reveal
Uses `IntersectionObserver` to add a `.visible` class to `.reveal` elements as they enter the viewport, triggering CSS `opacity` + `transform` transitions.

---

## 🌐 Browser Compatibility

| Browser | Mouse Sim | Wake Lock | Overall |
|---|---|---|---|
| Chrome 84+ | ✅ | ✅ | Full support |
| Edge 84+ | ✅ | ✅ | Full support |
| Firefox 90+ | ✅ | ✅ | Full support |
| Safari 16.4+ | ✅ | ✅ | Full support |
| Mobile Chrome | ✅ | ⚠️ Limited | Works, inconsistent |
| Mobile Safari | ✅ | ⚠️ Limited | Works, inconsistent |

> Wake Lock requires a **secure context** (HTTPS or `localhost`). Opening via `file://` will work but Wake Lock is silently skipped — the pill shows `N/A`.

---

## 🖥️ Teams: Web vs Desktop

**Teams Web** (`teams.microsoft.com`) runs in the browser — Buddy's synthetic events directly influence presence status. This is the most reliable configuration.

**Teams Desktop** is an Electron app that also monitors OS-level idle state independently of the browser. Buddy helps significantly (Wake Lock prevents screen sleep, which is the main away trigger), but for bulletproof coverage on Desktop, consider pairing with:

- **Windows:** [AutoHotkey](https://www.autohotkey.com/) — a tiny script that nudges the mouse at the OS level
- **macOS:** [Caffeine](https://intelliscreenx.com/caffeine/) or `caffeinate` in Terminal

---

## 🎨 Design System

The visual design uses a **cosmic dark purple** aesthetic with glass morphism cards throughout.

### Colour Palette (CSS variables)

```css
--bg:            #0f0520   /* Deep space background */
--purple:        #7c3aed   /* Primary purple */
--purple-light:  #c084fc   /* Accent purple */
--pink:          #ec4899   /* Hot pink */
--pink-light:    #f9a8d4   /* Soft pink */
--cyan:          #67e8f9   /* Cyan highlight */
```

### Fonts

- **[Syne](https://fonts.google.com/specimen/Syne)** — section headings (700, 800)
- **[Nunito](https://fonts.google.com/specimen/Nunito)** — all body text (600, 700, 800, 900)

Both loaded from Google Fonts CDN.

---

## 🧩 Page Sections

| Section | Description |
|---|---|
| **Nav** | Sticky, transparent → frosted glass on scroll. Mobile hamburger menu. Active link tracking. |
| **Hero** | Badge, headline, and the functional Presence Buddy app widget. |
| **Ticker** | Infinite-scrolling use-case marquee strip. |
| **How It Works** | Three numbered steps with a gradient connector line. |
| **Features** | 6-card grid with per-card hover glow colours. |
| **Use Cases** | 8 cheeky scenario cards in a 4×2 grid. |
| **FAQ** | Smooth accordion (one item open at a time). |
| **About** | Origin story with animated stat cards. |
| **Contact** | Form with subject dropdown and a simulated submit → success state. |
| **Footer** | Brand copy, nav columns, MDN API links. |

---

## 🛠️ Customisation

### Change ping interval range

In `index.html`, update the `<input type="range">` attributes:

```html
<input type="range" id="sliderEl" min="10" max="120" step="5" value="30"/>
<!--                               ^^^       ^^^        ^^^      ^^^
                                  min(s)   max(s)   step(s)  default(s) -->
```

### Change the status messages

In `js/app.js`, edit the `sleepMsgs` and `activeMsgs` arrays:

```javascript
const sleepMsgs = [
  '💤 Catching up on some well-deserved sleep...',
  // add your own...
];

const activeMsgs = [
  '🐾 On duty! Your status stays green!',
  // add your own...
];
```

### Adjust scroll reveal speed

In `css/animations.css`, change the transition on `.reveal`:

```css
.reveal {
  transition: opacity 0.65s cubic-bezier(.22,1,.36,1),
              transform 0.65s cubic-bezier(.22,1,.36,1);
  /*                    ↑ duration  ↑ easing */
}
```

### Swap the colour scheme

All colours are CSS variables in `:root` inside `css/style.css`. Change them there and the entire site updates.

---

## 🔒 Privacy

Presence Buddy collects **zero data**. There is no:

- Analytics or tracking script
- Cookie or local storage usage
- Network request (beyond loading the page and fonts)
- Server to send anything to

Everything runs locally in your browser. Closing the tab leaves no trace.

---

## 📄 License

MIT — do whatever you like with it. If you build something cool on top of Buddy, a mention would be appreciated. 💜

```
MIT License

Copyright (c) 2025 Presence Buddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/cool-thing`
3. **Commit** your changes: `git commit -m 'Add cool thing'`
4. **Push** to the branch: `git push origin feature/cool-thing`
5. **Open** a Pull Request

Since there's no build step, testing is as simple as opening `index.html` in a browser. Please test on Chrome and Firefox before submitting.

### Ideas welcome

- [ ] Persistent settings via `localStorage`
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcut to toggle Buddy
- [ ] System notification when Buddy activates/deactivates
- [ ] Browser extension version

---

## 🙏 Acknowledgements

- **Screen Wake Lock API** — [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/WakeLock)
- **MouseEvent API** — [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
- **Canvas API** — [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- **Syne & Nunito** — beautiful fonts from [Google Fonts](https://fonts.google.com)
- Every remote worker who's ever panicked at a yellow dot 💛

---

<div align="center">

Made with ♥ and too much coffee &nbsp;·&nbsp; **Status green. Vibes immaculate. Buddy on duty.** 🐱

</div>
