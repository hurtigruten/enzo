import type { JsonSearch } from "./types.ts"

// Utility for spreading party mixes out
function parseParty(partyMix: string) {
  const res: string[] = partyMix.split(",").map((party) => { return `<Value><Str>${party}</Str></Value>` })
  return res.join("") 
}
  
// Template literal are slightly better than string cocatination. Could use an XML lib for this.
export function transformToXML(search: JsonSearch, cacheMode: string): string {
  return `<GetAvailPrimPkgsCustom_IN><MsgHeader><Version>1.0</Version><CallerInfo><UserInfo><Internal></Internal></UserInfo></CallerInfo><ValidateMode>N</ValidateMode></MsgHeader>
    <SearchOptions><CacheSearchMode>${cacheMode}</CacheSearchMode><IncludePriceDetails>Y</IncludePriceDetails></SearchOptions><CustomParams><Scenario>ONEWAY</Scenario>
    <Param><Code>DateFrom</Code><Value><Date>${search.fromDay}</Date></Value></Param><Param><Code>DateTo</Code><Value><Date>${search.toDay}</Date></Value></Param>
    <Param><Code>VoyageType</Code><Value><Str>${search.voyageType}</Str></Value></Param><Param><Code>VoyageCode</Code><Value><Str>${search.voyageCode}</Str></Value></Param>
    <Param><Code>PartyMix</Code>${parseParty(search.party)}</Param><Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
    <Param><Code>Market</Code><Value><Str>${search.market}</Str></Value></Param></CustomParams></GetAvailPrimPkgsCustom_IN>`
}