import { redirect } from 'next/navigation';

/**
 * Nothing advertises the bare root. Anyone landing here typed the domain by
 * hand, so send them to the broadest of the three variants rather than
 * maintaining a fourth page that no ad points at.
 */
export default function Root() {
  redirect('/business-automation');
}
