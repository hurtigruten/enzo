import { SailingSearch, TourConfig } from "../types.ts";
import { addDaysToDate, getDatesInRangeFormatted } from "../utils.ts";
import { parseToursDates, parseToursRange } from "./tourParser.ts";

// Temporary function while waiting for PG to fix the bug where PG searches for dates that are not cached,
// leading to overall no availability. This function buffers all dates
export function parseToursWithDatesAndBuffer(
  json: TourConfig,
  buffer: number,
): SailingSearch[] {
  json.toursWithSpecificDates = json.toursWithSpecificDates.map((tour) => {
    const bufferedDates = tour.departureDates.flatMap((depDate) => {
      const fromDate: Date = new Date(
        addDaysToDate(new Date(depDate), -buffer),
      );
      const toDate: Date = new Date(addDaysToDate(new Date(depDate), buffer));
      return getDatesInRangeFormatted(fromDate, toDate);
    });
    tour.departureDates = [...new Set(bufferedDates)];
    return tour;
  });

  return parseToursDates(json);
}

export function parseToursWithRangesAndBuffer(
  json: TourConfig,
  buffer: number,
) {
  json.toursWithDateRanges = json.toursWithDateRanges.map((tour) => {
    const fromDate = new Date(tour.departureFromDate);
    const toDate = new Date(tour.departureToDate);
    tour.departureFromDate =
      addDaysToDate(fromDate, -buffer).toJSON().split("T")[0];
    tour.departureToDate = addDaysToDate(toDate, buffer).toJSON().split("T")[0];
    return tour;
  });

  return parseToursRange(json);
}
