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

export const search = functions.https.onRequest(async (request, response) => {
  const query = request.query?.query;
  const searchResponse = await client.search(
    config.appSearchEngineName,
    query || ""
  );
  response.send(searchResponse);
});

// TODO handle nested fields
// TODO handle only index specified fields
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
  }
);
