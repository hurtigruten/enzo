export type RequestBuildOptions = {
  includePriceDetails: "N" | "Y";
  cacheSearchMode: "ReadCacheOnly" | "ForcePopulateCacheOnly";
};

export type SlackClient = {
  channelId: string;
  botToken: string;
  appToken: string;
};

export type PopulateOptions = {
  tours?: boolean;
  tourFilter?: string;
  voyages?: boolean;
  voyageFilter?: string;
  readMode?: boolean;
  ignoreTourDates?: boolean;
  bufferTourDates?: boolean;
  bufferSize?: number;
  broadcastMessage?: string;
};

export type EnvironmentConfig = {
  pgPassword: string;
  pgUserName: string;
  authAPI: string;
  tourAPI: string;
  bizlogicAPI: string;
  poolSize?: number;
};

export type VoyageConfig = {
  defaultMarkets: string[];
  defaultDaysAhead: number;
  searchRange: number;
  defaultDirection: string;
  defaultPartyMix: string[];
  sailings: Sailing[];
};

export type SailingSearch = {
  fromDay: string;
  toDay: string;
  voyageType: string;
  voyageCode: string;
  party: string;
  market: string;
  agreementId?: string | null;
};

export type Sailing = {
  voyageType: string;
  direction?: string;
  fromPort: string;
  toPort: string;
  daysAhead?: number;
  partyMixes?: string[];
  marketFilter?: string[];
};

export type TourConfig = {
  defaultMarkets: string[];
  defaultPartyMix: string[];
  searchRange?: number;
  toursWithSpecificDates: TourWithDates[];
  toursWithDateRanges: TourWithRange[];
};

type TourBasic = {
  tourCode: string;
  fromPort: string;
  toPort: string;
  voyageType: string;
  agreementId: string;
  direction?: string;
  partyMix?: string[];
  marketFilter?: string[];
};

export type TourWithRange = TourBasic & {
  departureFromDate: string;
  departureToDate: string;
};

export type TourWithDates = TourBasic & {
  departureDates: string[];
};

export type Metadata = {
  event_type: string;
  event_payload: {
    text: string;
    run_options: PopulateOptions;
  };
};

export type AuthRequest = {
  userName: string;
  password: string;
};

export type TokenResponse = {
  token: string;
  ttl: number;
}
