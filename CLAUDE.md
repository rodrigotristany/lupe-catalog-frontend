# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## Environment Variables

Copy `.env.example` to `.env.local` and set:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_MEDIA_BASE_URL=http://localhost:8000/media
```

## Architecture

**Stack:** React 18 + Vite, TypeScript-compatible JSX, Tailwind CSS, React Router v6, TanStack Query v5, react-i18next, Axios, react-hot-toast, Lucide React.

**State split:**
- Server state → TanStack Query (hooks in `src/hooks/`). Never use `useEffect` + `useState` for API calls.
- Cart → `CartContext` + `useReducer` + localStorage (no backend endpoint for cart).
- Auth → `AuthContext` + localStorage JWT token. The Axios client in `src/api/client.js` auto-attaches the token and redirects to `/admin/login` on 401.

**i18n:** All user-facing strings go through `t()` from `useTranslation()`. Product fields from the API come in `_es` / `_en` variants — always use `localizedField(obj, field, lang)` from `src/utils/i18nField.js` to pick the right one.

**Image URLs:** Always construct via `imageUrl(path)` from `src/utils/imageUrl.js`. Never concatenate VITE_MEDIA_BASE_URL manually in components.

**WhatsApp flow:** `buildWhatsAppUrl()` in `src/utils/whatsapp.js` builds the purchase message and `wa.me` URL client-side. There is no order API — the message IS the order.

**Admin protection:** All `/admin/*` routes (except `/admin/login`) are wrapped in `ProtectedRoute` in `App.jsx` which redirects to `/admin/login` if no token.

**Routing:** Public routes use `<Layout>` (Navbar + Footer, uses `<Outlet>`). Admin routes use `<AdminLayout>` (sidebar + `<Outlet>`).

**Styling:** Tailwind only — no per-component CSS files. Brand color scale is `lupe-50` through `lupe-900` (defined in `tailwind.config.js`). Body font: Inter; headings: Playfair Display (loaded via Google Fonts in `index.html`).

## Key Conventions

- Functional components + hooks only.
- Controlled inputs (`value` + `onChange`) for all forms.
- Every user-facing action (save, delete, error) shows a `react-hot-toast` notification.
- Admin mutations invalidate relevant TanStack Query keys on success via `queryClient.invalidateQueries()`.
- Max 10 images per product (enforced client-side in `ImageUploader`).
