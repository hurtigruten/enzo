// A async pool that runs requests in a throttled manner
export async function asyncPool(
  host: string,
  poolLimit: number,
  xmlList: string[]
): Promise<unknown> {
  const results: Promise<unknown>[] = [];
  const executing: Promise<unknown>[] = [];

  for (const xml of xmlList) {
    // Send the post request and added to the results
    const promise = Promise.resolve().then(() => postRequest(host, xml));
    results.push(promise);
    // Add the request to the pool and remove it when it's resolved
    const e: Promise<unknown> = promise.then(() =>
      executing.splice(executing.indexOf(e), 1)
    );
    executing.push(e);
    // If the pool is currently full, wait for a free spot
    if (executing.length >= poolLimit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

// Post a XML HTTP requests to Seaware
async function postRequest(host: string, xmlBody: string): Promise<void> {
  const req = new Request(host, {
    method: "post",
    headers: { "Content-type": "application/x-versonix-api" },
    body: xmlBody,
  });

  try {
    const res = await fetch(req);
    // Currently no handling of error messages from Seaware
    //if (res.status !== 200) {
    //  logger.error(`Error in response! Status code: ${res.status}`);
    //  return;
    //}
    // Plug in here to  read the response
    //  res.text().then((data) => { });
  } catch (e) {
    //logger.error(`Fetch Error: ${e}`);
  }
}