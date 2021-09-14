import * as functions from "firebase-functions";
import { toAppSearch } from "./toAppSearch";

import { getNewAppSearchClient } from "./utils";

const appSearchClient = getNewAppSearchClient();

// We separate and curry this function from shipToElastic so we can test with less mocking
export const handler = (client: any) => {
  return async (
    change: functions.Change<functions.firestore.DocumentSnapshot>
  ) => {
    try {
      if (change.before.exists === false) {
        functions.logger.info(`Creating document`, { id: change.after.id });
        client.indexDocuments(process.env.APP_SEARCH_ENGINE_NAME, [
          {
            id: change.after.id,
            ...toAppSearch(change.after.data()),
          },
        ]);
      } else if (change.after.exists === false) {
        functions.logger.info(`Deleting document`, { id: change.before.id });
        client.destroyDocuments(process.env.APP_SEARCH_ENGINE_NAME, [
          change.before.id,
        ]);
      } else {
        functions.logger.info(`Updating document`, { id: change.after.id });
        client.indexDocuments(process.env.APP_SEARCH_ENGINE_NAME, [
          {
            id: change.after.id,
            ...toAppSearch(change.after.data()),
          },
        ]);
      }
      return change.after;
    } catch (e) {
      functions.logger.error(`Error while shipping document to Elastic`, {
        change: change,
      });
      throw e;
    }
  };
};

// Note that in extensions, functions get declared slightly differently then typical extensions:
// https://firebase.google.com/docs/extensions/alpha/construct-functions#firestore
// Also note that tyipcally in a function you specify the path in the call to `document` like `/${config.collectionName}/{documentId}`.
// In an extension, the path is specified in extension.yaml, in eventTrigger.
export const shipToElastic = functions.handler.firestore.document.onWrite(
  handler(appSearchClient)
);
