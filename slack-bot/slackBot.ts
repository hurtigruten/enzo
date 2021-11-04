import { SocketModeClient } from "../deps.ts";
import { cacheSingleSailing, whatIsCached, greet } from "../cacheCmds.ts";

const appToken = "xapp-1-A02FHFZ81N3-2672165845639-c5f315333b06af43e2f33f1110da83c913010d3196455607f65638cbe0dfa1ac"
const socketModeClient = new SocketModeClient({ appToken })

// Attach listeners to events by type. See: https://api.slack.com/events/message
socketModeClient.addEventListener("app_mention", ({ detail: { body, ack } }) => {
    ack()
    const str: string = body.event.text.split("> ")[1] || "";
    const words: string[] = str.split(" ")
    const wordThree: string = words[2];
    const wordFive: string  = words[4];
    console.log(str);

    if (str.includes("hi") || str.includes("hello") || str.includes("yo")) {
        greet();
    }

    if (wordThree && wordThree.length === 3 && wordFive && wordFive.length === 3) {
        cacheSingleSailing(wordThree, wordFive);
    }
    if (str.includes("cached?")) {
        whatIsCached();
    }
})

await socketModeClient.start();

console.log("Connected: " +socketModeClient.connected);
console.log("Authenticated: " +socketModeClient.authenticated);