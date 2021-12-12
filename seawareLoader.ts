import { postSlackMessage } from "./slack-bot/slackCmds.ts";

// Config
const LOCAL_HOST = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
const POOL_SIZE = 15;

// A async pool that runs requests in a throttled manner
export async function populateCacheRunner(payload: string[]): Promise<unknown> {
  const results: Promise<unknown>[] = [];
  const executing: Promise<unknown>[] = [];
  // Flexible progress indicator. If there are more than 10000 requests, progress will be reported every 10000 done
  const moduloNumber = payload.length > 10000 ? 10000 : 1000;

  for (const xml of payload) {
    // Log the progress so far
    if (results.length % moduloNumber === 0 && results.length !== 0) {
      const percent = ((results.length / payload.length) * 100).toFixed(2);
      postSlackMessage((`${percent} % complete`));
    }

    // Send the post request and added to the results
    const promise = Promise.resolve().then(() => postRequest(xml));
    results.push(promise);
    // Add the request to the pool and remove it when it's resolved
    const e: Promise<unknown> = promise.then(() =>
      executing.splice(executing.indexOf(e), 1)
    );
    executing.push(e);
    // If the pool is currently full, wait for a free spot
    if (executing.length >= POOL_SIZE) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

// Post a XML HTTP requests to Seaware
async function postRequest(xmlBody: string): Promise<void> {
  const req = new Request(LOCAL_HOST, {
    method: "post",
    headers: { "Content-type": "application/x-versonix-api" },
    body: xmlBody,
  });

  try {
    await fetch(req)
    //const res = await fetch(req);
    // Currently no handling of error messages from Seaware
    //if (res.status !== 200) {
      //logger.error(`Error in response! Status code: ${res.status}`);
    //  return;
    //}
    // Plug in here to read the response
    //  res.text().then((data) => { });
  } catch (e) {
    postSlackMessage(`Fetch Error: ${e}`);
  }
}

// Post a XML HTTP requests to Seaware
async function postRequestAndReadStats(xmlBody: string): Promise<void> {
  const req = new Request(LOCAL_HOST, {
    method: "post",
    headers: { "Content-type": "application/x-versonix-api" },
    body: xmlBody,
  });

  try {
    const res = await fetch(req);
    res.text().then((data) => { 

    });
  } catch (e) {
    console.log(e);
  }
}

// A async pool that runs requests in a throttled manner
export async function readCacheRunner(payload: string[]): Promise<unknown> {
  const results: Promise<unknown>[] = [];
  const executing: Promise<unknown>[] = [];
  
  for (const xml of payload) {
    // Send the post request and added to the results
    const promise = Promise.resolve().then(() => postRequestAndReadStats(xml));
    results.push(promise);
    // Add the request to the pool and remove it when it's resolved
    const e: Promise<unknown> = promise.then(() =>
      executing.splice(executing.indexOf(e), 1)
    );
    executing.push(e);
    // If the pool is currently full, wait for a free spot
    if (executing.length >= POOL_SIZE) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}