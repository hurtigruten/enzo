import type { CacheConfig, SailingSearch } from "./types.ts";

const SEARCH_RANGE = 10;

export function produceJsonSearches(json: CacheConfig): SailingSearch[] {
  // Mix in default values
  const sailings = json.sailings.map((obj) => {
    const daysAhead = obj.daysAhead || json.defaultDaysAhead;
    const pages = Array.from(Array(Math.ceil(daysAhead / SEARCH_RANGE)).keys());
    return {
      voyageType: obj.voyageType,
      voyageCode: obj.fromPort + "-" + obj.toPort,
      partyMixes: obj.partyMixes || json.defaultPartyMix,
      marketList: obj.marketFilter || json.defaultMarkets,
      daysAhead: daysAhead,
      pages: pages,
    };
  });

  // Flatten out partymixes
  const flatParty = sailings.flatMap((obj) => {
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
      fromDay: dateFromToday(page * json.searchRange),
      toDay: dateFromToday(
        Math.min(
          page * json.searchRange + (json.searchRange - 1),
          obj.daysAhead - 1
        )
      ),
    }));
  });

  // Map to JsonSearch objects
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

// Calculate number of days from today
function dateFromToday(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split("T")[0];
}