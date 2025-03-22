const eslintConfig = require('@adhamu/zero/eslint')

module.exports = [
  ...eslintConfig,
  {
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'no-restricted-syntax': 'off',
      'no-await-in-loop': 'off',
      'no-continue': 'off',
      'no-console': 'off',
    },
  },
]
