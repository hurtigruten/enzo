import type { SailingSearch, VoyageConfig } from "../types.ts";
import { dateFromToday } from "../utils.ts";

export function parseVoyages(json: VoyageConfig): SailingSearch[] {
  const sailings = json.sailings.map((obj) => {
    const daysAhead = obj.daysAhead || json.defaultDaysAhead;
    const pages = Array.from(
      Array(Math.ceil(daysAhead / json.searchRange)).keys(),
    );
    return {
      voyageType: obj.voyageType,
      voyageCode: obj.fromPort + "-" + obj.toPort,
      partyMixes: obj.partyMixes || json.defaultPartyMix,
      marketList: obj.marketFilter || json.defaultMarkets,
      daysAhead: daysAhead,
      pages: pages,
    };
  });
  const flatParty = sailings.flatMap((obj) => {
    return obj.partyMixes.map((party: string) => ({ ...obj, party }));
  });
  const flatMarket = flatParty.flatMap((obj) => {
    return obj.marketList.map((market: string) => ({ ...obj, market }));
  });
  const flatDates = flatMarket.flatMap((obj) => {
    return obj.pages.map((page: number) => ({
      ...obj,
      fromDay: dateFromToday(page * json.searchRange),
      toDay: dateFromToday(
        Math.min(
          page * json.searchRange + (json.searchRange - 1),
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
