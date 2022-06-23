import { Metadata, SlackClient } from "./types.ts";

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function timeSince(start: Date, end: Date) {
  const diff = new Date(end.getTime() - start.getTime());

  const to2digit = (num: number) => String(num).padStart(2, "0");

  return [diff.getUTCHours(), diff.getMinutes(), diff.getSeconds()]
    .map(to2digit)
    .join(":");
}

export function dateFromToday(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split("T")[0];
}

export function addDaysToDate(baseDate: Date, daysToAdd: number) {
  const copy = new Date(Number(baseDate));
  copy.setDate(baseDate.getDate() + daysToAdd);
  return copy.toISOString();
}

export function stripString(input: string): string {
  const noLinebreak = input.replace(/(\r\n|\n|\r)/gm, "");
  const noWhitespace = noLinebreak.replace(/\s/g, "");
  return noWhitespace;
}

export async function postMsg(
  body: string,
  slackClient: SlackClient,
  metaData?: Metadata,
) {
  const url = "https://slack.com/api/chat.postMessage";
  const reqBody = (metaData) ? `{"text":"${body}", "channel":"${slackClient.channelId}", "metadata":${JSON.stringify(metaData)}}` :
	`{"text":"${body}", "channel":"${slackClient.channelId}"}`;
	console.log("POST fetching: " + reqBody);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
      Authorization: "Bearer " + slackClient.botToken,
    },
    body: reqBody,
  });
  const output = await res.json();
  console.log(output);
  return output.ts;
}

export async function updateMsg(
  body: string,
  timeStamp: string,
  slackClient: SlackClient,
  metaData?: Metadata,
) {
  const url = "https://slack.com/api/chat.update";
  const reqBody = (metaData) ? `{"text":"${body}", "channel":"${slackClient.channelId}", "ts":"${timeStamp}", "metadata":${JSON.stringify(metaData)}}` :
	`{"text":"${body}", "channel":"${slackClient.channelId}", "ts":"${timeStamp}"}`;
	console.log("UPDATE fetching: " + reqBody);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
      Authorization: "Bearer " + slackClient.botToken,
    },
    body: reqBody,
  });
  const output = await res.json();
  console.log(output);
}
