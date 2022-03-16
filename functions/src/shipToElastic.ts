import { Change, handler as fireHandler, logger } from "firebase-functions";
import { firestore } from "firebase-admin";

import { getNewAppSearchClient, shouldUpdate } from "./utils";
import { toAppSearch } from "./toAppSearch";
import DocumentSnapshot = firestore.DocumentSnapshot;

const appSearchClient = getNewAppSearchClient();

// We separate and curry this function from shipToElastic, so we can test with less mocking
export const handler = (client: any) => {
  return async (change: Change<DocumentSnapshot>) => {
    logger.info(`Received request to ship to ship to Elastic`, {
      change,
    });
    if (change.before.exists === false) {
      logger.info(`Creating document`, { id: change.after.id });
      try {
        client.indexDocuments(process.env.APP_SEARCH_ENGINE_NAME, [
          {
            id: change.after.id,
            ...toAppSearch(change.after.data()),
          },
        ]);
      } catch (e) {
        logger.error(`Error while creating document`, {
          id: change.after.id,
        });
        throw e;
      }
    } else if (change.after.exists === false) {
      logger.info(`Deleting document`, { id: change.before.id });
      try {
        client.destroyDocuments(process.env.APP_SEARCH_ENGINE_NAME, [
          change.before.id,
        ]);
      } catch (e) {
        logger.error(`Error while deleting document`, {
          id: change.before.id,
        });
        throw e;
      }
    } else {
      if (!shouldUpdate(change)) {
        logger.info(
          "No INDEXED_FIELD changes have been detected. No need to update."
        );
        return null;
      }
      logger.info(`Updating document`, { id: change.after.id });
      try {
        client.indexDocuments(process.env.APP_SEARCH_ENGINE_NAME, [
          {
            id: change.after.id,
            ...toAppSearch(change.after.data()),
          },
        ]);
      } catch (e) {
        logger.error(`Error while updating document`, {
          id: change.after.id,
        });
        throw e;
      }
    }
    return change.after;
  };
};

// Note that in extensions, functions get declared slightly differently then typical extensions:
// https://firebase.google.com/docs/extensions/alpha/construct-functions#firestore
// Also note that typically in a function you specify the path in the call to `document` like `/${config.collectionName}/{documentId}`.
// In an extension, the path is specified in extension.yaml, in eventTrigger.
export const shipToElastic = fireHandler.firestore.document.onWrite(
  handler(appSearchClient)
);
