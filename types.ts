export type CacheConfig = {
    defaultMarkets: string[];
    defaultDaysAhead: number;
    searchRange: number;
    cacheMode: string;
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
  export type Sailing = {
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