import * as admin from "firebase-admin";

// @ts-ignore There are no type definitions for this library
import * as AppSearchClient from "@elastic/app-search-node";

export const getNewAppSearchClient = (): any => {
  return new AppSearchClient(
    undefined,
    process.env.APP_SEARCH_API_KEY,
    () => `${process.env.ENTERPRISE_SEARCH_URL}/api/as/v1/`
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
