import { cacheSingleSailing, gitPull, greet, help, isAPIup, startAPI, whatIsCached} from "../cacheCmds.ts";
import { getUserProfile, getWebsocketUrl } from "./slackCmds.ts";

const sockets = new Set<WebSocket>();
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Create 2 connections
createWebsocket(undefined);
await delay(5000);
createWebsocket(undefined);

async function createWebsocket(deadSocket: WebSocket | undefined) {
  if (deadSocket) {
    sockets.delete(deadSocket);
  }

  const wssResponse = await getWebsocketUrl();
  // To debud, append this to the url: "&debug_reconnects=true");
  const newSocket = new WebSocket(wssResponse.url);
  initializeWebsocket(newSocket);
  sockets.add(newSocket);
}

function initializeWebsocket(socket: WebSocket) {
  socket.onclose = (_) => createWebsocket(socket);
  //socket.onopen = (_) => console.log("connection established");

  socket.onmessage = async function (event) {
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
      const text: string = message?.payload?.event?.text;

      if (text) {
        if (text.includes("hi") || text.includes("hello")) {
          const userID: string = message?.payload?.event?.user;
          const user = await getUserProfile(userID);
          greet(user.user.profile.display_name);
        }
        if (text.includes("statusAPI")) {
          isAPIup();
        }
        if (text.includes("startAPI")) {
          startAPI();
          isAPIup();
        }
        const words: string[] = text.split(" ");
        const portRegex = new RegExp("^[A-Z]{3}$", "g");
        const portCodes = words.filter((word) => word.match(portRegex));

        if (portCodes.length === 2) {
          cacheSingleSailing(portCodes[0], portCodes[1]);
        }
        if (text.includes("cached?")) {
          whatIsCached();
        }
        if (text.includes("help")) {
          help();
        }
        if (text.includes("gitPull")) {
          gitPull();
        }
      }
    }
  };
}