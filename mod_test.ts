import { assertEquals } from "./deps.ts";
import { requestRunner } from "./mod.ts";
import { EnvironmentConfig } from "./types.ts";

Deno.test("Mod - Empty runner", async () => {
  const envConfig: EnvironmentConfig = {
    tourAPI: "",
    bizlogicAPI: "",
  };
  const runner = await requestRunner({}, envConfig);
  assertEquals(runner, undefined);
});

Deno.test("Mod - Request at localhost ", async () => {
  const envConfig: EnvironmentConfig = {
    tourAPI: "",
    bizlogicAPI: "http://localhost:3000",
  };
  const popOptions = {
    tours: false,
    tourFilter: ``,
    voyages: true,
    voyageFilter: ``,
    readMode: false,
    ignoreTourDates: true,
    bufferTourDates: false,
    bufferSize: 0,
    broadcastMessage: ``,
  };
  const runner = await requestRunner(popOptions, envConfig);
  assertEquals(runner, undefined);
});
