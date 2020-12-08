import type { Context } from "../deps.ts";
import type { CacheConfig, Sailing } from "../types.ts";
import { v4, parse } from "../deps.ts";

// Read arguments. Config is used to determine a full or partial run, host determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    config: "../configs/fullCache.json"
  },
});

const config: CacheConfig = JSON.parse(Deno.readTextFileSync(args.config));
let sailings: Sailing[] = config.sailings;

export const getCacheConfig = (c: Context) => {
  return c.json(config, 200);
};

export const getAllSailings = (c: Context) => {
  const { fromPort, toPort } = c.queryParams;
  let result = sailings;
  fromPort ? result = result.filter((s: Sailing) => s.fromPort === fromPort) : result;
  toPort ? result = result.filter((s: Sailing) => s.toPort === toPort) : result;
  return c.json(result, 200);
};

export const getSailing = (c: Context) => {
  const { id } = c.params;
  const sailing = sailings.find((s: Sailing) => s.id === id);
  if (sailing) {
    return c.json(sailing, 200);
  }
  return c.string("No sailing found", 404);
};

export const createSailing = async (c: Context) => {
  const { voyageType, direction, fromPort, toPort, daysAhead, partyMixes, marketFilter } = await c.body as Sailing;
  // TODO: validate data & types of the data
  const id = v4.generate();
  const added = new Date();
  const sailing: Sailing = { id, voyageType, direction, fromPort, toPort, daysAhead, partyMixes, marketFilter, added };
  sailings.push(sailing);
  // TODO: Persist new sailing - see sea-oak
  //return c.json(sailing, 201);
  return c.string("Not implemented", 200)
};

export const deleteSailing = (c: Context) => {
  const { id } = c.params;
  const sailing = sailings.find((s: Sailing) => s.id === id);

  if (sailing) {
    sailings = sailings.filter((s: Sailing) => s.id !== id);
    return c.json(sailing, 200);
  }

  //return c.string('No sailing with that id', 404)
  return c.string("Not implemented", 200)
};