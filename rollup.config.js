import path from 'node:path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';            // ⬅️ NEW
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import postcssUrl from 'postcss-url';

const dist = path.resolve('dist');

export default {
  input: 'src/index.js',
  external: ['react', 'react-dom'],
  output: [
    { file: path.join(dist, 'index.esm.js'), format: 'esm', sourcemap: true },
    { file: path.join(dist, 'index.cjs.js'), format: 'cjs', sourcemap: true },
  ],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),

    // ⬇️ Images importées depuis le JS (png/jpg/svg/webp/gif)
    url({
      include: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.svg'],
      limit: 0, // jamais inline; toujours copier dans dist/assets
      fileName: 'assets/[name]-[hash][extname]',
    }),

    // CSS (Tailwind v4) + réécriture/copîe des url() de CSS (fonts, svg…)
    postcss({
      extract: path.join(dist, 'styles.css'),
      minimize: true,
      sourceMap: true,
      plugins: [
        tailwind(),
        // 1) Inline tout petits assets (ex: minuscules SVG)
        postcssUrl({ url: 'inline', maxSize: 4 }), // Ko

        // 2) Copie le reste vers dist/assets et réécrit les URL -> assets/<hash>.<ext>
        postcssUrl({
          url: 'copy',
          useHash: true,
          assetsPath: path.join(dist, 'assets'),
          basePath: path.resolve('src'), // les url('../assets/...') depuis src/styles => src/assets/...
        }),

        autoprefixer(),
      ],
    }),

    esbuild({
      include: /\.[jt]sx?$/,
      jsx: 'automatic',
      target: 'es2018',
    }),
  ],
};
