# Change Request: Product Enhancements & UI Updates

**Date:** 2026-04-16
**Author:** Rodrigo Tristany
**Status:** Pending Implementation

---

## Overview

This document specifies frontend changes corresponding to backend spec `002_LUPE_Product_Enhancements.md`, plus two UI updates to the Navbar. The backend changes introduce `cover_image_id` and `priority` fields on the product entity; this spec describes how the admin product form exposes them, how the public catalog consumes them, and the updated Navbar/header styling and logo sizing.

---

## 1. Cover Image Selection (Admin Form)

### Description

When creating or editing a product, the admin must be able to designate one of the product's uploaded images as the cover (primary) image. The selected image is sent to the API as `cover_image_id`.

### Context

The backend now exposes `cover_image_id` (nullable integer FK) on `ProductResponse` and accepts it on `PATCH /api/v1/admin/products/{id}`. The cover image is the one displayed in product listings when set.

### Changes

**`src/components/admin/ImageUploader.jsx`**

- After images are uploaded and displayed, render a "Set as cover" toggle on each image thumbnail.
- The currently selected cover image should show a visible indicator (e.g., a star icon or "Cover" badge overlay using `lupe-blue` background + white text).
- Only one image can be the cover at a time. Selecting a new cover deselects the previous one.
- The selected `cover_image_id` is surfaced to the parent (`ProductForm`) via a callback prop: `onCoverChange(imageId)`.
- If the product already has a `cover_image_id` set (loaded from the API), pre-select it on mount.
- If the cover image is deleted, clear the selection and notify the parent with `onCoverChange(null)`.

**`src/components/admin/ProductForm.jsx`**

- Add `cover_image_id` to the form state (initial value from the product response, or `null` for new products).
- Pass `cover_image_id` and `onCoverChange` to `ImageUploader`.
- Include `cover_image_id` in the PATCH/POST payload sent to the API.

**API (`src/api/admin.js`)**

- No new endpoint needed. The existing `updateProduct(id, data)` function already sends the full update payload; ensure `cover_image_id` is included in `data`.

**i18n keys to add:**

```json
{
  "admin": {
    "set_cover": "Portada / Set as cover",
    "cover_label": "Portada / Cover"
  }
}
```

---

## 2. Priority Field (Admin Form)

### Description

A numeric `priority` field (integer, default `0`) controls the display order of products in the public catalog. Lower values appear first. The admin can set or update this value when creating or editing a product.

### Context

The backend exposes `priority` on `ProductResponse`, `ProductCreate`, and `ProductUpdate`. Public listing queries are ordered `priority ASC`, then `id ASC` as a tie-breaker.

### Changes

**`src/components/admin/ProductForm.jsx`**

- Add a controlled `<input type="number" />` field for `priority`.
- Default value: `0` for new products; populated from the product response when editing.
- Validation: integer only, no minimum/maximum enforced client-side (backend accepts any integer).
- Place the field in the form alongside other metadata fields (e.g., near the `is_active` toggle).
- Include `priority` in the PATCH/POST payload.

**i18n keys to add:**

```json
{
  "admin": {
    "priority": "Prioridad / Priority",
    "priority_hint": "Menor número = aparece primero / Lower number = shown first"
  }
}
```

---

## 3. Product Ordering in Catalog

### Description

The public catalog (`CatalogPage`) must display products in the order returned by the API, which is now sorted by `priority ASC, id ASC`. No client-side re-sorting is needed — the frontend must stop any existing client-side sort that overrides API order.

### Changes

**`src/hooks/useProducts.js`**

- Remove any client-side `sort()` call applied to the product list after fetching, if one exists.
- The API response order is the canonical display order.

**`src/components/catalog/ProductGrid.jsx`**

- Render products in the exact order received from `useProducts`. No additional sorting.

**`src/pages/CatalogPage.jsx`**

- Same: do not apply any client-side sort to the product list.

> No UI change is visible to the user — the ordering is implicit from the API response.

---

## 4. Logo Sizing

### Description

The LUPE logo in the Navbar should scale responsively: current size on mobile, 1.5× on tablet, and 2× on desktop.

### Context

Current logo size per spec `001_LUPE_Styling.md` section 5: `h-10 w-auto` (40px height). The new sizes are:

| Breakpoint | Multiplier | Height class |
|---|---|---|
| Default (mobile, < 768px) | 1× | `h-10` (40px) |
| `md` (tablet, ≥ 768px) | 1.5× | `md:h-[60px]` |
| `lg` (desktop, ≥ 1024px) | 2× | `lg:h-20` (80px) |

### Changes

**`src/components/layout/Navbar.jsx`**

- Update the logo `<img>` class from `h-10 w-auto` to `h-10 md:h-[60px] lg:h-20 w-auto`.

```jsx
<img src={lupeLogo} alt="LUPE" className="h-10 md:h-[60px] lg:h-20 w-auto" />
```

---

## 5. Header / Navbar Restyling

### Description

Update the Navbar background, icon colors, and logo asset to match a new color scheme.

| Element | Old | New |
|---|---|---|
| Background | White `#FFFFFF` | Lupe Pink `#F00063` (`bg-lupe-pink`) |
| Icons (cart, language toggle, etc.) | Dark Blue `#094584` | Dark Blue `#094584` (`text-lupe-blue`) — unchanged |
| Logo asset | `lupe_magenta.svg` | `lupe_blue.svg` |
| Bottom border | Dark Blue `#094584` | Remove (no longer needed on a colored background) |

> Icons remain `text-lupe-blue` (`#094584`) — they are already blue, so no color change is required for them, only confirming they stay as-is against the new pink background.

### Changes

**`src/components/layout/Navbar.jsx`**

1. Change the root container background class from `bg-white` (or equivalent) to `bg-lupe-pink`.
2. Remove the bottom border class (`border-b border-lupe-blue` or similar).
3. Replace the logo import:
   ```js
   // Before
   import lupeLogo from '../../assets/lupe_magenta.svg';
   // After
   import lupeLogo from '../../assets/lupe_blue.svg';
   ```
4. Ensure all icon elements use `text-lupe-blue` (`#094584`). If icons are already using this class, no change is needed.

**Spec `001_LUPE_Styling.md` — section 3.1 superseded values:**

| Property | Old value | New value |
|---|---|---|
| Background | `#FFFFFF` | `#F00063` (`lupe-pink`) |
| Bottom border | Dark Blue `#094584` | None |
| Logo asset | `lupe_magenta.svg` | `lupe_blue.svg` |

---

## Affected Files Summary

| File | Change |
|---|---|
| `src/components/admin/ImageUploader.jsx` | Add cover image selection UI with per-thumbnail toggle |
| `src/components/admin/ProductForm.jsx` | Add `cover_image_id` and `priority` to form state and API payload |
| `src/api/admin.js` | Ensure `cover_image_id` and `priority` are included in update/create payloads |
| `src/hooks/useProducts.js` | Remove any client-side sort on the product list |
| `src/components/catalog/ProductGrid.jsx` | Render products in API-returned order (no re-sort) |
| `src/pages/CatalogPage.jsx` | Remove any client-side sort on the product list |
| `src/components/layout/Navbar.jsx` | Pink background, blue logo, responsive logo sizing |
| `src/i18n/es.json` / `en.json` | Add `admin.set_cover`, `admin.cover_label`, `admin.priority`, `admin.priority_hint` |
