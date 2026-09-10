---
title: "feat(redesign): premium portfolio — hero, design tokens, 3D hero, contact"
labels: []
assignees: []
---

This PR adds a production-ready static site scaffold for a premium personal portfolio for Biplap Kushmi.

Files added:
- index.html
- css/styles.css
- js/main.js
- js/contact.js
- js/three-scene.js
- assets/img placeholders
- sitemap.xml
- robots.txt
- README.md

Key features:
- Mobile-first, accessible single-page layout (HERO, About, Services, Skills, Experience, Projects/Case Studies, Process, Certificates, Tools, Contact, Footer)
- Design tokens and modular styles
- Progressive Three.js hero (lazy-loaded, reduced-motion/low-power fallback)
- Contact form with honeypot and Formspree-ready action
- SEO metadata and JSON-LD Person schema
- Placeholders for profile, projects, and certificates (replaceable)

Checklist:
- [ ] Review copy (hero, about, case studies)
- [ ] Replace placeholder images with real assets
- [ ] Insert Formspree ID or choose other contact provider
- [ ] Accessibility and SEO final pass after assets are added
- [ ] Deploy to GitHub Pages / Netlify / Vercel
