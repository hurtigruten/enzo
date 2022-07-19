import { SailingSearch, TourConfig } from "../types.ts";
import { dateFromToday } from "../utils.ts";

// Temporary function while waiting for PG to fix the bug where PG searches for dates that are not cached,
// leading to overall no availability. This function buffers all dates
export function parseToursBufferDates( json: TourConfig, bufferSize: number): SailingSearch[] {
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