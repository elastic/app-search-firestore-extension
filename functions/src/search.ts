import * as functions from "firebase-functions";

import { getNewAppSearchClient } from "./utils";

const appSearchClient = getNewAppSearchClient();

export const search = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  functions.logger.info(
    `Recieved search request for engine ${process.env.APP_SEARCH_ENGINE_NAME}`,
    request.body.data
  );

  const { query, ...options } = request.body.data;

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
