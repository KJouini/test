import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  input: 'src/index.js',
  external: ['react', 'react-dom'],
  output: [
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
  ],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    postcss({
      plugins: [
      postcssUrl({
        filter: '**/*.{woff2,woff,ttf,otf,svg,png,jpg,jpeg,gif}',
        url: 'copy',
        useHash: true,
        assetsPath: 'assets', // => dist/assets/*
      }),
        tailwind(),
        autoprefixer(),
      ],
      extract: 'styles.css',
      minimize: true,
    }),
    esbuild({ include: /\.[jt]sx?$/, jsx: 'automatic', target: 'es2018' }),
  ],
};
