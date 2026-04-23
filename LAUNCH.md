# PropFirmCode — Go-Live Checklist

**Production domain:** `propfirmcode.net`
**GA4 Measurement ID:** `G-ZRYLW1ZV04` (embedded sitewide)

Everything below is code-ready. Only the steps marked **HUMAN** need your action.

---

## ✅ Already done (no action needed)

- [x] All 7 prop firm pages + homepage built, V2 premium design
- [x] All 7 real logos applied
- [x] Mobile polish pass verified (trust bar shows only "Updated April 2026" on mobile)
- [x] Desktop preserves full premium trust bar
- [x] Canonical URLs, OpenGraph, Twitter Cards on every page → `propfirmcode.net`
- [x] `sitemap.xml` with 8 URLs, `robots.txt`, `_headers` (security + caching)
- [x] GA4 `gtag.js` snippet on every page with **real ID G-ZRYLW1ZV04**
- [x] Event tracking wired: `copy_code`, `claim_discount`, `tiktok_click`, `crypto_support_copy`, `nav_cta_click`, `promo_bar_click`, `faq_toggle`
- [x] Real TikTok profile URL everywhere
- [x] `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `og-image.png`, `social-preview-1080.png` — all final PNG/ICO, not placeholders
- [x] `.gitignore` excludes dev files, source briefs, raw logo versions

---

## 🟡 HUMAN — 5 steps to go live

### 1. Push to GitHub
```bash
cd C:\Users\Administrator\Desktop\propfirmcode
git init
git add .
git commit -m "Initial production release — propfirmcode.net"
git branch -M main
git remote add origin https://github.com/<your-user>/propfirmcode.git
git push -u origin main
```

### 2. Connect Cloudflare Pages
- Cloudflare Dashboard → Workers & Pages → **Create → Pages → Connect to Git**
- Select the `propfirmcode` repo
- **Build command:** *(leave blank)*
- **Build output directory:** `/`
- Click Deploy — first build takes ~30s

### 3. Connect custom domain `propfirmcode.net`
- In the Pages project → **Custom domains → Set up a custom domain**
- Add `propfirmcode.net` — Cloudflare auto-issues SSL
- Add `www.propfirmcode.net` as well
- Cloudflare auto-creates a 301 redirect (pick `www → apex` or `apex → www`; apex is recommended)
- If DNS is not on Cloudflare yet, move nameservers to Cloudflare first (zone setup → 2–5 min)

### 4. Site-wide settings (Cloudflare dashboard, one-time)
- SSL/TLS → **Full (strict)**
- SSL/TLS → Edge Certificates → **Always Use HTTPS: ON**
- SSL/TLS → Edge Certificates → **HTTP Strict Transport Security (HSTS): enable** (already served via `_headers` too)
- Speed → Optimization → **Auto Minify: HTML + CSS + JS ON**, **Brotli: ON**
- Security → Bots → **Bot Fight Mode: ON**

### 5. Post-launch (within first hour)
- [ ] Visit `https://propfirmcode.net/` — confirm hero loads, all 7 firm pages render
- [ ] Open DevTools Network tab on the homepage — confirm `gtag/js?id=G-ZRYLW1ZV04` loads (no 403/blocked)
- [ ] GA4 → Reports → Realtime — confirm your session appears
- [ ] GA4 → Admin → Events → mark `copy_code` and `claim_discount` as **Conversions**
- [ ] Test a copy code button — verify `copy_code` fires in GA4 DebugView
- [ ] Google Search Console → Add property `propfirmcode.net` (DNS TXT verification via Cloudflare)
- [ ] Submit `https://propfirmcode.net/sitemap.xml` in GSC
- [ ] Preview an OG share at https://www.opengraph.xyz/url/https%3A%2F%2Fpropfirmcode.net%2F — confirm og-image.png renders
- [ ] Run Lighthouse on the homepage — target 95+ Performance / 100 SEO / 100 Accessibility

---

## Files that ship to production

```
/                          ← homepage (index.html)
/firms/*.html              ← 7 dedicated firm pages
/css/style.css
/js/main.js
/logo/*.{png,jpg}          ← 7 real firm logos (+ brand placeholder fonts)
/favicon.svg
/favicon.ico
/apple-touch-icon.png
/og-image.png              ← 1200×630 social share card
/social-preview-1080.png   ← 1080×1080 for TikTok / Instagram branding
/robots.txt
/sitemap.xml
/_headers                  ← security + cache headers (Cloudflare)
```

Files excluded by `.gitignore` (stay local): `.claude/`, `server.js`, `build-assets.py`, raw logo versions, source briefs, `og-image.svg`.

---

## Rollback / emergency

If something goes wrong after deploy:
- Cloudflare Pages → Deployments → click any previous deployment → **Rollback**
- No database, no state — everything is static and atomic
