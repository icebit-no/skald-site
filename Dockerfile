# Builds the static site, then serves it with nginx (nginx.conf). Base images are pinned by digest; Dependabot
# proposes new ones.
FROM --platform=$BUILDPLATFORM node:26.13.1-alpine3.24@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build
WORKDIR /site
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# «Sagaen» reads Skald's releases from GitHub. A token passed as the secret github_token raises GitHub's limit for
# the request (src/releases.ts reads it from /run/secrets); without one it is made anonymously.
RUN --mount=type=secret,id=github_token npm test && npm run build

FROM nginx:1.31.9-alpine3.24@sha256:fb4658584bd9a916ffb6f6e365f97c25cfdb2923801f551ea08356e695f14ff7
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /site/dist /usr/share/nginx/html
# The image's own entry point rewrites files in /etc/nginx, which an unprivileged user on a read-only file system
# cannot; nginx.conf needs none of it.
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
USER nginx
# Caddy on svalbard sends skald.icebit.app's requests to this port on the host's loopback.
EXPOSE 3107
