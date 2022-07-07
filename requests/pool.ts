import { SlackClient } from "../types.ts";
import { updateMsg } from "../utils.ts";

export async function pool(
  payload: string[],
  url: string,
  poolSize = 5,
  timeStamp?: string,
  slackClient?: SlackClient,
) {
  const results: Promise<string | undefined>[] = [];
  const executing: Promise<unknown>[] = [];
  const progressModulo = payload.length > 1000 ? 50 : 10;

  for (const xml of payload) {
    const promise = postRequest(xml, url);
    results.push(promise);
    const e: Promise<unknown> = promise.then(() =>
      executing.splice(executing.indexOf(e), 1)
    );
    executing.push(e);
    if (timeStamp && slackClient && results.length % progressModulo === 0) {
      const percent = ((results.length / payload.length) * 100).toFixed(2);
      updateMsg(`${percent}% done`, timeStamp, slackClient);
    }
    if (executing.length >= poolSize) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

export async function postRequest(xmlBody: string, url: string) {
  const req = new Request(url, {
    method: "post",
    headers: { "Content-type": "application/x-versonix-api" },
    body: xmlBody,
  });
  try {
    const response = await fetch(req);
    const output = response.text();
    return output;
  } catch (error) {
    console.log(`Fetch Error: ${error}`);
  }
}
