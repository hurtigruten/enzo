import type { SailingSearch } from "../types.ts";

export function readReq(search: SailingSearch): string {
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
      <Param><Code>AllotmentAgreementID</Code><Value><Num>${search.agreementId}</Num></Value></Param>
      <Param><Code>PartyMix</Code>${parseParty(search.party)}</Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>${search.market}</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`;
}

export function populateReq(search: SailingSearch): string {
  if (search.agreementId) {
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
      <Param><Code>AllotmentAgreementID</Code><Value><Num>${search.agreementId}</Num></Value></Param>
      <Param><Code>PartyMix</Code>${parseParty(search.party)}</Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>${search.market}</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`;
  } else {
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
    </GetAvailPrimPkgsCustom_IN>`;
  }
}

function parseParty(partyMix: string) {
  const res: string[] = partyMix.split(",").map((party) => {
    return `<Value><Str>${party}</Str></Value>`;
  });
  return res.join("");
}
