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

// Sécurise le préfixe "./" pour CRA (au cas où postcss-url écrirait "assets/...").
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
    // Nettoyage systématique
    del({ targets: 'dist/*' }),

    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    esbuild({ include: /\.[jt]sx?$/, jsx: 'automatic', target: 'es2018' }),

    // CSS + Tailwind v4 + gestion d’assets via postcss-url (PAS de copy Rollup ici)
    postcss({
      plugins: [
        tailwind(),                    // Tailwind v4 PostCSS plugin
        autoprefixer(),
        // 1) Copier les FONTS vers dist/assets + réécrire les URLs
        postcssUrl({
          filter: '**/*.{woff2,woff,ttf,eot}',
          url: 'copy',
          basePath: 'src',            // nos URL CSS sont ./assets/... → résolues depuis "src"
          assetsPath: 'assets',       // sortie relative à dist/styles.css → dist/assets/...
          useHash: true
        }),
        // 2) Inliner les SVG d’icônes pour supprimer tout risque de chemin
        postcssUrl({
          filter: '**/*.svg',
          url: 'inline'               // mask-image marche très bien en inline
        })
        // pas de 'rebase' ici pour éviter les concat bizarres vue précédemment
      ],
      extract: 'styles.css',
      minimize: true
    }),

    // Images importées depuis le JS (pas indispensables, mais safe)
    url({
      include: ['**/*.png','**/*.jpg','**/*.jpeg','**/*.gif','**/*.webp'],
      limit: 0,
      destDir: 'dist/assets',
      fileName: '[name]-[hash][extname]'
    }),

    // Patch CRA-friendly
    fixCssRelativeUrls()
  ]
};
