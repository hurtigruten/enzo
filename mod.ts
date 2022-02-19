import { cacheSingleSailing, gitPull, greet, help, isAPIup, populateCache, startAPI, whatIsCached} from "./cacheCmds.ts";
import { getUserProfile, getWebsocketUrl } from "./slackCmds.ts";

const sockets = new Set<WebSocket>();
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Create 5 connections
createWebsocket();
await delay(2000);
createWebsocket();
await delay(2000);
createWebsocket();
await delay(2000);
createWebsocket();
await delay(2000);
createWebsocket();

async function createWebsocket(deadSocket?: WebSocket) {
  if (typeof deadSocket !== 'undefined') {
    sockets.delete(deadSocket);
  }

  const wssResponse = await getWebsocketUrl();
  // To debug, append this to the url: "&debug_reconnects=true");
  const newSocket = new WebSocket(wssResponse.url);
  initializeWebsocket(newSocket);
  sockets.add(newSocket);
}

function initializeWebsocket(socket: WebSocket) {
  socket.onclose = (_) => createWebsocket(socket);

  socket.onmessage = async function (event) {
    const message = JSON.parse(event.data);

    // Acknowledge message receiveed
    if (message.envelope_id) {
      const ack = { "envelope_id": message.envelope_id };
      socket.send(JSON.stringify(ack));
    }

    if (message.payload) {
      const message = JSON.parse(event.data);
      const text: string = message?.payload?.event?.text;

      if (text) {
        const cmds = text.toLowerCase();
        if (cmds.includes("hi") || cmds.includes("hello")) {
          const userID: string = message?.payload?.event?.user;
          const user = await getUserProfile(userID);
          greet(user.user.profile.display_name);
        }
        if (cmds.includes("statusapi")) {
          isAPIup();
        }
        if (cmds.includes("startapi")) {
          startAPI();
          isAPIup();
        }
        if (cmds.includes("cached?")) {
          whatIsCached();
        }
        if (cmds.includes("help")) {
          help();
        }
        if (cmds.includes("gitpull")) {
          gitPull();
        }
        if (cmds.includes("fullcacherun")) {
          populateCache();
        }
        const words: string[] = cmds.split(" ");
        const portRegex = new RegExp("^[a-z]{3}$", "g");
        const portCodes = words.filter((word) => word.match(portRegex));
        if (cmds.includes("cache") && portCodes.length === 2) {
          cacheSingleSailing(portCodes[0], portCodes[1]);
        }
      }
    }
  };
}