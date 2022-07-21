import { parseToursWithDatesAndBuffer } from "../parsers/tourParserBufferDates.ts";
import { SailingSearch, TourConfig } from "../types.ts";
import { assertArrayIncludes, assertEquals } from "../deps.ts";

Deno.test("Parse Tours Buffer dates - Tours with Specific dates", () => {
  const tourConfig: TourConfig = JSON.parse(
    Deno.readTextFileSync("../testdata/tourAPI.json"),
  ) as TourConfig;

  tourConfig.toursWithSpecificDates = tourConfig.toursWithSpecificDates.filter(
    (tour) => {
      return tour.tourCode === "TOURWITHDATES";
    },
  );

  const tours: SailingSearch[] = parseToursWithDatesAndBuffer(tourConfig, 1);

  const expected = [
    {
      fromDay: "2030-03-31",
      toDay: "2030-03-31",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT,ADULT",
      market: "UK"
    },
    {
      fromDay: "2030-04-01",
      toDay: "2030-04-01",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT,ADULT",
      market: "UK"
    },
    {
      fromDay: "2030-04-02",
      toDay: "2030-04-02",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT,ADULT",
      market: "UK"
    }
  ];

  assertArrayIncludes(tours, expected)
});

Deno.test("Parse Tours Buffer dates - Tours with Specific dates, only unique searches", () => {
  const tourConfig: TourConfig = JSON.parse(
    Deno.readTextFileSync("../testdata/tourAPI.json"),
  ) as TourConfig;

  tourConfig.toursWithSpecificDates = tourConfig.toursWithSpecificDates.filter(
    (tour) => {
      return tour.tourCode === "TOURWITHNEARBYDATES";
    },
  );

  const tours: SailingSearch[] = parseToursWithDatesAndBuffer(tourConfig, 5);

  const filtered = tours.filter((search) => {
    return search.fromDay === "2030-04-03";
  });

  assertEquals(filtered.length, 1);
});
