import resolve from 'rollup-plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

export default {
  input: 'src/core/gge.js',
  cache: true,
  output: {
    file: 'dist/gge.js',
    name: 'gge',
    format: 'iife'
  },
  plugins: [
    resolve(),
    livereload(),
    serve()
  ]
};