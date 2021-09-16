import * as functions from "firebase-functions";
const cors = require("cors")();
import { getNewAppSearchClient } from "./utils";

const appSearchClient = getNewAppSearchClient();

export const querySuggestion = functions.https.onRequest(
  (request, response) => {
    cors(request, response, async () => {
      functions.logger.info(
        `Recieved query suggestion request for engine ${process.env.APP_SEARCH_ENGINE_NAME}`,
        request.body.data
      );

      let { query, ...options } = request.body?.data || {};
      query = query || request.query.query || "";

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
    });
  }
);
