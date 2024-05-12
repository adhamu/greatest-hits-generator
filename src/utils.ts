export const normalizeString = (str: string) =>
  str.toLowerCase().replace('.', '')

export const capitalize = (str: string) =>
  str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
