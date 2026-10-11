# Verification features: demo now, production next

| Feature | Demo today | Production version |
|---|---|---|
| Google sign-in / sign-up | Asks for an email | Supabase Auth with Google OAuth; server session (JWT) |
| Device biometric (passkey) | WebAuthn created and checked in the browser | Verify on the server with SimpleWebAuthn (`backend/app/api/onboarding/webauthn`), store credentials per user |
| Organization email proof | Typed in | Send a one-time code to that email and require it before saving |
| Profession change | Email draft to the organization and admin, applied by hand | Approval workflow: both approvers confirm by link, then the server applies it and logs it |
| Agreement letter + QR | QR holds the page link and a short record code | QR points to a `/verify?code=` page that shows the real record |
| Scan of stamped letter | Photo compressed and kept on the device | Upload to private storage, decode the QR, queue for admin review, then mark verified |
| e-Notary anchoring | Not connected | `anchorHash()` in `backend/lib/server.ts` with your provider |
| Staff attendance records | Local, one record per session with attempts | Server-enforced one-record rule, monthly pending limit and timestamps |
| GPS check | Browser location against saved branch coordinates | Server checks accuracy and time; flag mock-location signs; admins own branch coordinates |
| 5-minute recheck | Runs only while the page is open | Background job or push check that upgrades pending to approved |
| Pay, rank, stars | Calculated on screen | Cycle job on the server (28-day cycles, day-28 pay, pro-rata for joiners) |
| Speak up | Shows a reference only | Anonymous submission endpoint, no IP logging, restricted reader roles |
| Audit and abuse limits | None | Audit log for every approval, rate limits, row-level security |
| Staff record in TMWS | "Save record to TMWS" builds a record (identity, onboarding, agreement hash, scan status, attendance summary) and saves it on the device; it can be downloaded as JSON | `POST /api/staff/record` (`backend/app/api/staff/record/route.ts`) upserts `staff_records`. The server sets status; client claims are stored as `claimed` and never trusted. Auto-sync runs after changes |
| Public verify link | The QR opens `#verify=<code>` and a result screen checks this device only | `GET /api/verify?code=` (`backend/app/api/verify/route.ts`) returns name, profession, branch and status for `verified` records only; add a rate limit |
| Verification status | Shown on the Verification page: 8 steps, two of which need the server (organization email, admin review) | Admin review sets `staff_records.status = verified` and writes `audit_log` |
| Interview result | Category and level saved with the onboarding signature | HR enters them in an admin screen; stored on `staff_records` |
| Handbook | Static page in the app | Same text in `docs/STAFF-HANDBOOK.md`; clauses are edited in `lib/contract.ts` |

## Staff data flow (production)

1. Sign in with Supabase Auth (Google). The front end sends the access token with `getToken()` as a Bearer token.
2. Registration calls `POST /api/staff/record` -> a `staff_records` row exists with status `registered`.
3. Signing calls `/api/onboarding/webauthn/options` and `/verify` -> the row gets `biometric_contract_hash`, `record_code` and the e-notary ID.
4. Scanning the stamped letter calls `POST /api/staff/record` with the photo -> stored in the private `agreement-scans` bucket, status `pending_review`.
5. An admin approves -> status `verified`; attendance, rank and pay now count.
6. Attendance moves to its own server endpoint that writes `attendance` rows (unique per staff, date and session); the browser summary is only a copy.

