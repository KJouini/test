// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import url from '@rollup/plugin-url';
import del from 'rollup-plugin-delete';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

/** On ne bundle pas de fonts : retire toute @font-face résiduelle */
const stripFontFace = () => ({
  postcssPlugin: 'strip-font-face',
  AtRule: { 'font-face': (at) => at.remove() },
});
stripFontFace.postcss = true;

/** Inliner robuste : remplace url(./assets/icons/*.svg) par data:... dans dist/styles.css */
function inlineCssIcons(options = {}) {
  const roots = options.roots ?? ['src/assets/icons', 'src/styles/assets/icons'];
  const re = /url\(\s*(['"]?)(?:\.\/)?assets\/icons\/([^'")]+\.svg)\1\s*\)/g;

  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const toDataUri = (svgText) => {
    const compact = svgText.replace(/\r?\n/g, '').replace(/\t/g, ' ').replace(/\s{2,}/g, ' ');
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(compact);
  };

  return {
    name: 'inline-css-icons',
    async writeBundle() {
      const cssPath = join('dist', 'styles.css');
      let css;
      try {
        css = await fs.readFile(cssPath, 'utf8');
      } catch { return; }

      // collect filenames
      const files = [...css.matchAll(re)].map((m) => m[2]);
      if (files.length === 0) return;

      // build replacements
      const replacements = new Map();
      for (const file of files) {
        for (const root of roots) {
          try {
            const svg = await fs.readFile(join(root, file), 'utf8');
            replacements.set(file, toDataUri(svg));
            break;
          } catch { /* try next root */ }
        }
      }

      // apply replacements
      for (const [file, dataUri] of replacements.entries()) {
        const occ = new RegExp(
          `url\\(\\s*(['"]?)(?:\\.\\/)?assets\\/icons\\/${escapeRe(file)}\\1\\s*\\)`,
          'g'
        );
        css = css.replace(occ, (m, q) => `url(${q}${dataUri}${q})`);
      }

      await fs.writeFile(cssPath, css, 'utf8');
    },
  };
}

export default {
  input: 'src/index.js',
  external: ['react', 'react-dom'],
  output: [
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
  ],
  plugins: [
    // Nettoyage à chaque build (et éventuel dossier parasite)
    del({ targets: ['dist/*', 'src/styles/dist'] }),

    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    esbuild({ include: /\.[jt]sx?$/, jsx: 'automatic', target: 'es2018' }),

    // CSS Tailwind v4 (pas d’assets ici, juste styles)
    postcss({
      plugins: [tailwind(), autoprefixer(), stripFontFace()],
      extract: 'styles.css',
      minimize: true,
    }),

    // Images importées depuis le JS → dist/assets
    url({
      include: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.svg'],
      limit: 0,
      destDir: 'dist/assets',
      fileName: '[name]-[hash][extname]',
    }),

    // Inliner post-build des icônes référencées par le CSS
    inlineCssIcons(),
  ],
};
