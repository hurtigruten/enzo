import { asyncPool } from "./seawareLoader.ts";
import { produceJsonSearches } from "./sailingsParser.ts";
import { createSeawareRequest } from "./serializeXML.ts";
import { CacheConfig, Sailing, SailingSearch } from "./types.ts";
import { postSlackMessage } from "./slack-bot/postToSlack.ts";

// Config
const LOCAL_HOST = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
const POOL_SIZE = 15;
const FULL_CONFIG = "../configs/fullCache.json";

export async function fullRun(pathToConfig: string|URL){

    // Parse the supplied json config file to XML bodies
    const config: CacheConfig = JSON.parse(Deno.readTextFileSync(pathToConfig)) as CacheConfig;
    const searches: SailingSearch[] = produceJsonSearches(config);
    const payload: string[] = searches.map((search: SailingSearch) => createSeawareRequest(search));

    postSlackMessage(`Starting to cache. ${payload.length} requests to run.`);

    // Execute population of cache
    await asyncPool(LOCAL_HOST, POOL_SIZE, payload);
}

export async function cacheSingleSailing(fromPort: string, toPort:string) {
    // Parse the full json config file
    const config: CacheConfig = JSON.parse(Deno.readTextFileSync(FULL_CONFIG)) as CacheConfig;

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

    // Execute cache run
    await asyncPool(LOCAL_HOST, POOL_SIZE, payload).then() ;

    postSlackMessage(`Cache run complete`);
}

export function whatIsCached() {
    const config: CacheConfig = JSON.parse(Deno.readTextFileSync(FULL_CONFIG));
    let response = "";
    config.sailings.map((obj) => {
        response += obj.fromPort + "-" + obj.toPort +". " 
    });
    postSlackMessage(response);
}

export function greet() {
    postSlackMessage("yo yo yo!");
}

function sailing(sailing: any,Sailing: any) {
throw new Error("Function not implemented.");
}
