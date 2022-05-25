import { pool } from "./requests/pool.ts";
import { generateTourXMLs, generateVoyageXMLs } from "./requests/generators.ts";
import {
  EnvironmentConfig,
  PopulateOptions,
  SlackClient,
  TourConfig,
} from "./types.ts";
import { postMsg, timeSince, updateMsg } from "./utils.ts";

const defaultOptions = {
  tours: false,
  tourFilter: ``,
  voyages: false,
  voyageFilter: ``,
  readMode: false,
  ignoreTourDates: true,
};

export async function requestRunner(
  inputOptions: PopulateOptions = {},
  env: EnvironmentConfig,
  slackClient: SlackClient,
) {
  const options: Required<PopulateOptions> = {
    ...defaultOptions,
    ...inputOptions,
  };
  let voyagePayload: string[] = [];
  let tourPayload: string[] = [];

  if (options.voyages) {
    const xmlRequests = generateVoyageXMLs(options);
    if (xmlRequests.length === 0) {
      postMsg(`Could not find any voyage to cache`, slackClient);
    }
    voyagePayload = xmlRequests;
  }

  if (options.tours) {
    const res = await fetch(env.tourAPI);
    const tourConfig = await res.json() as TourConfig;
    if (tourConfig) {
      const xmlRequests = generateTourXMLs(tourConfig, options);
      if (xmlRequests.length === 0) {
        postMsg(`Could not find any Tours`, slackClient);
      }
      tourPayload = xmlRequests;
    }
  }

  const payload = [...new Set(voyagePayload.concat(tourPayload))];

  if (payload.length !== 0) {
    if (options.readMode) {
      await pool(payload, 2, env.bizlogicAPI);
    } else {
      await postMsg(
        `Starting to cache in ${env.environment}. ${payload.length} searches :steam_locomotive:`,
        slackClient,
      );
      const ts = await postMsg("0% done", slackClient);
      const start = new Date();
      const poolSize = env.environment === "PRODUCTION" ? 15 : 4;
      await pool(payload, poolSize, env.bizlogicAPI, ts, slackClient);
      const end = new Date();
      updateMsg(
        `All done! Run time was ${timeSince(start, end)}`,
        ts,
        slackClient,
      );
    }
  }
}
