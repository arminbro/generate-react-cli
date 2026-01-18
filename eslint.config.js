import antfu from '@antfu/eslint-config';

export default antfu({
  // Node.js project - no browser/framework stuff needed
  vue: false,
  react: false,
  typescript: false,

  // Style preferences
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },

  // Ignore patterns
  ignores: [
    'node_modules',
    'dist',
    'coverage',
  ],

  // Rule overrides
  rules: {
    'no-console': 'off', // CLI tool - console output is expected
    'node/prefer-global/process': 'off', // process is always available in Node.js
  },
});
