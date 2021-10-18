import { parse } from "./deps.ts";
import { postSlackMessage } from "./slack-bot/postToSlack.ts";
import { fullRun } from "./cacheCmds.ts";

const args = parse(Deno.args, {
  default: {
    config: "./configs/fullCache.json"
  },
});

await fullRun(args.config);

postSlackMessage(`Cache run complete`);