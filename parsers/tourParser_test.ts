import { assertArrayIncludes } from "../deps.ts";
import { getTourTestData } from "../utils.ts";
import { parseToursDates, parseToursRange } from "./tourParser.ts";

Deno.test("Parse Tours - Tour with Specific Date", () => {
  const tourConfig = getTourTestData();

  const tours = parseToursDates(tourConfig);

  const expected = [
    {
      fromDay: "2030-04-01",
      toDay: "2030-04-01",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT,ADULT",
      market: "UK",
    },
  ];

  assertArrayIncludes(tours, expected);
});

Deno.test("Parse Tours - Tour with Specific Date and AllotmentId", () => {
  const tourConfig = getTourTestData();

  const tours = parseToursDates(tourConfig);

  const expected = [
    {
      fromDay: "2030-04-01",
      toDay: "2030-04-01",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: "1234",
      party: "ADULT,ADULT",
      market: "UK",
    },
  ];

  assertArrayIncludes(tours, expected);
});

Deno.test("Parse Tours - Tour with Range", () => {
  const tourConfig = getTourTestData();

  tourConfig.toursWithDateRanges = tourConfig.toursWithDateRanges.filter(
    (tour) => {
      return tour.tourCode === "TOURINTHEPAST";
    },
  );

  const expected = [
    {
      fromDay: "2020-04-01",
      toDay: "2020-04-10",
      voyageCode: "BGO-BGO",
      voyageType: "NORWAY_VOYAGE",
      agreementId: "1234",
      party: "ADULT",
      market: "UK",
    },
    {
      fromDay: "2020-05-21",
      toDay: "2020-05-27",
      voyageCode: "BGO-BGO",
      voyageType: "NORWAY_VOYAGE",
      agreementId: "1234",
      party: "ADULT",
      market: "UK",
    },
  ];

  const tours = parseToursRange(tourConfig);

  assertArrayIncludes(tours, expected);
});
