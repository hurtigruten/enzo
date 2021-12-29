import { postSlackMessage } from "./slack-bot/slackCmds.ts";

// Config
const HOST = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";

// A async pool that runs requests in a throttled manner
export async function requestRunner(payload: string[], poolSize: number): Promise<(string | undefined)[]> {
  const results: Promise<string | undefined>[] = [];
  const executing: Promise<unknown>[] = [];
  // Flexible progress indicator. If there are more than 10000 requests, progress will be reported every 10000 done
  //const moduloNumber = payload.length > 10000 ? 10000 : 1000;

  for (const xml of payload) {
    // Log the progress so far
    //if (results.length % moduloNumber === 0 && results.length !== 0) {
    //  const percent = ((results.length / payload.length) * 100).toFixed(2);
    //  postSlackMessage((`${percent} % complete`));
    //}

    // Send the post request and added to the results
    const promise = postRequest(xml);
    results.push(promise);
    // Add the request to the pool and remove it when it's resolved
    const e: Promise<unknown> = promise.then(() =>
      executing.splice(executing.indexOf(e), 1)
    );
    executing.push(e);
    // If the pool is currently full, wait for a free spot
    if (executing.length >= poolSize) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results)
}

// Post a XML HTTP requests to Seaware
async function postRequest(xmlBody: string): Promise<string | undefined> {
  const req = new Request(HOST, {
    method: "post",
    headers: { "Content-type": "application/x-versonix-api" },
    body: xmlBody,
  });
  try {
    const response = await fetch(req)
    return await response.text();
  } catch (error) {
      postSlackMessage(`Fetch Error: ${error}`);
  } 
}