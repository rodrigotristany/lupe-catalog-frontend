# LUPE — Frontend Application Technical Specification

**Version 1.0 — March 2026**
**Repository: `lupe-frontend`**

---

## 1. Overview

This document specifies the frontend application for the LUPE handmade crafts catalog. It covers the complete React application including routing, components, state management, internationalization, and the WhatsApp purchase flow. An AI coding agent should be able to build the entire frontend from this document.

| Attribute | Value |
|---|---|
| Repository name | lupe-frontend |
| Framework | React 18+ with Vite |
| Language | JavaScript (ES2022+) or TypeScript (preferred) |
| Styling | Tailwind CSS 3.4+ |
| Routing | React Router v6 |
| State Management | React Context + useReducer (cart), TanStack Query (server state) |
| i18n | react-i18next |
| HTTP Client | Axios |
| Icons | Lucide React |
| Build | Vite (produces static files served by Nginx) |

---

## 2. Project Structure

```
lupe-frontend/
├── public/
│   ├── favicon.ico
│   └── og-image.jpg        # Open Graph default image
├── src/
│   ├── main.jsx            # Entry point: mount App
│   ├── App.jsx             # Router + providers wrapper
│   ├── api/
│   │   ├── client.js       # Axios instance with baseURL + interceptors
│   │   ├── products.js     # getProducts, getProduct
│   │   ├── categories.js   # getCategories
│   │   ├── settings.js     # getSettings
│   │   └── admin.js        # login, CRUD for products/categories/settings, image upload
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx      # Logo, language toggle, cart icon w/ badge
│   │   │   ├── Footer.jsx      # Store info, copyright
│   │   │   └── Layout.jsx      # Navbar + main + Footer wrapper
│   │   ├── catalog/
│   │   │   ├── ProductCard.jsx     # Image, name, price, add-to-cart btn
│   │   │   ├── ProductGrid.jsx     # Responsive grid of ProductCards
│   │   │   ├── CategoryFilter.jsx  # Horizontal pills / sidebar filter
│   │   │   ├── SearchBar.jsx       # Debounced search input
│   │   │   └── ProductDetail.jsx   # Full product view w/ image gallery
│   │   ├── cart/
│   │   │   ├── CartDrawer.jsx      # Slide-out cart panel
│   │   │   ├── CartItem.jsx        # Single item row: image, name, qty, remove
│   │   │   ├── CartSummary.jsx     # Total + Purchase button
│   │   │   └── CartBadge.jsx       # Item count badge for Navbar
│   │   ├── admin/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── AdminLayout.jsx     # Sidebar nav + content area
│   │   │   ├── ProductForm.jsx     # Create/edit product form
│   │   │   ├── ProductTable.jsx    # Sortable table with actions
│   │   │   ├── CategoryForm.jsx
│   │   │   ├── CategoryTable.jsx
│   │   │   ├── SettingsForm.jsx
│   │   │   ├── ImageUploader.jsx   # Drag-drop + preview + sort
│   │   │   └── ProductHistory.jsx  # Timeline view of snapshots
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       ├── Spinner.jsx
│   │       ├── Toast.jsx           # Success/error notifications
│   │       └── EmptyState.jsx
│   ├── context/
│   │   ├── CartContext.jsx     # Cart state + reducer + provider
│   │   └── AuthContext.jsx     # Admin JWT token + login/logout
│   ├── hooks/
│   │   ├── useProducts.js      # TanStack Query wrapper for products
│   │   ├── useCategories.js    # TanStack Query wrapper for categories
│   │   ├── useSettings.js      # TanStack Query wrapper for settings
│   │   ├── useCart.js          # useContext(CartContext) shorthand
│   │   ├── useAuth.js          # useContext(AuthContext) shorthand
│   │   └── useDebounce.js      # Debounce hook for search input
│   ├── i18n/
│   │   ├── index.js            # i18next config
│   │   ├── es.json             # Spanish translations
│   │   └── en.json             # English translations
│   ├── pages/
│   │   ├── CatalogPage.jsx     # Main store page
│   │   ├── ProductPage.jsx     # Single product detail
│   │   ├── CartPage.jsx        # Full-page cart view (mobile fallback)
│   │   ├── AdminLoginPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProductsPage.jsx
│   │   ├── AdminProductEditPage.jsx
│   │   ├── AdminCategoriesPage.jsx
│   │   ├── AdminSettingsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── utils/
│   │   ├── whatsapp.js     # Build WhatsApp deep link
│   │   ├── formatPrice.js  # Currency formatting
│   │   └── imageUrl.js     # Construct full image URL from path
│   └── index.css           # Tailwind directives + custom globals
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

---

## 3. Environment Variables

Vite exposes environment variables prefixed with `VITE_`. Defined in `.env` files.

| Variable | Example | Description |
|---|---|---|
| VITE_API_BASE_URL | `http://localhost:8000/api/v1` | Backend API base URL |
| VITE_MEDIA_BASE_URL | `http://localhost:8000/media` | Base URL for product images |

