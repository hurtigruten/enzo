import type { SailingSearch, TourConfig } from "../types.ts";
import { addDaysToDate, dateFromToday } from "../utils.ts";

export function parseToursDates(json: TourConfig): SailingSearch[] {
  const toursWithSpecifics = json.toursWithSpecificDates.map((tour) => {
    return {
      voyageCode: tour.fromPort + "-" + tour.toPort,
      voyageType: tour.voyageType,
      agreementId: tour.agreementId,
      partyMixes: tour.partyMix || json.defaultPartyMix,
      marketList: tour.marketFilter || json.defaultMarkets,
      departureDates: tour.departureDates,
    };
  });
  const flatParty = toursWithSpecifics.flatMap((obj) => {
    return obj.partyMixes.map((party: string) => ({ ...obj, party }));
  });
  const flatMarket = flatParty.flatMap((obj) => {
    return obj.marketList.map((market: string) => ({ ...obj, market }));
  });
  const flatDates = flatMarket.flatMap((obj) => {
    return obj.departureDates.map((date: string) => ({ ...obj, date }));
  });
  const result: SailingSearch[] = flatDates.map((obj) => ({
    fromDay: addDaysToDate(new Date(obj.date), -30).split("T")[0],
    toDay: addDaysToDate(new Date(obj.date), 30).split("T")[0],
    voyageCode: obj.voyageCode,
    voyageType: obj.voyageType,
    agreementId: obj.agreementId,
    party: obj.party,
    market: obj.market,
  }));
  return result;
}

export function parseToursRange(json: TourConfig): SailingSearch[] {
  const searchRange = json.searchRange || 10;

  const toursWithRange = json.toursWithDateRanges.map((tour) => {
    const fromDate = new Date(tour.departureFromDate.split("T")[0]);
    const toDate = new Date(tour.departureToDate.split("T")[0]);
    const dayDiff = (toDate.getTime() - fromDate.getTime()) /
      (1000 * 3600 * 24);
    const pages = Array.from(Array(Math.ceil(dayDiff / searchRange)).keys());
    return {
      voyageCode: tour.fromPort + "-" + tour.toPort,
      agreementId: tour.agreementId,
      voyageType: tour.voyageType,
      partyMixes: tour.partyMix || json.defaultPartyMix,
      marketList: tour.marketFilter || json.defaultMarkets,
      pages: pages,
      totalRange: dayDiff,
      startDate: fromDate,
      endDate: toDate,
    };
  });
  const flatParty = toursWithRange.flatMap((obj) => {
    return obj.partyMixes.map((party: string) => ({ ...obj, party }));
  });
  const flatMarket = flatParty.flatMap((obj) => {
    return obj.marketList.map((market: string) => ({ ...obj, market }));
  });
  const flatDates = flatMarket.flatMap((obj) => {
    return obj.pages.map((page: number) => ({
      ...obj,
      fromDay: addDaysToDate(obj.startDate, page * searchRange),
      toDay: addDaysToDate(
        obj.startDate,
        Math.min(page * searchRange + (searchRange - 1), obj.totalRange),
      ),
    }));
  });
  const result: SailingSearch[] = flatDates.map((obj) => ({
    fromDay: obj.fromDay.split("T")[0],
    toDay: obj.toDay.split("T")[0],
    voyageCode: obj.voyageCode,
    voyageType: obj.voyageType,
    agreementId: obj.agreementId,
    party: obj.party,
    market: obj.market,
  }));
  return result;
}

// Temporary function while waiting for PG to fix the bug where PG searches for dates that are not cached,
// leading to overall no availability. This function ignores all dates
export function parseToursIgnoreDates(json: TourConfig): SailingSearch[] {
  const daysAhead = 880;
  const searchRange = 10;
  const rangeTours = json.toursWithDateRanges.map((obj) => {
    const pages = Array.from(
      Array(Math.ceil(daysAhead / searchRange)).keys(),
    );
    return {
      voyageType: obj.voyageType,
      voyageCode: obj.fromPort + "-" + obj.toPort,
      partyMixes: obj.partyMix || json.defaultPartyMix,
      marketList: obj.marketFilter || json.defaultMarkets,
      daysAhead: daysAhead,
      pages: pages,
    };
  });
  const dateTours = json.toursWithSpecificDates.map((obj) => {
    const pages = Array.from(
      Array(Math.ceil(daysAhead / searchRange)).keys(),
    );
    return {
      voyageType: obj.voyageType,
      voyageCode: obj.fromPort + "-" + obj.toPort,
      partyMixes: obj.partyMix || json.defaultPartyMix,
      marketList: obj.marketFilter || json.defaultMarkets,
      daysAhead: daysAhead,
      pages: pages,
    };
  });
  const sailings = dateTours.concat(rangeTours);

  const flatParty = sailings.flatMap((obj) => {
    return obj.partyMixes.map((party: string) => ({ ...obj, party }));
  });
  const flatMarket = flatParty.flatMap((obj) => {
    return obj.marketList.map((market: string) => ({ ...obj, market }));
  });
  const flatDates = flatMarket.flatMap((obj) => {
    return obj.pages.map((page: number) => ({
      ...obj,
      fromDay: dateFromToday(page * searchRange),
      toDay: dateFromToday(
        Math.min(
          page * searchRange + (searchRange - 1),
          obj.daysAhead - 1,
        ),
      ),
    }));
  });
  const result: SailingSearch[] = flatDates.map((obj) => ({
    fromDay: obj.fromDay,
    toDay: obj.toDay,
    voyageType: obj.voyageType,
    voyageCode: obj.voyageCode,
    party: obj.party,
    market: obj.market,
  }));
  return result;
}
