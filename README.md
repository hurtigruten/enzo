# The Seaware cache application
The Seaware cache application, hosted [here](https://bitbucket.org/hurtigruteninternal/bizlogic_cache/) is responsible for caching Seaware sailings (availability and price breakdown)

The application is basically a collection of javascript files that are run (using Windows Task Scheduler and a collection of .bat files) that fires off a large number of XMLHTTPServer requests at the local Bizlogic instance, forcing it to cache the searches for later retrieval by PG. 
A full run is executed every night, typically taking 4-5 hours and then a partial run is executed 3-4 times per day on popular sailings (or sailings close to departure) to ensure as up to date cache as possible (a brute force cache will inherintly always struggle to keep up to date,
but this can be mitigated somewhat by forcing a refresh if no data is found).

On the Seaware side, Custom Availability Search rules need to be in place for every search the cache application wishes to perform. The Loading team has been quick to create the rules whenever we have a new season with new port combinations - but at some point it would be great to
create the rules programatically.

PG in turn uses one xlsx file to keep track of what is being cached and another xlsx file to keep track of sailing direction (as port combinations along the Norwegian coast can be North, South and North-South). Xlsx files are naturally not the optimal solution as they cab have hidden
bugs, are manually updated and rely on a spreadsheet parser. Combined with the manual Seaware rule setup this makes for somewhat of a maintenance nightmare as a new sailing typically needs to be added in 10 different javascript files, added as a Seaware rule and then 5-6 new rows
in the xlsx files.

PG currently uses the cache only for Booking Domain API searches, as the PG Client only allows for max 5 day searches (sacrificing performance, but gaining accuracy)

The existing app that was written around 2011 - 2013 by developers in Hurtigruten Estonia in corporation with E-Developers (Versonix contractor). The initial version had hard codings that needed regulat maintenance, it was very slow and only cached a small dataset.
In 2015 it was it was extended and optimized by an Estionian developer and myself as part of the DLP 1 project. The worst hard codings were removed, the performance was multiplied tenfolds but the structural problems was not fixed.

The application has not aged well, it consists of a main 600 line JScript (COM Classic) file that utilizes *Msxml2.XMLHTTP.3.0* loaded as an ActiveXObject to make the requests to Bizlogic and WScript to talk to the OS. 
This main script is controlled by ca 25 javascript files (who composes XML requests using string concatination, yuck). Finally, 13 bat files use cscript to execute the javascript on the server. 
The bat files, in turn, is triggered by Windows Task Scheduler. Given this old stack, it's likely the whole thing breaks on the next OS upgrade, or if someone sneezes :p

# The goal of sea-deno
I decided to write a new application from scratch in Typescript using Deno. My (selfish) goal was to have some fun and learn new things, but the main purpose of the rewrite is to make it a more *maintainable* and *modern* application compared to the old one. 

Some nice side effects include *faster* execution time and *safer* operation.

Running javascript server side spells Node in capital letters, but I decided to go for Deno for it's effortless Typescript support and because node_modules is plain ugly.
As of writing this, Deno has not reached 1.0 yet. Should Deno turn flop like Dart or Apple Maps, the source code is minimal and can very easily be executed using Node. 
With Deno we get a fast, secure and modern stack with great tooling out of the box.

In the future we could look at building new capabilities into the application such as middleware to offer APIs, dynamically produce the custom search rules in Seaware, a cache to store results locally and maybe even introducing new Seaware API calls.

# Prerequisites
Deno needs to be installed, check the [website](https://deno.land/)

# Usage

Scheduling is done by..

From your favorite command line run: 
```
deno --allow-net mod.ts
```

# TODO / Future Ideas

* ~~Initial PoC~~
* ~~Simulate loads to find optimal saturation~~
* ~~Write better Readme~~
* Introduce all searches from old app
* Introduce defaultDaysAhead and mixin
* Introduce runOften? to support Full and Partial runs
* Implement logging
* Break on error?
* Mechanism for stopping a run?
* Use denon?
* Use DotEnv?
* Consider scheduling, cron or windows task scheduler?
* Check old script for any missing functionality
* Implement DevMode
* Implement API to serve what is cached
* Store cache results in redis cache and build API on top?
* Any way to build the cache more dynamically, instead of forcing a complete run?
* Build an API that offers available promotions?
* Write tests