---

## 4. Routes

All routes are defined in `App.jsx` using React Router v6. Public routes use the customer Layout component; admin routes use AdminLayout.

| Path | Page Component | Auth | Description |
|---|---|---|---|
| `/` | CatalogPage | No | Product catalog with filters, search, grid |
| `/product/:id` | ProductPage | No | Product detail with image gallery |
| `/cart` | CartPage | No | Full-page cart (mobile-friendly alternative to drawer) |
| `/admin/login` | AdminLoginPage | No | Admin login form |
| `/admin` | AdminDashboard | Yes | Dashboard with product/category counts |
| `/admin/products` | AdminProductsPage | Yes | Product list table with actions |
| `/admin/products/new` | AdminProductEditPage | Yes | Create new product form |
| `/admin/products/:id/edit` | AdminProductEditPage | Yes | Edit existing product form |
| `/admin/categories` | AdminCategoriesPage | Yes | Category management |
| `/admin/settings` | AdminSettingsPage | Yes | Store settings form |
| `*` | NotFoundPage | No | 404 page |

Admin routes (`/admin/*`) must be wrapped in a `ProtectedRoute` component that checks AuthContext for a valid token. If no token, redirect to `/admin/login`.

---

## 5. State Management

### 5.1 Server State (TanStack Query)

All API data fetching uses TanStack Query (React Query v5). This handles caching, refetching, loading states, and error states automatically.

**Query keys:**

| Key | Hook | Stale Time |
|---|---|---|
| `['products', filters]` | `useProducts(filters)` | 30 seconds |
| `['product', id]` | `useProduct(id)` | 1 minute |
| `['categories']` | `useCategories()` | 5 minutes |
| `['settings']` | `useSettings()` | 5 minutes |
| `['admin', 'products', filters]` | `useAdminProducts(filters)` | 10 seconds |
| `['admin', 'product-history', id]` | `useProductHistory(id)` | 30 seconds |

Admin mutations (create, update, delete) should invalidate the relevant query keys on success using `queryClient.invalidateQueries()`.

### 5.2 Cart State (Context + useReducer)

The cart is managed client-side only — no backend involvement. State is persisted in localStorage so it survives page refreshes.

**Cart state shape:**

```json
{
  "items": [
    {
      "productId": 15,
      "nameEs": "Canasta Tejida",
      "nameEn": "Handwoven Basket",
      "price": "25.00",
      "primaryImage": "products/15/img_001.jpg",
      "quantity": 2
    }
  ]
}
```

**Cart reducer actions:**

| Action | Payload | Behavior |
|---|---|---|
| ADD_ITEM | `{ product }` | If product already in cart, increment quantity by 1. Otherwise add with quantity 1. |
| REMOVE_ITEM | `{ productId }` | Remove item entirely from cart |
| UPDATE_QUANTITY | `{ productId, quantity }` | Set quantity to value. If quantity <= 0, remove item. |
| CLEAR_CART | (none) | Empty the cart completely |

The CartContext provider initializes state from localStorage on mount, and writes to localStorage on every state change (via a useEffect).

### 5.3 Auth State (Context)

Simple context storing the JWT token and admin username. Token is stored in localStorage.

**Auth state shape:**

```json
{
  "token": "eyJhbGci...",
  "username": "admin",
  "isAuthenticated": true
}
```

**Auth actions:**

- `login(username, password)`: call POST /admin/login, store token in state + localStorage.
- `logout()`: clear token from state + localStorage, redirect to /admin/login.

The Axios instance (`api/client.js`) uses an interceptor that reads the token from AuthContext (or localStorage as fallback) and attaches it as `Authorization: Bearer <token>` to all requests. If any response returns 401, the interceptor calls logout() automatically.

---

## 6. Internationalization (i18n)

The app supports Spanish and English using react-i18next. Language preference is persisted in localStorage.

### 6.1 Configuration (i18n/index.js)

