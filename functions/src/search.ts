import * as functions from "firebase-functions";
const cors = require("cors")();
import { getNewAppSearchClient } from "./utils";

const appSearchClient = getNewAppSearchClient();

export const search = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    functions.logger.info(
      `Recieved search request for engine ${process.env.APP_SEARCH_ENGINE_NAME}`,
      request.body.data
    );

    let { query, ...options } = request.body?.data || {};
    query = query || request.query.query || "";

    try {
      const searchResponse = await appSearchClient.search(
        process.env.APP_SEARCH_ENGINE_NAME,
        query,
        options
      );

      response.status(200).send({
        data: searchResponse,
      });
    } catch (e) {
      functions.logger.error(`Error retrieving search results`, {
        errorMessages: e.errorMessages,
      });
      response.sendStatus(500);
    }
  });
});
