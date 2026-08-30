# Styles aspect

**Aspect:** `styles`

## Purpose

Site-wide visual styling: colours, typography, borders, shadows, and navigation chrome.

Load field detail with **`aspect_documentation`** (`aspect: "styles"`). Read current values with **`get_aspect`** on the **site root page**. Set values with **`update_aspect`** on the site root page.

## When it applies

Only the **site root page** (`contentType: site`) carries this aspect.

## Fields

### Master switches

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `themeStylingEnabled` | `"yes"` \| `"no"` | `"yes"` | When `"no"`, theme CSS variables from this aspect are not applied |
| `darkMode` | `"yes"` \| `"no"` | `"no"` | Enables dark-mode palette overrides when supported by the theme |

### Brand colours — backgrounds (fills)

These tokens are **background / fill** colours. Pair each with its matching `*TextColor` for readable foreground on that surface.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `primaryColor` | string (hex) | `#007bff` | Primary brand background |
| `secondaryColor` | string (hex) | `#6c757d` | Secondary accent background |
| `tertiaryColor` | string (hex) | `#28a745` | Tertiary accent background (often used for buttons) |
| `backgroundColor` | string (hex) | `#ffffff` | Page background |
| `altBackgroundColor` | string (hex) | `#f8f9fa` | Alternate section background |

### Brand colours — surface text

Default foreground on each fill above. Style presets and **Randomize colours** derive these from fill luminance (light fill → dark text, dark fill → `#ffffff`).

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `primaryTextColor` | string (hex) | `#ffffff` | Text on primary brand fill |
| `secondaryTextColor` | string (hex) | `#ffffff` | Text on secondary fill |
| `tertiaryTextColor` | string (hex) | `#ffffff` | Text on tertiary fill |
| `backgroundTextColor` | string (hex) | `#212529` | Text on page background (defaults to body/`paragraphColor`) |
| `altBackgroundTextColor` | string (hex) | `#212529` | Text on alternate section background (defaults to body/`paragraphColor`) |

**CSS fallbacks when saved aspects omit text keys:** brand, secondary, and accent text fall back to `#ffffff`; page and section text fall back to `paragraphColor`.

**Cascade on published pages:** utility classes such as `.primaryColor-bg`, `.secondaryColor-bg`, `.tertiaryColor-bg`, `.backgroundColor-bg`, `.altBackgroundColor-bg`, and `.bg--alternate` set both background and default `color` from the matching text token. Solid buttons (`.btn.buttonColor-bg` and theme button variants) use the text colour of `buttonColorSource` (`primary` / `secondary` / `tertiary`); when `buttonColorSource` is `custom`, text is chosen from the luminance of `buttonColorCustom`.

**Heading vs body on surfaces:** per-level heading colours (`h1Color`–`h5Color`, applied via `hN-all` classes) still win over surface foreground. Body copy (`.p-all`, `.paragraphColor-text`) inside a fill surface **inherits** the surface text colour instead of overriding it.

**Photo overlay heroes** (`.hero-1`, `.hero-3`, `.hero-5` titles and leads on image overlays) are **not** driven by these tokens — they stay on `var(--bs-light)` independent of brand surface text.

### Typography — headings (h1–h5)

Each heading level has `hNColor`, `hNFontFamily`, `hNFontWeight`, and `hNFontSize` (CSS size string, e.g. `48px`).

Defaults: Open Sans stack; h1 `#212529` / 700 / 48px; h2 `#495057` / 600 / 36px; h3–h5 `#6c757d` with decreasing sizes.

### Typography — body

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `paragraphColor` | string (hex) | `#212529` | Body text colour |
| `paragraphFontFamily` | string | `'Open Sans', sans-serif` | Body font stack |
| `paragraphFontWeight` | string | `400` | Body weight |
| `paragraphFontSize` | string | `16px` | Body size |
| `googleFonts` | string (JSON array) | `"[]"` | Serialized list of Google Font families to load |

### Components

| Field | Type | Default | Allowed values |
|-------|------|---------|----------------|
| `cardBorderRadius` | string | `default` | `default`, `none`, `sm`, `md`, `lg`, `pill` |
| `buttonBorderRadius` | string | `default` | same as card |
| `imageBorderRadius` | string | `default` | same as card |
| `cardShadow` | string | `sm` | `none`, `sm`, `md`, `lg` |
| `buttonColorSource` | string | `tertiary` | `primary`, `secondary`, `tertiary`, `custom` |
| `buttonColorCustom` | string (hex) | `""` | Used when `buttonColorSource` is `custom` |

### Navigation chrome

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `menuStylingEnabled` | `"yes"` \| `"no"` | `"no"` | Apply custom menu colours/fonts |
| `menuItemColor` | string (hex) | `""` | Nav link colour |
| `menuCtaColor` | string (hex) | `""` | CTA button background |
| `menuCtaTextColor` | string (hex) | `""` | CTA button text |
| `menuFontFamily` | string | `""` | Nav font stack |
| `menuFontSize` | string | `""` | Nav font size |
| `menuFontWeight` | string | `""` | Nav font weight |

Empty strings for menu fields mean "use theme default".

## Anti-patterns

- Do not set `themeStylingEnabled` to `"no"` and expect brand colours to apply.
- Avoid invalid hex colours — send `#rrggbb` form.
- `googleFonts` must be a JSON-encoded array string, not a raw JavaScript array.
- Do not set **`styles`** on child pages — update the site root page only.

## Examples

Pass as the aspect payload to **`update_aspect`** with `aspect: "styles"` on the site root page.

```json
{
  "themeStylingEnabled": "yes",
  "primaryColor": "#1a73e8",
  "primaryTextColor": "#ffffff",
  "secondaryColor": "#5f6368",
  "secondaryTextColor": "#ffffff",
  "tertiaryColor": "#34a853",
  "tertiaryTextColor": "#ffffff",
  "backgroundColor": "#ffffff",
  "backgroundTextColor": "#212529",
  "altBackgroundColor": "#f8f9fa",
  "altBackgroundTextColor": "#212529",
  "paragraphFontFamily": "'Open Sans', sans-serif",
  "cardBorderRadius": "md",
  "buttonColorSource": "tertiary",
  "menuStylingEnabled": "no"
}
```

Minimal brand update:

```json
{
  "primaryColor": "#1a73e8",
  "primaryTextColor": "#ffffff",
  "tertiaryColor": "#34a853",
  "tertiaryTextColor": "#ffffff"
}
```