- Default language: read from store settings API (default_language), or localStorage, or 'es' as final fallback.
- Detection order: localStorage → API default → 'es'.
- Namespace: single 'translation' namespace (flat key structure).
- Interpolation: escape disabled (React handles XSS).

### 6.2 Translation File Structure

Both `es.json` and `en.json` follow the same key structure. Keys are organized by section:

```json
{
  "nav": {
    "home": "Inicio / Home",
    "cart": "Carrito / Cart",
    "admin": "Admin"
  },
  "catalog": {
    "title": "Nuestros Productos / Our Products",
    "search_placeholder": "Buscar productos... / Search products...",
    "all_categories": "Todas / All",
    "no_results": "No se encontraron productos / No products found",
    "add_to_cart": "Agregar al carrito / Add to cart"
  },
  "cart": {
    "title": "Tu Carrito / Your Cart",
    "empty": "Tu carrito está vacío / Your cart is empty",
    "total": "Total",
    "purchase": "Comprar por WhatsApp / Purchase via WhatsApp",
    "remove": "Eliminar / Remove",
    "clear": "Vaciar carrito / Clear cart"
  },
  "product": {
    "description": "Descripción / Description",
    "category": "Categoría / Category",
    "back": "Volver al catálogo / Back to catalog"
  },
  "admin": { "..." : "..." },
  "common": {
    "save": "Guardar / Save",
    "cancel": "Cancelar / Cancel",
    "delete": "Eliminar / Delete",
    "edit": "Editar / Edit",
    "create": "Crear / Create",
    "loading": "Cargando... / Loading...",
    "error": "Algo salió mal / Something went wrong"
  }
}
```

### 6.3 Product Data Bilingual Display

Product names and descriptions come from the API in both languages (name_es, name_en, etc.). The frontend selects the correct field based on the current i18n language:

```javascript
// utils/i18nField.js
export function localizedField(obj, field, lang) {
  return obj[`${field}_${lang}`] || obj[`${field}_es`];
}

// Usage in component:
const { i18n } = useTranslation();
const name = localizedField(product, 'name', i18n.language);
```

---

## 7. WhatsApp Purchase Flow

This is the core conversion flow. When the customer clicks the purchase button, the app builds a pre-formatted message and opens WhatsApp via a deep link.

### 7.1 Message Builder (utils/whatsapp.js)

**Function signature:**

```javascript
buildWhatsAppUrl(cartItems, settings, language) => string
```

**Message template (language = 'es'):**

```
🛒 *Nuevo Pedido — LUPE*
---
2x  Canasta Tejida        $50.00
1x  Taza de Barro         $18.00
---
*Total: $68.00*

¡Gracias!
```

**Message template (language = 'en'):**

```
🛒 *New Order — LUPE*
---
2x  Handwoven Basket      $50.00
1x  Clay Mug              $18.00
---
*Total: $68.00*

Thank you!
```

### 7.2 URL Construction

