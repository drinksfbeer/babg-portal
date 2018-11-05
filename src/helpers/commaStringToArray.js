const commaStringToArray = (string) => {
  if (!string || typeof string !== 'string') return [];
  return string
    .split(',')
    .filter(item => item)
    .map(item => item.trim());
};

export default commaStringToArray;
