import { assertEquals } from "../deps.ts";
import { stripString } from "../utils.ts";
import { parseParty, populateReq, readReq } from "./seawareXML.ts";

Deno.test("Seaware XMLs - Partymix, 1 Adult", () => {
  const party = parseParty("ADULT");
  const expected = "<Value><Str>ADULT</Str></Value>";
  assertEquals(party, expected);
});

Deno.test("Seaware XMLs - Partymix, 2 Adults", () => {
  const party = parseParty("ADULT,ADULT");
  const expected =
    "<Value><Str>ADULT</Str></Value><Value><Str>ADULT</Str></Value>";
  assertEquals(party, expected);
});

Deno.test("Seaware XMLs - Populate Request", () => {
  const sailingSearch = {
    fromDay: "2022-07-21",
    toDay: "2022-07-21",
    voyageCode: "REK-REK",
    voyageType: "EXPLORER",
    agreementId: null,
    party: "ADULT",
    market: "US",
  };

  const actual = populateReq(sailingSearch);
  const expected = stripString(`
  <GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>2022-07-21</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>2022-07-21</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>EXPLORER</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>REK-REK</Str></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>US</Str></Value></Param>
    </CustomParams>
  </GetAvailPrimPkgsCustom_IN>
  `);

  assertEquals(actual, expected);
});

Deno.test("Seaware XMLs - Populate Request, with AllotmentId", () => {
  const sailingSearch = {
    fromDay: "2022-07-21",
    toDay: "2022-07-21",
    voyageCode: "REK-REK",
    voyageType: "EXPLORER",
    agreementId: "1234",
    party: "ADULT,ADULT",
    market: "US",
  };

  const actual = populateReq(sailingSearch);
  const expected = stripString(`
  <GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>2022-07-21</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>2022-07-21</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>EXPLORER</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>REK-REK</Str></Value></Param>
      <Param><Code>AllotmentAgreementID</Code><Value><Num>1234</Num></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>US</Str></Value></Param>
    </CustomParams>
  </GetAvailPrimPkgsCustom_IN>
  `);

  assertEquals(actual, expected);
});

Deno.test("Seaware XMLs - Read Request", () => {
  const sailingSearch = {
    fromDay: "2022-07-21",
    toDay: "2022-07-21",
    voyageCode: "REK-REK",
    voyageType: "EXPLORER",
    agreementId: "1234",
    party: "ADULT,ADULT",
    market: "US",
  };

  const actual = readReq(sailingSearch);
  const expected = stripString(`
  <GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>2022-07-21</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>2022-07-21</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>EXPLORER</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>REK-REK</Str></Value></Param>
      <Param><Code>AllotmentAgreementID</Code><Value><Num>1234</Num></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>US</Str></Value></Param>
    </CustomParams>
  </GetAvailPrimPkgsCustom_IN>
  `);

  assertEquals(actual, expected);
});
