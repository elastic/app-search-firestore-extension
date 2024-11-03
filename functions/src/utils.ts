import * as admin from "firebase-admin";

// @ts-ignore There are no type definitions for this library
import * as AppSearchClient from "@elastic/app-search-node";

// @ts-ignore There are no type definitions for this library
import * as AppSearchLowLevelClient from "@elastic/app-search-node/lib/client";
import { isEqual, get } from "lodash";
import { firestore } from "firebase-admin";
import DocumentSnapshot = firestore.DocumentSnapshot;
import { Change } from "firebase-functions";

export const getNewAppSearchClient = (): any => {
  return new AppSearchClient(
    undefined,
    process.env.APP_SEARCH_API_KEY,
    () => `${process.env.ENTERPRISE_SEARCH_URL}/api/as/v1/`
  );
};

export const getNewAppSearchLowLevelClient = (): any => {
  return new AppSearchLowLevelClient(
    process.env.APP_SEARCH_API_KEY,
    `${process.env.ENTERPRISE_SEARCH_URL}/api/as/v1/`
  );
};

export const getFirestore = (): FirebaseFirestore.Firestore => {
  // initialize the application using either:
  // 1) the Google Credentials in the GOOGLE_APPLICATION_CREDENTIALS environment variable to connect to a cloud instance
  // 2) the FIRESTORE_EMULATOR_HOST environment variable to connect to an emulated instance
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  return admin.firestore();
};

export const parseIndexedFields = (indexedFields: string = ""): string[] => {
  return indexedFields.split(",").map((f) => f.trim());
};

export const hasRelevantChanges = <T = any>(
  before: T,
  after: T,
  fields: string[]
): boolean => {
  for (const field of fields) {
    const beforeFieldMatch = get(before, field);
    const afterFieldMatch = get(after, field);
    if (!isEqual(beforeFieldMatch, afterFieldMatch)) {
      return true;
    }
  }
  return false;
};

export const shouldUpdate = (change: Change<DocumentSnapshot>): boolean => {
  const indexedFields = parseIndexedFields(process.env.INDEXED_FIELDS);
  const fieldsToCheck: any[] = [];

  for (const field of indexedFields) {
    let parsedFieldName = field.split("::")[0];
    parsedFieldName = parsedFieldName.split("__").join(".");
    fieldsToCheck.push(parsedFieldName);
  }

  return hasRelevantChanges(
    change.before.data(),
    change.after.data(),
    fieldsToCheck
  );
};
