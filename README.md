# The Seaware cache application
The Seaware cache application, hosted [here](https://bitbucket.org/hurtigruteninternal/bizlogic_cache/) has been responsible for caching Seaware sailings (availability and price breakdown) since 2012

The application is basically a collection of javascript files that are run (using Windows Task Scheduler and a collection of .bat files) that fires off a large number of XMLHTTPServer requests at the local Bizlogic instance, forcing it to cache the searches for later retrieval by PG. A full run is executed every night, typically taking 4-5 hours and then a partial run is executed 3-4 times per day on popular sailings (or sailings close to departure) to ensure as up to date cache as possible (a brute force cache will inherently always struggle to keep up to date, but this can be mitigated somewhat by forcing a refresh if no data is found).

On the Seaware side, Custom Availability Search rules need to be in place for every search the cache application wishes to perform. The Loading team has been quick to create the rules whenever we have a new season with new port combinations - but at some point, it would be great to create the rules programmatically.

PG, in turn, uses one xlsx file to keep track of what is being cached and another xlsx file to keep track of sailing direction (as port combinations along the Norwegian coast can be North, South, and North-South). Xlsx files are naturally not the optimal solution as they can have hidden bugs, are manually updated, and rely on a spreadsheet parser. Combined with the manual Seaware rule setup this makes for somewhat of a maintenance nightmare as a new sailing typically needs to be added in 10 different javascript files, added as a Seaware rule and then 5-6 new rows in the xlsx files.

PG currently uses the cache only for Booking Domain API searches, as the PG Client only allows for max 5-day searches (sacrificing performance but gaining accuracy)

The existing app that was written around 2012 - 2013 by developers in Hurtigruten Estonia in cooperation with E-Developers (Versonix contractor). The initial version had hard codings that needed regular maintenance, it was very slow and only cached a small dataset. In 2015 it was extended and optimized as part of the DLP 1 project. The worst hard codings were removed, the performance was multiplied tenfolds but the structural problems were not fixed. In 2017 we removed the complex 2 cache server setup (two Bizlogic servers cached separate datasets and copied over the results to be read in by the other server. Meant to be a failover solution, but effectively 2 places it could break).

The application has not aged well, it consists of the main script file of ca 600 lines of **JScript (COM Classic)** that utilizes **Msxml2.XMLHTTP.3.0** to make the XML requests to Bizlogic and **WScript** to talk to the OS. This main script is controlled by ca 25 javascript files. Finally, 13 bat files use cscript to execute the javascript on the server. The bat files, in turn, is executed on a schedule defined by Windows Task Scheduler triggers. Given this old stack, it's likely the whole thing breaks on the next OS upgrade, or if someone sneezes.

Read more about the Seaware Cache [here](https://versonix.atlassian.net/wiki/spaces/PublicDocs/pages/10289154/Availability+Cache)

# The goal of sea-deno
I decided to write a new application from scratch in **Typescript** using **Fetch** and **Deno**. My (selfish) goal was to have some fun and learn new things, but the main purpose of the rewrite is to make it more **maintainable** (way less code, easier to add sailings, easier to extend.) and more **modern** (not relying on deprecated/unsupported components, using the latest and greatest server-side javascript execution) application compared to the old one. 

Some nice side effects include **faster** execution (mainly due to an asynchronous request pool saturating Bizlogic more effectiviely), **safer** operation (provided by Deno's security model, and the compiled Typescript) increased **portability** (can be run on Mac, Linux, and Windows).

Running javascript server-side spells Node.js in capital letters, but I decided to go for Deno for its built-in Typescript support, security model, and because node_modules is plain ugly. Should Deno flop like Dart or Apple Maps, the source code is minimal and can very easily be executed using Node.

In the future, we could look at building new capabilities into the application such as middleware to offer APIs, dynamically produce the custom search rules in Seaware, a cache to store results locally, and maybe even introducing new Seaware API calls.

# Prerequisites
Deno needs to be installed, check the [website](https://deno.land/)

# Usage

When running in Production (or locally on any bizlogic), a windows task scheduler job should be set up to trigger the execution of the script. When running from you local machine, you need remote access to the server (be in the HRG network or use vpn from home)

The following flags are available: 
* **--config** (Optional and defaults to "./cacheConfig.json", can be set to "./cacheConfigPartial.json" for caching the smaller data set)
* **--host** (Optional and defaults to "remote", can be set to "local". Determines where Bizlogic is available, localhost should be used in Production)

From your favorite command line run: ```deno run --allow-read --allow-net singleRun.ts --config "./samples/sampleCacheConfig.json"```

PS: In a Production environment it is recommended to bundle all dependencies. Todo this (from powershell), add an environment flag: ```$env:DENO_DIR="./deno_cache"```;
The flag can also be added on a system level if desired using ```setx /M```

# TODO

* Add port combos from summer
* Production deployment
* PG needs to start using the new config
* Move from Windows Task scheduler to Cron
* Retry if requests failed? (after wait?)
* Add option to cache single sailing
* Build a deploy pipeline

# Long term tasks / Future Ideas
* Write tests
* Use denon?
* Implement API to serve what is cached
* Store cache results in redis cache and build API on top?
* Build an API that offers available promotions?
* Look into Drop Cache as a new search mode
* Look into ResultModes node in the custom availability request 
* Any way to build the cache more dynamically, instead of forcing a complete run? Perhaps by storing search results from b2c/b2b
* Detect if a port combination gives no results at all and log it
* Write a customDB script in Seaware to find which sailings are loaded, instead of using config (requires creating new rules if needed)