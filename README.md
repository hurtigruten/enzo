# Prerequisites
* On the Seaware side, "Custom Availability Search" rules need to be in place for every search the cache application wishes to perform.
* Deno needs to be installed, check the [website](https://deno.land/)

# Usage
When running in Production (or locally on any bizlogic), a windows task scheduler job should be set up to trigger the execution of the script. 

From your favorite command line run: ```deno run -A singleRun.ts``` for a full cache refresh.

# Recommended Production settings
PS: In a Production environment it is recommended to bundle all dependencies. To do this (from powershell), add an environment flag: ```$env:DENO_DIR="./deno_cache"```;
The flag can also be added on a system level if desired using ```setx /M```

# Seaware cache documentation
Read more about the Seaware Cache [here](https://versonix.atlassian.net/wiki/spaces/PublicDocs/pages/10289154/Availability+Cache)

# TODO
* Add Allotment based Tours (need a list of allotment ids from PG for the Tour)
* PG should offer an API with what tours to cache, then the cache script uses this to decide what to cache (instead of a static file)
* Retry if requests failed?

# Future Ideas
* Write tests
* Store cache results in redis cache and build API on top?
* Build an API that offers available promotions?
* Look into Drop Cache as a new search mode
* Look into ResultModes node in the custom availability request 
* Detect if a port combination gives no results at all and log it
* Write a customDB script in Seaware to find which sailings are loaded, instead of using config (requires creating new rules if needed)