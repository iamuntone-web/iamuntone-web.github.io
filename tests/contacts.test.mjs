import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contactHref } from '../src/contactHref.ts';
test('contacts accept intended destinations', () => {
  assert.equal(contactHref(' https://t.me/unt0nee '), 'https://t.me/unt0nee');
  assert.equal(contactHref('iamuntone@gmail.com', true), 'mailto:iamuntone@gmail.com');
  assert.equal(contactHref('mailto:iamuntone@gmail.com', true), 'mailto:iamuntone@gmail.com');
});
test('empty, executable and malformed destinations stay inactive', () => {
  for (const value of ['', '  ', 'javascript:alert(1)', 'data:text/html,hello', '//example.com', 'https://user:secret@example.com']) assert.equal(contactHref(value), null);
  for (const value of ['', 'wrong', 'a@b.com?bcc=c@d.com', 'a@b.com%0d%0a']) assert.equal(contactHref(value, true), null);
});
