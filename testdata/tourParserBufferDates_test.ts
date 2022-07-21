import { parseToursWithDatesAndBuffer } from "../parsers/tourParserBufferDates.ts";
import { SailingSearch, TourConfig } from "../types.ts";
import { assertArrayIncludes, assertEquals } from "../deps.ts";

Deno.test("Parse Tour with specific dates, buffered #1", () => {
  const tourConfig: TourConfig = JSON.parse(
    Deno.readTextFileSync("./tourParser_test.json"),
  ) as TourConfig;

  tourConfig.toursWithSpecificDates = tourConfig.toursWithSpecificDates.filter(
    (tour) => {
      return tour.tourCode === "FRICE2210";
    },
  );

  const tours: SailingSearch[] = parseToursWithDatesAndBuffer(tourConfig, 7);

  assertArrayIncludes(tours, [
    {
      fromDay: "2022-07-21",
      toDay: "2022-07-21",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT",
      market: "US",
    },
    {
      fromDay: "2022-08-04",
      toDay: "2022-08-04",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT",
      market: "US",
    },
    {
      fromDay: "2022-08-14",
      toDay: "2022-08-14",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT",
      market: "US",
    },
  ]);

  const found = tours.filter((search) => {
    return (
      search.fromDay === "2022-08-02" &&
      search.party === "ADULT" &&
      search.market === "US"
    );
  });

  assertEquals(found.length, 1);
});
