import { SailingSearch, TourConfig } from "../types.ts";
import { dateFromToday } from "../utils.ts";

// Temporary function while waiting for PG to fix the bug where PG searches for dates that are not cached,
// leading to overall no availability. This function ignores all dates
export function parseToursIgnoreDates(json: TourConfig, numberOfDaysToCache?: number): SailingSearch[] {
  const daysAhead = numberOfDaysToCache || 880 ;
  const searchRange = json.searchRange || 20;
  const rangeTours = json.toursWithDateRanges.map((obj) => {
    const pages = Array.from(
      Array(Math.ceil(daysAhead / searchRange)).keys(),
    );
    return {
      voyageType: obj.voyageType,
      voyageCode: obj.fromPort + "-" + obj.toPort,
      agreementId: obj.agreementId,
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
      agreementId: obj.agreementId,
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
    fromDay: obj.fromDay.split("T")[0],
    toDay: obj.toDay.split("T")[0],
    voyageType: obj.voyageType,
    voyageCode: obj.voyageCode,
    party: obj.party,
    market: obj.market,
    agreementId: obj.agreementId,
  }));
  return result;
}
