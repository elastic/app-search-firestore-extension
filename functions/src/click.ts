import * as functions from "firebase-functions";

import { getNewAppSearchLowLevelClient } from "./utils";

const appSearchLowLevelClient = getNewAppSearchLowLevelClient();

export const click = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  functions.logger.info(
    `Recieved click tracking request for engine ${process.env.APP_SEARCH_ENGINE_NAME}`,
    request.body.data
  );

  const options = request.body.data;

  try {
    const clickResponse = await appSearchLowLevelClient.post(
      `engines/${process.env.APP_SEARCH_ENGINE_NAME}/click`,
      options
    );

    response.status(200).send({
      data: clickResponse,
    });
  } catch (e) {
    functions.logger.error(`Error tracking click`, {
      errorMessages: e.errorMessages,
    });
    response.sendStatus(500);
  }
});
