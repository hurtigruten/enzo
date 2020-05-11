import { CacheConfig, JsonSearch } from '../models/models.ts';
import { transformToXML } from "./serializeXML.ts";

export class ConfigParser {

  constructor(readonly config: CacheConfig, readonly cacheMode: string) {}

  // Parse Json config and serialize to Seaware XML
  parseConfig(): string[] {
    const searches: JsonSearch[] = this.produceJsonSearches(this.config);
    return searches.map((search) => transformToXML(search, this.cacheMode));
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