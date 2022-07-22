import {
  parseToursWithDatesAndBuffer,
  parseToursWithRangesAndBuffer,
} from "../parsers/tourParserBufferDates.ts";
import { SailingSearch } from "../types.ts";
import { assertArrayIncludes, assertEquals } from "../deps.ts";
import { getTourTestData } from "../utils.ts";

Deno.test("Parse Tours Buffer dates - Tours with Specific dates", () => {
  const tourConfig = getTourTestData();

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
      market: "UK",
    },
    {
      fromDay: "2030-04-01",
      toDay: "2030-04-01",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT,ADULT",
      market: "UK",
    },
    {
      fromDay: "2030-04-02",
      toDay: "2030-04-02",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: null,
      party: "ADULT,ADULT",
      market: "UK",
    },
  ];

  assertArrayIncludes(tours, expected);
});

Deno.test("Parse Tours Buffer dates - Tours with Specific dates, only unique searches", () => {
  const tourConfig = getTourTestData();

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

Deno.test("Parse Tours Buffer dates - Tours with Ranges", () => {
  const tourConfig = getTourTestData();

  tourConfig.toursWithDateRanges = tourConfig.toursWithDateRanges.filter(
    (tour) => {
      return tour.tourCode === "TOURINTHEFUTURE";
    },
  );

  tourConfig.toursWithSpecificDates = [];

  const tours = parseToursWithRangesAndBuffer(tourConfig, 3);

  const expected = [
    {
      fromDay: "2050-03-29",
      toDay: "2050-04-07",
      voyageCode: "BGO-BGO",
      voyageType: "NORWAY_VOYAGE",
      agreementId: "2345",
      party: "ADULT",
      market: "UK",
    },
    {
      fromDay: "2050-05-08",
      toDay: "2050-05-17",
      voyageCode: "BGO-BGO",
      voyageType: "NORWAY_VOYAGE",
      agreementId: "2345",
      party: "ADULT",
      market: "UK",
    },
    {
      fromDay: "2050-05-28",
      toDay: "2050-06-03",
      voyageCode: "BGO-BGO",
      voyageType: "NORWAY_VOYAGE",
      agreementId: "2345",
      party: "ADULT",
      market: "UK",
    },
  ];

  assertArrayIncludes(tours, expected);
});
