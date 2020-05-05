export interface CacheConfig {
  defaultMarkets: string[];
  defaultDaysAhead: number;
  searchDayRange: number;
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

    // Flatten out partymixes and mix in default values
    const flatParty = json.sailings.flatMap((obj) => {
      obj.partyMixes = obj.partyMixes || json.defaultPartyMix;
      obj.marketList = obj.marketFilter || json.defaultMarkets;
      obj.daysAhead = obj.daysAhead || json.defaultDaysAhead;
      obj.pages = Array.from(Array(Math.ceil(obj.daysAhead / json.searchDayRange)).keys());
      return obj.partyMixes.map((party: string) => ({ ...obj, party }));
    });

    // Flatten out markets
    const flatMarket = flatParty.flatMap((obj) => {
      return obj.marketList.map((market: string) => ({ ...obj, market }));
    });

    // Flatten out pages and return list of JsonSearch objects
    return flatMarket.flatMap((obj) => {
      return obj.pages.map((page: number) => ({
        fromDay: this.dateFromToday(page * json.searchDayRange),
        toDay: this.dateFromToday(
          Math.min(
            (page * json.searchDayRange) + (json.searchDayRange - 1),
            obj.daysAhead - 1
          )
        ),
        voyageType: obj.voyageType,
        voyageCode: obj.fromPort + "-" + obj.toPort,
        party: obj.party,
        market: obj.market,
      }));
    });
  }

  private dateFromToday(daysAhead: number): string {
    let date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split("T")[0];
  }

  private parseParty(partyMix: string) {
    return partyMix.split(",").map(party => { `<Value><Str>${party}</Str></Value>` })
  }

  private transformToXML(jsonSearch: JsonSearch): string {
    return `<GetAvailPrimPkgsCustom_IN><MsgHeader><Version>1.0</Version><CallerInfo><UserInfo><Internal></Internal></UserInfo></CallerInfo><ValidateMode>N</ValidateMode></MsgHeader>
      <SearchOptions><CacheSearchMode>ForcePopulateCacheOnly</CacheSearchMode></SearchOptions><CustomParams><Scenario>ONEWAY</Scenario>
      <Param><Code>DateFrom</Code><Value><Date>${jsonSearch.fromDay}</Date></Value></Param><Param><Code>DateTo</Code><Value><Date>${jsonSearch.toDay}</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>${jsonSearch.voyageType}</Str></Value></Param><Param><Code>VoyageCode</Code><Value><Str>${jsonSearch.voyageCode}</Str></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>${this.parseParty(jsonSearch.party)}</Str></Value></Param><Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>${jsonSearch.market}</Str></Value></Param></CustomParams></GetAvailPrimPkgsCustom_IN>`
  }
}