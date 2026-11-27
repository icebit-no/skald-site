// Checks the built site in dist/ for what the content security policy, the two languages and the links need, and
// fails the build on every problem it finds. After solveig-site's check (https://github.com/icebit-no/solveig-site,
// MIT, scripts/check-dist.mjs), with fragments checked as well as pages.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import process from 'node:process';

const dist = new URL('../dist/', import.meta.url).pathname;

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

const all = files(dist);
const pages = all.filter((f) => f.endsWith('.html')).map((f) => '/' + relative(dist, f).split(sep).join('/'));
const html = new Map(pages.map((page) => [page, readFileSync(join(dist, page), 'utf8')]));
const problems = [];
const problem = (where, text) => problems.push(`${where}: ${text}`);

/** The address a page file is served at: /index.html is /, /nb.html is /nb. */
const address = (page) => (page === '/index.html' ? '/' : page.replace(/\.html$/, ''));
const pageAt = new Map(pages.map((page) => [address(page), page]));
const ids = new Map(pages.map((page) => [page, new Set([...html.get(page).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));

/** Why an internal link leads nowhere, or null when it leads to a built page, a fragment on one, or a file. */
function deadLink(from, url) {
  const [beforeHash, fragment] = url.split('#');
  const path = decodeURI(beforeHash.split('?')[0]);
  const target = path === '' ? from : pageAt.get(path);
  if (!target) {
    const file = join(dist, path);
    return path !== '/' && existsSync(file) && statSync(file).isFile() ? null : 'which is not built';
  }

  if (fragment && !ids.get(target).has(decodeURIComponent(fragment))) return `but ${address(target)} has no id="${fragment}"`;
  return null;
}

for (const page of pages) {
  const text = html.get(page);
  for (const tag of text.match(/<script\b[^>]*>/g) ?? []) {
    if (!/\ssrc=/.test(tag)) problem(page, `inline script ${tag}`);
  }
  if (/<style\b/.test(text)) problem(page, 'inline <style>');
  if (/<[a-z][^>]*\sstyle=/i.test(text)) problem(page, 'style attribute');
  if (!/<html lang="(nn|nb)"/.test(text)) problem(page, 'no lang="nn" or lang="nb" on <html>');

  for (const [, attr, url] of text.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (/^(https?:)?\/\//.test(url)) {
      // Only links may point elsewhere; nothing is loaded from elsewhere.
      const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const isLoad = attr === 'src' || new RegExp(`<link[^>]*rel="(stylesheet|preload|icon|apple-touch-icon|modulepreload)"[^>]*href="${escaped}"`).test(text);
      if (isLoad) problem(page, `loads ${url} from another host`);
      continue;
    }
    if (url.startsWith('/') || url.startsWith('#')) {
      const why = deadLink(page, url);
      if (why) problem(page, `links to ${url}, ${why}`);
    }
  }

  if (page !== '/404.html') {
    for (const lang of ['nn', 'nb', 'x-default']) {
      if (!text.includes(`hreflang="${lang}"`)) problem(page, `no <link rel="alternate" hreflang="${lang}">`);
    }
    const isNb = page === '/nb.html' || page.startsWith('/nb/');
    const other = isNb ? (page === '/nb.html' ? '/index.html' : page.slice(3)) : page === '/index.html' ? '/nb.html' : `/nb${page}`;
    if (!html.has(other)) problem(page, `has no page in the other language (${other})`);
  }
}

for (const css of all.filter((f) => f.endsWith('.css'))) {
  for (const [, url] of readFileSync(css, 'utf8').matchAll(/url\(\s*["']?([^"')]+)/g)) {
    if (/^(https?:)?\/\//.test(url)) problem(relative(dist, css), `loads ${url} from another host`);
  }
}

// The policy refuses style attributes that a script writes into markup, too: scripts set styles through the DOM.
for (const js of all.filter((f) => f.endsWith('.js'))) {
  if (/\sstyle=\\?["'`]/.test(readFileSync(js, 'utf8'))) problem(relative(dist, js), 'writes a style attribute into markup');
}

if (problems.length > 0) {
  console.error(`check-dist: ${problems.length} problem(s)\n${problems.map((p) => `  ${p}`).join('\n')}`);
  process.exit(1);
}

console.log(`check-dist: ${pages.length} pages, both languages, no inline script or style, nothing from other hosts, every internal link and fragment leads somewhere.`);
