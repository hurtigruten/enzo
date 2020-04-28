import { buildXMLBody } from "./xmlSerializer.ts";
import { CacheLoader } from "./cacheLoader.ts";
import { produceJsonSearches } from './jsonParser.ts';
import Ports from "./samples/samplePorts.json"
//import Ports from "./ports.json";

export interface JsonSearch {
  fromDay: string, 
  toDay: string;
  voyageType: string;
  voyageCode: string;
  party: string;
  market: string
}

const jsonSearches: JsonSearch[] = produceJsonSearches(Ports.sailings, Ports.searchDayRange, Ports.allMarkets);

const searches: string[] = jsonSearches.map((search: JsonSearch) => buildXMLBody(search))

const cacheLoader = new CacheLoader(searches, true);

await cacheLoader.load()
