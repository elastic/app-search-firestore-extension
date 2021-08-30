import * as functions from "firebase-functions";
//@ts-ignore There are no type definitions for this library
import * as AppSearchClient from "@elastic/app-search-node";

// TODO This will eventually become configuration from the extension
// TODO Make this an extension
const config = {
  indexName: "pokemon",
  collectionName: "pokemon",
  appSearchAPIKey: "private-79iadc5dzd3qxgfgd9w9ryc7",
  appSearchEngineName: "pokemon",
  appSearchLocation: "http://localhost:3002",
};

const client = new AppSearchClient(
  undefined,
  config.appSearchAPIKey,
  () => `${config.appSearchLocation}/api/as/v1/`
);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
// TODO This could be come the search function evenually
// What of search should be supported? Do we support filtering? Can users do a full search including faceting and filter? That would let them use search-ui
// However, that would mean they'd need to add those fields to the index, and I'm not sure if we'd want to do that or not? Perhaps it's better just to support
// queries on a single field
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// TODO handle nested fields
// TODO handle only index specified fields
// TODO index data with correct types? ... that depends on if we want filtering...
exports.shipToElastic = functions.firestore
  .document(`/${config.collectionName}/{documentId}`)
  .onWrite(async (change) => {
    if (change.before.exists === false) {
      // TODO Consider log levels
      console.log(`Creating document: ${change.after.id}`);
      client.indexDocuments(config.appSearchEngineName, [
        {
          id: change.after.id,
          ...change.after.data(),
        },
      ]);
    } else if (change.after.exists === false) {
      console.log(`Deleting document: ${change.before.id}`);
      client.destroyDocuments(config.appSearchEngineName, [change.before.id]);
    } else {
      console.log(`Updating document: ${change.after.id}`);
      client.indexDocuments(config.appSearchEngineName, [
        {
          id: change.after.id,
          ...change.after.data(),
        },
      ]);
    }
    return change.after;
  });
