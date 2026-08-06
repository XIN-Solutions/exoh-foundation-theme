# EX:OH Foundation Theme — agent guidance

Theme-wide guidance for planning and editing pages in the **EX:OH Foundation Theme**. Load this once per session via **`site_theme_documentation`**, then use section and aspect tools for field-level detail.

Intended for marketing and brochure sites: clear hierarchy, one hero per page, accessible CTAs, and section-driven body content.

## Page types

| `contentType` | Aspects to set | Body sections |
|---------------|----------------|---------------|
| `site` | `general`, `seo`, `site`, `styles` | Ordered blocks edited with **`list_sections`**, **`append_section`**, **`update_section`**, **`insert_section_*`**, **`delete_section`** |
| `content_page` | `general`, `seo` | Same section tools as `site` |

Create pages with **`create_page`** (use **`page_types_at_root`** or **`page_types_as_children`** to discover allowed types). Set aspects after create with **`update_aspect`**; load field contracts with **`aspect_documentation`** or **`get_aspect`**.

Site-wide brand colours and typography are controlled by the **`styles`** aspect on the **site root page** — see **`aspect_documentation`** with `aspect: "styles"`.

## Recommended page recipes

Recipes list section display names and **`type`** codes for **`append_section`**. Load field contracts with **`component_documentation`** or from **`list_sections`** / **`get_section`** (`includeComponentDocs: true`).

### Homepage / landing (`contentType: site`)

1. **Hero Image** — `hero/hero` — single above-the-fold message and primary CTA
2. **Icon Banner** — `content/icon-banner` — 3–4 value-prop tiles
3. **Text & Image** — `content/text-and-image` — supporting story block
4. **Testimonials** — `misc/testimonials` — social proof
5. **Belt** — `misc/belt` — footer-adjacent links or CTAs

**Placement:** exactly one hero variant at the top. Belt belongs late in the stack. Deviating is acceptable when content warrants it (e.g. **Video Hero** (`hero/video-hero`) instead of **Hero Image** for video-first brands).

### Standard content page (`contentType: content_page`)

1. **Image Banner** or **Two Column Hero** (optional) — `hero/image-banner` or `hero/two-col-hero` — lighter hero when the page needs context above the fold
2. **Markdown Text** or **Statements** — `content/markdown-text` or `content/statements` — page introduction
3. **Text & Image**, **Showcase**, or **Info Tiles** — `content/text-and-image`, `content/column-showcase`, or `content/info-tiles` — main body content
4. **Belt** (optional) — `misc/belt` — related links near the bottom

**Placement:** skip the hero when the **`seo`** aspect title is sufficient. Never stack two full heroes.

### Contact / lead capture (`contentType: content_page`)

1. **Hero Image** or **Image Banner** — `hero/hero` or `hero/image-banner` — short headline and context
2. **Markdown Text** — `content/markdown-text` — what to expect after submitting
3. **Contact Form & Map** — `misc/contact-form` — primary conversion
4. **Info Tiles** (optional) — `content/info-tiles` — phone, hours, or office details

**Placement:** keep the contact form in the lower half but not buried under unrelated long sections. One contact form per page.

### About / team (`contentType: content_page`)

1. **Two Column Hero** or **Hero Image** — `hero/two-col-hero` or `hero/hero` — team or mission headline
2. **Statements** — `content/statements` — mission or values
3. **Team** — `misc/team` — member grid
4. **Text & Image** or **Icons & Image** — `content/text-and-image` or `content/icons-and-image` — culture or history
5. **Testimonials** (optional) — `misc/testimonials` — endorsements

## Cross-cutting rules

### SEO

- One clear `h1` per page — typically the hero or banner headline, not duplicated in body sections.
- Set `title` and `description` via **`update_aspect`** with `aspect: "seo"` on every public page.
- Keep the SEO title aligned with the visible hero headline unless there is a deliberate reason to differ (e.g. shorter SERP title).
- Do not rely on section body text alone for meta description.

### Navigation

- Site navigation is managed at the site level — do not hard-code nav links in section **`model`** when a site menu item exists.
- Belt tiles may supplement nav but should not replace primary menu structure.

### Aspects

