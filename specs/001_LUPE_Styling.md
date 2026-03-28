# 001_LUPE_Styling — Frontend Styling Specification

**Status:** Implemented
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

| Property         | Value                                        |
|------------------|----------------------------------------------|
| Background       | Light Pink `#F49EC4`                         |
| Text color       | Dark Blue `#094584`                          |
| Hover background | No color change (stays light pink)           |
| Hover effect     | Scale up `scale-105`                         |
| Click effect     | Scale down `active:scale-95`                 |
| Focus ring       | None                                         |
| Font weight      | Bold (`font-bold`)                           |
| Border radius    | Rounded (`rounded-lg`)                       |

```html
<!-- Example Tailwind classes -->
<button class="bg-lupe-light-pink text-lupe-blue font-bold rounded-lg px-4 py-2 hover:scale-105 active:scale-95 transition-transform duration-150">
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
// tailwind.config.js — implemented additions
colors: {
  lupe: {
    blue:         '#094584',  // Primary blue
    pink:         '#F00063',  // Magenta accent
    'light-pink': '#F49EC4',  // CTA button bg, footer copyright
    'light-blue': '#C5D8F0',  // Inactive filter bg, image placeholders
    orange:       '#F09000',
    red:          '#F01000',
    'orange-red': '#F03800',
  }
}
```

---

## 5. Logo Placement

Three SVG variants are available as local assets in `src/assets/`:

| File                | Color             | Usage                          |
|---------------------|-------------------|--------------------------------|
| `lupe_magenta.svg`  | Magenta `#F00063` | Navbar (white background)      |
| `lupe_pink.svg`     | Light Pink `#F49EC4` | Footer (dark blue background) |
| `lupe_blue.svg`     | Dark Blue `#094584` | Reserved / alternate use      |

| Location | Element      | Asset imported          | Alignment     |
|----------|--------------|-------------------------|---------------|
| Navbar   | Left-aligned | `lupe_magenta.svg`      | `h-10 w-auto` |
| Footer   | Centered     | `lupe_pink.svg`         | `h-10 w-auto mx-auto mb-3` |

**Implementation:** import as ES module in each component — Vite bundles and hashes them automatically.

```js
// Navbar.jsx
import lupeLogo from '../../assets/lupe_magenta.svg';

// Footer.jsx
import lupeLogo from '../../assets/lupe_pink.svg';
```

```html
<img src={lupeLogo} alt="LUPE" className="h-10 w-auto" />
```

---

## 6. Custom Font — Colab Family

The project uses a custom typeface called **Colab**, self-hosted as `.otf` files. Five weight variants are included.

### 6.1 Font Files

Place all files in `src/assets/fonts/`:

| File            | Weight name | CSS `font-weight` |
|-----------------|-------------|-------------------|
| `ColabThi.otf`  | Thin        | 100               |
| `ColabLig.otf`  | Light       | 300               |
| `ColabReg.otf`  | Regular     | 400               |
| `ColabMed.otf`  | Medium      | 500               |
| `ColabBol.otf`  | Bold        | 700               |

### 6.2 `@font-face` Declarations

Add the following to `src/index.css` (before the Tailwind directives or in a dedicated `:root` block):

```css
@font-face {
  font-family: 'Colab';
  src: url('./assets/fonts/ColabThi.otf') format('opentype');
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Colab';
  src: url('./assets/fonts/ColabLig.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Colab';
  src: url('./assets/fonts/ColabReg.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Colab';
  src: url('./assets/fonts/ColabMed.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Colab';
  src: url('./assets/fonts/ColabBol.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

> Paths are relative to `src/index.css`.

### 6.3 Tailwind Config

Extend the `fontFamily` key in `tailwind.config.js` to expose `font-colab`:

```js
theme: {
  extend: {
    fontFamily: {
      colab: ['Colab', 'sans-serif'],
    },
  },
},
```

Usage in markup:

```html
<p class="font-colab font-thin">Thin (100)</p>
<p class="font-colab font-light">Light (300)</p>
<p class="font-colab font-normal">Regular (400)</p>
<p class="font-colab font-medium">Medium (500)</p>
<p class="font-colab font-bold">Bold (700)</p>
```

### 6.4 Usage Guidelines

| Context                  | Variant        | Tailwind classes               |
|--------------------------|----------------|--------------------------------|
| Body / product text      | Regular (400)  | `font-colab font-normal`       |
| Labels / nav links       | Medium (500)   | `font-colab font-medium`       |
| Headings / product names | Bold (700)     | `font-colab font-bold`         |
| Captions / metadata      | Light (300)    | `font-colab font-light`        |
| Decorative / display     | Thin (100)     | `font-colab font-thin`         |

> Colab is the active body font — applied globally via `font-colab` on the `body` rule in `src/index.css`. Inter and Playfair Display remain as fallbacks in the Tailwind config.

---

## 7. Out of Scope (this spec)

- Product card layout changes.
- Admin panel styling.
- Mobile-specific breakpoints (handled separately).
- Typography scale changes beyond font family.
