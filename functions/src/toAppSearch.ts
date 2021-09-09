import { parseIndexedFields } from "./utils";
import { get } from "lodash";

export const toAppSearch = (data: object = {}): object => {
  const indexedFields = parseIndexedFields(process.env.INDEXED_FIELDS);

  return Object.entries(indexedFields).reduce((acc, [_, fieldName]) => {
    const fieldValue = get(data, fieldName);
    if (fieldValue === undefined) return acc;

    return {
      ...acc,
      [fieldName]: fieldValue,
    };
  }, {});
};
