import { assertArrayIncludes, assertEquals } from "../deps.ts";
import { parseToursDates, parseToursRange } from "../parsers/tourParser.ts";
import {
  PopulateOptions,
  SailingSearch,
  TourConfig,
  VoyageConfig,
} from "../types.ts";
import { dateFromTodayFormatted, stripString } from "../utils.ts";
import {
  cullToursDates,
  cullToursRange,
  generateTourXMLs,
  generateVoyageXMLs,
} from "./generators.ts";

const tourConfig: TourConfig = JSON.parse(
  Deno.readTextFileSync("../testdata/tourAPI.json"),
) as TourConfig;

const voyageConfig: VoyageConfig = JSON.parse(
  Deno.readTextFileSync("../testdata/voyageConfig.json"),
);

Deno.test("Generators - Parse Tours with Range", () => {
  const options: PopulateOptions = { tours: true, ignoreTourDates: false };
  const payload: string[] = generateTourXMLs(tourConfig, options);

  const strippedPayload = payload.map((search) => {
    return stripString(search);
  });

  const expectedXML = `
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
      <Param><Code>DateFrom</Code><Value><Date>2030-04-01</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>2030-04-10</Date></Value></Param>
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

Deno.test("Generators - Parse Tours with Specific dates", () => {
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

Deno.test("Generators - Parse Tours with a filter", () => {
  const options: PopulateOptions = { tours: true, tourFilter: "TOURFILTER" };
  const payload: string[] = generateTourXMLs(tourConfig, options);

  assertEquals(payload.length, 1);
});

Deno.test("Generators - Culling Range, Tour with some dates in the past", () => {
  const config: TourConfig = JSON.parse(JSON.stringify(tourConfig));
  const today = new Date("2030-04-02");

  config.toursWithDateRanges = cullToursRange(today, config);

  const searches: SailingSearch[] = parseToursRange(config);
  const expectedArray = [
    {
      fromDay: "2030-04-02",
      toDay: "2030-04-11",
      voyageCode: "BGO-BGO",
      voyageType: "NORWAY_VOYAGE",
      agreementId: "6334",
      party: "ADULT,ADULT",
      market: "UK",
    },
  ];
  assertArrayIncludes(searches, expectedArray);
});

Deno.test("Generators - Culling Range, Tour entirely in the past", () => {
  const config: TourConfig = JSON.parse(JSON.stringify(tourConfig));

  const today = new Date("2030-04-02");

  config.toursWithDateRanges = cullToursRange(today, config);

  const filtered = config.toursWithDateRanges.filter((tour) => {
    return tour.tourCode === "TOURINTHEPAST";
  });

  assertEquals(filtered.length, 0);
});

Deno.test("Generators - Culling Range, Tour entirely in the future", () => {
  const config: TourConfig = JSON.parse(JSON.stringify(tourConfig));
  const today = new Date("2030-04-02");

  config.toursWithDateRanges = cullToursRange(today, config);

  const searches: SailingSearch[] = parseToursRange(config);
  const expectedArray = [
    {
      fromDay: "2050-04-01",
      toDay: "2050-04-10",
      voyageCode: "BGO-BGO",
      voyageType: "NORWAY_VOYAGE",
      agreementId: "2345",
      party: "ADULT,ADULT",
      market: "UK",
    },
  ];
  assertArrayIncludes(searches, expectedArray);
});

Deno.test("Generators - Culling Specific dates, Tour with some dates in the past #1", () => {
  const config: TourConfig = JSON.parse(JSON.stringify(tourConfig));
  const today = new Date("2030-04-02");

  config.toursWithSpecificDates = config.toursWithSpecificDates.filter(
    (tour) => {
      return tour.tourCode === "TOURWITHDATES";
    },
  );

  const departures1 = config.toursWithSpecificDates[0].departureDates.length;
  assertEquals(departures1, 2);

  config.toursWithSpecificDates = cullToursDates(today, config);

  const departures2 = config.toursWithSpecificDates[0].departureDates.length;
  assertEquals(departures2, 1);
});

Deno.test("Generators - Culling Specific dates, Tour with some dates in the past #2", () => {
  const config: TourConfig = JSON.parse(JSON.stringify(tourConfig));
  const today = new Date("2030-04-02");

  config.toursWithSpecificDates = cullToursDates(today, config);

  const searches: SailingSearch[] = parseToursDates(config);
  const expected: SailingSearch = {
    fromDay: "2032-08-07",
    toDay: "2032-08-07",
    voyageType: "EXPLORER",
    voyageCode: "REK-REK",
    party: "ADULT,ADULT",
    market: "UK",
    agreementId: null,
  };

  assertArrayIncludes(searches, [expected]);
});

Deno.test("Generators - Culling Specific dates, Tour entirely in the past", () => {
  const config: TourConfig = JSON.parse(JSON.stringify(tourConfig));
  const today = new Date("2050-04-02");

  config.toursWithSpecificDates = cullToursDates(today, config);

  const departures = config.toursWithSpecificDates.length;
  assertEquals(departures, 0);
});

Deno.test("Generators - Culling Specific dates, Tour entirely in the future", () => {
  const config: TourConfig = JSON.parse(JSON.stringify(tourConfig));
  const today = new Date("2020-04-02");

  config.toursWithSpecificDates = config.toursWithSpecificDates.filter(
    (tour) => {
      return tour.tourCode === "TOURWITHDATES";
    },
  );

  const departures1 = config.toursWithSpecificDates[0].departureDates.length;
  assertEquals(departures1, 2);

  config.toursWithSpecificDates = cullToursDates(today, config);

  const departures2 = config.toursWithSpecificDates[0].departureDates.length;
  assertEquals(departures2, 2);
});

Deno.test("Generators - Parse Voyages #1", () => {
  const options: PopulateOptions = { voyages: true };
  const payload: string[] = generateVoyageXMLs(options, voyageConfig);

  const strippedPayload = payload.map((search) => {
    return stripString(search);
  });

  const assertXMLstring = `<GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>${
    dateFromTodayFormatted(0)
  }</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>${
    dateFromTodayFormatted(4)
  }</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>NORWAY_VOYAGE</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>BGO-BGO</Str></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>NO</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`;

  assertArrayIncludes(strippedPayload, [stripString(assertXMLstring)]);
});

Deno.test("Generators - Parse Voyages #2", () => {
  const options: PopulateOptions = { voyages: true };
  const payload: string[] = generateVoyageXMLs(options, voyageConfig);

  const strippedPayload = payload.map((search) => {
    return stripString(search);
  });

  const assertXMLstring = `<GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>${
    dateFromTodayFormatted(5)
  }</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>${
    dateFromTodayFormatted(9)
  }</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>NORWAY_VOYAGE</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>BGO-BGO</Str></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>UK</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`;

  assertArrayIncludes(strippedPayload, [stripString(assertXMLstring)]);
});

Deno.test("Generators - Parse Voyages #3", () => {
  const options: PopulateOptions = { voyages: true };
  const payload: string[] = generateVoyageXMLs(options, voyageConfig);

  const strippedPayload = payload.map((search) => {
    return stripString(search);
  });

  const assertXMLstring = `<GetAvailPrimPkgsCustom_IN>
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
      <Param><Code>DateFrom</Code><Value><Date>${
    dateFromTodayFormatted(10)
  }</Date></Value></Param>
      <Param><Code>DateTo</Code><Value><Date>${
    dateFromTodayFormatted(11)
  }</Date></Value></Param>
      <Param><Code>VoyageType</Code><Value><Str>NORWAY_VOYAGE</Str></Value></Param>
      <Param><Code>VoyageCode</Code><Value><Str>BGO-BGO</Str></Value></Param>
      <Param><Code>PartyMix</Code><Value><Str>ADULT</Str></Value><Value><Str>ADULT</Str></Value></Param>
      <Param><Code>UseShipAvailCache</Code><Value><Str>Y</Str></Value></Param>
      <Param><Code>Market</Code><Value><Str>UK</Str></Value></Param>
    </CustomParams>
    </GetAvailPrimPkgsCustom_IN>`;

  assertArrayIncludes(strippedPayload, [stripString(assertXMLstring)]);
});

Deno.test("Generators - Parse Voyages with a filter", () => {
  const filter = "BGO-KKN";
  const options: PopulateOptions = { voyages: true, voyageFilter: filter };
  const payload: string[] = generateVoyageXMLs(options, voyageConfig);

  assertEquals(payload.length, 2);
});
