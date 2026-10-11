// app/api/onboarding/webauthn/verify/route.ts  (requires @simplewebauthn/server v11+)
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { CLAUSES } from '@/lib/contract';
import {
  ORIGIN,
  RP_ID,
  anchorHash,
  contractHash,
  requireUser,
  supabaseAdmin,
} from '@/lib/server';

export async function POST(req: Request) {
  const user = await requireUser(req);
  const { response, fullName, acceptedClauseIds } = await req.json();

  // 1. Every clause must be accepted and the typed name must match the account.
  const allAccepted = CLAUSES.every((c) => acceptedClauseIds?.includes(c.id));
  if (!allAccepted) {
    return NextResponse.json({ error: 'Accept every clause before signing.' }, { status: 400 });
  }
  if (String(fullName ?? '').trim().toLowerCase() !== user.full_name.trim().toLowerCase()) {
    return NextResponse.json({ error: 'Typed name does not match your account name.' }, { status: 400 });
  }

  // 2. Verify the device signature against the stored challenge.
  const jar = await cookies();
  const expectedChallenge = jar.get('wms_reg_challenge')?.value;
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'Signing session expired. Start again.' }, { status: 400 });
  }

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RP_ID,
    requireUserVerification: true,
  });
  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: 'Biometric check failed.' }, { status: 401 });
  }
  jar.delete('wms_reg_challenge');

  // 3. Hash the agreement, anchor it, and save the result.
  const credentialId = verification.registrationInfo.credential.id;
  const signedAt = new Date().toISOString();
  const hash = contractHash({ userId: user.id, fullName: user.full_name, credentialId, signedAt });
  const notaryId = await anchorHash(hash);

  const { error } = await supabaseAdmin
    .from('users')
    .update({ biometric_contract_hash: hash, e_notary_verification_id: notaryId })
    .eq('id', user.id);
  if (error) {
    return NextResponse.json({ error: 'Could not save the signed agreement.' }, { status: 500 });
  }

  return NextResponse.json({ hash, notaryId, signedAt });
}
