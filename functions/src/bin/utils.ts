export const batchArray = <T extends any>(
  array: Array<T>,
  size: number
): Array<Array<T>> => {
  const batches = [];
  let index = 0;

  while (index < array.length) {
    batches.push(array.slice(index, index + size));
    index += size;
  }

  return batches;
};
