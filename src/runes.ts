// Text written in the Younger Futhark, letter by letter after Skald's own table (docs/design.md in icebit-no/skald,
// Overlay): the runes the app carves, used here as the marks above each section.
const futhark: Record<string, string> = {
  a: 'ᛅ', æ: 'ᛅ', b: 'ᛒ', p: 'ᛒ', c: 'ᚴ', g: 'ᚴ', k: 'ᚴ', q: 'ᚴ', d: 'ᛏ', t: 'ᛏ', e: 'ᛁ', i: 'ᛁ', j: 'ᛁ',
  f: 'ᚠ', h: 'ᚼ', l: 'ᛚ', m: 'ᛘ', n: 'ᚾ', o: 'ᚢ', u: 'ᚢ', v: 'ᚢ', w: 'ᚢ', y: 'ᚢ', ø: 'ᚢ', r: 'ᚱ', s: 'ᛋ',
  x: 'ᛋ', z: 'ᛋ', å: 'ᚬ',
};

/** "Held tett" is ᚼᛁᛚᛏ᛫ᛏᛁᛏᛏ: letters outside the table are left out, and ᛫ stands between words. */
export function toRunes(text: string): string {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((word) => [...word].map((letter) => futhark[letter] ?? '').join(''))
    .filter((word) => word !== '')
    .join('᛫');
}
