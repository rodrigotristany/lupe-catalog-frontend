# Change Request: Sales Module — Frontend

**Date:** 2026-06-13
**Author:** Rodrigo Tristany
**Status:** Pending Implementation
**Backend spec:** `../lupe-catalog-backend/specs/003_LUPE_Sales.md`

---

## Overview

This document specifies the frontend changes needed to expose the Sales module in the admin dashboard. The work adds two admin sections — a sales list with filters and a sale creation form — plus a payment methods manager in Settings. It reuses existing patterns: TanStack Query hooks, Axios API wrappers, controlled forms, `useMutation` + `queryClient.invalidateQueries`, and `react-hot-toast` notifications.

---

## 1. API Layer — `src/api/admin.js`

Add two functions alongside the existing ones:

```js
// Sales
export async function getSales(filters = {}) {
  const { data } = await client.get('/admin/sales', { params: filters });
  return data;
}

export async function createSale(payload) {
  const { data } = await client.post('/admin/sales', payload);
  return data;
}
```

The settings endpoint (`src/api/settings.js` → `GET /settings`) already returns `payment_methods` once the backend migration is applied. No change needed there.

---

## 2. Hooks — `src/hooks/`

### 2.1 New file: `src/hooks/useSales.js`

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSales, createSale } from '../api/admin';

export function useSales(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'sales', filters],
    queryFn: () => getSales(filters),
    staleTime: 10_000,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'sales'] }),
  });
}
```

---

## 3. Router & Sidebar Changes

### 3.1 `src/App.jsx`

Import the two new pages and add their routes inside the protected admin block:

```jsx
import { AdminSalesPage } from './pages/AdminSalesPage';
import { AdminSaleNewPage } from './pages/AdminSaleNewPage';

// Inside the protected <Route path="/admin"> block:
<Route path="sales" element={<AdminSalesPage />} />
<Route path="sales/new" element={<AdminSaleNewPage />} />
```

### 3.2 `src/components/admin/AdminLayout.jsx`

Add a "Ventas" nav item. Import `ShoppingBag` from `lucide-react` and insert before `settings`:

```jsx
import { LayoutDashboard, Package, Tag, ShoppingBag, Settings, LogOut } from 'lucide-react';

const navItems = [
  { to: '/admin',            icon: LayoutDashboard, labelKey: 'admin.dashboard',  end: true },
  { to: '/admin/products',   icon: Package,         labelKey: 'admin.products' },
  { to: '/admin/categories', icon: Tag,             labelKey: 'admin.categories' },
  { to: '/admin/sales',      icon: ShoppingBag,     labelKey: 'admin.sales' },
  { to: '/admin/settings',   icon: Settings,        labelKey: 'admin.settings' },
];
```

---

## 4. Settings — Payment Methods Manager

### 4.1 `src/components/admin/SettingsForm.jsx`

Add a `payment_methods` section below the existing fields. The section lets the admin add and remove string entries (each a payment method label).

**State:** extend the existing `form` state with `payment_methods: settings?.payment_methods ?? []`.

**UI block** (inside the `<form>`):

```
┌─ Métodos de pago ────────────────────────────────────────────┐
│  [Efectivo          ] [×]                                     │
│  [Transferencia     ] [×]                                     │
│  [Mercado Pago      ] [×]                                     │
│  [+ Agregar método]                                           │
└──────────────────────────────────────────────────────────────┘
```

- Each entry is a controlled `<input type="text" />` with a remove button (`×`).
- "Agregar método" appends an empty string to the array; the admin types the label in the new input.
- The existing `mutation.mutate(form)` already sends `payment_methods` once the field is in form state — no separate save action.
- Empty strings and duplicates show an inline validation error (`t('admin.payment_method_invalid')`) and disable the save button.

### 4.2 Updated: `src/hooks/useSettings.js`

No changes needed. The hook already fetches all settings fields.

---

## 5. New Page: Sales List — `src/pages/AdminSalesPage.jsx`

### 5.1 Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  Ventas                                      [+ Nueva venta]     │
├────────────────┬─────────────────────────────────────────────────┤
│  FILTROS       │  TABLA DE VENTAS                                 │
│                │                                                  │
│  Método pago   │  Fecha        Método    Productos  Total         │
│  [select]      │  ─────────────────────────────────────────       │
│                │  13/06/2026   Efectivo  2 items    $68.00        │
│  Categoría     │  12/06/2026   Transf.   1 item     $25.00        │
│  [select]      │  ...                                             │
│                │                                                  │
│  Desde         │  [← Anterior]  Página 1 / 3  [Siguiente →]      │
│  [date]        │                                                  │
│  Hasta         │                                                  │
│  [date]        │                                                  │
│                │                                                  │
│  Total mín     │                                                  │
│  [number]      │                                                  │
│  Total máx     │                                                  │
│  [number]      │                                                  │
│                │                                                  │
│  Orden         │                                                  │
│  [Más reciente ▾]                                                │
│                │                                                  │
│  [Limpiar]     │                                                  │
└────────────────┴─────────────────────────────────────────────────┘
```

