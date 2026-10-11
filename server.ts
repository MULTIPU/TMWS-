// lib/server.ts — server-only helpers. Never import from a client component.
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { CONTRACT_VERSION, CLAUSES } from './contract';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server only
);

export const RP_ID = process.env.WEBAUTHN_RP_ID ?? 'localhost';
export const RP_NAME = 'The Working System';
export const ORIGIN = process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:3000';

export type SessionUser = { id: string; full_name: string; email: string };

// TODO: replace with your real session lookup (Supabase Auth JWT from cookies).
// It must return the logged-in new hire, or throw.
export async function requireUser(_req: Request): Promise<SessionUser> {
  throw new Error('requireUser() not implemented');
}

// What the signature actually commits to: who signed, which contract version and clauses,
// which registered credential, and when.
export function contractHash(input: {
  userId: string;
  fullName: string;
  credentialId: string;
  signedAt: string;
}) {
  const payload = JSON.stringify({
    v: CONTRACT_VERSION,
    clauses: CLAUSES.map((c) => ({ id: c.id, body: c.body })),
    ...input,
  });
  return createHash('sha256').update(payload).digest('hex');
}

// Posts the hash to your e-Notary provider. Returns its verification ID.
export async function anchorHash(hash: string): Promise<string> {
  const url = process.env.E_NOTARY_WEBHOOK_URL;
  if (!url) return `PENDING-${hash.slice(0, 12)}`; // no provider configured yet
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.E_NOTARY_API_KEY ?? ''}`,
    },
    body: JSON.stringify({ sha256: hash }),
  });
  if (!res.ok) throw new Error(`e-Notary anchoring failed (${res.status})`);
  const data = await res.json();
  return String(data.verificationId ?? data.id);
}
