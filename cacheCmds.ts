import { asyncPool } from "./seawareLoader.ts";
import { produceJsonSearches } from "./sailingsParser.ts";
import { createSeawareRequest } from "./serializeXML.ts";
import { CacheConfig, Sailing, SailingSearch } from "./types.ts";
import { postSlackMessage } from "./slack-bot/postToSlack.ts";

export async function cacheSingleSailing(fromPort: string, toPort:string) {
    // Config
    const url = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
    const POOL_SIZE = 15;
    const configFile = "../configs/fullCache.json"

    // Parse the full json config file
    const config: CacheConfig = JSON.parse(Deno.readTextFileSync(configFile)) as CacheConfig;

    // Find requested sailing in config
    const filteredSailings: Sailing[] = config.sailings.filter(function (sailing) {
        return sailing.fromPort === fromPort && sailing.toPort === toPort;
    })

    if (filteredSailings.length === 0) {
        postSlackMessage(`Could not find a cache config for: From port ${fromPort} to port ${toPort}`);
    }

    // Parse the config, using only the requested sailing
    config.sailings = filteredSailings;
    const searches: SailingSearch[] = produceJsonSearches(config);
    const payload: string[] = searches.map((search: SailingSearch) => createSeawareRequest(search));

    postSlackMessage(`Searching for ${fromPort} to ${toPort}. ${payload.length} requests to run`);

    // Timer
    const startTime: Date = new Date();

    // Execute cache run
    await asyncPool(url, POOL_SIZE, payload).then() ;

    const endTime: Date = new Date();  
    const timeDiff: number = endTime.getTime() - startTime.getTime();
    const seconds = Math.round(timeDiff / 1000);

    postSlackMessage(`Cache run complete. Run time: ${seconds} seconds`);
}

export function whatIsCached() {
    const configFile = "../configs/fullCache.json"
    const config: CacheConfig = JSON.parse(Deno.readTextFileSync(configFile)) as CacheConfig;
    postSlackMessage(JSON.stringify(config));
}