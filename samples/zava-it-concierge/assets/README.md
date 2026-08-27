# Publication and design assets

## Implementation screenshots

The 39 publication PNGs in this directory are captured from the real React implementation by `npm run capture:visual`:

- 31 inline defaults, one for every operational and education tool.
- Three full-screen dashboards: Personal, Team, and IT Portfolio.
- Personal mobile and IT Portfolio dark-mode variants.
- Approval detail, approval confirmation, and request receipt states.

`sample.json` lists every publication image with PnP metadata, order, URL, and alt text. `visual-evidence.json` records dimensions and automated runtime, media, overflow, deprecated-chrome, canvas, and engine checks. Run `npm run check:gallery` to verify exact coverage and integrity.

## Historical design references

The four `it-concierge-*.png` files are user-supplied design references. They informed layout and interaction decisions but are not implementation screenshots and are intentionally excluded from `sample.json`.

## Runtime media

Runtime portraits and Surface renders live under `src/shared/assets/`. `asset-provenance.json` records source, retrieval or reference information, SHA-256, intended use, and fallback policy. `npm run validate:assets` fails when a listed file is missing or has drifted.

## Agent icons

`copilot/color.png` and `copilot/outline.png` use one original Zava IT Concierge mark: a geometric Z inside the estate-health ring. The color icon is 192 x 192 on the steel brand field; the 32 x 32 outline icon is monochrome white on transparency.

Run `npm run generate:agent-icons` after changing the design source and `npm run check:agent-icons` to verify dimensions, transparency, monochrome treatment, visible-pixel coverage, and byte-for-byte freshness.