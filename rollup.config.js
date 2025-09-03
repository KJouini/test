import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import postcssUrl from 'postcss-url';
import url from '@rollup/plugin-url'; // ✅ pour importer PNG/JPG/SVG depuis le JS
import font from "rollup-plugin-font";

export default {
  input: 'src/index.js',
  external: ['react', 'react-dom'], // ta lib reste agnostique
  output: [
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true }
  ],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    commonjs(),

    // ✅ Gère les imports d'images depuis le code JS/JSX (ex: import img from './foo.png')
    url({
      include: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
      limit: 0, // 0 = toujours copier (pas inline)
      fileName: 'assets/[name]-[hash][extname]' // sort dans dist/assets
    }),

    // ✅ Gère Tailwind + copie/rewriting des URL(…) dans ton CSS (fonts, svg…)
    postcss({
      plugins: [
        tailwind(),
        postcssUrl({
          // copie chaque fichier référencé par url(…) dans le CSS
          url: 'copy',
          assetsPath: 'dist/assets',  // destination sur disque
          useHash: true,              // nom de fichier hashé
          publicPath: 'assets'        // réécriture dans le CSS -> url("assets/xxx.ext")
        }),
        autoprefixer(),
        font()
      ],
      extract: 'styles.css',      // génère dist/styles.css
      minimize: true,
      sourceMap: false
    }),

    esbuild({
      include: /\.[jt]sx?$/,
      jsx: 'automatic', // React 17+
      target: 'es2018'
    })
  ]
};
