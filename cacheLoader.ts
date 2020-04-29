import { logger } from "./logger.ts"

export class CacheLoader {
    private _poolSize : number;
    private _localHost = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
    private _remoteHost = "http://c54censap0008:8085/SwBizLogic/Service.svc/ProcessRequest";
    private _host : string;
    
    constructor (public xmlBodies: string[], env: string) {
        this._poolSize = 16; // Hard code for now
        this._host = (env === "prod") ? this._localHost : this._remoteHost;
        logger.debug("host: " + this._host)
    }

    load() {
        logger.debug(`Starting cache run with a pool of ${this._poolSize} and ${this.xmlBodies.length} requests to run`);
        return this.asyncPool(this._poolSize, this.xmlBodies);
    }

    private async asyncPool(poolLimit: number, array: string[]): Promise<any> {
        const ret = new Array();
        const executing = new Array();
        for (const item of array) {
            const p = Promise.resolve().then(() => this.postRequest(item));
            ret.push(p);
            const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= poolLimit) {
                if (ret.length % 10 === 0) {
                    logger.debug(`Completed: ${ret.length}`)
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
    
        return fetch(req)
        .then((res) => {
            if (res.status !== 200) {
            console.log(`Error in response! Status code: ${res.status}`);
            return;
            }
            res.text().then((data) => {
            if (data.includes("PackageID")) {
                // Write to a cache?
            } else {
                //console.log("No content")
            }
            });
        })
        .catch((e) => {
            console.log(`Fetch Error: ${e}`);
        });
    }
}