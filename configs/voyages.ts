import { VoyageConfig } from "../types.ts";

export const voyageConfig: VoyageConfig = {
  "defaultDaysAhead": 730,
  "defaultDirection": "North",
  "defaultMarkets": [
    "DE",
    "FR",
    "NO",
    "UK",
    "US",
  ],
  "defaultPartyMix": [
    "ADULT",
    "ADULT,ADULT",
  ],
  "searchRange": 10,
  "sailings": [
    {
      "daysAhead": 730,
      "direction": "North_South",
      "fromPort": "BGO",
      "toPort": "BGO",
      "voyageType": "NORWAY_VOYAGE",
    },
    {
      "daysAhead": 365,
      "direction": "North",
      "fromPort": "BGO",
      "toPort": "KKN",
      "voyageType": "NORWAY_VOYAGE",
    },
    {
      "daysAhead": 365,
      "direction": "South",
      "fromPort": "KKN",
      "toPort": "BGO",
      "voyageType": "NORWAY_VOYAGE",
    },
    {
      "daysAhead": 90,
      "direction": "South",
      "fromPort": "TRD",
      "marketFilter": [
        "NO",
        "UK",
      ],
      "toPort": "BGO",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 90,
      "direction": "North",
      "fromPort": "BGO",
      "marketFilter": [
        "NO",
        "UK",
      ],
      "toPort": "TRD",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 60,
      "direction": "South",
      "fromPort": "TOS",
      "marketFilter": [
        "NO",
      ],
      "toPort": "TRD",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 60,
      "direction": "North",
      "fromPort": "TOS",
      "marketFilter": [
        "NO",
        "UK",
      ],
      "toPort": "KKN",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 30,
      "direction": "North",
      "fromPort": "BGO",
      "marketFilter": [
        "NO",
        "UK",
      ],
      "toPort": "TOS",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 30,
      "direction": "North",
      "fromPort": "TRD",
      "marketFilter": [
        "NO",
      ],
      "toPort": "BOO",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 90,
      "direction": "North",
      "fromPort": "BGO",
      "marketFilter": [
        "NO",
      ],
      "toPort": "AES",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 60,
      "direction": "South",
      "fromPort": "AES",
      "marketFilter": [
        "NO",
      ],
      "toPort": "BGO",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 60,
      "direction": "South",
      "fromPort": "TOS",
      "marketFilter": [
        "NO",
        "UK",
      ],
      "toPort": "SVJ",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 30,
      "direction": "North",
      "fromPort": "SVJ",
      "marketFilter": [
        "NO",
      ],
      "toPort": "TOS",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 30,
      "direction": "South",
      "fromPort": "MOL",
      "marketFilter": [
        "NO",
      ],
      "toPort": "BGO",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 30,
      "direction": "South",
      "fromPort": "TOS",
      "marketFilter": [
        "NO",
      ],
      "toPort": "HRD",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 30,
      "direction": "North",
      "fromPort": "TOS",
      "marketFilter": [
        "NO",
      ],
      "toPort": "HVG",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
    {
      "daysAhead": 30,
      "direction": "South",
      "fromPort": "TOS",
      "marketFilter": [
        "NO",
      ],
      "toPort": "SRD",
      "voyageType": "NORWAY_SHORT_VOYAGE",
    },
  ],
};
