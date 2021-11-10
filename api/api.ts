import { parse, listenAndServe } from "../deps.ts";

const args = parse(Deno.args, {
  default: {
    config: "../configs/fullCache.json"
  },
});

listenAndServe(":3000", () => new Response(Deno.readTextFileSync(args.config)));