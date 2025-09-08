// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import postcssUrl from 'postcss-url';
import url from '@rollup/plugin-url';
import del from 'rollup-plugin-delete';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

// Retire toute règle @font-face résiduelle (sécurité)
const stripFontFace = () => ({
  postcssPlugin: 'strip-font-face',
  AtRule: { 'font-face': (atRule) => atRule.remove() }
});
stripFontFace.postcss = true;

// Forcer url(./assets/...) si jamais un asset non inliné subsiste
function fixCssRelativeUrls() {
  return {
    name: 'fix-css-relative-urls',
    async writeBundle() {
      const cssPath = join('dist', 'styles.css');
      try {
        let css = await fs.readFile(cssPath, 'utf8');
        css = css.replace(/url\(\s*(['"]?)(?!data:|https?:|\/\/)(assets\/)/g, 'url($1./$2');
        await fs.writeFile(cssPath, css, 'utf8');
      } catch {}
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
    // Nettoyage : dist/* et le dossier parasite éventuel
    del({ targets: ['dist/*', 'src/styles/dist'] }),

    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    esbuild({ include: /\.[jt]sx?$/, jsx: 'automatic', target: 'es2018' }),

    // CSS: Tailwind v4 + autoprefixer
    // + postcss-url pour INLINE **uniquement** les SVG (basePath='src')
    postcss({
      plugins: [
        tailwind(),
        autoprefixer(),
        stripFontFace(),
        postcssUrl({
          filter: '**/*.svg',
          url: 'inline',
          basePath: 'src' // tes URLs CSS sont ./assets/icons/... → on résout depuis src/
        })
      ],
      extract: 'styles.css',
      minimize: true
    }),

    // Actifs importés depuis le JS (images raster)
    url({
      include: ['**/*.png','**/*.jpg','**/*.jpeg','**/*.gif','**/*.webp'],
      limit: 0,
      destDir: 'dist/assets',
      fileName: '[name]-[hash][extname]'
    }),

    // Pas de copy() → fini les doublons "assets/assets"
    fixCssRelativeUrls()
  ]
};
