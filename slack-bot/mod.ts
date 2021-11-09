import { cacheSingleSailing, greet, whatIsCached } from "../cacheCmds.ts";

type slackWssUrl = { "ok": boolean; "url": string };

const SLACK_APPS_URL = "https://slack.com/api/apps.connections.open";
const BEARER_TOKEN =
  "xapp-1-A02FHFZ81N3-2672165845639-c5f315333b06af43e2f33f1110da83c913010d3196455607f65638cbe0dfa1ac";

const sockets = new Set<WebSocket>();
const delay = (ms: number|undefined) => new Promise(res => setTimeout(res, ms));

// Create 2 connections
createWebsocket(undefined);
await delay(5000);
createWebsocket(undefined);

async function createWebsocket(deadSocket: WebSocket | undefined) {
  //sockets.forEach(s => console.log("states: " + s.readyState))
  if (deadSocket) {
    sockets.delete(deadSocket);
  }

  const wssResponse: slackWssUrl = await getWebsocketUrl();
  //const newSocket = new WebSocket(wssResponse.url + "&debug_reconnects=true");
  const newSocket = new WebSocket(wssResponse.url);
  initializeWebsocket(newSocket);
  sockets.add(newSocket);
}

function initializeWebsocket(socket: WebSocket) {
  socket.onclose = (_) => createWebsocket(socket);

  //socket.onopen = (_) => console.log("connection established");

  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);

    if (message.type === "disconnect") {
      //console.log(message)
    }
    // Acknowledge message receiveed
    if (message.envelope_id) {
      const ack = { "envelope_id": message.envelope_id };
      socket.send(JSON.stringify(ack));
    }

    if (message.payload) {
      const message = JSON.parse(event.data);
      const text = message?.payload?.event?.text;

      // TODO: Recoginize user: const text = message?.payload?.event?.user;
      // TODO: Catch ABC instead of string parsing
      if (text) {
        const str: string = text.split("> ")[1] || "";
        const words: string[] = str.split(" ");
        const wordThree: string = words[2];
        const wordFive: string = words[4];

        if (
          text.includes("hi") || text.includes("hello") || text.includes("yo")
        ) {
          greet();
        }

        if (
          wordThree && wordThree.length === 3 && wordFive &&
          wordFive.length === 3
        ) {
          console.log("Caching: " + wordThree + " to " + wordFive);
          cacheSingleSailing(wordThree, wordFive);
        }
        if (text.includes("cached?")) whatIsCached();
      }
    }
  };
}

async function getWebsocketUrl(): Promise<slackWssUrl> {
  try {
    const res = await fetch(SLACK_APPS_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + BEARER_TOKEN,
      },
    });
    return await res.json();
  } catch (e) {
    console.log("Could not connect to Slack: " + e);
    return { "ok": false, "url": "" };
  }
}