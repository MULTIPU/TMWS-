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
