# skald.icebit.app

The site of [Skald](https://github.com/icebit-no/skald), Norwegian push-to-talk dictation for macOS, Windows and
Linux, transcribed locally with the National Library of Norway's speech models. Nynorsk first, every page in bokmål
too. What the site holds is in Skald's `docs/design.md`, section Site; why, in its `docs/decisions.md` (D-13, D-15).

Built with [Astro](https://astro.build): static HTML, no client framework. Three small scripts: one in `<head>` that
keeps a reader in the language they chose, one in `<head>` that names the visitor's system for the download button,
and the one that draws the hero.

## Develop

Node 24 (`.nvmrc`).

```sh
npm ci
npm run dev       # http://localhost:4321
npm test          # the rune table and the two languages' texts, with Node's own test runner (src/**/*.test.ts)
npm run build     # dist/, then scripts/check-dist.mjs
npm run preview   # the built site
```

The build reads Skald's releases from GitHub for «Sagaen» (`src/releases.ts`), so it needs the network. It asks
anonymously, which GitHub allows 60 times an hour per address; with `GITHUB_TOKEN` set it asks with that token
instead (`GITHUB_TOKEN=$(gh auth token) npm run build`). A failed request fails the build rather than show no
releases.

`npm run build` fails when a page lacks its other language, when a page has an inline script, style element or style
attribute (nginx's content security policy allows neither), when it loads anything from another host, when an
internal link leads to a page or a fragment (`#macos`) that is not built, or when a script writes a style attribute
into markup. The scripts set Astro's telemetry off (`ASTRO_TELEMETRY_DISABLED=1`).

The tests need no package: Node 22.18 and later run TypeScript files as they are, which is why the tests import
with the `.ts` extension.

## Content

| What | Where |
| --- | --- |
| Every text a visitor reads | `src/i18n/ui.ts`: `nn`, and `nb` with the same keys (a test checks both) |
| The models and their error rates | `src/models.ts`, from Skald's `docs/research.md`, Models |
| The hero | `src/components/Hero.astro`, `src/styles/hero.css`, `src/scripts/hero.js` |
| The sections | `src/components/`: `Points`, `Models`, `Agents`, `Install`, `Saga`, `Footer` |
| Fonts | `src/fonts/`: Eczar, Alegreya Sans, Noto Sans Runic and IBM Plex Mono as WOFF2 (Latin, and the Runic block), each with its `OFL-*.txt` |
| Icons | `public/icon-*.png`, copied from Skald's `assets/icon` |

The error rates are word errors per 100 words on FLEURS from the National Library's paper (arXiv 2402.01917),
measured the same way for every model. A model measured another way, such as NB-ASR Bokfink on its own test sets,
has no number in `src/models.ts` and is drawn without a bar until it is measured the same way.

The rune lines above the section headings are the headings in the Younger Futhark, letter by letter after Skald's
own table (`src/runes.ts`, Skald's `docs/design.md`, Overlay).

## The hero

Concept A, «Skalden i stamnen», sketch 7: a linocut longship on a dark fjord, the skald in the bow, his voice rising
into the northern lights and ending as a row of runes, the tagline in the Younger Futhark. `src/scripts/hero.js`
draws it for the size of the print and draws it again when that changes, as SVG layers: the sky, the aurora, the
mountains, eight bands of water, the voice and the ship. The moving layers are elements of their own, so the browser
moves them without drawing their filters again. The aurora's bars rise and fall, the water sways in bands that move
faster towards the viewer, and the ship rocks; with reduced motion asked for, everything stands still.

The content security policy refuses style attributes, so the script sets each layer's position and timing through
its style object rather than writing them into the markup (the build checks this). It runs right after the hero's
markup, so the print is in place when the page is first drawn. The runes follow the page's language:
ᛏᚢ᛫ᛋᚾᛅᚴᚴᛅᚱ᛫ᛋᚴᛅᛚᛏᛁᚾ᛫ᛋᚴᚱᛁᚢ on `/`, ᛏᚢ᛫ᛋᚾᛅᚴᚴᛁᚱ᛫ᛋᚴᛅᛚᛏᛁᚾ᛫ᛋᚴᚱᛁᚢᛁᚱ on `/nb`, and the last two words on a narrow screen.

When the hero is wider than 760 px, the copy sits in the print's dark left half; narrower, it stands under the print,
and at 390 px the download button is in the first screen.

## The download button and the install commands

Skald has no release yet. The button names the visitor's system («Skald for macOS») and says that the first version
is coming; it leads to that system's install commands (`#macos`, `#windows`, `#linux`), which say the same above the
commands. `src/scripts/system.js` names the system on `<html>` (`data-system`) before the page is drawn; a system it
does not know, a phone among them, keeps macOS.

The commands are the packages Skald's plan names: the shared tap `icebit-no/homebrew-tap` and bucket
`icebit-no/scoop-bucket` (D-14), winget, and the AUR package `skald-bin`. When the first release is out, the button
becomes a link to its download and the notice in the install section goes; check the winget id against the
manifest then.

## Addresses and languages

Nynorsk is at `/`, bokmål at `/nb`; the only other page is the 404 page, which says it in both. Each page
names both in `<link rel="alternate" hreflang>`. The language switch in the corner of the print, and the one in the
footer, are plain links; they also store the choice in `localStorage` (`skald-language`), and
`src/scripts/language.js`, in `<head>`, sends a reader who chose the other language to its page before anything is
drawn. Without storage the links still work; the choice is just not kept. Section addresses are the same in both
languages (`#modell`, `#agent`, `#installer`, `#sagaen`), so a switch keeps the reader's place.

No analytics, no cookies, nothing loaded from another host: the page asks nothing of any host but its own.

## CI

`.github/workflows/build.yaml` runs on every pull request and push to `main`, on GitHub's own runners: one job runs
`npm test` and `npm run build` with its checks; the other builds the image, starts it the way svalbard does
(unprivileged, read-only, no capabilities) and asks its nginx for each page from inside the container.
`release.yaml` builds and pushes the image when a release is published.

## Deploy

Publishing a GitHub release (a tag such as `v1.0.0`, not a pre-release) runs `.github/workflows/release.yaml`, which
builds the image for `linux/amd64` and pushes `ghcr.io/icebit-no/skald-site:<tag>` with the run's `GITHUB_TOKEN`.
The image reads Skald's releases while it builds, so a new Skald release shows in «Sagaen» once a new release of
this site is published.

The container is nginx (`nginx.conf`) on `127.0.0.1:3107`, run as an unprivileged user on a read-only file system.
nginx sets the security headers (a content security policy with `'self'` only), `Cache-Control` (immutable for
`/_astro/*`, `no-cache, no-transform` for the rest, so Cloudflare does not rewrite the pages) and gzip. It logs no
requests; Caddy's log for the host has them.

### First deploy (Thomas)

The site runs on svalbard like solveig.icebit.app's site, with a Caddy site of its own:

1. In [icebit-no/infra](https://github.com/icebit-no/infra), add `hosts/svalbard/apps/skald-site.nix` after
   `solveig-site.nix`: name `skald-site`, repo `icebit-no/skald-site`, image `ghcr.io/icebit-no/skald-site`,
   `initialTag = "v1.0.0"`, and the same `podman run` flags (`--network=host`, `--read-only`, `--tmpfs=/tmp`,
   `--cap-drop=all`, `--security-opt=no-new-privileges`). Add a Caddy site for `skald.icebit.app` as in
   `icebit-app.nix` (`tls` with `dns cloudflare`, `log`, `encode zstd gzip`) that does
   `reverse_proxy 127.0.0.1:3107`; nginx sets the headers, so the site needs no `header` block. Import the file in
   `flake.nix` beside the other apps.
2. In Cloudflare's `icebit.app` zone, add `skald` pointing at svalbard, proxied like the other app hosts (only
   Cloudflare reaches svalbard's ports 80 and 443). The zone is already in the "Edit zone DNS" token Caddy uses for
   DNS-01.
3. Publish release `v1.0.0` here. The release workflow creates the package `skald-site` in ghcr, private like the
   other sites' images; check that svalbard's registry login can read it.
4. Merge the infra pull request. Comin applies it and app-sync starts the site on the release.
5. Check: `curl -sI https://skald.icebit.app/` and `curl -sI https://skald.icebit.app/nb` answer 200 with the
   content security policy.

To check the image locally:

```sh
docker build --secret id=github_token,env=GITHUB_TOKEN -t skald-site .   # the secret is optional
docker run --rm --network host --read-only --tmpfs /tmp --cap-drop=all skald-site   # then curl 127.0.0.1:3107
```

## Credits

The structure, the language script, the build check, `nginx.conf` and the workflows follow
[solveig-site](https://github.com/icebit-no/solveig-site) (MIT). The fonts are under the SIL Open Font License; their
licences are in `src/fonts/`. The icon is Skald's, from its `assets/icon`.
