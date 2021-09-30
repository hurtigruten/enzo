import { SocketModeClient } from "../deps.ts";
import { produceJsonSearches } from "../sailingsParser.ts";
import { asyncPool } from "../seawareLoader.ts";
import { createSeawareRequest } from "../serializeXML.ts";
import { CacheConfig, Sailing, SailingSearch } from "../types.ts";

const appToken = "xapp-1-A02FHFZ81N3-2555422715841-07eb35776dab285f5326c0fc91eff01f117dac77bb96323acf5f4d7868f34c56"
const socketModeClient = new SocketModeClient({ appToken })

// Attach listeners to events by type. See: https://api.slack.com/events/message
socketModeClient.addEventListener("app_mention", ({ detail: { body, ack } }) => {
    ack()
    const str = body.event.text.split("> ")[1] || "";
    const words = str.split(" ")
    const fromPort = words[2];
    const toPort = words[4];
    if (fromPort && fromPort.length === 3 && isUpper(fromPort) && toPort && toPort.length === 3 && isUpper(toPort)) {
        cacheSailing(fromPort, toPort);
    }

})

await socketModeClient.start();

function isUpper(str: string) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
}

async function cacheSailing(fromPort: string, toPort:string) {
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
        postSlackMessage(`Could not find a sailing in fullCache.json for: From port ${fromPort} to port ${toPort}`);
    }

    // Parse the config, using only the requested sailing
    config.sailings = filteredSailings;
    const searches: SailingSearch[] = produceJsonSearches(config);
    const payload: string[] = searches.map((search: SailingSearch) => createSeawareRequest(search));

    await asyncPool(url, POOL_SIZE, payload);

    postSlackMessage(`Cached ${fromPort} - ${toPort}`);
}


// Post a HTTP requests to Slack
export async function postSlackMessage(body: string): Promise<void> {
    const url = 'https://hooks.slack.com/services/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';
    const req = new Request(url, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: `{"text":"${body}"}`,
    });
  
    try {
      const res = await fetch(req);
      if (res.status !== 200) {
        console.log(`Error in response! Status code: ${res.status}`);
        return;
      }
    } catch (e) {
      console.log(`Fetch Error: ${e}`);
    }
  }