# Premium Kitchen Equipment (PKE) — Website

A static, no-build marketing and catalogue site for **Premium Kitchen Equipment**, a commercial kitchen equipment supplier in Davao City, Philippines.

Plain HTML, CSS, and vanilla JavaScript — no framework, no bundler, no `npm install`. Open `index.html` in a browser, or serve the folder with any static file server.

## Running locally

```bash
# any static server works, e.g.:
python -m http.server 8000
# then open http://localhost:8000
```

Every link is a relative path, so it also works by opening `index.html` directly from disk (`file://`).

## Structure

```
index.html          Homepage
shop.html           Product listing — all 31 in-stock items, filterable by category/brand/price
product.html        Product detail page (Electric Convection Oven)
categories.html     Category overview
about.html          Company story + showroom photo gallery
contact.html        Contact info, inquiry form, Google Maps embed
quote.html          Quote list (placeholder — see Known limitations)
404.html            Custom not-found page
service-areas.html  }
financing.html      } placeholder pages, linked from the footer
careers.html        }
privacy.html         }
terms.html            }

css/style.css        All styles (design tokens + components)
js/main.js            Shared: header scroll state, mobile drawer, cart counter, hours widget, scroll-reveal
js/shop.js             Listing page: filters, sort, category deep-linking
js/product.js           Product page: gallery, tabs, sticky quote bar
js/contact.js             Contact form (front-end only, see below)

images/products/       Optimized (resized + compressed) real product photos used across the site
images/assetss/         Original, full-resolution source photos (large — see Known limitations)
images/logo.png, favicon-64.png, apple-touch-icon.png, og-image.png   Brand assets generated from the real PKE logo
```

## Content notes

- **Product data is illustrative.** Names, specs, and prices in `shop.html`/`product.html`/`index.html` are reasonable placeholders written to match the real product photos, not confirmed catalogue data. Update prices and specs before treating this as a live storefront.
- **Business info is real**: phone, email, address, hours, and social links are the actual PKE contact details.
- Only four categories have real photos (Cooking Equipment, Food Prep, Catering, Smallwares). Refrigeration has no photographed stock yet, so its category tile is intentionally shown as a "Coming soon" placeholder rather than mixed with unrelated real photos.

## Known limitations (placeholders, not yet wired to a backend)

- **Contact form / quote requests** don't send anywhere yet — submitting shows a front-end success message only. Wire `js/contact.js` to a form backend (e.g. Formspree, a serverless function, or your own API) before relying on it.
- **`quote.html`** is a placeholder — the header's cart badge counts clicks but there's no real line-item quote list yet.
- **Header search bar** is not yet functional.
- **`service-areas.html`, `financing.html`, `careers.html`, `privacy.html`, `terms.html`** are on-brand "coming soon" placeholders, not final copy.
- **`sitemap.xml`** and the `Sitemap:` line in **`robots.txt`**, plus the JSON-LD block in `index.html`, all contain `REPLACE-WITH-YOUR-DOMAIN` — fill in the real domain once this is deployed.
- `images/assetss/` (the original uncompressed product photos, ~33 MB) is included for reference but isn't referenced by any page — safe to remove from the repo if you want a lighter checkout.

## Deployment

This is a static site — it can be hosted on GitHub Pages, Netlify, Vercel, or any static file host with zero configuration. There's no build step.
