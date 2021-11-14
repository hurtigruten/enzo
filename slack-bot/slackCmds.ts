const APP_TOKEN =
  "xapp-1-A02FHFZ81N3-2672165845639-c5f315333b06af43e2f33f1110da83c913010d3196455607f65638cbe0dfa1ac";
const BOT_TOKEN = "xoxb-189767087396-2542390299842-1xMB6ehGh3LA23z0Maip4s06";
const WEBHOOK = "T5KNK2KBN/B02L8MDP44A/cUaVXYw6hT7ufN0IjqZQbWKY";

// Post a HTTP requests to Slack
export async function postSlackMessage(body: string): Promise<void> {
  const url = "https://hooks.slack.com/services/" + WEBHOOK;
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
        "Authorization": "Bearer " + BOT_TOKEN,
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
        "Authorization": "Bearer " + APP_TOKEN,
      },
    });
    return await res.json();
  } catch (e) {
    console.log("Could not connect to Slack: " + e);
    return e;
  }
}
