import { assertEquals } from "./deps.ts";
import { timeSince } from "../utils.ts";

Deno.test("timestamp test #1", () => {
  const date1 = new Date("2022-05-05T12:11:54.284Z");
  const date2 = new Date("2022-05-05T14:16:58.284Z");

  const timeStamp = timeSince(date1, date2);
  const expectedTimestamp = "02:05:04";

  assertEquals<string>(timeStamp, expectedTimestamp);
});
