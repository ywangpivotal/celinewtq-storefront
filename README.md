# CelineWTQ Storefront

Handmade ceramic dinnerware storefront: a static site with no build step and no JS frameworks.

## Run

Open `index.html` directly in a browser, or serve it locally:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000/
```

## Checks

```sh
npx --yes html-validate index.html
node --check js/main.js
```

## Structure

```
index.html       Semantic markup: header/nav + cart badge, hero, product grid
                 container, story blocks, newsletter form, footer
css/styles.css   Mobile-first styles; palette and tokens as CSS custom
                 properties in :root; breakpoints at 48em (768px) and 64em (1024px)
js/main.js       PRODUCTS data array -> rendered product cards (inline SVG imagery),
                 add-to-cart with localStorage-persisted badge count and aria-live
                 toast, newsletter email validation, mobile nav toggle
```

Product and story images are inline SVG illustrations (with `<title>` alt text
and fixed aspect ratios), so the page works offline apart from Google Fonts.
The cart count lives in `localStorage` under `celinewtq-cart-count`.
