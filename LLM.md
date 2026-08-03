# EX:OH Foundation Theme — agent guidance

Theme-wide guidance for planning and editing pages in the **EX:OH Foundation Theme**. Use this file once per session for page types, recipes, and cross-cutting rules; drill into per-component `.mcp.md` files for field-level detail.

**Theme root:** `foundation-theme/` · **`metadata.json` → `mcpEnabled`:** `true` (required for MCP tools to expose this file).

Intended for marketing and brochure sites: clear hierarchy, one hero per page, accessible CTAs, and section-driven body content.

## Page templates and content types

CMS page types map to Handlebars templates under `pages/`. Both public page types share the same body model: programmatic sections render from `content.blocks.body` as pre-rendered HTML blocks.

| CMS page type | Theme template | Layout | Body model | Aspects |
|---------------|----------------|--------|------------|---------|
| `site` | `pages/site.hbs` | `layouts/main.hbs` | `content.blocks.body` — ordered section blocks | `general`, `seo`, `site`, theme `styles` |
| `content_page` | `pages/content_page.hbs` | `layouts/main.hbs` | `content.blocks.body` — ordered section blocks | `general`, `seo` |

**Layout:** `layouts/main.hbs` wraps every public page with `partials/nav/header`, the page body, and `partials/nav/footer`. Site-wide style variables come from the site root's `forms.styles` aspect (see [styles aspect doc](pages/aspects/styles.mcp.md)).

**CSS extension:** `data/site.jsonc` registers a `theme_styles_css` extension for page type `site`, rendered via `pages/theme_styles_css.hbs`. Agents do not author this template directly.

**Editing-only templates** (CMS editor chrome, not public pages):

| Template | Purpose |
|----------|---------|
| `pages/editing/blocks.hbs` | Block editor shell (`layouts/content_block.hbs`) |
| `pages/editing/empty.hbs` | Empty editor placeholder |

Do not edit layout or editing templates for content-only tasks — work through section models and page aspects instead.

## Recommended page recipes

Recipes list section **display names** and paths. Field shapes and constraints live in each component's `.mcp.md`.

### Homepage / landing (`site`)

1. **Hero Image** — `partials/sections/hero/hero/` — single above-the-fold message and primary CTA ([`.mcp.md`](partials/sections/hero/hero/.mcp.md))
2. **Icon Banner** — `partials/sections/content/icon-banner/` — 3–4 value-prop tiles ([`.mcp.md`](partials/sections/content/icon-banner/.mcp.md))
3. **Text & Image** — `partials/sections/content/text-and-image/` — supporting story block ([`.mcp.md`](partials/sections/content/text-and-image/.mcp.md))
4. **Testimonials** — `partials/sections/misc/testimonials/` — social proof ([`.mcp.md`](partials/sections/misc/testimonials/.mcp.md))
5. **Belt** — `partials/sections/misc/belt/` — footer-adjacent links or CTAs ([`.mcp.md`](partials/sections/misc/belt/.mcp.md))

**Placement:** exactly one hero variant at the top. Belt belongs late in the stack. Deviating is acceptable when content warrants it (e.g. **Video Hero** instead of **Hero Image** for video-first brands).

### Standard content page (`content_page`)

1. **Image Banner** or **Two Column Hero** (optional) — lighter hero when the page needs context above the fold ([image-banner](partials/sections/hero/image-banner/.mcp.md), [two-col-hero](partials/sections/hero/two-col-hero/.mcp.md))
2. **Markdown Text** or **Statements** — page introduction ([markdown-text](partials/sections/content/markdown-text/.mcp.md), [statements](partials/sections/content/statements/.mcp.md))
3. **Text & Image**, **Showcase**, or **Info Tiles** — main body content ([text-and-image](partials/sections/content/text-and-image/.mcp.md), [column-showcase](partials/sections/content/column-showcase/.mcp.md), [info-tiles](partials/sections/content/info-tiles/.mcp.md))
4. **Belt** (optional) — related links near the bottom ([`.mcp.md`](partials/sections/misc/belt/.mcp.md))

**Placement:** skip the hero when the page title in `seo` aspect is sufficient. Never stack two full heroes.

### Contact / lead capture (`content_page`)

