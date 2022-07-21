import { pool } from "./requests/pool.ts";
import { generateTourXMLs, generateVoyageXMLs } from "./requests/generators.ts";
import {
  EnvironmentConfig,
  Metadata,
  PopulateOptions,
  SlackClient,
  TourConfig,
} from "./types.ts";
import { delay, onlyUniqueStrings, postMsg, timeSince, updateMsg } from "./utils.ts";

const defaultOptions = {
  tours: false,
  tourFilter: ``,
  voyages: false,
  voyageFilter: ``,
  readMode: false,
  ignoreTourDates: true,
  broadcastMessage: ``,
};

export async function requestRunner(
  inputOptions: PopulateOptions = {},
  env: EnvironmentConfig,
  slackClient?: SlackClient,
) {
  const options: Required<PopulateOptions> = {
    ...defaultOptions,
    ...inputOptions,
  };
  let voyagePayload: string[] = [];
  let tourPayload: string[] = [];

  if (options.voyages) {
    const xmlRequests = generateVoyageXMLs(options);
    if (xmlRequests.length === 0 && slackClient) {
      postMsg(`Could not find any voyage to cache`, slackClient);
    }
    voyagePayload = xmlRequests;
  }

  if (options.tours) {
    const res = await fetch(env.tourAPI);
    const tourConfig = await res.json() as TourConfig;
    tourConfig.searchRange = 10;
    if (tourConfig) {
      const xmlRequests = generateTourXMLs(tourConfig, options);
      if (xmlRequests.length === 0 && slackClient) {
        postMsg(`Could not find any Tours`, slackClient);
      }
      tourPayload = xmlRequests;
    }
  }

  const payload = onlyUniqueStrings(voyagePayload.concat(tourPayload));

  if (payload.length !== 0) {
    if (options.readMode) {
      await pool(payload, env.bizlogicAPI, 2);
    } else {
      let timeStamp;
      if (slackClient) {
        if (options.broadcastMessage) {
          await postMsg(
            options.broadcastMessage,
            slackClient,
          );
        }
        const metaData: Metadata = {
          "event_type": "cache_run",
          "event_payload": {
            "text": "Started cache run",
            "run_options": options,
          },
        };
        await postMsg(
          `${payload.length} searches to process :steam_locomotive:`,
          slackClient,
          metaData,
        );
        timeStamp = await postMsg("0% done", slackClient);
      }

      const start = new Date();
      await pool(
        payload,
        env.bizlogicAPI,
        env.poolSize,
        timeStamp,
        slackClient,
      );
      const end = new Date();
      if (slackClient) {
        delay(2000);
        updateMsg(`All done! :sweat_smile:`, timeStamp, slackClient);
        const metaData: Metadata = {
          "event_type": "cache_run",
          "event_payload": {
            "text": "Finished cache run",
            "run_options": options,
          },
        };
        postMsg(
          `:stopwatch: Run time was ${timeSince(start, end)}`,
          slackClient,
          metaData,
        );
      }
    }
  }
}
