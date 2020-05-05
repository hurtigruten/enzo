import { logger } from "./logger.ts"

export class CacheLoader {
    
  readonly _localHost = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
  readonly _remoteHost = "http://10.26.32.45:8085/SwBizLogic/Service.svc/ProcessRequest";
  readonly _host : string;
    
  // TODO: Avoid hardcoding of config?
  constructor (readonly env: string, readonly poolSize = 12 ) {
    this._host = (env === "prod") ? this._localHost : this._remoteHost;
    logger.debug(`host: ${this._host}`)
  }

  load(xmlBodies: string[]): Promise<unknown> {
    logger.debug(`Starting cache run with a pool of ${this.poolSize} and ${xmlBodies.length} requests to run`);
    return this.asyncPool(this.poolSize, xmlBodies);
  }

  private async asyncPool(poolLimit: number, xmlList: string[]): Promise<unknown> {
    const ret = new Array();
    const executing = new Array();
    for (const item of xmlList) {
      const p = Promise.resolve().then(() => this.postRequest(item));
      ret.push(p);
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
         if (ret.length % 50 === 0) {
            const percent = ((ret.length / xmlList.length) * 100).toFixed(2);
            logger.debug(`Completed: ${ret.length} (${percent} %)`);
         }
         await Promise.race(executing);
      }
    }
    return Promise.all(ret);
  }

  private async postRequest(xmlBody: string): Promise<void> {
    const req = new Request(this._host, {
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
      Keep commented code in case we want to extend by reading cached response
      res.text().then((data) => { });
      */
    })
    .catch((e) => {
      logger.error(`Fetch Error: ${e}`);
    });
  }
}