# PATCH 1 CHECKLIST - NX ROOT STRUCTURE (WEB APP MOVE)

- [x] Create `apps/web` directory
- [x] Move `app/` into `apps/web/app/`
- [x] Move `public/` into `apps/web/public/`
- [x] Move `next.config.mjs` into `apps/web/next.config.mjs`
- [x] Update `package.json` Next scripts to target `apps/web`
- [x] Update `tailwind.config.js` content globs for `apps/web/app`
- [x] Ensure `npm run dev` starts successfully
- [x] Manually verify critical routes render (home, collections, product detail, cart)
- [x] Update this checklist status and summarize in `PATCH1_SUMMARY.md`
