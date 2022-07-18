# enzo

Enzo is a zero dependency ES module that can be used for populating (or reading)
a Seaware Bizlogic Cache. It does so by reading sailings defined in a config
file, or through an API - and then creating an asyncronous pool of XML requests
that are posted to Bizlogic in a throttled manner. This ensures that the CPU
threads are fully saturated, leading to optimal caching.

# Prerequisites

This module is meant to be used by a script, Slack bot, etc. that need to cache
price and availability in Seaware and needs the following:

- Deno needs to be installed, check the [website](https://deno.land/).

- In Seaware, "Custom Availability Search" rules need to be in place for every
  search the cache application wishes to perform (that means that any potential
  new port combination needs to be added to these rules). In addition, any
  Search scenario XMLs needs to be set up (such as OneWaySearchScenario.xml),
  these translate the search criteria into "Seaware lingo" and can be expanded
  to alow loyalty specific prices, B2B specific prices, Promotion based prices,
  etc.

# Consuming Config

The module can cache based on a file. Currently "./configs/voyage.ts" is the
config that should be updated whenever there is a need to add or change the
voyage only sailings.

# API

The module can cache based on an API. The API must currently implement the Type
as defined in "./types.ts"

# Seaware cache documentation

Read more about the Seaware Cache
[here](https://versonix.atlassian.net/wiki/spaces/PublicDocs/pages/10289154/Availability+Cache)
