module.exports = {
  ...require('@adhamu/zero/jest'),
  transform: { '^.+\\.ts(x)?$': '@swc/jest' },
}
