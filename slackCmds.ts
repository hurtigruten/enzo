import { dotEnvConfig } from "./deps.ts";

// Post a HTTP requests to Slack
export async function postSlackMessage(body: string): Promise<void> {
  const url = "https://hooks.slack.com/services/" + dotEnvConfig().WEBHOOK;
  const req = new Request(url, {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: `{"text":"${body}"}`,
  });

  try {
    const res = await fetch(req);
    if (res.status !== 200) {
      console.log(`Error in response! Status code: ${res.status}`);
      return;
    }
  } catch (e) {
    console.log(`Fetch Error: ${e}`);
  }
}

export async function getUserProfile(userID: string) {
  const SLACK_USERS_URL = "https://slack.com/api/users.info";
  const url = SLACK_USERS_URL + "?user=" + userID;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + dotEnvConfig().BOT_TOKEN,
      },
    });
    return await res.json();
  } catch (e) {
    console.log("Could not connect to Slack: " + e);
    return e;
  }
}

export async function getWebsocketUrl() {
  const SLACK_APPS_URL = "https://slack.com/api/apps.connections.open";
  try {
    const res = await fetch(SLACK_APPS_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + dotEnvConfig().APP_TOKEN,
      },
    });
    return await res.json();
  } catch (e) {
    console.log("Could not connect to Slack: " + e);
    return e;
  }
}
