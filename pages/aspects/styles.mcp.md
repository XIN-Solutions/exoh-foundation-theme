# Styles aspect (`styles`)

Foundation theme site-wide visual styling: colours, typography, borders, shadows, and navigation chrome. Stored on the **site root page** under `forms.styles`.

## When it applies

Declared in theme `metadata.json` for `pageTypes: ["site"]`. Only the site root page carries this aspect.

## Fields (`forms.styles`)

### Master switches

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `themeStylingEnabled` | `"yes"` \| `"no"` | `"yes"` | When `"no"`, theme CSS variables from this aspect are not applied |
| `darkMode` | `"yes"` \| `"no"` | `"no"` | Enables dark-mode palette overrides when supported by the theme |

### Brand colours

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `primaryColor` | string (hex) | `#007bff` | Primary brand colour |
| `secondaryColor` | string (hex) | `#6c757d` | Secondary accent |
| `tertiaryColor` | string (hex) | `#28a745` | Tertiary accent (often used for buttons) |
| `backgroundColor` | string (hex) | `#ffffff` | Page background |
| `altBackgroundColor` | string (hex) | `#f8f9fa` | Alternate section background |

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

Empty strings for menu fields mean “use theme default”.

## Persistence

Theme aspects persist like other form namespaces: the full `styles` object is saved on the site root content record. There is no built-in CMS validator for individual fields — invalid values may produce unexpected CSS but will not block save.

## Example

```json
{
  "styles": {
    "themeStylingEnabled": "yes",
    "primaryColor": "#1a73e8",
    "secondaryColor": "#5f6368",
    "tertiaryColor": "#34a853",
    "backgroundColor": "#ffffff",
    "paragraphFontFamily": "'Open Sans', sans-serif",
    "cardBorderRadius": "md",
    "buttonColorSource": "tertiary",
    "menuStylingEnabled": "no"
  }
}
```

## Anti-patterns

- Do not set `themeStylingEnabled` to `"no"` and expect brand colours to apply.
- Avoid invalid hex colours — the editor uses colour inputs but agents should send `#rrggbb` form.
- `googleFonts` must be a JSON-encoded array string, not a raw JavaScript array in the stored payload.
- Do not rename the aspect namespace; it must remain `styles` to match theme `metadata.json`.
