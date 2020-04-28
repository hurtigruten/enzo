export class CacheLoader {
    private _poolSize : number;
    private _localHost = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
    private _remoteHost = "http://c54censap0008:8085/SwBizLogic/Service.svc/ProcessRequest"; // Use Dot.Env library
    private _host : string;
    
    constructor (public xmlBodies: string[], devMode?: boolean) {
        this._poolSize = 12;
        console.log("DevMode: " + devMode)
        devMode? this._host = this._remoteHost : this._host = this._localHost
        console.log("host: " + this._host)
    }

    load() {
        return this.asyncPool(this._poolSize, this.xmlBodies);
    }

    async asyncPool(poolLimit: number, array: string[]): Promise<any> {
        const ret = new Array();
        const executing = new Array();
        for (const item of array) {
            const p = Promise.resolve().then(() => this.postRequest(item));
            ret.push(p);
            const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= poolLimit) {
            console.log("current size: " + ret.length);
            await Promise.race(executing);
            }
        }
        return Promise.all(ret);
    }

    async postRequest(xmlBody: string): Promise<void> {
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