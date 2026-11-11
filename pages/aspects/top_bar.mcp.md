# Top Bar aspect

**Aspect:** `top_bar`

## Purpose

Enables the site header contact strip (phone and email) shown above the main navigation.

Load field detail with **`aspect_documentation`** (`aspect: "top_bar"`). Read current values with **`get_aspect`** on the **site root page**. Set values with **`update_aspect`** on the site root page.

Contact copy is **not** stored on this aspect — it comes from **`footer`** `contactInfo` (phone and email).

## When it applies

Only the **site root page** (`contentType: site`) carries this aspect.

## Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | `"yes"` \| `"no"` | `"no"` | When `"yes"`, the contact strip renders above the navigation bar |

## Examples

Pass as the unwrapped aspect payload to **`update_aspect`** with `aspect: "top_bar"` on the site root page:

```json
{
  "enabled": "yes"
}
```

Disable the strip:

```json
{
  "enabled": "no"
}
```
