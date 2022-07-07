import {
  PopulateOptions,
  Sailing,
  SailingSearch,
  TourConfig,
  TourWithDates,
  TourWithRange,
  VoyageConfig,
} from "../types.ts";
import { populateReq, readReq } from "./seawareXML.ts";
import { voyageConfig } from "../configs/voyages.ts";
import {
  parseToursDates,
  parseToursRange,
} from "../parsers/tourParser.ts";
import { parseVoyages } from "../parsers/voyageParser.ts";
import { parseToursIgnoreDates } from "../parsers/tourParserIgnoreDates.ts";

export function generateVoyageXMLs(
  options: PopulateOptions,
  inputConfig?: VoyageConfig,
): string[] {
  const reqFn = options.readMode ? readReq : populateReq;
  const config: VoyageConfig = inputConfig || { ...voyageConfig };
  if (options.voyageFilter) {
    const [fromPort, toPort] = options.voyageFilter.split("-");
    config.sailings = voyageConfig.sailings.filter(
      function (sailing: Sailing) {
        return sailing.fromPort === fromPort && sailing.toPort === toPort;
      },
    );
  }
  const searches: SailingSearch[] = parseVoyages(config);
  return searches.map((search: SailingSearch) => reqFn(search));
}

export function cullToursRange(
  today: Date,
  tours: TourConfig,
): TourWithRange[] {
  return tours.toursWithDateRanges.filter(function (tour: TourWithRange) {
    const departureFromDate = new Date(tour.departureFromDate);
    const departureToDate = new Date(tour.departureToDate);
    if (departureFromDate >= today && departureToDate >= today) {
      return tour;
    }
    if (departureFromDate < today && departureToDate >= today) {
      tour.departureFromDate = today.toISOString().split("T")[0];
      return tour;
    }
  });
}

export function cullToursDates(
  today: Date,
  tours: TourConfig,
): TourWithDates[] {
  const onlyNewTours = tours.toursWithSpecificDates.map(
    function (tour: TourWithDates) {
      tour.departureDates = tour.departureDates.filter(function (date: string) {
        return new Date(date) >= today;
      });
      return tour;
    },
  );
  const nonEmptyTours = onlyNewTours.filter(function (tour: TourWithDates) {
    return tour.departureDates.length > 0;
  });
  return nonEmptyTours;
}

export function generateTourXMLs(
  tourConfig: TourConfig,
  options: PopulateOptions,
): string[] {
  const reqFn = options.readMode ? readReq : populateReq;
  if (options.tourFilter) {
    tourConfig.toursWithDateRanges = tourConfig.toursWithDateRanges.filter(
      function (tour: TourWithRange) {
        return tour.tourCode === options.tourFilter;
      },
    );
    tourConfig.toursWithSpecificDates = tourConfig.toursWithSpecificDates
      .filter(function (tour: TourWithDates) {
        return tour.tourCode === options.tourFilter;
      });
  }
  let searches: SailingSearch[] = [];
  if (options.ignoreTourDates) {
    searches = parseToursIgnoreDates(tourConfig, 880);
  } else {
    const today = new Date();
    tourConfig.toursWithDateRanges = cullToursRange(today, tourConfig);
    tourConfig.toursWithSpecificDates = cullToursDates(today, tourConfig);
    searches = parseToursRange(tourConfig).concat(parseToursDates(tourConfig));
  }
  return searches.map((search: SailingSearch) => reqFn(search));
}
