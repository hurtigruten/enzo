import { assertEquals } from "../deps.ts";
import { parseParty } from "./seawareXML.ts";

Deno.test("Seaware XMLs - Partymix #1", () => {
  const party = parseParty("ADULT");
  const expected = "<Value><Str>ADULT</Str></Value>";
  assertEquals(party, expected);
});

Deno.test("Seaware XMLs - Partymix #2", () => {
  const party = parseParty("ADULT,ADULT");
  const expected =
    "<Value><Str>ADULT</Str></Value><Value><Str>ADULT</Str></Value>";
  assertEquals(party, expected);
});

// TODO: Add more