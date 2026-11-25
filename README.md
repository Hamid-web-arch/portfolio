# Həmid Ağabəyov — Portfolio

Personal portfolio of a frontend developer: projects, experience, education and contact.

**Live:** https://hamid-agabayov.vercel.app

## Features

- Two languages (AZ / EN) and light / dark theme, both remembered between visits
- Cursor spotlight and glowing card edges (disabled on touch screens and with reduced motion)
- Scroll-reveal sections, accessible navigation (skip link, keyboard focus, ARIA on the mobile menu)
- Open Graph preview image for LinkedIn / WhatsApp / Telegram
- Real 404 status on Vercel for unknown URLs

## Stack

React 19 · React Router 7 · Tailwind CSS 4 · Vite 8 · Oxlint · Vercel

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

## Where things live

| What | File |
|---|---|
| All content (projects, experience, translations) | `src/data.js` |
| Colors, fonts and other design tokens | `src/index.css` |
| Pages | `src/pages/Home.jsx`, `src/pages/About.jsx` |
| Header, footer, scroll handling | `src/components/Layout.jsx` |
| Social preview image | `public/og.png` |

To add a project, append an object to `projects` in `src/data.js`. Set `featured: true` to show it as a large card, and leave out `code` if the repository is private.
