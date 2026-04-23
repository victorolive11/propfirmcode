# PropFirmCode — Production Deployment Guide

Static site. No backend. Optimized for edge CDN delivery.

---

## 1. Recommended stack

| Option | Why | Cost |
|--------|-----|------|
| **Cloudflare Pages** ⭐ recommended | Fastest edge, free SSL, free bandwidth, easy custom domain, great analytics | Free |
| Vercel | Zero-config, preview deploys, great DX | Free tier |
| Netlify | Easy forms + redirects, great DX | Free tier |
| GitHub Pages | Simple, but slower DNS + no edge optimization | Free |

**Pick Cloudflare Pages** — free unlimited bandwidth matters if the site goes viral on TikTok.

---

## 2. Pre-launch checklist

### Content / config
- [ ] Replace `G-ZRYLW1ZV04` with real GA4 Measurement ID in all HTML files (search/replace)
- [ ] Replace placeholder TikTok URL (`https://tiktok.com`) with real profile URL in `index.html` + all firm pages
- [ ] Confirm all 7 affiliate links (FundedNext + BrightFunded may still be placeholders)
- [ ] Verify crypto wallet addresses one final time
- [ ] Re-export `og-image.svg` → `og-image.png` (1200×630) via any SVG→PNG tool (Figma, squoosh.app, or CLI `rsvg-convert og-image.svg -o og-image.png`)
- [ ] Generate `favicon.ico` and `apple-touch-icon.png` from `favicon.svg` (use realfavicongenerator.net)

### SEO
- [x] Meta title + description on every page
- [x] Canonical URLs
- [x] Open Graph + Twitter Card tags
- [x] `robots.txt`
- [x] `sitemap.xml`
- [x] `lang="en"` on `<html>`
- [x] `theme-color` meta
- [x] Semantic headings (h1 per page)
- [ ] Submit sitemap in Google Search Console after DNS propagation

### Technical
- [x] Mobile responsive (375px tested)
- [x] No console errors
- [x] All images have `alt` attributes
- [x] Clean URLs (/firms/<name>.html)
- [ ] Add 404.html (optional but recommended)
- [ ] Run Lighthouse — target: 95+ Performance, 100 SEO, 100 Accessibility, 100 Best Practices

### Analytics
- [x] GA4 gtag snippet embedded
- [x] Event tracking wired for: `copy_code`, `claim_discount`, `tiktok_click`, `crypto_support_copy`, `nav_cta_click`, `promo_bar_click`, `faq_toggle`
- [ ] Create GA4 property → grab Measurement ID → replace placeholder
- [ ] Set up conversion events in GA4 UI: mark `copy_code` and `claim_discount` as conversions
- [ ] Link GA4 → Google Search Console
- [ ] Add property to Google Search Console (DNS TXT verification)
- [ ] Add domain to Bing Webmaster Tools (optional)

---

## 3. Deploy via Cloudflare Pages (step by step)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial production build"
   git branch -M main
   git remote add origin https://github.com/<you>/propfirmcode.git
   git push -u origin main
   ```

2. **Cloudflare Pages**
   - Dashboard → Workers & Pages → Create → Pages → Connect to Git
   - Select `propfirmcode` repo
   - Build command: *(leave blank — pure static)*
   - Build output directory: `/`
   - Environment variables: *(none needed)*
   - Deploy

3. **Custom domain**
   - Pages project → Custom domains → Set up custom domain → `propfirmcode.net`
   - Add `www` subdomain too, set redirect `www → root` (or vice-versa)
   - Cloudflare auto-issues SSL

4. **Edge rules**
   - Caching: Cloudflare defaults are fine
   - Bot fight mode: ON
   - Always Use HTTPS: ON
   - Auto Minify: HTML + CSS + JS
   - Brotli: ON

5. **Add `_headers` for security** (create file at root):
   ```
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: camera=(), microphone=(), geolocation=()
     Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
   ```

---

## 4. Post-launch (first 48h)

- Submit `https://propfirmcode.net/sitemap.xml` in Google Search Console
- Run PageSpeed Insights → fix any flagged issues
- Share site preview on social (test OG card renders correctly at [OpenGraph.xyz](https://www.opengraph.xyz/))
- Monitor GA4 Realtime for first traffic
- Verify each firm CTA actually tracks `claim_discount` in GA4 DebugView

---

## 5. Ongoing

- Update promo codes when they expire → bump `lastmod` in `sitemap.xml`
- Add new firms → create `/firms/<firm>.html`, add to `sitemap.xml`, add card to homepage
- Monitor GA4: top firms clicked, copy-to-claim ratio, mobile vs desktop
