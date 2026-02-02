export function detectLanguage(text) {
  if (!text) return 'en';
  let alpha = 0;
  let cyrillic = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code >= 0x0400 && code <= 0x04FF) {
      cyrillic++;
      alpha++;
    } else if ((code >= 0x0041 && code <= 0x005A) || (code >= 0x0061 && code <= 0x007A)) {
      alpha++;
    }
  }
  if (alpha === 0) return 'en';
  return cyrillic / alpha >= 0.2 ? 'sr' : 'en';
}
