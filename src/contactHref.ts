// Keep configuration mistakes from becoming executable or malformed links.
export function contactHref(value: string, email = false): string | null {
  const address = value.trim();
  if (!address) return null;
  if (email) {
    const mailbox = address.replace(/^mailto:/i, '');
    return /^[^\s@?&#%]+@[^\s@?&#%]+\.[^\s@?&#%]+$/.test(mailbox) ? `mailto:${mailbox}` : null;
  }
  try {
    const url = new URL(address);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
