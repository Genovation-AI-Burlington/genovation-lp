# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router, TypeScript, Tailwind. Constrained, not chosen freely: the deploy target is Vercel (locked in `agentic-os/projects/google-ads/HANDOFF.md`) and the conversion-tracking playbook this campaign follows assumes a Next.js site with a `<GoogleTags />` component in the root layout.

## Users

Owners and operators of small-to-mid businesses in Canada whose teams lose hours a day to repetitive manual work. They arrive cold, mid-search, from a Google text ad, on one of three exact-match keywords: `automation companies near me`, `business automation`, `business process automation`.

They run lean and value their time. They know AI could help but have no in-house expertise to build or maintain it. Many have already been pitched by, or burned by, an AI agency: a templated solution, poor communication, or being ghosted after paying.

Their words, from `agentic-os/brand_context/icp.md`: "save time", "free up my team", "repetitive tasks", "manual busywork", "I don't have the technical side", "I got burned before", "they disappeared after I paid".

The scene is a working day, not an evening browse. Office or phone, daylight, a task interrupted. They are one of roughly 40 to 80 people who will land here in a month.

## Product Purpose

A three-variant paid-search landing page at `automation.genovation.ai`, one variant per ad group. Its only job is to turn a cold click into a booked 30 minute consult.

Success is a booked slot on the calendar, not a form fill and not a page view. Failure is a visitor who reads the page, believes Genovation is another templated agency, and leaves.

The page carries unusual weight for its size: at 40 to 80 clicks a month the campaign has too little traffic for bidding or keyword work to move much. Conversion rate is the only lever with real room in it.

## Positioning

The automation partner that does not disappear.

Most AI automation agencies sell a system, take the money, and vanish, leaving a black-box bot the client cannot fix. Genovation builds custom automations with the client, fixes glitches within 24 to 48 hours of them being flagged, and keeps the client informed throughout.

The differentiator is not capability. Every competitor claims voice agents and n8n flows. It is trust and reliability after the sale, which is the one thing competitors cannot echo because most of them are the problem.

## Operating Context

Visitors reach exactly one of three routes, each matched to the ad group that sent them. The H1 must match that ad group's keyword, which is what lifts Quality Score and lowers cost per click.

The conversion path is a hybrid, confirmed by the user on 11 August 2026: a form that captures details about the visitor's business, then a calendar for choosing a slot. The form comes first so a lead is captured even if the visitor abandons before picking a time.

No click-to-call button. Deliberately deferred until the campaign proves lead intent is warm.

Leads land in GoHighLevel, the CRM already in use at `app.genovation.ai`, via API v2 with a private integration token.

## Capabilities and Constraints

Confirmed:
- Custom automations and custom integrations, built per client, not off the shelf
- Glitches addressed within 24 to 48 hours of being flagged
- Noticeable efficiency within the first week of working together
- Regular client updates throughout
- Stack in use: Retell AI for voice agents, n8n for automation, Claude and Lovable for web apps
- Team of four developers plus two founders, based in Ontario, Canada
- The offer is a free 30 minute consult

Constraints:
- Final URLs must match the live pages exactly, with no redirects, or Quality Score suffers
- Page speed is a ranking input here, not a nicety: Google scores landing page experience directly
- Every claim on the page must be one Genovation can beat in practice

Undecided:
- Which specific real result will be used as proof. The user confirmed on 11 August 2026 that a real, client-unnamed result exists and will be supplied. Until it is, the slot ships as a marked placeholder and must not be invented.
- Whether a phone number is added later

## Brand Commitments

Name: Genovation AI. Voice: direct, warm, authoritative, empathetic, governed by "under-promise, over-deliver". Full profile at `agentic-os/brand_context/voice-profile.md`.

Words used: automate, repetitive tasks, efficiency, save time, custom, integration, hand-built, within a week.

Words refused: revolutionary, game-changing, synergy, best-in-class, seamless, and anything promising a result that cannot be guaranteed.

Binding on all copy: **no em dash characters**, anywhere a person will read them. Standing user rule, not a style preference.

Never: over-promise on timelines, results, or scope. Never hide behind jargon.

Asset on hand: a logo mark at `agentic-os/brand_context/visual-identity/logos/genovation-g-mark.png`, a deep navy and steel-blue diamond bearing a white G. It is the only captured piece of visual identity. No brand colors, fonts, or other assets have ever been recorded.

## Evidence on Hand

- Positioning, ICP, and voice, from founder onboarding on 11 June 2026
- The tools genuinely in use (Retell, n8n, Claude, Lovable)
- One real client result, unnamed, to be supplied by the user

Explicitly absent, and not to be fabricated under any circumstances: named clients, client logos, testimonials, review counts, case studies, headcount claims beyond the six people confirmed, revenue or funding figures, years in business, certifications, awards, and any "trusted by N companies" line. A placeholder that is clearly marked is correct. An invented one is not.

## Product Principles

1. **The consult is the product.** Everything on the page is judged by whether it makes a stranger willing to give up 30 minutes.
2. **Under-promise in writing.** Every claim must be one Genovation can beat. This is the brand's governing principle and it outranks persuasion.
3. **Name the fear.** This audience's real objection is being ghosted after paying. A page that dodges it reads like every agency that ghosted them.
4. **Specific beats superlative.** "24 to 48 hours" earns belief. "Best-in-class" destroys it.
5. **Match the search.** Each variant answers the exact phrase that was typed. Relevance is both the conversion argument and the Quality Score argument.

## Accessibility & Inclusion

No product-specific standard has been established. Ordinary obligations apply: the form is the conversion path, so it must be keyboard-operable, correctly labelled, and readable at 4.5:1 contrast. A visitor who cannot use the form cannot become a lead.
