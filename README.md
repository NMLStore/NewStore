# NEW MAA LOKHI STORES — Online Storefront ✨

A complete, production-ready e-commerce storefront for **New Maa Lokhi Stores** —
imitation / oxidised / western jewellery, bangles, home & kitchen appliances
(Milton, Cello, Prestige, Borosil, La Opala, Bajaj, Agaro), watches & clocks,
cosmetics, toys, stationery, school items and gifts — built to reach every
corner of India (metro → remote villages, COD included).

**100% static site · zero backend · zero paid dependencies · free hosting ready.**

---

## What's inside

| Feature | Details |
|---|---|
| 🏠 Home page | Hero, 11 category tiles, 4 featured collections, trending rows, brand marquee, trust/reach section, testimonials, newsletter |
| 🛍️ Shop | Filters (category, brand, price band + custom range, rating), 6 sort modes, search, shareable filter URLs, pagination |
| 📄 Product pages | 4-view gallery with hover zoom, price/discount block, offers, pincode delivery checker, specs, highlights, seeded reviews + review form, related products |
| 🛒 Cart | Slide-out drawer, quantity steppers, free-shipping progress bar, **persists across visits** (localStorage) |
| 💳 Checkout | 3 steps (Address → Delivery → Payment), full validation, coupons (`WELCOME10`, `LOKHI50`, `FREESHIP`), UPI/Card/NetBanking/COD, order confirmation + order history/tracking |
| ❤️ Wishlist | Persistent, one tap |
| 🔒 Security | Strict CSP, no `eval`, no third-party scripts, all user text rendered via `textContent` (XSS-proof by construction), security headers file included |
| 📱 Responsive | Desktop → tablet → mobile (bottom nav, filter bottom-sheet) |
| ♿ A11y | Keyboard navigable, ARIA labels, focus states, reduced-motion support |
| SEO | Meta/OG tags, JSON-LD (Store + Product schema), robots.txt, sitemap.xml |

## Run it locally

Any static server works:

```bash
cd maa-lokhi-stores
python3 -m http.server 8000
# open http://localhost:8000
```

## Test it

```bash
npm install jsdom   # once
node test/smoke.test.js   # 39 checks: routes, filters, cart, checkout, XSS-safety
```

## Edit your store

Everything you need is at the top of **`js/data.js`**:
- `CONFIG` — store name, phone, WhatsApp number, email, address, hours, UPI id
- `PRODUCTS` — add/edit/remove products (name, price, MRP, stock, images…)
- `COUPONS`, `TESTIMONIALS`, `COLLECTIONS` — merchandising

Product photos live in `img/` (`p1.jpg` … `p37.jpg`, `hero.jpg`).

## Deploy (free)

See **DEPLOYMENT.md** for the full step-by-step (Netlify, GitHub Pages,
Cloudflare Pages, free domains, security hardening, going live checklist).