1. **Hero Image** or **Image Banner** — short headline and context ([hero](partials/sections/hero/hero/.mcp.md), [image-banner](partials/sections/hero/image-banner/.mcp.md))
2. **Markdown Text** — what to expect after submitting ([`.mcp.md`](partials/sections/content/markdown-text/.mcp.md))
3. **Contact Form & Map** — primary conversion ([`.mcp.md`](partials/sections/misc/contact-form/.mcp.md))
4. **Info Tiles** (optional) — phone, hours, or office details ([`.mcp.md`](partials/sections/content/info-tiles/.mcp.md))

**Placement:** keep the contact form in the lower half but not buried under unrelated long sections. One contact form per page.

### About / team (`content_page`)

1. **Two Column Hero** or **Hero Image** — team or mission headline ([two-col-hero](partials/sections/hero/two-col-hero/.mcp.md), [hero](partials/sections/hero/hero/.mcp.md))
2. **Statements** — mission or values ([`.mcp.md`](partials/sections/content/statements/.mcp.md))
3. **Team** — member grid ([`.mcp.md`](partials/sections/misc/team/.mcp.md))
4. **Text & Image** or **Icons & Image** — culture or history ([text-and-image](partials/sections/content/text-and-image/.mcp.md), [icons-and-image](partials/sections/content/icons-and-image/.mcp.md))
5. **Testimonials** (optional) — endorsements ([`.mcp.md`](partials/sections/misc/testimonials/.mcp.md))

## Cross-cutting rules

### SEO

- One clear `h1` per page — typically the hero or banner headline, not duplicated in body sections.
- Set `title` and `description` via the `seo` aspect on every public page.
- Keep the SEO title aligned with the visible hero headline unless there is a deliberate reason to differ (e.g. shorter SERP title).
- Do not rely on section body text alone for meta description.

### Navigation

- Header and footer come from `partials/nav/header` and `partials/nav/footer`; menu structure lives in site/nav aspects.
- Do not hard-code navigation links inside section models when a site menu item exists.
- Belt tiles may supplement nav but should not replace primary menu structure.

### Aspects

| Aspect | Applies to | Agent action |
|--------|------------|--------------|
| `general` | All public pages | Page title, slug, publish state |
| `seo` | All public pages | Meta title, description, social preview |
| `site` | `site` page type only | Site name, logo, global settings |
| `styles` | `site` page type only | Brand colours, typography, borders — see [styles.mcp.md](pages/aspects/styles.mcp.md) |

Built-in aspect field detail is served by the CMS (`general`, `seo`, `site`). Theme custom aspects use `metadata.json` → `aspects[]` → `mcpDoc`.

### URLs and CTAs

- Prefer site-relative paths (`/about`, `/contact`) over absolute URLs for internal links.
- Every CTA needs both label and URL; do not leave empty buttons.
- External links in belt tiles or CTAs should set `target` where the component supports it.

### Media

- Hero components use background or banner imagery — see each hero `.mcp.md` for image vs video fields.
- Inline images belong in **Text & Image**, **Image Gallery**, or **Icons & Image**, not duplicated in the hero unless intentional.
- Use the CMS image aspect for uploads; respect alt text where the model exposes it.

### Section order

- Hero variants first when used (pick exactly one).
- Narrative and supporting content in the middle.
- **Belt**, **Contact Form & Map**, and **Testimonials** typically late.
- Avoid adjacent redundant sections (two full heroes, back-to-back identical **Text & Image** blocks).

### Theme styling

- Global colours and typography are controlled on the `site` page via `forms.styles` ([styles.mcp.md](pages/aspects/styles.mcp.md)).
- When `themeStylingEnabled` is `"yes"`, section defaults inherit theme variables — avoid fighting global styles with per-section colour overrides unless the component supports it.
- Menu styling is optional (`menuStylingEnabled`); leave off unless brand guidelines require custom nav chrome.

## Section component index

Active leaf components only (`disabled/` variants are omitted). Full field tables are in each `.mcp.md`.

### Hero (`partials/sections/hero/`)

