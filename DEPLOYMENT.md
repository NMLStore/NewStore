# 🚀 FULL DEPLOYMENT GUIDE — New Maa Lokhi Stores
### From zero to a live, free, secure online store — step by step

Your store is a **static website** (HTML + CSS + JS, no server, no database).
That is deliberate: static sites are the cheapest (free), fastest and most
hack-proof architecture that exists — there is no server to break into and
no customer database to steal. The trade-off: checkout is **demo mode**
(orders are saved in the customer's browser + WhatsApp). Real online payment
integration is covered in Step 7.

---

## STEP 0 — What you need (10 minutes)

1. A computer or phone with internet.
2. An email address (Gmail is fine).
3. (Optional, free) A WhatsApp number for orders — you already have one.
4. That's it. No credit card. No coding knowledge needed for deployment.

---

## STEP 1 — Personalise the store (important!)

Open **`js/data.js`** in any text editor (Notepad works) and edit the `CONFIG`
block at the very top:

```js
const CONFIG = {
  storeName: 'New Maa Lokhi Stores',
  phone: '+91 90000 00000',        // ← YOUR phone number
  whatsapp: '',                    // ← e.g. '919437012345' (91 + number, no +)
  email: 'care@maalokhistores.example',  // ← YOUR email
  address: 'Main Market Road, Near Bus Stand, Your Town, State – 751001',
  upiId: 'maalokhistores@upi',     // ← your UPI id (shown at checkout)
  ...
};
```

- Setting `whatsapp` instantly shows a **green WhatsApp order button** on the
  site, and after checkout the customer can send you their order in one tap.
- Also update the footer address/contact (it reads from the same CONFIG —
  done automatically) and check `CONFIG.hours`.

Product prices/stock: edit the `PRODUCTS` list in the same file — each product
is one block with `name`, `price`, `mrp`, `stock`, `img`, etc.

## STEP 2 — Deploy FREE (choose one; Option A is easiest)

### Option A — Netlify (recommended: 2 minutes, free domain + free SSL)

1. Go to **https://app.netlify.com/signup** → sign up with your email/GitHub.
2. On the dashboard, click **"Add new site" → "Deploy manually"**.
3. **Drag and drop the entire `maa-lokhi-stores` folder** onto the page.
4. Done. Your store is live in ~20 seconds at
   `https://random-name-123.netlify.app` (rename it: *Site settings →
   Change site name* → e.g. `maa-lokhi-stores` → `https://maa-lokhi-stores.netlify.app`).
5. Free SSL (https) is automatic. The included **`_headers`** file is picked
   up by Netlify automatically and adds security headers.

**To update later:** drag-and-drop the folder again — the site updates.
Or connect a GitHub repo (Option B) for automatic updates on every change.

### Option B — GitHub Pages (free, great if you want version history)

1. Create an account at **https://github.com** → verify email.
2. Click **+** (top right) → **New repository** → name it
   `maa-lokhi-stores` → **Create**.
3. Click **"uploading an existing file"** → drag ALL the files of this project
   (index.html, css, js, img folders — everything) → **Commit changes**.
   ⚠️ Upload the *contents* of the folder, not the folder itself, so that
   `index.html` sits at the top level.
4. Go to **Settings → Pages** → under "Build and deployment" choose:
   Source `Deploy from a branch`, Branch `main`, folder `/ (root)` → **Save**.
5. Wait 1–2 minutes → your store is live at
   `https://YOUR-USERNAME.github.io/maa-lokhi-stores/`.
6. To update: open the repo → upload/edit files → commit → auto-redeploys.

### Option C — Cloudflare Pages (free, fastest global network)

1. Sign up at **https://dash.cloudflare.com** → **Workers & Pages → Create → Pages → Upload assets**.
2. Drag-and-drop the `maa-lokhi-stores` folder → **Deploy site**.
3. Live at `https://project-name.pages.dev`. The `_headers` file is honoured
   automatically. (For a custom domain, Cloudflare is the best free DNS.)

> All three give you: free hosting, free https, free subdomain, unlimited
> traffic on this scale. **There is genuinely nothing to pay.**

## STEP 3 — Your free domain

You already get a free permanent address with any option above:
- `https://maa-lokhi-stores.netlify.app` (Netlify)
- `https://yourname.github.io/maa-lokhi-stores` (GitHub Pages)
- `https://maa-lokhi.pages.dev` (Cloudflare)

Free *custom* domains (like `.free-site.site`) exist but look untrustworthy
and come and go — **not recommended for a shop**. When you're ready for a
proper domain, a `.in` or `.com` costs about ₹199–₹800/year at
**GoDaddy / Hostinger / BigRock / Cloudflare Registrar**. Connecting it:

- **Netlify:** Site settings → Domain management → Add custom domain → follow
  the DNS instructions (2 records). Free SSL is issued automatically.
- **GitHub Pages:** repo Settings → Pages → Custom domain → enter it, tick
  "Enforce HTTPS".
- **Cloudflare Pages:** Pages project → Custom domains → connect.

Then update `sitemap.xml` (replace `https://YOUR-DOMAIN.example/` with your
real URL) — good for Google.

## STEP 4 — Make it hack-proof (already 90% done — here's the full picture)

**Built into the site:**
- **Content-Security-Policy** header via `<meta>` in `index.html` — blocks
  any injected/external script from running (the #1 website attack).
- **`_headers` file** — sends `X-Frame-Options: DENY` (no clickjacking),
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
  and HSTS on Netlify/Cloudflare automatically.
- **No backend, no database** — nothing to SQL-inject or ransomware.
- **XSS-proof rendering** — every customer-written text (reviews, addresses)
  is inserted with `textContent`, never HTML. Verified by automated tests.
- **No third-party scripts, no trackers, no cookies** — nothing to leak.
- Inputs are validated and length-capped; localStorage access is try/catch
  guarded.

**Your part (5 minutes — do these):**
1. **Enable 2FA** on your GitHub / Netlify / Cloudflare accounts (Settings →
   Security). This is the single most important step — it protects whoever
   can edit your site.
2. Use a strong, unique password (a password manager like Bitwarden is free).
3. Never paste API keys or passwords into the site files — anything in a
   static file is public. (The site needs none.)
4. Keep the repo **public only if it contains no secrets**; private repos
   deploy on all three platforms for free anyway.
5. If you later add a real payment gateway, keep the secret key **only** in
   the gateway's dashboard / serverless function — never in `js/` files.

## STEP 5 — Tell Google & customers you exist (free marketing)

1. **Google Business Profile** (https://business.google.com) — free. Add your
   shop with photos, timings and your new website link. This alone brings
   local customers searching "jewellery shop near me" or "store in <your town>".
2. **Google Search Console** (https://search.google.com/search-console) —
   free. Add your URL, verify, and submit `sitemap.xml`. Gets you indexed.
3. Share the link on WhatsApp status/groups, Instagram bio, Facebook page.
4. Print the QR code of your site on the shop counter and bills
   (any free QR generator).
5. The site's copy already targets "delivers to remote pincodes / COD
   available" — mention your town/region names in product descriptions
   (edit `js/data.js`) to win those searches too.

## STEP 6 — Daily operation (how you receive orders)

Demo checkout flow today:
1. Customer adds to cart, checks out, pays choice = **COD/UPI demo**.
2. The order is stored **in their browser** and shown on their Orders page.
3. If you set `CONFIG.whatsapp`, after ordering they can tap **WhatsApp** →
   the full order lands in your WhatsApp with one tap — you confirm, they pay
   UPI/COD, you ship. Many small Indian shops run exactly like this.
4. Ask customers to forward the order confirmation (it has the Order ID) —
   or simply confirm every order on WhatsApp/call using the phone number
   they entered.

## STEP 7 — When you're ready for real online payments (optional, later)

The checkout is structured so a gateway drops in cleanly:
- **Razorpay / Cashfree / PayU** — Indian gateways, UPI+cards+netbanking,
  pay-per-transaction, no monthly fee. On a static site you use their
  *Payment Links / Payment Pages* or *Razorpay Route* buttons (no server
  needed), or add a tiny serverless function (Netlify Functions are free).
- Typical flow: customer orders → site generates a Razorpay Payment Link via
  your dashboard (or you create one manually for phone orders) → payment
  confirmation lands in your email/bank.
- Until then, **UPI + COD over WhatsApp is 100% functional and free.**

## STEP 8 — Maintenance cheat-sheet

| I want to… | Do this |
|---|---|
| Change price/stock | Edit `PRODUCTS` in `js/data.js` → re-upload folder |
| Add a product | Copy one product block, change fields; add photo `img/p38.jpg`; reference `img:'p38'` |
| Remove a product | Delete its block |
| Change coupons | Edit `COUPONS` in `js/data.js` |
| Change banner text | Hero is in `js/app.js` → `renderHome` |
| See it locally | `python3 -m http.server 8000` in the folder |
| Re-test after edits | `node test/smoke.test.js` |

## Final go-live checklist ✅

- [ ] `CONFIG` in `js/data.js` has real phone/WhatsApp/address/UPI
- [ ] Deployed via Netlify / GitHub Pages / Cloudflare Pages
- [ ] Site opens on phone + laptop, cart persists after refresh
- [ ] Test order placed end-to-end, WhatsApp message arrives to you
- [ ] 2FA enabled on hosting + email accounts
- [ ] Google Business Profile + Search Console configured
- [ ] sitemap.xml updated with real domain (if custom domain)
- [ ] QR code printed and displayed at the shop

**Congratulations — your store now reaches every pincode in India. 🛍️**
