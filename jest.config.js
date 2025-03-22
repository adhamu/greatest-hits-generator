const baseConfig = require('@adhamu/zero/jest')

module.exports = {
  ...baseConfig,
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
}
