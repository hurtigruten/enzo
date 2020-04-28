export function produceJsonSearches(sailings: any[], searchRange: number, allMarkets: string[]) {

    // Flatten out partymixes, and mixin markets
  let flatParty = sailings.flatMap((sailing) => {
    return sailing.partyMixes.map((party: string) => ({
    voyageType: sailing.voyageType,
    daysAhead: sailing.daysAhead,
    voyageCode: sailing.fromPort + "-" + sailing.toPort,
    party,
    markets: sailing.marketFilter || allMarkets
    }));
  });

  // Flatten out markets and mixin pages
  let flatMarket = flatParty.flatMap((sailing) => {
    return sailing.markets.map((market: string) => ({
      voyageType: sailing.voyageType,
      daysAhead: sailing.daysAhead,
      voyageCode: sailing.voyageCode,
      market,
      party: sailing.party,
      pages : Array.from(Array(Math.ceil(sailing.daysAhead / searchRange)).keys()),
     }));
  });

  // Flatten out pages and transform to date
  return flatMarket.flatMap((sailing) => {
    return sailing.pages.map((page: number) => ({
      fromDay: dateFromToday(page * searchRange),
      toDay: dateFromToday(Math.min(page * searchRange + searchRange - 1, sailing.daysAhead - 1)),
      voyageType: sailing.voyageType,
      voyageCode: sailing.voyageCode,
      party: sailing.party,
      market: sailing.market,
    }));
  });
}

function dateFromToday(daysAhead: number) {
  let date = new Date();
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString().split("T")[0];
}