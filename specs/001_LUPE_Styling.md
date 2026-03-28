# 001_LUPE_Styling — Frontend Styling Specification

**Status:** Draft
**Date:** 2026-03-28
**Scope:** Public-facing catalog UI (Navbar, Product Grid, Filters, Footer)

---

## 1. Brand Color Palette

| Name         | Hex       | RGB               | Usage                          |
|--------------|-----------|-------------------|--------------------------------|
| Red          | `#F01000` | R 240 / G 16 / B 0   | Accent, alerts                 |
| Pink/Magenta | `#F00063` | R 240 / G 0 / B 99   | Primary CTA (Add to Cart bg)   |
| Dark Blue    | `#094584` | R 9 / G 69 / B 132   | Text, active states, footer bg |
| Orange       | `#F09000` | R 240 / G 144 / B 0  | Highlights, accents            |
| Orange-Red   | `#F03800` | R 240 / G 56 / B 0   | Secondary accent               |
| Light Pink   | `#F49EC4` | R 244 / G 158 / B 196| Accent (not used for filters)  |
| Light Blue   | `#C5D8F0` | R 197 / G 216 / B 240| Inactive filter bg             |

> "Paleta de colores vibrantes, que transmite un mensaje positivo y de alegría."

---

## 2. Global Layout

| Property          | Value                |
|-------------------|----------------------|
| Page background   | `#FFFFFF` (white)    |
| Body font         | Inter                |
| Heading font      | Playfair Display     |

---

## 3. Component Styling Rules

### 3.1 Navbar / Header

- Remove the hardcoded `LUPE` text; replace with `<img src="/logo.png" alt="LUPE" />` (placeholder until asset is delivered).
- Background: white (`#FFFFFF`).
- Bottom border: Dark Blue `#094584`.
- Nav links: Dark Blue `#094584`.

### 3.2 Add to Cart Button

| Property         | Value                          |
|------------------|--------------------------------|
| Background       | Light Pink `#F49EC4`           |
| Text color       | Dark Blue `#094584`            |
| Hover background | Pink/Magenta `#F00063`         |
| Font weight      | Bold (`font-bold`)             |
| Border radius    | Rounded (`rounded-lg`)         |

```html
<!-- Example Tailwind classes -->
<button class="bg-lupe-light-pink hover:bg-lupe-pink text-lupe-blue font-bold rounded-lg px-4 py-2 transition-colors">
  Add to Cart
</button>
```

### 3.3 Category Filter Buttons

| State    | Background              | Text color           |
|----------|-------------------------|----------------------|
| Active   | Dark Blue `#094584`     | White `#FFFFFF`      |
| Inactive | Light Blue `#C5D8F0`    | Dark Blue `#094584`  |

```html
<!-- Active -->
<button class="bg-[#094584] text-white font-semibold rounded-full px-4 py-1.5">
  Category Name
</button>

<!-- Inactive -->
<button class="bg-[#C5D8F0] text-[#094584] font-semibold rounded-full px-4 py-1.5 hover:bg-[#094584] hover:text-white transition-colors">
  Category Name
</button>
```

### 3.4 Search Bar

| Property       | Value                  |
|----------------|------------------------|
| Border         | Dark Blue `#094584`    |
| Focus ring     | Dark Blue `#094584`    |
| Background     | White `#FFFFFF`        |

### 3.5 Navbar Separator

- Bottom border of the sticky header: Dark Blue `#094584` (`border-lupe-blue`)

### 3.6 Product Card

| Property              | Value                        |
|-----------------------|------------------------------|
| Border                | Light Gray `gray-200`        |
| Image placeholder bg  | Light Blue `#C5D8F0`         |
| Price text color      | Dark Blue `#094584`          |
| Border radius         | `rounded-2xl`                |

### 3.7 Pagination Buttons

| Property | Value             |
|----------|-------------------|
| Border   | Light Gray `gray-200` |

### 3.8 Footer

| Property        | Value                  |
|-----------------|------------------------|
| Background      | Dark Blue `#094584`    |
| Text color      | White `#FFFFFF`        |
| Copyright color | Light Pink `#F49EC4`   |

- Remove the hardcoded `LUPE` text.
- Replace with the same `<img>` logo component used in the Navbar (white/inverted variant if available).

---

## 4. Tailwind Config Reference

The existing `tailwind.config.js` defines a `lupe-*` color scale. The following values should be mapped or added to align with the brand palette:

```js
// tailwind.config.js — suggested additions/updates
colors: {
  lupe: {
    pink:       '#F00063',  // CTA buttons
    blue:       '#094584',  // Primary blue
    'light-pink': '#F49EC4', // Inactive filters
    orange:     '#F09000',
    red:        '#F01000',
    'orange-red': '#F03800',
  }
}
```

---

## 5. Logo Placement

| Location | Element              | Notes                                      |
|----------|----------------------|--------------------------------------------|
| Navbar   | Left-aligned         | Replace `<span>LUPE</span>` with `<img>`   |
| Footer   | Centered or left     | Use white/inverted logo variant on blue bg |

- Logo asset is **not yet provided**. Use a placeholder `<img src="/logo.png" alt="LUPE" />` until the final asset is delivered.
- Logo file should be placed in `public/` so Vite serves it at `/logo.png`.

---

## 6. Out of Scope (this spec)

- Product card layout changes.
- Admin panel styling.
- Mobile-specific breakpoints (handled separately).
- Typography scale changes beyond font family.
