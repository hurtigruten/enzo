import { SailingSearch, TourConfig } from "../types.ts";
import { addDaysToDate, getDatesInRangeFormatted } from "../utils.ts";
import { parseToursDates } from "./tourParser.ts";

// Temporary function while waiting for PG to fix the bug where PG searches for dates that are not cached,
// leading to overall no availability. This function buffers all dates
export function parseToursWithDatesAndBuffer(
  json: TourConfig,
  buffer: number,
): SailingSearch[] {
  json.toursWithSpecificDates = json.toursWithSpecificDates.map((tour) => {
    const bufferedDates = tour.departureDates.flatMap((depDate) => {
      const fromDate: Date = new Date(addDaysToDate(new Date(depDate), -buffer));
      const toDate: Date = new Date(addDaysToDate(new Date(depDate), buffer));
      return getDatesInRangeFormatted(fromDate, toDate);
    });
    tour.departureDates = [...new Set(bufferedDates)];
    return tour;
  });

  return parseToursDates(json);
}

// TODO: Add method for Ranges. Add populate option. Add tests