### 5.2 Filter State

All filters live in local state. Changing any filter resets `page` to 1. The `order` filter is a `<select>` with options `desc` (Más reciente) and `asc` (Más antiguo).

```js
const [filters, setFilters] = useState({
  payment_method: '',
  category_id: '',
  date_from: '',
  date_to: '',
  total_min: '',
  total_max: '',
  order: 'desc',
  page: 1,
  per_page: 20,
});
```

Build the query params object before passing to `useSales` — omit keys whose value is `''` or `null` so the API receives only active filters.

### 5.3 Data Fetching

```js
const { data, isLoading } = useSales(activeFilters);
const { data: categories = [] } = useCategories();
const { data: settings } = useSettings();

const list = data?.items ?? [];
const pagination = { page: data?.page, pages: data?.pages, total: data?.total };
```

`payment_method` options come from `settings?.payment_methods ?? []`. `category_id` options come from `useCategories()` (already used in `AdminProductsPage`).

### 5.4 Sales Table — `src/components/admin/SalesTable.jsx`

New component. Renders a table with columns:

| Column | Content |
|---|---|
| Fecha | `created_at` formatted as `dd/MM/yyyy HH:mm` |
| Método de pago | `payment_method` label |
| Productos | count of `items` (e.g. "2 productos") |
| Total | `$` + `total` formatted to 2 decimal places |

Each row is expandable (click to toggle) revealing the line items sub-table:

| Sub-column | Content |
|---|---|
| Producto | `product_name_es` |
| Categoría | `category_name_es` or `—` if null |
| Precio unit. | `$` + `price` |
| Cantidad | `quantity` |
| Subtotal | `$` + `subtotal` |

The expand state is local to the component (`useState<number | null>(null)` for the expanded row ID).

Props: `sales: Sale[], pagination, onPageChange`.

### 5.5 Full Page Component

```jsx
export function AdminSalesPage() {
  // filter state, activeFilters derivation, useSales, useCategories, useSettings
  // render: header + "Nueva venta" button, filter sidebar, SalesTable + pagination
}
```

- Empty state (no sales, no active filters): `<EmptyState>` with a "Registrar primera venta" CTA.
- Empty state (filters active, no results): plain message `t('admin.no_results')`.
- Loading: `<FullPageSpinner />`.

---

## 6. New Page: Sale Creation — `src/pages/AdminSaleNewPage.jsx`

### 6.1 Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Ventas            Nueva venta                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Método de pago *                                                │
│  [Seleccionar método ▾]                                         │
│                                                                  │
│  Productos                                                       │
│  ┌────────────────────┬──────────┬──────────┬───────────────┐   │
│  │ Producto           │ Precio   │ Cantidad │ Subtotal      │   │
│  ├────────────────────┼──────────┼──────────┼───────────────┤   │
│  │ [Buscar producto…] │ $25.00   │ [2    ]  │ $50.00    [×] │   │
│  │ [Buscar producto…] │ $18.00   │ [1    ]  │ $18.00    [×] │   │
│  └────────────────────┴──────────┴──────────┴───────────────┘   │
│  [+ Agregar producto]                                            │
│                                                                  │
│                              Total: $68.00                       │
│                                                                  │
│  [Cancelar]                              [Registrar venta]       │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 Form State

```js
const [paymentMethod, setPaymentMethod] = useState('');
const [items, setItems] = useState([
  { key: 0, product: null, quantity: 1 }
]);
```

Each item in `items` holds:
- `key` — stable React key (increment on add)
- `product` — the selected product object from the API (`{ id, name_es, name_en, price, category }`) or `null`
- `quantity` — integer, controlled input

### 6.3 Product Search Input — `src/components/admin/ProductSearchInput.jsx`

New reusable component. Renders a text input. While the user types (debounced 300 ms), it calls `GET /admin/products?search=<text>&per_page=20` via `useAdminProducts`. Results appear in a dropdown list below the input. Selecting a result calls `onSelect(product)` and shows the product name in the field.

Props:
- `value: Product | null` — the currently selected product
- `onSelect: (product) => void`
- `excludeIds: number[]` — product IDs already in other rows (to show a disabled/greyed style in the dropdown)

Keyboard: `Escape` closes the dropdown, `Enter` selects the highlighted item, arrow keys navigate.

Displays: `product.name_es` in the input field once selected. Dropdown rows show `name_es` + price.

