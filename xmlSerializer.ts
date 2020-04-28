import { serialize } from "./deps.ts"
import { JsonSearch } from './mod.ts';

export function buildXMLBody (jsonSearch: JsonSearch) {
  return serialize({
    name: "GetAvailPrimPkgsCustom_IN",
    attributes: [],
    children : [
      {
        name: "MsgHeader",
        attributes: [],
        children: [
          {
            name: "Version",
            attributes: [],
            children: "1.0"
          },
          {
            name: "CallerInfo",
            attributes: [],
            children: [
              {
                name: "UserInfo",
                attributes: [],
                children: [
                  {
                    name: "Internal",
                    attributes: [],
                    children: ""
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name : "SearchOptions",
        attributes: [],
        children : [
          {
            name: "CacheSearchMode",
            children: "ForcePopulateCacheOnly",
            attributes: []
          }
        ]
      },
      {
        name: "CustomParams",
        attributes: [],
        children: [
          {
            name: "Scenario",
            attributes: [],
            children: "ONEWAY"
          },
          {
            name: "Param",
            attributes: [],
            children: [
              {
                name: "Code",
                attributes: [],
                children: "DateFrom"
              },
              {
                name: "Value",
                attributes: [],
                children: [
                  {
                    name: "Date",
                    attributes: [],
                    children: jsonSearch.fromDay
                  }
                ]
              }
            ]
          },
          {
            name: "Param",
            attributes: [],
            children: [
              {
                name: "Code",
                attributes: [],
                children: "DateTo"
              },
              {
                name: "Value",
                attributes: [],
                children: [
                  {
                    name: "Date",
                    attributes: [],
                    children: jsonSearch.toDay
                  }
                ]
              }
            ]
          },
          {
            name: "Param",
            attributes: [],
            children: [
              {
                name: "Code",
                attributes: [],
                children: "VoyageType"
              },
              {
                name: "Value",
                attributes: [],
                children: [
                  {
                    name: "Str",
                    attributes: [],
                    children: jsonSearch.voyageType
                  }
                ]
              }
            ]
          },
          {
            name: "Param",
            attributes: [],
            children: [
              {
                name: "Code",
                attributes: [],
                children: "VoyageCode"
              },
              {
                name: "Value",
                attributes: [],
                children: [
                  {
                    name: "Str",
                    attributes: [],
                    children: jsonSearch.voyageCode
                  }
                ]
              }
            ]
          },
          {
            name: "Param",
            attributes: [],
            children: parsePartyMix(jsonSearch.party)
          },
          {
            name: "Param",
            attributes: [],
            children: [
              {
                name: "Code",
                attributes: [],
                children: "UseShipAvailCache"
              },
              {
                name: "Value",
                attributes: [],
                children: [
                  {
                    name: "Str",
                    attributes: [],
                    children: "Y"
                  }
                ]
              }
            ]
          },
          {
            name: "Param",
            attributes: [],
            children: [
              {
                name: "Code",
                attributes: [],
                children: "Market"
              },
              {
                name: "Value",
                attributes: [],
                children: [
                  {
                    name: "Str",
                    attributes: [],
                    children: jsonSearch.market
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });
}

function parsePartyMix(partyMix: string) {
  const code: any[] = [{ name: "Code", attributes: [], children: "PartyMix" }]
  const map: any[] = partyMix.split(",").map(party => {
    return {
      name: "Value",
      attributes: [],
      children: [
        {
          name: "Str",
          attributes: [],
          children: party
        }
      ]
    }
  })
  return code.concat(map);
}