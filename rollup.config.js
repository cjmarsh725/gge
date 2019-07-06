import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/core/gge.js',
  cache: true,
  output: {
    file: 'dist/gge.js',
    name: 'gge',
    format: 'iife'
  },
  plugins: [
    resolve()
  ]
};