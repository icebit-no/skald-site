// Run with `npm test` (Node's own test runner; Node runs TypeScript files as they are).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { toRunes } from './runes.ts';
import { t } from './i18n/ui.ts';

test('the rune table writes the taglines as the hero carves them', () => {
  assert.equal(toRunes('Du snakkar. Skalden skriv.'), 'ᛏᚢ᛫ᛋᚾᛅᚴᚴᛅᚱ᛫ᛋᚴᛅᛚᛏᛁᚾ᛫ᛋᚴᚱᛁᚢ');
  assert.equal(toRunes('Du snakker. Skalden skriver.'), 'ᛏᚢ᛫ᛋᚾᛅᚴᚴᛁᚱ᛫ᛋᚴᛅᛚᛏᛁᚾ᛫ᛋᚴᚱᛁᚢᛁᚱ');
});

test('the rune table covers æ, ø and å', () => {
  assert.equal(toRunes('Lærer orda'), 'ᛚᛅᚱᛁᚱ᛫ᚢᚱᛏᛅ');
  assert.equal(toRunes('Søk på'), 'ᛋᚢᚴ᛫ᛒᚬ');
});

/** Every leaf of a text tree, by its path: a string, or a function's result for a sample argument. */
function leaves(value: unknown, path = ''): Map<string, string> {
  if (typeof value === 'string') return new Map([[path, value]]);
  if (typeof value === 'function') return new Map([[path, String(value('macOS'))]]);
  const entries = Object.entries(value as object).flatMap(([key, child]) => [...leaves(child, `${path}.${key}`)]);
  return new Map(entries);
}

test('nynorsk and bokmål have the same texts, none of them empty', () => {
  const nn = leaves(t('nn'));
  const nb = leaves(t('nb'));
  assert.deepEqual([...nb.keys()], [...nn.keys()]);
  for (const [path, text] of [...nn, ...nb]) assert.notEqual(text.trim(), '', `${path} is empty`);
});
