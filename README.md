# genovation-lp

Paid-search landing pages for Genovation AI's Google Ads campaign. Three variants, one per ad group, at `automation.genovation.ai`.

Product truth is in `PRODUCT.md`. Visual system is in `DESIGN.md`. Campaign context lives in the `agentic-os` repo under `projects/google-ads/`.

## Run it

```bash
npm install
npm run dev          # http://localhost:6544 with --port 6544
npm run build
npm run preflight    # launch guard, see below
```

## The three routes

| Route | Ad group keyword |
|---|---|
| `/automation-company` | `[automation companies near me]` |
| `/business-automation` | `[business automation]` |
| `/business-process-automation` | `[business process automation]` |

**These paths are the ads' final URLs.** Renaming one breaks the ad it belongs to, and a redirect is not a fix: Google scores the landing page it was sent to, so a redirect costs Quality Score. If a path has to change, change it in `lib/variants.ts` and in `agentic-os/projects/google-ads/build_ads.py`, then regenerate the ad copy.

## preflight

`npm run preflight` refuses to pass while anything would either mislead a visitor or waste ad spend silently:

- a job card still carrying an invented figure
- an em dash in shipped copy
- conversion tracking not configured, which makes a working campaign look like a dead one
- the CRM token missing, which sends leads to the server log instead

Run it before pointing an ad at this site. It exits non-zero, so it can gate a deploy.

## Deploying

1. Create an empty **private** repo in the `Genovation-AI-Burlington` org, named `genovation-lp`. Do not tick "add a README".
2. Push this folder to it.
3. In Vercel, **Add New > Project**, import `genovation-lp`. Framework detection handles the rest, no build settings to change.
4. Add the environment variables from `.env.example` under **Settings > Environment Variables**, for Production and Preview.
5. **Settings > Domains**, add `automation.genovation.ai`. Vercel shows a CNAME target.
6. In Cloudflare, add that CNAME for the `automation` subdomain. **Set the proxy to DNS only, the grey cloud.** Leaving it orange puts Cloudflare in front of Vercel and breaks certificate issuing.
7. Redeploy, then load all three routes over `https` and confirm the certificate is live before any ad points at them.

## What is deliberately not here

No analytics beyond the Google Ads tag, no cookie banner, no chat widget, no third-party fonts or scripts of any kind. Page speed is a direct input to what each click costs, and this site gets roughly 40 to 80 visitors a month, which is too few to spend any of them on a slow first paint.
