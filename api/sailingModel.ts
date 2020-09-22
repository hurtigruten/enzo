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

export interface CacheConfig {
    defaultMarkets: string[];
    defaultDaysAhead: number;
    searchRange: number;
    defaultDirection: string;
    defaultPartyMix: string[];
    sailings: Sailing[];
}