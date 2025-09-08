import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import url from '@rollup/plugin-url';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

/** Post-fix: force url(./assets/...) in dist/styles.css */
function fixCssRelativeUrls() {
  return {
    name: 'fix-css-relative-urls',
    async writeBundle() {
      const cssPath = join('dist', 'styles.css');
      try {
        let css = await fs.readFile(cssPath, 'utf8');
        // remplace url(assets/...) ou url('assets/...') ou url("assets/...")
        css = css.replace(
          /url\(\s*(['"]?)(?!data:|https?:|\/\/)(assets\/)/g,
          'url($1./$2'
        );
        await fs.writeFile(cssPath, css, 'utf8');
      } catch (e) {
        this.warn(`[fix-css-relative-urls] skip (${e.message})`);
      }
    }
  };
}

export default {
  input: 'src/index.js',
  external: ['react', 'react-dom'],
  output: [
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true }
  ],
  plugins: [
    // Clean dist à chaque build
    del({ targets: 'dist/*' }),

    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),

    // Assets importés depuis le JS (images uniquement)
    url({
      include: ['**/*.png','**/*.jpg','**/*.jpeg','**/*.gif','**/*.webp','**/*.svg'],
      limit: 0,
      destDir: 'dist/assets',
      fileName: '[name]-[hash][extname]'
    }),

    // CSS + Tailwind + tentative de rebase (on garde, mais on sécurise avec fixCssRelativeUrls)
    postcss({
      plugins: [
        tailwind(),
        autoprefixer(),
        postcssUrl([{ url: 'rebase' }]) // l'ordre exact peut varier selon versions
      ],
      extract: 'styles.css',
      minimize: true
    }),

    esbuild({ include: /\.[jt]sx?$/, jsx: 'automatic', target: 'es2018' }),

    // Copie brute des assets (fonts, icons, images) → dist/assets
    // NOTE: src = dossier 'assets' (pas **/*) pour éviter dist/assets/assets/...
    copy({
      targets: [{ src: 'src/assets', dest: 'dist' }],
      hook: 'writeBundle'
    }),

    // Patch final garantissant ./assets/... dans le CSS
    fixCssRelativeUrls()
  ]
};
