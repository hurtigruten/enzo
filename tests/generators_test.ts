import { assertArrayIncludes } from "./deps.ts";
import { PopulateOptions, TourConfig } from "../types.ts";
import { generateTourXMLs } from "../requests/generators.ts";
import { stripString } from "../utils.ts";

Deno.test("Parse Tour with range and agreement id", () => {
  const tourConfig: TourConfig = JSON.parse(
    Deno.readTextFileSync("./generators_test.json"),
  ) as TourConfig;
  const options: PopulateOptions = { tours: true, ignoreTourDates: false };
  const payload: string[] = generateTourXMLs(tourConfig, options);

  const strippedPayload = payload.map((search) => {
    return stripString(search);
  });

  const expectedXML = `<GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>2023-05-05</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>2023-05-14</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>NORWAY_VOYAGE</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>BGO-BGO</Str></Value></Param>
      <Param><Code>AllotmentAgreementID</Code><Value><Num>6334</Num></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>UK</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`;

  assertArrayIncludes(strippedPayload, [stripString(expectedXML)]);
});

Deno.test("Parse Tour with specific dates and agreement id", () => {
  const tourConfig: TourConfig = JSON.parse(
    Deno.readTextFileSync("./tourParser_test.json"),
  ) as TourConfig;
  const options: PopulateOptions = { tours: true };
  const payload: string[] = generateTourXMLs(tourConfig, options);

  const strippedPayload = payload.map((search) => {
    return stripString(search);
  });

  const expectedXML = `<GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>2023-05-04</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>2023-05-04</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>NORWAY_VOYAGE</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>BGO-TRD</Str></Value></Param>
      <Param><Code>AllotmentAgreementID</Code><Value><Num>6276</Num></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>UK</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`;

  assertArrayIncludes(strippedPayload, [stripString(expectedXML)]);
});

// TODO: Add tests that show that exact dates are produces. Ref the date bug with add to dates

Deno.test("Generator culling test with a Range", () => {
  const tourConfig = JSON.parse(
    Deno.readTextFileSync("./tourConfigCulling_test.json"),
  ) as TourConfig;
  const today = new Date("2022-04-02");

  tourConfig.toursWithDateRanges = cullToursRange(today, tourConfig);
  const searches: SailingSearch[] = parseToursRange(tourConfig);

  const expectedArray = [
    {
      fromDay: "2022-04-02",
      toDay: "2022-04-03",
      voyageCode: "BGO-BGO",
      voyageType: "NORWAY_VOYAGE",
      agreementId: "6334",
      party: "ADULT,ADULT",
      market: "UK",
    },
    {
      fromDay: "2022-04-05",
      toDay: "2022-04-08",
      voyageCode: "REK-REK",
      voyageType: "EXPLORER",
      agreementId: "6334",
      party: "ADULT,ADULT",
      market: "UK",
    },
  ];
  assertEquals(searches, expectedArray);
});

Deno.test("Generator culling test with specific dates", () => {
  const tourConfig = JSON.parse(
    Deno.readTextFileSync("./tourConfigCulling_test.json"),
  ) as TourConfig;
  const today = new Date("2022-04-02");

  tourConfig.toursWithSpecificDates = cullToursDates(today, tourConfig);
  const searches: SailingSearch[] = parseToursDates(tourConfig);

  const expected1: SailingSearch = {
    fromDay: "2022-04-03",
    toDay: "2022-04-03",
    voyageType: "EXPLORER",
    voyageCode: "REK-REK",
    party: "ADULT,ADULT",
    market: "UK",
    agreementId: null,
  };
  const expected2: SailingSearch = {
    fromDay: "2022-08-24",
    toDay: "2022-08-24",
    voyageType: "EXPLORER",
    voyageCode: "REK-REK",
    party: "ADULT,ADULT",
    market: "UK",
    agreementId: "6334",
  };

  assertArrayIncludes(searches, [expected1]);
  assertArrayIncludes(searches, [expected2]);
});
