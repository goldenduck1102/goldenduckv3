import { defineConfig } from 'vite';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0];

function pagesAssetPaths(html) {
  const normalized = html.replace(/(["'\s,])\/assets\//g, '$1./assets/');
  if (!repository) return normalized;
  return normalized.replace(
    /(<meta\b[^>]*property="og:image"[^>]*content=")\.\/assets\//g,
    `$1https://${owner}.github.io/${repository}/assets/`,
  );
}

export default defineConfig({
  base: repository ? `/${repository}/` : '/',
  plugins: [{
    name: 'pages-public-asset-paths',
    transformIndexHtml: { order: 'pre', handler: pagesAssetPaths },
  }],
});
