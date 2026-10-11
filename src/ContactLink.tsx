import { contactHref } from './contactHref';
import type { ReactNode } from 'react';
export function ContactLink({ value, email = false, children }: { value: string; email?: boolean; children: ReactNode }) {
  const href = contactHref(value, email);
  if (!href) return <span className="contact-label">{children}</span>;
  return <a href={href} {...(!email ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
}
