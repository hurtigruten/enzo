import { parse, serve } from "../deps.ts";

const args = parse(Deno.args, {
  default: {
    config: "../configs/fullCache.json"
  },
});

serve((_req) => new Response(Deno.readTextFileSync(args.config)), { addr: ":3000" });