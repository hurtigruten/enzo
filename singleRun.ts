import { postSlackMessage } from "./slack-bot/slackCmds.ts";
import { fullRun } from "./cacheCmds.ts";

const CONFIG = "./configs/fullCache.json";

await fullRun(CONFIG);

postSlackMessage(`Cache run complete`);