# enzo

Enzo is a zero dependency ES module that can be used for populating (or reading)
a Seaware Bizlogic Cache. It does so by reading sailings defined in a config
file, or through an API - and then creating an asyncronous pool of XML requests
that are posted to Bizlogic in a throttled manner. This ensures that the CPU
threads are fully saturated, leading to optimal caching.

# Prerequisites

This module is meant to be used by a script, Slack bot, etc. that need to cache
price and availability in Seaware and needs the following:

- Deno needs to be installed locally and on the Bizlogic Server, check the [website](https://deno.land/).

- Recommend using VS Code + the Deno extension for developing locally.

- In Seaware, "Custom Availability Search" rules need to be in place for every
  search the cache application wishes to perform (that means that any potential
  new port combination needs to be added to these rules). In addition, any
  Search scenario XMLs needs to be set up (such as OneWaySearchScenario.xml),
  these translate the search criteria into "Seaware lingo" and can be expanded
  to alow loyalty specific prices, B2B specific prices, Promotion based prices,
  etc.

# Consuming Config from a file

Enzo can cache based on a file. Currently "./configs/voyage.ts" is used to cache
voyage only sailings. If you need to add or change the way these sailings are
cached, this file should be modified.

# Consuming Config from an API

Enzo can cache based on an API. The API must implement the Config type as
defined in "./types.ts"

# Testing

All tests follow the name convention of filename_test.ts. To execute all
tests, execute:

`deno test -A`

... within the root folder (or in a subfolder containing tests)

# Seaware cache documentation

Read more about the Seaware Cache
[here](https://versonix.atlassian.net/wiki/spaces/PublicDocs/pages/10289154/Availability+Cache)