```javascript
const phone = settings.whatsapp_number.replace('+', '');
const text = encodeURIComponent(message);
const url = `https://wa.me/${phone}?text=${text}`;
window.open(url, '_blank');
```

### 7.3 Flow Steps

1. Customer clicks 'Purchase via WhatsApp' button in CartDrawer or CartPage.
2. App calls `buildWhatsAppUrl()` with current cart items, store settings, and current language.
3. App opens the resulting URL in a new tab/window.
4. App shows a confirmation Toast: 'Order sent! Check your WhatsApp.' / '¡Pedido enviado! Revisa tu WhatsApp.'
5. App does NOT clear the cart automatically (customer might need to re-send if WhatsApp didn't open). Cart has a separate 'Clear cart' button.

### 7.4 Fallback: Copy to Clipboard

If the customer is on a device without WhatsApp (desktop browser), the wa.me link may not work. Provide a secondary button or fallback: 'Copy order to clipboard' which copies the raw message text. Show a Toast confirming the copy succeeded.

---

## 8. Key Component Specifications

### 8.1 ProductCard

| Prop | Type | Description |
|---|---|---|
| product | object | Product data from API |

**Behavior:**

- Displays primary_image (or a placeholder if no images), localized name, and formatted price.
- Click on card navigates to `/product/:id`.
- Has an 'Add to cart' button that dispatches ADD_ITEM to CartContext.
- If item already in cart, show 'In cart (2)' with quantity instead of 'Add to cart'.
- Image uses lazy loading (`loading='lazy'`).
- Aspect ratio: 1:1 square crop for grid consistency.

### 8.2 CartDrawer

**Behavior:**

- Slide-in panel from the right side (overlay on mobile, side panel on desktop).
- Triggered by clicking the cart icon in Navbar.
- Shows list of CartItems, CartSummary at bottom.
- Close button (X) and click-outside-to-close.
- If cart is empty, show EmptyState with link to catalog.
- Body scroll is locked when drawer is open.

### 8.3 ImageUploader (Admin)

**Behavior:**

- Drag-and-drop zone + click-to-browse file picker.
- Accept: .jpg, .jpeg, .png, .webp only.
- Show thumbnail previews of selected files before upload.
- Display existing images (from API) with option to reorder (drag) and delete.
- Upload triggers POST /admin/products/:id/images with FormData.
- Delete triggers DELETE /admin/images/:id with confirmation modal.
- Max 10 images per product (enforce client-side).

### 8.4 ProductHistory (Admin)

**Behavior:**

- Displayed in the AdminProductEditPage below the product form.
- Fetches GET /admin/products/:id/history.
- Renders as a vertical timeline (newest at top).
- Each entry shows: action badge (Created/Updated/Deleted), timestamp, changed_by.
- Expandable: click to reveal the full JSON snapshot (formatted nicely, not raw JSON).
- Snapshot display shows fields side by side for comparison with current values (optional enhancement).

---

## 9. API Client (api/client.js)

Centralized Axios instance that all API modules import.

```javascript
// api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor: attach JWT if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('lupe_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lupe_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default client;
```

---

## 10. Styling & Design System

### 10.1 Tailwind Configuration

Extend the default Tailwind theme with LUPE brand colors and custom values:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lupe: {
          50:  '#fdf8f0',
          100: '#f9edd9',
          200: '#f2d7b0',
          300: '#e8b97e',
          400: '#de944a',
          500: '#d47a2e',   // Primary brand
          600: '#c26124',
          700: '#a14a20',
          800: '#833b20',
          900: '#6b331d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],  // Headings
      },
    },
  },
  plugins: [],
};
```

### 10.2 Design Principles

- Mobile-first: design for 375px width first, scale up.
- Warm, artisanal aesthetic: earth tones (browns, ambers, creams), rounded corners, soft shadows.
- Product images are the hero: generous sizing, no visual clutter competing with them.
- Max content width: 1280px centered (`mx-auto`).
- Grid: 1 column on mobile, 2 on tablet (md:), 3–4 on desktop (lg:).
- Typography: Inter for body, Playfair Display for headings (loaded via Google Fonts CDN).
- Animations: subtle transitions (150ms–300ms) for hover states, cart drawer slide, and toast notifications. No flashy animations.

### 10.3 Responsive Breakpoints (Tailwind defaults)

| Breakpoint | Width | Catalog Columns | Layout Notes |
|---|---|---|---|
| Default (mobile) | < 640px | 1 column | Stacked layout, hamburger nav, full-width cards |
| sm | ≥ 640px | 2 columns | Side-by-side cards |
| md | ≥ 768px | 2 columns | Category filter as horizontal pills above grid |
| lg | ≥ 1024px | 3 columns | Sidebar category filter, wider cards |
| xl | ≥ 1280px | 4 columns | Max width container, most spacious layout |

---

## 11. Image URL Construction

All product image paths from the API are relative (e.g., `'products/15/img_abc.jpg'`). The frontend constructs full URLs using the VITE_MEDIA_BASE_URL:

```javascript
// utils/imageUrl.js
export function imageUrl(path) {
  if (!path) return '/placeholder.jpg';
  return `${import.meta.env.VITE_MEDIA_BASE_URL}/${path}`;
}
```

A placeholder image (`public/placeholder.jpg`) must be included in the repository for products without images. It should be a neutral, branded placeholder (e.g., LUPE logo on a cream background, 400x400px).

---

## 12. SEO & Meta Tags

- Use react-helmet-async to set per-page `<title>` and `<meta>` tags.
- Catalog page: 'LUPE — Handmade Crafts' / 'LUPE — Artesanías Hechas a Mano'.
- Product detail page: 'Product Name | LUPE' with description meta and og:image set to primary product image.
- Default og:image points to `public/og-image.jpg` (a branded social share image).
- Add a `<meta name='robots' content='noindex'>` on all `/admin/*` routes.

---

## 13. NPM Dependencies

