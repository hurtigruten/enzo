import { cacheSingleSailing, greet, whatIsCached } from "../cacheCmds.ts";

async function getWebsocketUrl() {
  const url = "https://slack.com/api/apps.connections.open";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization":
          "Bearer xapp-1-A02FHFZ81N3-2672165845639-c5f315333b06af43e2f33f1110da83c913010d3196455607f65638cbe0dfa1ac",
      },
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

const wssResponse = await getWebsocketUrl();

if (wssResponse.ok) {
  const wssUrl = wssResponse.url;
  const socket = new WebSocket(wssUrl + "&debug_reconnects=true");

  socket.onopen = function () {
    console.log("console established");
  };

  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);

    if (message.type == "disconnect") {
      console.log("Disconnect event caught");
      handleDisconnect(message);
    }

    // Acknowledge message receiveed
    if (message.envelope_id) {
      const ack = { "envelope_id": message.envelope_id };
      socket.send(JSON.stringify(ack));
    }
    const text = message?.payload?.event?.text;
    // TODO: Recoginize user: const text = message?.payload?.event?.user;
    if (text) {
      console.log(text);
      const words: string[] = text.split(" ");
      const wordThree: string = words[2];
      const wordFive: string = words[4];

      if (text.includes("hi") || text.includes("hello") || text.includes("yo")) {
        greet();
      }

      if (
        wordThree && wordThree.length === 3 && wordFive && wordFive.length === 3
      ) {
          console.log("Caching: " + wordThree + " to " + wordFive)
        cacheSingleSailing(wordThree, wordFive);
      }
      if (text.includes("cached?")) {
        whatIsCached();
      }
    }
  };
}
function handleDisconnect(message: any) {
  // TODO
  // warning (you don't always get it): {"type":"disconnect","reason":"warning","debug_info":{"host":"applink-canary-688c894b56-rwj4p"}}
  // use multiple connections to handle disconnect: {"type":"disconnect","reason":"refresh_requested","debug_info":{"host":"applink-canary-688c894b56-rwj4p"}}
  console.log(message);
}
