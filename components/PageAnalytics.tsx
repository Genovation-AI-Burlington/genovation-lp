'use client';

import { useEffect } from 'react';
import { startPageTracking } from '@/lib/analytics';

/**
 * Mounts the scroll and form-visibility observers.
 *
 * Lives in the layout rather than the page so the thank-you screen is measured
 * too. It has no form, so form_view simply never fires there, which is the
 * correct reading rather than a gap.
 */
export default function PageAnalytics() {
  useEffect(() => startPageTracking(), []);
  return null;
}
