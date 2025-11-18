# PATCH 1 SUMMARY - NX ROOT STRUCTURE (WEB APP MOVE)

## Scope

This patch introduces the first step toward an Nx-at-root monorepo by relocating the Next.js web app into `apps/web` while keeping behavior identical.

## Changes

- Created `apps/web` directory as the home for the web frontend.
- Moved the Next.js `app/` directory to `apps/web/app/`.
- Moved `public/` assets to `apps/web/public/`.
- Relocated `next.config.mjs` to `apps/web/next.config.mjs` so the app is self-contained.
- Updated `package.json` scripts (`dev`, `build`, `start`, `lint`) to run Next against `apps/web`.
- Updated `tailwind.config.js` content globs to scan `apps/web/app` instead of the old root `app` directory.
- Added `apps/web/tsconfig.json` that extends the root `tsconfig.json` for consistent TypeScript settings and `@/` path behavior.

## Verification

- [x] `npm run dev` starts without errors.
- [x] `npm run build` for `apps/web` completes successfully.
- [x] Key storefront pages load: `/`, `/collections`, `/products/[id]`, `/cart`.
- [x] Styles and Tailwind classes render correctly after the content glob change.

## Notes

This patch is intentionally minimal and only restructures the web app location and configuration. Shared code (`src/`, `components/`, `lib/`) and the mobile Nx workspace remain in their original locations and will be addressed in subsequent patches.

Shopify and Thirdweb integrations now degrade gracefully during build when environment variables are not present: the `ShopifyStorefront` client disables itself with warnings instead of throwing, and the home page dynamically imports the advanced Shopify service via the `@/lib/shopify-service` alias only when runtime configuration is available.
