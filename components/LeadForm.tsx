'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { captureAttribution, readAttribution } from '@/lib/attribution';
import type { Variant } from '@/lib/variants';
import { normalizePhone } from '@/lib/phone';

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'task', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LeadForm({ variant }: { variant: Variant }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [failed, setFailed] = useState<string | null>(null);
  const firstBad = useRef<HTMLFormElement>(null);

  // the gclid is only in the URL on arrival, so grab it before anything else
  useEffect(() => {
    captureAttribution();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFailed(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const next: Errors = {};
    if (!data.name?.trim()) next.name = 'We need a name to put on the card.';
    if (!EMAIL.test(data.email?.trim() || '')) next.email = 'Check this address, we cannot reach you without it.';
    if ((data.phone?.replace(/\D/g, '').length || 0) < 10) next.phone = 'Ten digits, so we can call at the time you pick.';
    if (!data.task?.trim()) next.task = 'One line is enough. This is what the call is about.';

    setErrors(next);
    if (Object.keys(next).length) {
      const el = form.querySelector<HTMLElement>('.has-error input, .has-error textarea');
      el?.focus();
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          variant: variant.slug,
          keyword: variant.keyword,
          attribution: readAttribution(),
        }),
      });

      if (!res.ok) throw new Error(String(res.status));

      // fire the Google Ads conversion before leaving the page
      const w = window as unknown as { gtag?: (...a: unknown[]) => void };
      const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
      if (w.gtag && label) w.gtag('event', 'conversion', { send_to: label });

      // Carry the details into the booking widget so the visitor is not asked
      // for the same four fields twice, and so GoHighLevel matches this to the
      // contact we just created instead of making a second one.
      const q = new URLSearchParams({
        v: variant.slug,
        n: data.name?.trim() ?? '',
        e: data.email?.trim() ?? '',
        p: normalizePhone(data.phone ?? ''),
      });
      router.push(`/thank-you?${q.toString()}`);
    } catch {
      setSending(false);
      const to = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
      setFailed(
        to
          ? `That did not send. Email ${to} with the same details and we will pick it up from there.`
          : 'That did not send. Give it another try, and if it still fails the fault is ours, not yours.',
      );
    }
  }

  const field = (k: keyof Errors) => (errors[k] ? 'field has-error' : 'field');

  return (
    <form ref={firstBad} onSubmit={onSubmit} noValidate>
      <label className={field('name')}>
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" aria-invalid={!!errors.name} />
        {errors.name && <em className="field-error">{errors.name}</em>}
      </label>

      <label className={field('email')}>
        <span>Email</span>
        <input name="email" type="email" inputMode="email" autoComplete="email" aria-invalid={!!errors.email} />
        {errors.email && <em className="field-error">{errors.email}</em>}
      </label>

      <label className={field('phone')}>
        <span>Phone</span>
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
        {errors.phone && <em className="field-error">{errors.phone}</em>}
      </label>

      <label className="field">
        <span>Business name</span>
        <input name="company" type="text" autoComplete="organization" />
      </label>

      <label className={field('task')}>
        <span>{variant.taskLabel}</span>
        <textarea name="task" rows={3} placeholder={variant.taskPlaceholder} aria-invalid={!!errors.task} />
        {errors.task && <em className="field-error">{errors.task}</em>}
      </label>

      <label className="field">
        <span>Roughly how many hours a week does it take?</span>
        <input name="hours" type="text" inputMode="numeric" placeholder="a guess is fine" />
      </label>

      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'Putting it on the board' : 'Put it on the board'}
      </button>

      {failed && <p className="form-error">{failed}</p>}

      <p className="form-foot">
        Next screen picks your time. No payment, no obligation, and we will not pass your details to anyone.
      </p>
    </form>
  );
}
