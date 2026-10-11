# TMWS: The Multiverse Working System (template)

A reusable front end for workforce, attendance, rank, pay and verification. It runs as plain static files, so you can host it on GitHub Pages (HTTPS is required for biometrics, GPS and the camera).

## Use it
1. On GitHub, mark this repo as a **template repository**, then "Use this template" for each new site.
2. Edit `config.js` (brand, branches, session windows, geofence, limits, admin email).
3. Replace `assets/logo.jpg`. Open `index.html` through any web server.

## Structure
- `index.html` the app (lock screen, registration, letter, attendance, pay, rank, loans, settings, Auroa AI)
- `config.js` per-site settings
- `apps/` the embedded Education, Calendar and Rankings pages
- `backend/` Next.js + Supabase starter (WebAuthn signing, contract hash, e-Notary hook)
- `docs/VERIFICATION-ROADMAP.md` every verification feature, demo vs production

## Demo mode (current)
Sign-in, passkeys, attendance, scans and requests are stored in the browser only. Auroa AI full answers work only inside Claude; elsewhere it answers from built-in notes and gives search links. Do not use demo mode for real pay or legal records.
