# TMWS: The Multiverse Working System (template)

A reusable front end for workforce, attendance, rank, pay and verification. It runs as plain static files, so you can host it on GitHub Pages (HTTPS is required for biometrics, GPS and the camera).

## Use it
1. On GitHub, mark this repo as a **template repository**, then "Use this template" for each new site.
2. Edit `config.js` (brand, `siteUrl`, `hubUrl`, branches, session windows, geofence, limits, admin email).
3. Replace `assets/logo.jpg`. Open `index.html` through any web server.

## Structure
- `index.html` the app (lock screen, registration, letter, attendance, pay, rank, loans, settings, Auroa AI)
- `config.js` per-site settings
- `apps/` the embedded Education, Calendar and Rankings pages
- `backend/` Next.js + Supabase starter: WebAuthn signing, contract hash, e-Notary hook, staff record API (`/api/staff/record`), public verify API (`/api/verify`), `supabase/schema.sql`
- `docs/STAFF-HANDBOOK.md` the goal, staff journey, incentives, rules and what is stored about each person
- `docs/VERIFICATION-ROADMAP.md` every verification feature, demo vs production

## Demo mode (current)
Sign-in, passkeys, attendance, scans and requests are stored in the browser only. Auroa AI full answers work only inside Claude; elsewhere it answers from built-in notes and gives search links. Do not use demo mode for real pay or legal records.

## Staff verification and records
Staff sign in, register, sign the agreement with their device biometric, scan the stamped letter and log attendance. The **Verification** page shows which steps are done and builds the person's TMWS record; the **Handbook** page lists the rules and incentives. Anyone can check a letter by scanning its QR (`#verify=<code>`).
To store records on a server, set `recordEndpoint`, `verifyEndpoint` and `getToken` in `config.js` and deploy `backend/` (see the roadmap). Until then, records stay on the device and can be downloaded as JSON.

## Links
- Live site: https://multipu.github.io/TMWS-/
- Set `hubUrl` in `config.js` to show a MultiPU Hub link in the app.

