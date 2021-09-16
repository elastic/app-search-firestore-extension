import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore";
import { toAppSearch } from "../toAppSearch";

import { getFirestore, getNewAppSearchClient } from "../utils";
import { batchArray } from "./utils";

const appSearchClient = getNewAppSearchClient();

const firestore = getFirestore();

const collectionPath = process.env.COLLECTION_PATH;

if (!collectionPath) {
  throw Error("Please provide a COLLECTION_PATH environment variable");
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

  preparedDocs = collectionDocs.map((document) => ({
    id: document.id,
    ...toAppSearch(document.data()),
  }));

  const documentBatches = batchArray(preparedDocs, batchSize);

  console.log(
    `Submitting  ${collectionDocs.length} documents in ${documentBatches.length} batches of size ${batchSize} to engine ${appSearchEngineName}`
  );

  for (const [index, documentBatch] of documentBatches.entries()) {
    try {
      console.log(
        `Submitting  ${documentBatch.length} documents as a part of batch ${index}`
      );

      const response = await appSearchClient.indexDocuments(
        appSearchEngineName,
        documentBatch
      );

      response.forEach((r: { errors: string[] }) =>
        r.errors.forEach(console.error)
      );
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
