# Builds the static site, then serves it with nginx (nginx.conf). Base images are pinned by digest; Dependabot
# proposes new ones.
FROM --platform=$BUILDPLATFORM node:24.22.3-alpine3.24@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS build
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
