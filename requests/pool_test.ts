import { assertStringIncludes } from "../deps.ts";
import { PopulateOptions, TourConfig } from "../types.ts";
import { generateTourXMLs } from "./generators.ts";
import { pool, postRequest } from "./pool.ts";

Deno.test("Pool - Post Request, fetch error", async () => {
  const output = await postRequest("test", "http://localhost:3000");
  assertStringIncludes(output, "Fetch Error");
});

Deno.test("Pool - Pool, fetch error", async () => {
  const tourConfig: TourConfig = JSON.parse(
    Deno.readTextFileSync("../testdata/tourAPI.json"),
  ) as TourConfig;
  const options: PopulateOptions = { tours: true, ignoreTourDates: false };
  const payload: string[] = generateTourXMLs(tourConfig, options);
  const samplePayload: string[] = [payload[0]];
  const output = await pool(samplePayload, "http://localhost:3000");
  const outputString = output.toString();
  assertStringIncludes(outputString, "Fetch Error");
});
