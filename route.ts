// app/api/staff/record/route.ts
// POST: the staff front end sends the person's record. The browser reports FACTS (who they are,
// what they signed, what they scanned). The server decides STATUS, RANK and PAY. Anything the
// client claims about those (claimedStatus, work.rank) is stored for reference and never trusted.
import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { requireUser, supabaseAdmin } from '@/lib/server';
import { corsHeaders, preflight } from '@/lib/cors';

export const OPTIONS = preflight;

const MAX_SCAN_BYTES = 2_000_000;
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : null);

export async function POST(req: Request) {
  const headers = corsHeaders(req);
  const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers });

  let user;
  try {
    user = await requireUser(req);
  } catch {
    return reply({ error: 'Sign in again.' }, 401);
  }

  const rec = await req.json().catch(() => null);
  if (!rec || rec.schema !== 'tmws.staff.record/1') return reply({ error: 'Unknown record format.' }, 400);

  const name = str(rec.identity?.name, 120);
  const orgEmail = str(rec.identity?.organizationEmail, 200)?.toLowerCase() ?? null;
  const profession = str(rec.identity?.profession, 120);
  const branch = str(rec.identity?.branch, 120);
  if (!name || name.length < 3 || !profession || !branch) return reply({ error: 'Name, profession and branch are required.' }, 400);
  if (orgEmail && !/^\S+@\S+\.\S+$/.test(orgEmail)) return reply({ error: 'Organization email is not valid.' }, 400);

  // Existing row decides the status. Clients can never move themselves to verified.
  const { data: existing } = await supabaseAdmin
    .from('staff_records')
    .select('id, staff_code, status, org_email, org_email_verified, scan_path, record_code')
    .eq('user_id', user.id)
    .maybeSingle();

  const staffCode = existing?.staff_code ?? `TM${randomInt(100000, 999999)}`;
  let scanPath: string | null = existing?.scan_path ?? null;
  let scanAt: string | null = null;

  // Stamped-letter photo goes to PRIVATE storage; reviewers read it through signed URLs.
  if (typeof rec.scanImage === 'string' && rec.scanImage.startsWith('data:image/jpeg;base64,')) {
    const bytes = Buffer.from(rec.scanImage.split(',')[1] ?? '', 'base64');
    if (bytes.length > MAX_SCAN_BYTES) return reply({ error: 'Scan is too large.' }, 413);
    const path = `${user.id}/stamped-letter.jpg`;
    const up = await supabaseAdmin.storage.from('agreement-scans').upload(path, bytes, { contentType: 'image/jpeg', upsert: true });
    if (up.error) return reply({ error: 'Could not store the scan.' }, 500);
    scanPath = path;
    scanAt = str(rec.agreement?.scanAt, 40) ?? new Date().toISOString();
  }

  // The org email is only trusted after the one-time-code step; changing it resets that proof.
  const orgChanged = orgEmail !== (existing?.org_email ?? null);
  let status: string = existing?.status ?? 'registered';
  if (status === 'registered' && scanPath) status = 'pending_review';

  const row = {
    user_id: user.id,
    staff_code: staffCode,
    full_name: name,
    email: user.email,
    org_email: orgEmail,
    org_email_verified: orgChanged ? false : existing?.org_email_verified ?? false,
    profession,
    branch,
    category: str(rec.onboarding?.category, 60),
    delegation_level: Number.isInteger(rec.onboarding?.level) && rec.onboarding.level >= 1 && rec.onboarding.level <= 10 ? rec.onboarding.level : null,
    agreement_version: str(rec.agreementVersion, 20),
    agreement_hash: str(rec.agreement?.hash, 128),
    letter_code: str(rec.recordCode, 32),
    credential_id: str(rec.biometric?.credentialId, 512),
    scan_path: scanPath,
    scan_at: scanAt,
    status,
    claimed: { status: rec.claimedStatus ?? null, rank: rec.work?.rank ?? null, verifiedDays: rec.work?.verifiedDays ?? null },
    record_hash: str(rec.recordHash, 128),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('staff_records')
    .upsert(row, { onConflict: 'user_id' })
    .select('id, status, org_email_verified, record_code, letter_code')
    .single();
  if (error || !data) return reply({ error: 'Could not save the record.' }, 500);

  await supabaseAdmin.from('audit_log').insert({
    actor: user.id, action: existing ? 'record.update' : 'record.create', subject: data.id,
    detail: { status, scan: !!scanPath, orgChanged },
  });

  return reply({
    id: staffCode,
    status: data.status,
    orgVerified: data.org_email_verified,
    recordCode: data.record_code ?? data.letter_code,
  });
}
