import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore";

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

export const prepareDocument = (
  document: QueryDocumentSnapshot,
  fields: string[]
): Record<string, unknown> => {
  const documentData = document.data();
  const newDocument = fields.reduce((acc, field) => {
    acc[field] = documentData[field];
    return acc;
  }, {} as Record<string, unknown>);
  newDocument.id = document.id;
  return newDocument;
};