| Package | Purpose |
|---|---|
| react, react-dom | Core React |
| react-router-dom | Client-side routing |
| @tanstack/react-query | Server state management (caching, fetching) |
| axios | HTTP client |
| react-i18next, i18next, i18next-browser-languagedetector | Internationalization |
| react-helmet-async | SEO meta tags |
| lucide-react | Icon library |
| react-hot-toast | Toast notifications |
| tailwindcss, postcss, autoprefixer | Styling (dev deps) |
| @vitejs/plugin-react | Vite React plugin (dev dep) |

---

## 14. Build & Deployment

Vite produces a static build (HTML + JS + CSS) that is served by Nginx in production.

**Build command:**

```bash
npm run build   # outputs to dist/
```

**Nginx config snippet (production):**

```nginx
server {
    listen 80;
    server_name lupe.example.com;

    # Frontend (SPA)
    location / {
        root /var/www/lupe/dist;
        try_files $uri /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:8000;
    }

    # Media files (served by Nginx, not API)
    location /media/ {
        alias /var/www/lupe/media/;
    }
}
```

**Development:**

```bash
npm run dev     # Vite dev server on http://localhost:5173
                # API proxy configured in vite.config.js
```

**vite.config.js proxy (dev only):**

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/media': 'http://localhost:8000',
    },
  },
});
```

---

## 15. Implementation Checklist

Implement in this order:

1. Scaffold project with Vite + React template: `npm create vite@latest lupe-frontend -- --template react`.
2. Install all dependencies from Section 13. Configure Tailwind (`tailwind.config.js`, `postcss.config.js`, `index.css` directives).
3. Set up environment variables (`.env.example` and `.env.local` with VITE_API_BASE_URL and VITE_MEDIA_BASE_URL).
4. Create the Axios client (`api/client.js`) with interceptors (Section 9).
5. Set up i18n (`i18n/index.js`, `es.json`, `en.json`) with initial translation keys from Section 6.
6. Create CartContext with reducer, localStorage persistence, and provider (Section 5.2).
7. Create AuthContext with login/logout and localStorage token (Section 5.3).
8. Create Layout components: Navbar (with language toggle + cart badge), Footer, Layout wrapper.
9. Set up React Router in `App.jsx` with all routes from Section 4. Add ProtectedRoute for admin.
10. Build CatalogPage: ProductGrid + ProductCard + CategoryFilter + SearchBar. Wire up useProducts and useCategories hooks.
11. Build ProductPage: product detail with image gallery, add-to-cart button.
12. Build CartDrawer and CartPage: item list, quantity controls, total, WhatsApp purchase button.
13. Implement WhatsApp flow (`utils/whatsapp.js`) as specified in Section 7.
14. Build AdminLoginPage with LoginForm.
15. Build AdminProductsPage: table with inline actions (edit, delete).
16. Build AdminProductEditPage: form with all product fields + ImageUploader + ProductHistory.
17. Build AdminCategoriesPage: table + inline form or modal for create/edit.
18. Build AdminSettingsPage: form for store settings.
19. Add SEO meta tags with react-helmet-async (Section 12).
20. Create `placeholder.jpg` and `og-image.jpg` in `public/`.
21. Test all flows end-to-end: browse → add to cart → purchase → WhatsApp. Admin: login → CRUD products → upload images → view history.
22. Write `README.md` with setup and development instructions.

---

## 16. Notes for AI Coding Agents

- Every decision has been made — do not introduce new libraries, CSS frameworks, or state management patterns not listed here.
- Use functional components with hooks exclusively. No class components.
- All components must support both languages. Never hardcode Spanish or English strings — always use `t()` from `useTranslation()`.
- Product data from the API has both `_es` and `_en` fields. Use the `localizedField()` helper (Section 6.3) to select the right one based on current language.
- Cart state lives in CartContext + localStorage only. There is no cart API endpoint.
- The WhatsApp message is generated client-side (Section 7). There is no 'order' entity in the backend. The message IS the order.
- Image URLs are always constructed via the `imageUrl()` helper (Section 11). Never concatenate URLs manually in components.
- Admin routes must be behind ProtectedRoute. If no token, redirect to `/admin/login`.
- Use TanStack Query for ALL API data fetching. Do not use `useEffect` + `useState` for API calls.
- Tailwind only — do not create `.css` files per component. Exception: `index.css` for Tailwind directives and Google Fonts import.
- Forms use controlled inputs (`value` + `onChange`). No uncontrolled refs for form state.
- Every user-facing action (save, delete, error) must show a Toast notification.
