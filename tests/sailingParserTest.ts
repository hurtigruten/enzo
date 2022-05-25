import { assertArrayIncludes } from "./deps.ts";
import { PopulateOptions, VoyageConfig } from "../types.ts";
import { generateVoyageXMLs } from "../requests/generators.ts";

Deno.test("Parse Voyages test #1", () => {
  const voyageConfig: VoyageConfig = JSON.parse(
    Deno.readTextFileSync("./sailingParserTest.json"),
  );
  const options: PopulateOptions = { voyages: true };
  const payload: string[] = generateVoyageXMLs(options, voyageConfig);

  const assertXMLstring1 = `<GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>2022-05-05</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>2022-05-09</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>NORWAY_VOYAGE</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>BGO-BGO</Str></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>NO</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`;

  const assertXMLstring2 = `<GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>2022-05-10</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>2022-05-14</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>NORWAY_VOYAGE</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>BGO-BGO</Str></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>UK</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`;

  assertArrayIncludes(payload, [assertXMLstring1]);
  assertArrayIncludes(payload, [assertXMLstring2]);
});
