/**
 * One phone number, written the same way everywhere.
 *
 * The lead reaches GoHighLevel twice: once from the form via /api/lead, and
 * again from the booking widget on the thank you page. GoHighLevel decides
 * whether those are the same person partly on the phone number, and it compares
 * the stored string, not the digits.
 *
 * Left alone, the two sides disagree. The API hands GoHighLevel whatever was
 * typed and lets it guess a country code from the account, which is Canada. The
 * booking widget guesses from the visitor's browser instead. Ali tested from
 * India on 13 August 2026 and got `+18976149770` from the form and
 * `+918976149770` from the widget: two contacts, same email, no error anywhere.
 *
 * So both sides call this instead of guessing. The campaign targets Canada with
 * presence-only geo, so every real visitor is on a +1 number and the assumption
 * below holds. A number that already carries a country code is left alone.
 */
export function normalizePhone(input: string): string {
  const raw = (input || '').trim();
  if (!raw) return '';

  // Already explicit about its country. Keep it, minus the formatting.
  if (raw.startsWith('+')) return '+' + raw.slice(1).replace(/\D/g, '');

  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;              // 416 555 0142
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;  // 1 416 555 0142

  // Anything else is not a North American number. Sending a wrong country code
  // is worse than sending none, so hand back the digits and let GoHighLevel
  // decide rather than mangling it.
  return digits;
}
