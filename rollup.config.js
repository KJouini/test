import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import postcssUrl from 'postcss-url';
import url from '@rollup/plugin-url';

export default {
  input: 'src/index.js',
  external: (id) =>
    id === 'react' ||
    id === 'react-dom' ||
    id === 'react/jsx-runtime' || id.startsWith('react/jsx-runtime'),
  output: [
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true }
  ],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    // (optionnel) si tu importes des images/ttf directement dans du JS/JSX
    url({
      include: [
        '**/*.png','**/*.jpg','**/*.jpeg','**/*.gif','**/*.webp','**/*.svg',
        '**/*.ttf','**/*.otf','**/*.woff','**/*.woff2'
      ],
      limit: 0,
      fileName: 'assets/[name]-[hash][extname]',
      emitFiles: true,
    }),
    postcss({
      extract: 'styles.css',
      minimize: true,
      plugins: [
        tailwind(),
        autoprefixer(),
        // ⬇️ DOIT être en DERNIER pour réécrire toutes les url(...) finales
        postcssUrl({
          url: 'copy',          // copie chaque fichier référencé
          assetsPath: 'assets', // vers dist/assets
          useHash: true,        // ajoute un hash (évite les collisions cache)
          // (facultatif) ignore http/data:
          filter: (asset) => !/^(data:|https?:)/.test(asset.url),
        }),
      ],
    }),
    esbuild({
      include: /\.[jt]sx?$/,
      jsx: 'automatic',
      jsxImportSource: 'react',
      target: 'es2018',
    }),
    commonjs(),
  ]
};
