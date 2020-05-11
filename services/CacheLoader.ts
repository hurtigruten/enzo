import { logger } from "../logging/logger.ts"

export class CacheLoader {
       
  constructor (readonly host: string, readonly poolSize: number) {}

  // Main method that simple wraps the aync pool
  load(xmlBodies: string[]): Promise<unknown> {
    logger.debug(`Starting cache run towards ${this.host}, with a pool of ${this.poolSize} and ${xmlBodies.length} requests to run`);
    return this.asyncPool(this.poolSize, xmlBodies);
  }

  // A async pool that runs requests in a throttled manner
  private async asyncPool(poolLimit: number, xmlList: string[]): Promise<unknown> {

    const results = new Array();
    const executing = new Array();

    for (const xml of xmlList) {
      // Log the progress so far
      if (results.length % 50 === 0) {
        const percent = ((results.length / xmlList.length) * 100).toFixed(2);
        logger.debug(`Completed: ${results.length} (${percent} %)`);
      }
      // Send the post request and added to the results
      const promise = Promise.resolve().then(() => this.postRequest(xml));
      results.push(promise);
      // Add the request to the pool and remove it when it's resolved
      const e: Promise<unknown> = promise.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      // If the pool is currently full, wait for a free spot
      if (executing.length >= poolLimit) {
         await Promise.race(executing);
      }

    }
    return Promise.all(results);
  }

  // Post a XML HTTP requests to Seaware
  private async postRequest(xmlBody: string): Promise<void> {
    const req = new Request(this.host, {
      method: "post",
      headers: { "Content-type": "application/x-versonix-api" },
      body: xmlBody,
    });
  
    return fetch(req).then((res) => {
      if (res.status !== 200) {
        logger.error(`Error in response! Status code: ${res.status}`)
        return;
      }
      /*
      Plug in here to  read the response
      res.text().then((data) => { });
      */
    })
    .catch((e) => {
      logger.error(`Fetch Error: ${e}`);
    });
  }
}