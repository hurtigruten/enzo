import { parseToursDates, parseToursRange } from "../parsers/tourParser.ts";
import { cullToursDates, cullToursRange } from "../requests/generators.ts";
import { SailingSearch, TourConfig } from "../types.ts";
import { assertArrayIncludes, assertEquals } from "./deps.ts";

Deno.test("Config culling test #1", () => {
  const tourConfig = JSON.parse(
    Deno.readTextFileSync("./tourConfigCulling_test.json"),
  ) as TourConfig;
  const today = new Date("2022-04-02");

  tourConfig.toursWithDateRanges = cullToursRange(today, tourConfig);
  const searches: SailingSearch[] = parseToursRange(tourConfig);

  const expectedArray = [
    {
      fromDay: "2022-04-02",
      toDay: "2022-04-03",
      voyageCode: "BGO-BGO",
      voyageType: "NORWAY_VOYAGE",
      agreementId: "6334",
      party: "ADULT,ADULT",
      market: "UK",
    },
    {
      fromDay: "2022-04-05",
      toDay: "2022-04-08",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: "6334",
      party: "ADULT,ADULT",
      market: "UK",
    },
  ];
  assertEquals(searches, expectedArray);
});

Deno.test("Config culling test #2", () => {
  const tourConfig = JSON.parse(
    Deno.readTextFileSync("./tourConfigCulling_test.json"),
  ) as TourConfig;
  const today = new Date("2022-04-02");

  tourConfig.toursWithSpecificDates = cullToursDates(today, tourConfig);
  const searches: SailingSearch[] = parseToursDates(tourConfig);

  const expected1: SailingSearch = {
    fromDay: "2022-04-03",
    toDay: "2022-04-03",
    voyageType: "EXPLORER",
    voyageCode: "REK-REK",
    party: "ADULT,ADULT",
    market: "UK",
    agreementId: null,
  };
  const expected2: SailingSearch = {
    fromDay: "2022-08-24",
    toDay: "2022-08-24",
    voyageType: "EXPLORER",
    voyageCode: "REK-REK",
    party: "ADULT,ADULT",
    market: "UK",
    agreementId: "6334",
  };

  assertArrayIncludes(searches, [expected1]);
  assertArrayIncludes(searches, [expected2]);
});
