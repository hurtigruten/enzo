import type { SailingSearch, TourConfig } from "../types.ts";
import { addDaysToDate } from "../utils.ts";

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
    fromDay: obj.date.split("T")[0],
    toDay: obj.date.split("T")[0],
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
