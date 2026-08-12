# genovation-lp

Landing pages for [Genovation AI](https://genovation.ai), an automation company in Burlington, Ontario. Served at `automation.genovation.ai`.

Three variants, each answering a different search phrase, so the page a visitor lands on matches what they were looking for.

## Stack

Next.js App Router, TypeScript, no CSS framework. Pages are statically generated. One serverless route handles form submissions.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run typecheck
npm run preflight    # pre-launch checks, see below
```

## Routes

| Route | Search phrase it answers |
|---|---|
| `/automation-company` | automation companies near me |
| `/business-automation` | business automation |
| `/business-process-automation` | business process automation |

These paths are referenced externally. Renaming one is a breaking change, and a redirect is not an adequate substitute. Change the slug in `lib/variants.ts` and update whatever points at it.

`/thank-you` handles booking after a form submission. `/` redirects to `/business-automation`.

## Configuration

Copy `.env.example` to `.env.local` and fill it in. In production these are set in the host's project settings and never committed. `.env*` is gitignored.

## preflight

`npm run preflight` refuses to pass while anything would either mislead a visitor or break measurement:

- a card whose figure has not been confirmed
- an em dash in shipped copy
- conversion tracking not configured
- the CRM credentials missing

It exits non-zero so it can gate a deploy.

## Notes

No analytics beyond the ad platform tag, no cookie banner, no chat widget, and no third party fonts or scripts. The typeface is self hosted at build time. Page speed is a ranking input here, so nothing is loaded that does not earn its place.
