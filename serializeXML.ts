import type { SailingSearch } from "./types.ts"

// Utility for spreading party mixes out
function parseParty(partyMix: string) {
  const res: string[] = partyMix.split(",").map((party) => { return `<Value><Str>${party}</Str></Value>` })
  return res.join("") 
}
  
export function createSeawarePopulateCacheRequest(search: SailingSearch): string {
  return `<GetAvailPrimPkgsCustom_IN>
    <MsgHeader>
      <Version>1.0</Version>
      <CallerInfo><UserInfo><Internal></Internal></UserInfo></CallerInfo>
      <ValidateMode>N</ValidateMode>
    </MsgHeader>
    <SearchOptions>
      <CacheSearchMode>ForcePopulateCacheOnly</CacheSearchMode>
      <IncludePriceDetails>Y</IncludePriceDetails>
    </SearchOptions>
    <CustomParams>
      <Scenario>ONEWAY</Scenario>
      <Param><Code>DateFrom</Code><Value><Date>${search.fromDay}</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>${search.toDay}</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>${search.voyageType}</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>${search.voyageCode}</Str></Value></Param>
      <Param><Code>PartyMix</Code>${parseParty(search.party)}</Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>${search.market}</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`
}

export function createSeawareReadCacheRequest(search: SailingSearch): string {
  return `<GetAvailPrimPkgsCustom_IN>
    <MsgHeader>
      <Version>1.0</Version>
      <CallerInfo><UserInfo><Internal></Internal></UserInfo></CallerInfo>
      <ValidateMode>N</ValidateMode>
    </MsgHeader>
    <SearchOptions>
      <CacheSearchMode>ReadCacheOnly</CacheSearchMode>
      <IncludePriceDetails>N</IncludePriceDetails>
    </SearchOptions>
    <CustomParams>
      <Scenario>ONEWAY</Scenario>
      <Param><Code>DateFrom</Code><Value><Date>${search.fromDay}</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>${search.toDay}</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>${search.voyageType}</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>${search.voyageCode}</Str></Value></Param>
      <Param><Code>PartyMix</Code>${parseParty(search.party)}</Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>${search.market}</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`
}

// TODO: components, sailactivities, classifications, pkgdef, priceguesttotal needed? ValidateMode. OfficeCode? xmlns?
// TODO: Separate function, or is it ok to supply empty allotmentid?
export function createSeawareRequestWithAllotment(search: SailingSearch): string {
  return `<GetAvailPrimPkgsCustom_IN xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <MsgHeader>
      <Version>1.0</Version>
      <CallerInfo><UserInfo><Internal></Internal></UserInfo><OfficeCode>HRG</OfficeCode></CallerInfo>
      <ValidateMode>Y</ValidateMode>
    </MsgHeader>
    <SearchOptions>
      <CacheSearchMode>ForcePopulateCacheOnly</CacheSearchMode>
      <IncludePriceDetails>Y</IncludePriceDetails>
      <IncludeComponents>Y</IncludeComponents>
      <IncludeSailActivities>Y</IncludeSailActivities>
      <IncludeClassifications>Y</IncludeClassifications>
      <IncludePkgDef>Y</IncludePkgDef>
      <IncludePriceGuestTotal>Y</IncludePriceGuestTotal>
    </SearchOptions>
    <CustomParams>
      <Scenario>ONEWAY</Scenario>
      <Param><Code>DateFrom</Code><Value><Date>${search.fromDay}</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>${search.toDay}</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>${search.voyageType}</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>${search.voyageCode}</Str></Value></Param>
      <Param><Code>AllotmentAgreementID</Code><Value><Num>${search.allotmentID}</Num></Value></Param>
      <Param><Code>PartyMix</Code>${parseParty(search.party)}</Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>${search.market}</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`
}