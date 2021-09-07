import * as functions from "firebase-functions";

import { getNewAppSearchClient } from "./utils";

const appSearchClient = getNewAppSearchClient();

export const search = functions.https.onRequest(async (request, response) => {
  const query = request.query?.query;
  const searchResponse = await appSearchClient.search(
    process.env.APP_SEARCH_ENGINE_NAME,
    query || ""
  );
  response.send(searchResponse);
});

// TODO handle nested fields
// TODO handle only index specified fields: process.env.INDEXED_FIELDS
// TODO index data with correct types? ... that depends on if we want filtering...
// Note that in extensions, functions get declared slightly differently then typical extensions:
// https://firebase.google.com/docs/extensions/alpha/construct-functions#firestore
// Also note that tyipcally in a function you specify the path in the call to `document` like `/${config.collectionName}/{documentId}`.
// In an extension, the path is specified in extension.yaml, in eventTrigger.
exports.shipToElastic = functions.handler.firestore.document.onWrite(
  async (change) => {
    if (change.before.exists === false) {
      // TODO Consider log levels... functions.logger.info("Hello logs!", { structuredData: true });
      console.log(`Creating document: ${change.after.id}`);
      appSearchClient.indexDocuments(process.env.APP_SEARCH_ENGINE_NAME, [
        {
          id: change.after.id,
          ...change.after.data(),
        },
      ]);
    } else if (change.after.exists === false) {
      console.log(`Deleting document: ${change.before.id}`);
      appSearchClient.destroyDocuments(process.env.APP_SEARCH_ENGINE_NAME, [
        change.before.id,
      ]);
    } else {
      console.log(`Updating document: ${change.after.id}`);
      appSearchClient.indexDocuments(process.env.APP_SEARCH_ENGINE_NAME, [
        {
          id: change.after.id,
          ...change.after.data(),
        },
      ]);
    }
    return change.after;
  }
);
