import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/core/gge.js',
  cache: true,
  output: {
    file: 'dist/gg.js',
    name: 'GG',
    format: 'iife'
  },
  plugins: [
    resolve()
  ]
};