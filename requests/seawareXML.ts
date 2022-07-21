import type { RequestBuildOptions, SailingSearch } from "../types.ts";

const readRequestOptions: RequestBuildOptions = {
  includePriceDetails: "N",
  cacheSearchMode: "ReadCacheOnly",
};

const populateRequestOptions: RequestBuildOptions = {
  includePriceDetails: "Y",
  cacheSearchMode: "ForcePopulateCacheOnly",
};

export function parseParty(partyMix: string) {
  const res: string[] = partyMix.split(",").map((party) => {
    return `<Value><Str>${party}</Str></Value>`;
  });
  return res.join("");
}

const buildRequestBody =
  (options: RequestBuildOptions) => (search: SailingSearch) =>
    `<GetAvailPrimPkgsCustom_IN>
    <MsgHeader>
      <Version>1.0</Version>
      <CallerInfo><UserInfo><Internal></Internal></UserInfo></CallerInfo>
      <ValidateMode>N</ValidateMode>
    </MsgHeader>
    <SearchOptions>
      <CacheSearchMode>${options.cacheSearchMode}</CacheSearchMode>
      <IncludePriceDetails>${options.includePriceDetails}</IncludePriceDetails>
    </SearchOptions>
    <CustomParams>
      <Scenario>ONEWAY</Scenario>
      <Param><Code>DateFrom</Code><Value><Date>${search.fromDay}</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>${search.toDay}</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>${search.voyageType}</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>${search.voyageCode}</Str></Value></Param>
      ${
      search.agreementId
        ? `<Param><Code>AllotmentAgreementID</Code><Value><Num>${search.agreementId}</Num></Value></Param>`
        : ""
    }
      <Param><Code>PartyMix</Code>${parseParty(search.party)}</Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>${search.market}</Str></Value></Param>
    </CustomParams>
  </GetAvailPrimPkgsCustom_IN>`;

export const readReq = buildRequestBody(readRequestOptions);
export const populateReq = buildRequestBody(populateRequestOptions);
