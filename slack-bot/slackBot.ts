import { SocketModeClient } from "../deps.ts";
import { cacheSingleSailing, whatIsCached } from "../cacheCmds.ts";

const appToken = "xapp-1-A02FHFZ81N3-2560172068834-c247d49804eb5704a13c546c642125c66ef3e243fccc6f20584e6730dd27cf55"

const socketModeClient = new SocketModeClient({ appToken })

// Attach listeners to events by type. See: https://api.slack.com/events/message
socketModeClient.addEventListener("app_mention", ({ detail: { body, ack } }) => {
    console.log("start");
    ack()
    const str = body.event.text.split("> ")[1] || "";
    const words = str.split(" ")
    const wordThree = words[2];
    const wordFive = words[4];
    console.log(str);
    if (wordThree && wordThree.length === 3 && wordFive && wordFive.length === 3) {
        cacheSingleSailing(wordThree, wordFive);
    }
    if (str.includes("cached?")) {
        console.log("cached")
        whatIsCached();
    }
})

await socketModeClient.start();

console.log("Connected: " +socketModeClient.connected);
console.log("Authenticated: " +socketModeClient.authenticated);