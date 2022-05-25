import { parseToursDates, parseToursRange } from "../parsers/tourParser.ts";
import { cullToursDates, cullToursRange } from "../requests/generators.ts";
import { assertEquals } from "./deps.ts";

Deno.test("Config culling test #1", () => {
  const tourConfig = JSON.parse(
    Deno.readTextFileSync("./tourConfigCullingTest.json"),
  );
  const today = new Date("2022-04-02");

  tourConfig.toursWithDateRanges = cullToursRange(
    today,
    tourConfig.toursWithDateRanges,
  );
  const searches = parseToursRange(tourConfig);

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
    Deno.readTextFileSync("./tourConfigCullingTest.json"),
  );
  const today = new Date("2022-04-02");

  tourConfig.toursWithSpecificDates = cullToursDates(
    today,
    tourConfig.toursWithSpecificDates,
  );
  const searches = parseToursDates(tourConfig);

  const expectedArray = [
    {
      fromDay: "2022-04-03",
      toDay: "2022-04-03",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT,ADULT",
      market: "UK",
    },
    {
      fromDay: "2022-08-24",
      toDay: "2022-08-24",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT,ADULT",
      market: "UK",
    },
  ];

  assertEquals(searches, expectedArray);
});
