import { transformToXML } from "./serializeXML.ts";

export type CacheConfig = {
  defaultMarkets: string[];
  defaultDaysAhead: number;
  searchRange: number;
  defaultDirection: string;
  defaultPartyMix: string[];
  sailings: Sailing[];
}
export type JsonSearch = {
  fromDay: string,
  toDay: string;
  voyageType: string;
  voyageCode: string;
  party: string;
  market: string;
}
type Sailing = {
  id: string;
  voyageType: string;
  direction?: string;
  fromPort: string;
  toPort: string;
  daysAhead?: number;
  partyMixes?: string[];
  marketFilter?: string[];
  added: Date;
}

export class ConfigParser {

  // Parse Json config and serialize to Seaware XML
  parseConfig(config: CacheConfig, cacheMode: string): string[] {
    const searches: JsonSearch[] = this.produceJsonSearches(config);
    return searches.map((search) => transformToXML(search, cacheMode));
  }

  // Responisble for parsing the JsonConfig and flatten each object based on arrays (partymix, market and pages)
  private produceJsonSearches(json: CacheConfig): JsonSearch[] {
  
    // Mix in default values
    const sailings = json.sailings.map((obj) => {
      const daysAhead = obj.daysAhead || json.defaultDaysAhead;
      const pages = Array.from(Array(Math.ceil(daysAhead / json.searchRange)).keys());
      return {
        voyageType: obj.voyageType,
        voyageCode: obj.fromPort + "-" + obj.toPort,
        partyMixes: obj.partyMixes || json.defaultPartyMix,
        marketList: obj.marketFilter || json.defaultMarkets,
        daysAhead: daysAhead,
        pages: pages
    }});

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
        fromDay: this.dateFromToday(page * json.searchRange),
        toDay: this.dateFromToday(
          Math.min(
            page * json.searchRange + (json.searchRange - 1),
            obj.daysAhead - 1
          )
        ),
      }));
    });

    // Map to JsonSearch objects
    const result: JsonSearch[] = flatDates.map((obj) => ({
      fromDay: obj.fromDay,
      toDay: obj.toDay,
      voyageType: obj.voyageType,
      voyageCode: obj.voyageCode,
      party: obj.party,
      market: obj.market
    }));
    return result;
  }

  // Calculate number of days from today
  private dateFromToday(daysAhead: number): string {
    let date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split("T")[0];
  }
}