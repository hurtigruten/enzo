export type CacheConfig = {
  defaultMarkets: string[];
  defaultDaysAhead: number;
  searchRange: number;
  cacheMode: string;
  defaultDirection: string;
  defaultPartyMix: string[];
  sailings: Sailing[];
}

export type SailingSearch = {
  fromDay: string;
  toDay: string;
  voyageType: string;
  voyageCode: string;
  party: string;
  market: string;
  allotmentID?: number;
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

export type TourConfig = {
  defaultMarkets: string[];
  defaultPartyMix: string[];
  toursWithSpecificDates: TourWithSpecificDepartureDates[];
  toursWithDateRanges: TourWithDepartureDateRange[];
}

type TourBasic = {
  id: number;
  name: string;
  fromPort: string;
  toPort: string;
  agreementID?: number;
  partyMix?: string[];
  marketFilter?: string[];
}

export type TourWithDepartureDateRange = TourBasic & {
  departureDateFrom: Date;
  departureDateTo: Date;
}

export type TourWithSpecificDepartureDates = TourBasic & {
  departureDates: string[];
}

