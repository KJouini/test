import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  input: 'src/index.js',
  external: ['react', 'react-dom'],
  output: [
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true }
  ],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),
    postcss({
      plugins: [tailwind(), autoprefixer()], // << IMPORTANT (pas tailwindcss() directement)
      extract: 'styles.css',
      minimize: true
    }),
    esbuild({
      include: /\.[jt]sx?$/,
      jsx: 'automatic',
      target: 'es2018'
    })
  ]
};
