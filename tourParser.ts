import type { TourConfig, SailingSearch } from "./types.ts";

export function parseToursWithSpecificDates(json: TourConfig): SailingSearch[] {
  // Mix in default values
  const toursWithSpecifics = json.toursWithSpecificDates.map((tour) => {
    return {
      voyageCode: tour.fromPort + "-" + tour.toPort,
      agreementID: tour.agreementID,
      partyMixes: tour.partyMix || json.defaultPartyMix,
      marketList: tour.marketFilter || json.defaultMarkets,
      departureDates: tour.departureDates,
    };
  });

  // Flatten out partymixes
  const flatParty = toursWithSpecifics.flatMap((obj) => {
    return obj.partyMixes.map((party: string) => ({ ...obj, party }));
  });

  // Flatten out markets
  const flatMarket = flatParty.flatMap((obj) => {
    return obj.marketList.map((market: string) => ({ ...obj, market }));
  });

  // Flatten out departuredates
  const flatDates = flatMarket.flatMap((obj) => {
    return obj.departureDates.map((date: string) => ({ ...obj, date }));
  });

  // Map to JsonSearch objects
  const result: SailingSearch[] = flatDates.map((obj) => ({
    fromDay: obj.date,
    toDay: obj.date,
    voyageCode: obj.voyageCode,
    allotmentID: obj.agreementID,
    party: obj.party,
    market: obj.market,
  }));
  return result;
}

export function parseToursWithDateRange(json: TourConfig): SailingSearch[] {
  const SEARCH_RANGE = 10;
  const DAY = 1000 * 3600 * 24;

  // Mix in default values
  const toursWithRange = json.toursWithDateRanges.map((tour) => {
    const fromDate = new Date(tour.departureDateFrom);
    const toDate = new Date(tour.departureDateTo);
    const dayDiff = (toDate.getTime() - fromDate.getTime()) / DAY;
    const pages = Array.from(Array(Math.ceil(dayDiff / SEARCH_RANGE)).keys());
    return {
      voyageCode: tour.fromPort + "-" + tour.toPort,
      agreementID: tour.agreementID,
      partyMixes: tour.partyMix || json.defaultPartyMix,
      marketList: tour.marketFilter || json.defaultMarkets,
      pages: pages,
      totalRange: dayDiff,
      startDate: fromDate,
      endDate: toDate,
    };
  });

  // Flatten out partymixes
  const flatParty = toursWithRange.flatMap((obj) => {
    return obj.partyMixes.map((party: string) => ({ ...obj, party }));
  });

  // Flatten out markets
  const flatMarket = flatParty.flatMap((obj) => {
    return obj.marketList.map((market: string) => ({ ...obj, market }));
  });

  // Flatten out pages
  const flatDates = flatMarket.flatMap((obj) => {
    return obj.pages.map((page: number) => ({
      ...obj,
      fromDay: addDaysToDate(obj.startDate, page * SEARCH_RANGE),
      toDay: addDaysToDate(obj.startDate, Math.min(page * SEARCH_RANGE + (SEARCH_RANGE - 1), obj.totalRange)
      ),
    }));
  });

  // Map to JsonSearch objects
  const result: SailingSearch[] = flatDates.map((obj) => ({
    fromDay: obj.fromDay,
    toDay: obj.toDay,
    voyageCode: obj.voyageCode,
    allotmentID: obj.agreementID,
    party: obj.party,
    market: obj.market,
  }));
  return result;
}

function addDaysToDate(baseDate: Date, daysToAdd: number) {
  const copy = new Date(Number(baseDate));
  copy.setDate(baseDate.getDate() + daysToAdd);
  return copy.toISOString().split("T")[0];
}