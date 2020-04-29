import * as log from "https://deno.land/std/log/mod.ts";

// custom configuration with 2 loggers (the default and `tasks` loggers)
await log.setup({
  handlers: {
    // Set log level of console
    console: new log.handlers.ConsoleHandler("DEBUG"),

    // Set log level of log file
    file: new log.handlers.FileHandler("WARNING", {
      filename: "./log.txt",
      // you can change format of output message using any keys in `LogRecord` Add timestamp
      formatter: "[{levelName}] {msg}", // How do I get new line? \n does not work. Also add readable timestamp
    }),
  },

  loggers: {
    // configure default logger available via short-hand methods above
    default: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },

    tasks: {
      level: "ERROR",
      handlers: ["console"],
    },
  },
});

let logger;

// get default logger
logger = log.getLogger();
logger.debug("deb"); // logs to `console`, because `file` handler requires "WARNING" level
logger.warning("warn"); // logs to both `console` and `file` handlers
logger.error("err");