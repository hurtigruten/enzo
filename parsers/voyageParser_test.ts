import { assertArrayIncludes } from "../deps.ts";
import { getVoyageTestData } from "../utils.ts";
import { parseVoyages } from "./voyageParser.ts";

Deno.test("Parse Voyages #1", () => {
  const voyageConfig = getVoyageTestData();

  const voyages = parseVoyages(voyageConfig);
  const today = new Date();
  const todayFormatted = today.toJSON().split("T")[0];

  const expected = [{
    fromDay: todayFormatted,
    toDay: todayFormatted,
    voyageType: "NORWAY_VOYAGE",
    voyageCode: "BGO-KKN",
    party: "ADULT",
    market: "UK",
  }];

  assertArrayIncludes(voyages, expected);
});

Deno.test("Parse Voyages #2", () => {
  const voyageConfig = getVoyageTestData();

  const voyages = parseVoyages(voyageConfig);

  const today = new Date();
  const inFiveDays = new Date(today);
  inFiveDays.setDate(inFiveDays.getDate() + 4);
  const todayFormatted = today.toJSON().split("T")[0];
  const inFiveDaysFormatted = inFiveDays.toJSON().split("T")[0];

  const expected = [{
    fromDay: todayFormatted,
    toDay: inFiveDaysFormatted,
    voyageType: "NORWAY_VOYAGE",
    voyageCode: "BGO-BGO",
    party: "ADULT",
    market: "NO",
  }];

  assertArrayIncludes(voyages, expected);
});
