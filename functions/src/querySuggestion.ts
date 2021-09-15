import * as functions from "firebase-functions";

import { getNewAppSearchClient } from "./utils";

const appSearchClient = getNewAppSearchClient();

export const querySuggestion = functions.https.onRequest(
  async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");

    functions.logger.info(
      `Recieved query suggestion request for engine ${process.env.APP_SEARCH_ENGINE_NAME}`,
      request.body.data
    );

    const { query, ...options } = request.body.data;

    try {
      const querySuggestionResponse = await appSearchClient.querySuggestion(
        process.env.APP_SEARCH_ENGINE_NAME,
        query,
        options
      );

      response.status(200).send({
        data: querySuggestionResponse,
      });
    } catch (e) {
      functions.logger.error(`Error retrieving query suggestion results`, {
        errorMessages: e.errorMessages,
      });
      response.sendStatus(500);
    }
  }
);
