# TMWS Staff Handbook

For everyone who works with the company: your incentives, your rules, and how you are verified.
This is the written version of the **Handbook** and **Verification** pages in the TMWS app.

## 1. Goal and inspiration

TMWS, **The Multiverse Working System**, is a *Global Performance Ecosystem*. Its goal is a workplace
where fairness is visible: the work people do, the rank they earn, the pay they receive and the safety
nets around them are all measured by the same rules, and everyone can read those rules.

Most workplaces keep attendance in one register, pay in another, promotions in someone's memory and
promises in a drawer. Workers cannot see how effort becomes reward, and managers cannot easily prove they
were fair. TMWS puts effort, reward, accountability and protection in one place, and puts a verified
record behind every person.

## 2. The staff journey and the record it builds

| # | Step | What you do | What is stored in your TMWS record |
|---|---|---|---|
| 1 | Sign in | Continue with Google | Email |
| 2 | Register | Name, profession, organization email, branch; create a device passkey | Staff ID (TM######), identity fields, passkey credential ID |
| 3 | Orientation | Five modules: mission and values; 13-month, 28-day calendar and weighted attendance; housing; loans; target escalation | Completion time |
| 4 | Interview result | HR sets category and delegation level (1 to 10) | Category, level |
| 5 | Agreement | Accept five clauses, type your name, sign with fingerprint or face | Agreement version, SHA-256 hash, signing time, credential, e-notary ID |
| 6 | Stamp and scan | Print the letter, sign it, stamp it, scan it | Scan photo (private storage), scan time |
| 7 | Verification | Organization email code, then admin review matches the letter QR to your record | Status: `verified` |
| 8 | Daily attendance | Session sign-in with biometric and GPS | Date, session, branch, times, GPS result, attempts |
| 9 | Cycle close | Day 28 pay; verified days become ranks | Verified days, rank, targets missed |

**Statuses:** `registered` (account made) → `pending_review` (letter scanned) → `verified` (admin approved).
`rejected` and `suspended` stop attendance, rank and pay from counting. Attendance only counts once you are verified.

**Privacy.** Your fingerprint or face never leaves your device; TMWS keeps only the passkey credential ID and
a signed hash. The stamped-letter photo is kept in private storage and read only by authorised reviewers.
The public check (QR or code) shows only name, profession, branch and "verified". It never shows email,
staff ID, pay, attendance or the scan. Speak up reports carry no user ID and no IP address.

**Who decides what.** Your browser reports facts. The **server** decides status, rank and pay.

## 3. Incentives

- **Rank.** Every 30 verified present days earns one rank, up to 600. Every 100 ranks adds a star.
- **Rank bonus.** ₦5,000 per rank, rising 30% every 20 ranks. Loan deductions never touch the bonus.
- **Weighted attendance.** Monday and Friday count 2, Tuesday to Thursday count 1, weekends are not working days.
  A 28-day cycle is therefore 28 credits. There are 13 cycles a year.
- **Pay.** Everyone is paid together on day 28. Joiners receive a pro-rata share of their first cycle.
- **Internal loans** (maximum cash = percent × base × months ÷ (1 + rate)):
  Emergency Help 50% of base, up to 12 months, no interest; Abundant 65%, 24 or 60 months, 10% fixed;
  Senior Housing 70%, 60 or 120 months, 10% fixed.
- **Housing.** Company housing costs ₦5,000 (junior), ₦15,000 (medium) or ₦30,000 (senior) a month. If you arrange
  your own, escrow pays ₦50,000, ₦150,000 or ₦300,000 every 10 cycles. A 50-50 swap averages two tiers.
- **Career milestones.** Each sector has a ladder by years of service (Education: a rod every 5 years to Year 25,
  Advisor staff after Year 30; lecturers earn a rod at Year 2 and the Premier Rod at Year 10).
- **Protection.** A 3-month death benefit, and Speak up with no retaliation.

## 4. Rules and regulation

- **Sessions.** Morning 07:00 to 11:59; afternoon or evening 12:00 to 18:00.
- **Location.** Within 150 m of your branch is *Approved*. Otherwise *Pending* (up to 3 a month) until you are at the branch; it is rechecked every 5 minutes.
- **Age and posts.** Service ends at 70 in every sector. Only one chief per local government area.
- **Targets.** Missed targets in the last 30 days escalate in six steps: warning, serious warning, probation, serious probation, flagging, termination.
- **Loans and exit.** A resignation takes effect only after any loan is repaid. The company may offset debts against base salary, escrow, housing savings and accrued pro-rata pay. Final pay clears debt first; any debt left is flagged for legal review.
- **False claims.** A fabricated absence or a false medical emergency leads to civil recovery and referral for prosecution.
- **Enforcement.** Applying escalation, deductions and weighted attendance as written is performance of the agreement, not bad faith.
- **Whistleblower protection.** You may report supervisor bias or hazards anonymously at any time without retaliation.

> The agreement clauses live in `backend/lib/contract.ts`. Bump `CONTRACT_VERSION` whenever a clause changes. Have a labor lawyer review the clauses before real use.

## 5. For administrators

- Set each branch's GPS location in Settings so attendance can be approved automatically.
- Review `pending_review` records: open the scan through a signed URL, confirm the QR code matches the record, then set `verified` (this writes an `audit_log` row).
- Confirm profession changes with both approvers (organization and admin email).
- The Education sector ladder is the reference; the other four ladders are drafts to edit before use.

## 6. Demo mode and going live

Demo mode keeps everything in the browser only. To go live: apply `backend/supabase/schema.sql`, deploy the
`backend/` Next.js app, then set `recordEndpoint` and `verifyEndpoint` (and `getToken`) in `config.js`.
See `VERIFICATION-ROADMAP.md` for every feature, demo versus production.
