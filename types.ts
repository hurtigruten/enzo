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
};

export type EnvironmentConfig = {
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
  agreementId?: string;
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
