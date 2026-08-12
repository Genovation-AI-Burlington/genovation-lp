/**
 * Launch guard. Run before pointing an ad at this site.
 *
 *   npm run preflight
 *
 * Blocks on anything that would either mislead a visitor or silently waste ad
 * spend. Exits non-zero so it can gate a deploy.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const blockers = [];
const warnings = [];

// ---------- 1. no unconfirmed figures on a live page ----------
const variants = readFileSync(join(ROOT, 'lib/variants.ts'), 'utf8');
const placeholders = variants
  .split('\n')
  .filter((l) => /placeholder:\s*true/.test(l) && !/^\s*(\*|\/\/)/.test(l));
if (placeholders.length) {
  blockers.push(
    `${placeholders.length} job card(s) still marked placeholder in lib/variants.ts. ` +
      `Confirm the figure or remove the card before pointing traffic here.`,
  );
}

// ---------- 2. no em dashes anywhere a person reads ----------
const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (['.tsx', '.ts', '.css'].includes(extname(entry))) out.push(full);
  }
  return out;
};

// only what a visitor can actually read. scaffold docs are not shipped copy.
const shipped = ['app', 'components', 'lib'].flatMap((d) => walk(join(ROOT, d)));

for (const file of shipped) {
  const text = readFileSync(file, 'utf8');
  text.split('\n').forEach((line, i) => {
    if (line.includes('—') || line.includes('–')) {
      blockers.push(`em or en dash in ${file.replace(ROOT, '')}:${i + 1}`);
    }
  });
}

// ---------- 3. tracking that must exist before spend starts ----------
const need = {
  NEXT_PUBLIC_GOOGLE_ADS_ID: 'no conversion tracking. Every booked call would look like zero.',
  NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL: 'the conversion event has nowhere to report to.',
  GHL_PIT: 'leads land in the server log instead of the CRM.',
  GHL_LOCATION_ID: 'leads land in the server log instead of the CRM.',
};
for (const [key, why] of Object.entries(need)) {
  if (!process.env[key]) blockers.push(`${key} is not set: ${why}`);
}

if (!process.env.NEXT_PUBLIC_GHL_CALENDAR_URL) {
  warnings.push(
    'NEXT_PUBLIC_GHL_CALENDAR_URL is not set. The form still captures the lead, but the ' +
      'visitor cannot book a slot, which is the whole point of the hybrid.',
  );
}

// ---------- report ----------
const line = '='.repeat(62);
console.log(`\n${line}\nPREFLIGHT\n${line}`);

if (warnings.length) {
  console.log(`\n  ${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`   ~ ${w}`));
}

if (blockers.length) {
  console.log(`\n  ${blockers.length} blocker(s):`);
  blockers.forEach((b) => console.log(`   x ${b}`));
  console.log(`\n  NOT READY. Fix the blockers above before any ad points here.\n`);
  process.exit(1);
}

console.log('\n  Clear. Safe to point ads at this site.\n');
