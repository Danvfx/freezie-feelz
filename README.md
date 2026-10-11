# FreezieFeelz website

A simple, fast, single-page site for a school business simulation. Plain HTML, CSS and vanilla JavaScript. No build step: open `index.html` in a browser and it works.

```
freeziefeelz/
  index.html     page content and structure
  styles.css     all styling (colours are tokens at the top)
  script.js      menu data, form settings, and behaviour
  assets/
    images/      product shots (flavor-1.png, flavor-2.png, ...)
    icons/       favicon.svg
```

Search the project for `TODO:` to find every placeholder.

## Edit the flavours

Open `script.js` and find the `FLAVORS` array near the top. Each flavour is one line:

```js
{ id: 'strawberry', mood: 'Affectionate', name: 'Strawberry', desc: '...',
  c1: '#ff9bb5', c2: '#f2456e', face: 'affectionate',
  image: 'assets/images/flavor-strawberry.webp' }
```

Changing it updates the menu cards, the mood buttons in the hero, and the flavour dropdown in the order form together.

- `mood`: shown as "The Motivated" on the card and as a button in the hero.
- `c1` / `c2`: the two colours of the drink. They colour the circle behind each cup.
- `face`: the cartoon-cup expression used while a flavour has no photo.
- Currency symbol: `CONFIG.CURRENCY` (currently the peso sign, a guess).
- Prices are not set per flavour. See "Sizes, prices, promos and hours" below.

## Swap in real product photos

All seven live flavours have photos. Spare photos for Watermelon, Lemon and Orange are saved in `assets/images/` and wired into the commented-out lines at the end of `FLAVORS`: the study says there are nine flavours but names seven, so uncomment two of them once the group confirms (add a comma after the last live line). The photo-to-flavour matching was guessed from the cup colours, so double-check it.

1. Make the photo a transparent cutout of the cup, about 800 x 1000 px (4:5 portrait), saved as `.webp` or `.png` in `assets/images/`, named like `flavor-mango.webp`. The existing files are a good size reference.
2. In `FLAVORS`, set `image: 'assets/images/flavor-mango.webp'` for that flavour.

The same photo is used on the menu card and in the hero when that mood is selected. The wide lineup photo above the menu is `assets/images/lineup.webp`.

## Logos

- `assets/images/logo.png`: stacked wordmark with a transparent background (navbar).
- `assets/images/logo-oval.png`: oval badge with a transparent background (footer).
- `assets/images/logo-square.png`: full square logo (social profile pictures). `assets/icons/` holds the favicon and touch icon made from it.

## The vibe test

The "What's your FreezieFeelz?" quiz sits between About and Menu. Edit it in `script.js`:

- `VIBE_QUESTIONS`: four questions, four answers each. Every answer gives points to flavours by `id`. The flavour with the most points wins, and earlier questions break ties.
- `VIBE_LINES`: the one-line personality text on each result.
- A flavour that is not in `FLAVORS` is ignored, so the quiz keeps working when flavours change. To make a new flavour reachable, add its `id` to a few answers.
- The result buttons reuse the order form: Order this pre-fills the flavour, Build Your Own opens the custom mix.

## Sizes, prices, promos and hours

All of this lives at the top of `script.js`:

- `SIZES`: 16 oz is 55 and 22 oz is 65 (peso). Change a price here and the menu cards, hero tag, order form total, FAQ and About facts all update.
- `PROMO`: the Buy 3 get 1 free rule used by the order form total. The 10% off for the last customers promo is text only (it depends on time of day).
- `CONFIG.HOURS`, `CONFIG.HOURS_CLOSED` and `CONFIG.LOCATION`: shown in Contact, the footer, the order form and the FAQ.
- `CONFIG.PROMO_VIDEO_URL`: paste an embed link to fill the "See us in action" box.

Promo wording (Buy 3 get 1 free, 10% off, event deals) is written in the Promos section of `index.html`. The team names and roles are in the "Meet the team" list in the About section.

## Connect the forms

Forms are handled by `send()` in `script.js`, configured in `CONFIG` at the top.

**Option 1 (recommended): free form service**
- Formspree: create a form, then set `FORM_ENDPOINT: 'https://formspree.io/f/yourFormId'`.
- Web3Forms: set `FORM_ENDPOINT: 'https://api.web3forms.com/submit'` and `ACCESS_KEY: 'your-key'`.

Submissions then arrive in your email, and the visitor sees a success message.

**Until then (Option 2, the built-in fallback)**: with `FORM_ENDPOINT` left empty, the form builds a ready-to-send message, copies it, and shows an **Open Messenger** button. The visitor pastes it into Messenger. Nothing is lost, but it is not automatic.

## Set the Messenger and Instagram links

In `script.js`, edit `LINKS` (`messenger` and `instagram`). Every button and footer link updates from there. Until set, they show a "coming soon" message instead of jumping to the top.

## Change colours and fonts

All colours are CSS variables in `:root` at the top of `styles.css`. The client colours are `--blue` (`#0045ad`) and `--sky` (`#91e1ff`). The yellow `--sun` is a suggested accent and not client-approved: change it, or set it to `var(--sky)` for a blue-only look. Fonts are Fredoka and Nunito from Google Fonts, with system fallbacks.

## Deploy

**Netlify:** drag the `freeziefeelz` folder onto https://app.netlify.com/drop.

**GitHub Pages:** push the folder to a repository, then Settings > Pages > deploy from the `main` branch root. It works as-is because all paths are relative.

Tip: keep apostrophes out of HTML attributes (use plain text or an HTML entity). Netlify rewrites attribute quotes and can cut the value short.

## Accessibility notes

Skip link, visible focus rings, labelled form fields with plain-language errors, keyboard-operable tabs and menu, `prefers-reduced-motion` support (animations, bubbles and the scrolling banner are turned off), and every image or placeholder has a text alternative.
