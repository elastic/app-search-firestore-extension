import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore";

import { getFirestore, getNewAppSearchClient } from "../utils";
import { batchArray, prepareDocument } from "./utils";

const appSearchClient = getNewAppSearchClient();

const firestore = getFirestore();

const collectionPath = process.env.COLLECTION_PATH;

if (!collectionPath) {
  throw Error("Please provide a COLLECTION_PATH environment variable");
}

const indexedFields = (process.env.INDEXED_FIELDS || "").split(",");

if (indexedFields.length === 0 || indexedFields[0].length === 0) {
  throw Error("Error reading INDEXED_FIELDS environment variable");
}

const batchSize = parseInt(process.env.BATCH_SIZE || "") || 50;

const appSearchEngineName = process.env.APP_SEARCH_ENGINE_NAME;

if (!appSearchEngineName) {
  throw Error("Please provide a APP_SEARCH_ENGINE_NAME environment variable");
}

const main = async () => {
  console.log(`Importing all documents from collection ${collectionPath}`);

  let collectionDocs: QueryDocumentSnapshot[] = [];
  let preparedDocs: Record<string, unknown>[];

  try {
    const querySnapshot = await firestore.collectionGroup(collectionPath).get();
    collectionDocs = querySnapshot.docs;

    console.log(`Retrieved ${collectionDocs.length} documents`);
  } catch (e) {
    console.error(
      `Error retrieving documents for collection ${collectionPath}`
    );
    throw e;
  }

  preparedDocs = collectionDocs.map((document) =>
    prepareDocument(document, indexedFields)
  );

  const documentBatches = batchArray(preparedDocs, batchSize);

  console.log(
    `Submitting  ${collectionDocs.length} documents in ${documentBatches.length} batches of size ${batchSize} to engine ${appSearchEngineName}`
  );

  for (const [index, documentBatch] of documentBatches.entries()) {
    try {
      console.log(
        `Submitting  ${documentBatch.length} documents as a part of batch ${index}`
      );

      await appSearchClient.indexDocuments(appSearchEngineName, documentBatch);
    } catch (e) {
      console.error(
        `Error submitting batch ${index} to ${appSearchEngineName}`
      );
      throw e;
    }

    console.log(
      `Successfully submitted batch ${index} to engine ${appSearchEngineName}`
    );
  }

  console.log(
    `Successfully imported all ${collectionDocs.length} documents to engine ${appSearchEngineName}`
  );
};

main().then(() => {
  process.exit(0);
});
