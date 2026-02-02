import { signal } from '@preact/signals';

export const contentLanguageFilter = signal(localStorage.getItem('dn_content_language_filter') === 'true');

export function setContentLanguageFilter(val) {
  contentLanguageFilter.value = val;
  localStorage.setItem('dn_content_language_filter', String(val));
}
