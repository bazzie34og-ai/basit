# Client assets

Drop the client's files here, then run `npm run assets` (it also runs on every build).

The asset pack was not in the repository when the site was built, so pages show honest
"Photo to come" plates (preview only) and a type-only wordmark until these files arrive.

## photos/ (720px-wide originals, never upscaled)
- `carpet-lounge-grey-extraction-wand.jpg`: home hero plate
- `hallway-carpet-drying-air-movers.jpg`: carpet page plate
- `hallway-carpet-before-after.jpg`: composite, left before / right after
- `stairs-carpet-before-after.jpg`: 2×2 composite, left column before / right column after (split into two pairs)
- `patio-path-before-after.jpg`: composite, left before / right after (exterior page, if enabled)
- `skylight-glass-before-after.jpg`: composite, top before / bottom after (exterior page, if enabled)

Composites are split by detecting the white gutter (`scripts/prepare-assets.mjs`). If no gutter
is found, the build logs an error and the file is not split, so check it by hand.

## logos/
- `logo-script-forest-transparent.png`: header (on linen)
- `logo-script-cream-transparent.png`: footer (on forest)

These were cut from a flyer and are soft. **Ask the owner for the original logo file.**
Do not use the old round teal badge (it has phone numbers baked in).

## reference/
- `PALETTE-SOURCE-forest-sage-flyer.jpg`: colour reference only. Never displayed.
