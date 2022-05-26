# enzo

Enzo is a zero dependency ES module that can be used for populating (or reading)
a Seaware Bizlogic Cache. It does so by reading sailings defined in a config
file, or through an API - and then creating an asyncronous pool of XML requests
that are posted to Bizlogic in a throttled manner. This ensures that the CPU
threads are fully saturated, leading to optimal caching.

# Prerequisites

Deno needs to be installed, check the [website](https://deno.land/).

On the Seaware side, "Custom Availability Search" rules need to be in place for
every search the cache application wishes to perform

# Consuming Config

"./configs/voyage.ts" is the config that should be updated whenever there are
new voyage sailings.

# API

A Tour API can be read when the sailings are defined by an external system

# Seaware cache documentation

Read more about the Seaware Cache
[here](https://versonix.atlassian.net/wiki/spaces/PublicDocs/pages/10289154/Availability+Cache)
