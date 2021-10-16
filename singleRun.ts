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

// Timer
const startTime: number = Date.now();

// Execute population of cache
fullRun(args.config);

const durationInMinutes = Math.round((Date.now() - startTime) / 1000 / 60);

postSlackMessage(`Cache run complete. Run time: ${durationInMinutes} minutes`);