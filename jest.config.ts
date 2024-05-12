export default {
  ...require('@adhamu/zero/jest'),
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
}
