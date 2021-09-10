import { parseIndexedFields } from "./utils";
import { get } from "lodash";

const isDate = (value: any): boolean =>
  !!(value?._seconds && value?._nanoseconds);

const isGeo = (value: any): boolean =>
  !!(value?._latitude && value?._longitude);

export const toAppSearch = (
  data: Record<string, any> = {}
): Record<string, any> => {
  const indexedFields = parseIndexedFields(process.env.INDEXED_FIELDS);

  return Object.entries(indexedFields).reduce((acc, [_, fieldName]) => {
    const fieldValue = get(data, fieldName);
    if (fieldValue === undefined) return acc;

    // App search doesn't support dot notation so we need to join them with "__"
    const processedFieldName = fieldName.split(".").join("__");

    if (isDate(fieldValue)) {
      return {
        ...acc,
        [processedFieldName]: new Date(
          fieldValue._seconds * 1000
        ).toISOString(),
      };
    }

    if (isGeo(fieldValue)) {
      return {
        ...acc,
        [processedFieldName]: `${fieldValue._latitude},${fieldValue._longitude}`,
      };
    }

    if (Array.isArray(fieldValue)) {
      return {
        ...acc,
        [processedFieldName]: fieldValue.reduce((acc, arrayFieldValue) => {
          // App search does not support nested arrays, so ignore nested arrays
          if (Array.isArray(arrayFieldValue)) return acc;

          if (isDate(arrayFieldValue)) {
            return [
              ...acc,
              new Date(arrayFieldValue._seconds * 1000).toISOString(),
            ];
          }

          if (isGeo(arrayFieldValue)) {
            return [
              ...acc,
              `${arrayFieldValue._latitude},${arrayFieldValue._longitude}`,
            ];
          }

          return [...acc, arrayFieldValue];
        }, []),
      };
    }

    return {
      ...acc,
      [processedFieldName]: fieldValue,
    };
  }, {});
};
