// Skald's releases on GitHub, read once per build for «Sagaen». The site is built again to show a new release.
import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';

const repository = 'icebit-no/skald';
export const releasesUrl = `https://github.com/${repository}/releases`;
// Where a Docker build mounts the token it is given as a secret (Dockerfile, .github/workflows).
const tokenSecret = '/run/secrets/github_token';

export interface Release {
  tag: string;
  name: string;
  published: Date;
  url: string;
  /** The release notes as GitHub renders them. */
  html: string;
  prerelease: boolean;
}

interface GitHubRelease {
  tag_name: string;
  name: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  html_url: string;
  body_html?: string;
}

/** A token raises GitHub's limit for the build machine; without one the request is made anonymously. */
function token(): string | undefined {
  const fromEnvironment = process.env.GITHUB_TOKEN?.trim();
  if (fromEnvironment) {
    return fromEnvironment;
  }

  return existsSync(tokenSecret) ? readFileSync(tokenSecret, 'utf8').trim() || undefined : undefined;
}

async function fetchReleases(): Promise<Release[]> {
  const auth = token();
  const response = await fetch(`https://api.github.com/repos/${repository}/releases?per_page=100`, {
    headers: {
      Accept: 'application/vnd.github.html+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'skald-site-build',
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub answered ${response.status} for ${repository}'s releases: ${await response.text()}`);
  }

  const list = (await response.json()) as GitHubRelease[];
  return list
    .filter((release) => !release.draft && release.published_at)
    .map((release) => ({
      tag: release.tag_name,
      name: release.name?.trim() || release.tag_name,
      published: new Date(release.published_at!),
      url: release.html_url,
      html: release.body_html ?? '',
      prerelease: release.prerelease,
    }))
    .sort((a, b) => b.published.getTime() - a.published.getTime());
}

let pending: Promise<Release[]> | undefined;

/** Both language versions of the page show the same list from one request. */
export function releases(): Promise<Release[]> {
  pending ??= fetchReleases();
  return pending;
}
