import * as functions from "firebase-functions";

import {parseIndexedFields} from "./utils";
import {get} from "lodash";

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface FirestoreGeoPoint {
  _latitude: number;
  _longitude: number;
}

interface FirestoreReference {
  _path: {
    segments: string[];
  }
}

const isDate = (value: any): value is FirestoreTimestamp =>
  !!value &&
  !!value.hasOwnProperty &&
  value.hasOwnProperty("_seconds") &&
  value.hasOwnProperty("_nanoseconds");

const isGeoPoint = (value: any): value is FirestoreGeoPoint =>
  !!value &&
  !!value.hasOwnProperty &&
  value.hasOwnProperty("_latitude") &&
  value.hasOwnProperty("_longitude");

const isReference = (value: any): value is FirestoreReference =>
  !!value &&
  !!value.hasOwnProperty &&
  value.hasOwnProperty("_path") &&
  value._path.hasOwnProperty('segments') &&
  Array.isArray(value._path.segments) &&
  typeof value._path.segments[0] === 'string';

export const toAppSearch = (
  data: Record<string, any> = {}
): Record<string, any> => {
  const indexedFields = parseIndexedFields(process.env.INDEXED_FIELDS);

  return Object.entries(indexedFields).reduce((acc, [_, fieldName]) => {
    let fieldValue;
    let parsedFieldName = fieldName.split("::")[0];
    let renameTo = fieldName.split("::")[1];

    // If a user specified 'a::1' and there was literally an 'a::1' field, then dont attempt any renaming
    if (data.hasOwnProperty(fieldName)) {
      fieldValue = data[fieldName];
      parsedFieldName = fieldName;
      renameTo = "";
    } else if (data.hasOwnProperty(parsedFieldName)) {
      fieldValue = data[parsedFieldName];
    } else {
      fieldValue = get(data, parsedFieldName.split("__").join("."));
    }

    if (fieldValue === undefined) return acc;

    // App Search only supports lowercased alpha numeric names or underscores
    const processedFieldName = (renameTo || parsedFieldName)
      .replace(/[^A-Za-z0-9_]/g, "")
      .toLowerCase();

    if (processedFieldName === "") {
      functions.logger.warn(
        `Skipped indexing a field named ${parsedFieldName}. Attempted to rename the field to remove special characters which resulted in an empty string. Please use the "::" syntax to rename this field. Example: ${parsedFieldName}::some_other_field_name.`
      );
      return acc;
    }

    if (isDate(fieldValue)) {
      return {
        ...acc,
        [processedFieldName]: new Date(
          fieldValue._seconds * 1000
        ).toISOString(),
      };
    }

    if (isGeoPoint(fieldValue)) {
      return {
        ...acc,
        [processedFieldName]: `${fieldValue._latitude},${fieldValue._longitude}`,
      };
    }

    if (isReference(fieldValue)) {
      return {
        ...acc,
        [processedFieldName]: fieldValue._path.segments.join('/'),
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

          if (isGeoPoint(arrayFieldValue)) {
            return [
              ...acc,
              `${arrayFieldValue._latitude},${arrayFieldValue._longitude}`,
            ];
          }

          if (isReference(arrayFieldValue)) {
            return [
              ...acc,
              arrayFieldValue._path.segments.join('/'),
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
