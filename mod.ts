import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser } from './ConfigParser.ts';

const configParser = new ConfigParser();
const payload = configParser.parseConfig();

const cacheLoader = new CacheLoader(payload, true);
await cacheLoader.load()
