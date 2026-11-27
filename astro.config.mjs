// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://skald.icebit.app',
  // Every address is built without a trailing slash: /nb, not /nb/.
  trailingSlash: 'never',
  build: {
    format: 'file',
    // nginx sends a content security policy without 'unsafe-inline', so no style or script may be inlined.
    inlineStylesheets: 'never',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
  devToolbar: { enabled: false },
});
