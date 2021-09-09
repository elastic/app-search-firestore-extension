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
