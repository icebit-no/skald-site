# skald-site

The public site of Skald at skald.icebit.app. Skald itself, its design and its plan are in icebit-no/skald
(`docs/design.md`, section Site and Identity; `docs/plan.md`, M6; `docs/decisions.md`); the README here says how this
site is built and deployed.

## Rules

- Code, comments and commit messages are in English. Everything a visitor reads is Norwegian, in **both nynorsk and
  bokmål**: nynorsk is the default (`/`), bokmål is under `/nb`. A text is changed in both languages in the same
  change; a test and the build fail otherwise.
- The site's words follow Skald's design: the text is «satt inn» where the cursor is, never «limt inn». Viking words
  appear only in «Sagaen», «ordskatt» and the tagline; everything else says plainly what it does.
- Describe Skald as icebit-no/skald's `docs/design.md` does; never promise a feature, a platform or a date it does not
  hold, and never link to a download that does not exist.
- Credit the National Library of Norway for every model it made. Error rates are shown only where they were measured
  the same way for every model (the National Library's paper); a model measured another way is drawn without a bar.
- No tracking, no cookies, nothing loaded from another host at runtime, no inline script or style, no style
  attribute written by a script (nginx's content security policy refuses them all). Fonts are self-hosted.
- Accessible: real links, text contrast at least 4.5:1, works at 320 px; the hero stands still when reduced motion is
  asked for.
- Only free, open-source dependencies, pinned to exact versions; base images and actions pinned by digest or SHA.
  Astro and as little else as possible.
- CI runs on GitHub's own runners (`ubuntu-latest`), never on self-hosted ones: the repository is public.
- Work on a branch `thomastvedt/<slug>` and open a pull request; publishing a release deploys.
