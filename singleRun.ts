import { parse } from "./deps.ts";
import { postSlackMessage } from "./slack-bot/postToSlack.ts";
import { fullRun } from "./cacheCmds.ts";

const args = parse(Deno.args, {
  default: {
    config: "./configs/fullCache.json"
  },
});

const startTime: number = Date.now();
await fullRun(args.config);
const durationInMinutes = Math.round((Date.now() - startTime) / 1000 / 60);

postSlackMessage(`Cache run complete. Run time: ${durationInMinutes} minutes`);