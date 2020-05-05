export interface CacheConfig {
  defaultMarkets: string[];
  defaultDaysAhead: number;
  searchRange: number;
  defaultDirection: string;
  defaultPartyMix: string[];
  sailings: any[];
}
interface JsonSearch {
  fromDay: string,
  toDay: string;
  voyageType: string;
  voyageCode: string;
  party: string;
  market: string;
}

export class ConfigParser {
  constructor(readonly config: CacheConfig) {}
  // Parse Json config and serialize to Seaware XML
  parseConfig(): string[] {
    const searches: JsonSearch[] = this.produceJsonSearches(this.config);
    return searches.map((search: JsonSearch) => this.transformToXML(search));
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

  private dateFromToday(daysAhead: number): string {
    let date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split("T")[0];
  }

  private parseParty(partyMix: string) {
    const res: string[] = partyMix.split(",").map((party) => { return `<Value><Str>${party}</Str></Value>` })
    return res.join("") 
  }

  private transformToXML(search: JsonSearch): string {
    return `<GetAvailPrimPkgsCustom_IN><MsgHeader><Version>1.0</Version><CallerInfo><UserInfo><Internal></Internal></UserInfo></CallerInfo><ValidateMode>N</ValidateMode></MsgHeader>
      <SearchOptions><CacheSearchMode>ForcePopulateCacheOnly</CacheSearchMode></SearchOptions><CustomParams><Scenario>ONEWAY</Scenario>
      <Param><Code>DateFrom</Code><Value><Date>${search.fromDay}</Date></Value></Param><Param><Code>DateTo</Code><Value><Date>${search.toDay}</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>${search.voyageType}</Str></Value></Param><Param><Code>VoyageCode</Code><Value><Str>${search.voyageCode}</Str></Value></Param>
      <Param><Code>PartyMix</Code>${this.parseParty(search.party)}</Param><Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>${search.market}</Str></Value></Param></CustomParams></GetAvailPrimPkgsCustom_IN>`
  }
}