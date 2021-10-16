import { parse } from "./deps.ts";
import { postSlackMessage } from "./slack-bot/postToSlack.ts";
import { fullRun } from "./cacheCmds.ts";

// Read arguments. Config is used to determine a full or partial run, host determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    config: "./configs/fullCache.json",
    host: "local",
  },
});

postSlackMessage(`Using the ${args.config} config that has a search range of ${args.config.searchRange}`);

// Timer
const startTime: number = Date.now();

// Execute population of cache
await fullRun(args.host, args.config);

const durationInMinutes = Math.round((Date.now() - startTime) / 1000 / 60);

postSlackMessage(`Cache run complete, using config: ${args.config}. Run time: ${durationInMinutes} minutes`);