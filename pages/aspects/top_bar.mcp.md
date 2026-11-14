# Top Bar aspect

**Aspect:** `top_bar`

## Purpose

Site header strip above the main navigation: an optional contact row (phone and email) and the message bar (rotating banner, schedule, and button). Message bar background and text colours are theme styles (`messageBarBackgroundColor`, `messageBarTextColor`) on the **styles** aspect, in the Navigation accordion.

Load field detail with **`aspect_documentation`** (`aspect: "top_bar"`). Read current values with **`get_aspect`** on the **site root page**. Set values with **`update_aspect`** on the site root page.

Contact copy is **not** stored on this aspect — it comes from **`footer`** `contactInfo` (phone and email).

The public header uses `top_bar.messageBar` when that object is stored. Until it is, the theme still reads a legacy `navigation.messageBar` left from before this move. Saving this aspect writes `messageBar` here. A payload that omits `messageBar` does not clear a message bar already stored on `top_bar`.

## When it applies

Only the **site root page** (`contentType: site`) carries this aspect.

## Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | `"yes"` \| `"no"` | `"no"` | When `"yes"`, the contact strip renders above the navigation bar |
| `messageBar` | object | omitted | Banner above the navigation. See below. Omit the key to leave a stored message bar unchanged |

### Message bar (`messageBar`)

| Field | Type | Notes |
|-------|------|--------|
| `enabled` | boolean | Show the message bar |
| `animation` | string | `static`, `fade`, or `scroll` |
| `scope` | string | `all` or `homepage` (`contentType.code === 'site'` at render) |
| `messages` | array | Ordered banner messages |
| `button` | object | Optional bar button (`enabled`, `label`, `isExternal`, `pageId`, `externalUrl`) |

#### Message (`messageBar.messages[]`)

| Field | Type | Notes |
|-------|------|--------|
| `text` | string | **Required.** Blank rows are dropped on save |
| `showFrom` | string | Optional start: `YYYY-MM-DDTHH:mm:ss±HH:MM`. Empty means no start |
| `showUntil` | string | Optional end, same format. Empty means no end |
| `isExternal` | boolean | Per-message link type |
| `pageId` | string | Internal page when not external |
| `externalUrl` | string | Absolute URL when external |

The server stores `showFrom` / `showUntil` as posted. Invalid strings are stored as `''`. The visitor's browser hides messages outside the window. On expand, `messageBarView` adds resolved `href` values. `messageBarView` is not returned from `get_aspect`.

## Examples

Pass as the unwrapped aspect payload to **`update_aspect`** with `aspect: "top_bar"` on the site root page:

```json
{
  "enabled": "yes",
  "messageBar": {
    "enabled": true,
    "animation": "fade",
    "scope": "all",
    "messages": [
      {
        "text": "Enrolments are open",
        "showFrom": "",
        "showUntil": "",
        "isExternal": false,
        "pageId": "",
        "externalUrl": ""
      }
    ],
    "button": {
      "enabled": false,
      "label": "",
      "isExternal": false,
      "pageId": "",
      "externalUrl": ""
    }
  }
}
```

Contact strip only. This does not clear a message bar already stored on `top_bar`:

```json
{
  "enabled": "no"
}
```
