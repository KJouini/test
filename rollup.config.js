import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import url from '@rollup/plugin-url';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

// Patch CRA-friendly: assure url(./assets/...) dans dist/styles.css
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
    del({ targets: 'dist/*' }),

    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    esbuild({ include: /\.[jt]sx?$/, jsx: 'automatic', target: 'es2018' }),

    // CSS: Tailwind v4 + autoprefixer ; pas de postcss-url (on ne gère plus de fonts ici)
    postcss({
      plugins: [tailwind(), autoprefixer()],
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

    // Copie **seulement** icônes/images de la lib → dist/assets
    copy({
      targets: [
        { src: 'src/assets/icons/**/*',  dest: 'dist/assets/icons' },
        { src: 'src/assets/images/**/*', dest: 'dist/assets/images' }
      ],
      hook: 'writeBundle',
      overwrite: true,
      flatten: false
    }),

    fixCssRelativeUrls()
  ]
};
