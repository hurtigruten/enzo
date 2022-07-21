import { assertEquals } from "../deps.ts";
import {
  addDaysToDate,
  dateFromTodayFormatted,
  getDatesInRangeFormatted,
  onlyUniqueStrings,
  stripString,
  timeSince,
} from "../utils.ts";
import { generateTourXMLs } from "../requests/generators.ts";
import { PopulateOptions, TourConfig } from "../types.ts";

//TODO: Switch to using test json instead of synthetic dates

Deno.test("Utils - Add days to Date #1", () => {
  const date1 = new Date("2022-05-29");
  const newDate = addDaysToDate(date1, 5);
  const expected = new Date("2022-06-03").toJSON().split("T")[0];
  const actual = newDate.toJSON().split("T")[0];
  assertEquals(actual, expected);
});

Deno.test("Utils - Add days to Date #2", () => {
  const date1 = new Date("2022-05-29");
  const newDate = addDaysToDate(date1, -5);
  const expected = new Date("2022-05-24").toJSON().split("T")[0];
  const actual = newDate.toJSON().split("T")[0];
  assertEquals(actual, expected);
});

Deno.test("Utils - Date from Today #1", () => {
  const today = new Date();
  const daysAhead = 3;
  const newDate = new Date(dateFromTodayFormatted(daysAhead));
  const diff = newDate.getDate() - today.getDate();
  assertEquals(diff, daysAhead);
});

Deno.test("Utils - Date from Today #2", () => {
  const today = new Date();
  const daysAhead = -3;
  const newDate = new Date(dateFromTodayFormatted(daysAhead));
  const diff = newDate.getDate() - today.getDate();
  assertEquals(diff, daysAhead);
});

Deno.test("Utils - Get dates in Range Formatted", () => {
  const date1 = new Date("2022-05-29T00:00:00.000Z");
  const date2 = new Date("2022-06-04T00:00:00.000Z");

  const range = getDatesInRangeFormatted(date1, date2);
  const expected = [
    "2022-05-29",
    "2022-05-30",
    "2022-05-31",
    "2022-06-01",
    "2022-06-02",
    "2022-06-03",
    "2022-06-04",
  ];
  assertEquals(range, expected);
});

Deno.test("Utils - Strip string #1", () => {
  const string1 = "   test   ";
  const stripped = stripString(string1);
  assertEquals("test", stripped);
});

Deno.test("Utils - Strip string #2", () => {
  const string1 = `<GetAvailPrimPkgsCustom_IN>
  <MsgHeader>
    <Version>1.0</Version>`;
  const stripped = stripString(string1);
  assertEquals(
    "<GetAvailPrimPkgsCustom_IN><MsgHeader><Version>1.0</Version>",
    stripped,
  );
});

Deno.test("Utils - Time since", () => {
  const date1 = new Date("2022-05-05T12:11:54.284Z");
  const date2 = new Date("2022-05-05T14:16:58.284Z");

  const timeStamp = timeSince(date1, date2);
  const expectedTimestamp = "02:05:04";

  assertEquals<string>(timeStamp, expectedTimestamp);
});

Deno.test("Utils - Only unique searches", () => {
  const tourConfig: TourConfig = JSON.parse(
    Deno.readTextFileSync("./tourAPI.json"),
  ) as TourConfig;
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

  const filteredPayload = strippedPayload.filter((payload) => {
    return payload === stripString(expectedXML);
  });
  const uniquePayloads = onlyUniqueStrings(filteredPayload);

  assertEquals(filteredPayload.length, 2);
  assertEquals(uniquePayloads.length, 1);
});
