export interface CacheConfig {
    defaultMarkets: string[];
    defaultDaysAhead: number;
    searchRange: number;
    defaultDirection: string;
    defaultPartyMix: string[];
    sailings: Sailing[];
}
export interface JsonSearch {
    fromDay: string,
    toDay: string;
    voyageType: string;
    voyageCode: string;
    party: string;
    market: string;
}
export interface Sailing {
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