import { SlackClient } from "./types.ts";

export function timeSince(start: Date, end: Date) {
  const diff = new Date(end.getTime() - start.getTime());
  const diffHours = diff.getUTCHours() < 10
    ? `0${diff.getUTCHours()}`
    : diff.getUTCHours();
  const diffMinutes = diff.getMinutes() < 10
    ? `0${diff.getMinutes()}`
    : diff.getMinutes();
  const diffSeconds = diff.getSeconds() < 10
    ? `0${diff.getSeconds()}`
    : diff.getSeconds();
  return `${diffHours}:${diffMinutes}:${diffSeconds}`;
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

export async function postMsg(body: string, slackClient: SlackClient) {
  const url = "https://slack.com/api/chat.postMessage";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + slackClient.botToken,
    },
    body: `{"text":"${body}", "channel":"${slackClient.channelId}"}`,
  });
  const output = await res.json();
  return output.ts;
}

export async function updateMsg(
  body: string,
  ts: string,
  slackClient: SlackClient,
) {
  const url = "https://slack.com/api/chat.update";
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + slackClient.botToken,
    },
    body:
      `{"text":"${body}", "channel":"${slackClient.channelId}", "ts":"${ts}"}`,
  });
}