| Aspect | Applies to | Tool |
|--------|------------|------|
| `general` | All public pages | **`get_aspect`** / **`update_aspect`** — page title, slug, publish state |
| `seo` | All public pages | **`get_aspect`** / **`update_aspect`** — meta title, description, social preview |
| `site` | `site` page type only | **`get_aspect`** / **`update_aspect`** — site name, logo, global settings |
| `styles` | `site` page type only (site root) | **`get_aspect`** / **`update_aspect`** / **`aspect_documentation`** — brand colours, typography, borders |

Load built-in aspect field detail with **`aspect_documentation`**. Load theme **`styles`** detail with **`aspect_documentation`** and `aspect: "styles"`.

### URLs and CTAs

- Prefer site-relative paths (`/about`, `/contact`) over absolute URLs for internal links in section **`model`** fields.
- Every CTA needs both label and URL; do not leave empty buttons.
- External links in belt tiles or CTAs should set `target` where the component supports it.

### Media

- Hero sections use background or banner imagery — see **`component_documentation`** for each hero **`type`** for image vs video **`config`** fields.
- Inline images belong in **Text & Image** (`content/text-and-image`), **Image Gallery** (`content/gallery`), or **Icons & Image** (`content/icons-and-image`), not duplicated in the hero unless intentional.
- Upload images with media tools; respect alt text where the **`model`** exposes it.

### Section order

- Hero variants first when used (pick exactly one).
- Narrative and supporting content in the middle.
- **Belt**, **Contact Form & Map**, and **Testimonials** typically late.
- Avoid adjacent redundant sections (two full heroes, back-to-back identical **Text & Image** blocks).

### Theme styling

- Global colours and typography are set via **`styles`** on the site root page with **`update_aspect`**.
- When `themeStylingEnabled` is `"yes"`, section defaults inherit theme variables — avoid fighting global styles with per-section colour overrides unless the component supports it.
- Menu styling is optional (`menuStylingEnabled`); leave off unless brand guidelines require custom nav chrome.

## Section component index

Discover all types with **`list_section_types`**. Load per-type field contracts with **`component_documentation`**.

### Hero

| Display name | `type` | Role |
|--------------|--------|------|
| Hero Image | `hero/hero` | Full-width centred hero with CTA |
| Two Column Hero | `hero/two-col-hero` | Side-by-side text and image |
| Video Hero | `hero/video-hero` | Hero with inline playable video |
| Image Banner | `hero/image-banner` | Shorter banner-style hero |

### Content

| Display name | `type` | Role |
|--------------|--------|------|
| Icon Banner | `content/icon-banner` | Row of icon + label tiles |
| Text & Image | `content/text-and-image` | Prose beside an image |
| Markdown Text | `content/markdown-text` | Rich text body block |
| Statements | `content/statements` | Highlighted quote or value statements |
| Info Tiles | `content/info-tiles` | Card grid for facts or features |
| Showcase | `content/column-showcase` | Multi-column feature showcase |
| Freeform Columns | `content/freeform-columns` | Flexible multi-column layout |
| Icons & Image | `content/icons-and-image` | Icons grouped with a supporting image |
| Image Gallery | `content/gallery` | Image grid or carousel |
| Embedded Video | `content/embedded-video` | Mid-page video embed |

### Misc

| Display name | `type` | Role |
|--------------|--------|------|
| Belt | `misc/belt` | Footer-adjacent link or CTA strip (loader-backed child pages) |
| Contact Form & Map | `misc/contact-form` | Lead capture with optional map |
| Team | `misc/team` | Team member grid |
| Testimonials | `misc/testimonials` | Customer quotes |

## Anti-patterns

- **Multiple heroes** — only one hero variant per page. Use **Image Banner** (`hero/image-banner`) on inner pages instead of a second full hero.
- **Competing above-the-fold messages** — one primary headline and CTA; demote secondary offers to `content/icon-banner` or `misc/belt`.
- **Contact form buried** — place `misc/contact-form` after brief context, not after long unrelated galleries or team grids.
- **SEO vs hero mismatch** — unrelated `seo.title` and hero headline confuses users; align unless shortening for search.
- **Broken belt links** — verify every belt tile URL; use `target` for external destinations.
- **Wrong hero variant** — side-by-side layout needs `hero/two-col-hero`, not `hero/hero` — see **`component_documentation`** for each hero type.
- **Duplicate contact forms** — one `misc/contact-form` per page.
- **Ignoring `styles` aspect** — large brand changes belong on the site root via **`update_aspect`** with `aspect: "styles"`, not scattered across section overrides.
