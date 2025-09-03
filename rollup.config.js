import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import url from '@rollup/plugin-url';

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

    // Pour les imports d’images depuis le JS (ex: import img from './Orif.png')
    url({
      include: ['**/*.png','**/*.jpg','**/*.jpeg','**/*.gif','**/*.svg','**/*.ttf','**/*.woff','**/*.woff2'],
      limit: 0,                 // toujours copier (pas d’inline)
      destDir: 'dist/assets',   // sortie des fichiers copiés
      fileName: '[name]-[hash][extname]'
    }),

    // Pour les URL dans la CSS (fonts, svg d’icônes…), copie + réécriture
    postcss({
      plugins: [
        tailwind(),
        autoprefixer(),
        postcssUrl({
          url: 'copy',
          assetsPath: 'assets', // => dist/assets/
          useHash: true
        })
      ],
      extract: 'styles.css',
      minimize: true
    }),

    esbuild({ include: /\.[jt]sx?$/, jsx: 'automatic', target: 'es2018' })
  ]
};
