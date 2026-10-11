// lib/contract.ts — shared by the signing screen and the verify API.
// Keep clause text here so legal can edit it in one place.
// IMPORTANT: bump CONTRACT_VERSION whenever any clause changes; it is hashed into every signature.

export const CONTRACT_VERSION = '2026.1';

export const ORIENTATION_MODULES = [
  { id: 'mission', day: 1, title: 'Company mission and values', minutes: 45 },
  { id: 'calendar', day: 1, title: '13-month, 28-day calendar and weighted attendance', minutes: 60 },
  { id: 'housing', day: 2, title: 'Housing tiers, 50-50 swaps and escrow payouts', minutes: 45 },
  { id: 'loans', day: 2, title: 'Internal loans: Emergency Help, Abundant, Senior Housing', minutes: 60 },
  { id: 'targets', day: 2, title: 'Target escalation at 5, 7 and 10 missed targets', minutes: 45 },
] as const;

export const CLAUSES = [
  {
    id: 'loan-non-default',
    title: 'Loan non-default and resignation hold',
    body: 'If you resign while a loan balance is outstanding, the resignation takes effect only after the balance is fully repaid through approved deductions or a full settlement.',
  },
  {
    id: 'salary-offset',
    title: 'Salary attachment and offset',
    body: 'If you default or leave without authorization, the company may offset what you owe against your base salary, escrow balances, housing savings and accrued pro-rata pay.',
  },
  {
    id: 'fraud',
    title: 'False absence and emergency claims',
    body: 'Fabricating an absence, or filing a false medical emergency to claim the 3-month death benefit, leads to civil recovery and referral for criminal prosecution.',
  },
  {
    id: 'enforcement-waiver',
    title: 'Enforcement of company rules',
    body: 'Applying target escalation, deductions and weighted attendance as described in this agreement is performance of the contract and is not, by itself, bad faith.',
  },
  {
    id: 'whistleblower',
    title: 'Whistleblower protection',
    body: 'You may report supervisor bias or hazards through the anonymous portal at any time. The company will not retaliate against you for doing so.',
  },
] as const;

export type ClauseId = (typeof CLAUSES)[number]['id'];
export type ModuleId = (typeof ORIENTATION_MODULES)[number]['id'];
