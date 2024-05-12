export const string = {
  normalize: (str: string) => str.toLowerCase().replace('.', ''),
  capitalize: (str: string) =>
    str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
}
