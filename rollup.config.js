// rollup.config.js
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
  // 👇 très important : externalise aussi le sous-module jsx-runtime
  external: (id) =>
    id === 'react' ||
    id === 'react-dom' ||
    id === 'react/jsx-runtime' || // <-- ajoute ceci
    id.startsWith('react/jsx-runtime'),
  output: [
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
  ],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    url({
      include: [
        '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.svg',
        '**/*.ttf', '**/*.otf', '**/*.woff', '**/*.woff2'
      ],
      limit: 0,
      fileName: 'assets/[name]-[hash][extname]',
      emitFiles: true,
    }),
    postcssUrl({ url: 'inline' }),
    postcss({ plugins: [tailwind(), autoprefixer()], extract: 'styles.css', minimize: true }),
    esbuild({
      include: /\.[jt]sx?$/,
      jsx: 'automatic',        // JSX runtime moderne
      jsxImportSource: 'react',
      target: 'es2018',
    }),
    commonjs(),
  ],
};
