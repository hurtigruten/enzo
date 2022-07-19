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
  return date.toJSON().split("T")[0];
}

export function addDaysToDate(baseDate: Date, daysToAdd: number) {
  const copy = new Date(Number(baseDate));
  copy.setDate(baseDate.getDate() + daysToAdd);
  // To avoid timezone issues, set date to noon
  copy.setHours(copy.getHours() + 12);
  return copy;
}

export function getDatesInRangeFormatted(startDate: Date, endDate: Date) {
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    dates.push(new Date(date).toJSON().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }
  return dates;
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
  const reqBody = (metaData)
    ? `{"text":"${body}", "channel":"${slackClient.channelId}", "metadata":${
      JSON.stringify(metaData)
    }}`
    : `{"text":"${body}", "channel":"${slackClient.channelId}"}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
        Authorization: "Bearer " + slackClient.botToken,
      },
      body: reqBody,
    });
    const json = await res.json();
    if (json.ok === false) {
      console.log("POST ERROR: " + json.error);
    }
    return json.ts;
  } catch (e) {
    console.log("FETCH ERROR:" + e);
  }
}

export async function updateMsg(
  body: string,
  timeStamp: string,
  slackClient: SlackClient,
  metaData?: Metadata,
) {
  const url = "https://slack.com/api/chat.update";
  const reqBody = (metaData)
    ? `{"text":"${body}", "channel":"${slackClient.channelId}", "ts":"${timeStamp}", "metadata":${
      JSON.stringify(metaData)
    }}`
    : `{"text":"${body}", "channel":"${slackClient.channelId}", "ts":"${timeStamp}"}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
        Authorization: "Bearer " + slackClient.botToken,
      },
      body: reqBody,
    });
    const json = await res.json();
    if (json.ok === false) {
      console.log("POST ERROR: " + json.error);
    }
  } catch (e) {
    console.log("FETCH ERROR:" + e);
  }
}
