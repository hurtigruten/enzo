import { assertArrayIncludes } from "../deps.ts";
import { getTourTestData } from "../utils.ts";
import { parseToursIgnoreDates } from "./tourParserIgnoreDates.ts";

Deno.test("Parse Tours Ignoring dates - Tours with Specific dates", () => {
  const tourConfig = getTourTestData();

  tourConfig.toursWithSpecificDates = tourConfig.toursWithSpecificDates.filter(
    (tour) => {
      return tour.tourCode === "TOURWITHDATES";
    },
  );

  tourConfig.toursWithDateRanges = [];

  const tours = parseToursIgnoreDates(tourConfig, 2);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayFormatted = today.toJSON().split("T")[0];
  const tomorrowFormatted = tomorrow.toJSON().split("T")[0];

  const expected = [
    {
      fromDay: todayFormatted,
      toDay: tomorrowFormatted,
      voyageType: "EXPLORER",
      voyageCode: "REK-REK",
      party: "ADULT,ADULT",
      market: "UK",
      agreementId: null,
    },
  ];

  assertArrayIncludes(tours, expected);
});

Deno.test("Parse Tours Ignoring dates - Tours with Date Ranges", () => {
  const tourConfig = getTourTestData();

  tourConfig.toursWithDateRanges = tourConfig.toursWithDateRanges.filter(
    (tour) => {
      return tour.tourCode === "TOURINTHEFUTURE";
    },
  );

  tourConfig.toursWithSpecificDates = [];

  const tours = parseToursIgnoreDates(tourConfig, 2);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayFormatted = today.toJSON().split("T")[0];
  const tomorrowFormatted = tomorrow.toJSON().split("T")[0];

  const expected = [
    {
      fromDay: todayFormatted,
      toDay: tomorrowFormatted,
      voyageType: "NORWAY_VOYAGE",
      voyageCode: "BGO-BGO",
      party: "ADULT,ADULT",
      market: "UK",
      agreementId: "2345",
    },
  ];

  assertArrayIncludes(tours, expected);
});
