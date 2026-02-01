import { signal } from '@preact/signals';

export const theme = signal(localStorage.getItem('dn_theme') || 'system');

const mql = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme() {
  const val = theme.value;
  if (val === 'light' || val === 'dark') {
    document.documentElement.dataset.theme = val;
  } else {
    document.documentElement.dataset.theme = mql.matches ? 'dark' : 'light';
  }
}

export function setTheme(val) {
  theme.value = val;
  localStorage.setItem('dn_theme', val);
  applyTheme();
}

export function initTheme() {
  applyTheme();
  mql.addEventListener('change', () => {
    if (theme.value === 'system') applyTheme();
  });
}