### 6.4 Line Item Rows

Each row in the items array renders:
- `<ProductSearchInput>` with `excludeIds` set to IDs of all other selected products
- Price display (read-only): `$` + `product.price` or `—` if no product selected
- `<input type="number" min="1">` for quantity (controlled)
- Subtotal display (computed client-side): `product.price * quantity` or `—`
- Remove button (`×`) — disabled if only one row remains

"Agregar producto" appends a new blank item to `items`.

### 6.5 Computed Total

Displayed below the items table:

```js
const total = items.reduce((sum, item) => {
  if (!item.product) return sum;
  return sum + item.product.price * item.quantity;
}, 0);
```

Formatted as `$` + `total.toFixed(2)`.

### 6.6 Submission

On submit:

1. Client-side validation:
   - `paymentMethod` must be non-empty.
   - All items must have a product selected and `quantity >= 1`.
   - At least one item required (guaranteed by UI since minimum one row always present).
2. Build payload:
   ```js
   { payment_method: paymentMethod, items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })) }
   ```
3. Call `useCreateSale().mutate(payload)`.
4. On success: `toast.success(t('admin.created'))` + `navigate('/admin/sales')`.
5. On error:
   - `400` with a message mentioning `payment_method`: `toast.error(t('admin.sale_invalid_payment_method'))`.
   - `404` mentioning a product: `toast.error(t('admin.sale_product_not_found'))`.
   - Any other error: `toast.error(t('common.error'))`.

"Cancelar" navigates back to `/admin/sales` without submitting.

---

## 7. i18n Keys

### `src/i18n/es.json` — additions inside the `"admin"` block

```json
{
  "admin": {
    "sales": "Ventas",
    "new_sale": "Nueva venta",
    "payment_method": "Método de pago",
    "payment_methods": "Métodos de pago",
    "add_payment_method": "Agregar método",
    "payment_method_invalid": "Valor inválido o duplicado",
    "select_payment_method": "Seleccionar método",
    "add_product": "Agregar producto",
    "search_product": "Buscar producto…",
    "unit_price": "Precio unit.",
    "quantity": "Cantidad",
    "subtotal": "Subtotal",
    "sale_total": "Total",
    "register_sale": "Registrar venta",
    "sale_invalid_payment_method": "Método de pago no válido",
    "sale_product_not_found": "Uno de los productos no fue encontrado",
    "date_from": "Desde",
    "date_to": "Hasta",
    "total_min": "Total mínimo",
    "total_max": "Total máximo",
    "order_desc": "Más reciente",
    "order_asc": "Más antiguo",
    "items_count_one": "1 producto",
    "items_count_other": "{{count}} productos",
    "clear_filters": "Limpiar filtros"
  }
}
```

### `src/i18n/en.json` — mirror additions inside the `"admin"` block

```json
{
  "admin": {
    "sales": "Sales",
    "new_sale": "New sale",
    "payment_method": "Payment method",
    "payment_methods": "Payment methods",
    "add_payment_method": "Add method",
    "payment_method_invalid": "Invalid or duplicate value",
    "select_payment_method": "Select method",
    "add_product": "Add product",
    "search_product": "Search product…",
    "unit_price": "Unit price",
    "quantity": "Quantity",
    "subtotal": "Subtotal",
    "sale_total": "Total",
    "register_sale": "Register sale",
    "sale_invalid_payment_method": "Invalid payment method",
    "sale_product_not_found": "One of the products was not found",
    "date_from": "From",
    "date_to": "To",
    "total_min": "Min total",
    "total_max": "Max total",
    "order_desc": "Newest first",
    "order_asc": "Oldest first",
    "items_count_one": "1 product",
    "items_count_other": "{{count}} products",
    "clear_filters": "Clear filters"
  }
}
```

---

## 8. Affected Files Summary

| File | Change |
|---|---|
| `src/api/admin.js` | Add `getSales`, `createSale` |
| `src/hooks/useSales.js` | New — `useSales`, `useCreateSale` |
| `src/App.jsx` | Add routes for `/admin/sales` and `/admin/sales/new` |
| `src/components/admin/AdminLayout.jsx` | Add "Ventas" nav item with `ShoppingBag` icon |
| `src/components/admin/SettingsForm.jsx` | Add payment methods list editor |
| `src/pages/AdminSalesPage.jsx` | New — sales list with filters, SalesTable, pagination |
| `src/pages/AdminSaleNewPage.jsx` | New — sale creation form |
| `src/components/admin/SalesTable.jsx` | New — expandable table for the sales list |
| `src/components/admin/ProductSearchInput.jsx` | New — debounced product autocomplete input |
| `src/i18n/es.json` | Add sales and payment method keys |
| `src/i18n/en.json` | Mirror keys in English |