| Display name | Path | Role | Detail |
|--------------|------|------|--------|
| Hero Image | `partials/sections/hero/hero/` | Full-width centred hero with CTA | [`.mcp.md`](partials/sections/hero/hero/.mcp.md) |
| Two Column Hero | `partials/sections/hero/two-col-hero/` | Side-by-side text and image | [`.mcp.md`](partials/sections/hero/two-col-hero/.mcp.md) |
| Video Hero | `partials/sections/hero/video-hero/` | Hero with inline playable video | [`.mcp.md`](partials/sections/hero/video-hero/.mcp.md) |
| Image Banner | `partials/sections/hero/image-banner/` | Shorter banner-style hero | [`.mcp.md`](partials/sections/hero/image-banner/.mcp.md) |

### Content (`partials/sections/content/`)

| Display name | Path | Role | Detail |
|--------------|------|------|--------|
| Icon Banner | `partials/sections/content/icon-banner/` | Row of icon + label tiles | [`.mcp.md`](partials/sections/content/icon-banner/.mcp.md) |
| Text & Image | `partials/sections/content/text-and-image/` | Prose beside an image | [`.mcp.md`](partials/sections/content/text-and-image/.mcp.md) |
| Markdown Text | `partials/sections/content/markdown-text/` | Rich text body block | [`.mcp.md`](partials/sections/content/markdown-text/.mcp.md) |
| Statements | `partials/sections/content/statements/` | Highlighted quote or value statements | [`.mcp.md`](partials/sections/content/statements/.mcp.md) |
| Info Tiles | `partials/sections/content/info-tiles/` | Card grid for facts or features | [`.mcp.md`](partials/sections/content/info-tiles/.mcp.md) |
| Showcase | `partials/sections/content/column-showcase/` | Multi-column feature showcase | [`.mcp.md`](partials/sections/content/column-showcase/.mcp.md) |
| Freeform Columns | `partials/sections/content/freeform-columns/` | Flexible multi-column layout | [`.mcp.md`](partials/sections/content/freeform-columns/.mcp.md) |
| Icons & Image | `partials/sections/content/icons-and-image/` | Icons grouped with a supporting image | [`.mcp.md`](partials/sections/content/icons-and-image/.mcp.md) |
| Image Gallery | `partials/sections/content/gallery/` | Image grid or carousel | [`.mcp.md`](partials/sections/content/gallery/.mcp.md) |
| Embedded Video | `partials/sections/content/embedded-video/` | Mid-page video embed | [`.mcp.md`](partials/sections/content/embedded-video/.mcp.md) |

### Misc (`partials/sections/misc/`)

| Display name | Path | Role | Detail |
|--------------|------|------|--------|
| Belt | `partials/sections/misc/belt/` | Footer-adjacent link or CTA strip | [`.mcp.md`](partials/sections/misc/belt/.mcp.md) |
| Contact Form & Map | `partials/sections/misc/contact-form/` | Lead capture with optional map | [`.mcp.md`](partials/sections/misc/contact-form/.mcp.md) |
| Team | `partials/sections/misc/team/` | Team member grid | [`.mcp.md`](partials/sections/misc/team/.mcp.md) |
| Testimonials | `partials/sections/misc/testimonials/` | Customer quotes | [`.mcp.md`](partials/sections/misc/testimonials/.mcp.md) |

## Anti-patterns

- **Multiple heroes** — only one hero variant per page. Use **Image Banner** on inner pages instead of a second full hero.
- **Competing above-the-fold messages** — one primary headline and CTA; demote secondary offers to **Icon Banner** or **Belt**.
- **Contact form buried** — place **Contact Form & Map** after brief context, not after long unrelated galleries or team grids.
- **SEO vs hero mismatch** — unrelated `seo.title` and hero headline confuses users and agents; align unless shortening for search.
- **Broken belt links** — verify every belt tile URL; use `target` for external destinations.
- **Wrong hero variant** — side-by-side layout needs **Two Column Hero**, not **Hero Image** (see each hero `.mcp.md` "when not to use").
- **Editing theme files for content** — do not modify `pages/editing/*`, `layouts/*`, or `partials/nav/*` when the task is page content only.
- **Duplicate contact forms** — one **Contact Form & Map** per page.
- **Ignoring `styles` aspect** — large brand changes belong on the `site` page `forms.styles`, not scattered across section overrides.
